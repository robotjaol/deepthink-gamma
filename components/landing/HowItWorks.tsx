import React, { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { MousePointerClick, Puzzle, Sparkles, TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
};

const steps = [
    { icon: <MousePointerClick size={32} />, title: "Select Your Role", description: "Choose your job function and experience level to get tailored scenarios." },
    { icon: <Puzzle size={32} />, title: "Engage the Scenario", description: "Immerse yourself in a dynamic challenge with evolving variables." },
    { icon: <Sparkles size={32} />, title: "Receive AI Insights", description: "Get an instant analysis of your decision-making process." },
    { icon: <TrendingUp size={32} />, title: "Track Your Growth", description: "Monitor your progress over time and see your intuition score improve." }
];

const HowItWorks: React.FC = () => {
    const { theme } = useTheme();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });

    // Animate the line drawing from 0% to 80% of the component's scroll visibility
    const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

    const inactiveColor = theme === 'light' ? '#D1D5DB' : '#4B5563'; // gray-300 / gray-600
    const activeColor = theme === 'light' ? '#3B82F6' : '#D4AF37'; // A bright blue / dark-gold

    // Define scroll progress points for icon animations to activate
    const points = [0.1, 0.3, 0.5, 0.7];

    return (
        <section id="how-it-works" ref={ref} className="bg-light-secondary dark:bg-dark-secondary py-16 md:py-24">
            <div className="container mx-auto px-6 text-center">
                <motion.h2
                    className="text-4xl font-bold mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={sectionVariants}
                >
                    Master Your Instincts in 4 Steps
                </motion.h2>

                <div className="relative max-w-4xl mx-auto">
                    {/* Desktop connecting line */}
                    <div className="absolute top-8 left-0 right-0 h-0.5 hidden md:block">
                        <svg width="100%" height="2px" viewBox="0 0 100 1" preserveAspectRatio="none">
                            <path d="M 12.5,0.5 L 87.5,0.5" className="stroke-current text-gray-300 dark:text-gray-700" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                            <motion.path d="M 12.5,0.5 L 87.5,0.5" className="stroke-current text-light-accent dark:text-dark-accent" strokeWidth="1.5" style={{ pathLength }} vectorEffect="non-scaling-stroke"/>
                        </svg>
                    </div>
                    
                    {/* Vertical line for mobile */}
                    <div className="absolute top-0 bottom-0 left-8 w-0.5 md:hidden">
                         <div className="w-full h-full bg-gray-300 dark:bg-gray-700/50" />
                         <motion.div className="absolute top-0 left-0 w-full h-full bg-light-accent dark:bg-dark-accent" style={{ scaleY: pathLength, originY: 0 }} />
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-20 md:gap-y-0 md:gap-x-12 relative">
                        {steps.map((step, i) => {
                            const color = useTransform(scrollYProgress, [points[i], points[i] + 0.15], [inactiveColor, activeColor]);
                            const scale = useTransform(scrollYProgress, [points[i], points[i] + 0.15], [1, 1.1]);
                            const glowOpacity = useTransform(scrollYProgress, [points[i], points[i] + 0.15], [0, 0.5]);
                            const glowScale = useTransform(scrollYProgress, [points[i], points[i] + 0.15], [0.8, 1.5]);

                            return (
                                <div key={step.title} className="flex md:flex-col items-start md:items-center text-left md:text-center">
                                    <motion.div 
                                        style={{ scale }}
                                        className="relative z-10"
                                    >
                                        <motion.div
                                            className="absolute -inset-2 rounded-full z-0"
                                            style={{
                                                opacity: glowOpacity,
                                                scale: glowScale,
                                                backgroundImage: `radial-gradient(circle, ${activeColor} 30%, transparent 70%)`,
                                                filter: 'blur(12px)',
                                            }}
                                        />
                                        <motion.div 
                                            className="relative w-16 h-16 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center border-2 flex-shrink-0"
                                            style={{ borderColor: color }}
                                        >
                                            <motion.span style={{ color }}>
                                                {step.icon}
                                            </motion.span>
                                        </motion.div>
                                    </motion.div>
                                    <div className="ml-6 md:ml-0 md:mt-4">
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;