import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

import { DUMMY_HISTORY } from '../../constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import StreakTracker from '../../components/dashboard/overview/StreakTracker';
import WeeklyProgressChart from '../../components/dashboard/overview/WeeklyProgressChart';
import GuideTour from '../../components/dashboard/tour/GuideTour';
import SuggestedScenarioCard from '../../components/dashboard/overview/SuggestedScenarioCard';
import StatCard from '../../components/dashboard/overview/StatCard';
import { CheckSquare, Star } from 'lucide-react';
import IntuitionRankCard from '../../components/dashboard/overview/IntuitionRankCard';
import DailyQuestsWidget from '../../components/dashboard/overview/DailyQuestsWidget';
import LeagueWidget from '../../components/dashboard/leaderboard/LeagueWidget';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const recentActivity = DUMMY_HISTORY[0];

    const averageScore = DUMMY_HISTORY.length > 0
        ? Math.round(DUMMY_HISTORY.reduce((acc, s) => acc + s.score, 0) / DUMMY_HISTORY.length)
        : 0;
        
    const scenariosThisMonth = DUMMY_HISTORY.filter(s => {
        const sessionDate = new Date(s.endTime);
        const currentDate = new Date();
        return sessionDate.getMonth() === currentDate.getMonth() && sessionDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        },
    };

    return (
        <div>
            <GuideTour />
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Ready to sharpen your intuition today?</p>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="col-span-1 md:col-span-2 lg:col-span-4" variants={itemVariants} id="tour-step-1">
                   <SuggestedScenarioCard />
                </motion.div>

                <motion.div className="md:col-span-2 lg:col-span-2" variants={itemVariants}>
                    <WeeklyProgressChart />
                </motion.div>
                <motion.div className="md:col-span-1 lg:col-span-1" variants={itemVariants}>
                    <StreakTracker />
                </motion.div>
                <motion.div className="md:col-span-1 lg:col-span-1" variants={itemVariants} id="tour-step-2">
                    <IntuitionRankCard />
                </motion.div>
                
                <motion.div className="md:col-span-2 lg:col-span-2" variants={itemVariants}>
                    <DailyQuestsWidget />
                </motion.div>
                <motion.div className="md:col-span-2 lg:col-span-2" variants={itemVariants}>
                    <LeagueWidget />
                </motion.div>


                <motion.div className="md:col-span-1 lg:col-span-2" variants={itemVariants}>
                     <StatCard icon={<Star />} title="Average Score" value={averageScore.toString()} suffix="/ 100" />
                </motion.div>
                <motion.div className="md:col-span-1 lg:col-span-2" variants={itemVariants}>
                    <StatCard icon={<CheckSquare />} title="Scenarios This Month" value={scenariosThisMonth.toString()} />
                </motion.div>

                <motion.div className="col-span-1 md:col-span-2 lg:col-span-4" variants={itemVariants} id="tour-step-3">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Recent Activity</h2>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/history')}>View All →</Button>
                        </div>
                        {recentActivity ? (
                            <div className="flex justify-between items-center p-4 rounded-lg bg-light-secondary dark:bg-dark-secondary">
                                <div>
                                    <p className="font-semibold text-lg">{recentActivity.scenarioName}</p>
                                    <p className="text-sm text-gray-500">{recentActivity.endTime.toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-2xl">{recentActivity.score}/100</p>
                                    <p className="text-sm">Score</p>
                                </div>
                            </div>
                        ) : (
                            <p>No recent activity. Start a session to see your progress!</p>
                        )}
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;