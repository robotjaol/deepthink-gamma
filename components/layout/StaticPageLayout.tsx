import React from 'react';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import { motion } from 'framer-motion';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children }) => {
  return (
    <div className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-grow pt-24 md:pt-32 pb-16">
        <motion.div 
            className="container mx-auto px-6 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">{title}</h1>
          <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </motion.div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default StaticPageLayout;
