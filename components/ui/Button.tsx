import React from 'react';
import { motion } from 'framer-motion';

// FIX: Omit HTML drag and animation event props to resolve type conflicts with framer-motion's props.
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop' |
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-light-accent text-light-text hover:bg-opacity-80 dark:bg-dark-accent dark:text-dark-primary dark:hover:bg-opacity-90 focus:ring-light-accent dark:focus:ring-dark-accent',
    secondary: 'bg-light-secondary text-light-text hover:bg-gray-200 dark:bg-dark-secondary dark:text-dark-text dark:hover:bg-gray-700 focus:ring-gray-500',
    ghost: 'bg-transparent text-light-text hover:bg-light-secondary dark:text-dark-text dark:hover:bg-dark-secondary',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <motion.button 
      className={combinedClassName} 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};