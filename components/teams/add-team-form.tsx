'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createTeam } from '@/lib/data';

export default function AddTeamForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createTeam(name.trim());
      setName('');
      router.refresh();
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="flex-1">
        <Label htmlFor="team-name" className="sr-only">Team name</Label>
        <Input
          id="team-name"
          type="text"
          placeholder="Enter team name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || !name.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        {loading ? 'Adding...' : 'Add Team'}
      </Button>
    </form>
  );
}