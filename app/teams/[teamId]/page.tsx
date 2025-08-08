import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import TeamPageClient from '@/components/teams/team-page-client';
import prisma from '@/lib/prisma';

interface TeamPageProps {
  params: {
    teamId: string;
  };
}

async function getTeam(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
    },
  });

  if (!team) {
    notFound();
  }

  return team;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = params;
  const team = await getTeam(teamId);

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading team details...</div>}>
        <TeamPageClient teamId={team.id} teamName={team.name} />
      </Suspense>
    </div>
  );
}