import React from 'react';
import { Card } from '../../ui/Card';
import { motion } from 'framer-motion';
import { Badge } from '../../../types';
import { CheckCircle2, Award, Star, Flame, BrainCircuit, Trophy } from 'lucide-react';

interface BadgeCardProps {
    badge: Badge;
    isEarned: boolean;
}

const badgeIcons: { [key in Badge['iconName']]: React.ReactNode } = {
    Award: <Award size={32} />,
    Star: <Star size={32} />,
    Flame: <Flame size={32} />,
    BrainCircuit: <BrainCircuit size={32} />,
    Trophy: <Trophy size={32} />,
};

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <motion.div variants={itemVariants} className="h-full">
            <Card className={`relative h-full transition-all duration-300 ${isEarned ? 'bg-light-accent/30 dark:bg-dark-accent/20 border-light-accent dark:border-dark-accent' : 'opacity-60'}`}>
                {isEarned && (
                    <div className="absolute top-4 right-4 text-green-500" title="Earned!">
                        <CheckCircle2 size={24} />
                    </div>
                )}
                <div className="flex flex-col items-center text-center p-4">
                    <div className={`mb-4 ${isEarned ? 'text-light-accent dark:text-dark-gold' : 'text-gray-400'}`}>
                        {badgeIcons[badge.iconName]}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{badge.description}</p>
                </div>
            </Card>
        </motion.div>
    );
};

export default React.memo(BadgeCard);