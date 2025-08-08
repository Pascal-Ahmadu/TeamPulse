/**
 * @fileoverview Sentiment Card UI Component
 * @author Pascal Ally Ahmadu
 */

import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SentimentCardProps } from '@/lib/types';

/**
 * Individual sentiment statistics card - matching your team page design
 */
export function SentimentCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  color, 
  trend 
}: SentimentCardProps) {
  const trendIcon = trend?.direction === 'up' ? TrendingUp : 
                    trend?.direction === 'down' ? TrendingDown : Activity;
  const trendColor = trend?.direction === 'up' ? 'text-green-600' : 
                     trend?.direction === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs font-light text-slate-600 sm:text-sm">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-light text-slate-900 sm:text-2xl">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <Badge variant="secondary" className={cn(
                "text-xs font-light border px-2 py-0.5",
                color
              )}>
                {subtitle}
              </Badge>
            )}
          </div>
          {trend && trend.value !== 0 && (
            <div className={cn("flex items-center gap-1 text-xs font-light", trendColor)}>
              {React.createElement(trendIcon, { className: "h-3 w-3" })}
              <span>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-12 sm:w-12",
          gradient
        )}>
          <Icon className="h-4 w-4 text-white sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}