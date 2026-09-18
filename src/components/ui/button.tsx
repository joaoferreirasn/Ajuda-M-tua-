import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg shadow-card hover:brightness-110",
        accent: "bg-accent text-accent-fg shadow-card hover:brightness-110",
        outline: "bg-surface text-fg shadow-card hover:bg-bg",
        ghost: "bg-transparent text-fg hover:bg-fg/5",
        danger: "bg-danger text-primary-fg hover:brightness-110",
      },
      size: {
        md: "h-12 rounded-xl px-5 text-sm",
        lg: "h-14 rounded-2xl px-6 text-base",
        sm: "h-10 rounded-lg px-3 text-sm",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
