/**
 * Create Team Section Component
 * 
 * @file /components/teams/create-team-section.tsx
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import  AddTeamForm  from '@/components/teams/add-team-form';

export function CreateTeamSection() {
  return (
    <section className="mb-12" aria-labelledby="create-team-heading">
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg"
                aria-hidden="true"
              >
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle 
                  id="create-team-heading"
                  className="text-lg font-light text-slate-900"
                >
                  Create New Team
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Add a new team to start tracking member sentiment and organizational metrics
                </CardDescription>
              </div>
            </div>
            <div 
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100"
              aria-hidden="true"
            >
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AddTeamForm />
        </CardContent>
      </Card>
    </section>
  );
}