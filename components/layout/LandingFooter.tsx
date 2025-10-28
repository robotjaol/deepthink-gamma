

import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, Linkedin, Github } from 'lucide-react';

const XLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5">
        <title>X</title>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.407l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
);


const LandingFooter: React.FC = () => {
    const socialLinks = [
        { icon: <XLogo />, href: '#' },
        { icon: <Linkedin size={20} />, href: '#' },
        { icon: <Github size={20} />, href: '#' },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <Swords size={28} className="text-light-text dark:text-dark-gold"/>
                            <span className="text-2xl font-bold">DeepThink</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Train your professional intuition.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><button type="button" onClick={() => scrollToSection('features')} className="hover:underline">Features</button></li>
                            <li><button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:underline">How It Works</button></li>
                            <li><button type="button" onClick={() => scrollToSection('faq')} className="hover:underline">FAQ</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="hover:underline">About Us</Link></li>
                            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
                            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 py-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} DeepThink. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {socialLinks.map((link, i) => (
                            <a key={i} href={link.href} className="text-gray-500 hover:text-light-accent dark:hover:text-dark-accent transition-colors">{link.icon}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;