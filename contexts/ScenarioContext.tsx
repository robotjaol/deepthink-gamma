

import React, { createContext, useState, ReactNode, useContext, useCallback, useMemo } from 'react';
import { ScenarioTemplate, ScenarioLevel } from '../types';

// Dummy Data
const DUMMY_PUBLISHED_CHALLENGES: ScenarioTemplate[] = [
    {
        id: 'challenge-1',
        name: 'Sudden PR Crisis',
        jobType: 'Public Relations',
        level: ScenarioLevel.Expert,
        description: 'The company\'s main product is discovered to have a major flaw, and social media is exploding. Formulate an immediate response.',
        tags: ['Crisis Management', 'Social Media', 'PR'],
        authorId: 'user-2',
        authorName: 'Strategist Supreme',
        authorProfilePictureUrl: 'https://picsum.photos/id/1011/100/100',
        isPublished: true,
        createdAt: new Date('2024-07-20T10:00:00Z'),
    },
    {
        id: 'challenge-2',
        name: 'Hostile Team Member',
        jobType: 'Business Management',
        level: ScenarioLevel.Newbie,
        description: 'A key member of your team is consistently challenging your authority and creating a negative environment. How do you handle the situation?',
        tags: ['Team Management', 'Conflict Resolution'],
        authorId: 'user-3',
        authorName: 'Pro Decision-Maker',
        authorProfilePictureUrl: 'https://picsum.photos/id/1025/100/100',
        isPublished: true,
        createdAt: new Date('2024-07-19T14:30:00Z'),
    },
];

const DUMMY_MY_SCENARIOS: ScenarioTemplate[] = [
    {
        id: 'my-scenario-1',
        name: 'Project Deadline Risk',
        jobType: 'Information Technology',
        level: ScenarioLevel.Expert,
        description: 'A critical project is at risk of missing its deadline due to unforeseen technical debt. How do you communicate this to stakeholders and adjust the plan?',
        tags: ['Project Management', 'Risk', 'Stakeholder'],
        authorId: '1',
        authorName: 'Alex Johnson',
        authorProfilePictureUrl: 'https://picsum.photos/id/1005/200/200',
        isPublished: false,
        createdAt: new Date('2024-07-21T09:00:00Z'),
    },
];

// FIX: Implement ScenarioContext, ScenarioProvider, and useScenarios hook
interface ScenarioContextType {
    myScenarios: ScenarioTemplate[];
    publishedChallenges: ScenarioTemplate[];
    favoriteIds: string[];
    addMyScenario: (scenario: ScenarioTemplate) => void;
    publishScenario: (scenarioId: string) => void;
    toggleFavorite: (scenarioId: string) => void;
    removeMyScenario: (scenarioId: string) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export const useScenarios = () => {
    const context = useContext(ScenarioContext);
    if (!context) {
        throw new Error('useScenarios must be used within a ScenarioProvider');
    }
    return context;
};

export const ScenarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [myScenarios, setMyScenarios] = useState<ScenarioTemplate[]>(DUMMY_MY_SCENARIOS);
    const [publishedChallenges, setPublishedChallenges] = useState<ScenarioTemplate[]>(DUMMY_PUBLISHED_CHALLENGES);
    const [favoriteIds, setFavoriteIds] = useState<string[]>(['challenge-2']); // Dummy favorite

    const addMyScenario = useCallback((scenario: ScenarioTemplate) => {
        setMyScenarios(prev => [scenario, ...prev]);
    }, []);

    const publishScenario = useCallback((scenarioId: string) => {
        setMyScenarios(prevMyScenarios => {
            const scenarioToPublish = prevMyScenarios.find(s => s.id === scenarioId);
            if (scenarioToPublish && !scenarioToPublish.isPublished) {
                const updatedScenario = { ...scenarioToPublish, isPublished: true, createdAt: new Date() };
                setPublishedChallenges(prevPublished => [updatedScenario, ...prevPublished]);
                return prevMyScenarios.map(s => s.id === scenarioId ? updatedScenario : s);
            }
            return prevMyScenarios;
        });
    }, []);

    const toggleFavorite = useCallback((scenarioId: string) => {
        setFavoriteIds(prev =>
            prev.includes(scenarioId)
                ? prev.filter(id => id !== scenarioId)
                : [...prev, scenarioId]
        );
    }, []);

    const removeMyScenario = useCallback((scenarioId: string) => {
        setMyScenarios(prev => prev.filter(s => s.id !== scenarioId));
        // Also remove from published challenges if it was published
        setPublishedChallenges(prev => prev.filter(s => s.id !== scenarioId));
    }, []);

    const value = useMemo(() => ({
        myScenarios,
        publishedChallenges,
        favoriteIds,
        addMyScenario,
        publishScenario,
        toggleFavorite,
        removeMyScenario,
    }), [myScenarios, publishedChallenges, favoriteIds, addMyScenario, publishScenario, toggleFavorite, removeMyScenario]);

    return (
        <ScenarioContext.Provider value={value}>
            {children}
        </ScenarioContext.Provider>
    );
};