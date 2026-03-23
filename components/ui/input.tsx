import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs uppercase tracking-widest text-gray-500 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 bg-white border rounded-lg text-sm text-[#1a1a2e] placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-[#b8956a]/30 focus:border-[#b8956a]',
            'transition-all duration-200',
            error ? 'border-red-400' : 'border-[#e8e0d4]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
