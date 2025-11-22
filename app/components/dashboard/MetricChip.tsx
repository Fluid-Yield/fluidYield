"use client";

import clsx from "clsx";

interface MetricChipProps {
  title: string;
  value: string;
  accent?: boolean;
}

const MetricChip = ({ title, value, accent = false }: MetricChipProps) => {
  return (
    <div className="flex min-w-[160px] flex-col gap-1.5 rounded-[18px] border border-[#1FE9F7]/20 bg-[rgba(8,20,24,0.85)] px-5 py-4 text-[13px] text-[#8FBCBE]">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#9FC8CAA6]">
        {title}
      </span>
      <span
        className={clsx(
          "text-lg font-semibold text-[#6CF4FA]",
          accent && "text-[#46FFD7]"
        )}
      >
        {value}
      </span>
    </div>
  );
};

export default MetricChip;
