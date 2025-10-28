
import React from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const Newsletter = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
            <motion.div
                className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-8 md:p-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left gap-8">
                    <div>
                        <h2 className="text-3xl font-bold">Stay Updated</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-lg">
                            Get the latest news, feature updates, and intuition-training tips from DeepThink delivered to your inbox.
                        </p>
                    </div>
                    <form className="flex flex-col sm:flex-row w-full max-w-md gap-2">
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors"
                        />
                        <Button type="submit" className="flex-shrink-0">Subscribe</Button>
                    </form>
                </div>
            </motion.div>
        </div>
    </section>
);

export default Newsletter;
