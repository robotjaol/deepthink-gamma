import React from 'react';
import { Card } from '../../ui/Card';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface FieldLevelData {
    jobType: string;
    level: number;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
}

interface FieldLevelSummaryCardProps {
    fieldLevels: FieldLevelData[];
}

const FieldLevelSummaryCard: React.FC<FieldLevelSummaryCardProps> = ({ fieldLevels }) => {
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Briefcase size={24} className="mr-3 text-light-accent dark:text-dark-accent" />
                Field Mastery
            </h2>
            <div className="space-y-4">
                {fieldLevels.map((field, index) => {
                    const progressPercent = (field.xpInCurrentLevel / field.xpForNextLevel) * 100;
                    return (
                        <motion.div 
                            key={field.jobType}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-light-secondary dark:bg-dark-secondary rounded-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{field.jobType}</span>
                                <span className="font-bold text-lg">Level {field.level}</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-center text-xs mb-1 font-semibold text-gray-500 dark:text-gray-400">
                                    <span>Progress</span>
                                    <span>{field.xpInCurrentLevel} / {field.xpForNextLevel} XP</span>
                                </div>
                                <div className="w-full bg-light-primary dark:bg-dark-primary rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-light-accent dark:bg-dark-accent"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </Card>
    );
};

export default FieldLevelSummaryCard;