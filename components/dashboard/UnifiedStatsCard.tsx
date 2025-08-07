// components/dashboard/UnifiedStatsCard.tsx

import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Heart, Smile, ArrowUpRight } from 'lucide-react';
import StatsCardSkeleton from '@/components/dashboard/skeletons/StatsCardSkeleton';

interface UnifiedStatsCardProps {
  teams: any[];
  totalMembers: number;
  overallSentiment: string;
  happyPercentage: number;
}

/**
 * Unified Stats Card Component
 * @param {UnifiedStatsCardProps} props - Component properties
 * @returns {JSX.Element} Combined statistics card
 */
export default function UnifiedStatsCard({ 
  teams, 
  totalMembers, 
  overallSentiment, 
  happyPercentage 
}: UnifiedStatsCardProps) {
  return (
    <div className="mb-8 sm:mb-10">
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <Suspense fallback={<StatsCardSkeleton />}>
              <div className="group text-center lg:text-left pt-4 sm:pt-6 lg:pt-0 pb-4 sm:pb-6 lg:pb-0 lg:pr-6 xl:pr-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-xs font-light tracking-wide text-slate-600 uppercase">
                    Teams
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-light text-slate-900 mb-1 tracking-tight">
                  {teams.length}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start space-y-1 sm:space-y-0 sm:space-x-3">
                  <p className="text-xs font-light text-slate-500">
                    Active teams
                  </p>
                  <div className="flex items-center text-xs font-light text-blue-600 justify-center">
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    12%
                  </div>
                </div>
              </div>
            </Suspense>
            
            <Suspense fallback={<StatsCardSkeleton />}>
              <div className="group text-center lg:text-left pt-4 sm:pt-6 lg:pt-0 pb-4 sm:pb-6 lg:pb-0 lg:px-6 xl:px-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-xs font-light tracking-wide text-slate-600 uppercase">
                    Members
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-light text-slate-900 mb-1 tracking-tight">
                  {totalMembers}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start space-y-1 sm:space-y-0 sm:space-x-3">
                  <p className="text-xs font-light text-slate-500">
                    Total participants
                  </p>
                  <div className="flex items-center text-xs font-light text-blue-600 justify-center">
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    8%
                  </div>
                </div>
              </div>
            </Suspense>
            
            <Suspense fallback={<StatsCardSkeleton />}>
              <div className="group text-center lg:text-left pt-4 sm:pt-6 lg:pt-0 pb-4 sm:pb-6 lg:pb-0 lg:px-6 xl:px-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-xs font-light tracking-wide text-slate-600 uppercase">
                    Sentiment
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-light text-slate-900 mb-1 tracking-tight">
                  {overallSentiment}/3.0
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start space-y-1 sm:space-y-0 sm:space-x-3">
                  <p className="text-xs font-light text-slate-500">
                    Average score
                  </p>
                  <div className="flex items-center text-xs font-light text-blue-600 justify-center">
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    5%
                  </div>
                </div>
              </div>
            </Suspense>
            
            <Suspense fallback={<StatsCardSkeleton />}>
              <div className="group text-center lg:text-left pt-4 sm:pt-6 lg:pt-0 pb-4 sm:pb-6 lg:pb-0 lg:pl-6 xl:pl-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Smile className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-xs font-light tracking-wide text-slate-600 uppercase">
                    Positive
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-light text-slate-900 mb-1 tracking-tight">
                  {happyPercentage}%
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start space-y-1 sm:space-y-0 sm:space-x-3">
                  <p className="text-xs font-light text-slate-500">
                    Happy members
                  </p>
                  <div className="flex items-center text-xs font-light text-blue-600 justify-center">
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    3%
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}