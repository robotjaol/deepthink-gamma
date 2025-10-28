import React from 'react';

// FIX: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// FIX: Wrapped component in React.forwardRef to allow passing a ref to the underlying div. This is necessary for components like the DevelopmentPage that need a direct DOM reference.
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-light-secondary dark:bg-dark-secondary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
