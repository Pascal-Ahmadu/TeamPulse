// components/dashboard/DashboardHeader.tsx

import { Clock } from 'lucide-react';

/**
 * Dashboard Header Component
 * @returns {JSX.Element} Dashboard header section
 */
export default function DashboardHeader() {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
           
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-slate-900 tracking-tight">
                Team Analytics
              </h1>
              <p className="text-xs sm:text-sm font-light text-slate-600 leading-relaxed">
                Enterprise Team Sentiment Analytics Platform
              </p>
            </div>
          </div>
          <p className="text-xs font-light text-slate-500 max-w-2xl leading-relaxed">
            Monitor team sentiment patterns and organizational health metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-light text-slate-400">
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md sm:rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
          </div>
          <span>
            Updated {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}