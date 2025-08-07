import { Suspense } from 'react';
import { getTeams } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, TrendingUp, Activity } from 'lucide-react';
import AddTeamForm from '@/components/teams/add-team-form';
import TeamCard from '@/components/teams/team-card';
import CreateTeamButton from '@/components/teams/create-team-button';
import FloatingActionButton from '@/components/teams/floating-action-button';

// Loading skeleton component for better UX
function TeamsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Stats cards component
async function TeamStats() {
  const teams = await getTeams();
  
  const stats = [
    {
      title: "Total Teams",
      value: teams.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      trend: "+12%"
    },
    {
      title: "Active Members",
      value: teams.reduce((acc, team) => acc + (team.memberCount || 0), 0),
      icon: Activity,
      color: "from-green-500 to-green-600",
      trend: "+8%"
    },
    {
      title: "Health Score",
      value: "94%",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      trend: "+3%"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {stat.trend}
                  </Badge>
                </div>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Teams list component with better loading states
async function TeamsList() {
  const teams = await getTeams();

  if (teams.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No teams yet
          </h3>
          <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
            Get started by creating your first team to begin monitoring sentiment and tracking organizational health metrics.
          </p>
          <CreateTeamButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              All Teams
            </h2>
            <p className="text-sm text-slate-500">
              Manage {teams.length} {teams.length === 1 ? 'team' : 'teams'}
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </>
  );
}

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Container with better responsive width management */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header Section - Improved typography and spacing */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Teams
              </h1>
              <p className="text-slate-600 mt-1">
                Enterprise Team Management Platform
              </p>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Monitor team sentiment patterns, track organizational health metrics, and manage your teams effectively with our comprehensive platform.
          </p>
        </div>

        {/* Stats Section */}
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <TeamStats />
        </Suspense>

        {/* Add Team Section - Better form layout */}
        <div className="mb-12">
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Create New Team
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      Add a new team to start tracking member sentiment and organizational metrics
                    </CardDescription>
                  </div>
                </div>
                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <AddTeamForm />
            </CardContent>
          </Card>
        </div>

        {/* Teams List Section - Better responsive grid */}
        <div>
          <Suspense fallback={<TeamsGridSkeleton />}>
            <TeamsList />
          </Suspense>
        </div>

        {/* Floating Action Button for mobile - Client Component */}
        <FloatingActionButton />
      </div>
    </div>
  );
}