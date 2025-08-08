// /types/index.ts
import {
  Team as PrismaTeam,
  Member as PrismaMember,
  Setting as PrismaSetting,
  Sentiment as PrismaSentimentEnum,
} from '@prisma/client';

// ✅ Export Prisma enum directly (as both value + type)
export const Sentiment = PrismaSentimentEnum;
export type Sentiment = PrismaSentimentEnum;

// ✅ Export Prisma model types directly
export type Team = PrismaTeam;
export type Member = PrismaMember;
export type Setting = PrismaSetting;

// ✅ Also keep everything grouped inside a namespace if you want that style
export namespace Types {
  export const Sentiment = PrismaSentimentEnum;
  export type Sentiment = PrismaSentimentEnum;
  export type Team = PrismaTeam;
  export type Member = PrismaMember;
  export type Setting = PrismaSetting;

  export interface SentimentTrendData {
    date: string;
    [teamName: string]: string | number;
  }
}

// ✅ Export SentimentTrendData at the top level too
export interface SentimentTrendData {
  date: string;
  [teamName: string]: string | number;
}
