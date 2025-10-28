import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DUMMY_LEADERBOARD, DUMMY_WEEKLY_LEAGUE, DUMMY_USER_BADGES, DUMMY_BADGES } from '../../constants';
import { Card } from '../../components/ui/Card';
import { Trophy, Flame, Medal, Shield, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge, LeaderboardUser, UserLeague } from '../../types';
import { useAuth } from '../../hooks/useAuth';

type LeaderboardView = 'league' | 'global';

const LeaderboardRow: React.FC<{ player: LeaderboardUser | UserLeague, isCurrentUser: boolean, view: LeaderboardView, index: number }> = React.memo(({ player, isCurrentUser, view, index }) => {
    const earnedBadges = DUMMY_USER_BADGES
        .filter(ub => ub.userId === player.id)
        .map(ub => DUMMY_BADGES.find(b => b.id === ub.badgeId))
        .filter((b): b is Badge => b !== undefined);

    const isPromotionZone = view === 'league' && index < 2; // Top 2 promote
    const isDemotionZone = view === 'league' && index >= 3; // Bottom 2 demote
    
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link to={`/dashboard/profile/${player.id}`}>
                <div className={`flex items-center p-3 rounded-lg transition-all duration-300 relative overflow-hidden ${isCurrentUser ? 'bg-light-accent/50 dark:bg-dark-accent/20 scale-[1.02] shadow-lg' : 'bg-light-primary dark:bg-dark-primary hover:bg-light-secondary/50 dark:hover:bg-dark-secondary'}`}>
                    {view === 'league' && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPromotionZone ? 'bg-green-500' : ''} ${isDemotionZone ? 'bg-red-500' : ''}`}></div>
                    )}
                    <div className="text-xl font-bold w-12 text-center text-gray-500 dark:text-gray-400">{player.rank}</div>
                    <img src={player.profilePictureUrl} alt={player.name} className="w-12 h-12 rounded-full mx-4" />
                    <div className="flex-1">
                        <p className="font-semibold text-lg">{player.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                           {'dailyStreak' in player && <span className="flex items-center"><Flame className="mr-1" size={14} /> {player.dailyStreak} Day Streak</span>}
                            <div className="flex items-center">
                                {earnedBadges.slice(0, 3).map(badge => (
                                    <span key={badge.id} title={badge.name}>
                                        <Medal className="mr-1 text-yellow-500" size={16} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="text-right flex items-center gap-4">
                        {view === 'league' && isPromotionZone && <ArrowUp size={20} className="text-green-500" />}
                        {view === 'league' && isDemotionZone && <ArrowDown size={20} className="text-red-500" />}
                        <div className="text-xl font-bold text-light-text dark:text-dark-gold">{player.points.toLocaleString()} pts</div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});


const LeaderboardPage: React.FC = () => {
    const { user } = useAuth();
    const [view, setView] = useState<LeaderboardView>('league');

    // In a real app, you would use the authenticated user's ID.
    const currentUserId = 'user-4'; 

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
                    <Trophy className="text-light-accent dark:text-dark-accent" size={40} />
                    <span>Leaderboard</span>
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">See how you stack up against other thinkers.</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="p-1 bg-light-secondary dark:bg-dark-secondary rounded-lg flex space-x-1">
                    <button onClick={() => setView('league')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'league' ? 'bg-light-primary dark:bg-dark-primary shadow' : ''}`}>Weekly League</button>
                    <button onClick={() => setView('global')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'global' ? 'bg-light-primary dark:bg-dark-primary shadow' : ''}`}>Global</button>
                </div>
            </div>
            
            <Card>
                {view === 'league' && (
                    <div className="p-4 mb-4 bg-light-secondary dark:bg-dark-secondary rounded-lg text-center">
                        <h2 className="text-xl font-bold flex items-center justify-center gap-2"><Shield size={20} className="text-blue-500" /> Silver League</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Top 2 promote, bottom 2 demote. Resets in 3 days.</p>
                    </div>
                )}
                <div className="space-y-2">
                    {(view === 'league' ? DUMMY_WEEKLY_LEAGUE : DUMMY_LEADERBOARD).map((player, index) => (
                        <LeaderboardRow 
                            key={player.id} 
                            player={player} 
                            isCurrentUser={player.id === currentUserId}
                            view={view}
                            index={index}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default LeaderboardPage;