/**
 * Page Header Component
 * 
 * @file /components/teams/page-header.tsx
 */

import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
}

export function PageHeader({ title, subtitle, description, icon: Icon }: PageHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-4 mb-6">
       
        <div>
          <h1 className="text-4xl lg:text-2xl font-extralight text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-slate-600 mt-1" role="doc-subtitle">
            {subtitle}
          </p>
        </div>
      </div>
      <p className="text-slate-500 max-w-2xl leading-relaxed">
        {description}
      </p>
    </header>
  );
}
