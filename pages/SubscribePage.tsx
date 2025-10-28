import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import LandingHeader from '../components/layout/LandingHeader';
import LandingFooter from '../components/layout/LandingFooter';
import { CheckCircle, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// This global is made available by the Stripe.js script added to index.html
declare var Stripe: any;

// These values should be stored in environment variables
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Peb31RxBZnRdxpChXQZ7pYcM8Tf1fXf6g6f8d3R1Z7q2Z9f9Q8g7H6E5F4d3C2b1A0a9B8c7D6e5F4';
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';

const SubscribePage: React.FC = () => {
    const { planName } = useParams<{ planName: string }>();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [stripe, setStripe] = useState<any>(null);

    useEffect(() => {
        if (typeof Stripe !== 'undefined') {
            setStripe(Stripe(STRIPE_PUBLISHABLE_KEY));
        }
    }, []);

    const planDetails = {
        Pro: {
            price: 50000,
            priceDisplay: "Rp 50.000",
            features: [
                "Unlimited Scenarios",
                "Advanced AI Analytics",
                "Performance Tracking",
                "Priority Support"
            ]
        }
    };

    const currentPlan = planName === 'Pro' ? planDetails.Pro : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe) {
            setError("Stripe is not available. Please try again later.");
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const token = await getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

            if (stripeError) {
                throw stripeError;
            }

        } catch (err: any) {
            console.error("Subscription Error:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };
    
    if (!currentPlan) {
        return (
             <div className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text min-h-screen flex flex-col">
                <LandingHeader />
                <main className="flex-grow flex items-center justify-center">
                    <h1 className="text-2xl">Plan not found.</h1>
                </main>
                <LandingFooter />
            </div>
        )
    }

    return (
        <div className="bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-grow flex items-center justify-center py-24 md:py-32 px-4">
                 <motion.div 
                    className="w-full max-w-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-center mb-10">Complete Your Subscription</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Summary */}
                        <Card className="p-8 bg-light-primary dark:bg-dark-secondary/50 border border-light-accent dark:border-dark-accent/50">
                            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <p className="font-semibold text-lg">DeepThink {planName} Plan</p>
                                    <p className="font-bold text-lg">{currentPlan.priceDisplay} / Bulan</p>
                                </div>
                                <ul className="space-y-3 pt-4">
                                    {currentPlan.features.map(feature => (
                                        <li key={feature} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                                            <Check className="text-green-500 flex-shrink-0" size={20} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200 dark:border-gray-700 mt-4">
                                    <p className="font-semibold text-xl">Total Due Today</p>
                                    <p className="font-bold text-xl text-light-accent dark:text-dark-gold">{currentPlan.priceDisplay}</p>
                                </div>
                            </div>
                        </Card>

                         {/* Right Side: Action */}
                        <Card className="p-8 flex flex-col justify-center">
                             <h2 className="text-2xl font-semibold mb-4">Secure Payment</h2>
                             <p className="text-gray-500 dark:text-gray-400 mb-6">
                                You will be redirected to our secure payment partner, Stripe, to complete your purchase.
                             </p>
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-md mb-4 text-sm">
                                        <AlertTriangle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !stripe}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={20} className="mr-2 animate-spin" />
                                            Redirecting...
                                        </>
                                     ) : `Proceed to Payment`}
                                </Button>
                                <p className="text-xs text-gray-400 text-center pt-4">
                                    Powered by Stripe. Secure and encrypted payment.
                                </p>
                            </form>
                        </Card>
                    </div>
                 </motion.div>
            </main>
            <LandingFooter />
        </div>
    );
};

export default SubscribePage;