import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-[#0d1117] cursor-pointer",
    {
        variants: {
            variant: {
                primary: "bg-[#7c3aed] text-white hover:bg-[#6d28d9]",
                secondary: "bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]",
                outline: "border border-[#30363d] hover:bg-[#21262d] text-[#c9d1d9]",
                ghost: "hover:bg-[#21262d] text-[#c9d1d9]",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 py-2",
                lg: "h-12 px-8 text-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
