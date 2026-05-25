import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg" | "xs";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2",
        {
          "bg-slate-800 text-white hover:bg-slate-700": variant === "default",
          "bg-accent-600 text-white hover:bg-accent-700 shadow-sm": variant === "primary",
          "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200": variant === "secondary",
          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50": variant === "outline",
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100": variant === "ghost",
          "bg-danger-600 text-white hover:bg-danger-500": variant === "danger",
          "bg-success-600 text-white hover:bg-success-500": variant === "success",
          "bg-warning-500 text-white hover:bg-warning-600": variant === "warning",
        },
        {
          "h-7 px-2.5 text-xs": size === "xs",
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-sm": size === "md",
          "h-12 px-6 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
