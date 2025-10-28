import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, Variants } from 'framer-motion';
import { AnalysisReport } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Swords, CheckCircle2, Brain, Rocket, AlertCircle, ListChecks, Download, Clock, BookOpen, Link as LinkIcon, Share2 } from 'lucide-react';
import ShareReportModal from './ShareReportModal';

interface SessionReportProps {
  report: AnalysisReport;
  scenarioName: string;
}

const COLORS = ['#D4AF37', '#AED6F1', '#A3E635', '#9CA3AF']; // Gold, Blue, Green, Gray

const SessionReport: React.FC<SessionReportProps> = ({ report, scenarioName }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
        borderRadius: '0.5rem',
        color: theme === 'dark' ? '#EAEAEA' : '#17202A',
    };

    const handlePrint = () => {
        window.print();
    };
    
  return (
    <>
    <motion.div 
        className="print-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        {/* Print-only Header */}
        <div className="print-show-flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
            <div className="flex items-center space-x-3">
                <Swords size={32} className="print-text-black"/>
                <span className="text-2xl font-bold print-text-black">DeepThink</span>
            </div>
            <div className="text-right text-sm print-text-black">
                <p className="font-bold">Session Report: {scenarioName}</p>
                <p>Generated on: {new Date().toLocaleDateString()}</p>
            </div>
        </div>

      {/* On-screen Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8 flex-wrap gap-4 print-hide">
        <div>
            <h1 className="text-4xl font-bold">Session Analysis: {scenarioName}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">Here's a breakdown of your performance.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setIsShareModalOpen(true)} variant="secondary" className="no-print">
                <Share2 size={20} className="mr-2" />
                Share Report
            </Button>
            <Button onClick={handlePrint} className="no-print">
                <Download size={20} className="mr-2" />
                Download PDF
            </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="mb-6 text-center print-card">
            <h2 className="text-2xl font-semibold mb-2 print-h2">Overall Score</h2>
            <p className="text-7xl font-bold text-light-text dark:text-dark-gold print-text-black">{report.overallScore}<span className="text-3xl text-gray-400">/100</span></p>
        </Card>
      </motion.div>
      
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print-two-column" variants={itemVariants}>
        <Card className="print-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center print-h3"><CheckCircle2 className="mr-2 text-green-500" /> Strengths</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 print-text-black">
            {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </Card>
        <Card className="print-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center print-h3"><Brain className="mr-2 text-blue-500" /> Areas for Improvement</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 print-text-black">
            {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </Card>
      </motion.div>
      
      {report.responseSpeedAnalysis && (
          <motion.div variants={itemVariants}>
            <Card className="mb-6 print-card">
                <h3 className="text-xl font-semibold mb-4 flex items-center print-h3"><Clock className="mr-2 text-cyan-500" /> Response Speed Analysis</h3>
                <p className="print-text-black">{report.responseSpeedAnalysis}</p>
            </Card>
          </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card className="mb-6 print-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center print-h3"><Rocket className="mr-2 text-purple-500" /> AI-Powered Optimizations</h3>
            <ul className="list-disc list-inside space-y-2 pl-2 print-text-black">
            {report.optimizations.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
        </Card>
      </motion.div>
      
      {report.cognitiveBiases && report.cognitiveBiases.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="mb-6 print-card">
                <h2 className="print-h2 text-xl font-semibold mb-4 flex items-center"><AlertCircle className="mr-2 text-yellow-500" /> Cognitive Bias Detection</h2>
                <div className="space-y-4">
                {report.cognitiveBiases.map((bias, i) => (
                    <div key={i} className="p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                        <h4 className="font-semibold print-h4 print-text-black">{bias.bias}</h4>
                        <p className="text-gray-600 dark:text-gray-400 print-text-black">{bias.explanation}</p>
                    </div>
                ))}
                </div>
            </Card>
          </motion.div>
      )}

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print-two-column" variants={itemVariants}>
          <Card className="print-card">
              <h2 className="text-xl font-semibold mb-4 print-h2">Performance Metrics</h2>
              <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis dataKey="name" stroke={'#17202A'} fontSize={12} />
                      <YAxis stroke={'#17202A'} fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(174, 214, 241, 0.1)' }} />
                      <Bar dataKey="value" fill={'#AED6F1'} radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
          </Card>
          <Card className="print-card">
              <h2 className="text-xl font-semibold mb-4 print-h2">Decision-Making Style</h2>
              <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                      <Pie 
                          data={report.decisionMakingData} 
                          cx="50%" 
                          cy="50%" 
                          labelLine={false} 
                          outerRadius={110} 
                          innerRadius={70}
                          fill="#8884d8" 
                          dataKey="value" 
                          /* FIX: Explicitly convert percent to a number before performing arithmetic to prevent type errors. */
                          label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                          stroke={theme === 'dark' ? '#1E1E1E' : '#F0F0F0'}
                      >
                          {report.decisionMakingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{fontSize: "12px"}}/>
                  </PieChart>
              </ResponsiveContainer>
          </Card>
      </motion.div>

       {report.questionBreakdown && report.questionBreakdown.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="mb-6 print-card">
                <h2 className="print-h2 text-xl font-semibold mb-4 flex items-center"><ListChecks className="mr-2 text-indigo-500" /> Question-by-Question Breakdown</h2>
                <div className="space-y-4">
                {report.questionBreakdown.map((item, i) => (
                    <div key={i} className="p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg border-l-4 border-light-accent dark:border-dark-accent">
                        <p className="font-semibold italic text-gray-600 dark:text-gray-400 print-text-black">Q: {item.questionText}</p>
                        <p className="my-1 print-text-black"><strong className="font-medium">Your Answer:</strong> {item.userAnswer}</p>
                        <p className="text-green-700 dark:text-green-400 print-text-black"><strong className="font-medium">AI Feedback:</strong> {item.aiFeedback}</p>
                    </div>
                ))}
                </div>
            </Card>
          </motion.div>
      )}

      {report.suggestedResources && (report.suggestedResources.keywords.length > 0 || report.suggestedResources.references.length > 0) && (
        <motion.div variants={itemVariants}>
            <Card className="mb-6 print-card">
                <h2 className="print-h2 text-xl font-semibold mb-4 flex items-center"><BookOpen className="mr-2 text-orange-500" /> Further Learning</h2>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2 print-h4 print-text-black">Keywords for Research:</h4>
                        <div className="flex flex-wrap gap-2">
                            {report.suggestedResources.keywords.map((keyword, i) => (
                                <span key={i} className="px-3 py-1 text-sm bg-light-primary dark:bg-dark-primary rounded-full print-text-black border border-gray-300">{keyword}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 print-h4 print-text-black">Suggested Articles & Videos:</h4>
                        <ul className="space-y-2">
                            {report.suggestedResources.references.map((ref, i) => (
                                <li key={i} className="flex items-start">
                                    <LinkIcon size={16} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-light-accent dark:text-dark-accent hover:underline print-text-black">{ref.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-8 text-center no-print flex justify-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/dashboard/overview')}>Dashboard</Button>
        <Button onClick={() => navigate('/dashboard/scenario')}>Back to Scenarios</Button>
      </motion.div>
      
      {/* Print-only Footer */}
      <div className="print-show text-center mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} DeepThink - Confidential Performance Report</p>
      </div>
    </motion.div>
    <ShareReportModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        report={report}
        scenarioName={scenarioName}
    />
    </>
  );
};

export default SessionReport;