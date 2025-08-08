/**
 * @fileoverview Team Page Component - Enterprise Team Analytics Dashboard
 * @description Displays team information, member sentiment analysis, and management tools
 * @version 1.0.0
 * @author Pascal Ally Ahmadu
 * @created 2024-01-15
 * @updated 2025-01-15
 */

import { Suspense } from 'react';
import { getTeamById, getMembers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Calendar, 
  ArrowLeft, 
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import MemberList from '@/components/teams/member-list';
import TeamPageClient from '@/components/teams/team-page-client';

// ===============================
// TYPE DEFINITIONS & INTERFACES
// ===============================

/**
 * Props for the main TeamPage component
 * @interface TeamPageProps
 */
interface TeamPageProps {
  params: {
    teamId: string;
  };
}

/**
 * Sentiment distribution counts for team analytics
 * @interface SentimentCounts
 */
interface SentimentCounts {
  HAPPY: number;
  NEUTRAL: number;
  SAD: number;
}

/**
 * Team member data structure (matches API response)
 * @interface TeamMember
 */
interface TeamMember {
  id: string;
  name: string;
  email: string;
  sentiment: 'HAPPY' | 'NEUTRAL' | 'SAD';
  createdAt?: Date; // Optional to match actual Member type from API
}

/**
 * Team data structure (matches API response)
 * @interface Team
 */
interface Team {
  id: string;
  name: string;
  createdAt: Date;
}

// ===============================
// CONFIGURATION & CONSTANTS
// ===============================

/**
 * Configuration object for sentiment display and styling
 * Centralizes all sentiment-related UI configuration for maintainability
 * @constant SENTIMENT_CONFIG
 */
const SENTIMENT_CONFIG = {
  HAPPY: {
    label: 'Happy',
    emoji: '😊',
    color: 'green',
    gradient: 'from-green-100 to-emerald-100',
    border: 'border-green-100',
    text: 'text-green-600'
  },
  NEUTRAL: {
    label: 'Neutral',
    emoji: '😐',
    color: 'yellow',
    gradient: 'from-yellow-100 to-amber-100',
    border: 'border-yellow-100',
    text: 'text-yellow-600'
  },
  SAD: {
    label: 'Concerned',
    emoji: '😟',
    color: 'red',
    gradient: 'from-red-100 to-rose-100',
    border: 'border-red-100',
    text: 'text-red-600'
  }
} as const;

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Calculates sentiment statistics from team members array
 * @param members - Array of team members with sentiment data
 * @returns Object containing sentiment counts, total members, and happiness percentage
 */
function calculateSentimentStats(members: TeamMember[]) {
  // Count members by sentiment type
  const sentimentCounts: SentimentCounts = {
    HAPPY: members.filter(m => m.sentiment === 'HAPPY').length,
    NEUTRAL: members.filter(m => m.sentiment === 'NEUTRAL').length,
    SAD: members.filter(m => m.sentiment === 'SAD').length
  };

  const totalMembers = members.length;
  // Calculate happiness percentage with safe division
  const happyPercentage = totalMembers > 0 
    ? Math.round((sentimentCounts.HAPPY / totalMembers) * 100) 
    : 0;

  return { sentimentCounts, totalMembers, happyPercentage };
}

// ===============================
// LOADING & SKELETON COMPONENTS
// ===============================

/**
 * Loading skeleton component for improved UX during data fetching
 * Provides visual placeholders that match the final component structure
 * @component TeamPageSkeleton
 */
function TeamPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <Skeleton className="mb-4 h-10 w-32" />
          <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-8" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Members section skeleton */}
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-4 sm:p-6">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================
// UI COMPONENTS
// ===============================

/**
 * Individual sentiment statistics card component
 * @component SentimentCard
 * @param type - Sentiment type (HAPPY, NEUTRAL, SAD)
 * @param count - Number of members with this sentiment
 */
interface SentimentCardProps {
  type: keyof typeof SENTIMENT_CONFIG;
  count: number;
}

function SentimentCard({ type, count }: SentimentCardProps) {
  const config = SENTIMENT_CONFIG[type];
  
  return (
    <div className={cn(
      "rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md",
      config.border,
      "sm:p-6"
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1 sm:space-y-2">
          <p className={cn("text-xs font-light sm:text-sm", config.text)}>
            {config.label} Members
          </p>
          <p className={cn("text-xl font-light sm:text-2xl", config.text.replace('600', '700'))}>
            {count}
          </p>
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br sm:h-12 sm:w-12",
          config.gradient
        )}>
          <span 
            className="text-lg sm:text-2xl" 
            role="img" 
            aria-label={`${config.label} sentiment indicator`}
          >
            {config.emoji}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Team header component with navigation and summary information
 * @component TeamHeader
 * @param team - Team data object
 * @param totalMembers - Total number of team members
 * @param happyPercentage - Percentage of happy team members
 */
interface TeamHeaderProps {
  team: Team;
  totalMembers: number;
  happyPercentage: number;
}

function TeamHeader({ team, totalMembers, happyPercentage }: TeamHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Navigation */}
      <div className="mb-4 flex items-center space-x-2 sm:space-x-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          <Link href="/teams">
            <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to Teams</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
      </div>
      
      {/* Team Information Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-light tracking-tight text-slate-900 sm:text-3xl">
              {team.name}
            </h1>
            <p className="flex items-center text-sm font-light text-slate-600">
              <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <time dateTime={team.createdAt.toISOString()}>
                Created {team.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </p>
          </div>
          
          {/* Summary Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge 
              variant="secondary"
              className="flex items-center bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200 sm:px-4 sm:py-2"
            >
              <Users className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm">
                {totalMembers} member{totalMembers !== 1 ? 's' : ''}
              </span>
            </Badge>
            
            {totalMembers > 0 && (
              <Badge 
                variant="secondary"
                className="flex items-center bg-green-100 px-3 py-1 text-green-700 hover:bg-green-200 sm:px-4 sm:py-2"
              >
                <TrendingUp className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="text-xs sm:text-sm">
                  {happyPercentage}% Happy
                </span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Visual happiness indicator with progress bar
 * @component HappinessIndicator
 * @param percentage - Happiness percentage (0-100)
 * @param totalMembers - Total team members for conditional rendering
 */
interface HappinessIndicatorProps {
  percentage: number;
  totalMembers: number;
}

function HappinessIndicator({ percentage, totalMembers }: HappinessIndicatorProps) {
  // Don't render if no members
  if (totalMembers === 0) return null;

  return (
    <div className="hidden text-right sm:block">
      <p className="text-xs font-light text-slate-600">Team Happiness</p>
      <div className="mt-1 flex items-center">
        <div className="mr-2 h-2 w-16 rounded-full bg-slate-100 sm:w-20">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Team happiness: ${percentage}%`}
          />
        </div>
        <span className="text-xs font-light text-slate-900 sm:text-sm">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================

/**
 * Main Team Page Component - Server Component
 * 
 * Displays comprehensive team analytics including:
 * - Team information and metadata
 * - Member count and sentiment statistics
 * - Visual happiness indicators
 * - Member management interface
 * 
 * @component TeamPage
 * @param params - Route parameters containing teamId
 * @returns JSX.Element - Complete team dashboard
 * 
 * @example
 * // Route: /teams/[teamId]
 * // URL: /teams/team-123
 * <TeamPage params={{ teamId: 'team-123' }} />
 */
export default async function TeamPage({ params }: TeamPageProps) {
  try {
    // Fetch team data with error handling
    const team = await getTeamById(params.teamId);
    if (!team) {
      notFound(); // Triggers Next.js 404 page
    }

    // Fetch team members
    const members = await getMembers(params.teamId);
    
    // Calculate sentiment statistics
    const { sentimentCounts, totalMembers, happyPercentage } = calculateSentimentStats(members);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Team Header Section */}
          <TeamHeader 
            team={team}
            totalMembers={totalMembers}
            happyPercentage={happyPercentage}
          />

          {/* Sentiment Statistics Grid */}
          <section 
            className="mb-6 sm:mb-8"
            aria-label="Team sentiment statistics"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {/* Total Members Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs font-light text-slate-600 sm:text-sm">
                      Total Members
                    </p>
                    <p className="text-xl font-light text-slate-900 sm:text-2xl">
                      {totalMembers}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-blue-100 sm:h-12 sm:w-12">
                    <Users className="h-4 w-4 text-slate-600 sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Sentiment Cards */}
              {(Object.keys(SENTIMENT_CONFIG) as Array<keyof typeof SENTIMENT_CONFIG>).map(sentiment => (
                <SentimentCard
                  key={sentiment}
                  type={sentiment}
                  count={sentimentCounts[sentiment]}
                />
              ))}
            </div>
          </section>

          {/* Members Management Section */}
          <section 
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
            aria-label="Team members management"
          >
            {/* Section Header */}
            <div className="border-b border-slate-100 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 sm:mr-4 sm:h-10 sm:w-10">
                    <Users className="h-4 w-4 text-white sm:h-5 sm:w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-light text-slate-900 sm:text-xl">
                      Team Members
                    </h2>
                    <p className="text-xs font-light text-slate-600 sm:text-sm">
                      Manage members and monitor sentiment
                    </p>
                  </div>
                </div>
                
                {/* Action Controls */}
                <div className="flex items-center gap-4">
                  <HappinessIndicator 
                    percentage={happyPercentage}
                    totalMembers={totalMembers}
                  />
                  <Suspense fallback={<Skeleton className="h-9 w-24" />}>
                    <TeamPageClient 
                      teamId={params.teamId} 
                      teamName={team.name} 
                    />
                  </Suspense>
                </div>
              </div>
            </div>
            
            {/* Members List */}
            <div className="p-4 sm:p-6">
              <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                <MemberList 
                  teamId={params.teamId} 
                  initialMembers={members} 
                />
              </Suspense>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-6 sm:mt-8">
            <p className="text-center text-xs font-light text-slate-500">
              © {new Date().getFullYear()} TeamPulse. Built for enterprise team analytics.
            </p>
          </footer>
        </div>
      </div>
    );
  } catch (error) {
    // Log error for monitoring while letting Next.js error boundary handle UI
    console.error('Error loading team page:', error);
    throw error;
  }
}

// ===============================
// METADATA GENERATION
// ===============================

/**
 * Generates dynamic metadata for SEO optimization and social sharing
 * 
 * @param params - Route parameters containing teamId
 * @returns Promise<Metadata> - Next.js metadata object for head elements
 * 
 * @example
 * // Generates:
 * // <title>Team Alpha | TeamPulse</title>
 * // <meta name="description" content="View team analytics..." />
 * // <meta property="og:title" content="Team Alpha | TeamPulse" />
 */
export async function generateMetadata({ params }: TeamPageProps) {
  try {
    const team = await getTeamById(params.teamId);
    
    if (!team) {
      return {
        title: 'Team Not Found | TeamPulse',
        description: 'The requested team could not be found.',
      };
    }

    return {
      title: `${team.name} | TeamPulse`,
      description: `View team analytics and member sentiment for ${team.name}. Monitor team happiness and manage members effectively.`,
      openGraph: {
        title: `${team.name} | TeamPulse`,
        description: `Team analytics dashboard for ${team.name}`,
        type: 'website',
      },
    };
  } catch {
    // Fallback metadata if team fetch fails
    return {
      title: 'Team | TeamPulse',
      description: 'Team analytics dashboard',
    };
  }
}