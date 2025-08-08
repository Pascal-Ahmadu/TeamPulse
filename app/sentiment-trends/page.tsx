/**
 * @fileoverview Sentiment Trends Analytics Page - Enterprise Analytics Dashboard
 * @description Comprehensive dashboard for tracking organizational sentiment patterns
 * over time with real-time insights and professional data visualization.
 * @version 3.0.0
 * @author Pascal Ally Ahmadu
 * @created 2025-01-01
 * @updated 2025-08-08
 */

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSentimentTrends } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Users, 
  Target, 
  ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import our refactored components and utilities
import { SentimentDataPoint, TeamSentimentData, SentimentStats } from '@/lib/types';
import { calculateSentimentStats } from '@/lib/sentiment-utils';
import { SENTIMENT_CONFIG } from '@/lib/chart-utils';
import { SentimentCard } from '@/components/ui/sentiment-card';
import { SentimentLegend } from '@/components/ui/sentiment-legend';
import SentimentTrendsChart from '@/components/charts/sentiment-trends-chart';
import { 
  StatsCardSkeleton, 
  SentimentTrendsPageSkeleton, 
  ErrorFallback 
} from '@/components/ui/loading-components';

// ===============================
// METADATA
// ===============================

/**
 * Page metadata for SEO and accessibility
 */
export const metadata: Metadata = {
  title: 'Sentiment Trends Analytics | TeamPulse',
  description: 'Track team sentiment patterns and organizational health metrics with comprehensive analytics dashboard',
  keywords: ['sentiment analysis', 'team analytics', 'organizational health', 'employee engagement'],
  openGraph: {
    title: 'Sentiment Trends Analytics | TeamPulse',
    description: 'Real-time sentiment tracking and analytics dashboard',
    type: 'website',
  },
};

// ===============================
// UI COMPONENTS
// ===============================




/**
 * Enhanced Chart Section Component matching your design patterns
 */
function ChartSection({ trendData }: { trendData: SentimentDataPoint[] }) {
  return (
    <section 
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-label="Sentiment trends visualization"
    >
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg sm:h-10 sm:w-10">
              <TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-light text-slate-900 sm:text-xl">
                7-Day Sentiment Trend Analysis
              </CardTitle>
              <CardDescription className="text-xs font-light text-slate-600 sm:text-sm">
                Track sentiment patterns and emotional health metrics across your organization
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="flex items-center border-slate-200 bg-slate-50 text-xs font-light text-slate-700"
              role="status"
              aria-label="Live data indicator"
            >
              <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Live Data
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <SentimentLegend />

        {/* Chart Container with enhanced accessibility */}
        <div 
          className="relative" 
          role="img" 
          aria-label="Sentiment trends chart showing 7-day sentiment patterns"
        >
          <Suspense 
            fallback={
              <div className="flex h-80 items-center justify-center rounded-lg border bg-slate-50">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                  <div className="mx-auto mb-2 h-6 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="mx-auto h-4 w-48 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            }
          >
            <SentimentTrendsChart data={trendData} />
          </Suspense>
        </div>

        {/* Enhanced Chart Footer */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" aria-hidden="true" />
              <span className="font-light">Real-time sentiment tracking</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-light">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <Badge variant="secondary" className="flex items-center border-indigo-200 bg-indigo-50 font-light text-indigo-700">
                <Target className="mr-1 h-3 w-3" />
                Analytics
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </section>
  );
}

/**
 * Page header matching your team page design
 */
function PageHeader({ stats }: { stats: SentimentStats }) {
  return (
    <header className="mb-8 sm:mb-12">
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
      
      
    </header>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================

/**
 * Main Sentiment Trends Page Component - Server Component
 * 
 * Displays comprehensive sentiment analytics with enhanced error handling
 * and performance optimizations, following your established design patterns.
 */
export default async function SentimentTrendsPage() {
  let trendData: SentimentDataPoint[] = [];
  let teamData: TeamSentimentData[] = [];
  let error: Error | null = null;

  // Fetch data with comprehensive error handling
  try {
    trendData = await getSentimentTrends();
    // Note: Add team data fetching when available
    // teamData = await getTeamSentimentData();
  } catch (err) {
    error = err instanceof Error ? err : new Error('Failed to fetch sentiment data');
    console.error('Error fetching sentiment trends:', err);
  }

  // Show loading state during development
  if (!error && trendData.length === 0) {
    return <SentimentTrendsPageSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorFallback error={error} />;
  }

  // Calculate comprehensive statistics
  const stats = calculateSentimentStats(trendData, teamData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Enhanced Page Header matching your team page */}
        <PageHeader stats={stats} />

        {/* Enhanced Statistics Cards */}
        <Suspense 
          fallback={
            <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)}
            </div>
          }
        >
          
        </Suspense>

        {/* Chart Section */}
        <ChartSection trendData={trendData} />

        {/* Footer matching your team page */}
        <footer className="mt-6 sm:mt-8">
          <p className="text-center text-xs font-light text-slate-500">
            © {new Date().getFullYear()} TeamPulse. Built for enterprise team analytics.
          </p>
        </footer>
      </div>
    </div>
  );
}