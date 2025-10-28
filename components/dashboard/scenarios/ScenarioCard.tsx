import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ScenarioTemplate, ScenarioLevel } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowingEffect } from '../../ui/glowing-effect';

interface ScenarioCardProps {
    scenario: ScenarioTemplate;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, isSelected, onSelect }) => {
    const navigate = useNavigate();
    const levelColor = {
        [ScenarioLevel.Newbie]: 'bg-green-500',
        [ScenarioLevel.Expert]: 'bg-blue-500',
        [ScenarioLevel.Specialist]: 'bg-purple-500',
    };

    return (
        <motion.div layout className="h-full">
            <Card 
                className={`relative isolate flex flex-col justify-between transition-all duration-300 h-full cursor-pointer ${isSelected ? 'ring-2 ring-light-accent dark:ring-dark-accent scale-105 shadow-xl' : 'hover:-translate-y-1'}`}
                onClick={() => onSelect(scenario.id)}
            >
                <GlowingEffect disabled={false}/>
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{scenario.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${levelColor[scenario.level]}`}>{scenario.level}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">For: {scenario.jobType}</p>
                    <p className="text-base mb-4">{scenario.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {scenario.tags.map(tag => (
                            <span key={tag} className="text-xs bg-light-primary dark:bg-dark-primary px-2 py-1 rounded-md">{tag}</span>
                        ))}
                    </div>
                </div>
                <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button 
                            className="w-full" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                navigate(`/dashboard/scenario/${scenario.id}`); 
                            }}
                        >
                            Start Scenario
                        </Button>
                    </motion.div>
                )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
};

export default React.memo(ScenarioCard);