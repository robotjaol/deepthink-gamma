

import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { generateCustomScenario } from '../../../services/geminiService';
import { ScenarioLevel, ScenarioTemplate } from '../../../types';
import { Loader2, Sparkles, BrainCircuit, ChevronDown, Save } from 'lucide-react';
import { Card } from '../../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarios } from '../../../contexts/ScenarioContext';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';

interface CreateScenarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTypes: string[];
    levels: ScenarioLevel[];
}

const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({ isOpen, onClose, levels }) => {
    const { addMyScenario } = useScenarios();
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    const [jobType, setJobType] = useState('');
    const [level, setLevel] = useState<ScenarioLevel>(ScenarioLevel.Newbie);
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedScenario, setGeneratedScenario] = useState<Omit<ScenarioTemplate, 'id'> | null>(null);
    
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setGeneratedScenario(null);
        try {
            const result = await generateCustomScenario(jobType, level, topic);
            setGeneratedScenario(result);
        } catch (err) {
            console.error(err);
            setError('Failed to generate scenario. The AI might be busy. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = (scenarioData: Omit<ScenarioTemplate, 'id'>) => {
        const newScenario: ScenarioTemplate = {
            ...scenarioData,
            id: `custom-${Date.now()}`,
            authorId: user?.id,
            authorName: user?.name,
            authorProfilePictureUrl: user?.profilePictureUrl,
            isPublished: false,
            createdAt: new Date(),
        };
        addMyScenario(newScenario);
        addNotification('Your custom scenario has been saved!', 'success', 'Scenario Created');
        handleClose();
    };

    const handleClose = () => {
        setJobType(''); setLevel(ScenarioLevel.Newbie); setTopic('');
        setIsLoading(false); setError(''); setGeneratedScenario(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <div className="flex items-center space-x-3 mb-2">
                <BrainCircuit size={28} />
                <h2 className="text-3xl font-bold">Create a Scenario with AI</h2>
            </div>
             <p className="text-gray-500 dark:text-gray-400 mb-6">
                Describe the challenge you want to face, and let AI build it for you.
            </p>

            <AnimatePresence mode="wait">
                {generatedScenario ? (
                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-xl font-bold mb-4">AI Generated Preview</h3>
                        <Card className="bg-light-secondary dark:bg-dark-secondary p-6">
                            <h4 className="text-lg font-semibold">{generatedScenario.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{generatedScenario.jobType} - {generatedScenario.level}</p>
                            <p className="mb-3">{generatedScenario.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {generatedScenario.tags.map(tag => <span key={tag} className="text-xs bg-light-primary dark:bg-dark-primary px-2 py-1 rounded-md">{tag}</span>)}
                            </div>
                        </Card>
                        <div className="mt-6 flex justify-end gap-4">
                            <Button variant="secondary" onClick={() => setGeneratedScenario(null)}>Regenerate</Button>
                            <Button onClick={() => handleSave(generatedScenario)}><Save size={16} className="mr-2" /> Save Scenario</Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <Input label="Job or Field" id="ai-jobType" value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="e.g., Software Engineer" required />
                            <Input label="Topic or Challenge" id="ai-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., A sudden server outage" required />
                            <Select label="Difficulty Level" value={level} onChange={(e) => setLevel(e.target.value as ScenarioLevel)} options={levels} />
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="pt-2 flex justify-end">
                                <Button type="submit" disabled={isLoading || !jobType || !topic}>
                                    {isLoading ? <><Loader2 size={20} className="mr-2 animate-spin" /> Generating...</> : <><Sparkles size={20} className="mr-2" /> Generate</>}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

const Select: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{label}</label>
        <div className="relative">
            <select value={value} onChange={onChange} className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border-2 border-light-accent/30 dark:border-dark-accent/30 rounded-lg py-3 px-4 focus:outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors appearance-none">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    </div>
);

export default CreateScenarioModal;