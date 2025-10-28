import React from 'react';
import { Card } from '../../ui/Card';
import { DUMMY_HISTORY } from '../../../constants';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Star, Award } from 'lucide-react';

const XP_PER_LEVEL = 100;

const getRank = (level: number) => {
    if (level <= 20) return { name: 'Beginner', icon: <Shield />, color: 'text-green-500' };
    if (level <= 35) return { name: 'Hard', icon: <Star />, color: 'text-blue-500' };
    return { name: 'Specialist', icon: <Award />, color: 'text-purple-500' };
};

const IntuitionRankCard: React.FC = () => {
    const totalXp = DUMMY_HISTORY.reduce((sum, session) => sum + session.score, 0);
    const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
    const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
    const rank = getRank(level);

    return (
        <Card className="h-full">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-3" />
                Intuition Rank
            </h2>
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${rank.color}`}>
                    {React.cloneElement(rank.icon, { size: 32 })}
                </div>
                <div>
                    <p className={`text-xl font-bold ${rank.color}`}>{rank.name}</p>
                    <p className="text-3xl font-bold">Level {level}</p>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center text-sm mb-1 font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">Progress to Level {level + 1}</span>
                    <span className="font-bold">{xpInCurrentLevel} / {XP_PER_LEVEL} XP</span>
                </div>
                <div className="w-full bg-light-secondary dark:bg-dark-secondary rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-light-accent dark:bg-dark-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </Card>
    );
};

export default IntuitionRankCard;
