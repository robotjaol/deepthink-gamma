
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, Target, FlaskConical } from 'lucide-react';
import { ExpandableCard } from '../ui/expandable-card';

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

const UseCases: React.FC = () => {
    const cases = [
        { 
            icon: <Users size={32} />, 
            title: "For Leaders & Executives", 
            description: "Navigate high-stakes boardroom decisions, investor relations, and team crises with confidence. Sharpen your leadership instincts where it matters most, preparing you for unforeseen challenges and crucial strategic pivots.",
            imageSrc: "https://source.unsplash.com/random/800x600?boardroom,business"
        },
        { 
            icon: <Target size={32} />, 
            title: "For Strategists & Managers", 
            description: "Test your market analysis and competitive strategy against dynamic, AI-driven opponents. Learn to spot market shifts before they happen and build robust plans that withstand unexpected pressures.",
            imageSrc: "https://source.unsplash.com/random/800x600?strategy,chess"
        },
        { 
            icon: <FlaskConical size={32} />, 
            title: "For Specialists & Experts", 
            description: "Sharpen your deep domain expertise by tackling niche, complex problems that push the boundaries of your knowledge. From engineering crises to medical diagnostics, validate your expert intuition.",
            imageSrc: "https://source.unsplash.com/random/800x600?laboratory,engineering"
        },
    ];

    return (
        <section className="bg-light-secondary dark:bg-dark-secondary py-16 md:py-24">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <h2 className="text-4xl font-bold mb-4">Who is DeepThink For?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">Designed for ambitious professionals who understand that intuition is a skill, not a gift.</p>
                </motion.div>
                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerStagger}
                >
                    {cases.map((c) => (
                        <motion.div
                            key={c.title}
                            variants={itemStagger}
                            className="h-full"
                        >
                           <ExpandableCard 
                                icon={c.icon}
                                title={c.title}
                                description={c.description}
                                imageSrc={c.imageSrc}
                           />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default UseCases;
