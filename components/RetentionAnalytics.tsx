
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { day: 0, retention: 100 },
  { day: 1, retention: 80 },
  { day: 2, retention: 65 },
  { day: 3, retention: 55 },
  { day: 5, retention: 45 },
  { day: 7, retention: 38 },
  { day: 10, retention: 32 },
  { day: 14, retention: 28 },
];

const RetentionAnalytics: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Memory Decay Model</h3>
        <p className="text-xs text-slate-500">Predicted retention (%) over time since last review</p>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              label={{ value: 'Days', position: 'insideBottomRight', offset: -10, fontSize: 10 }}
              fontSize={10}
            />
            <YAxis 
              domain={[0, 100]} 
              fontSize={10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="retention" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorRetention)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
        <p className="text-xs text-indigo-700 leading-relaxed">
          <strong>Insight:</strong> Your retention drops below the "Ebbinghaus Threshold" (40%) after day 6. Optimal review window detected at Day 3 and Day 7.
        </p>
      </div>
    </div>
  );
};

export default RetentionAnalytics;
