/**
 * @fileoverview Chart utilities and styling configurations
 * @author Pascal Ally Ahmadu
 */

import { SentimentType } from './types';

/**
 * Enhanced sentiment classification configuration
 */
export const SENTIMENT_CONFIG = {
  EXCELLENT: { 
    threshold: 2.7, 
    label: 'Excellent', 
    color: 'emerald',
    emoji: '🎉',
    gradient: 'from-emerald-100 to-green-100',
    border: 'border-emerald-200',
    text: 'text-emerald-700'
  },
  GOOD: { 
    threshold: 2.3, 
    label: 'Good', 
    color: 'green',
    emoji: '😊',
    gradient: 'from-green-100 to-emerald-100',
    border: 'border-green-200',
    text: 'text-green-700'
  },
  MODERATE: { 
    threshold: 2.0, 
    label: 'Moderate', 
    color: 'blue',
    emoji: '🙂',
    gradient: 'from-blue-100 to-sky-100',
    border: 'border-blue-200',
    text: 'text-blue-700'
  },
  NEUTRAL: { 
    threshold: 1.7, 
    label: 'Neutral', 
    color: 'yellow',
    emoji: '😐',
    gradient: 'from-yellow-100 to-amber-100',
    border: 'border-yellow-200',
    text: 'text-yellow-700'
  },
  POOR: { 
    threshold: 1.3, 
    label: 'Needs Attention', 
    color: 'orange',
    emoji: '😕',
    gradient: 'from-orange-100 to-yellow-100',
    border: 'border-orange-200',
    text: 'text-orange-700'
  },
  CRITICAL: { 
    threshold: 0, 
    label: 'Critical', 
    color: 'red',
    emoji: '😟',
    gradient: 'from-red-100 to-rose-100',
    border: 'border-red-200',
    text: 'text-red-700'
  },
} as const;

/**
 * Sentiment weights for calculation - matches your database enum
 */
export const SENTIMENT_WEIGHTS: Record<SentimentType, number> = {
  HAPPY: 3,
  NEUTRAL: 2,
  SAD: 1,
} as const;

/**
 * Generate CSS classes for sentiment styling with explicit Tailwind classes
 */
export function getSentimentStyles(color: string) {
  const colorMap: Record<string, any> = {
    emerald: {
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600',
    },
    green: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
    },
    blue: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
    },
    yellow: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-600',
    },
    orange: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
    },
    red: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600',
    },
  };
  
  return colorMap[color] || colorMap.red;
}

/**
 * Enhanced sentiment classification
 */
export function getSentimentClassification(avgScore: number) {
  const classifications = Object.entries(SENTIMENT_CONFIG)
    .sort(([,a], [,b]) => b.threshold - a.threshold);
  
  for (const [, config] of classifications) {
    if (avgScore >= config.threshold) {
      return {
        label: config.label,
        color: config.color,
        score: avgScore,
      };
    }
  }
  
  return {
    label: SENTIMENT_CONFIG.CRITICAL.label,
    color: SENTIMENT_CONFIG.CRITICAL.color,
    score: avgScore,
  };
}

/**
 * Chart color palette for teams
 */
export const CHART_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald  
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16'  // Lime
];