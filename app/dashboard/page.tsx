// app/dashboard/page.tsx

import { Suspense } from 'react';
import { getTeams, getTeamStats } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, TrendingUp, Heart, Smile, Plus, 
  BarChart3, Activity, Clock, ArrowUpRight 
} from 'lucide-react';
import AddTeamForm from '@/components/teams/add-team-form';
import UnifiedStatsCard from '@/components/dashboard/UnifiedStatsCard';
import SentimentOverview from '@/components/dashboard/SentimentOverview';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

/**
 * Dashboard Page - Main View
 * @returns {JSX.Element} Team analytics dashboard with sentiment metrics
 */
const DashboardPage = async () => {
  try {
    // Get teams and overall stats in parallel for better performance
    const [teams, teamStats] = await Promise.all([
      getTeams(),
      getTeamStats()
    ]);

    console.log('Teams data:', teams);
    console.log('Team stats:', teamStats);

    // Use the totalMembers from teamStats for accuracy
    const totalMembers = teamStats.totalMembers;
    
    // Calculate comprehensive stats from teams data
    let calculatedMemberCount = 0;
    let totalSentimentScore = 0;
    const sentimentBreakdown = { HAPPY: 0, NEUTRAL: 0, SAD: 0 };
    
    teams.forEach(team => {
      console.log(`Team: ${team.name}, Members: ${team.members?.length || 0}`);
      
      if (team.members && Array.isArray(team.members)) {
        team.members.forEach(member => {
          calculatedMemberCount++;
          
          // Ensure sentiment exists and is valid
          const sentiment = member.sentiment || 'NEUTRAL';
          if (sentiment in sentimentBreakdown) {
            sentimentBreakdown[sentiment as keyof typeof sentimentBreakdown]++;
          }
          
          // Calculate sentiment score
          switch (sentiment) {
            case 'HAPPY': 
              totalSentimentScore += 3; 
              break;
            case 'NEUTRAL': 
              totalSentimentScore += 2; 
              break;
            case 'SAD': 
              totalSentimentScore += 1; 
              break;
            default: 
              totalSentimentScore += 2;
              break;
          }
        });
      }
    });

    // Debug: Log the discrepancy if any
    if (totalMembers !== calculatedMemberCount) {
      console.warn(`Member count discrepancy: DB says ${totalMembers}, calculated ${calculatedMemberCount}`);
    }

    // Use the more reliable count (from direct DB query)
    const memberCount = totalMembers;
    
    const overallSentiment = memberCount > 0 
      ? (totalSentimentScore / memberCount).toFixed(1) 
      : '0.0';
      
    const happyPercentage = memberCount > 0 
      ? Math.round((sentimentBreakdown.HAPPY / memberCount) * 100) 
      : 0;

    console.log('Final stats:', {
      totalMembers: memberCount,
      overallSentiment,
      happyPercentage,
      sentimentBreakdown
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <DashboardHeader />
          
          <UnifiedStatsCard 
            teams={teams}
            totalMembers={memberCount}
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

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mt-4 border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="text-sm text-yellow-800">Debug Info</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-yellow-700">
                <p>Teams count: {teams.length}</p>
                <p>DB total members: {teamStats.totalMembers}</p>
                <p>Calculated members: {calculatedMemberCount}</p>
                <p>Sentiment distribution: {JSON.stringify(sentimentBreakdown)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard Error:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <DashboardHeader />
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-red-800">
                <h3 className="font-semibold mb-2">Error loading dashboard</h3>
                <p className="text-sm">Please refresh the page or contact support if the issue persists.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
};

export default DashboardPage;