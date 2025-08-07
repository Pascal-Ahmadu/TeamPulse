import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/types';
import { Users, TrendingUp, Calendar, ArrowRight, Activity } from 'lucide-react';
import { getTeamSentimentAverage } from '@/lib/data';

interface TeamCardProps {
  team: Team;
}

export default async function TeamCard({ team }: TeamCardProps) {
  const sentimentAvg = await getTeamSentimentAverage(team.id);
  
  const getSentimentData = (avg: number) => {
    if (avg >= 2.5) return {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      label: 'Excellent',
      emoji: '😊'
    };
    if (avg >= 2.0) return {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Good',
      emoji: '🙂'
    };
    if (avg >= 1.5) return {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Neutral',
      emoji: '😐'
    };
    return {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Needs Attention',
      emoji: '😟'
    };
  };

  const sentimentData = getSentimentData(sentimentAvg);
  
  // Calculate sentiment distribution
  const happyCount = team.members.filter(m => m.sentiment === 'HAPPY').length;
  const neutralCount = team.members.filter(m => m.sentiment === 'NEUTRAL').length;
  const sadCount = team.members.filter(m => m.sentiment === 'SAD').length;
  const totalMembers = team.members.length;

  // Calculate percentages for progress bars
  const happyPercent = totalMembers > 0 ? (happyCount / totalMembers) * 100 : 0;
  const neutralPercent = totalMembers > 0 ? (neutralCount / totalMembers) * 100 : 0;
  const sadPercent = totalMembers > 0 ? (sadCount / totalMembers) * 100 : 0;

  return (
    <Link href={`/teams/${team.id}`} className="group block">
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:scale-[1.02] h-full">
        {/* Header Section */}
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {team.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <CardDescription className="text-xs text-slate-500">
                    Created {team.createdAt.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </CardDescription>
                </div>
              </div>
            </div>
            
            {/* Sentiment Score */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${sentimentData.bgColor} ${sentimentData.borderColor} border`}>
              <div className={`w-2 h-2 rounded-full ${sentimentData.color} animate-pulse`} />
              <span className={`text-xs font-semibold ${sentimentData.textColor}`}>
                {sentimentAvg.toFixed(1)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Team Stats */}
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {totalMembers} {totalMembers === 1 ? 'member' : 'members'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>

          {/* Sentiment Overview */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Team Sentiment</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">{sentimentData.emoji}</span>
                <Badge variant="outline" className={`text-xs ${sentimentData.textColor} ${sentimentData.borderColor}`}>
                  {sentimentData.label}
                </Badge>
              </div>
            </div>
            
            {totalMembers > 0 ? (
              <>
                {/* Sentiment Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                  <div className="h-full flex">
                    {happyPercent > 0 && (
                      <div 
                        className="bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${happyPercent}%` }}
                      />
                    )}
                    {neutralPercent > 0 && (
                      <div 
                        className="bg-yellow-500 transition-all duration-500" 
                        style={{ width: `${neutralPercent}%` }}
                      />
                    )}
                    {sadPercent > 0 && (
                      <div 
                        className="bg-red-500 transition-all duration-500" 
                        style={{ width: `${sadPercent}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Sentiment Distribution */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    {happyCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                        <span className="text-slate-600 font-medium">
                          {happyCount} happy
                        </span>
                      </div>
                    )}
                    {neutralCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                        <span className="text-slate-600 font-medium">
                          {neutralCount} neutral
                        </span>
                      </div>
                    )}
                    {sadCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                        <span className="text-slate-600 font-medium">
                          {sadCount} concerned
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500">No members yet</p>
              </div>
            )}
          </div>

          {/* Action Indicator */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp className="h-3 w-3" />
              <span>View detailed analytics</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}