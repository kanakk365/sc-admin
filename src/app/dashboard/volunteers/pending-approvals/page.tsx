'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function PendingApprovalsPage() {
  const { volunteers, meta, isLoading, fetchVolunteers, updateVolunteerStatus } = useVolunteerStore();
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter to show only PENDING volunteers
  const pendingVolunteers = volunteers.filter(v => v.profileStatus === 'PENDING');

  // Filter by search query
  const filteredVolunteers = pendingVolunteers.filter(volunteer => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      volunteer.fullName.toLowerCase().includes(query) ||
      volunteer.phoneNumber.toLowerCase().includes(query) ||
      volunteer.city.toLowerCase().includes(query) ||
      volunteer.division.toLowerCase().includes(query) ||
      volunteer.role.toLowerCase().includes(query) ||
      volunteer.registrationCode.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchVolunteers(page, 10);
  }, [fetchVolunteers, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    const success = await updateVolunteerStatus(id, status);
    setProcessingId(null);
    
    if (success) {
      // Refresh the list to get updated data
      await fetchVolunteers(page, 10);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <span className="px-3 py-1 bg-[#FDB022] text-black text-xs font-semibold rounded-full">
            {searchQuery ? filteredVolunteers.length : pendingVolunteers.length} Pending
          </span>
        </div>
        <p className="text-gray-500">Review and approve new volunteer registrations</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1"></div> 
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter size={16} />
                Filters
            </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-[#EAEBF0] text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Phone no.</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">City / Division</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Role Applied</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 text-sm text-gray-500">{volunteer.fullName}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{volunteer.phoneNumber}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{volunteer.city} - {volunteer.division}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{volunteer.role}</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(volunteer.id, 'APPROVED')}
                          disabled={processingId === volunteer.id}
                          className="px-4 py-1.5 bg-[#10B981] text-white text-sm font-medium rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === volunteer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin inline" />
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(volunteer.id, 'REJECTED')}
                          disabled={processingId === volunteer.id}
                          className="px-4 py-1.5 bg-[#DC2626] text-white text-sm font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === volunteer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin inline" />
                          ) : (
                            'Reject'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVolunteers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {searchQuery ? 'No volunteers found matching your search.' : 'No pending approvals found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {meta && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.totalItems)} of {meta.totalItems}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === meta.totalPages}
                    className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
