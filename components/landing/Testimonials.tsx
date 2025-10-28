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

const testimonialsData = [
    { name: "Sarah L., PR Director", quote: "DeepThink completely changed how I approach crisis management. The scenarios are incredibly realistic, and the AI feedback is like having a personal mentor.", avatar: "https://picsum.photos/id/1025/100/100" },
    { name: "Michael B., Product Lead", quote: "I've never seen a tool that targets the 'gut feeling' part of my job so effectively. It's become essential for my team's weekly training.", avatar: "https://picsum.photos/id/1027/100/100" },
    { name: "Emily C., CEO", quote: "As an executive, my decisions have huge consequences. DeepThink provides a safe, high-stakes environment to test my judgment. Invaluable.", avatar: "https://picsum.photos/id/1011/100/100" },
];

const Testimonials: React.FC = () => (
    <motion.section
        id="testimonials"
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
    >
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">Why Professionals Trust DeepThink</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {testimonialsData.map((t, i) => (
                    <div key={i} className="p-8 bg-light-secondary dark:bg-dark-secondary rounded-xl text-left">
                        <p className="italic mb-6">"{t.quote}"</p>
                        <div className="flex items-center">
                            <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" loading="lazy" />
                            <div>
                                <h4 className="font-bold">{t.name}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </motion.section>
);

export default Testimonials;