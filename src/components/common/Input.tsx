import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    fullWidth = false, 
    leftIcon, 
    rightIcon, 
    className = '', 
    ...props 
  }, ref) => {
    const inputClasses = `
      block px-4 py-2 rounded-lg border
      ${error ? 'border-error-500' : 'border-neutral-300'}
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${props.disabled ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-2`}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;