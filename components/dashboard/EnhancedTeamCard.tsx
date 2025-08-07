// components/dashboard/EnhancedTeamCard.tsx

import { 
  Card, CardHeader, CardContent, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Smile, Meh, Frown, ChevronRight } from 'lucide-react';

interface EnhancedTeamCardProps {
  team: {
    id: string;
    name: string;
    description?: string;
    members: Array<{ sentiment: 'HAPPY' | 'NEUTRAL' | 'SAD' }>;
  };
}

/**
 * Team Card Component with Sentiment Analysis
 * @param {EnhancedTeamCardProps} props - Component properties
 * @returns {JSX.Element} Interactive team card with sentiment visualization
 */
export default function EnhancedTeamCard({ team }: EnhancedTeamCardProps) {
  const memberCount = team.members.length;
  
  // Calculate sentiment metrics
  const sentimentCounts = {
    HAPPY: team.members.filter(m => m.sentiment === 'HAPPY').length,
    NEUTRAL: team.members.filter(m => m.sentiment === 'NEUTRAL').length,
    SAD: team.members.filter(m => m.sentiment === 'SAD').length,
  };

  const sentimentScore = memberCount > 0 
    ? ((sentimentCounts.HAPPY * 3 + sentimentCounts.NEUTRAL * 2 + sentimentCounts.SAD * 1) / memberCount)
    : 0;

  // Sentiment classification
  const getSentimentIndicator = (score: number) => {
    if (score >= 2.5) return { 
      color: 'bg-gradient-to-r from-blue-600 to-indigo-600', 
      text: 'Strong', 
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50/80'
    };
    if (score >= 2) return { 
      color: 'bg-gradient-to-r from-slate-500 to-slate-600', 
      text: 'Moderate', 
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-50/80'
    };
    return { 
      color: 'bg-gradient-to-r from-red-500 to-red-600', 
      text: 'At Risk', 
      textColor: 'text-red-700',
      bgColor: 'bg-red-50/80'
    };
  };

  const indicator = getSentimentIndicator(sentimentScore);

  return (
    <Card className="group relative border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base font-light text-slate-900 mb-1 tracking-tight">
              {team.name}
            </CardTitle>
            {team.description && (
              <CardDescription className="text-xs font-light text-slate-500 leading-relaxed">
                {team.description}
              </CardDescription>
            )}
          </div>
          <div className={`px-3 py-1.5 rounded-full ${indicator.bgColor} flex items-center space-x-2 shadow-sm w-fit`}>
            <div className={`w-2 h-2 rounded-full ${indicator.color}`} />
            <span className={`text-xs font-light ${indicator.textColor}`}>
              {indicator.text}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sentiment Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-light text-slate-500 uppercase tracking-wide">
              Sentiment Score
            </span>
            <span className="text-sm font-light text-slate-700">
              {sentimentScore.toFixed(1)}
            </span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`absolute inset-y-0 left-0 ${indicator.color} rounded-full transition-all duration-700`}
              style={{ width: `${(sentimentScore / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Member Count and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
              <Users className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-light text-slate-500">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-3 text-xs font-light text-slate-500 hover:text-blue-600 hover:bg-blue-50 group/btn rounded-lg"
          >
            View
            <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>

        {/* Sentiment Breakdown */}
        {memberCount > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                  <Smile className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-xs font-light text-slate-900">
                {sentimentCounts.HAPPY}
              </div>
              <div className="text-xs font-light text-slate-400">
                positive
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 shadow-sm">
                  <Meh className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-xs font-light text-slate-900">
                {sentimentCounts.NEUTRAL}
              </div>
              <div className="text-xs font-light text-slate-400">
                neutral
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                  <Frown className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-xs font-light text-slate-900">
                {sentimentCounts.SAD}
              </div>
              <div className="text-xs font-light text-slate-400">
                needs support
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}