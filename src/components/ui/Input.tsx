import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helper, 
    leftElement, 
    rightElement, 
    fullWidth = false, 
    className = '', 
    ...rest 
  }, ref) => {
    const inputWrapperStyles = `flex items-center border ${error ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500`;
    const inputStyles = 'block w-full py-2 px-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        
        <div className={inputWrapperStyles}>
          {leftElement && (
            <div className="pl-3 flex items-center text-gray-500">
              {leftElement}
            </div>
          )}
          
          <input 
            ref={ref}
            className={inputStyles}
            {...rest} 
          />
          
          {rightElement && (
            <div className="pr-3 flex items-center text-gray-500">
              {rightElement}
            </div>
          )}
        </div>
        
        {(error || helper) && (
          <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;