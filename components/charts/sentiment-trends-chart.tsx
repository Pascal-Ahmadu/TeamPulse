'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SentimentTrendsChartProps {
  data: any[];
}

export default function SentimentTrendsChart({ data }: SentimentTrendsChartProps) {
  const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  // Get team names (excluding 'date')
  const teamNames = Object.keys(data[0] || {}).filter(key => key !== 'date');

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            domain={[1, 3]}
            tickFormatter={(value) => {
              if (value === 1) return 'Sad';
              if (value === 2) return 'Neutral';
              if (value === 3) return 'Happy';
              return value;
            }}
          />
          <Tooltip 
            labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
            formatter={(value: any, name: string) => [
              `${typeof value === 'number' ? value.toFixed(2) : value}`,
              name
            ]}
          />
          <Legend />
          {teamNames.map((teamName, index) => (
            <Line
              key={teamName}
              type="monotone"
              dataKey={teamName}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}