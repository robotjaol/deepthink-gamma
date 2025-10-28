import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { getNoteSuggestion } from '../../../services/geminiService';
import { StickyNote, Sparkles, Loader2, Save, Bell, X } from 'lucide-react';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { Note } from '../../../types';

interface NoteEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    onSave: (content: string, reminderAt: Date | null) => void;
}

const NoteEditorModal: React.FC<NoteEditorModalProps> = ({ isOpen, onClose, note, onSave }) => {
    const [noteText, setNoteText] = useState('');
    const [reminder, setReminder] = useState<Date | null>(null);
    const [suggestion, setSuggestion] = useState('');
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (note) {
            setNoteText(note.content);
            setReminder(note.reminderAt || null);
        } else {
            setNoteText('');
            setReminder(null);
        }
        setSuggestion('');
        setError('');
    }, [note, isOpen]);

    const handleGetSuggestion = async () => {
        if (!noteText.trim()) return;
        setIsLoadingSuggestion(true);
        setSuggestion('');
        setError('');
        try {
            const result = await getNoteSuggestion(noteText, 'English');
            setSuggestion(result);
        } catch (err) {
            setError('Failed to get AI suggestion. Please try again.');
        } finally {
            setIsLoadingSuggestion(false);
        }
    };

    const handleSave = () => {
        onSave(noteText, reminder);
        onClose();
    };
    
    const setReminderInHours = (hours: number) => {
        const newReminder = new Date();
        newReminder.setHours(newReminder.getHours() + hours);
        setReminder(newReminder);
    }
    
    const setReminderTomorrow = () => {
        const newReminder = new Date();
        newReminder.setDate(newReminder.getDate() + 1);
        newReminder.setHours(9, 0, 0, 0); // Tomorrow at 9 AM
        setReminder(newReminder);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <div className="flex items-center space-x-3 mb-6">
                <StickyNote size={28} />
                <h2 className="text-3xl font-bold">{note ? 'Edit Note' : 'Create Note'}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={12}
                        className="w-full bg-light-secondary dark:bg-dark-secondary border border-gray-300 dark:border-gray-600 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                        placeholder="Jot down your thoughts, ideas, or reminders here..."
                    />
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reminder
                        </label>
                        {reminder ? (
                             <div className="flex items-center justify-between p-2 bg-light-secondary dark:bg-dark-secondary rounded-md">
                                <span className="text-sm font-medium text-light-accent dark:text-dark-accent flex items-center gap-2">
                                    <Bell size={16} />
                                    {reminder.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <Button size="sm" variant="ghost" onClick={() => setReminder(null)}>
                                    <X size={16} className="text-gray-500"/>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setReminderInHours(1)}>In 1 hour</Button>
                                <Button type="button" variant="secondary" size="sm" onClick={() => setReminderTomorrow()}>Tomorrow</Button>
                            </div>
                        )}
                    </div>
                     <div className="mt-6 flex justify-between">
                        <Button onClick={handleGetSuggestion} disabled={isLoadingSuggestion || !noteText.trim()} variant="secondary">
                            {isLoadingSuggestion ? (
                                <><Loader2 size={16} className="mr-2 animate-spin" /> Thinking...</>
                            ) : (
                                <><Sparkles size={16} className="mr-2" /> AI Suggestion</>
                            )}
                        </Button>
                        <Button onClick={handleSave} disabled={!noteText.trim()}>
                            <Save size={16} className="mr-2" />
                            Save Note
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">AI Suggestion</h3>
                    <Card className="flex-grow flex items-center justify-center min-h-[200px] lg:min-h-0">
                        <AnimatePresence mode="wait">
                            {isLoadingSuggestion ? (
                                <motion.div key="loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><LoadingSpinner /></motion.div>
                            ) : error ? (
                                <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-red-500 text-center"><p>{error}</p></motion.div>
                            ) : suggestion ? (
                                <motion.p key="suggestion" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-light-text dark:text-dark-text italic">"{suggestion}"</motion.p>
                            ) : (
                                <motion.p key="placeholder" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-gray-400 text-center">Write a note and click for an AI-powered suggestion.</motion.p>
                            )}
                        </AnimatePresence>
                    </Card>
                </div>
            </div>
        </Modal>
    );
};

export default NoteEditorModal;
