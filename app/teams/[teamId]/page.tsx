import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
};

const getButtonClasses = (
  variant: keyof typeof buttonVariants.variant = 'default',
  size: keyof typeof buttonVariants.size = 'default'
) => {
  return cn(
    // Base classes
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    // Variant classes
    buttonVariants.variant[variant],
    // Size classes
    buttonVariants.size[size]
  );
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const classes = cn(getButtonClasses(variant, size), className);
    
    if (asChild) {
      // If asChild is true, we expect children to be a single React element
      const child = React.Children.only(props.children) as React.ReactElement<{ className?: string }>;
      const combinedProps = {
        ...props,
        ref,
        className: cn(child.props.className || '', classes),
      };
      // Remove children from props to avoid passing it twice
      delete combinedProps.children;
      return React.cloneElement(child, combinedProps);
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };