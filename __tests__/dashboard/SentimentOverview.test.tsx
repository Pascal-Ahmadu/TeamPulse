import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentimentOverview from '@/components/dashboard/SentimentOverview';

describe('SentimentOverview', () => {
  const mockSentimentData = {
    HAPPY: 5,
    NEUTRAL: 3,
    SAD: 2
  };

  it('renders sentiment distribution correctly', () => {
    const { getByText } = render(
      <SentimentOverview 
        sentimentBreakdown={mockSentimentData}
        memberCount={10}
      />
    );

    // Check if sentiment counts are displayed
    expect(getByText('5')).toBeInTheDocument(); // Happy count
    expect(getByText('3')).toBeInTheDocument(); // Neutral count
    expect(getByText('2')).toBeInTheDocument(); // Sad count

    // Check category labels
    expect(getByText('Positive')).toBeInTheDocument(); // Happy
    expect(getByText('Neutral')).toBeInTheDocument();
    expect(getByText('At Risk')).toBeInTheDocument(); // Sad
  });

  it('handles zero members correctly', () => {
    const emptySentimentData = {
      HAPPY: 0,
      NEUTRAL: 0,
      SAD: 0
    };

    const { getByText } = render(
      <SentimentOverview 
        sentimentBreakdown={emptySentimentData}
        memberCount={0}
      />
    );

    expect(getByText('Sentiment Distribution')).toBeInTheDocument();
    // Check all sentiment counts are 0
    const happyCount = getByText('0', { selector: '.happy-count' });
    const neutralCount = getByText('0', { selector: '.neutral-count' });
    const sadCount = getByText('0', { selector: '.sad-count' });
    expect(happyCount).toBeInTheDocument();
    expect(neutralCount).toBeInTheDocument();
    expect(sadCount).toBeInTheDocument();
  });
});
