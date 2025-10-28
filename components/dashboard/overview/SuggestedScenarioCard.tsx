import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { DUMMY_HISTORY } from '../../../constants';
import { getAIChallengeSuggestion } from '../../../services/geminiService';
import { ScenarioTemplate } from '../../../types';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { Lightbulb, AlertTriangle } from 'lucide-react';

const SuggestedScenarioCard: React.FC = () => {
    const navigate = useNavigate();
    const [suggestion, setSuggestion] = useState<Omit<ScenarioTemplate, 'id'> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                const result = await getAIChallengeSuggestion(DUMMY_HISTORY);
                setSuggestion(result);
            } catch (err) {
                setError("Could not fetch AI suggestion. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        // Delay fetch to allow animation and page load
        const timer = setTimeout(fetchSuggestion, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        if (!suggestion) return;
        const scenarioWithId: ScenarioTemplate = { ...suggestion, id: `ai-gen-${Date.now()}` };
        navigate(`/dashboard/scenario/custom-session`, { state: { customScenario: scenarioWithId } });
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Lightbulb className="mr-3 text-light-accent dark:text-dark-gold" />
                    Your Next Challenge
                </h2>
                {isLoading && <div className="h-24"><LoadingSpinner/></div>}
                {error && (
                    <div className="flex flex-col items-center text-center text-red-500">
                        <AlertTriangle className="mb-2" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {suggestion && !isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="text-xl font-bold mb-2">{suggestion.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{suggestion.description}</p>
                        <div className="flex flex-wrap gap-2">
                           {suggestion.tags.map(tag => (
                                <span key={tag} className="text-xs bg-light-secondary dark:bg-dark-secondary px-2 py-1 rounded-md">{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
             <div className="flex space-x-4 mt-6">
                <Button onClick={handleStart} disabled={isLoading || !!error}>Start AI Challenge</Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/scenario')}>Browse All</Button>
            </div>
        </Card>
    );
};

export default SuggestedScenarioCard;
