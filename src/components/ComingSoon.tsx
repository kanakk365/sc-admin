'use client';

import React from 'react';
import { Clock } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Coming Soon</h1>
        <p className="text-gray-500 text-lg max-w-md">
          We're working hard to bring you this feature. Please check back later.
        </p>
      </div>
    </div>
  );
}
