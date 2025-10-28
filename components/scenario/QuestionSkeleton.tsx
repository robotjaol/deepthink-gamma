import React from 'react';

const QuestionSkeleton: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
            <div
                className="w-full bg-light-primary dark:bg-dark-primary rounded-xl shadow-2xl p-4 border border-gray-200/50 dark:border-gray-800/50"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                    </div>
                </div>

                {/* Progress */}
                 <div className="my-4">
                    <div className="flex justify-between items-center mb-1">
                        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5"></div>
                </div>
                
                <div className="min-h-[500px]">
                    {/* Crisis Situation */}
                    <div
                        className="border border-gray-300 dark:border-gray-700 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg p-4 my-6 flex items-start gap-4"
                    >
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>

                    {/* Response Options */}
                    <div className="flex-grow flex flex-col">
                        <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                        
                        <div className="space-y-3">
                            <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                            <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                            <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                    
                        <div className="mt-6">
                             <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionSkeleton;