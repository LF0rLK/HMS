import * as React from "react";
import { cn } from "@/lib/utils";

export interface BiasMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  left: number;
  center: number;
  right: number;
}

export const BiasMeter = ({
  left,
  center,
  right,
  className,
  ...props
}: BiasMeterProps) => {
  // Normalize values just in case they don't add up to 100
  const total = left + center + right;
  const pctLeft = total > 0 ? Math.round((left / total) * 100) : 0;
  const pctCenter = total > 0 ? Math.round((center / total) * 100) : 0;
  const pctRight = total > 0 ? Math.round((right / total) * 100) : 0;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)} {...props}>
      {/* Percentage Indicators */}
      <div className="flex justify-between text-caption font-semibold text-text-secondary select-none">
        <span className="text-bias-left">{pctLeft}% LEFT</span>
        <span className="text-text-primary">{pctCenter}% CENTER</span>
        <span className="text-bias-right">{pctRight}% RIGHT</span>
      </div>

      {/* Segmented Bar */}
      <div className="h-2 w-full flex rounded-full overflow-hidden bg-bg-secondary select-none">
        <div
          style={{ width: `${pctLeft}%` }}
          className="h-full bg-bias-left transition-all duration-500"
          title={`Left: ${pctLeft}%`}
        />
        <div
          style={{ width: `${pctCenter}%` }}
          className="h-full bg-bias-center transition-all duration-500"
          title={`Center: ${pctCenter}%`}
        />
        <div
          style={{ width: `${pctRight}%` }}
          className="h-full bg-bias-right transition-all duration-500"
          title={`Right: ${pctRight}%`}
        />
      </div>

      {/* Scale Ticks */}
      <div className="flex justify-between px-1 text-caption text-text-secondary font-medium select-none">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
};
