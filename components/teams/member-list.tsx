/**
 * @fileoverview MemberList Component - Team Member Management Interface
 * @description Displays and manages team members with search, pagination, and inline editing
 * Features:
 * - Lightweight typography with font-extralight
 * - Borderless design for clean card integration
 * - Real-time search with debouncing
 * - Inline member editing capabilities
 * - Responsive pagination
 * - Optimistic UI updates
 * - Kebab menu dropdown for actions
 * - Serial number column
 * 
 * @version 2.2.0
 * @author TeamPulse Development Team
 * @created 2024-01-15
 * @updated 2025-01-15
 */

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Trash2, Edit3, Save, X, ChevronLeft, ChevronRight, Loader2, Users, UserCheck, MoreVertical } from 'lucide-react';
import SentimentBadge from '@/components/ui/sentiment-badge';
import { updateMemberDetails, removeMember, searchMembersAction } from '@/app/actions';

/**
 * Props interface for MemberList component
 * @interface MemberListProps
 */
interface MemberListProps {
  teamId: string;
  initialMembers: Member[];
  initialTotal?: number;
}

/**
 * Constants for pagination and search
 */
const MEMBERS_PER_PAGE = 10;

/**
 * Main MemberList component for team member management
 * 
 * @component MemberList
 * @param teamId - Unique identifier for the team
 * @param initialMembers - Initial array of team members
 * @param initialTotal - Total count of members for pagination
 * @returns JSX.Element - Complete member management interface
 */
export default function MemberList({ teamId, initialMembers, initialTotal = 0 }: MemberListProps) {
  // State management
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

  // Initialize page and search from URL parameters
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    setCurrentPage(page);
    setSearchTerm(search);
  }, [searchParams]);

  // Debounced search effect for performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== searchParams.get('search') || currentPage !== parseInt(searchParams.get('page') || '1')) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage]);

  /**
   * Handles member search with server action
   * Updates URL parameters and member list
   */
  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const result = await searchMembersAction(teamId, searchTerm, currentPage, MEMBERS_PER_PAGE);
      setMembers(result.members);
      setTotalMembers(result.total);
      setTotalPages(result.totalPages);
      
      // Update URL with new search parameters
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

  /**
   * Initiates editing mode for a member
   * @param member - Member object to edit
   */
  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      sentiment: member.sentiment
    });
  };

  /**
   * Saves member changes with optimistic updates
   * @param memberId - ID of member to update
   */
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

  /**
   * Cancels editing mode and resets form
   */
  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '', sentiment: Sentiment.NEUTRAL });
  };

  /**
   * Deletes a member with confirmation
   * @param memberId - ID of member to delete
   * @param memberName - Name for confirmation dialog
   */
  const handleDelete = async (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      startTransition(async () => {
        try {
          await removeMember(memberId, teamId);
          setMembers(members.filter(m => m.id !== memberId));
          setTotalMembers(prev => prev - 1);
          router.refresh();
          
          // Navigate to previous page if current page becomes empty
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

  /**
   * Handles pagination navigation
   * @param page - Target page number
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Clears search term and resets to first page
   */
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  /**
   * Calculates serial number for a member based on current page
   * @param index - Index of member in current page
   * @returns Serial number
   */
  const getSerialNumber = (index: number) => {
    return (currentPage - 1) * MEMBERS_PER_PAGE + index + 1;
  };

  // Empty state when no members exist
  if (totalMembers === 0 && !searchTerm) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
        <CardContent className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-extralight text-slate-900 mb-2">No members yet</h3>
          <p className="text-sm font-extralight text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
            Add some members to get started with team sentiment tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <UserCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extralight text-slate-900">
              Team Members
            </h2>
            <p className="text-sm font-extralight text-slate-500">
              Manage {totalMembers} {totalMembers === 1 ? 'member' : 'members'}
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-extralight">
          {totalMembers} {totalMembers === 1 ? 'Member' : 'Members'}
        </Badge>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-100 font-extralight"
            disabled={isSearching}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isSearching && (
            <div className="flex items-center gap-2 text-sm font-extralight text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
        </div>
      </div>

      {/* Members Table - Borderless design for card integration */}
      {members.length > 0 ? (
        <>
          <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-0">
                  <TableHead className="font-extralight text-slate-700 border-0 w-16">#</TableHead>
                  <TableHead className="font-extralight text-slate-700 border-0">Member</TableHead>
                  <TableHead className="font-extralight text-slate-700 border-0">Email</TableHead>
                  <TableHead className="font-extralight text-slate-700 border-0">Sentiment</TableHead>
                  <TableHead className="font-extralight text-slate-700 border-0">Last Updated</TableHead>
                  <TableHead className="font-extralight text-slate-700 text-right border-0 w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow 
                    key={member.id} 
                    className="hover:bg-slate-50/50 transition-colors group border-0"
                    style={{
                      borderBottom: index === members.length - 1 ? 'none' : '1px solid rgb(241 245 249)'
                    }}
                  >
                    <TableCell className="border-0">
                      <div className="text-sm font-extralight text-slate-500 tabular-nums">
                        {getSerialNumber(index)}
                      </div>
                    </TableCell>
                    
                    <TableCell className="border-0">
                      {editingId === member.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="max-w-[200px] border-slate-200 focus:border-blue-300 font-extralight"
                          disabled={isPending}
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="font-extralight text-slate-900 group-hover:text-blue-600 transition-colors">
                            {member.name}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="border-0">
                      {editingId === member.id ? (
                        <Input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="max-w-[240px] border-slate-200 focus:border-blue-300 font-extralight"
                          disabled={isPending}
                        />
                      ) : (
                        <div className="font-extralight text-slate-600">{member.email}</div>
                      )}
                    </TableCell>
                    
                    <TableCell className="border-0">
                      {editingId === member.id ? (
                        <Select
                          value={editForm.sentiment}
                          onValueChange={(value) => setEditForm({ ...editForm, sentiment: value as Sentiment })}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-[140px] border-slate-200 focus:border-blue-300 font-extralight">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Sentiment.HAPPY} className="font-extralight">
                              <div className="flex items-center gap-2">
                                <span>😊</span>
                                <span>Happy</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={Sentiment.NEUTRAL} className="font-extralight">
                              <div className="flex items-center gap-2">
                                <span>😐</span>
                                <span>Neutral</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={Sentiment.SAD} className="font-extralight">
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
                    
                    <TableCell className="border-0">
                      <div className="text-sm font-extralight text-slate-500">
                        {new Date(member.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right border-0">
                      {editingId === member.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(member.id)}
                            disabled={isPending}
                            className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700"
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
                            className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              disabled={isPending}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleEdit(member)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                              <span>Edit Member</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(member.id, member.name)}
                              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remove Member</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4">
              <div className="text-sm font-extralight text-slate-500">
                Showing {((currentPage - 1) * MEMBERS_PER_PAGE) + 1} to {Math.min(currentPage * MEMBERS_PER_PAGE, totalMembers)} of {totalMembers} members
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isSearching}
                  className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50"
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
                        className={`h-8 w-8 p-0 font-extralight ${
                          currentPage === page 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
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
                  className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        // No search results state
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
          <CardContent className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-extralight text-slate-900 mb-2">No members found</h3>
            <p className="text-sm font-extralight text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              No members found matching "{searchTerm}"
            </p>
            <Button 
              variant="outline" 
              onClick={clearSearch}
              className="border-slate-200 hover:bg-slate-50 font-extralight"
            >
              Clear search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}