'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ComingSoon from '@/components/ComingSoon';

export default function ApprovalsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvals & Governance</h1>
          <p className="text-gray-500 mt-1">Manage approvals and governance settings</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
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
      <ComingSoon />
    </div>
  );
}

