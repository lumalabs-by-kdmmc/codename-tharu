import * as React from "react";
import { cn } from "@/lib/utils";

// Tailwind-styled native select (a Radix-based shadcn Select can replace this later).
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-3 text-base text-cloud outline-none transition-colors focus:border-gold disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Select.displayName = "Select";

export { Select };
