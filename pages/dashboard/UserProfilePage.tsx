

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_LEADERBOARD, DUMMY_USER_BADGES, DUMMY_BADGES } from '../../constants';
import { Card } from '../../components/ui/Card';
import { Flame, Star, ArrowLeft, Award, BrainCircuit, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../../types';

const badgeIcons: { [key in Badge['iconName']]: React.ReactNode } = {
    Award: <Award />,
    Star: <Star />,
    Flame: <Flame />,
    BrainCircuit: <BrainCircuit />,
    Trophy: <Trophy />,
};

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const user = DUMMY_LEADERBOARD.find(u => u.id === userId);

    const earnedBadges = DUMMY_USER_BADGES.filter(ub => ub.userId === userId)
        .map(ub => DUMMY_BADGES.find(b => b.id === ub.badgeId))
        .filter((b): b is Badge => b !== undefined);

    if (!user) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Could not find a user with the specified ID.</p>
                 <Link to="/dashboard/leaderboard" className="mt-6 inline-block text-light-accent dark:text-dark-accent hover:underline">
                    &larr; Back to Leaderboard
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/dashboard/leaderboard" className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-light-text dark:hover:text-dark-text mb-6 transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Leaderboard</span>
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                    <div className="flex flex-col items-center md:flex-row md:space-x-8 p-4">
                        <img src={user.profilePictureUrl} alt={user.name} className="w-32 h-32 rounded-full mb-4 md:mb-0 ring-4 ring-light-accent dark:ring-dark-accent shadow-lg" />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold">{user.name}</h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400">Global Rank: #{user.rank}</p>
                            <div className="flex items-center justify-center md:justify-start space-x-4 mt-4 text-lg">
                                <div className="flex items-center space-x-1 p-2 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                                    <Star className="text-yellow-500" />
                                    <span>{user.points.toLocaleString()} Points</span>
                                </div>
                                <div className="flex items-center space-x-1 p-2 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                                    <Flame className="text-orange-500" />
                                    <span>{user.dailyStreak} Day Streak</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Earned Badges</h2>
                    {earnedBadges.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {earnedBadges.map(badge => (
                                <div key={badge.id} className="flex items-center space-x-3 p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg" title={badge.description}>
                                    <div className="text-light-accent dark:text-dark-accent">
                                        {badgeIcons[badge.iconName]}
                                    </div>
                                    <span className="font-semibold">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">This user hasn't earned any badges yet.</p>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default UserProfilePage;