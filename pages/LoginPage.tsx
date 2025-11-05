

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Swords, Github, ArrowLeft, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password' | 'reset-sent'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@deepthink.com');
  const [password, setPassword] = useState('password');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, sendPasswordResetEmail } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      let success = false;
      if (view === 'login') {
        success = await login(email, password);
         if (!success) setError('Invalid email or password.');
      } else if (view === 'signup'){
        success = await signup(name, email, password);
        if (!success) setError('Could not create account.');
      } else if (view === 'forgot-password') {
        success = await sendPasswordResetEmail(email);
        if(success) {
            setView('reset-sent');
        } else {
            setError('Could not send reset email. Please try again.');
        }
      }

      if (success && (view === 'login' || view === 'signup')) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  
  const formVariants: Variants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
      exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-secondary dark:bg-dark-secondary p-4">
       <motion.div 
         className="w-full max-w-4xl bg-light-primary dark:bg-dark-primary rounded-2xl shadow-2xl flex overflow-hidden relative"
         initial={{ opacity: 0, y: 40, scale: 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
       >
            <Link 
              to="/" 
              className="absolute top-4 left-4 z-10 rounded-full bg-light-secondary/80 p-2 text-gray-500 transition-all hover:scale-110 hover:bg-light-secondary dark:bg-dark-secondary/80 dark:text-gray-400 dark:hover:bg-dark-secondary"
              aria-label="Back to landing page"
            >
              <ArrowLeft size={24} />
            </Link>
            {/* Left decorative panel */}
            <div className="hidden md:block w-1/2 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center animate-ken-burns" 
                    style={{backgroundImage: "url('https://source.unsplash.com/random/800x600?abstract,dark')"}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.div 
                    className="relative flex flex-col justify-end h-full p-12 text-white"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="flex items-center">
                        <img src={theme === 'dark' ? '/dtg-2.png' : '/dt-2.png'} alt="DeepThink" className="h-12 w-auto" />
                    </motion.div>
                    <motion.p variants={itemVariants} className="mt-4 text-xl text-gray-200">Turn your instinct into expertise.</motion.p>
                </motion.div>
            </div>
            
            {/* Right login form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
                <AnimatePresence mode="wait">
                {view === 'login' && (
                     <motion.div
                        key="login"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your credentials to continue.</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Button variant="secondary" className="w-full flex items-center justify-center space-x-2">
                                <GoogleIcon />
                                <span>Google</span>
                            </Button>
                            <Button variant="secondary" className="w-full flex items-center justify-center space-x-2">
                                <Github size={20}/>
                                <span>GitHub</span>
                            </Button>
                        </div>

                        <div className="flex items-center my-6">
                            <hr className="w-full border-gray-300 dark:border-gray-600"/>
                            <span className="px-2 text-gray-500 text-xs uppercase">OR</span>
                            <hr className="w-full border-gray-300 dark:border-gray-600"/>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                                label="Email (Demo)" 
                                id="email" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <Input 
                                label="Password (Demo)" 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                            
                            <div className="text-right">
                                <button type="button" onClick={() => { setView('forgot-password'); setError(''); }} className="text-sm font-semibold text-light-accent dark:text-dark-accent hover:underline">
                                    Forgot Password?
                                </button>
                            </div>


                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login with Email'}
                            </Button>

                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                                Don't have an account?{' '}
                                <button type="button" onClick={() => { setView('signup'); setError(''); }} className="font-semibold text-light-accent dark:text-dark-accent hover:underline">
                                    Create one
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
                {view === 'signup' && (
                    <motion.div
                        key="signup"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Join DeepThink and start training.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                           <Input 
                                label="Full Name" 
                                id="name" 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <Input 
                                label="Email" 
                                id="signup-email" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <Input 
                                label="Password" 
                                id="signup-password" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Account'}
                            </Button>

                             <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                                Already have an account?{' '}
                                <button type="button" onClick={() => { setView('login'); setError(''); }} className="font-semibold text-light-accent dark:text-dark-accent hover:underline">
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
                {view === 'forgot-password' && (
                     <motion.div
                        key="forgot-password"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send you a link to get back into your account.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                                label="Email" 
                                id="reset-email" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                             <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                                Remember your password?{' '}
                                <button type="button" onClick={() => { setView('login'); setError(''); }} className="font-semibold text-light-accent dark:text-dark-accent hover:underline">
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
                 {view === 'reset-sent' && (
                     <motion.div
                        key="reset-sent"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-center"
                    >
                        <Mail size={48} className="mx-auto text-green-500 mb-4" />
                        <h2 className="text-3xl font-bold mb-2">Check Your Email</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            We've sent a password reset link to <span className="font-semibold">{email}</span>. Please follow the instructions to reset your password.
                        </p>
                        
                        <Button onClick={() => setView('login')} className="w-full" size="lg">
                            Back to Login
                        </Button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
       </motion.div>
    </div>
  );
};

export default LoginPage;
