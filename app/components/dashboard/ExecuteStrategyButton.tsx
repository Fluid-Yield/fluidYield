"use client";

import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { nirContracts } from "@/lib/contracts";
import { erc20Abi } from "@/lib/erc20-abi";
import { useTokenDecimals } from "@/lib/useTokenDecimals";
import { useToast } from "@/components/ui/toast-provider";

interface ExecuteStrategyButtonProps {
  strategyId: number;
  inputToken: string;
  disabled?: boolean;
}

type SlippageOption = "LOW" | "MEDIUM" | "HIGH";

export function ExecuteStrategyButton({
  strategyId,
  inputToken,
  disabled,
}: ExecuteStrategyButtonProps) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const { decimals } = useTokenDecimals(inputToken as `0x${string}`);

  const {
    data: rawPosition,
    refetch: refetchPosition,
    isLoading: positionLoading,
  } = useReadContract({
    abi: nirContracts.strategyVault.abi,
    address: nirContracts.strategyVault.address,
    functionName: "getUserPosition",
    args: address ? [address, BigInt(strategyId)] : undefined,
    query: {
      enabled: !!address,
    },
  });

  type PositionTuple = readonly [string, bigint, bigint];
  const position = rawPosition as PositionTuple | undefined;
  const positionToken = position?.[0];
  const positionAmount = position?.[1] ?? BigInt(0);
  const hasPosition = positionAmount > BigInt(0);

  const [amountInput, setAmountInput] = useState("0.1");
  const [slippage, setSlippage] = useState<SlippageOption>("MEDIUM");
  const [joining, setJoining] = useState(false);
  const [exiting, setExiting] = useState(false);
  const { toast } = useToast();

  const handleJoin = async () => {
    if (disabled) return;

    if (!isConnected || !address) {
      toast({
        description:
          "Connect your wallet on BNB testnet to join this strategy.",
        variant: "error",
      });
      return;
    }

    if (hasPosition) {
      toast({
        description: "You already have an open position in this strategy.",
        variant: "error",
      });
      return;
    }

    const value = amountInput.trim();

    if (!value || Number(value) <= 0) {
      toast({
        description: "Enter a valid amount to invest.",
        variant: "error",
      });
      return;
    }

    let amount: bigint;

    try {
      amount = parseUnits(value, decimals);
    } catch {
      toast({ description: "Invalid amount format.", variant: "error" });
      return;
    }

    const slippageValue = slippage === "LOW" ? 0 : slippage === "HIGH" ? 2 : 1;

    setJoining(true);

    try {
      const approveHash = await writeContractAsync({
        abi: erc20Abi,
        address: inputToken as `0x${string}`,
        functionName: "approve",
        args: [nirContracts.strategyVault.address, amount],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const executeHash = await writeContractAsync({
        abi: nirContracts.strategyVault.abi,
        address: nirContracts.strategyVault.address,
        functionName: "executeStrategy",
        args: [BigInt(strategyId), amount, slippageValue],
      });

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: executeHash,
        });
        console.log("[receipt]: ", receipt);
        if (receipt.status === "success") {
          await refetchPosition();
          toast({
            title: "Joined strategy",
            description: "Join transaction confirmed.",
            variant: "success",
          });
        } else {
          toast({
            description: "Join transaction failed.",
            variant: "error",
          });
        }
      }
    } catch {
      toast({
        description:
          "Failed to join strategy. Check your wallet and try again.",
        variant: "error",
      });
    } finally {
      setJoining(false);
    }
  };

  const handleExit = async () => {
    if (!isConnected || !address) {
      toast({
        description:
          "Connect your wallet on BNB testnet to exit this strategy.",
        variant: "error",
      });
      return;
    }

    if (!hasPosition) {
      toast({
        description: "You do not have an open position in this strategy.",
        variant: "error",
      });
      return;
    }

    setExiting(true);

    try {
      const exitHash = await writeContractAsync({
        abi: nirContracts.strategyVault.abi,
        address: nirContracts.strategyVault.address,
        functionName: "exitStrategy",
        args: [BigInt(strategyId)],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: exitHash });
      }

      await refetchPosition();

      toast({
        title: "Exited strategy",
        description: "Exit transaction confirmed.",
        variant: "success",
      });
    } catch {
      toast({
        description:
          "Failed to exit strategy. Check your wallet and try again.",
        variant: "error",
      });
    } finally {
      setExiting(false);
    }
  };

  const formattedPositionAmount =
    hasPosition && !positionLoading
      ? formatUnits(positionAmount, decimals)
      : null;

  const joinDisabled =
    disabled || joining || exiting || isPending || positionLoading;
  const exitDisabled = joining || exiting || isPending || positionLoading;

  return (
    <div className="flex flex-col items-stretch gap-3 w-full sm:w-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-1 w-full sm:w-40">
          <label className="text-[11px] sm:text-[12px] text-[#ADBEBF]">
            Amount
          </label>
          <input
            type="text"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            className="w-full rounded-md border border-[#EDFCFE0F] bg-[#070B0B] px-3 py-2 text-[13px] sm:text-[14px] text-[#F2F4F5] outline-none focus:border-[#1FE9F7]"
            placeholder="0.0"
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-40">
          <label className="text-[11px] sm:text-[12px] text-[#ADBEBF]">
            Slippage
          </label>
          <select
            value={slippage}
            onChange={(e) => setSlippage(e.target.value as SlippageOption)}
            className="w-full rounded-md border border-[#EDFCFE0F] bg-[#070B0B] px-3 py-2 text-[13px] sm:text-[14px] text-[#F2F4F5] outline-none focus:border-[#1FE9F7]"
          >
            <option value="LOW">Low (0.5%)</option>
            <option value="MEDIUM">Medium (1%)</option>
            <option value="HIGH">High (3%)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="bg-[#1FE9F7] text-[#090909] px-6 sm:px-12 py-4 sm:py-5 rounded-md border-none outline-none hover:bg-[#1FE9F7]/80 cursor-pointer text-sm sm:text-base w-full sm:w-auto"
          onClick={handleJoin}
          disabled={joinDisabled}
        >
          {joining || isPending ? "Joining..." : "Join Strategy"}
        </Button>

        {hasPosition && (
          <Button
            type="button"
            variant="outline"
            className="px-6 sm:px-8 py-4 sm:py-5 rounded-md border border-[#EDFCFE0F] bg-[#070B0B] text-[13px] sm:text-[14px] text-[#F2F4F5] hover:bg-[#070B0B]/80 cursor-pointer w-full sm:w-auto"
            onClick={handleExit}
            disabled={exitDisabled}
          >
            {exiting ? "Exiting..." : "Exit Strategy"}
          </Button>
        )}
      </div>

      {address && (
        <div className="text-[11px] sm:text-[12px] text-[#ADBEBF]">
          {positionLoading ? (
            "Loading current position..."
          ) : hasPosition && formattedPositionAmount && positionToken ? (
            <>
              Current position: {formattedPositionAmount} at
              <span className="ml-1 font-mono text-xs">
                {positionToken.slice(0, 6)}...{positionToken.slice(-4)}
              </span>
            </>
          ) : (
            "No open position in this strategy."
          )}
        </div>
      )}
    </div>
  );
}
