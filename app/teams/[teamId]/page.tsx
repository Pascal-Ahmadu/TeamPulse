// app/teams/[teamId]/page.tsx
import * as React from 'react';

interface TeamPageProps {
  params: {
    teamId: string;
  };
}

// This MUST be the default export - it's your page component
export default function TeamPage({ params }: TeamPageProps) {
  const { teamId } = params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team: {teamId}</h1>
      
      {/* Add your team page content here */}
      <div className="space-y-4">
        <p className="text-gray-600">Welcome to team {teamId}</p>
        
        
        {/* <Button variant="default" size="default">Team Action</Button> */}
      </div>
    </div>
  );
}

// Optional: Add metadata
export async function generateMetadata({ params }: TeamPageProps) {
  return {
    title: `Team ${params.teamId}`,
  };
}