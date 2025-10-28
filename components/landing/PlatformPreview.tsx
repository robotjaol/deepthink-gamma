
import React from 'react';
import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
};

const containerStagger: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemStagger: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
};

const InteractiveDashboardPreview = () => {
    const barHeights = [40, 75, 50, 90, 60];
    return (
        <div className="relative bg-light-secondary dark:bg-dark-secondary rounded-xl p-4 shadow-2xl border border-gray-200/20 dark:border-gray-700/50">
            <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-2">
                <div className="flex items-center space-x-1.5 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="aspect-[16/9] w-full bg-light-secondary dark:bg-dark-secondary/50 rounded-md p-6 flex space-x-6 overflow-hidden">
                    {/* Left Panel: Scenarios */}
                    <motion.div className="w-1/3 h-full space-y-3" initial="hidden" whileInView="visible" variants={containerStagger}>
                        <motion.div className="w-full h-8 bg-gray-300/50 dark:bg-gray-700/50 rounded" variants={itemStagger}></motion.div>
                        <motion.div className="w-full h-16 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg" variants={itemStagger}></motion.div>
                        <motion.div className="w-full h-16 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg" variants={itemStagger}></motion.div>
                        <motion.div className="w-full h-16 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg" variants={itemStagger}></motion.div>
                    </motion.div>
                    {/* Right Panel: Charts */}
                    <div className="w-2/3 h-full space-y-4">
                        <motion.div className="w-full h-1/2 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg flex items-end justify-around px-4 pb-2" initial="hidden" whileInView="visible" variants={containerStagger}>
                            {barHeights.map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="w-4 bg-light-accent dark:bg-dark-accent rounded-t"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                ></motion.div>
                            ))}
                        </motion.div>
                        <motion.div className="w-full h-1/2 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg" initial="hidden" whileInView="visible" variants={itemStagger}></motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const PlatformPreview: React.FC = () => (
    <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
    >
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">A Platform Built for Mastery</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
                DeepThink isn't just about theory. It's a hands-on cognitive gym designed to simulate the pressures and complexities of your real-world job.
            </p>
            <div className="relative max-w-5xl mx-auto">
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-400 to-green-400 dark:from-yellow-500 dark:to-yellow-300 opacity-20 blur-2xl"></div>
                <InteractiveDashboardPreview />
            </div>
        </div>
    </motion.section>
);

export default PlatformPreview;
