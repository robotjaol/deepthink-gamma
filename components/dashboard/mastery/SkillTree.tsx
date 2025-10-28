import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillNode } from '../../../types';
import { Card } from '../../ui/Card';
import { Lock, Award } from 'lucide-react';

interface SkillTreeProps {
    skills: SkillNode[];
}

const SkillTree: React.FC<SkillTreeProps> = ({ skills }) => {
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

    const getNodeById = (id: string) => skills.find(s => s.id === id);

    const levelConfig = {
        0: { color: 'stroke-gray-500 dark:stroke-gray-600', fill: 'fill-gray-700 dark:fill-gray-800', textColor: 'text-gray-400' },
        1: { color: 'stroke-yellow-700 dark:stroke-yellow-800', fill: 'fill-yellow-500 dark:fill-yellow-600', textColor: 'text-yellow-200' }, // Bronze
        2: { color: 'stroke-gray-400 dark:stroke-gray-500', fill: 'fill-gray-200 dark:fill-gray-300', textColor: 'text-gray-800' }, // Silver
        3: { color: 'stroke-amber-400 dark:stroke-amber-300', fill: 'fill-amber-400 dark:fill-amber-500', textColor: 'text-amber-900' }, // Gold
    };

    return (
        <Card className="h-[75vh] w-full relative overflow-auto bg-gradient-to-br from-gray-50 dark:from-dark-secondary dark:to-black">
            <svg width="100%" height="100%" className="absolute inset-0 min-w-[600px] min-h-[500px]">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Connectors */}
                {skills.map(skill => (
                    skill.dependencies.map(depId => {
                        const source = getNodeById(depId);
                        if (!source) return null;
                        const isUnlocked = source.level > 0 && skill.level > 0;
                        return (
                             <motion.path
                                key={`${depId}-${skill.id}`}
                                d={`M ${source.position.x}% ${source.position.y}% C ${source.position.x}% ${(source.position.y + skill.position.y)/2}%, ${skill.position.x}% ${(source.position.y + skill.position.y)/2}%, ${skill.position.x}% ${skill.position.y}%`}
                                stroke="url(#line-gradient)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5 5"
                                className={isUnlocked ? 'text-dark-gold' : 'text-gray-600'}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        );
                    })
                ))}
            </svg>
            <div className="relative w-full h-full min-w-[600px] min-h-[500px]">
                {skills.map(skill => (
                    <motion.div
                        key={skill.id}
                        className="absolute cursor-pointer"
                        style={{ left: `${skill.position.x}%`, top: `${skill.position.y}%`, transform: 'translate(-50%, -50%)' }}
                        onClick={() => setSelectedNode(skill)}
                        whileHover={{ scale: 1.1 }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (skill.position.y / 100) }}
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-center p-2 shadow-lg transition-all ${levelConfig[skill.level].fill} ${levelConfig[skill.level].textColor} border-4 ${levelConfig[skill.level].color}`}>
                            <span className="text-xs font-bold leading-tight">{skill.name}</span>
                            {skill.level === 0 && <Lock size={24} className="absolute text-gray-400" />}
                        </div>
                    </motion.div>
                ))}
            </div>
             <AnimatePresence>
                {selectedNode && (
                     <motion.div
                        className="absolute bottom-4 left-4 right-4 z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                     >
                        <Card className="bg-light-primary/80 dark:bg-dark-primary/80 backdrop-blur-sm">
                            <button onClick={() => setSelectedNode(null)} className="absolute top-2 right-2 p-1">&times;</button>
                            <h3 className="font-bold text-lg mb-1">{selectedNode.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{selectedNode.description}</p>
                            {selectedNode.level > 0 ? (
                                <div>
                                    <div className="flex justify-between text-sm font-semibold mb-1">
                                        <span className={`${levelConfig[selectedNode.level].textColor}`}>{['', 'Bronze', 'Silver', 'Gold'][selectedNode.level]} - Level {selectedNode.level}</span>
                                        <span>{selectedNode.xp} / {selectedNode.xpToNextLevel} XP</span>
                                    </div>
                                    <div className="w-full bg-light-secondary dark:bg-dark-secondary rounded-full h-2">
                                        <div className={`h-2 rounded-full ${levelConfig[selectedNode.level].fill}`} style={{ width: `${(selectedNode.xp/selectedNode.xpToNextLevel)*100}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 p-2">
                                    <Lock className="mx-auto mb-1" />
                                    <p>Locked</p>
                                    <p className="text-xs">Complete prerequisite skills to unlock.</p>
                                </div>
                            )}
                        </Card>
                     </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default SkillTree;