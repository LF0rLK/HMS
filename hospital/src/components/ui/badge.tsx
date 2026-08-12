import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "left" | "center" | "right";
}

export const Badge = ({
  children,
  className,
  variant = "neutral",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm text-caption font-medium tracking-wide uppercase",
        {
          "bg-bg-secondary text-text-secondary": variant === "neutral",
          "bg-bias-left/10 text-bias-left": variant === "left",
          "bg-bias-center/10 text-text-primary border border-border": variant === "center",
          "bg-bias-right/10 text-bias-right": variant === "right",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
