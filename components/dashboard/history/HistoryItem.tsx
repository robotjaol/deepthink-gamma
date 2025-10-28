import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Session } from '../../../types';

const HistoryItem: React.FC<{ session: Session, onViewReport: () => void }> = ({ session, onViewReport }) => (
    <Card className="mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h3 className="text-xl font-bold">{session.scenarioName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed on: {session.endTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-2xl font-bold">{session.score}<span className="text-base text-gray-400">/100</span></p>
                    <p className="text-sm">Score</p>
                </div>
                <Button variant="secondary" onClick={onViewReport}>View Report</Button>
            </div>
        </div>
    </Card>
);

export default React.memo(HistoryItem);