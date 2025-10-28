import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DUMMY_SCENARIOS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { ScenarioTemplate, ScenarioLevel } from '../../types';
import { List, Map as MapIcon, Search, Sparkles, X, Plus } from 'lucide-react';
import ScenarioCard from '../../components/dashboard/scenarios/ScenarioCard';
import ScenarioMap from '../../components/dashboard/scenarios/ScenarioMap';
import { Card } from '../../components/ui/Card';
import CreateScenarioModal from '../../components/dashboard/scenarios/CreateScenarioModal';


const ScenarioPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'map'>('list');
    const [levelFilter, setLevelFilter] = useState<'All' | ScenarioLevel>('All');
    const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredScenarios = useMemo(() => {
        return DUMMY_SCENARIOS.filter(s => {
            const matchesLevel = levelFilter === 'All' || s.level === levelFilter;
            const matchesSearch = !searchTerm ||
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesLevel && matchesSearch;
        });
    }, [searchTerm, levelFilter]);
    
    const jobTypes = useMemo(() => {
        const uniqueJobTypes = [...new Set(DUMMY_SCENARIOS.map(s => s.jobType))];
        return uniqueJobTypes.sort();
    }, []);
    const levels = Object.values(ScenarioLevel);

    const handleSelectScenario = useCallback((id: string) => {
        setSelectedScenarioId(prevId => prevId === id ? null : id);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-2">Training Scenarios</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Select a scenario to test your intuition and decision-making skills.</p>
            
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div className="relative group w-full md:w-1/2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 transition-colors group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search scenarios by name, job, or tag..."
                        className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border-2 border-transparent focus:border-light-accent dark:focus:border-dark-accent rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:bg-light-primary dark:focus:bg-dark-primary transition-all duration-300 shadow-sm focus:shadow-md"
                        aria-label="Search scenarios"
                    />
                    <AnimatePresence>
                    {searchTerm && (
                        <motion.div 
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <button
                                onClick={() => setSearchTerm('')}
                                className="p-1.5 rounded-full text-gray-500 hover:text-light-text dark:hover:text-dark-text hover:bg-light-primary dark:hover:bg-dark-primary/50 transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                <div className="hidden md:flex items-center space-x-1 p-1 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                    <button onClick={() => setView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-light-primary dark:bg-dark-primary shadow' : 'hover:bg-light-primary/50 dark:hover:bg-dark-primary/50'}`} aria-label="List View">
                        <List size={20} />
                    </button>
                    <button onClick={() => setView('map')} className={`p-2 rounded-md transition-colors ${view === 'map' ? 'bg-light-primary dark:bg-dark-primary shadow' : 'hover:bg-light-primary/50 dark:hover:bg-dark-primary/50'}`} aria-label="Map View">
                        <MapIcon size={20} />
                    </button>
                </div>
            </div>

            {view === 'list' && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {(['All', ...Object.values(ScenarioLevel)] as const).map(level => (
                        <Button
                            key={level}
                            variant={levelFilter === level ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setLevelFilter(level)}
                            className="transition-all"
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            )}

            {view === 'list' ? (
                 <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                 >
                    <motion.div variants={itemVariants}>
                        <Card 
                            className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-light-accent dark:border-dark-accent hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 cursor-pointer transition-colors"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-light-accent/20 dark:bg-dark-accent/20 mb-4">
                                <Plus size={32} className="text-light-accent dark:text-dark-accent" />
                            </div>
                            <h3 className="text-xl font-bold">Create Custom Scenario</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Use AI or build from scratch</p>
                        </Card>
                    </motion.div>
                    {filteredScenarios.map(scenario => (
                        <motion.div key={scenario.id} variants={itemVariants}>
                            <ScenarioCard 
                                scenario={scenario}
                                isSelected={selectedScenarioId === scenario.id}
                                onSelect={handleSelectScenario}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <ScenarioMap />
            )}
             <CreateScenarioModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                jobTypes={jobTypes}
                levels={levels}
            />
        </div>
    );
};

export default ScenarioPage;