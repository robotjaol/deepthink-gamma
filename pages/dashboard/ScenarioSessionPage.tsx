import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DUMMY_SCENARIOS } from '../../constants';
import { Question, AnalysisReport, ScenarioTemplate } from '../../types';
import { generateScenarioQuestions, analyzeSessionPerformance } from '../../services/geminiService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import SessionReport from '../../components/scenario/SessionReport';
import { AlertTriangle, Clock, Check } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import QuestionSkeleton from '../../components/scenario/QuestionSkeleton';
import SessionReportSkeleton from '../../components/scenario/SessionReportSkeleton';
import { MultiStepLoader } from '../../components/ui/MultiStepLoader';

type SessionState = 'chooseLanguage' | 'preLoadingQuestions' | 'loadingQuestions' | 'inProgress' | 'preAnalyzing' | 'analyzing' | 'finished' | 'error';

const questionLoadingStates = [
  { text: "Initializing scenario..." },
  { text: "Consulting AI oracle for a worthy challenge..." },
  { text: "Crafting a complex dilemma..." },
  { text: "Preparing your first question..." },
];

const analysisLoadingStates = [
  { text: "Transmitting your responses for analysis..." },
  { text: "AI is evaluating your decision-making process..." },
  { text: "Scanning for cognitive biases and patterns..." },
  { text: "Quantifying your intuitive score..." },
  { text: "Generating your personalized performance report..." },
];


