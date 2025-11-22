'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useDonationStore } from '@/store/donationStore';

export default function AllDonationsPage() {
  const { donations, meta, isLoading, fetchDonations } = useDonationStore();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by search query
  const filteredDonations = donations.filter(donation => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      donation.userFullName.toLowerCase().includes(query) ||
      donation.userEmail.toLowerCase().includes(query) ||
      donation.id.toLowerCase().includes(query) ||
      donation.volunteerName.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchDonations(page, 10);
  }, [fetchDonations, page]);

  const handlePageChange = (newPage: number) => {
    // If meta is null (no pagination from API), handle locally or just disable
    if (meta) {
        if (newPage >= 1 && newPage <= meta.totalPages) {
            setPage(newPage);
        }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDonationType = (type: string) => {
    switch (type) {
      case 'ONE_TIME':
        return 'One time';
      case 'MONTHLY':
        return 'Monthly';
      default:
        return type;
    }
  };

  // Helper to format ID to match image style (if desired, or just show full)
  // Image shows "M1672878". Our IDs are UUIDs. I'll show first 8 chars for brevity or full if space allows.
  // I will show full ID but maybe truncated if too long.
  const formatId = (id: string) => {
      return id.substring(0, 8).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">All Donations</h1>
          <span className="px-3 py-1 bg-[#FDB022] text-black text-xs font-semibold rounded-full">
            {donations.length.toLocaleString()}
          </span>
        </div>
        <p className="text-gray-500">Review all the donations on Street Cause.</p>
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
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Donation ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Donor Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">Donation Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-900">City</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 text-sm text-gray-500">{formatId(donation.id)}</td>
                    <td className="px-6 py-5 text-sm text-gray-900 font-medium">{donation.userFullName}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{formatCurrency(donation.amount)}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{formatDonationType(donation.subscriptionType)}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">Hyderabad</td>
                  </tr>
                ))}
                {filteredDonations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {searchQuery ? 'No donations found matching your search.' : 'No donations found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {meta ? (
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
            ) : (
             // Fallback pagination if no meta (showing simple prev/next if needed, or just showing count)
             <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Showing {filteredDonations.length} entries
                </span>
             </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

