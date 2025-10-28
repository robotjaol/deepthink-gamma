import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, type = 'text', containerClassName, icon, ...props }) => {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
  const hasRealPlaceholder = !!props.placeholder && props.placeholder !== ' ';

  return (
    <div className={`relative ${containerClassName !== undefined ? containerClassName : 'w-full'}`}>
      {icon && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={inputId}
        type={type}
        className={`peer w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border-2 border-light-accent/30 dark:border-dark-accent/30 rounded-lg py-2 pt-6 focus:outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors ${
          icon ? 'pl-12 pr-4' : 'px-4'
        }`}
        placeholder={props.placeholder || " "}
        {...props}
      />
      <label 
        htmlFor={inputId} 
        className={`absolute text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out pointer-events-none
                   ${hasRealPlaceholder
                     ? 'top-2 text-xs'
                     : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs'
                   }
                   ${icon ? 'left-12' : 'left-4'}`}
      >
        {label}
      </label>
    </div>
  );
};