const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ScenarioSessionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const customScenario = location.state?.customScenario as ScenarioTemplate | undefined;
    const { addNotification } = useNotifications();

    const scenario = useMemo(() => {
        if (customScenario) {
            return customScenario;
        }
        return DUMMY_SCENARIOS.find(s => s.id === id);
    }, [id, customScenario]);

    const [sessionState, setSessionState] = useState<SessionState>('chooseLanguage');
    const [language, setLanguage] = useState<'English' | 'Indonesian Native' | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [customAnswer, setCustomAnswer] = useState('');
    
    const [error, setError] = useState<string | null>(null);

    const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
        let timer: ReturnType<typeof setInterval>;
        if (startTime && sessionState === 'inProgress') {
            timer = setInterval(() => {
                setElapsedTime((new Date().getTime() - startTime.getTime()) / 1000);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime, sessionState]);


    const startSession = useCallback(async () => {
        if (!scenario || !language) return;

        // If the scenario (from a user-created challenge) already has questions, use them directly.
        if (scenario.questions && scenario.questions.length > 0) {
            setQuestions(scenario.questions);
            setStartTime(new Date());
            setElapsedTime(0);
            setSessionState('inProgress');
            return;
        }
        
        // Otherwise, fetch questions from the AI.
        setSessionState('preLoadingQuestions');
        setError(null);
        setQuestions([]);

        const apiCallPromise = generateScenarioQuestions(scenario, language);

        setTimeout(() => {
            setSessionState(currentState => currentState === 'preLoadingQuestions' ? 'loadingQuestions' : currentState);
        }, 2500);

        try {
            const generatedQuestions = await apiCallPromise;
            if (generatedQuestions && generatedQuestions.length > 0) {
                setQuestions(generatedQuestions);
                setStartTime(new Date());
                setElapsedTime(0);
                setSessionState('inProgress');
            } else {
                setError("The AI failed to generate questions for this scenario. Please try a different one or try again.");
                setSessionState('error');
            }
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            setError("There was an error connecting to the AI. Please check your connection and try again.");
            setSessionState('error');
        }
    }, [scenario, language]);

    useEffect(() => {
        if (language && sessionState === 'chooseLanguage') {
            startSession();
        }
    }, [language, sessionState, startSession]);
    
    const handleNextQuestion = async () => {
        const combinedAnswer = `Selected Option: "${selectedOption}". User's Justification: "${customAnswer || 'Not provided.'}"`;
        const newAnswers = [...answers, combinedAnswer];
        setAnswers(newAnswers);
        setSelectedOption('');
        setCustomAnswer('');
        
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setSessionState('preAnalyzing');
            const totalDuration = elapsedTime;
            setError(null);
            const finalAnswers = newAnswers.map((ans, idx) => ({ questionId: questions[idx].id, answer: ans }));

            const analysisPromise = analyzeSessionPerformance(scenario!, questions, finalAnswers, language!, totalDuration);

            setTimeout(() => {
                setSessionState(currentState => currentState === 'preAnalyzing' ? 'analyzing' : currentState);
            }, 4000);

            try {
                if (!scenario || !language) throw new Error("Scenario or language not found");
                const report = await analysisPromise;
                
                if (report.overallScore >= 90) {
                    addNotification('You achieved a score of 90 or higher!', 'success', 'Achievement Unlocked: High Scorer');
                }

                setAnalysis(report);
                setSessionState('finished');
            } catch (e) {
                console.error("Failed to analyze performance:", e);
                setError("The AI failed to analyze your performance. Please try again later.");
                setSessionState('error');
            }
        }
    };
    
    if (!scenario) return <div className="text-center">Scenario not found.</div>;
    
    if (sessionState === 'preAnalyzing') {
        return <MultiStepLoader loadingStates={analysisLoadingStates} loading={true} duration={800} />;
    }
    if (sessionState === 'analyzing') {
        return <SessionReportSkeleton />;
    }
    if (sessionState === 'finished' && analysis) {
        return <SessionReport report={analysis} scenarioName={scenario.name} />;
    }

    if (sessionState === 'chooseLanguage') {
        return (
            <div className="flex justify-center items-center h-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="max-w-md mx-auto text-center p-8">
                        <h2 className="text-2xl font-bold mb-4">Choose Scenario Language</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Select the language for the questions and analysis report.</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <Button size="lg" onClick={() => setLanguage('English')}>English</Button>
                            <Button size="lg" onClick={() => setLanguage('Indonesian Native')}>Indonesian Native</Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        )
    }
    
    if (sessionState === 'error') {
        return (
            <div className="flex flex-col justify-center items-center h-full text-center p-4">
                <Card className="max-w-md p-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
                        <Button onClick={() => setSessionState('chooseLanguage')}>Try Again</Button>
                        <Button variant="secondary" onClick={() => navigate('/dashboard/scenario')}>Choose Another</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (sessionState === 'preLoadingQuestions') {
        return <MultiStepLoader loadingStates={questionLoadingStates} loading={true} duration={625} />;
    }
    if (sessionState === 'loadingQuestions') {
        return <QuestionSkeleton />;
    }

    if (sessionState !== 'inProgress' || questions.length === 0) {
        // This case should ideally not be hit if state logic is correct, but it's a safe fallback.
        return <QuestionSkeleton />;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto">
             <motion.div
                className="w-full bg-light-primary dark:bg-dark-primary rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="text-sm text-light-text/80 dark:text-dark-text/70 ml-4 font-medium">{scenario.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center space-x-2 font-mono text-light-text dark:text-dark-text bg-light-secondary dark:bg-dark-secondary px-3 py-1 rounded-md">
                            <Clock size={16} />
                            <span>{formatTime(elapsedTime)}</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/scenario')}>Quit Session</Button>
                    </div>
                </div>

                {/* Progress */}
                 <div className="my-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.min(currentQuestionIndex + 1, questions.length)}/{questions.length}</span>
                    </div>
                    <div className="w-full bg-light-secondary dark:bg-dark-secondary rounded-full h-1.5">
                        <motion.div 
                            className="bg-light-accent dark:bg-dark-accent h-1.5 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[500px] flex flex-col"
                    >
                        <>
                            {/* Crisis Situation */}
                            <div
                                className="border border-red-500/50 bg-red-500/10 rounded-lg p-4 my-6 flex items-start gap-4"
                            >
                                <AlertTriangle className="text-red-500 dark:text-red-400 mt-1 flex-shrink-0" size={24} />
                                <div>
                                    <h3 className="font-bold text-red-600 dark:text-red-300">Crisis Situation</h3>
                                    <p className="text-red-800 dark:text-red-200">{currentQuestion.text}</p>
                                </div>
                            </div>

                            {/* Response Options */}
                            <div className="flex-grow flex flex-col">
                                <h4 className="text-lg font-semibold text-light-text dark:text-gray-200 mb-4">Your Response:</h4>
                                
                                <div className="space-y-3">
                                    {currentQuestion.options?.map((option, index) => {
                                        const isSelected = selectedOption === option;
                                        const hasSelection = selectedOption !== '';
                                        return (
                                            <motion.button
                                                layout
                                                key={index}
                                                onClick={() => setSelectedOption(option)}
                                                whileTap={{ scale: 0.98 }}
                                                animate={hasSelection ? (isSelected ? { opacity: 1 } : { opacity: 0.5 }) : { opacity: 1 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group cursor-pointer
                                                    ${isSelected
                                                        ? 'border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10 shadow-glow-light dark:shadow-glow'
                                                        : 'bg-light-secondary dark:bg-dark-secondary border-transparent hover:border-light-accent/30 dark:hover:border-dark-accent/30 shadow-sm'
                                                    }
                                                `}
                                            >
                                                {/* Custom radio button circle */}
                                                <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                                    ${isSelected
                                                        ? 'border-light-accent dark:border-dark-accent bg-light-accent dark:bg-dark-accent'
                                                        : `border-gray-400 dark:border-gray-600 group-hover:border-light-accent dark:group-hover:border-dark-accent`
                                                    }`}
                                                >
                                                    <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                                        >
                                                            <Check size={16} className="text-light-text dark:text-dark-primary" />
                                                        </motion.div>
                                                    )}
                                                    </AnimatePresence>
                                                </div>
                                                <span className={`transition-colors duration-300
                                                    ${isSelected
                                                        ? 'text-light-text dark:text-dark-text font-semibold'
                                                        : `text-gray-600 dark:text-gray-300 group-hover:text-light-text dark:group-hover:text-dark-text`
                                                    }`}
                                                >
                                                    {option.replace(/^[A-Z]:\s*/, '')}
                                                </span>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            
                                <div className="mt-6">
                                    <label htmlFor="custom-answer" className="block text-base font-medium text-gray-600 dark:text-gray-300 mb-2">
                                        Justification or Custom Answer (Optional)
                                    </label>
                                    <textarea
                                        id="custom-answer"
                                        value={customAnswer}
                                        onChange={(e) => setCustomAnswer(e.target.value)}
                                        rows={4}
                                        className="w-full bg-light-secondary dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-md p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                                        placeholder="Explain your choice or provide your own solution..."
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 text-center">
                                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                                <Button size="lg" onClick={handleNextQuestion} disabled={!selectedOption || sessionState !== 'inProgress'}>
                                    {currentQuestionIndex === questions.length - 1 
                                        ? 'Finish & Analyze'
                                        : 'Submit & Next'}
                                </Button>
                            </div>
                        </>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ScenarioSessionPage;