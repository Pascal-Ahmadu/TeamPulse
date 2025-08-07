// app/dashboard/page.tsx

import { Suspense } from 'react';
import { getTeams } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, TrendingUp, Heart, Smile, Plus, 
  BarChart3, Activity, Clock, ArrowUpRight 
} from 'lucide-react';
import AddTeamForm from '@/components/teams/add-team-form';
import StatsCardSkeleton from '@/components/dashboard/skeletons/StatsCardSkeleton';
import UnifiedStatsCard from '@/components/dashboard/UnifiedStatsCard';
import SentimentOverview from '@/components/dashboard/SentimentOverview';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

/**
 * Dashboard Page - Main View
 * @returns {JSX.Element} Team analytics dashboard with sentiment metrics
 */
export default async function DashboardPage() {
  const teams = await getTeams();
  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
  
  // Calculate comprehensive stats
  let totalSentimentScore = 0;
  let memberCount = 0;
  const sentimentBreakdown = { HAPPY: 0, NEUTRAL: 0, SAD: 0 };
  
  teams.forEach(team => {
    team.members.forEach(member => {
      memberCount++;
      sentimentBreakdown[member.sentiment]++;
      switch (member.sentiment) {
        case 'HAPPY': totalSentimentScore += 3; break;
        case 'NEUTRAL': totalSentimentScore += 2; break;
        case 'SAD': totalSentimentScore += 1; break;
        default: totalSentimentScore += 2;
      }
    });
  });
  
  const overallSentiment = memberCount > 0 
    ? (totalSentimentScore / memberCount).toFixed(1) 
    : '0.0';
    
  const happyPercentage = memberCount > 0 
    ? Math.round((sentimentBreakdown.HAPPY / memberCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <DashboardHeader />
        
        <UnifiedStatsCard 
          teams={teams}
          totalMembers={totalMembers}
          overallSentiment={overallSentiment}
          happyPercentage={happyPercentage}
        />

        {memberCount > 0 && (
          <SentimentOverview 
            sentimentBreakdown={sentimentBreakdown} 
            memberCount={memberCount} 
          />
        )}

        <div className="mb-8 sm:mb-10">
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-blue-100/80 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-light text-slate-900 tracking-tight flex items-center space-x-2 sm:space-x-3">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <span>Add Team</span>
                  </CardTitle>
                  <CardDescription className="text-xs font-light text-slate-500 mt-1">
                    Create a new team to start tracking sentiment
                  </CardDescription>
                </div>
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg opacity-60">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <Suspense fallback={<div className="h-16 bg-blue-50/50 rounded-lg animate-pulse" />}>
                <AddTeamForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}