// @/types/index.ts
import {
  Team as PrismaTeam,
  Member as PrismaMember,
  Setting as PrismaSetting,
  Sentiment as PrismaSentiment
} from '@prisma/client';

// Custom types with relationships
export type Team = PrismaTeam & {
  members: PrismaMember[];
};

export type Member = PrismaMember;
export type Setting = PrismaSetting;
export { PrismaSentiment as Sentiment };

// Optional namespace for grouped exports
export namespace Types {
  export type Team = PrismaTeam & { members: PrismaMember[] };
  export type Member = PrismaMember;
  export type Setting = PrismaSetting;
  export type Sentiment = PrismaSentiment;
}