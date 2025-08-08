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
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    buttonVariants.variant[variant],
    buttonVariants.size[size]
  );
};

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, variant = 'default', size = 'default', asChild = false, ...rest } = props;
    const classes = cn(getButtonClasses(variant, size), className);
    
    if (asChild) {
      const child = React.Children.only(props.children) as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(child.props?.className, classes),
        ...rest,
        ref,
      });
    }

    return <button className={classes} ref={ref} {...rest} />;
  }
);

Button.displayName = 'Button';