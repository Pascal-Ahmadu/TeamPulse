/**
 * @fileoverview Loading and Error Components
 * @author Pascal Ally Ahmadu
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for stats cards
 */
export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl sm:h-12 sm:w-12" />
      </div>
    </div>
  );
}

/**
 * Page loading skeleton matching your design system
 */
export function SentimentTrendsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <Skeleton className="mb-4 h-10 w-32" />
          <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-6">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced error fallback component
 */
export function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-light">
            <strong className="font-medium">Unable to load sentiment data:</strong> {error.message}
            <div className="mt-2 text-sm text-muted-foreground">
              Please try refreshing the page or contact support if the issue persists.
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}