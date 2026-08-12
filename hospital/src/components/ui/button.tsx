import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          // Variants
          {
            "bg-text-primary text-bg-primary hover:bg-text-secondary shadow-sm":
              variant === "primary",
            "bg-bg-secondary text-text-primary hover:bg-border":
              variant === "secondary",
            "border border-border bg-transparent text-text-primary hover:bg-surface":
              variant === "outline",
            "text-accent bg-transparent hover:underline px-0 py-0":
              variant === "text",
          },
          // Sizes
          {
            "text-body-sm px-3 py-1.5 rounded-sm": size === "sm",
            "text-body-md px-4 py-2 rounded-md": size === "md",
            "text-body-lg px-6 py-3 rounded-lg": size === "lg",
            "p-0": variant === "text", // Reset padding for text button
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
