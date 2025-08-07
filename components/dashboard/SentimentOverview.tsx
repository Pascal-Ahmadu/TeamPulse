// components/dashboard/SentimentOverview.tsx

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface SentimentOverviewProps {
  sentimentBreakdown: { HAPPY: number; NEUTRAL: number; SAD: number };
  memberCount: number;
}

/**
 * Sentiment Overview Component
 * @param {SentimentOverviewProps} props - Component properties
 * @returns {JSX.Element} Sentiment distribution visualization
 */
export default function SentimentOverview({ 
  sentimentBreakdown, 
  memberCount 
}: SentimentOverviewProps) {
  return (
    <div className="mb-8 sm:mb-10">
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-base font-light text-slate-900 tracking-tight flex items-center space-x-2 sm:space-x-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              
            </div>
            <span>Sentiment Distribution</span>
          </CardTitle>
          <CardDescription className="text-xs font-light text-slate-500 mt-1">
            Current emotional climate across all teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light text-slate-500 uppercase tracking-wide">
                  Positive
                </span>
                <span className="text-sm font-light text-slate-700">
                  {sentimentBreakdown.HAPPY}
                </span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                  style={{ width: `${(sentimentBreakdown.HAPPY / memberCount) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light text-slate-500 uppercase tracking-wide">
                  Neutral
                </span>
                <span className="text-sm font-light text-slate-700">
                  {sentimentBreakdown.NEUTRAL}
                </span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full transition-all duration-700"
                  style={{ width: `${(sentimentBreakdown.NEUTRAL / memberCount) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light text-slate-500 uppercase tracking-wide">
                  At Risk
                </span>
                <span className="text-sm font-light text-slate-700">
                  {sentimentBreakdown.SAD}
                </span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700"
                  style={{ width: `${(sentimentBreakdown.SAD / memberCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}