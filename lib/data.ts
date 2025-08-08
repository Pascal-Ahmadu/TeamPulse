// /types/index.ts
import type {
  Team as PrismaTeam,
  Member as PrismaMember,
  Setting as PrismaSetting,
  Sentiment as PrismaSentiment,
} from '@prisma/client';

// Re-export Prisma types so they can be imported from '@/types'
export type Team = PrismaTeam;
export type Member = PrismaMember;
export type Setting = PrismaSetting;
export type Sentiment = PrismaSentiment;

// If you still want extra custom types
export interface SentimentTrendData {
  date: string;
  [teamName: string]: string | number;
}
