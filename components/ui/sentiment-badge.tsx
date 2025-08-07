import { cn } from '@/lib/utils';
import { Sentiment } from '@/types';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  showIcon?: boolean;
  className?: string;
}

export default function SentimentBadge({ sentiment, showIcon = true, className }: SentimentBadgeProps) {
  const getSentimentConfig = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.HAPPY:
        return {
          color: 'bg-green-100 text-green-800',
          icon: Smile,
          text: 'Happy'
        };
      case Sentiment.NEUTRAL:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Meh,
          text: 'Neutral'
        };
      case Sentiment.SAD:
        return {
          color: 'bg-red-100 text-red-800',
          icon: Frown,
          text: 'Sad'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: Meh,
          text: 'Unknown'
        };
    }
  };

  const config = getSentimentConfig(sentiment);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.text}
    </span>
  );
}