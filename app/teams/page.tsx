
import { getTeams } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import Link from 'next/link';
import AddTeamForm from '@/components/teams/add-team-form';
import TeamCard from '@/components/teams/team-card';

export default async function TeamsPage() {
  
  const teams = await getTeams();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">Manage your teams and their members</p>
        </div>
      </div>

      {/* Add Team Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Team
          </CardTitle>
          <CardDescription>Create a new team to start tracking member sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <AddTeamForm />
        </CardContent>
      </Card>

      {/* Teams List */}
      <div>
        <h2 className="text-xl font-semibold mb-6">All Teams ({teams.length})</h2>
        {teams.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams created yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first team using the form above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}