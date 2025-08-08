export interface Team {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
  memberCount: number;
  isActive: boolean;
  
}

export interface Member {
  id: string;
  name: string;
  email: string;
  sentiment: Sentiment;
  teamId: string;
  team?: Team;
  updatedAt: Date;
}

export enum Sentiment {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  SAD = 'SAD'
}

export interface Setting {
  id: string;
  key: string;
  value: string;
}

export interface User {
  id: string;
  email: string;
}

export interface SentimentTrendData {
  date: string;
  [teamName: string]: string | number;
}