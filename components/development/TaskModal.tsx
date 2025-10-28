import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Task, TaskPriority } from '../../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'status'>, id?: string) => void;
    taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [dueDate, setDueDate] = useState('');
    const [xp, setXp] = useState('10');
    const [xpError, setXpError] = useState('');

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setPriority(taskToEdit.priority);
            setDueDate(taskToEdit.dueDate || '');
            setXp(taskToEdit.xp.toString());
        } else {
            setTitle('');
            setPriority(TaskPriority.Medium);
            setDueDate('');
            setXp('10');
        }
        setXpError('');
    }, [taskToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numXp = parseInt(xp, 10);
        if (isNaN(numXp) || numXp < 5 || numXp > 50) {
            setXpError('XP must be a number between 5 and 50.');
            return;
        }
        onSave({ title, priority, dueDate: dueDate || null, xp: numXp }, taskToEdit?.id);
        onClose();
    };
    
    const handleXpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setXp(value);
        const numValue = parseInt(value, 10);

        if (value === '' || isNaN(numValue) || numValue < 5 || numValue > 50) {
            setXpError('XP must be a number between 5 and 50.');
        } else {
            setXpError('');
        }
    };
    
    // Get today's date in YYYY-MM-DD format for the min attribute of date input
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Task Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Due Date"
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={today}
                    />
                    <div>
                        <Input
                            label="XP Reward (5-50)"
                            id="xp"
                            type="number"
                            value={xp}
                            onChange={handleXpChange}
                            min="5"
                            max="50"
                            required
                        />
                        {xpError && <p className="text-red-500 text-sm mt-1">{xpError}</p>}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Priority</label>
                    <div className="flex gap-2">
                        {Object.values(TaskPriority).map(p => (
                            <Button
                                key={p}
                                type="button"
                                variant={priority === p ? 'primary' : 'secondary'}
                                onClick={() => setPriority(p)}
                            >
                                {p}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!title.trim() || !!xpError}>Save Task</Button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskModal;