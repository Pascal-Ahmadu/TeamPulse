/**
 * @fileoverview Sentiment calculation utilities
 * @author Pascal Ally Ahmadu
 */

import { SentimentDataPoint, TeamSentimentData, SentimentStats } from './types';
import { SENTIMENT_WEIGHTS, getSentimentClassification } from './chart-utils';

/**
 * Calculate average sentiment for data points
 */
function calculateAverageSentiment(data: SentimentDataPoint[]): number {
  if (data.length === 0) return 0;
  
  const { totalWeightedSum, totalResponses } = data.reduce(
    (acc, point) => {
      const responses = (point.happy || 0) + (point.neutral || 0) + (point.sad || 0);
      const weightedSum = 
        (point.happy || 0) * SENTIMENT_WEIGHTS.HAPPY + 
        (point.neutral || 0) * SENTIMENT_WEIGHTS.NEUTRAL + 
        (point.sad || 0) * SENTIMENT_WEIGHTS.SAD;
      
      return {
        totalWeightedSum: acc.totalWeightedSum + weightedSum,
        totalResponses: acc.totalResponses + responses,
      };
    },
    { totalWeightedSum: 0, totalResponses: 0 }
  );

  return totalResponses > 0 ? totalWeightedSum / totalResponses : 0;
}

/**
 * Calculate sentiment trend and weekly change with proper typing
 */
function calculateSentimentTrend(trendData: SentimentDataPoint[]): { 
  sentimentTrend: 'up' | 'down' | 'stable', 
  weeklyChange: number 
} {
  if (trendData.length < 2) {
    return { sentimentTrend: 'stable', weeklyChange: 0 };
  }

  const sortedData = [...trendData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
  const secondHalf = sortedData.slice(Math.floor(sortedData.length / 2));
  
  const firstHalfAvg = calculateAverageSentiment(firstHalf);
  const secondHalfAvg = calculateAverageSentiment(secondHalf);
  
  const change = secondHalfAvg - firstHalfAvg;
  const changePercent = firstHalfAvg > 0 ? (change / firstHalfAvg) * 100 : 0;
  
  let sentimentTrend: 'up' | 'down' | 'stable';
  if (Math.abs(changePercent) < 2) {
    sentimentTrend = 'stable';
  } else if (changePercent > 0) {
    sentimentTrend = 'up';
  } else {
    sentimentTrend = 'down';
  }
  
  return { sentimentTrend, weeklyChange: Math.round(changePercent * 10) / 10 };
}

/**
 * Calculate comprehensive sentiment statistics
 */
export function calculateSentimentStats(
  trendData: SentimentDataPoint[], 
  teamData?: TeamSentimentData[]
): SentimentStats {
  const totalDataPoints = trendData.length;
  
  if (totalDataPoints === 0) {
    return {
      totalDataPoints: 0,
      avgSentiment: 0,
      totalResponses: 0,
      totalTeams: teamData?.length || 0,
      activeMembers: 0,
      sentimentTrend: 'stable',
      weeklyChange: 0,
      sentimentData: {
        label: 'Critical',
        color: 'red',
        score: 0,
      }
    };
  }

  // Calculate weighted average sentiment score
  const { totalWeightedSum, totalResponses } = trendData.reduce(
    (acc, point) => {
      const responses = (point.happy || 0) + (point.neutral || 0) + (point.sad || 0);
      const weightedSum = 
        (point.happy || 0) * SENTIMENT_WEIGHTS.HAPPY + 
        (point.neutral || 0) * SENTIMENT_WEIGHTS.NEUTRAL + 
        (point.sad || 0) * SENTIMENT_WEIGHTS.SAD;
      
      return {
        totalWeightedSum: acc.totalWeightedSum + weightedSum,
        totalResponses: acc.totalResponses + responses,
      };
    },
    { totalWeightedSum: 0, totalResponses: 0 }
  );

  const avgSentiment = totalResponses > 0 ? totalWeightedSum / totalResponses : 0;
  
  // Calculate trend and weekly change
  const { sentimentTrend, weeklyChange } = calculateSentimentTrend(trendData);
  
  // Calculate team stats
  const totalTeams = teamData?.length || 0;
  const activeMembers = teamData?.reduce((sum, team) => sum + (team.isActive ? team.memberCount : 0), 0) || 0;
  
  return {
    totalDataPoints,
    avgSentiment,
    totalResponses,
    totalTeams,
    activeMembers,
    sentimentTrend,
    weeklyChange,
    sentimentData: getSentimentClassification(avgSentiment),
  };
}