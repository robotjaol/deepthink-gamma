

import React from 'react';
import { motion } from 'framer-motion';

const TrustedBy: React.FC = () => (
    <motion.div
        className="py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
    >
        <div className="container mx-auto px-6">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Trusted by Professionals At</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4 mt-4 text-gray-400 dark:text-gray-500">
                <span className="font-medium">Innovate Inc.</span>
                <span className="font-medium">QuantumLeap</span>
                <span className="font-medium">Apex Solutions</span>
                <span className="font-medium">Nexus Corp</span>
            </div>
        </div>
    </motion.div>
);

export default TrustedBy;