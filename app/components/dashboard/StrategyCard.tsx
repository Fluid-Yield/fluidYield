// components/StrategyCard.tsx
"use client";

import Link from "next/link";
import { ChartImage } from "./ChartImage";
import type { StrategyCardProps } from "@/app/types/strategy-types";
import { riskColor } from "@/lib/utils";

const StrategyCard = ({
  title,
  type,
  creator,
  description,
  performance,
  risk,
  href = "#",
}: StrategyCardProps) => {
  return (
    <article className="flex flex-col border border-border rounded-md bg-background overflow-hidden hover:border-accent/30 transition-colors">
      <div className="relative h-32 bg-muted/20">
        <ChartImage />
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {type}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-accent font-medium">{creator}</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Performance
            </span>
            <span className="text-sm font-semibold text-accent">
              {performance}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Risk
            </span>
            <span className={`text-sm font-semibold ${riskColor(risk)}`}>
              {risk}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Link
            className="flex-1 text-sm font-medium text-foreground border border-border hover:border-accent/30 hover:bg-accent/5 rounded px-4 py-2 text-center transition"
            href={href}
          >
            View Details
          </Link>
          <Link
            href={href}
            className="flex-1 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded px-4 py-2 text-center transition"
          >
            Join Strategy
          </Link>
        </div>
      </div>
    </article>
  );
};

export default StrategyCard;
