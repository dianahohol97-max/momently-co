import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[#1a1a2e] text-[#faf8f4] hover:bg-[#2a2a3e] focus:ring-[#1a1a2e]': variant === 'primary',
            'bg-[#b8956a] text-white hover:bg-[#a07850] focus:ring-[#b8956a]': variant === 'secondary',
            'border border-[#b8956a] text-[#b8956a] hover:bg-[#b8956a]/10 focus:ring-[#b8956a]': variant === 'outline',
            'text-[#1a1a2e] hover:bg-[#1a1a2e]/5 focus:ring-[#1a1a2e]': variant === 'ghost',
          },
          {
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-5 py-2.5': size === 'md',
            'text-base px-8 py-3.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
