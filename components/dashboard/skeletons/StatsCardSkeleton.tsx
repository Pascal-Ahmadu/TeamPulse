// components/dashboard/skeletons/StatsCardSkeleton.tsx

import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * Stats Card Skeleton Component
 * @returns {JSX.Element} Loading skeleton for statistics cards
 */
export default function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse border-0 bg-white/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-4 w-4 bg-slate-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-6 w-12 bg-slate-200 rounded mb-1" />
        <div className="h-2 w-20 bg-slate-200 rounded" />
      </CardContent>
    </Card>
  );
}