import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { DUMMY_WEEKLY_LEAGUE } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

const LeagueWidget: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = DUMMY_WEEKLY_LEAGUE.find(u => u.id === 'user-4');

    if (!currentUser) return null;

    return (
        <Card className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold flex items-center">
                    <Shield className="mr-3 text-blue-500"/>
                    Silver League
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/leaderboard')}>
                    View League <ArrowRight size={14} className="ml-1" />
                </Button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
                You are currently ranked <span className="font-bold text-light-text dark:text-dark-text">#{currentUser.rank}</span>. Keep going!
            </p>
            <div className="space-y-2">
                {DUMMY_WEEKLY_LEAGUE.slice(0, 3).map((player, index) => (
                    <motion.div 
                        key={player.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center p-2 rounded-lg ${player.id === currentUser.id ? 'bg-light-accent/30 dark:bg-dark-accent/20' : ''}`}
                    >
                        <span className="font-bold w-6">{player.rank}</span>
                        <img src={player.profilePictureUrl} alt={player.name} className="w-8 h-8 rounded-full mx-2" />
                        <span className="flex-grow font-medium">{player.name}</span>
                        <span className="font-semibold text-sm">{player.points.toLocaleString()} pts</span>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};

export default LeagueWidget;