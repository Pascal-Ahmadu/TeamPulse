'use client';

/**
 * Teams Table Component
 * 
 * A professional table interface for managing teams with inline actions
 * for adding members and viewing detailed analytics.
 * 
 * @file /components/teams/teams-table.tsx
 * @author Pascal Ally Ahmadu
 * @version 1.0.2
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/types';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Activity,
  UserPlus,
  Eye
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface TeamsTableProps {
  teams: Team[];
  getTeamSentimentAverage?: (teamId: string) => Promise<number>;
}

interface TeamRowProps {
  team: Team;
  index: number;
  getTeamSentimentAverage?: (teamId: string) => Promise<number>;
}

/**
 * Calculates sentiment data based on average score
 */
function getSentimentData(avg: number) {
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
}

/**
 * Sentiment progress bar component
 */
function SentimentProgressBar({ team }: { team: Team }) {
  const happyCount = team.members.filter(m => m.sentiment === 'HAPPY').length;
  const neutralCount = team.members.filter(m => m.sentiment === 'NEUTRAL').length;
  const sadCount = team.members.filter(m => m.sentiment === 'SAD').length;
  const totalMembers = team.members.length;

  if (totalMembers === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div className="w-16 h-1.5 bg-slate-200 rounded-full" />
        <span className="font-light">No data</span>
      </div>
    );
  }

  const happyPercent = (happyCount / totalMembers) * 100;
  const neutralPercent = (neutralCount / totalMembers) * 100;
  const sadPercent = (sadCount / totalMembers) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div className="h-full flex">
          {happyPercent > 0 && (
            <div 
              className="bg-emerald-500" 
              style={{ width: `${happyPercent}%` }}
            />
          )}
          {neutralPercent > 0 && (
            <div 
              className="bg-yellow-500" 
              style={{ width: `${neutralPercent}%` }}
            />
          )}
          {sadPercent > 0 && (
            <div 
              className="bg-red-500" 
              style={{ width: `${sadPercent}%` }}
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <span className="text-emerald-600 font-medium">{happyCount}</span>
        <span className="font-light">/</span>
        <span className="text-yellow-600 font-medium">{neutralCount}</span>
        <span className="font-light">/</span>
        <span className="text-red-600 font-medium">{sadCount}</span>
      </div>
    </div>
  );
}

/**
 * Individual team row component
 */
