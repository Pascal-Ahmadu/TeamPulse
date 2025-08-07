import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/types';
import { Users, TrendingUp } from 'lucide-react';
import { getTeamSentimentAverage } from '@/lib/data';

interface TeamCardProps {
  team: Team;
}

export default async function TeamCard({ team }: TeamCardProps) {
  const sentimentAvg = await getTeamSentimentAverage(team.id);
  
  const getSentimentColor = (avg: number) => {
    if (avg >= 2.5) return 'bg-green-500';
    if (avg >= 1.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{team.name}</CardTitle>
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${getSentimentColor(sentimentAvg)}`} />
              <span className="text-sm font-medium">{sentimentAvg.toFixed(1)}</span>
            </div>
          </div>
          <CardDescription>
            Team created on {team.createdAt.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {team.members.length} member{team.members.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Badge variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          
          {team.members.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Sentiment Distribution:</div>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-600">
                    {team.members.filter(m => m.sentiment === 'HAPPY').length}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-xs text-gray-600">
                    {team.members.filter(m => m.sentiment === 'NEUTRAL').length}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-600">
                    {team.members.filter(m => m.sentiment === 'SAD').length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}