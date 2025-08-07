
import { getSentimentTrends } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SentimentTrendsChart from '@/components/charts/sentiment-trends-chart';

export default async function SentimentTrendsPage() {
  const trendData = await getSentimentTrends();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sentiment Trends</h1>
        <p className="text-gray-600 mt-2">Track how team sentiment changes over time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Sentiment Trend</CardTitle>
          <CardDescription>
            Average sentiment scores for each team over the past 7 days (1=Sad, 2=Neutral, 3=Happy)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SentimentTrendsChart data={trendData} />
        </CardContent>
      </Card>
    </div>
  );
}