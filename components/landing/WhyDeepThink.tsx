

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, BrainCircuit, Scaling } from 'lucide-react';
import { GlareCard } from '../ui/glare-card';

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


const WhyDeepThink: React.FC = () => {
    const differentiators = [
        {
            icon: <ShieldCheck size={32} />,
            title: "Practice in a Safe Harbor",
            description: "Make career-defining decisions without real-world consequences. Explore risky strategies and learn from failure in a controlled, high-fidelity environment."
        },
        {
            icon: <BrainCircuit size={32} />,
            title: "AI-Powered Cognitive Mirror",
            description: "Go beyond right or wrong. Our AI analyzes your decision-making process, revealing cognitive biases and mental shortcuts you never knew you had."
        },
        {
            icon: <Scaling size={32} />,
            title: "Measure the Unmeasurable",
            description: "For the first time, quantify your intuitive strength. Track your progress with concrete metrics and watch your 'gut feeling' evolve into a reliable, strategic asset."
        },
    ];

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-4xl font-bold mb-4">Why DeepThink?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">Traditional training teaches you what to think. We teach you *how* to think under pressure.</p>
                </motion.div>
                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerStagger}
                >
                    {differentiators.map((d) => (
                        <motion.div
                            key={d.title}
                            variants={itemStagger}
                        >
                            {/* FIX: The error suggests children are missing. Ensured children are correctly passed to the GlareCard component. */}
                            <GlareCard className="h-full">
                                <div className="p-8 text-left h-full flex flex-col">
                                    <div className="text-light-text dark:text-dark-gold mb-4">{d.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{d.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{d.description}</p>
                                </div>
                            </GlareCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyDeepThink;