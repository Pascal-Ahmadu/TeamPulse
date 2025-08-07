import { Suspense } from 'react';
import { getTeams } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Smile, 
  Meh, 
  Frown,
  Plus,
  BarChart3,
  Activity,
  Clock,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import AddTeamForm from '@/components/teams/add-team-form';
import TeamCard from '@/components/teams/team-card';

// Loading skeleton components
function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse border border-slate-200/50 bg-white/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="h-3 w-16 bg-slate-200 rounded"></div>
        <div className="h-4 w-4 bg-slate-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-6 w-12 bg-slate-200 rounded mb-1"></div>
        <div className="h-2 w-20 bg-slate-200 rounded"></div>
      </CardContent>
    </Card>
  );
}

function TeamCardSkeleton() {
  return (
    <Card className="animate-pulse border border-slate-200/50 bg-white/50">
      <CardHeader className="pb-4">
        <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
        <div className="h-3 w-36 bg-slate-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-3 w-full bg-slate-200 rounded"></div>
          <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={`group relative border border-slate-200/50 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300/70 hover:bg-white/90 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-light tracking-wide text-slate-500 uppercase">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-light text-slate-900 mb-1 tracking-tight">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-light text-slate-500">{description}</p>
          {trend && (
            <div className={`flex items-center text-xs font-light ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              <ArrowUpRight className={`h-3 w-3 mr-1 ${!trend.isPositive ? 'rotate-90' : ''}`} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Team Card Component
interface EnhancedTeamCardProps {
  team: {
    id: string;
    name: string;
    description?: string;
    members: Array<{ sentiment: 'HAPPY' | 'NEUTRAL' | 'SAD' }>;
    createdAt?: string;
  };
}

function EnhancedTeamCard({ team }: EnhancedTeamCardProps) {
  const memberCount = team.members.length;
  const sentimentCounts = {
    HAPPY: team.members.filter(m => m.sentiment === 'HAPPY').length,
    NEUTRAL: team.members.filter(m => m.sentiment === 'NEUTRAL').length,
    SAD: team.members.filter(m => m.sentiment === 'SAD').length,
  };

  const sentimentScore = memberCount > 0 
    ? ((sentimentCounts.HAPPY * 3 + sentimentCounts.NEUTRAL * 2 + sentimentCounts.SAD * 1) / memberCount)
    : 0;

  const getSentimentIndicator = (score: number) => {
    if (score >= 2.5) return { 
      color: 'bg-emerald-500', 
      text: 'Strong', 
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    };
    if (score >= 2) return { 
      color: 'bg-amber-500', 
      text: 'Moderate', 
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50'
    };
    return { 
      color: 'bg-red-500', 
      text: 'At Risk', 
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    };
  };

  const indicator = getSentimentIndicator(sentimentScore);

  return (
    <Card className="group relative border border-slate-200/50 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300/70 hover:bg-white/90">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
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
          <div className={`px-2 py-1 rounded-full ${indicator.bgColor} flex items-center space-x-1`}>
            <div className={`w-1.5 h-1.5 rounded-full ${indicator.color}`}></div>
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
            <span className="text-xs font-light text-slate-500 uppercase tracking-wide">Sentiment Score</span>
            <span className="text-sm font-light text-slate-700">{sentimentScore.toFixed(1)}</span>
          </div>
          <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 ${indicator.color} rounded-full transition-all duration-700`}
              style={{ width: `${(sentimentScore / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Member Count and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-3 w-3 text-slate-400" />
            <span className="text-xs font-light text-slate-500">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs font-light text-slate-500 hover:text-slate-700 hover:bg-slate-50 group/btn"
          >
            View
            <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>

        {/* Sentiment Breakdown */}
        {memberCount > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Smile className="h-3 w-3 text-emerald-500" />
              </div>
              <div className="text-xs font-light text-slate-600">{sentimentCounts.HAPPY}</div>
              <div className="text-xs font-light text-slate-400">positive</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Meh className="h-3 w-3 text-amber-500" />
              </div>
              <div className="text-xs font-light text-slate-600">{sentimentCounts.NEUTRAL}</div>
              <div className="text-xs font-light text-slate-400">neutral</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Frown className="h-3 w-3 text-red-500" />
              </div>
              <div className="text-xs font-light text-slate-600">{sentimentCounts.SAD}</div>
              <div className="text-xs font-light text-slate-400">needs support</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export default async function DashboardPage() {
  const teams = await getTeams();
  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
  
  // Calculate comprehensive stats
  let totalSentimentScore = 0;
  let memberCount = 0;
  const sentimentBreakdown = { HAPPY: 0, NEUTRAL: 0, SAD: 0 };
  
  for (const team of teams) {
    for (const member of team.members) {
      memberCount++;
      sentimentBreakdown[member.sentiment]++;
      switch (member.sentiment) {
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
    }
  }
  
  const overallSentiment = memberCount > 0 ? (totalSentimentScore / memberCount).toFixed(1) : '0.0';
  const happyPercentage = memberCount > 0 ? Math.round((sentimentBreakdown.HAPPY / memberCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extralight text-slate-900 tracking-tight mb-2">
                Team Analytics
              </h1>
              <p className="text-sm font-light text-slate-500 max-w-2xl leading-relaxed">
                Monitor team sentiment patterns and organizational health metrics across all departments
              </p>
            </div>
            
            <div className="flex items-center space-x-3 text-xs font-light text-slate-400">
              <Clock className="h-3 w-3" />
              <span>Updated {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Suspense fallback={<StatsCardSkeleton />}>
            <StatsCard
              title="Teams"
              value={teams.length}
              description="Active teams"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
          </Suspense>
          
          <Suspense fallback={<StatsCardSkeleton />}>
            <StatsCard
              title="Members"
              value={totalMembers}
              description="Total participants"
              icon={TrendingUp}
              trend={{ value: 8, isPositive: true }}
            />
          </Suspense>
          
          <Suspense fallback={<StatsCardSkeleton />}>
            <StatsCard
              title="Sentiment"
              value={`${overallSentiment}/3.0`}
              description="Average score"
              icon={Heart}
              trend={{ value: 5, isPositive: true }}
            />
          </Suspense>
          
          <Suspense fallback={<StatsCardSkeleton />}>
            <StatsCard
              title="Positive"
              value={`${happyPercentage}%`}
              description="Happy members"
              icon={Smile}
              trend={{ value: 3, isPositive: true }}
            />
          </Suspense>
        </div>

        {/* Sentiment Overview */}
        {memberCount > 0 && (
          <div className="mb-10">
            <Card className="border border-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-base font-light text-slate-900 tracking-tight flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-slate-400" />
                  <span>Sentiment Distribution</span>
                </CardTitle>
                <CardDescription className="text-xs font-light text-slate-500">
                  Current emotional climate across all teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-light text-slate-500 uppercase tracking-wide">Positive</span>
                      <span className="text-sm font-light text-slate-700">{sentimentBreakdown.HAPPY}</span>
                    </div>
                    <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(sentimentBreakdown.HAPPY / memberCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-light text-slate-500 uppercase tracking-wide">Neutral</span>
                      <span className="text-sm font-light text-slate-700">{sentimentBreakdown.NEUTRAL}</span>
                    </div>
                    <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${(sentimentBreakdown.NEUTRAL / memberCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-light text-slate-500 uppercase tracking-wide">At Risk</span>
                      <span className="text-sm font-light text-slate-700">{sentimentBreakdown.SAD}</span>
                    </div>
                    <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-red-500 rounded-full transition-all duration-700"
                        style={{ width: `${(sentimentBreakdown.SAD / memberCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Team Section */}
        <div className="mb-10">
          <Card className="border border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100/80 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-light text-slate-900 tracking-tight flex items-center space-x-3">
                    <Plus className="h-4 w-4 text-slate-400" />
                    <span>Add Team</span>
                  </CardTitle>
                  <CardDescription className="text-xs font-light text-slate-500 mt-1">
                    Create a new team to start tracking sentiment metrics
                  </CardDescription>
                </div>
                <Activity className="h-6 w-6 text-slate-300" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Suspense fallback={<div className="h-16 bg-slate-50 rounded animate-pulse"></div>}>
                <AddTeamForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Teams Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-light text-slate-900 tracking-tight mb-1">Teams</h2>
              <p className="text-xs font-light text-slate-500">
                {teams.length} {teams.length === 1 ? 'team' : 'teams'} currently monitored
              </p>
            </div>
            {teams.length > 0 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 font-light text-xs px-3 py-1">
                {teams.length}
              </Badge>
            )}
          </div>
          
          {teams.length === 0 ? (
            <Card className="border border-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-light text-slate-900 mb-2 tracking-tight">No teams configured</h3>
                <p className="text-xs font-light text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                  Begin monitoring team sentiment by creating your first team above
                </p>
                <Button 
                  variant="outline" 
                  className="border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-light"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Suspense 
                fallback={
                  <>
                    <TeamCardSkeleton />
                    <TeamCardSkeleton />
                    <TeamCardSkeleton />
                  </>
                }
              >
                {teams.map((team) => (
                  <EnhancedTeamCard key={team.id} team={team} />
                ))}
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}