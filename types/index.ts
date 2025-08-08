// @/types/index.ts
import type { Prisma } from '@prisma/client';
import {
  Team as PrismaTeam,
  Member as PrismaMember,
  Setting as PrismaSetting,
  Sentiment as PrismaSentiment
} from '@prisma/client';

// Custom types with relationships - ensuring all required fields are included
export type Team = PrismaTeam & {
  members: PrismaMember[];
};

export type Member = PrismaMember;
export type Setting = PrismaSetting;

// Re-export Prisma's Sentiment enum directly
export { PrismaSentiment as Sentiment };

// Type for teams with members included (for explicit typing)
export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: { members: true }
}>;

// Optional namespace for grouped exports
export namespace Types {
  export type Team = PrismaTeam & { members: PrismaMember[] };
  export type Member = PrismaMember;
  export type Setting = PrismaSetting;
  export type Sentiment = PrismaSentiment;
}

// Type guards for runtime validation
export function isValidTeam(team: any): team is Team {
  return (
    team &&
    typeof team.id === 'string' &&
    typeof team.name === 'string' &&
    team.createdAt instanceof Date &&
    typeof team.isActive === 'boolean' &&
    Array.isArray(team.members)
  );
}

export function isValidMember(member: any): member is Member {
  return (
    member &&
    typeof member.id === 'string' &&
    typeof member.name === 'string' &&
    typeof member.email === 'string' &&
    typeof member.teamId === 'string' &&
    ['HAPPY', 'NEUTRAL', 'SAD'].includes(member.sentiment)
  );
}