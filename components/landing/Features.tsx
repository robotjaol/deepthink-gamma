

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { BrainCircuit, BarChartBig, Trophy, Briefcase } from 'lucide-react';
import { CometCard } from '../ui/comet-card';

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

const featuresData = [
    { icon: <BrainCircuit size={32} />, title: "AI-Powered Scenarios", description: "Tackle hyper-realistic challenges tailored to your role and industry, powered by cutting-edge AI." },
    { icon: <BarChartBig size={32} />, title: "Personalized Analytics", description: "Receive instant, deep-dive feedback on your decisions, highlighting cognitive biases and strengths." },
    { icon: <Trophy size={32} />, title: "Competitive Leaderboards", description: "Benchmark your skills against peers, track your progress, and climb the ranks in your field." },
    { icon: <Briefcase size={32} />, title: "Career-Specific Training", description: "From PR crises to product launch failures, train for the moments that define your career path." }
];

const Features: React.FC = () => (
    <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <h2 className="text-4xl font-bold mb-4">The Future of Professional Development</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">DeepThink is more than a training tool—it's a cognitive gym for your career.</p>
            </motion.div>
            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerStagger}
            >
                {featuresData.map((feature) => (
                     <motion.div
                        key={feature.title}
                        variants={itemStagger}
                    >
                        {/* FIX: The error suggests children are missing. Ensured children are correctly passed to the CometCard component. */}
                        <CometCard>
                            <div className="p-8 bg-light-secondary dark:bg-dark-secondary rounded-xl shadow-sm text-left h-full">
                                <div className="text-light-text dark:text-dark-gold mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                            </div>
                        </CometCard>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default Features;