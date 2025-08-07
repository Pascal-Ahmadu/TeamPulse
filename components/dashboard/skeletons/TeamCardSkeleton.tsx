// components/dashboard/skeletons/TeamCardSkeleton.tsx

import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * Team Card Skeleton Component
 * @returns {JSX.Element} Loading skeleton for team cards
 */
export default function TeamCardSkeleton() {
  return (
    <Card className="animate-pulse border-0 bg-white/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-36 bg-slate-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-3 w-full bg-slate-200 rounded" />
          <div className="h-3 w-2/3 bg-slate-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}