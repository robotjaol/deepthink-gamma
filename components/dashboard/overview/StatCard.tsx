import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { useMotionValue, animate } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  suffix?: string;
  isText?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, suffix, isText = false }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isText) {
      return;
    }

    const animation = animate(count, parseInt(value, 10) || 0, {
      duration: 1.5,
      ease: 'easeOut',
    });

    const unsubscribe = count.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });

    setDisplayValue(Math.round(count.get()));

    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [value, isText, count]);

  return (
    <Card className="h-full">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg text-light-accent dark:text-dark-accent">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          {isText ? (
            <p className="text-2xl font-bold">{value}</p>
          ) : (
            <p className="text-2xl font-bold">
              {displayValue}
              <span className="text-lg text-gray-400">{suffix}</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;