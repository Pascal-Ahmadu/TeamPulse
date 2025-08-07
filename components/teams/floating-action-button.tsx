'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function FloatingActionButton() {
  const handleClick = () => {
    // Focus on the team name input field and scroll to it
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    if (nameInput) {
      nameInput.focus();
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 sm:hidden">
      <Button 
        size="lg"
        className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
        onClick={handleClick}
        aria-label="Create new team"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}