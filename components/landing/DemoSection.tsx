import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Play, RefreshCw, AlertTriangle, Check, X, ShieldCheck, Telescope, PartyPopper } from 'lucide-react';
import { Button } from '../ui/Button';
// FIX: Imported the Card component to resolve 'Cannot find name 'Card'' error.
import { Card } from '../ui/Card';


const DemoSection: React.FC = () => {
  const [simulationStep, setSimulationStep] = useState<'initial' | 'responded' | 'monitoring' | 'finished'>('initial');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const options = [
    'Immediately isolate the affected systems',
    'Monitor the breach to gather intelligence',
    'Alert all staff immediately',
  ];
  const correctOptionIndex = 0;

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === correctOptionIndex;
    setIsCorrect(correct);
    if (correct) {
      setScore(85);
    }
    setSimulationStep('responded');
  };

  const handleReset = () => {
    setSimulationStep('initial');
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
  };
  
  const progress = {
      initial: 0,
      responded: 1,
      monitoring: 2,
      finished: 3,
  }[simulationStep];

  return (
    <section className="py-16 md:py-24 bg-light-secondary dark:bg-dark-secondary">
        <div className="container mx-auto px-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-center mb-4">Experience it Live</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl">
                Get a feel for our high-stakes scenarios. Make a choice and see the immediate impact in this interactive demo.
            </p>
            <motion.div
                className="w-full max-w-4xl bg-light-primary dark:bg-dark-primary rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="text-sm text-light-text/80 dark:text-dark-text/70 ml-4 font-medium">Cybersecurity Breach Simulation</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-light-accent dark:text-dark-accent bg-light-accent/20 dark:bg-dark-accent/20 px-3 py-1 rounded-md">
                            <BarChart size={16}/>
                            <span className="font-bold text-sm">{score}</span>
                        </div>
                         <button onClick={handleReset} className="flex items-center gap-2 bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-primary px-3 py-1 rounded-md font-semibold text-sm">
                            {simulationStep === 'initial' ? <Play size={16}/> : <RefreshCw size={16}/>}
                            {simulationStep === 'initial' ? 'Start Demo' : 'Reset Demo'}
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div className="my-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{progress}/3</span>
                    </div>
                    <div className="w-full bg-light-secondary dark:bg-dark-secondary rounded-full h-1.5">
                        <motion.div 
                            className="bg-light-accent dark:bg-dark-accent h-1.5 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(progress / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={simulationStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {simulationStep === 'initial' || simulationStep === 'responded' ? (
                            <>
                                {/* Crisis Situation */}
                                <motion.div
                                    className="border border-red-500/50 bg-red-500/10 rounded-lg p-4 my-6 flex items-start gap-4"
                                >
                                    <AlertTriangle className="text-red-500 dark:text-red-400 mt-1 flex-shrink-0" size={24} />
                                    <div>
                                        <h3 className="font-bold text-red-600 dark:text-red-300">Crisis Situation</h3>
                                        <p className="text-red-800 dark:text-red-200">🚨 ALERT: Unauthorized access detected in financial database</p>
                                    </div>
                                </motion.div>

                                {/* Response Options */}
                                <div>
                                    <h4 className="text-lg font-semibold text-light-text dark:text-gray-200 mb-4">Your Response:</h4>
                                    <div className="space-y-3">
                                        {options.map((option, index) => (
                                            <motion.button
                                                key={option}
                                                onClick={() => handleOptionClick(index)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 disabled:cursor-not-allowed ${
                                                    selectedOption === index 
                                                    ? (isCorrect 
                                                        ? 'border-green-500 bg-green-500/10 text-light-text dark:text-dark-text' 
                                                        : 'border-red-500 bg-red-500/10 text-light-text dark:text-dark-text') 
                                                    : 'border-transparent bg-light-accent text-light-text hover:bg-light-accent/80 dark:bg-black dark:text-dark-text dark:hover:bg-dark-secondary'
                                                }`}
                                                disabled={simulationStep !== 'initial'}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{option}</span>
                                                    <AnimatePresence>
                                                    {selectedOption === index && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${ isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                                           {isCorrect ? <Check size={16} /> : <X size={16} />}
                                                        </motion.div>
                                                    )}
                                                    </AnimatePresence>
                                                </div>
                                                <AnimatePresence>
                                                {selectedOption === index && (
                                                    <motion.p initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '8px' }} className={`text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {isCorrect ? 'Correct: This action contains the threat immediately, preventing further data loss.' : 'Incorrect: This could allow the breach to spread or result in more data being stolen.'}
                                                    </motion.p>
                                                )}
                                                </AnimatePresence>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {simulationStep === 'responded' && (
                                        <div className="text-center mt-6">
                                            <Button onClick={() => setSimulationStep('monitoring')}>Next Step</Button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : simulationStep === 'monitoring' ? (
                            <Card className="text-center p-8 my-6 flex flex-col items-center justify-center min-h-[300px]">
                                <Telescope className="w-12 h-12 text-blue-500 mb-4"/>
                                <h3 className="text-2xl font-bold mb-2">Systems Isolated</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Monitoring for secondary threats and backdoors...</p>
                                <Button onClick={() => setSimulationStep('finished')}>Finish Simulation</Button>
                            </Card>
                        ) : (
                             <Card className="text-center p-8 my-6 flex flex-col items-center justify-center min-h-[300px] bg-green-500/10 border-green-500/50">
                                <PartyPopper className="w-12 h-12 text-green-500 mb-4"/>
                                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Crisis Averted!</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Well done. Your quick and effective response minimized the damage.</p>
                                <Button variant="secondary" onClick={handleReset}>Try Again</Button>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    </section>
  );
};

export default DemoSection;