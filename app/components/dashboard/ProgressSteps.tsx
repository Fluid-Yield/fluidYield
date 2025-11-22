"use client";

import { Fragment } from "react";

export interface Step {
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentIndex: number;
}

const baseCircleClasses =
  "grid h-12 w-12 place-items-center rounded-full border border-[#1FE9F7]/15 bg-[rgba(6,15,16,0.9)] text-[16px] font-semibold text-[#9ECACC] shadow-[inset_0_0_12px_rgba(31,233,247,0.08)] transition-all";
const activeCircleClasses =
  "border-none text-[#061015] [background:linear-gradient(180deg,#5EFBFF_0%,#1FE9F7_100%)] shadow-[0_8px_18px_rgba(31,233,247,0.45),inset_0_0_12px_rgba(255,255,255,0.18)]";

const ProgressSteps = ({ steps, currentIndex }: ProgressStepsProps) => {
  return (
    <div className="flex items-center gap-4 rounded-full px-7 py-5">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <Fragment key={step.label}>
            <div className="flex min-w-[120px] flex-col items-center gap-2 text-center">
              <span
                className={`${baseCircleClasses} ${
                  isActive ? activeCircleClasses : ""
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-[13px] text-[#7EA3A6] ${
                  isActive ? "text-[#5EFBFF]" : ""
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(31,233,247,0.28),transparent)]" />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
