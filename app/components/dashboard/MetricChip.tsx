"use client";

import clsx from "clsx";

interface MetricChipProps {
  title: string;
  value: string;
  accent?: boolean;
}

const MetricChip = ({ title, value, accent = false }: MetricChipProps) => {
  return (
    <div className="flex min-w-[160px] flex-col gap-1.5 rounded-lg border border-accent/20 bg-accent/5 px-5 py-4 text-[13px] text-muted-foreground">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </span>
      <span
        className={clsx(
          "text-lg font-semibold text-accent",
          accent && "text-accent"
        )}
      >
        {value}
      </span>
    </div>
  );
};

export default MetricChip;
