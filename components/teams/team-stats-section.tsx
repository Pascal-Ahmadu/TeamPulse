/**
 * Team Stats Section Component
 * 
 * Displays key team statistics in an attractive card layout.
 * Handles data fetching and error states gracefully.
 * 
 * @file /components/teams/team-stats-section.tsx
 * @author Pascal Ally Ahmadu
 * @version 1.0.0
 */

import { getTeams } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, TrendingUp, type LucideIcon } from 'lucide-react';
import type { Team } from '@/types';

/**
 * Statistics configuration interface
 */
interface StatConfig {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend: string;
  ariaLabel: string;
}

/**
 * Calculates team statistics from raw team data
 * 
 * @param teams - Array of team objects
 * @returns Processed statistics object
 */
function calculateStats(teams: Team[]): {
  totalTeams: number;
  totalMembers: number;
  healthScore: string;
} {
  const totalTeams = teams.length;
  const totalMembers = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);
  
  // Calculate health score based on team activity and member engagement
  // This is a simplified calculation - in production, this would be more sophisticated
  const healthScore = totalTeams > 0 ? Math.min(100, Math.round((totalMembers / totalTeams) * 10 + 70)) : 0;
  
  return {
    totalTeams,
    totalMembers,
    healthScore: `${healthScore}%`
  };
}

/**
 * Individual stat card component
 */
function StatCard({ stat }: { stat: StatConfig }) {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-normal text-slate-600 mb-1">
              {stat.title}
            </p>
            <div className="flex items-baseline gap-2">
              <p 
                className="text-2xl font-light text-slate-900"
                aria-label={stat.ariaLabel}
              >
                {stat.value}
              </p>
              <Badge 
                variant="secondary" 
                className="text-xs bg-green-50 text-green-700 border-green-200 group-hover:bg-green-100 transition-colors"
              >
                {stat.trend}
              </Badge>
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
            <stat.icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for stats section
 */
function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-20 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Main Team Stats Section Component
 * 
 * Fetches team data and displays statistics in a responsive grid.
 * Implements proper error handling and loading states.
 * 
 * @returns Promise<React.JSX.Element> The stats section component
 */
export async function TeamStatsSection(): Promise<React.JSX.Element> {
  try {
    const teams: Team[] = await getTeams();
    const stats = calculateStats(teams);
    
    const statsConfig: StatConfig[] = [
      {
        title: "Total Teams",
        value: stats.totalTeams,
        icon: Users,
        color: "from-blue-500 to-blue-600",
        trend: "+12%",
        ariaLabel: `${stats.totalTeams} total teams`
      },
      {
        title: "Active Members",
        value: stats.totalMembers,
        icon: Activity,
        color: "from-green-500 to-green-600",
        trend: "+8%",
        ariaLabel: `${stats.totalMembers} active members`
      },
      {
        title: "Health Score",
        value: stats.healthScore,
        icon: TrendingUp,
        color: "from-emerald-500 to-emerald-600",
        trend: "+3%",
        ariaLabel: `${stats.healthScore} health score`
      }
    ];

    return (
      <section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        aria-label="Team statistics"
      >
        {statsConfig.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </section>
    );
  } catch (error) {
    throw new Error('Failed to load team statistics');
  }
}

/**
 * Export the loading skeleton for use in Suspense boundaries
 */
export { StatsLoadingSkeleton };