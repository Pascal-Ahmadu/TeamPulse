/**
 * Teams List Section Component
 * 
 * Renders teams using the TeamsTable component or an empty state when no teams exist.
 * 
 * @file /components/teams/teams-list-section.tsx
 * @author TeamPulse Development Team
 * @version 1.0.0
 */

import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { TeamsTable } from '@/components/teams/team-card'; // Correct import
import CreateTeamButton from '@/components/teams/create-team-button';
import type { Team } from '@/types';

/**
 * Props for the TeamsListSection component
 */
interface TeamsListSectionProps {
  teams: Team[];
}

/**
 * Empty state component shown when no teams exist
 */
function EmptyTeamsState() {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardContent className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-light text-slate-900 mb-2">
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

/**
 * Main Teams List Section Component
 * 
 * Uses TeamsTable component to display all teams in table format
 * 
 * @param props - Component props
 * @param props.teams - Array of teams to display
 * @returns React.JSX.Element The teams list section
 */
export async function TeamsListSection({ teams }: TeamsListSectionProps): Promise<React.JSX.Element> {
  // Handle empty state
  if (teams.length === 0) {
    return (
      <section aria-label="No teams found">
        <EmptyTeamsState />
      </section>
    );
  }

  // Render teams table - pass ALL teams to TeamsTable
  return (
    <section aria-label="Teams overview">
      <TeamsTable teams={teams} />
    </section>
  );
}