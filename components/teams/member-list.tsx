'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Member, Sentiment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Edit3, Save, X } from 'lucide-react';
import SentimentBadge from '@/components/ui/sentiment-badge';
import { updateMember, deleteMember } from '@/lib/data';

interface MemberListProps {
  teamId: string;
  initialMembers: Member[];
}

export default function MemberList({ teamId, initialMembers }: MemberListProps) {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', sentiment: Sentiment.NEUTRAL });
  const router = useRouter();

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      sentiment: member.sentiment
    });
  };

  const handleSave = async (memberId: string) => {
    try {
      const updatedMember = await updateMember(memberId, editForm);
      if (updatedMember) {
        setMembers(members.map(m => m.id === memberId ? updatedMember : m));
      }
      setEditingId(null);
      router.refresh();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '', sentiment: Sentiment.NEUTRAL });
  };

  const handleDelete = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await deleteMember(memberId);
        setMembers(members.filter(m => m.id !== memberId));
        router.refresh();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No members in this team yet. Add some members to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}</Badge>
      </div>

      {/* Members Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  {editingId === member.id ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="max-w-[200px]"
                    />
                  ) : (
                    <div className="font-medium">{member.name}</div>
                  )}
                </TableCell>
                
                <TableCell>
                  {editingId === member.id ? (
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="max-w-[200px]"
                    />
                  ) : (
                    <div className="text-gray-600">{member.email}</div>
                  )}
                </TableCell>
                
                <TableCell>
                  {editingId === member.id ? (
                    <Select
                      value={editForm.sentiment}
                      onValueChange={(value) => setEditForm({ ...editForm, sentiment: value as Sentiment })}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Sentiment.HAPPY}>😊 Happy</SelectItem>
                        <SelectItem value={Sentiment.NEUTRAL}>😐 Neutral</SelectItem>
                        <SelectItem value={Sentiment.SAD}>😢 Sad</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <SentimentBadge sentiment={member.sentiment} />
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {member.updatedAt.toLocaleDateString()}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  {editingId === member.id ? (
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(member.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(member)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(member.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredMembers.length === 0 && searchTerm && (
        <div className="text-center py-4">
          <p className="text-gray-600">No members found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}