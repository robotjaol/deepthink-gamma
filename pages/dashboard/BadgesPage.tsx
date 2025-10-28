import React from 'react';
import { motion } from 'framer-motion';
import { DUMMY_BADGES, DUMMY_USER_BADGES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import BadgeCard from '../../components/dashboard/badges/BadgeCard';
import { Medal } from 'lucide-react';

const BadgesPage: React.FC = () => {
    const { user } = useAuth();
    // In a real app, user?.id would come from the auth context.
    // For the demo, we hardcode the main dummy user's ID 'user-1' if the logged-in user is the dummy one.
    const currentUserId = user?.email === 'user@deepthink.com' ? 'user-1' : user?.id;

    const earnedBadgeIds = DUMMY_USER_BADGES
        .filter(ub => ub.userId === currentUserId)
        .map(ub => ub.badgeId);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07 },
        },
    };

    return (
        <div>
            <div className="text-left mb-8">
                <h1 className="text-4xl font-bold flex items-center space-x-3">
                    <Medal className="text-light-accent dark:text-dark-accent" size={40} />
                    <span>Badges & Achievements</span>
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">Track your accomplishments and see what you can unlock next.</p>
            </div>
            
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {DUMMY_BADGES.map(badge => (
                    <BadgeCard 
                        key={badge.id}
                        badge={badge}
                        isEarned={earnedBadgeIds.includes(badge.id)}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default BadgesPage;
