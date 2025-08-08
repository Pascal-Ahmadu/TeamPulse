import { Team, Member, Setting, isValidTeam } from '@/types';
import prisma from '@/lib/prisma';
import { Sentiment } from '@prisma/client';

// Teams
export async function getTeams(): Promise<Team[]> {
  try {
    console.log('Fetching teams from database...');
    
    const teams = await prisma.team.findMany({
      include: {
        members: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log('Raw teams from database:', teams);
    
    // Validate and transform the data
    const validatedTeams = teams
      .map((team: any) => {
        const transformedTeam = {
          ...team,
          // Ensure members is always an array
          members: team.members || [],
        };
        
        // Validate the team structure
        if (!isValidTeam(transformedTeam)) {
          console.error('Invalid team structure:', transformedTeam);
          return null;
        }
        
        return transformedTeam;
      })
      .filter((team): team is Team => team !== null);
    
    console.log('Validated teams:', validatedTeams);
    
    return validatedTeams;
  } catch (error) {
    console.error('Database Error in getTeams:', error);
    throw new Error('Failed to fetch teams');
  }
}

export async function getTeamById(id: string): Promise<Team | null> {
  try {
    if (!id || typeof id !== 'string') {
      console.error('Invalid team ID provided:', id);
      return null;
    }
    
    console.log('Fetching team by ID:', id);
    
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
    
    if (!team) {
      console.log('Team not found for ID:', id);
      return null;
    }
    
    const transformedTeam = {
      ...team,
      members: team.members || [],
    };
    
    if (!isValidTeam(transformedTeam)) {
      console.error('Invalid team structure from database:', transformedTeam);
      return null;
    }
    
    return transformedTeam;
  } catch (error) {
    console.error('Database Error in getTeamById:', error);
    throw new Error('Failed to fetch team');
  }
}

export async function createTeam(name: string): Promise<Team> {
  try {
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      throw new Error('Team name must be at least 3 characters long');
    }

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
      },
      include: {
        members: true,
      },
    });
    
    const transformedTeam = {
      ...team,
      members: team.members || [],
    };
    
    if (!isValidTeam(transformedTeam)) {
      console.error('Created team has invalid structure:', transformedTeam);
      throw new Error('Failed to create team - invalid data structure');
    }
    
    return transformedTeam;
  } catch (error) {
    console.error('Database Error in createTeam:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('A team with this name already exists');
    }
    throw new Error('Failed to create team');
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid team ID');
    }

    // Members will be deleted automatically due to CASCADE
    await prisma.team.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Database Error in deleteTeam:', error);
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
    console.error('Database Error in getMembers:', error);
    throw new Error('Failed to fetch members');
  }
}

export async function getMemberById(id: string): Promise<Member | null> {
  try {
    if (!id || typeof id !== 'string') {
      return null;
    }

    return await prisma.member.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Database Error in getMemberById:', error);
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
    // Validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
      throw new Error('Email is required');
    }
    if (!data.teamId || typeof data.teamId !== 'string') {
      throw new Error('Team ID is required');
    }

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
    console.error('Database Error in createMember:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('This email is already registered in this team');
    }
    throw new Error('Failed to add member');
  }
}

export async function updateMember(id: string, data: Partial<Member>): Promise<Member | null> {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid member ID');
    }

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
    console.error('Database Error in updateMember:', error);
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
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid member ID');
    }

    await prisma.member.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Database Error in deleteMember:', error);
    throw new Error('Failed to delete member');
  }
}

// Search members with pagination
export async function searchMembers(
  teamId: string,
  searchTerm: string = '',
  page: number = 1,
  limit: number = 10
): Promise<{ members: Member[]; total: number; totalPages: number }> {
  try {
    if (!teamId || typeof teamId !== 'string') {
      throw new Error('Invalid team ID');
    }

    const skip = (page - 1) * limit;
    
    // Build the where clause conditionally
    const whereClause: any = {
      teamId,
    };
    
    // Only add search conditions if there's a search term
    if (searchTerm && searchTerm.trim()) {
      whereClause.OR = [
        {
          name: {
            contains: searchTerm.trim(),
            mode: 'insensitive' as const,
          },
        },
        {
          email: {
            contains: searchTerm.trim(),
            mode: 'insensitive' as const,
          },
        },
      ];
    }
    
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
    console.error('Database Error in searchMembers:', error);
    throw new Error('Failed to search members');
  }
}

// Get member count for a team
export async function getMemberCount(teamId: string): Promise<number> {
  try {
    if (!teamId || typeof teamId !== 'string') {
      throw new Error('Invalid team ID');
    }

    return await prisma.member.count({
      where: { teamId },
    });
  } catch (error) {
    console.error('Database Error in getMemberCount:', error);
    throw new Error('Failed to get member count');
  }
}

// Settings
export async function getSettings(): Promise<Setting[]> {
  try {
    return await prisma.setting.findMany();
  } catch (error) {
    console.error('Database Error in getSettings:', error);
    throw new Error('Failed to fetch settings');
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid setting key');
    }

    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    return setting ? setting.value : null;
  } catch (error) {
    console.error('Database Error in getSetting:', error);
    throw new Error('Failed to fetch setting');
  }
}

export async function updateSetting(key: string, value: string): Promise<void> {
  try {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid setting key');
    }
    if (typeof value !== 'string') {
      throw new Error('Invalid setting value');
    }

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  } catch (error) {
    console.error('Database Error in updateSetting:', error);
    throw new Error('Failed to update setting');
  }
}

// Analytics
export async function getTeamSentimentAverage(teamId: string): Promise<number> {
  try {
    if (!teamId || typeof teamId !== 'string') {
      throw new Error('Invalid team ID');
    }

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
    console.error('Database Error in getTeamSentimentAverage:', error);
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
      
      teams.forEach((team: any) => {
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
    console.error('Database Error in getSentimentTrends:', error);
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
    console.error('Database Error in getTeamStats:', error);
    throw new Error('Failed to get team statistics');
  }
}