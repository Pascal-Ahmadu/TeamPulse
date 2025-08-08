/**
 * @fileoverview Type definitions for sentiment analytics
 * @author Pascal Ally Ahmadu
 */

export type SentimentType = 'HAPPY' | 'NEUTRAL' | 'SAD';

export interface SentimentDataPoint {
  date: string;
  happy: number;
  neutral: number;
  sad: number;
  teamId?: string;
  teamName?: string;
}

export interface TeamSentimentData {
  teamId: string;
  teamName: string;
  memberCount: number;
  isActive: boolean;
  sentiments: SentimentDataPoint[];
}

export interface SentimentStats {
  totalDataPoints: number;
  avgSentiment: number;
  totalResponses: number;
  totalTeams: number;
  activeMembers: number;
  sentimentTrend: 'up' | 'down' | 'stable';
  weeklyChange: number;
  sentimentData: {
    label: string;
    color: string;
    score: number;
  };
}

export interface SentimentCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  color: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
  };
}