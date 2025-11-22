"use client";

import { Flame, Shield, TrendingUp } from "lucide-react";
import MetricChip from "./MetricChip";

const BAR_HEIGHTS = [
  40, 64, 92, 70, 110, 84, 64, 96, 120, 72, 102, 80, 115, 90,
];

interface FeaturedStrategyProps {
  title: string;
  creator: string;
  type: string;
  risk: string;
  performance: string;
  description: string;
  steps: string[];
  href: string;
}

const FeaturedStrategy = ({
  title,
  creator,
  type,
  risk,
  performance,
  description,
  steps,
  href,
}: FeaturedStrategyProps) => {
  return (
    <div className="grid grid-cols-12 gap-8 rounded-[36px] border border-[#1FE9F7]/15 p-10 text-[#DAF9FB] shadow-[0_32px_64px_rgba(8,34,37,0.45),inset_0_0_18px_rgba(31,233,247,0.1)] [background:radial-gradient(160%_140%_at_40%_0%,rgba(31,233,247,0.32),rgba(7,15,16,0.95)),rgba(8,18,19,0.98)]">
      <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
        <h3 className="text-3xl font-semibold tracking-[0.01em] text-[#F2FEFF]">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-[15px] text-[#87B0B3]">
          <span className="flex items-center gap-2">
            <Flame size={18} strokeWidth={1.4} />
            Creator: {creator}
          </span>
          <span className="flex items-center gap-2">
            <Shield size={18} strokeWidth={1.4} />
            Risk: {risk}
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp size={18} strokeWidth={1.4} />
            Performance: {performance}
          </span>
        </div>
        <button>
          <a href={href}>Join Strategy</a>
        </button>
      </div>

      <div className="col-span-12 flex flex-col gap-4 lg:col-span-3">
        <MetricChip title="Type" value={type} />
        <MetricChip title="Risk" value={risk} />
        <MetricChip title="Performance" value={performance} accent />
      </div>

      <div className="col-span-12 flex h-36 items-end gap-1.5 rounded-[24px] border border-[#1FE9F7]/20 bg-[rgba(7,18,19,0.8)] p-6 lg:col-span-4">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={`featured-bar-${index}`}
            style={{ height }}
            className="flex-1 rounded-t-full bg-[linear-gradient(180deg,#5EFBFF_0%,rgba(31,233,247,0.05)_100%)] opacity-90"
          />
        ))}
      </div>

      <div className="col-span-12 flex flex-col gap-3 text-[15px] leading-7 text-[#8CB5B8] lg:col-span-5">
        <p>{description}</p>
        <div>
          <strong className="text-xs uppercase tracking-[0.14em] text-[#5EFBFF]">
            Steps
          </strong>
          <ol className="mt-3 space-y-1 text-[#9CC8CB]">
            {steps.map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStrategy;
