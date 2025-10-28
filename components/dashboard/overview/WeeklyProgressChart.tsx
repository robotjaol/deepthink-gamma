import React from 'react';
import { Card } from '../../ui/Card';
import { DUMMY_WEEKLY_PROGRESS } from '../../../constants';
import { Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WeeklyProgressChart: React.FC = () => {
    return (
        <Card>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Calendar className="mr-2"/> Weekly Progress</h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DUMMY_WEEKLY_PROGRESS}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '0.5rem' }} />
                        <Bar dataKey="score" fill="#AED6F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

export default WeeklyProgressChart;
