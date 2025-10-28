import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, Construction } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const MasteryPage: React.FC = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold flex items-center">
                    <GitMerge size={36} className="mr-3 text-light-accent dark:text-dark-accent" />
                    Mastery Tree
                </h1>
            </div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="h-[75vh] flex flex-col items-center justify-center text-center">
                    <Construction size={48} className="text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">Feature Under Review</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                        As part of the project's refactoring for MVP readiness, the Skill Tree feature is currently on hold and has been removed from the UI.
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default MasteryPage;
