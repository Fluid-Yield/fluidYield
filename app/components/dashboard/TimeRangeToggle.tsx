"use client";

import { useState } from "react";
import clsx from "clsx";

const TIME_RANGES = ["1H", "1D", "1W", "1M", "1Y"] as const;

type TimeRange = (typeof TIME_RANGES)[number];

interface TimeRangeToggleProps {
  defaultValue?: TimeRange;
  onChange?: (value: TimeRange) => void;
}

const TimeRangeToggle = ({
  defaultValue = "1H",
  onChange,
}: TimeRangeToggleProps) => {
  const [active, setActive] = useState<TimeRange>(defaultValue);

  const handleSelect = (value: TimeRange) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#0B1110] px-1 ">
      {TIME_RANGES.map((range) => {
        const isActive = active === range;
        return (
          <button
            key={range}
            type="button"
            onClick={() => handleSelect(range)}
            className={clsx(
              "relative min-w-[45px] rounded-full px-0 py-3 text-sm font-semibold tracking-wide text-[#7F9997] transition-all duration-150",
              "hover:text-[#B6D7CF]",
              isActive &&
                "text-[#49FF9C] shadow-[0_0_0_1px_rgba(73,255,156,0.45)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:border before:border-[#49FF9C]/40 before:opacity-90 before:content-['']"
            )}
            style={
              isActive
                ? {
                    background:
                      "radial-gradient(100% 100% at 50% 50%, rgba(73, 255, 156, 0.18) 0%, rgba(11, 17, 16, 0) 100%)",
                  }
                : undefined
            }
          >
            {range}
          </button>
        );
      })}
    </div>
  );
};

export default TimeRangeToggle;
