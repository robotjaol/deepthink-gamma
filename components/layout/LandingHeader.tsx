import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { Swords, Menu, X } from 'lucide-react';

const LandingHeader: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const navigateAndCloseMenu = (path: string) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    const navLinks = [
        { title: 'Features', id: 'features' },
        { title: 'Pricing', id: 'pricing' },
        { title: 'Testimonials', id: 'testimonials' },
        { title: 'FAQ', id: 'faq' },
    ];

    return (
        <>
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'py-4 bg-light-primary/80 dark:bg-dark-primary/80 backdrop-blur-sm shadow-md' : 'py-6'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/dt-1.png" alt="DeepThink" className="h-8 w-auto" />
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                         <button key={link.id} type="button" onClick={() => scrollToSection(link.id)} className="hover:text-light-accent dark:hover:text-dark-accent transition-colors">{link.title}</button>
                    ))}
                </nav>
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeToggle />
                    <Button onClick={() => navigate('/login')} variant="ghost">Login</Button>
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle menu">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={isMenuOpen ? 'x' : 'menu'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.header>

        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="md:hidden fixed inset-0 bg-light-primary dark:bg-dark-primary z-40 pt-24 p-6"
                >
                    <motion.div
                         initial={{ y: -20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.1 }}
                         className="flex flex-col items-center space-y-8"
                    >
                        {navLinks.map(link => (
                             <button key={link.id} type="button" onClick={() => scrollToSection(link.id)} className="text-2xl font-semibold hover:text-light-accent dark:hover:text-dark-accent transition-colors">{link.title}</button>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-700 w-full my-4"></div>
                        <Button onClick={() => navigateAndCloseMenu('/login')} variant="primary" size="lg">Login</Button>
                        <ThemeToggle />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

export default LandingHeader;
