'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { 
  createTeam as createTeamDb, 
  createMember as createMemberDb, 
  updateMember as updateMemberDb, 
  deleteMember as deleteMemberDb, 
  deleteTeam as deleteTeamDb,
  searchMembers,
  updateSetting as updateSettingDb
} from '@/lib/data';
import { Sentiment } from '@/types';

// Settings Actions
export async function updateSettings(settingsData: { checkins_enabled: string; checkin_frequency: string }) {
  try {
    // Update both settings
    await updateSettingDb('checkins_enabled', settingsData.checkins_enabled);
    await updateSettingDb('checkin_frequency', settingsData.checkin_frequency);
    
    revalidatePath('/admin-settings');
    return { success: true };
  } catch (error) {
    console.error('Settings Action Error:', error);
    throw new Error('Failed to update settings');
  }
}

// Team Actions
export async function createTeam(teamName: string) {
  try {
    if (!teamName.trim() || teamName.trim().length < 3) {
      throw new Error('Team name must be at least 3 characters long');
    }

    const team = await createTeamDb(teamName);
    revalidatePath('/teams');
    return { success: true, team };
  } catch (error) {
    console.error('Action Error:', error);
    throw error;
  }
}

export async function removeTeam(teamId: string) {
  try {
    await deleteTeamDb(teamId);
    revalidatePath('/teams');
    redirect('/teams');
  } catch (error) {
    console.error('Action Error:', error);
    throw error;
  }
}

// Member Actions
export async function addMember(data: {
  name: string;
  email: string;
  teamId: string;
  sentiment: Sentiment;
}) {
  try {
    // Validation
    if (!data.name.trim() || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
        
    if (!data.email.trim()) {
      throw new Error('Email is required');
    }
        
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      throw new Error('Please enter a valid email address');
    }

    const member = await createMemberDb({
      name: data.name,
      email: data.email,
      teamId: data.teamId,
      sentiment: data.sentiment,
    });

    revalidatePath(`/teams/${data.teamId}`);
    revalidatePath('/teams');
        
    return { success: true, member };
  } catch (error) {
    console.error('Action Error:', error);
    throw error;
  }
}

export async function updateMemberSentiment(memberId: string, sentiment: Sentiment, teamId: string) {
  try {
    const member = await updateMemberDb(memberId, { sentiment });
        
    if (!member) {
      throw new Error('Member not found');
    }

    revalidatePath(`/teams/${teamId}`);
    revalidatePath('/teams');
        
    return { success: true, member };
  } catch (error) {
    console.error('Action Error:', error);
    throw error;
  }
}

export async function updateMemberDetails(
  memberId: string, 
  data: { name?: string; email?: string; sentiment?: Sentiment },
  teamId: string
) {
  try {
    // Validation
    if (data.name !== undefined) {
      if (!data.name.trim() || data.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
    }
        
    if (data.email !== undefined) {
      if (!data.email.trim()) {
        throw new Error('Email is required');
      }
            
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        throw new Error('Please enter a valid email address');
      }
    }

    const member = await updateMemberDb(memberId, data);
        
    if (!member) {
      throw new Error('Member not found');
    }

    revalidatePath(`/teams/${teamId}`);
    revalidatePath('/teams');
        
    return { success: true, member };
  } catch (error) {
    console.error('Action Error:', error);
    throw error;
  }
}

export async function removeMember(memberId: string, teamId: string) {
  try {
    await deleteMemberDb(memberId);
    revalidatePath(`/teams/${teamId}`);
    revalidatePath('/teams');
        
    return { success: true };
  } catch (error) {
    console.error('Action Error:', error);
    throw error;
  }
}

// Search Action - This is the new action to fix the Prisma browser issue
export async function searchMembersAction(
  teamId: string, 
  searchTerm: string = '', 
  page: number = 1, 
  limit: number = 10
) {
  try {
    const result = await searchMembers(teamId, searchTerm, page, limit);
    return result;
  } catch (error) {
    console.error('Search Action Error:', error);
    throw new Error('Failed to search members');
  }
}