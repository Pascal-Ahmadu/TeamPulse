
import { getTeamById, getMembers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';
import SentimentBadge from '@/components/ui/sentiment-badge';
import AddMemberForm from '@/components/teams/add-member-form';
import MemberList from '@/components/teams/member-list';

interface TeamPageProps {
  params: {
    teamId: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {

  
  const team = await getTeamById(params.teamId);
  if (!team) {
    notFound();
  }

  const members = await getMembers(params.teamId);
  
  // Calculate sentiment distribution
  const sentimentCounts = {
    HAPPY: members.filter(m => m.sentiment === 'HAPPY').length,
    NEUTRAL: members.filter(m => m.sentiment === 'NEUTRAL').length,
    SAD: members.filter(m => m.sentiment === 'SAD').length
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link 
              href="/teams"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Teams
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Created on {team.createdAt.toLocaleDateString()}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {members.length} member{members.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Happy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentimentCounts.HAPPY}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Neutral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{sentimentCounts.NEUTRAL}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sentimentCounts.SAD}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Member Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Team Member
          </CardTitle>
          <CardDescription>Add a new member to {team.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <AddMemberForm teamId={params.teamId} />
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage team members and their sentiment status</CardDescription>
        </CardHeader>
        <CardContent>
          <MemberList teamId={params.teamId} initialMembers={members} />
        </CardContent>
      </Card>
    </div>
  );
}