import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <Card className="text-center py-16 px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="text-light-accent dark:text-dark-accent mb-6">
          {icon}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">{message}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </motion.div>
    </Card>
  );
};

export default EmptyState;
