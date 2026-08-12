import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  withAdd?: boolean;
  onClick?: () => void;
}

export const Chip = ({
  children,
  className,
  active = false,
  withAdd = false,
  onClick,
  ...props
}: ChipProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-medium border transition-all select-none cursor-pointer",
        active
          ? "bg-text-primary text-bg-primary border-text-primary"
          : "bg-surface text-text-secondary border-border hover:bg-bg-secondary hover:text-text-primary",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {withAdd && (
        <span className="text-body-lg leading-none font-light ml-0.5">+</span>
      )}
    </div>
  );
};
