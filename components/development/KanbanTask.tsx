import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Edit, Trash2, Calendar, MoreVertical, Check, GripVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import Modal from '../ui/Modal';

interface KanbanTaskProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    isJustCompleted: boolean;
}

const priorityStyles = {
    [TaskPriority.High]: 'bg-red-500',
    [TaskPriority.Medium]: 'bg-yellow-500',
    [TaskPriority.Low]: 'bg-green-500',
};

const KanbanTask: React.FC<KanbanTaskProps> = ({ task, onEdit, onDelete, isJustCompleted }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    const handleDeleteRequest = () => {
        setIsMenuOpen(false);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        onDelete(task.id);
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
            >
                <div
                    draggable={task.status !== TaskStatus.Done}
                    onDragStart={handleDragStart}
                    className="bg-light-primary dark:bg-dark-secondary rounded-lg p-3 shadow-md relative flex items-center gap-3 group transition-shadow hover:shadow-lg"
                >
                    <AnimatePresence>
                        {isJustCompleted && (
                            <motion.div
                                key="complete-check"
                                className="absolute inset-0 flex items-center justify-center pointer-events-none bg-purple-500/20 rounded-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [1, 1, 0], scale: [1, 1.2, 0.8] }}
                                transition={{ duration: 2, ease: 'easeInOut', times: [0, 0.7, 1] }}
                            >
                                <Check size={40} className="text-purple-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Drag Handle */}
                    <div className={`flex-shrink-0 text-gray-400 ${task.status !== TaskStatus.Done ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}`}>
                        <GripVertical size={20} />
                    </div>

                    {/* Priority Bar */}
                    <div className={`w-1 h-10 rounded-full ${priorityStyles[task.priority]}`}></div>

                    {/* Task Content */}
                    <div className="flex-grow">
                        <p className={`font-medium ${task.status === TaskStatus.Done ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="font-bold text-blue-500 dark:text-blue-400">{task.xp} XP</span>
                            {task.dueDate && (
                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <Calendar size={14} />
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu Button */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 rounded-full text-gray-400 hover:text-light-text dark:hover:text-dark-text hover:bg-light-secondary dark:hover:bg-dark-primary">
                                <MoreVertical size={18} />
                            </button>
                            <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute right-0 mt-1 w-32 bg-light-primary dark:bg-dark-primary rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                                    onMouseLeave={() => setIsMenuOpen(false)}
                                >
                                    <button onClick={() => { onEdit(task); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-light-secondary dark:hover:bg-dark-secondary disabled:opacity-50" disabled={task.status === TaskStatus.Done}>
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button onClick={handleDeleteRequest} className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-red-500 hover:bg-red-500/10">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
                <div className="text-center p-4">
                    <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Are you sure you want to delete this task? This action cannot be undone.</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default React.memo(KanbanTask);