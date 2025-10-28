import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-light-text dark:text-dark-gold bg-light-secondary dark:bg-dark-secondary hover:bg-light-accent/50 dark:hover:bg-dark-accent/20 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
    </button>
  );
};

export default ThemeToggle;