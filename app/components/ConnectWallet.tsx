"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { SIGN_IN_MESSAGE } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { formatBalance } from "@/lib/utils";

export const glowPillClasses =
  "relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#1FE9F759] px-10 py-3 text-[16px] font-medium tracking-[0.01em] text-[#1FE9F7] transition-all duration-200 ease-out select-none bg-[#050607] [background-image:radial-gradient(85%_65%_at_5%_0%,rgba(31,233,247,0.5),rgba(31,233,247,0.12)_55%,transparent_75%),linear-gradient(180deg,rgba(7,24,28,0.9)_0%,rgba(5,6,7,0.95)_40%,rgba(5,6,7,1)_100%)] shadow-[inset_0_0_14px_rgba(31,233,247,0.14)] hover:shadow-[inset_0_0_18px_rgba(31,233,247,0.22)] hover:text-[#68f5ff] hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1FE9F7CC] cursor-pointer";

export const glowPillOverlayClasses =
  "pointer-events-none absolute inset-[2px] rounded-full [background:linear-gradient(180deg,rgba(0,0,0,0.35),rgba(31,233,247,0.05)_45%,rgba(31,233,247,0.01)_75%,rgba(0,0,0,0.35))]";

export const glowPillLabelClasses = "relative z-10";

// Dark grey button style matching the design
const darkButtonClasses =
  "flex items-center px-1.5 sm:px-4 py-2 rounded-tr-lg! rounded-br-lg! rounded-lg sm:rounded-none bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#252525] transition-colors cursor-pointer border-none outline-none";

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    if (!isConnected || !address || hasSigned) return;

    const run = async () => {
      try {
        const signature = await signMessageAsync({ message: SIGN_IN_MESSAGE });
        await fetch("/api/auth/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature }),
        });
        setHasSigned(true);
      } catch {
        // ignore errors for now; user can retry by reconnecting
      }
    };

    run();
  }, [address, hasSigned, isConnected, signMessageAsync]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={glowPillClasses}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={darkButtonClasses}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3 font-bold">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={`${darkButtonClasses} rounded-sm!`}
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-6 h-6 rounded-full overflow-hidden"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className="w-6 h-6"
                          />
                        )}
                      </div>
                    )}
                    <span className="font-bold ml-2 text-base hidden md:block">
                      {chain.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>

                  <div className="flex items-center gap-0">
                    <div
                      className={`${darkButtonClasses.replace(
                        "cursor-pointer",
                        "cursor-default"
                      )} text-base! font-bold! rounded-tl-lg! rounded-bl-lg! rounded-tr-none! rounded-br-none! hidden md:block`}
                    >
                      {formatBalance(account?.balanceFormatted) || "0.00"}{" "}
                      {account?.balanceSymbol || "ETH"}
                    </div>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className={`${darkButtonClasses} bg-[#393a3e]! gap-1 sm:gap-2`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            account.ensAvatar == undefined
                              ? "/avatar.png"
                              : account.ensAvatar
                          }
                          alt={account.displayName}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="text-base font-bold">
                        {account.displayName}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
