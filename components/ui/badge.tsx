import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'inline-flex items-center rounded-full border border-transparent bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80',
  secondary: 'inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80',
  destructive: 'inline-flex items-center rounded-full border border-transparent bg-destructive text-destructive-foreground px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-destructive/80',
  outline: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants[variant], className)} {...props} />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
