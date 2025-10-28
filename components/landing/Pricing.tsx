

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Button } from '../ui/Button';
import { Check } from 'lucide-react';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
};

const Pricing: React.FC = () => {
    const plans = [
        { name: "Starter", price: "Free", features: ["1 Scenario per month", "Basic Analytics", "Community Access"], cta: "Get Started", action: () => navigate('/login')},
        { name: "Pro", price: "Rp 50k", popular: true, features: ["Unlimited Scenarios", "Advanced AI Analytics", "Performance Tracking", "Priority Support"], cta: "Choose Pro", action: () => navigate('/subscribe/Pro') },
        { name: "Enterprise", price: "Contact Us", features: ["Custom Scenarios", "Team Management", "Dedicated Account Manager", "API Access"], cta: "Contact Sales", action: () => navigate('/contact')}
    ];
    const navigate = useNavigate();

    return (
        <motion.section
            id="pricing"
            className="bg-light-secondary dark:bg-dark-secondary py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-4">Find the Plan That's Right for You</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">Start for free, and scale as your team grows. No hidden fees.</p>
                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            className={`relative p-8 rounded-xl border flex flex-col ${plan.popular ? 'border-light-accent dark:border-dark-accent dark:shadow-glow' : 'border-gray-200 dark:border-gray-700'} bg-light-primary dark:bg-dark-primary`}
                            custom={i}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: (i: number) => ({
                                    opacity: 1, y: 0, transition: { delay: i * 0.1 }
                                })
                            }}
                        >
                            {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-primary font-semibold rounded-full text-sm">Most Popular</div>}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-4xl font-extrabold mb-6">{plan.price}<span className="text-base font-normal text-gray-500">{plan.name === 'Pro' && '/ Bulan'}</span></p>
                            <ul className="space-y-4 text-left mb-8 flex-grow">
                                {plan.features.map(feat => (
                                    <li key={feat} className="flex items-start space-x-3">
                                        <Check className="text-green-500 mt-1 flex-shrink-0" size={20} />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            {plan.name === 'Enterprise' ? (
                                <Button
                                    onClick={plan.action}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    {plan.cta}
                                </Button>
                            ) : (
                                <Button 
                                    onClick={plan.action} 
                                    variant={plan.popular ? 'primary' : 'secondary'} 
                                    className="w-full"
                                >
                                    {plan.cta}
                                </Button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Pricing;