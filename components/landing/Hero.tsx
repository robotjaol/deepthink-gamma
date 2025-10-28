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

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const handleDemoClick = () => {
        document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <section className="relative text-center overflow-hidden min-h-screen flex flex-col justify-center py-20">
            <div className="absolute inset-0 bg-light-secondary dark:bg-dark-secondary [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
            <div className="container mx-auto px-6 relative">
                <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-yellow-400 dark:to-yellow-200 bg-[length:200%_auto] animate-background-pan leading-normal">
                        Unlock Your Intuitive Skills
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        DeepThink simulates complex career scenarios to sharpen your decision-making, turning instinct into expertise through advanced AI.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button size="lg" onClick={() => navigate('/login')}>Start Training Free</Button>
                        <Button size="lg" variant="secondary" onClick={handleDemoClick}>Interactive Demo</Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
