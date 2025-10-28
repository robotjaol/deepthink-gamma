

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Button } from '../ui/Button';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
};

const CTA: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <motion.div
                    className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-8 md:p-12 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Main CTA part */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Master Your Intuition?</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Start your journey today. Your first scenario is on us.</p>
                    <Button size="lg" onClick={() => navigate('/login')} variant="primary">Get Started for Free</Button>
                    
                    {/* Divider */}
                    <div className="my-12 flex items-center justify-center">
                        <hr className="w-24 border-t-2 border-gray-300 dark:border-gray-700" />
                    </div>

                    {/* Newsletter part */}
                    <div>
                        <h3 className="text-2xl font-bold">Stay Updated</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6 max-w-lg mx-auto">
                            Get the latest news, feature updates, and intuition-training tips from DeepThink delivered to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row w-full max-w-md gap-2 mx-auto">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                            />
                            <Button type="submit" variant="secondary" className="flex-shrink-0">Subscribe</Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;