import { Team, Member, Sentiment, Setting } from '@/types';
import prisma from '@/lib/prisma';

// Teams
export async function getTeams(): Promise<Team[]> {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return teams.map(team => ({
      ...team,
      // Ensure members is always an array
      members: team.members || [],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teams');
  }
}

export async function getTeamById(id: string): Promise<Team | null> {
  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!team) return null;
    
    return {
      ...team,
      members: team.members || [],
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch team');
  }
}

export async function createTeam(name: string): Promise<Team> {
  try {
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
      },
      include: {
        members: true,
      },
    });
    
    return {
      ...team,
      members: team.members || [],
    };
  } catch (error) {
    console.error('Database Error:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('A team with this name already exists');
    }
    throw new Error('Failed to create team');
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    // Members will be deleted automatically due to CASCADE
    await prisma.team.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete team');
  }
}

// Members
export async function getMembers(teamId?: string, page?: number, limit?: number): Promise<Member[]> {
  try {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit || undefined;
    
    const members = await prisma.member.findMany({
      where: teamId ? { teamId } : undefined,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return members;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members');
  }
}

export async function getMemberById(id: string): Promise<Member | null> {
  try {
    return await prisma.member.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch member');
  }
}

export async function createMember(data: { 
  name: string; 
  email: string; 
  teamId: string; 
  sentiment: Sentiment 
}): Promise<Member> {
  try {
    const member = await prisma.member.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        sentiment: data.sentiment,
        teamId: data.teamId,
      },
    });
    
    return member;
  } catch (error) {
    console.error('Database Error:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('This email is already registered in this team');
    }
    throw new Error('Failed to add member');
  }
}

export async function updateMember(id: string, data: Partial<Member>): Promise<Member | null> {
  try {
    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.email && { email: data.email.trim().toLowerCase() }),
        ...(data.sentiment && { sentiment: data.sentiment }),
        updatedAt: new Date(),
      },
    });
    
    return member;
  } catch (error) {
    console.error('Database Error:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('This email is already registered in this team');
    }
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return null;
    }
    throw new Error('Failed to update member');
  }
}

export async function deleteMember(id: string): Promise<void> {
  try {
    await prisma.member.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete member');
  }
}

// Search members with pagination
export async function searchMembers(
  teamId: string,
  searchTerm: string,
  page: number = 1,
  limit: number = 10
): Promise<{ members: Member[]; total: number; totalPages: number }> {
  try {
    const skip = (page - 1) * limit;
    
    const whereClause = {
      teamId,
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
      ],
    };
    
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.member.count({
        where: whereClause,
      }),
    ]);
    
    return {
      members,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to search members');
  }
}

// Get member count for a team
export async function getMemberCount(teamId: string): Promise<number> {
  try {
    return await prisma.member.count({
      where: { teamId },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get member count');
  }
}

// Settings
export async function getSettings(): Promise<Setting[]> {
  try {
    return await prisma.setting.findMany();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch settings');
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    return setting ? setting.value : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch setting');
  }
}

export async function updateSetting(key: string, value: string): Promise<void> {
  try {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update setting');
  }
}

// Analytics
export async function getTeamSentimentAverage(teamId: string): Promise<number> {
  try {
    const members = await prisma.member.findMany({
      where: { teamId },
      select: { sentiment: true },
    });
    
    if (members.length === 0) return 0;
    
    const sentimentScores = members.map((member: { sentiment: Sentiment }) => {
      switch (member.sentiment) {
        case 'HAPPY': return 3;
        case 'NEUTRAL': return 2;
        case 'SAD': return 1;
        default: return 2;
      }
    });
    
    const average = sentimentScores.reduce((sum: number, score: number) => sum + score, 0) / sentimentScores.length;
    return Math.round(average * 100) / 100;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to calculate sentiment average');
  }
}

export async function getSentimentTrends(): Promise<any[]> {
  try {
    // For now, return mock data - you could implement historical tracking later
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Get current teams and their sentiment averages
    const teams = await prisma.team.findMany({
      select: {
        name: true,
        members: {
          select: { sentiment: true },
        },
      },
    });
    
    return dates.map(date => {
      const trendData: any = { date };
      
      teams.forEach(team => {
        if (team.members.length === 0) {
          trendData[team.name] = 2;
          return;
        }
        
        const sentimentScores = team.members.map((member: { sentiment: Sentiment }) => {
          switch (member.sentiment) {
            case 'HAPPY': return 3;
            case 'NEUTRAL': return 2;
            case 'SAD': return 1;
            default: return 2;
          }
        });
        
        const average = sentimentScores.reduce((sum: number, score: number) => sum + score, 0) / sentimentScores.length;
        // Add some variation for the trend
        trendData[team.name] = Math.max(1, Math.min(3, average + (Math.random() - 0.5) * 0.4));
      });
      
      return trendData;
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get sentiment trends');
  }
}

// Get team statistics
export async function getTeamStats(): Promise<{
  totalTeams: number;
  totalMembers: number;
  sentimentDistribution: { happy: number; neutral: number; sad: number };
}> {
  try {
    const [totalTeams, members] = await Promise.all([
      prisma.team.count(),
      prisma.member.findMany({
        select: { sentiment: true },
      }),
    ]);
    
    const sentimentDistribution = {
      happy: members.filter((m: { sentiment: Sentiment }) => m.sentiment === 'HAPPY').length,
      neutral: members.filter((m: { sentiment: Sentiment }) => m.sentiment === 'NEUTRAL').length,
      sad: members.filter((m: { sentiment: Sentiment }) => m.sentiment === 'SAD').length,
    };
    
    return {
      totalTeams,
      totalMembers: members.length,
      sentimentDistribution,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get team statistics');
  }
}