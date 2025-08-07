'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CreateTeamButton() {
  const handleClick = () => {
    // Focus on the team name input field
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    if (nameInput) {
      nameInput.focus();
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Button 
      variant="outline" 
      className="border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 shadow-sm"
      onClick={handleClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Your First Team
    </Button>
  );
}