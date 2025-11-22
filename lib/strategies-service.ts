"use server";

import { createPublicClient, http } from "viem";
import { inArray, eq } from "drizzle-orm";

import { fyChain, fyRpcUrl } from "./chain";
import { fyContracts } from "./contracts";
import { StrategyCardProps } from "../app/types/strategy-types";
import { db, strategies, wallets } from "@/db/client";
import { strategyFromAiSchema, type StrategyFromAi } from "./strategy-model";

const client = createPublicClient({
  chain: fyChain,
  transport: http(fyRpcUrl),
});

export interface StrategyOverview {
  id: number;
  name: string;
  curator: string;
  inputToken: string;
  active: boolean;
  stepCount: number;
  ai?: {
    description: string | null;
    summary: string | null;
    riskLevel: string | null;
  } | null;
}

export async function getAllStrategiesWithAi(): Promise<StrategyOverview[]> {
  const activeIds = (await client.readContract({
    abi: fyContracts.strategyVault.abi,
    address: fyContracts.strategyVault.address,
    functionName: "getActiveStrategies",
  })) as readonly bigint[];

  if (!activeIds.length) return [];

  const onchain = await Promise.all(
    activeIds.map(async (idBn) => {
      const [name, curator, inputToken, active, stepCount] =
        (await client.readContract({
          abi: fyContracts.strategyVault.abi,
          address: fyContracts.strategyVault.address,
          functionName: "getStrategy",
          args: [idBn],
        })) as [string, string, string, boolean, bigint];

      return {
        id: Number(idBn),
        name,
        curator,
        inputToken,
        active,
        stepCount: Number(stepCount),
      } satisfies StrategyOverview;
    })
  );

  const vaultIds = onchain.map((s) => s.id);

  if (!vaultIds.length) return onchain;

  const aiRows = await db
    .select()
    .from(strategies)
    .where(inArray(strategies.vaultStrategyId, vaultIds));

  const byVaultId = new Map<number, (typeof aiRows)[number]>();

  for (const row of aiRows) {
    if (row.vaultStrategyId == null) continue;
    if (!byVaultId.has(row.vaultStrategyId)) {
      byVaultId.set(row.vaultStrategyId, row);
    }
  }

  return onchain.map((s) => {
    const meta = byVaultId.get(s.id);
    return {
      ...s,
      ai: meta
        ? {
            description: meta.description,
            summary: meta.summary,
            riskLevel: meta.riskLevel,
          }
        : null,
    } satisfies StrategyOverview;
  });
}

export async function getUserStrategiesByUserId(userId: string | null) {
  if (!userId)
    return {
      created: [] as StrategyOverview[],
      joined: [] as StrategyOverview[],
    };

  const walletRows = await db
    .select({ address: wallets.address })
    .from(wallets)
    .where(eq(wallets.userId, userId));

  if (!walletRows.length) {
    return {
      created: [] as StrategyOverview[],
      joined: [] as StrategyOverview[],
    };
  }

  const all = await getAllStrategiesWithAi();

  const addresses = walletRows
    .map((w) => w.address)
    .filter((a): a is `0x${string}` => !!a) as `0x${string}`[];

  const createdIdSet = new Set<number>();

  for (const addr of addresses) {
    const ids = (await client.readContract({
      abi: fyContracts.strategyVault.abi,
      address: fyContracts.strategyVault.address,
      functionName: "getStrategiesByCurator",
      args: [addr],
    })) as readonly bigint[];

    ids.forEach((idBn) => createdIdSet.add(Number(idBn)));
  }

  const created = all.filter((s) => createdIdSet.has(s.id));

  const activeIds = (await client.readContract({
    abi: fyContracts.strategyVault.abi,
    address: fyContracts.strategyVault.address,
    functionName: "getActiveStrategies",
  })) as readonly bigint[];

  const joinedIdSet = new Set<number>();

  for (const addr of addresses) {
    for (const idBn of activeIds) {
      const [, amount] = (await client.readContract({
        abi: fyContracts.strategyVault.abi,
        address: fyContracts.strategyVault.address,
        functionName: "getUserPosition",
        args: [addr, idBn],
      })) as [string, bigint, bigint];

      if (amount > BigInt(0)) {
        joinedIdSet.add(Number(idBn));
      }
    }
  }

  const joined = all.filter((s) => joinedIdSet.has(s.id));

  return { created, joined };
}

export async function toStrategyCardProps(
  s: StrategyOverview
): Promise<StrategyCardProps> {
  const ai = s.ai;
  const description =
    ai?.summary ||
    ai?.description ||
    "On-chain strategy created in the Nir vault.";

  const risk = ai?.riskLevel
    ? ai.riskLevel.charAt(0).toUpperCase() + ai.riskLevel.slice(1)
    : "Unknown";

  const creatorShort = `${s.curator.slice(0, 6)}...${s.curator.slice(-4)}`;

  return {
    title: s.name,
    type: ai ? "AI Strategy" : "On-chain Strategy",
    creator: creatorShort,
    description,
    performance: "N/A",
    risk,
    href: `/dashboard/strategies/${s.id}`,
  };
}

export interface StrategyDetail {
  overview: StrategyOverview;
  ai?: StrategyFromAi | null;
}

export async function getStrategyDetail(
  id: number
): Promise<StrategyDetail | null> {
  const all = await getAllStrategiesWithAi();
  const base = all.find((s) => s.id === id);

  if (!base) return null;

  const rows = await db
    .select()
    .from(strategies)
    .where(eq(strategies.vaultStrategyId, id))
    .limit(1);

  const row = rows[0];

  if (!row?.aiResponse) {
    return { overview: base, ai: null };
  }

  let parsed: StrategyFromAi | null = null;

  try {
    const json = JSON.parse(row.aiResponse);
    let result = strategyFromAiSchema.safeParse(json);

    if (!result.success) {
      const baseJson = json as { steps?: unknown } | null;
      const normalized =
        baseJson && typeof baseJson === "object"
          ? {
              ...baseJson,
              steps: Array.isArray(baseJson.steps)
                ? baseJson.steps.map((step) => {
                    const s = step as {
                      outputToken?: string | null;
                      marketToken?: string | null;
                      label?: string | null;
                      [key: string]: unknown;
                    };
                    return {
                      ...s,
                      outputToken: s.outputToken ?? null,
                      marketToken: s.marketToken ?? null,
                      label: s.label ?? null,
                    };
                  })
                : [],
            }
          : json;

      result = strategyFromAiSchema.safeParse(normalized);
    }

    if (result.success) {
      parsed = result.data;
    }
  } catch {
    parsed = null;
  }

  return { overview: base, ai: parsed };
}
