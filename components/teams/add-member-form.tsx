'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { createMember } from '@/lib/data';
import { Sentiment } from '@/types';

interface AddMemberFormProps {
  teamId: string;
}

export default function AddMemberForm({ teamId }: AddMemberFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment>(Sentiment.NEUTRAL);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      await createMember({
        name: name.trim(),
        email: email.trim(),
        teamId,
        sentiment
      });
      
      setName('');
      setEmail('');
      setSentiment(Sentiment.NEUTRAL);
      router.refresh();
    } catch (error) {
      console.error('Error creating member:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="member-name">Name</Label>
          <Input
            id="member-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="member-email">Email</Label>
          <Input
            id="member-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="member-sentiment">Initial Sentiment</Label>
          <Select
            value={sentiment}
            onValueChange={(value) => setSentiment(value as Sentiment)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Sentiment.HAPPY}>😊 Happy</SelectItem>
              <SelectItem value={Sentiment.NEUTRAL}>😐 Neutral</SelectItem>
              <SelectItem value={Sentiment.SAD}>😢 Sad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" disabled={loading || !name.trim() || !email.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        {loading ? 'Adding...' : 'Add Member'}
      </Button>
    </form>
  );
}