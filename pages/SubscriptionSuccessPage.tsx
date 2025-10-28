import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import LandingHeader from '../components/layout/LandingHeader';
import LandingFooter from '../components/layout/LandingFooter';
import { CheckCircle } from 'lucide-react';

const SubscriptionSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-grow flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Subscription Confirmed!</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                        Welcome to DeepThink Pro! You now have full access to all features.
                    </p>
                    <Button size="lg" onClick={() => navigate('/login')}>Go to Dashboard</Button>
                </motion.div>
            </main>
            <LandingFooter />
        </div>
    );
};

export default SubscriptionSuccessPage;
