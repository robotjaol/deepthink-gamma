import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DUMMY_NOTES } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, StickyNote } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import NoteCard from '../../components/dashboard/notes/NoteCard';
import NoteEditorModal from '../../components/dashboard/notes/NoteEditorModal';
import Modal from '../../components/ui/Modal';
import { Note } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';
import EmptyState from '../../components/ui/EmptyState';

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>(DUMMY_NOTES);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
    const { addNotification } = useNotifications();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            let changed = false;
            const updatedNotes = notes.map(note => {
                if (note.reminderAt && new Date(note.reminderAt) <= now) {
                    addNotification(`"${note.content.substring(0, 30)}..."`, 'info', 'Note Reminder');
                    changed = true;
                    return { ...note, reminderAt: null }; // Clear reminder after notifying
                }
                return note;
            });

            if (changed) {
                setNotes(updatedNotes);
            }
        }, 15000); // Check every 15 seconds

        return () => clearInterval(interval);
    }, [notes, addNotification]);

    const openEditorModal = useCallback((note: Note | null) => {
        setSelectedNote(note);
        setIsEditorModalOpen(true);
    }, []);

    const closeEditorModal = () => {
        setIsEditorModalOpen(false);
        setSelectedNote(null);
    };

    const handleSaveNote = (content: string, reminderAt: Date | null) => {
        if (selectedNote) {
            // Edit existing note
            setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content, reminderAt, createdAt: new Date() } : n));
        } else {
            // Create new note
            const newNote: Note = {
                id: `note-${Date.now()}`,
                content,
                createdAt: new Date(),
                reminderAt,
            };
            setNotes([newNote, ...notes]);
        }
    };

    const handleDeleteRequest = useCallback((note: Note) => {
        setNoteToDelete(note);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = () => {
        if (noteToDelete) {
            setNotes(notes.filter(note => note.id !== noteToDelete.id));
        }
        setIsDeleteModalOpen(false);
        setNoteToDelete(null);
    };

    const filteredNotes = useMemo(() => {
        return notes.filter(note =>
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [notes, searchTerm]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold">My Notes</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                        />
                    </div>
                    <Button onClick={() => openEditorModal(null)}>
                        <Plus size={20} className="mr-2" />
                        New Note
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {notes.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <EmptyState 
                            icon={<StickyNote size={48} />}
                            title="No Notes Yet"
                            message="Capture your thoughts, insights from scenarios, or ideas for later."
                            action={{
                                label: "Create Your First Note",
                                onClick: () => openEditorModal(null),
                            }}
                        />
                    </motion.div>
                ) : filteredNotes.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                        <p className="text-gray-500">No notes found for "{searchTerm}".</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map(note => (
                            <NoteCard key={note.id} note={note} onClick={() => openEditorModal(note)} onDelete={() => handleDeleteRequest(note)} />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <NoteEditorModal
                isOpen={isEditorModalOpen}
                onClose={closeEditorModal}
                note={selectedNote}
                onSave={handleSaveNote}
            />

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
                <div className="text-center p-4">
                    <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Are you sure you want to delete this note? This action cannot be undone.</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default NotesPage;