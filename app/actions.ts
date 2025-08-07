'use server';

import prisma from '@/lib/prisma';

export async function createTeam(teamName: string) {
  try {
    return await prisma.team.create({
      data: {
        name: teamName,
       
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create team');
  }
}