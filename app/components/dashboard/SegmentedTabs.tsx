"use client";

import { useState } from "react";
import clsx from "clsx";

interface Tab {
  label: string;
  value: string;
}

interface SegmentedTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const SegmentedTabs = ({
  tabs,
  defaultValue,
  onChange,
}: SegmentedTabsProps) => {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);

  const handleSelect = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-accent/5 border border-accent/15 p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleSelect(tab.value)}
          className={clsx(
            "rounded-md px-4 py-2 text-sm font-medium cursor-pointer text-muted-foreground transition-all duration-150 hover:text-foreground",
            active === tab.value &&
              "border-b-2 border-accent text-accent shadow-[0_0_0_rgba(0,0,0,0)] -translate-y-px"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedTabs;
