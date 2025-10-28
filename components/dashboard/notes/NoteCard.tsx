import React from 'react';
import { Card } from '../../ui/Card';
import { motion } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { Note } from '../../../types';

interface NoteCardProps {
    note: Note;
    onClick: () => void;
    onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
        >
            <Card 
                className="relative h-full flex flex-col justify-between hover:-translate-y-1 cursor-pointer p-4 group"
                onClick={onClick}
            >
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow mb-4 whitespace-pre-wrap break-words">{note.content}</p>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
                    {note.reminderAt && new Date(note.reminderAt) > new Date() && (
                        <div className="flex items-center text-yellow-600 dark:text-yellow-400 mb-1">
                            <Bell size={12} className="mr-1" />
                            <span>Reminds on {new Date(note.reminderAt).toLocaleDateString()}</span>
                        </div>
                    )}
                    Created: {note.createdAt.toLocaleDateString()}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete note"
                >
                    <X size={16} />
                </button>
            </Card>
        </motion.div>
    );
};

// FIX: Added a default export to make the component importable in NotesPage.tsx.
export default NoteCard;
