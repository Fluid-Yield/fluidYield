import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBalance(balance: string | undefined | number) {
  if (!balance) return "0.00";
  return Number(balance).toFixed(5);
}

export function riskColor(risk: string | undefined) {
  if (risk === "Low") return "text-[#34C759]";
  if (risk === "Medium") return "text-[#FCD34D]";
  if (risk === "High") return "text-[#DC2626]";
  return "text-[#79AFB3]";
}
