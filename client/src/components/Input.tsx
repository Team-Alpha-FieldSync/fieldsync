import React, { forwardRef } from "react";

// 1. Add rightElement to your interface
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode; 
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, type = "text", disabled, id, rightElement, ...props }, ref) => {
    
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-fg">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={`
              block w-full px-4 py-2.5 rounded-xl border bg-transparent text-fg transition-all outline-none sm:text-sm
              ${error ? "border-danger focus:ring-2 focus:ring-danger/30 focus:border-danger" : "border-border-main hover:border-fg-muted focus:ring-2 focus:ring-primary/30 focus:border-primary"}
              ${disabled ? "opacity-50 cursor-not-allowed bg-bg-light" : ""}
              ${rightElement ? "pr-10" : ""} 
              ${className}
            `.trim()}
            {...props}
          />
          
          {/* 2. Render the right element inside the relative box */}
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-danger mt-1 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;