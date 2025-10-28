import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DUMMY_HISTORY, DUMMY_SCENARIOS } from '../../constants';
import { Card } from '../../components/ui/Card';
// FIX: Changed to a default import to match the export in SessionReport.tsx
import SessionReport from '../../components/scenario/SessionReport';
import { Session } from '../../types';
import Modal from '../../components/ui/Modal';
import HistoryItem from '../../components/dashboard/history/HistoryItem';
import EmptyState from '../../components/ui/EmptyState';
import { BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FieldLevelSummaryCard from '../../components/dashboard/history/FieldLevelSummaryCard';

interface FieldLevelData {
    jobType: string;
    level: number;
    totalXp: number;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
}

const HistoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const navigate = useNavigate();

    const fieldLevels = useMemo((): FieldLevelData[] => {
        const xpByField: Record<string, number> = {};

        DUMMY_HISTORY.forEach(session => {
            const scenario = DUMMY_SCENARIOS.find(s => s.id === session.scenarioId);
            if (scenario) {
                if (!xpByField[scenario.jobType]) {
                    xpByField[scenario.jobType] = 0;
                }
                xpByField[scenario.jobType] += session.score;
            }
        });

        const XP_PER_LEVEL = 100;
        return Object.entries(xpByField).map(([jobType, totalXp]) => {
            const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
            const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
            return {
                jobType,
                totalXp,
                level,
                xpInCurrentLevel,
                xpForNextLevel: XP_PER_LEVEL,
            };
        }).sort((a, b) => b.totalXp - a.totalXp);
    }, []);

    const handleViewReport = useCallback((session: Session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };
    
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Training Log & Analysis</h1>
            
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {DUMMY_HISTORY.length > 0 ? (
                    <>
                        <motion.div variants={itemVariants}>
                            <FieldLevelSummaryCard fieldLevels={fieldLevels} />
                        </motion.div>
                        
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
                            {DUMMY_HISTORY.map(session => (
                                <motion.div key={session.id} variants={itemVariants}>
                                    <HistoryItem session={session} onViewReport={() => handleViewReport(session)} />
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                     <motion.div variants={itemVariants}>
                        <EmptyState 
                          icon={<BrainCircuit size={48} />}
                          title="No History Yet"
                          message="Complete your first scenario to see your performance analysis here."
                          action={{
                            label: "Explore Scenarios",
                            onClick: () => navigate('/dashboard/scenario'),
                          }}
                        />
                    </motion.div>
                )}
            </motion.div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
                {selectedSession && (
                    <SessionReport 
                        report={selectedSession.analysis} 
                        scenarioName={selectedSession.scenarioName}
                    />
                )}
            </Modal>
        </div>
    );
};

export default HistoryPage;