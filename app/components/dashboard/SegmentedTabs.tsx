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
    <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(7,18,19,0.75)] p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleSelect(tab.value)}
          className={clsx(
            "rounded- px-4 py-2 text-sm font-medium cursor-pointer text-[#7EA6A9] transition-all duration-150 hover:text-[#C9F6F8]",
            active === tab.value &&
              " border-b-2 border-[#1FE9F7]  shadow-[0_0_0_rgba(0,0,0,0)] -translate-y-px"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedTabs;
