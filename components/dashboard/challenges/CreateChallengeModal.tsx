
import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { ScenarioLevel, ScenarioTemplate, Question, QuestionType } from '../../../types';
import { Pencil, Save, Plus, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarios } from '../../../contexts/ScenarioContext';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';
import { Card } from '../../ui/Card';

interface CreateChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTypes: string[];
    levels: ScenarioLevel[];
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ isOpen, onClose, levels }) => {
    const { addMyScenario } = useScenarios();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    
    const [step, setStep] = useState(1);

    // Step 1 State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [jobType, setJobType] = useState('');
    const [level, setLevel] = useState<ScenarioLevel>(ScenarioLevel.Newbie);
    const [tags, setTags] = useState('');

    // Step 2 State
    const [questions, setQuestions] = useState<Omit<Question, 'id' | 'type'>[]>([]);
    const [currentQuestionText, setCurrentQuestionText] = useState('');
    const [currentOptions, setCurrentOptions] = useState(['', '', '']);

    const handleAddQuestion = () => {
        if (currentQuestionText.trim() && currentOptions.every(o => o.trim())) {
            setQuestions([...questions, { text: currentQuestionText, options: [...currentOptions] }]);
            setCurrentQuestionText('');
            setCurrentOptions(['', '', '']);
        }
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const scenarioData: Omit<ScenarioTemplate, 'id' | 'authorId' | 'authorName' | 'authorProfilePictureUrl' | 'isPublished' | 'createdAt'> = {
            name, description, jobType, level,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            questions: questions.map((q, i) => ({ ...q, id: i + 1, type: QuestionType.MultipleChoice })),
        };
        const newScenario: ScenarioTemplate = {
            ...scenarioData,
            id: `custom-${Date.now()}`,
            authorId: user?.id,
            authorName: user?.name,
            authorProfilePictureUrl: user?.profilePictureUrl,
            isPublished: false,
            createdAt: new Date(),
        };
        addMyScenario(newScenario);
        addNotification('Your custom challenge has been created!', 'success', 'Challenge Saved');
        handleClose();
    };

    const handleClose = () => {
        setStep(1);
        setName(''); setDescription(''); setJobType(''); setLevel(ScenarioLevel.Newbie); setTags('');
        setQuestions([]); setCurrentQuestionText(''); setCurrentOptions(['', '', '']);
        onClose();
    };

    const isStep1Valid = name && description && jobType;
    const isStep2Valid = questions.length > 0;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
                        <Input label="Challenge Name" id="manual-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., The Marketing Budget Dilemma" required />
                        <div>
                            <label htmlFor="manual-desc" className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Description</label>
                            <textarea id="manual-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-lg p-3 border-2 border-light-accent/30 dark:border-dark-accent/30 focus:outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors" placeholder="Briefly describe the situation." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Job or Field" id="manual-jobType" value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="e.g., Business Management" required />
                            <Select label="Difficulty Level" value={level} onChange={(e) => setLevel(e.target.value as ScenarioLevel)} options={levels} />
                        </div>
                        <Input label="Tags (comma-separated)" id="manual-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Budgeting, Strategy, Teamwork" />
                    </motion.div>
                );
            case 2:
                return (
                     <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <Card className="bg-light-secondary dark:bg-dark-secondary p-4 space-y-3 mb-6">
                            <h4 className="font-semibold text-lg">Add a Question</h4>
                             <textarea value={currentQuestionText} onChange={(e) => setCurrentQuestionText(e.target.value)} rows={3} className="w-full bg-light-primary dark:bg-dark-primary rounded-lg p-2 border-2 border-light-accent/30 dark:border-dark-accent/30 focus:outline-none focus:border-light-accent dark:focus:border-dark-accent" placeholder="Write the question or situation here..." />
                             <div className="space-y-2">
                             {currentOptions.map((opt, i) => (
                                <Input key={i} label={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={(e) => {
                                    const newOpts = [...currentOptions];
                                    newOpts[i] = e.target.value;
                                    setCurrentOptions(newOpts);
                                }}/>
                             ))}
                             </div>
                             <div className="text-right">
                                <Button size="sm" onClick={handleAddQuestion} disabled={!currentQuestionText.trim() || currentOptions.some(o => !o.trim())}><Plus size={16} className="mr-2"/>Add Question</Button>
                             </div>
                        </Card>
                        <h4 className="font-semibold mb-2 text-lg">Added Questions ({questions.length})</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 rounded-lg">
                             {questions.length > 0 ? questions.map((q, i) => (
                                <div key={i} className="flex items-start justify-between p-3 rounded bg-light-secondary dark:bg-dark-secondary/50 text-sm">
                                    <div className="flex-grow">
                                        <p className="font-bold">{i+1}. {q.text}</p>
                                        <ul className="list-disc list-inside pl-4 mt-1 text-gray-600 dark:text-gray-400">
                                            {q.options?.map((opt, j) => <li key={j}>{opt}</li>)}
                                        </ul>
                                    </div>
                                    <button onClick={() => handleRemoveQuestion(i)} className="ml-2 text-red-500 hover:text-red-700 p-1 flex-shrink-0"><Trash2 size={16}/></button>
                                </div>
                             )) : <p className="text-center text-gray-500 py-4">No questions added yet.</p>}
                        </div>
                    </motion.div>
                );
            case 3:
                 return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <h3 className="text-xl font-bold">Review Your Challenge</h3>
                        <Card className="bg-light-secondary dark:bg-dark-secondary p-4 space-y-3">
                            <h4 className="font-bold text-lg">{name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{jobType} - {level}</p>
                            <p className="text-base">{description}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                               {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                                    <span key={tag} className="text-xs bg-light-primary dark:bg-dark-primary px-2 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </Card>
                        <h4 className="font-semibold text-lg">Questions ({questions.length})</h4>
                        <div className="space-y-2">
                            {questions.map((q, i) => (
                                <Card key={i} className="p-3">
                                    <p className="font-bold text-sm">{i+1}. {q.text}</p>
                                    <ul className="list-disc list-inside pl-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {q.options?.map((opt, j) => <li key={j}>{opt}</li>)}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };
    
    const stepLabels = ['Details', 'Questions', 'Review'];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <div className="flex items-center space-x-3 mb-4">
                <Pencil size={28}/>
                <h2 className="text-3xl font-bold">Create a Challenge</h2>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center w-full my-8">
                {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = step > stepNumber;
                    const isCurrent = step === stepNumber;
                    return (
                        <React.Fragment key={label}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300
                                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                                    ${isCurrent ? 'bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-primary scale-110' : ''}
                                    ${!isCompleted && !isCurrent ? 'bg-light-secondary dark:bg-dark-secondary' : ''}
                                `}>
                                    {isCompleted ? <Check size={20}/> : stepNumber}
                                </div>
                                <p className={`mt-2 text-xs font-semibold transition-colors ${isCurrent ? 'text-light-accent dark:text-dark-accent' : 'text-gray-500'}`}>{label}</p>
                            </div>
                            {index < stepLabels.length - 1 && (
                                <div className={`flex-grow h-1 transition-colors duration-300 mx-2 ${step > stepNumber ? 'bg-green-500' : 'bg-light-secondary dark:bg-dark-secondary'}`}/>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <div>
                    {step > 1 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}><ArrowLeft size={16} className="mr-2"/>Back</Button>}
                </div>
                <div>
                     {step < 3 && <Button onClick={() => setStep(s => s + 1)} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}>Next <ArrowRight size={16} className="ml-2"/></Button>}
                     {step === 3 && <Button onClick={handleSave}><Save size={16} className="mr-2"/>Save Challenge</Button>}
                </div>
            </div>
        </Modal>
    );
};

const Select: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-lg p-3 border-2 border-light-accent/30 dark:border-dark-accent/30 focus:outline-none focus:border-light-accent dark:focus:border-dark-accent transition-colors">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default CreateChallengeModal;
