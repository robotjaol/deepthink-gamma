import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquarePlus } from 'lucide-react';

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
    const [requestText, setRequestText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestText.trim()) return;
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            console.log('User Request Submitted:', requestText);
            setIsSubmitting(false);
            setIsSubmitted(true);
            setRequestText('');
        }, 1000);
    };

    const handleClose = () => {
        onClose();
        // Reset state after a short delay to allow for exit animation
        setTimeout(() => {
            setIsSubmitted(false);
            setRequestText('');
        }, 300);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div
                        key="submitted"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center p-8 flex flex-col items-center justify-center min-h-[300px]"
                    >
                        <CheckCircle2 size={64} className="text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Your feedback has been received.</p>
                        <Button onClick={handleClose}>Close</Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <MessageSquarePlus size={28} />
                            <h2 className="text-3xl font-bold">Submit a Request</h2>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Have a feature idea, feedback, or a suggestion? We'd love to hear from you!
                        </p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={requestText}
                                onChange={(e) => setRequestText(e.target.value)}
                                rows={8}
                                className="w-full bg-light-secondary dark:bg-dark-secondary border border-gray-300 dark:border-gray-600 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                                placeholder="Describe your idea or feedback in detail..."
                                required
                            />
                            <div className="mt-6 flex justify-end">
                                <Button type="submit" disabled={isSubmitting || !requestText.trim()}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                    {!isSubmitting && <Send size={16} className="ml-2" />}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default RequestModal;
