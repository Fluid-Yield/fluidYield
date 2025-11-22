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
    <div className="grid grid-cols-12 gap-8 rounded-2xl border border-accent/20 p-10 text-foreground shadow-[0_8px_24px_rgba(194,24,91,0.12)] bg-background">
      <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
        <h3 className="text-3xl font-semibold tracking-[0.01em] text-foreground">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-[15px] text-muted-foreground">
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
          <a
            href={href}
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition"
          >
            Join Strategy
          </a>
        </button>
      </div>

      <div className="col-span-12 flex flex-col gap-4 lg:col-span-3">
        <MetricChip title="Type" value={type} />
        <MetricChip title="Risk" value={risk} />
        <MetricChip title="Performance" value={performance} accent />
      </div>

      <div className="col-span-12 flex h-36 items-end gap-1.5 rounded-xl border border-accent/20 bg-accent/5 p-6 lg:col-span-4">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={`featured-bar-${index}`}
            style={{ height }}
            className="flex-1 rounded-t-full bg-[linear-gradient(180deg,var(--accent)_0%,rgba(194,24,91,0.15)_100%)] opacity-90"
          />
        ))}
      </div>

      <div className="col-span-12 flex flex-col gap-3 text-[15px] leading-7 text-muted-foreground lg:col-span-5">
        <p>{description}</p>
        <div>
          <strong className="text-xs uppercase tracking-[0.14em] text-accent">
            Steps
          </strong>
          <ol className="mt-3 space-y-1 text-foreground">
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
