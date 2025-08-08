'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddMemberModal from './add-member-modal';

interface TeamPageClientProps {
  teamId: string;
  teamName: string;
}

export default function TeamPageClient({ teamId, teamName }: TeamPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    // Optional: You can add any additional success handling here
    console.log('Member added successfully');
  };

  return (
    <>
      <Button 
        onClick={handleOpenModal}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Member
      </Button>

      <AddMemberModal
        teamId={teamId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
}