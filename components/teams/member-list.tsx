'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Member, Sentiment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Trash2, Edit3, Save, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import SentimentBadge from '@/components/ui/sentiment-badge';
import { updateMemberDetails, removeMember } from '@/app/actions';
import { searchMembers } from '@/lib/data';

interface MemberListProps {
  teamId: string;
  initialMembers: Member[];
  initialTotal?: number;
}

const MEMBERS_PER_PAGE = 10;

export default function MemberList({ teamId, initialMembers, initialTotal = 0 }: MemberListProps) {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(initialTotal || initialMembers.length);
  const [totalPages, setTotalPages] = useState(Math.ceil((initialTotal || initialMembers.length) / MEMBERS_PER_PAGE));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', sentiment: Sentiment.NEUTRAL });
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    setCurrentPage(page);
    setSearchTerm(search);
  }, [searchParams]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== searchParams.get('search') || currentPage !== parseInt(searchParams.get('page') || '1')) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const result = await searchMembers(teamId, searchTerm, currentPage, MEMBERS_PER_PAGE);
      setMembers(result.members);
      setTotalMembers(result.total);
      setTotalPages(result.totalPages);
      
      // Update URL
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (currentPage > 1) params.set('page', currentPage.toString());
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/teams/${teamId}${newUrl}`, { scroll: false });
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      sentiment: member.sentiment
    });
  };

  const handleSave = async (memberId: string) => {
    startTransition(async () => {
      try {
        const result = await updateMemberDetails(memberId, editForm, teamId);
        if (result.success) {
          setMembers(members.map(m => m.id === memberId ? result.member : m));
          setEditingId(null);
          router.refresh();
        }
      } catch (error) {
        console.error('Error updating member:', error);
        alert(error instanceof Error ? error.message : 'Failed to update member');
      }
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '', sentiment: Sentiment.NEUTRAL });
  };

  const handleDelete = async (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      startTransition(async () => {
        try {
          await removeMember(memberId, teamId);
          setMembers(members.filter(m => m.id !== memberId));
          setTotalMembers(prev => prev - 1);
          router.refresh();
          
          // Refresh the search if we're on the last page and it becomes empty
          if (members.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }
        } catch (error) {
          console.error('Error deleting member:', error);
          alert(error instanceof Error ? error.message : 'Failed to remove member');
        }
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (totalMembers === 0 && !searchTerm) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No members yet</h3>
          <p className="text-slate-600 mb-6">Add some members to get started with team sentiment tracking.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Stats Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isSearching}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isSearching && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
          
          <Badge variant="secondary" className="flex items-center gap-1">
            {totalMembers} member{totalMembers !== 1 ? 's' : ''}
            {searchTerm && ` found`}
          </Badge>
        </div>
      </div>

      {/* Members Table */}
      {members.length > 0 ? (
        <>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Sentiment</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-slate-50">
                    <TableCell>
                      {editingId === member.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="max-w-[200px]"
                          disabled={isPending}
                        />
                      ) : (
                        <div className="font-medium text-slate-900">{member.name}</div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {editingId === member.id ? (
                        <Input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="max-w-[240px]"
                          disabled={isPending}
                        />
                      ) : (
                        <div className="text-slate-600">{member.email}</div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {editingId === member.id ? (
                        <Select
                          value={editForm.sentiment}
                          onValueChange={(value) => setEditForm({ ...editForm, sentiment: value as Sentiment })}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Sentiment.HAPPY}>
                              <div className="flex items-center gap-2">
                                <span>😊</span>
                                <span>Happy</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={Sentiment.NEUTRAL}>
                              <div className="flex items-center gap-2">
                                <span>😐</span>
                                <span>Neutral</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={Sentiment.SAD}>
                              <div className="flex items-center gap-2">
                                <span>😟</span>
                                <span>Sad</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <SentimentBadge sentiment={member.sentiment} />
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-slate-500">
                        {new Date(member.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      {editingId === member.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(member.id)}
                            disabled={isPending}
                            className="h-8 w-8 p-0"
                          >
                            {isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(member)}
                            disabled={isPending}
                            className="h-8 w-8 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(member.id, member.name)}
                            disabled={isPending}
                            className="h-8 w-8 p-0"
                          >
                            {isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * MEMBERS_PER_PAGE) + 1} to {Math.min(currentPage * MEMBERS_PER_PAGE, totalMembers)} of {totalMembers} members
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isSearching}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        disabled={isSearching}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isSearching}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No members found</h3>
            <p className="text-slate-600 mb-6">
              No members found matching "{searchTerm}"
            </p>
            <Button variant="outline" onClick={clearSearch}>
              Clear search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}