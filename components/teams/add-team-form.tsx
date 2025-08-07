'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createTeam } from '@/app/actions';

export default function AddTeamForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

 
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!name.trim() || name.trim().length < 3) {
      setError('Team name must be at least 3 characters long');
      return;
    }

    setError('');
    setSuccess(false);

    startTransition(async () => {
      try {
        // Call server action
        await createTeam(name.trim());
        
        setName('');
        setSuccess(true);
        setTimeout(() => {
          router.refresh(); // Refresh dashboard data
          setSuccess(false);
        }, 1500);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create team');
      }
    });
  };

  const isFormValid = name.trim().length >= 3;
  const isSubmitting = isPending;

  return (
    <div className="space-y-4">
      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            Team created successfully! Refreshing...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-3 space-y-2">
            <Label 
              htmlFor="team-name" 
              className="text-sm font-medium text-slate-700"
            >
              Team Name
            </Label>
            <Input
              id="team-name"
              name="name"
              type="text"
              placeholder="e.g., Engineering, Marketing, Sales..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(''); // Clear error when user types
              }}
              disabled={isSubmitting}
              className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              autoComplete="organization-title"
            />
            {name.trim().length > 0 && name.trim().length < 3 && (
              <p className="text-xs text-amber-600 mt-1">
                Team name must be at least 3 characters long
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </>
            )}
          </Button>
        </div>

        {/* Form Helper Text */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {name.length}/50 characters
          </span>
          <span>
            Press Enter to create team
          </span>
        </div>
      </form>

      {/* Optional: Recent teams or suggestions could go here */}
      {!success && !error && name.length === 0 && (
        <div className="pt-2">
          <p className="text-xs text-slate-400 leading-relaxed">
            💡 <span className="font-medium">Tip:</span> Use descriptive team names like "Frontend Engineering" or "Customer Success" to help with organization.
          </p>
        </div>
      )}
    </div>
  );
}