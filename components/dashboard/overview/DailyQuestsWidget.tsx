import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { DUMMY_DAILY_QUESTS } from '../../../constants';
import { motion } from 'framer-motion';
import { Check, Target } from 'lucide-react';

const DailyQuestsWidget: React.FC = () => {
    const [quests, setQuests] = useState(DUMMY_DAILY_QUESTS);

    const completedQuests = quests.filter(q => q.progress >= q.target).length;
    const totalQuests = quests.length;
    const overallProgress = (completedQuests / totalQuests) * 100;

    return (
        <Card className="h-full">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Target className="mr-3 text-light-accent dark:text-dark-gold" />
                Today's Goals
            </h2>
            <div className="space-y-3">
                {quests.map((quest, index) => {
                    const isCompleted = quest.progress >= quest.target;
                    return (
                        <motion.div 
                            key={quest.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg flex items-center gap-4 transition-all ${isCompleted ? 'bg-green-500/10' : 'bg-light-secondary dark:bg-dark-secondary'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-light-primary dark:bg-dark-primary'}`}>
                                {isCompleted && <Check size={20} />}
                            </div>
                            <div>
                                <p className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : ''}`}>{quest.title}</p>
                                <p className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>+{quest.xp} XP</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold mb-1 text-center">Daily Completion Reward</p>
                 <div className="w-full bg-light-secondary dark:bg-dark-secondary rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-green-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </Card>
    );
};

export default DailyQuestsWidget;