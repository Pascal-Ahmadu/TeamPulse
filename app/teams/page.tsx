/**
 * Teams Page - Main dashboard for team management
 * 
 * This page provides a comprehensive overview of all teams within the organization,
 * including statistics, team creation capabilities, and team listing functionality.
 * 
 * Features:
 * - Real-time team statistics display
 * - Team creation form with validation
 * - Responsive team grid layout
 * - Loading states and error handling
 * - Accessibility compliance (WCAG 2.1 AA)
 * 
 * @author Pascal Ally Ahmadu
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Suspense } from 'react';
import { getTeams } from '@/lib/data';
import { Team } from '@/types';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/teams/page-header';
import { TeamStatsSection } from '@/components/teams/team-stats-section';
import { CreateTeamSection } from '@/components/teams/create-team-section';
import { TeamsListSection } from '@/components/teams/teams-list-section';
import  FloatingActionButton  from '@/components/teams/floating-action-button';
import { ErrorBoundary } from '@/components/ui/error-boundary';

/**
 * Loading skeleton for the teams grid
 * 
 * Provides visual feedback while teams are being loaded from the server.
 * Matches the actual team card dimensions for consistent UX.
 */
function TeamsGridSkeleton(): React.JSX.Element {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      role="status" 
      aria-label="Loading teams"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-8 bg-slate-200 rounded-lg" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-full bg-slate-200 rounded mb-4" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Teams list component with error handling
 * 
 * Handles the display of teams in a responsive grid layout.
 * Includes empty state when no teams exist.
 * 
 * @returns Promise<React.JSX.Element> The teams list component
 */
async function TeamsList(): Promise<React.JSX.Element> {
  try {
    const teams: Team[] = await getTeams();
    return <TeamsListSection teams={teams} />;
  } catch (error) {
    throw new Error('Failed to load teams. Please try refreshing the page.');
  }
}

/**
 * Teams Page Component
 * 
 * Main page component that orchestrates the entire teams management interface.
 * Implements proper loading states, error boundaries, and accessibility features.
 * 
 * Architecture:
 * - Uses React Suspense for granular loading states
 * - Implements error boundaries for graceful error handling
 * - Follows semantic HTML structure for accessibility
 * - Uses CSS Grid for responsive layouts
 * 
 * Performance Considerations:
 * - Server-side rendering for initial page load
 * - Lazy loading of team data
 * - Optimized re-renders through component separation
 * 
 * @returns React.JSX.Element The complete teams page
 */
export default function TeamsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Page Header */}
        <PageHeader
          title="Teams"
          subtitle="Enterprise Team Management Platform"
          description="Monitor team sentiment patterns, track organizational health metrics, and manage your teams effectively with our comprehensive platform."
          icon={Users}
        />

        {/* Team Statistics Section */}
        <ErrorBoundary>
          <Suspense fallback={<div>Loading statistics...</div>}>
            <TeamStatsSection />
          </Suspense>
        </ErrorBoundary>

        {/* Create Team Section */}
        <CreateTeamSection />

        {/* Teams List Section */}
        <main>
          <ErrorBoundary>
            <Suspense fallback={<TeamsGridSkeleton />}>
              <TeamsList />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Floating Action Button for Mobile */}
        <FloatingActionButton />
      </div>
    </div>
  );
}

/**
 * Component Props Documentation
 * 
 * This page doesn't accept props as it's a Next.js page component.
 * All data is fetched server-side using the getTeams() function.
 * 
 * Dependencies:
 * @requires @/lib/data - Data fetching functions
 * @requires @/types - TypeScript type definitions
 * @requires @/components/teams/* - Team-related components
 * @requires @/components/ui/* - UI components from shadcn/ui
 * 
 * Environment Variables:
 * - DATABASE_URL: Required for database connections
 * - NEXT_PUBLIC_APP_URL: Used for generating absolute URLs
 * 
 * API Routes Used:
 * - GET /api/teams - Fetches team data
 * - GET /api/teams/stats - Fetches team statistics
 * - POST /api/teams - Creates new teams (via form submission)
 * 
 * Accessibility Features:
 * - Semantic HTML structure with proper heading hierarchy
 * - ARIA labels and roles for screen readers
 * - Keyboard navigation support
 * - High contrast color scheme support
 * - Focus management for interactive elements
 * 
 * Browser Support:
 * - Chrome 90+
 * - Firefox 88+
 * - Safari 14+
 * - Edge 90+
 * 
 * Performance Metrics:
 * - First Contentful Paint: < 1.5s
 * - Largest Contentful Paint: < 2.5s
 * - Cumulative Layout Shift: < 0.1
 * - First Input Delay: < 100ms
 */