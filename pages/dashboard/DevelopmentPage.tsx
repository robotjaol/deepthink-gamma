import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Brain, Filter, ListChecks, Check } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import GamificationHeader from '../../components/development/GamificationHeader';
import TaskModal from '../../components/development/TaskModal';
import { useNotifications } from '../../hooks/useNotifications';
import KanbanColumn from '../../components/development/KanbanColumn';
import AITaskBreakdownModal from '../../components/development/AITaskBreakdownModal';

// --- Configuration ---
const XP_PER_LEVEL = 100;
const LOCAL_STORAGE_KEYS = {
    TASKS: 'devhub_tasks',
    PROGRESS: 'devhub_progress'
};

// --- Initial Data ---
const initialTasks: Task[] = [
    { id: 'task-1', title: 'Setup project structure', priority: TaskPriority.High, status: TaskStatus.Done, dueDate: null, xp: 20 },
    { id: 'task-2', title: 'Design the main dashboard', priority: TaskPriority.High, status: TaskStatus.Done, dueDate: '2024-08-15', xp: 50 },
    { id: 'task-3', title: 'Implement authentication', priority: TaskPriority.Medium, status: TaskStatus.InProgress, dueDate: '2024-08-20', xp: 40 },
    { id: 'task-4', title: 'Deploy to staging', priority: TaskPriority.Low, status: TaskStatus.ToDo, dueDate: null, xp: 15 },
];

const initialProgress = { level: 1, xp: 20 };

// --- Main Component ---
const DevelopmentPage: React.FC = () => {
    const { addNotification } = useNotifications();
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
            return saved ? JSON.parse(saved) : initialTasks;
        } catch { return initialTasks; }
    });

    const [progress, setProgress] = useState<{ level: number, xp: number }>(() => {
         try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS);
            return saved ? JSON.parse(saved) : initialProgress;
        } catch { return initialProgress; }
    });
    
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isAIBreakdownModalOpen, setIsAIBreakdownModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
    
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    }, [tasks, progress]);

    const handleLevelUp = useCallback((newXp: number, currentLevel: number) => {
        let level = currentLevel;
        let xp = newXp;
        while (xp >= XP_PER_LEVEL) {
            xp -= XP_PER_LEVEL;
            level++;
            addNotification(`You've reached Level ${level}!`, 'success', 'Level Up!');
        }
        return { level, xp };
    }, [addNotification]);
    
    const updateTaskStatus = useCallback((id: string, newStatus: TaskStatus) => {
        setTasks(currentTasks => {
            const task = currentTasks.find(t => t.id === id);
            if (!task || task.status === newStatus) return currentTasks;

            if (newStatus === TaskStatus.Done && task.status !== TaskStatus.Done) {
                setJustCompletedId(id);
                setTimeout(() => setJustCompletedId(null), 2000);
                const newTotalXp = progress.xp + task.xp;
                const { level, xp } = handleLevelUp(newTotalXp, progress.level);
                setProgress({ level, xp });
                addNotification(`+${task.xp} XP`, 'info', 'Task Completed!');
            }
            else if (newStatus !== TaskStatus.Done && task.status === TaskStatus.Done) {
                let newTotalXp = Math.max(0, progress.xp - task.xp);
                setProgress(prev => ({ ...prev, xp: newTotalXp }));
            }
            
            return currentTasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
        });
    }, [progress, handleLevelUp, addNotification]);

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'status'>, id?: string) => {
        if (id) {
            setTasks(tasks.map(t => t.id === id ? { ...t, ...taskData } : t));
            addNotification('Your changes have been saved.', 'success', 'Task Updated');
        } else {
            const newTask: Task = { id: `task-${Date.now()}`, status: TaskStatus.ToDo, ...taskData };
            setTasks([newTask, ...tasks]);
            addNotification('The new task is ready.', 'success', 'Task Added');
        }
    };

    const addMultipleTasks = (newTasks: Pick<Task, 'title' | 'xp'>[]) => {
        const tasksToAdd: Task[] = newTasks.map((t, i) => ({
            ...t,
            id: `task-ai-${Date.now()}-${i}`,
            status: TaskStatus.ToDo,
            priority: TaskPriority.Medium,
            dueDate: null,
        }));
        setTasks(prev => [...tasksToAdd, ...prev]);
        addNotification(`${tasksToAdd.length} new tasks added by AI.`, 'success', 'Tasks Generated');
    };
    
    const handleDeleteTask = useCallback((id: string) => {
        setTasks(tasks => tasks.filter(t => t.id !== id));
        addNotification('The task has been removed.', 'info', 'Task Removed');
    }, [addNotification]);

    const handleEditTask = useCallback((task: Task) => {
        setTaskToEdit(task);
        setIsTaskModalOpen(true);
    }, []);

    const filteredTasks = useMemo(() => {
        if (priorityFilter === 'All') return tasks;
        return tasks.filter(task => task.priority === priorityFilter);
    }, [tasks, priorityFilter]);

    const columns = useMemo(() => ({
        [TaskStatus.ToDo]: filteredTasks.filter(t => t.status === TaskStatus.ToDo),
        [TaskStatus.InProgress]: filteredTasks.filter(t => t.status === TaskStatus.InProgress),
        [TaskStatus.Done]: filteredTasks.filter(t => t.status === TaskStatus.Done),
    }), [filteredTasks]);

    return (
        <div>
            <header className="mb-6">
                 <div className="flex justify-between items-center flex-wrap gap-4">
                     <div>
                        <h1 className="text-4xl font-bold flex items-center">
                            <ListChecks size={36} className="mr-3 text-light-accent dark:text-dark-accent" />
                            Task Hub
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                            Organize your work, track progress, and level up your skills.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="secondary" onClick={() => setIsAIBreakdownModalOpen(true)}>
                            <Brain size={16} className="mr-2" />
                            Breakdown with AI
                        </Button>
                        <Button onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}>
                            <Plus size={20} className="mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>
                 <div className="mt-4 flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <span className="text-sm font-semibold mr-2">Filter by Priority:</span>
                    {(['All', ...Object.values(TaskPriority)] as const).map(p => (
                        <button key={p} onClick={() => setPriorityFilter(p)} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${priorityFilter === p ? 'bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-primary' : 'bg-light-secondary dark:bg-dark-secondary'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </header>

            <div>
                <GamificationHeader level={progress.level} xp={progress.xp} xpToNextLevel={XP_PER_LEVEL} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(TaskStatus).map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        tasks={columns[status]}
                        onTaskDrop={(taskId, newStatus) => updateTaskStatus(taskId, newStatus)}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        justCompletedId={justCompletedId}
                    />
                ))}
            </div>
            
            <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} taskToEdit={taskToEdit} />
            <AITaskBreakdownModal isOpen={isAIBreakdownModalOpen} onClose={() => setIsAIBreakdownModalOpen(false)} onAddTasks={addMultipleTasks} />
        </div>
    );
};

export default DevelopmentPage;