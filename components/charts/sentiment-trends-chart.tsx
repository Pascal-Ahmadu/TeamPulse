'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';

interface SentimentTrendsChartProps {
  data: any[];
}

export default function SentimentTrendsChart({ data }: SentimentTrendsChartProps) {
  // Modern gradient colors that match your design
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Emerald  
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16'  // Lime
  ];

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No trend data available</p>
        <p className="text-sm text-slate-400 mt-1">Data will appear here once teams submit feedback</p>
      </div>
    );
  }

  // Get team names (excluding 'date')
  const teamNames = Object.keys(data[0] || {}).filter(key => key !== 'date');

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <p className="text-sm font-semibold text-slate-900">
              {new Date(label).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm font-medium text-slate-700">{entry.dataKey}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {entry.value.toFixed(2)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    {entry.value >= 2.5 ? '😊' : entry.value >= 2.0 ? '🙂' : entry.value >= 1.5 ? '😐' : '😟'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0" 
            strokeOpacity={0.5}
            horizontal={true}
            vertical={false}
          />
          
          <XAxis 
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => 
              new Date(value).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            }
            dy={10}
          />
          
          <YAxis 
            domain={[1, 3]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => {
              if (value === 1) return 'Concerned 😟';
              if (value === 2) return 'Neutral 😐';
              if (value === 3) return 'Happy 😊';
              return value;
            }}
            dx={-10}
          />
          
          <Tooltip 
            content={customTooltip as any}
            cursor={{ 
              stroke: '#94a3b8', 
              strokeWidth: 1, 
              strokeDasharray: '4 4',
              strokeOpacity: 0.5 
            }}
          />
          
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
            iconType="circle"
          />
          
          {teamNames.map((teamName, index) => (
            <Line
              key={`line-${teamName}`}
              type="monotone"
              dataKey={teamName}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ 
                fill: colors[index % colors.length],
                strokeWidth: 3,
                stroke: '#ffffff',
                r: 5
              }}
              activeDot={{ 
                r: 7, 
                fill: colors[index % colors.length],
                stroke: '#ffffff',
                strokeWidth: 3
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}