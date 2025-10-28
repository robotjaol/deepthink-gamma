import React from 'react';
import { Card } from '../ui/Card';
import { Loader2 } from 'lucide-react';

const SessionReportSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <div className="h-10 w-80 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
            
             <div className="flex items-center justify-center text-center p-4 mb-6 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                <Loader2 size={20} className="mr-3 animate-spin text-light-accent dark:text-dark-accent" />
                <p className="font-semibold text-lg">Analyzing your performance...</p>
            </div>


            {/* Score */}
            <Card className="mb-6 text-center">
                <div className="h-8 w-1/3 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-20 w-1/4 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
            </Card>
            
            {/* Strengths / Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <div className="h-7 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-4/5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </Card>
                <Card>
                     <div className="h-7 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                     <div className="space-y-2">
                        <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <div className="h-7 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-72 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </Card>
                <Card>
                    <div className="h-7 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-72 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </Card>
            </div>

            {/* Breakdown */}
             <Card className="mb-6">
                <div className="h-7 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-4">
                    <div className="h-20 w-full bg-gray-300/50 dark:bg-gray-700/50 rounded-lg"></div>
                    <div className="h-20 w-full bg-gray-300/50 dark:bg-gray-700/50 rounded-lg"></div>
                </div>
            </Card>
        </div>
    );
};

export default SessionReportSkeleton;