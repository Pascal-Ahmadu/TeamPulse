import { Team, Member, Sentiment, Setting } from '@/types';

// Mock database - in production, this would be replaced with actual database calls
let teams: Team[] = [
  {
    id: '1',
    name: 'Engineering Team',
    members: [],
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    name: 'Design Team',
    members: [],
    createdAt: new Date('2025-01-02')
  },
  {
    id: '3',
    name: 'Marketing Team',
    members: [],
    createdAt: new Date('2025-01-03')
  }
];

let members: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    sentiment: Sentiment.HAPPY,
    teamId: '1',
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    sentiment: Sentiment.NEUTRAL,
    teamId: '1',
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    sentiment: Sentiment.SAD,
    teamId: '2',
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    sentiment: Sentiment.HAPPY,
    teamId: '2',
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    sentiment: Sentiment.NEUTRAL,
    teamId: '3',
    updatedAt: new Date()
  }
];

let settings: Setting[] = [
  { id: '1', key: 'notification_enabled', value: 'true' },
  { id: '2', key: 'auto_survey_frequency', value: 'weekly' },
  { id: '3', key: 'team_size_limit', value: '50' }
];

// Teams
export async function getTeams(): Promise<Team[]> {
  return teams.map(team => ({
    ...team,
    members: members.filter(m => m.teamId === team.id)
  }));
}

export async function getTeamById(id: string): Promise<Team | null> {
  const team = teams.find(t => t.id === id);
  if (!team) return null;
  
  return {
    ...team,
    members: members.filter(m => m.teamId === id)
  };
}

export async function createTeam(name: string): Promise<Team> {
  const newTeam = {
    id: (teams.length + 1).toString(),
    name,
    members: [],
    createdAt: new Date()
  };
  teams.push(newTeam);
  return newTeam;
}

export async function deleteTeam(id: string): Promise<void> {
  teams = teams.filter(t => t.id !== id);
  members = members.filter(m => m.teamId !== id);
}

// Members
export async function getMembers(teamId?: string): Promise<Member[]> {
  if (teamId) {
    return members.filter(m => m.teamId === teamId);
  }
  return members;
}

export async function getMemberById(id: string): Promise<Member | null> {
  return members.find(m => m.id === id) || null;
}

export async function createMember(data: { name: string; email: string; teamId: string; sentiment: Sentiment }): Promise<Member> {
  const newMember = {
    id: (members.length + 1).toString(),
    ...data,
    updatedAt: new Date()
  };
  members.push(newMember);
  return newMember;
}

export async function updateMember(id: string, data: Partial<Member>): Promise<Member | null> {
  const index = members.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  members[index] = { ...members[index], ...data, updatedAt: new Date() };
  return members[index];
}

export async function deleteMember(id: string): Promise<void> {
  members = members.filter(m => m.id !== id);
}

// Settings
export async function getSettings(): Promise<Setting[]> {
  return settings;
}

export async function getSetting(key: string): Promise<string | null> {
  const setting = settings.find(s => s.key === key);
  return setting ? setting.value : null;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const index = settings.findIndex(s => s.key === key);
  if (index !== -1) {
    settings[index].value = value;
  } else {
    settings.push({ id: (settings.length + 1).toString(), key, value });
  }
}

// Analytics
export async function getTeamSentimentAverage(teamId: string): Promise<number> {
  const teamMembers = members.filter(m => m.teamId === teamId);
  if (teamMembers.length === 0) return 0;
  
  const sentimentScores = teamMembers.map(member => {
    switch (member.sentiment) {
      case Sentiment.HAPPY: return 3;
      case Sentiment.NEUTRAL: return 2;
      case Sentiment.SAD: return 1;
      default: return 2;
    }
  });
  
  const average = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
  return Math.round(average * 100) / 100;
}

export async function getSentimentTrends(): Promise<any[]> {
  // Mock trend data - in production, this would come from historical data
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates.map(date => ({
    date,
    'Engineering Team': Math.random() * 1 + 2, // Between 2-3
    'Design Team': Math.random() * 1 + 1.5, // Between 1.5-2.5
    'Marketing Team': Math.random() * 1 + 2.2, // Between 2.2-3.2
  }));
}