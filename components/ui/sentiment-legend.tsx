/**
 * @fileoverview Sentiment Scale Legend Component
 * @author Pascal Ally Ahmadu
 */

import { cn } from '@/lib/utils';

/**
 * Enhanced Sentiment Scale Legend Component
 */
export function SentimentLegend() {
  const legendItems = [
    { value: 1, label: 'Concerned', color: 'bg-red-500', description: 'Negative sentiment' },
    { value: 2, label: 'Neutral', color: 'bg-yellow-500', description: 'Neutral sentiment' },
    { value: 3, label: 'Happy', color: 'bg-emerald-500', description: 'Positive sentiment' },
  ];

  return (
    <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-700">Sentiment Scale</h3>
      <div className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
        {legendItems.map((item) => (
          <div key={item.value} className="flex items-center gap-2">
            <div 
              className={cn("h-3 w-3 rounded-full shadow-sm", item.color)}
              aria-hidden="true"
            />
            <span className="font-light text-slate-600">
              {item.value} = {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs font-light text-slate-500">
        Sentiment scores are weighted averages: Happy (3), Neutral (2), Sad (1)
      </p>
    </div>
  );
}