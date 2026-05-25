import * as React from "react";
import { cn, getStatusColor } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "status";
  status?: string;
}

export function Badge({ className, variant = "default", status, children, ...props }: BadgeProps) {
  if (variant === "status" && status) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          getStatusColor(status),
          className
        )}
        {...props}
      >
        {children || status.replace(/_/g, " ")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
