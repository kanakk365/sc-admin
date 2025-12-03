'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import { useVolunteerStore } from '@/store/volunteerStore';
import { useRouter } from 'next/navigation';

export default function VolunteerDirectoryPage() {
  const { volunteers, meta, isLoading, fetchVolunteers } = useVolunteerStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Suspended' | 'Frozen'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter to show only non-PENDING volunteers (APPROVED or REJECTED)
  const directoryVolunteers = volunteers.filter(v => 
    v.profileStatus === 'APPROVED' || v.profileStatus === 'REJECTED' || v.profileStatus === 'SUSPENDED' || v.profileStatus === 'FROZEN'
  );

  // Filter by Tab
  const tabFilteredVolunteers = directoryVolunteers.filter(v => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return v.profileStatus === 'APPROVED';
    if (activeTab === 'Suspended') return v.profileStatus === 'SUSPENDED'; // Assuming SUSPENDED status exists or will exist
    if (activeTab === 'Frozen') return v.profileStatus === 'REJECTED' || v.profileStatus === 'FROZEN'; // Mapping REJECTED to Frozen for now as per red color
    return true;
  });

  // Filter by search query
  const filteredVolunteers = tabFilteredVolunteers.filter(volunteer => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} , ${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-[#12B76A]'; // Green
      case 'SUSPENDED':
        return 'bg-[#F79009]'; // Orange
      case 'REJECTED':
      case 'FROZEN':
        return 'bg-[#F04438]'; // Red
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Active';
      case 'SUSPENDED':
        return 'Suspended';
      case 'REJECTED':
        return 'Frozen'; // Mapping REJECTED to Frozen label to match UI if that's the intent, or keep as Rejected
      case 'FROZEN':
        return 'Frozen';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Volunteer Directory</h1>
        <p className="text-gray-500">Search, filter, and manage all registered volunteers.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('All')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'All' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Volunteers <span className="ml-1 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{directoryVolunteers.length.toLocaleString()}</span>
            {activeTab === 'All' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700 rounded-t-md" />}
          </button>
          <button
            onClick={() => setActiveTab('Active')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'Active' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
            {activeTab === 'Active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700 rounded-t-md" />}
          </button>
          <button
            onClick={() => setActiveTab('Suspended')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'Suspended' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Suspended
            {activeTab === 'Suspended' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700 rounded-t-md" />}
          </button>
          <button
            onClick={() => setActiveTab('Frozen')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'Frozen' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Frozen
            {activeTab === 'Frozen' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700 rounded-t-md" />}
          </button>
        </div>
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
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">SC ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">City / Division</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Role Applied</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Date Joined</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">{volunteer.fullName}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">SC ID {volunteer.registrationCode}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{volunteer.city} - {volunteer.division}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{volunteer.role}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{formatDate(volunteer.createdAt)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(volunteer.profileStatus)}`}></div>
                        <span className="text-sm text-gray-700">{getStatusLabel(volunteer.profileStatus)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => router.push(`/dashboard/volunteers/directory/${volunteer.id}`)}
                        className="p-2 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredVolunteers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      {searchQuery ? 'No volunteers found matching your search.' : 'No volunteers found in this category.'}
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

