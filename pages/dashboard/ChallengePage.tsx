





import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarios } from '../../contexts/ScenarioContext';
import ChallengeCard from '../../components/dashboard/challenges/ChallengeCard';
import { Swords, User, Plus, Filter, Sparkles, Pencil, Search, Trash2 } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import ManualCreateModal from '../../components/dashboard/challenges/CreateChallengeModal';
import AiCreateModal from '../../components/dashboard/scenarios/CreateScenarioModal';
import { DUMMY_SCENARIOS } from '../../constants';
import { ScenarioLevel } from '../../types';
import { Button } from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { useNotifications } from '../../hooks/useNotifications';

const ChallengePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'community' | 'myCreations'>('community');
    const { myScenarios, publishedChallenges, publishScenario, removeMyScenario } = useScenarios();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    
    // Updated state management for modals
    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Search and Filter state
    const [levelFilter, setLevelFilter] = useState<'All' | ScenarioLevel>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const jobTypes = useMemo(() => {
        const uniqueJobTypes = [...new Set(DUMMY_SCENARIOS.map(s => s.jobType))];
        return uniqueJobTypes.sort();
    }, []);
    const levels = Object.values(ScenarioLevel);

    const filteredChallenges = useMemo(() => {
        let challenges = publishedChallenges;

        if (levelFilter !== 'All') {
            challenges = challenges.filter(c => c.level === levelFilter);
        }

        if (searchTerm.trim()) {
            const lowercasedSearch = searchTerm.toLowerCase();
            challenges = challenges.filter(c => 
                c.name.toLowerCase().includes(lowercasedSearch) ||
                c.description.toLowerCase().includes(lowercasedSearch) ||
                c.jobType.toLowerCase().includes(lowercasedSearch) ||
                c.tags.some(t => t.toLowerCase().includes(lowercasedSearch))
            );
        }

        return challenges;
    }, [publishedChallenges, levelFilter, searchTerm]);

    const handleDeleteRequest = (scenarioId: string) => {
        setDeleteTargetId(scenarioId);
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            removeMyScenario(deleteTargetId);
            addNotification('Challenge deleted successfully.', 'info', 'Deleted');
        }
        setDeleteTargetId(null);
    };

    const tabs = [
        { id: 'community', label: 'Community Challenges' },
        { id: 'myCreations', label: 'My Creations' },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold flex items-center">
                    <Swords size={36} className="mr-3 text-light-accent dark:text-dark-accent" />
                    Challenge Board
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                    Test your skills with scenarios created by the community, or create and publish your own.
                </p>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-3 px-4 text-sm font-semibold relative transition-colors ${activeTab === tab.id ? 'text-light-accent dark:text-dark-accent' : 'text-gray-500 hover:text-light-text dark:hover:text-dark-text'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-accent dark:bg-dark-accent"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {activeTab === 'community' && (
                    <motion.div 
                        className="flex flex-col sm:flex-row justify-between items-center gap-4 my-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                         <div className="relative w-full sm:w-1/2 md:w-1/3">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search challenges..."
                                className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border-2 border-transparent focus:border-light-accent dark:focus:border-dark-accent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:bg-light-primary dark:focus:bg-dark-primary transition-all duration-300 shadow-sm focus:shadow-md"
                                aria-label="Search challenges"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-500" />
                            <span className="text-sm font-semibold">Difficulty:</span>
                            {(['All', ...Object.values(ScenarioLevel)] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setLevelFilter(level)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${levelFilter === level ? 'bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-primary' : 'bg-light-secondary dark:bg-dark-secondary'}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                >
                    {activeTab === 'community' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChallenges.length > 0 ? (
                                filteredChallenges.map(scenario => (
                                    <ChallengeCard key={scenario.id} scenario={scenario} isMyCreation={false} onPublish={() => {}} />
                                ))
                            ) : (
                                <div className="col-span-full">
                                    <EmptyState 
                                        icon={<Swords size={48} />}
                                        title="No Challenges Found"
                                        message="No community challenges match your current search or filter. Try a different query."
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                    {activeTab === 'myCreations' && (
                         <div className="space-y-6">
                             <div className="flex justify-end">
                                <Button onClick={() => setIsChoiceModalOpen(true)}>
                                    <Plus size={20} className="mr-2"/>
                                    Create New Challenge
                                </Button>
                             </div>
                             <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {myScenarios.length > 0 ? (
                                    myScenarios.map(scenario => (
                                        <ChallengeCard key={scenario.id} scenario={scenario} isMyCreation={true} onPublish={publishScenario} onDelete={handleDeleteRequest} />
                                    ))
                                 ) : (
                                    <div className="col-span-full">
                                         <EmptyState 
                                            icon={<User size={48} />}
                                            title="You Haven't Created Any Scenarios"
                                            message="Click 'Create New Challenge' to build your first custom scenario."
                                        />
                                    </div>
                                 )}
                            </motion.div>
                         </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Creation Choice Modal */}
            <Modal isOpen={isChoiceModalOpen} onClose={() => setIsChoiceModalOpen(false)} size="lg">
                <h2 className="text-3xl font-bold text-center mb-8">How do you want to create?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card 
                        className="p-8 text-center cursor-pointer transition-all hover:ring-2 hover:ring-light-accent dark:hover:ring-dark-accent hover:scale-105"
                        onClick={() => {
                            setIsChoiceModalOpen(false);
                            setIsAiModalOpen(true);
                        }}
                    >
                        <Sparkles size={40} className="mx-auto mb-4 text-light-accent dark:text-dark-accent"/>
                        <h3 className="text-xl font-bold mb-2">Create with AI</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Let AI build a scenario for you based on a simple prompt.</p>
                    </Card>
                    <Card 
                        className="p-8 text-center cursor-pointer transition-all hover:ring-2 hover:ring-light-accent dark:hover:ring-dark-accent hover:scale-105"
                        onClick={() => {
                            setIsChoiceModalOpen(false);
                            setIsManualModalOpen(true);
                        }}
                    >
                        <Pencil size={40} className="mx-auto mb-4 text-light-accent dark:text-dark-accent"/>
                        <h3 className="text-xl font-bold mb-2">Create Manually</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Build a custom scenario from scratch, question by question.</p>
                    </Card>
                </div>
            </Modal>
            
            {/* Delete Confirmation Modal */}
             <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} size="md">
                <div className="text-center p-4">
                    <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Are you sure you want to delete this challenge? This action cannot be undone.</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>Cancel</Button>
                        <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white dark:text-white" onClick={confirmDelete}>Delete Challenge</Button>
                    </div>
                </div>
            </Modal>

            <ManualCreateModal 
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                jobTypes={jobTypes}
                levels={levels}
            />
            
            <AiCreateModal 
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                jobTypes={jobTypes}
                levels={levels}
            />
        </div>
    );
};

export default ChallengePage;