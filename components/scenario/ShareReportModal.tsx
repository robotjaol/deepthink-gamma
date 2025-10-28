import React, { useRef } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { useNotifications } from '../../hooks/useNotifications';
import { AnalysisReport } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Swords, CheckCircle2, Copy, Download, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: AnalysisReport;
    scenarioName: string;
}

const ShareReportModal: React.FC<ShareReportModalProps> = ({ isOpen, onClose, report, scenarioName }) => {
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const reportCardRef = useRef<HTMLDivElement>(null);

    const handleCopyLink = () => {
        // In a real app, this would be a unique public URL for the report
        navigator.clipboard.writeText(window.location.href);
        addNotification('Link copied to clipboard!', 'success');
    };

    const handleDownloadImage = () => {
        addNotification('Image download started!', 'info', 'Coming Soon');
        // In a real app, you would use a library like html2canvas:
        // import html2canvas from 'html2canvas';
        // if (reportCardRef.current) {
        //   html2canvas(reportCardRef.current).then(canvas => {
        //     const link = document.createElement('a');
        //     link.download = 'deepthink-report.png';
        //     link.href = canvas.toDataURL('image/png');
        //     link.click();
        //   });
        // }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <h2 className="text-3xl font-bold text-center mb-6">Share Your Achievement</h2>
            
            <motion.div
                ref={reportCardRef}
                className="bg-gradient-to-br from-light-secondary to-white dark:from-dark-secondary dark:to-black p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-500 dark:text-gray-400">SESSION COMPLETE</p>
                        <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">{scenarioName}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-light-text dark:text-dark-gold">
                        <Swords size={24} />
                        <span className="text-xl font-bold">DeepThink</span>
                    </div>
                </div>

                <div className="text-center my-8">
                     <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Overall Score</p>
                     <p className="text-8xl font-bold text-light-text dark:text-dark-gold">{report.overallScore}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3 flex items-center"><CheckCircle2 className="mr-2 text-green-500"/>Key Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                        {report.strengths.slice(0, 3).map(strength => (
                            <span key={strength} className="px-3 py-1 text-sm bg-light-primary dark:bg-dark-primary rounded-full border border-gray-300 dark:border-gray-600">{strength}</span>
                        ))}
                    </div>
                </div>

                 <div className="mt-8 flex items-center gap-4">
                    <img src={user?.profilePictureUrl} alt={user?.name} className="w-12 h-12 rounded-full"/>
                    <div>
                        <p className="font-bold">{user?.name}</p>
                        <p className="text-sm text-gray-500">Completed on {new Date().toLocaleDateString()}</p>
                    </div>
                 </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="secondary" onClick={handleCopyLink}><Copy size={16} className="mr-2" /> Copy Link</Button>
                <Button variant="secondary" onClick={handleDownloadImage}><Download size={16} className="mr-2" /> Download Image</Button>
                <Button><Linkedin size={16} className="mr-2" /> Share to LinkedIn</Button>
            </div>
        </Modal>
    );
};

export default ShareReportModal;