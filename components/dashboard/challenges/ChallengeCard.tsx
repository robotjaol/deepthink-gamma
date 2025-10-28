

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ScenarioTemplate, ScenarioLevel } from '../../../types';
import { motion } from 'framer-motion';
import { Share2, Star, Users, Target, Trash2, Pencil, BarChart2 } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotifications';
import { useScenarios } from '../../../contexts/ScenarioContext';
import { GlowingEffect } from '../../ui/glowing-effect';

interface ChallengeCardProps {
    scenario: ScenarioTemplate;
    isMyCreation: boolean;
    onPublish: (scenarioId: string) => void;
    onDelete?: (scenarioId: string) => void;
}

const levelConfig = {
    [ScenarioLevel.Newbie]: { label: 'Newbie', color: 'bg-green-500 text-green-50', ring: 'ring-green-500/30' },
    [ScenarioLevel.Expert]: { label: 'Expert', color: 'bg-blue-500 text-blue-50', ring: 'ring-blue-500/30' },
    [ScenarioLevel.Specialist]: { label: 'Specialist', color: 'bg-purple-500 text-purple-50', ring: 'ring-purple-500/30' },
};

const MyCreationCardView: React.FC<Omit<ChallengeCardProps, 'isMyCreation'>> = ({ scenario, onPublish, onDelete }) => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const handleStart = () => {
        if (!scenario.questions || scenario.questions.length === 0) {
            addNotification('This scenario needs questions before it can be played.', 'error', 'Missing Questions');
            return;
        }
        navigate(`/dashboard/scenario/${scenario.id}`, { state: { customScenario: scenario } });
    };

    const handlePublish = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPublish(scenario.id);
        addNotification(`'${scenario.name}' has been published!`, 'success', 'Challenge Live');
    };

    return (
        <div className="p-5 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{scenario.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${levelConfig[scenario.level].color}`}>{levelConfig[scenario.level].label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{scenario.jobType}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-3 h-10 line-clamp-2">{scenario.description}</p>
                <div className="flex flex-wrap gap-1.5">
                    {scenario.tags.map(tag => (
                        <span key={tag} className="text-xs bg-light-secondary dark:bg-dark-secondary px-2 py-1 rounded-md font-medium">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
                <Button size="sm" onClick={handleStart} className="flex-1">Start</Button>
                <div className="flex">
                    {scenario.isPublished ? (
                        <>
                            <Button variant="secondary" size="sm" title="View Stats" onClick={() => addNotification('Statistics page coming soon!', 'info')}><BarChart2 size={16}/></Button>
                            <Button variant="secondary" size="sm" title="Edit" className="ml-2" onClick={() => addNotification('Editing published challenges is not yet supported.', 'info')}><Pencil size={16}/></Button>
                        </>
                    ) : (
                        <Button variant="secondary" size="sm" onClick={handlePublish} title="Publish"><Share2 size={16}/></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete?.(scenario.id); }} title="Delete" className="ml-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/10">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const CommunityCardView: React.FC<Omit<ChallengeCardProps, 'isMyCreation' | 'onDelete'>> = ({ scenario }) => {
    const navigate = useNavigate();
    const { favoriteIds, toggleFavorite } = useScenarios();
    const isFavorited = favoriteIds.includes(scenario.id);
    
    // Dummy stats for UI richness
    const completions = useMemo(() => Math.floor(Math.random() * 2500) + 100, [scenario.id]);
    const avgScore = useMemo(() => Math.floor(Math.random() * 15) + 78, [scenario.id]);
    const favoriteCount = useMemo(() => Math.floor(Math.random() * 150) + (isFavorited ? 1 : 0), [scenario.id, isFavorited]);

    const handleStart = () => {
        navigate(`/dashboard/scenario/${scenario.id}`, { state: { customScenario: scenario } });
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(scenario.id);
    };

    return (
        <div className="p-5 flex flex-col h-full">
            <div className="flex-grow">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                        <img src={scenario.authorProfilePictureUrl} alt={scenario.authorName} className="w-9 h-9 rounded-full" />
                        <span className="font-semibold">{scenario.authorName}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${levelConfig[scenario.level].color}`}>{levelConfig[scenario.level].label}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">{scenario.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 line-clamp-2">{scenario.description}</p>
                
                <div className="flex items-center justify-around text-center my-4 py-3 bg-light-secondary/50 dark:bg-dark-secondary/50 rounded-lg">
                    <div title="Completions">
                        <Users size={20} className="mx-auto text-gray-500"/>
                        <p className="text-sm font-bold">{completions.toLocaleString()}</p>
                    </div>
                    <div title="Average Score">
                        <Target size={20} className="mx-auto text-gray-500"/>
                        <p className="text-sm font-bold">{avgScore}/100</p>
                    </div>
                    <button onClick={handleFavorite} className="flex flex-col items-center text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors" title="Favorite">
                        <Star size={20} className={`transition-all ${isFavorited ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        <p className="text-sm font-bold">{favoriteCount}</p>
                    </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {scenario.tags.map(tag => (
                        <span key={tag} className="text-xs bg-light-secondary dark:bg-dark-secondary px-2 py-1 rounded-md font-medium">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button className="w-full" onClick={handleStart}>
                    Start Challenge
                </Button>
            </div>
        </div>
    );
};


const ChallengeCard: React.FC<ChallengeCardProps> = (props) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <motion.div variants={itemVariants} className="h-full">
            <Card className="relative isolate h-full flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 p-0 overflow-hidden">
                <GlowingEffect disabled={false} />
                {props.isMyCreation ? <MyCreationCardView {...props} /> : <CommunityCardView {...props} />}
            </Card>
        </motion.div>
    );
};

export default React.memo(ChallengeCard);