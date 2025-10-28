import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import { X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: "Welcome to DeepThink!",
    content: "Let's take a quick tour to see how you can sharpen your professional intuition.",
    targetId: null,
  },
  {
    title: "Explore Scenarios",
    content: "This is where your training begins. Choose from a library of realistic scenarios tailored to your field, or create your own with AI.",
    targetId: 'tour-step-1',
  },
  {
    title: "Check Your Rank",
    content: "See how you stack up against other professionals on the global leaderboard. Complete sessions to earn points and climb the ranks!",
    targetId: 'tour-step-2',
  },
  {
    title: "Review Your Progress",
    content: "Your completed sessions and detailed performance reports are saved here. Analyze your strengths and weaknesses over time.",
    targetId: 'tour-step-3',
  },
  {
    title: "Ready to Start?",
    content: "You're all set! Dive into a scenario or explore the other tools in the dock below, like the Development Sandbox or your Notes.",
    targetId: null,
  }
];

const GuideTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  useEffect(() => {
    const tourCompleted = localStorage.getItem('deepthink_tour_completed');
    if (tourCompleted !== 'true') {
      setTimeout(() => setIsOpen(true), 500); // Delay to allow page to render
    }
  }, []);

  const updatePosition = useCallback(() => {
    const targetId = TOUR_STEPS[stepIndex].targetId;
    if (!targetId) {
        setTargetRect(null);
        return true;
    }
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        setTimeout(() => {
            setTargetRect(element.getBoundingClientRect());
        }, 400); // Wait for scroll to finish
        return true;
    }
    return false;
  }, [stepIndex]);
  
  useEffect(() => {
      if (!isOpen) return;
  
      const handleDynamicResize = () => updatePosition();
      window.addEventListener('resize', handleDynamicResize);
  
      let attempts = 0;
      const interval = setInterval(() => {
          if (updatePosition() || attempts >= 10) {
              clearInterval(interval);
          }
          attempts++;
      }, 200);
  
      return () => {
          clearInterval(interval);
          window.removeEventListener('resize', handleDynamicResize);
      };
  }, [stepIndex, isOpen, updatePosition]);


  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('deepthink_tour_completed', 'true');
  };

  const getModalStyle = (): React.CSSProperties => {
      if (isMobile) {
          return {
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              position: 'fixed',
              transform: 'none'
          };
      }
      if (targetRect) {
          const modalHeight = 220;
          const modalWidth = 320;
          const spaceBelow = window.innerHeight - targetRect.bottom;
          
          const style: React.CSSProperties = {
              position: 'fixed',
              width: modalWidth,
              left: Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - modalWidth / 2, window.innerWidth - modalWidth - 16)),
          };

          if (spaceBelow > modalHeight + 20) {
              style.top = targetRect.bottom + 12;
          } else {
              style.top = targetRect.top - modalHeight - 12;
          }
          return style;
      }
      return {
          top: '50%',
          left: '50%',
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
      };
  };
  
  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[stepIndex];

  return (
    <div className="fixed inset-0 z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <AnimatePresence>
      {targetRect && (
          <motion.div
              className="absolute border-2 border-dashed border-dark-gold rounded-lg pointer-events-none bg-black/10"
              initial={false}
              animate={{
                  x: targetRect.left - 8,
                  y: targetRect.top - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                  opacity: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
      )}
      </AnimatePresence>

       <motion.div
        className={`z-[101] bg-light-primary dark:bg-dark-secondary p-6 rounded-lg shadow-2xl ${targetRect ? '' : 'w-full max-w-md'}`}
        style={getModalStyle()}
        key={stepIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
       >
            <button onClick={handleClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-light-secondary dark:hover:bg-dark-primary transition-colors">
                <X size={20}/>
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-light-accent/50 dark:bg-dark-accent/20 rounded-full flex items-center justify-center">
                    <Lightbulb className="text-light-text dark:text-dark-gold"/>
                </div>
                <h3 className="text-xl font-bold">{currentStep.title}</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{currentStep.content}</p>

            <div className="flex justify-between items-center">
                 <div className="flex items-center">
                    <span className="text-sm text-gray-400">{stepIndex + 1} / {TOUR_STEPS.length}</span>
                    {stepIndex < TOUR_STEPS.length - 1 && (
                        <Button variant="ghost" size="sm" onClick={handleClose} className="ml-4">
                            Skip Tour
                        </Button>
                    )}
                </div>
                <div className="flex space-x-2">
                    {stepIndex > 0 && (
                        <Button variant="secondary" size="sm" onClick={handlePrev} aria-label="Previous step">
                            <ArrowLeft size={16}/>
                        </Button>
                    )}
                    <Button onClick={handleNext} size="sm">
                        {stepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                        {stepIndex < TOUR_STEPS.length - 1 && <ArrowRight size={16} className="ml-2"/>}
                    </Button>
                </div>
            </div>
       </motion.div>
    </div>
  );
};

export default GuideTour;