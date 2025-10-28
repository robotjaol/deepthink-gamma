import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Card } from '../../ui/Card';
import { Flame, Star } from 'lucide-react';
import { DUMMY_STREAK_INFO } from '../../../constants';

const StreakTracker: React.FC = () => {
    const { currentStreak, longestStreak } = DUMMY_STREAK_INFO;
    const count = useMotionValue(0);
    const [displayStreak, setDisplayStreak] = useState(0);

    useEffect(() => {
        const animation = animate(count, currentStreak, {
            duration: 1.5,
            ease: "easeOut",
        });

        const unsubscribe = count.on("change", (latest) => {
            setDisplayStreak(Math.round(latest));
        });
        
        setDisplayStreak(Math.round(count.get()));

        return () => {
            animation.stop();
            unsubscribe();
        };
    }, [currentStreak, count]);

    return (
        <Card className="flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-2xl font-semibold mb-2 flex items-center"><Flame className="mr-2 text-orange-500"/> Daily Streak</h2>
            <p className="text-6xl font-bold text-light-text dark:text-dark-gold">
                {displayStreak}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">days in a row!</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Star size={14} className="mr-1"/> Longest Streak: {longestStreak} days
            </div>
        </Card>
    );
}

export default StreakTracker;