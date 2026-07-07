import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        gold: "bg-gradient-to-br from-gold-soft to-gold-2 text-[#241a05] shadow-[0_8px_30px_rgba(201,150,47,.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_38px_rgba(201,150,47,.5)]",
        outline: "border border-gold/25 text-gold-soft bg-transparent hover:border-gold/60",
        ghost: "text-muted hover:text-gold-soft",
      },
      size: {
        default: "h-12 px-7 text-base",
        sm: "h-9 px-4 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "gold", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
