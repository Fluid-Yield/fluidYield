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
    <div className="inline-flex items-center gap-0 rounded border border-border bg-muted/30 p-1">
      {TIME_RANGES.map((range) => {
        const isActive = active === range;
        return (
          <button
            key={range}
            type="button"
            onClick={() => handleSelect(range)}
            className={clsx(
              "relative min-w-[40px] rounded px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
              "hover:text-foreground",
              isActive && "text-accent bg-background shadow-sm"
            )}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
};

export default TimeRangeToggle;
