import { z } from "zod";

export const actionTypeSchema = z.enum([
  "SWAP",
  "SUPPLY",
  "WITHDRAW",
  "REDEEM",
]);

export const riskLevelSchema = z.enum(["low", "medium", "high"]);

export const strategyStepSchema = z.object({
  action: actionTypeSchema,
  // For SWAP actions, outputToken is required.
  outputToken: z.string().nullable(),
  // For SUPPLY/BORROW/WITHDRAW/REDEEM, marketToken (e.g. vToken) is required.
  marketToken: z.string().nullable(),
  // Optional human readable description of the step.
  label: z.string().nullable(),
});

export const strategyFromAiSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().min(1),
  riskLevel: riskLevelSchema,
  inputToken: z.string().min(1),
  steps: z.array(strategyStepSchema).min(1).max(10),
});

export type StrategyFromAi = z.infer<typeof strategyFromAiSchema>;
export type StrategyStepFromAi = z.infer<typeof strategyStepSchema>;
