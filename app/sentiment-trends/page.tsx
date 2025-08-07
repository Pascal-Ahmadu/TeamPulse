import { getSentimentTrends } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Activity, Calendar } from 'lucide-react';
import SentimentTrendsChart from '@/components/charts/sentiment-trends-chart';

export default async function SentimentTrendsPage() {
  const trendData = await getSentimentTrends();

  // Calculate some summary stats for the header cards
  const totalDataPoints = trendData.length;
  const avgSentiment = trendData.length > 0 
  ? trendData.reduce((sum, point) => {
      const totalResponses = (point.happy || 0) + (point.neutral || 0) + (point.sad || 0);
      const weightedSum = (point.happy || 0) * 3 + (point.neutral || 0) * 2 + (point.sad || 0) * 1;
      return sum + (totalResponses > 0 ? weightedSum / totalResponses : 0);
    }, 0) / trendData.length 
  : 0;
  const getSentimentLabel = (avg: number) => {
    if (avg >= 2.5) return { label: 'Excellent', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
    if (avg >= 2.0) return { label: 'Good', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' };
    if (avg >= 1.5) return { label: 'Neutral', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' };
    return { label: 'Needs Attention', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' };
  };

  const sentimentData = getSentimentLabel(avgSentiment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Container with proper responsive width management */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* Header Section - Enhanced with icon and better typography */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Sentiment Trends
              </h1>
              <p className="text-slate-600 mt-1">
                Analytics & Insights Dashboard
              </p>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Track how team sentiment evolves over time with comprehensive analytics and real-time insights into organizational health patterns.
          </p>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Data Points
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      {totalDataPoints}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      7 days
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Average Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      {avgSentiment.toFixed(1)}
                    </p>
                    <Badge variant="outline" className={`text-xs ${sentimentData.textColor} ${sentimentData.borderColor}`}>
                      {sentimentData.label}
                    </Badge>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${sentimentData.color.replace('bg-', 'from-')} to-${sentimentData.color.split('-')[1]}-600 shadow-lg`}>
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Tracking Period
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      7
                    </p>
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Days
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart Card - Enhanced with modern styling */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    7-Day Sentiment Trend Analysis
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Track sentiment patterns and emotional health metrics across your organization
                  </CardDescription>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                  Live Data
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Sentiment Scale Legend */}
            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-slate-600 font-medium">1 = Concerned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                  <span className="text-slate-600 font-medium">2 = Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span className="text-slate-600 font-medium">3 = Happy</span>
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative">
              <SentimentTrendsChart data={trendData} />
            </div>

            {/* Additional Insights Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  <span>Real-time sentiment tracking</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Updated continuously</span>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    Analytics
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}