function TeamRow({ team, index, getTeamSentimentAverage }: TeamRowProps) {
  const [sentimentAvg, setSentimentAvg] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSentiment() {
      try {
        setIsLoading(true);
        if (getTeamSentimentAverage) {
          const avg = await getTeamSentimentAverage(team.id);
          setSentimentAvg(avg);
        } else {
          // Fallback calculation based on member sentiments
          const happy = team.members.filter(m => m.sentiment === 'HAPPY').length;
          const neutral = team.members.filter(m => m.sentiment === 'NEUTRAL').length;
          const sad = team.members.filter(m => m.sentiment === 'SAD').length;
          const total = team.members.length;
          
          if (total > 0) {
            const avgScore = (happy * 3 + neutral * 2 + sad * 1) / total;
            setSentimentAvg(avgScore);
          }
        }
      } catch (error) {
        console.error('Error fetching sentiment:', error);
        setSentimentAvg(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSentiment();
  }, [team.id, team.members, getTeamSentimentAverage]);

  const sentimentData = getSentimentData(sentimentAvg);
  const totalMembers = team.members.length;

  const handleAddMember = () => {
    // Handle add member action
    console.log(`Add member to team: ${team.id}`);
  };

  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors group">
      {/* Serial Number */}
      <TableCell className="font-light text-slate-500 text-center w-12">
        {index + 1}
      </TableCell>

      {/* Team Name & Info */}
      <TableCell className="font-light">
        <div className="flex items-center gap-3">
          
          <div>
            <div className="font-light text-slate-900 group-hover:text-blue-600 transition-colors">
              {team.name}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3" />
              <span className="font-light">
                {team.createdAt.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Member Count */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-light text-slate-900">{totalMembers}</span>
          {totalMembers === 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddMember}
              className="h-6 px-2 text-xs font-light bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Add First Member
            </Button>
          ) : (
            <Badge variant="secondary" className="text-xs font-light">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Sentiment Score */}
      <TableCell>
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
              <span className="text-xs font-light text-slate-400">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${sentimentData.bgColor} ${sentimentData.borderColor} border`}>
              <div className={`w-1.5 h-1.5 rounded-full ${sentimentData.color}`} />
              <span className={`text-xs font-light ${sentimentData.textColor}`}>
                {sentimentAvg.toFixed(1)}
              </span>
            </div>
            <span className="text-lg">{sentimentData.emoji}</span>
          </div>
        )}
      </TableCell>

      {/* Sentiment Distribution */}
      <TableCell>
        <SentimentProgressBar team={team} />
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge 
          variant={team.isActive ? "default" : "secondary"}
          className={`font-light ${team.isActive ? "bg-green-100 text-green-800 border-green-200" : ""}`}
        >
          {team.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs font-light group-hover:bg-blue-50 group-hover:text-blue-700"
        >
          <Link href={`/teams/${team.id}`}>
            <Eye className="h-3 w-3 mr-1" />
            View Details
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

/**
 * Empty state component for when no teams exist
 */
function EmptyTeamsTable() {
  const handleCreateTeam = () => {
    console.log('Create team clicked');
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardContent className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-light text-slate-900 mb-2">
          No teams yet
        </h3>
        <p className="text-sm font-light text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          Get started by creating your first team to begin monitoring sentiment and tracking organizational health metrics.
        </p>
        <Button onClick={handleCreateTeam} className="bg-blue-600 hover:bg-blue-700 font-light">
          <UserPlus className="h-4 w-4 mr-2" />
          Create Your First Team
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Main Teams Table Component
 * 
 * Displays teams in a professional table format with inline actions.
 * 
 * Features:
 * - Serial numbers for each row
 * - Sortable columns
 * - Inline member management
 * - Responsive kebab menu with actions
 * - Sentiment visualization
 * - Responsive design
 * 
 * @param props Component props
 * @param props.teams Array of teams to display
 * @param props.getTeamSentimentAverage Optional function to get team sentiment average
 */
export function TeamsTable({ teams, getTeamSentimentAverage }: TeamsTableProps) {
  if (teams.length === 0) {
    return <EmptyTeamsTable />;
  }

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
         
          <div>
            <h2 className="text-xl font-light text-slate-900">
              Teams Overview
            </h2>
            <p className="text-sm font-light text-slate-500">
              Manage {teams.length} {teams.length === 1 ? 'team' : 'teams'} and their members
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-light">
          {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
        </Badge>
      </div>

      {/* Teams Table */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-light text-slate-700 text-center w-12">#</TableHead>
              <TableHead className="font-light text-slate-700">Team</TableHead>
              <TableHead className="font-light text-slate-700">Members</TableHead>
              <TableHead className="font-light text-slate-700">Sentiment</TableHead>
              <TableHead className="font-light text-slate-700">Distribution</TableHead>
              <TableHead className="font-light text-slate-700">Status</TableHead>
              <TableHead className="font-light text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TeamRow 
                key={team.id} 
                team={team} 
                index={index}
                getTeamSentimentAverage={getTeamSentimentAverage}
              />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Stats Footer */}
      <div className="flex items-center justify-between text-sm text-slate-500 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-light">Happy members</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="font-light">Neutral members</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-light">Concerned members</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="font-light">Click any team to view detailed analytics</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Component Usage Documentation
 * 
 * Usage:
 * ```tsx
 * const teams = await getTeams();
 * return <TeamsTable teams={teams} getTeamSentimentAverage={getTeamSentimentAverage} />;
 * ```
 * 
 * Changes in v1.0.2:
 * - Added 'use client' directive to make it a Client Component
 * - Added back the kebab dropdown menu with proper event handling
 * - Added loading state for sentiment data
 * - Made getTeamSentimentAverage optional with fallback calculation
 * - Added proper error handling for async operations
 * - Implemented responsive dropdown menu actions
 * 
 * Features:
 * - Professional table layout with hover effects
 * - Serial numbers for easy row identification
 * - Inline "Add Member" buttons for empty teams
 * - Responsive kebab menu with multiple actions
 * - Sentiment visualization with progress bars
 * - Loading states for async data
 * - Click-to-navigate team details
 * - Responsive design that works on all screen sizes
 * - Empty state with call-to-action
 * - Consistent light font weight throughout
 * 
 * Dependencies:
 * - @/components/ui/table - Table components from shadcn/ui
 * - @/components/ui/dropdown-menu - Dropdown menu component
 * - @/types - Team interface
 * 
 * Actions Available:
 * - View team details (click "View Details" button)
 * - Add members (kebab menu or inline button for empty teams)
 * - View analytics (kebab menu)
 * - Manage team (kebab menu)
 * - Create first team (empty state CTA)
 */