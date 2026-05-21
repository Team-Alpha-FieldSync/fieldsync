import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  
  // Notice we now use focus-visible:ring-highlight
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight disabled:pointer-events-none disabled:opacity-50 hover:brightness-110 active:brightness-90";

  // Using your custom OKLCH colors!
  const variants = {
    primary: "bg-primary text-bg-dark",
    secondary: "bg-secondary text-bg-dark",
    danger: "bg-danger text-fg",
    ghost: "bg-transparent text-fg hover:bg-bg-light border border-transparent hover:border-border-muted",
  };

  const sizes = {
    small: "h-8 px-3 text-xs",
    medium: "h-10 px-4 py-2 text-sm",
    large: "h-12 px-8 text-base",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}