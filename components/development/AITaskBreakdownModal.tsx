import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { breakdownTask } from '../../services/geminiService';
import { Task } from '../../types';
import { Loader2, Sparkles, Brain, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AITaskBreakdownModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTasks: (tasks: Pick<Task, 'title' | 'xp'>[]) => void;
}

const AITaskBreakdownModal: React.FC<AITaskBreakdownModalProps> = ({ isOpen, onClose, onAddTasks }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [subtasks, setSubtasks] = useState<Pick<Task, 'title' | 'xp'>[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Pick<Task, 'title' | 'xp'>[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;
        setIsLoading(true);
        setError('');
        setSubtasks([]);
        try {
            const result = await breakdownTask(taskTitle);
            setSubtasks(result);
            setSelectedTasks(result); // Select all by default
        } catch (err) {
            setError('Failed to break down task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleTask = (task: Pick<Task, 'title' | 'xp'>) => {
        setSelectedTasks(prev => 
            prev.some(t => t.title === task.title)
                ? prev.filter(t => t.title !== task.title)
                : [...prev, task]
        );
    };

    const handleAddSelectedTasks = () => {
        onAddTasks(selectedTasks);
        handleClose();
    };

    const handleClose = () => {
        setTaskTitle('');
        setIsLoading(false);
        setError('');
        setSubtasks([]);
        setSelectedTasks([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <div className="flex items-center space-x-3 mb-2">
                <Brain size={28} />
                <h2 className="text-3xl font-bold">AI Task Breakdown</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Enter a large or complex task, and let AI break it down into smaller, manageable steps for you.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    placeholder="e.g., Launch new marketing website..."
                    className="flex-grow bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                    required
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                </Button>
            </form>

            <div className="min-h-[200px] bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <p>AI is thinking...</p>
                        </motion.div>
                    ) : error ? (
                         <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-red-500">
                            <AlertTriangle size={32} className="mb-2" />
                            <p>{error}</p>
                        </motion.div>
                    ) : subtasks.length > 0 ? (
                        <motion.div key="results">
                            <h3 className="font-semibold mb-2">Suggested Sub-tasks:</h3>
                            <div className="space-y-2">
                                {subtasks.map((task, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleToggleTask(task)}
                                        className="flex items-center gap-3 p-3 bg-light-primary dark:bg-dark-primary rounded-md cursor-pointer hover:bg-light-accent/10 dark:hover:bg-dark-accent/10"
                                    >
                                        <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors ${selectedTasks.some(t => t.title === task.title) ? 'bg-light-accent dark:bg-dark-accent border-transparent' : 'border-gray-300 dark:border-gray-600'}`}>
                                            {selectedTasks.some(t => t.title === task.title) && <Check size={14} className="text-white dark:text-black" />}
                                        </div>
                                        <span className="flex-grow">{task.title}</span>
                                        <span className="text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{task.xp} XP</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                         <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full text-gray-500">
                            <p>Your generated sub-tasks will appear here.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddSelectedTasks} disabled={selectedTasks.length === 0}>
                    Add {selectedTasks.length > 0 ? `${selectedTasks.length} ` : ''}Tasks
                </Button>
            </div>
        </Modal>
    );
};

export default AITaskBreakdownModal;
