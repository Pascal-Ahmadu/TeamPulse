import { buttonVariants, type ButtonProps } from "@/components/ui/button"
import { badgeVariants, type BadgeProps } from "@/components/ui/badge"
import { VariantProps } from "class-variance-authority"

declare module "@/components/ui/button" {
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
  }
}

declare module "@/components/ui/badge" {
  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
}
