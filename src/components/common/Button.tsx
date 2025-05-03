import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm';
      case 'secondary':
        return 'bg-secondary-600 hover:bg-secondary-700 active:bg-secondary-800 text-white shadow-sm';
      case 'success':
        return 'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white shadow-sm';
      case 'warning':
        return 'bg-warning-600 hover:bg-warning-700 active:bg-warning-800 text-white shadow-sm';
      case 'error':
        return 'bg-error-600 hover:bg-error-700 active:bg-error-800 text-white shadow-sm';
      case 'outline':
        return 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100';
      case 'ghost':
        return 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100';
      default:
        return 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'xs':
        return 'px-2.5 py-1.5 text-xs';
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-5 py-2.5 text-lg';
      case 'xl':
        return 'px-6 py-3 text-xl';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const buttonClasses = `
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;