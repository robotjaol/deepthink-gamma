import React from 'react';
import { Card } from '../../ui/Card';
import { SkillNode } from '../../../types';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

interface SkillSummaryCardProps {
    skills: SkillNode[];
}

const SkillSummaryCard: React.FC<SkillSummaryCardProps> = ({ skills }) => {
    const unlockedSkills = skills.filter(s => s.level > 0);
    const lockedSkills = skills.filter(s => s.level === 0);

    return (
        <Card className="h-full">
            <h2 className="text-2xl font-bold mb-4">Skills Overview</h2>
            
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Unlocked Skills ({unlockedSkills.length})</h3>
                <div className="space-y-2">
                    {unlockedSkills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            className="flex items-center gap-2 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Check size={16} className="text-green-500 flex-shrink-0"/>
                            <span>{skill.name}</span>
                            <span className="font-bold ml-auto">{['', 'BRZ', 'SIL', 'GLD'][skill.level]}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

             <div>
                <h3 className="font-semibold mb-2">Locked Skills ({lockedSkills.length})</h3>
                <div className="space-y-2">
                    {lockedSkills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            className="flex items-center gap-2 text-sm text-gray-500"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (unlockedSkills.length + index) * 0.05 }}
                        >
                            <Lock size={16} className="text-gray-400 flex-shrink-0"/>
                            <span>{skill.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default SkillSummaryCard;