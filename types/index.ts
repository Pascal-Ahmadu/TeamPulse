// /types/index.ts
import {
  Team as PrismaTeam,
  Member as PrismaMember,
  Setting as PrismaSetting,
  Sentiment as PrismaSentimentEnum,
} from '@prisma/client';

// ✅ Export Sentiment enum & type directly
export const Sentiment = PrismaSentimentEnum;
export type Sentiment = PrismaSentimentEnum;

// ✅ Namespace for grouped imports
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
