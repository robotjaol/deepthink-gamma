import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskStatus } from '../../types';
import KanbanTask from './KanbanTask';

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    justCompletedId: string | null;
}

const statusConfig = {
    [TaskStatus.ToDo]: { title: 'To Do', color: 'bg-gray-400' },
    [TaskStatus.InProgress]: { title: 'In Progress', color: 'bg-blue-500' },
    [TaskStatus.Done]: { title: 'Done', color: 'bg-purple-500' },
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onTaskDrop, onEditTask, onDeleteTask, justCompletedId }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            onTaskDrop(taskId, status);
        }
        setIsHovered(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovered(true);
    };

    return (
        <div 
            className={`bg-light-secondary/70 dark:bg-dark-secondary/40 rounded-xl p-4 transition-colors ${isHovered ? 'bg-light-accent/20 dark:bg-dark-accent/20' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-300 dark:border-gray-700">
                <div className={`w-3 h-3 rounded-full ${statusConfig[status].color}`}></div>
                <h3 className="font-bold text-lg">{statusConfig[status].title}</h3>
                <span className="text-sm font-semibold bg-light-primary dark:bg-dark-primary px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            <div className="space-y-4 min-h-[200px]">
                <AnimatePresence>
                    {tasks.map(task => (
                        <KanbanTask
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            isJustCompleted={justCompletedId === task.id}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default KanbanColumn;