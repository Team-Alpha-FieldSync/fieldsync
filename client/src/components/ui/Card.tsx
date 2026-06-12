import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: "light" | "medium" | "strong";
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const shadows = {
  light: "shadow-sm",
  medium: "shadow-md",
  strong: "shadow-xl",
};

export default function Card({
  shadow = "light",
  header,
  footer,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-bg-base border border-border-muted rounded-xl overflow-hidden ${shadows[shadow]} ${className}`.trim()}
      {...props}
    >
      {header && (
        <div className="px-4 py-3 xl:px-6 xl:py-4 border-b border-border-muted">
          {header}
        </div>
      )}
      <div className="px-4 py-4 xl:px-6 xl:py-6">{children}</div>
      {footer && (
        <div className="px-4 py-3 xl:px-6 xl:py-4 border-t border-border-muted bg-bg-light/50">
          {footer}
        </div>
      )}
    </div>
  );
}
