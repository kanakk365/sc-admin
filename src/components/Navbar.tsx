import React from 'react';
import { Search, Bell, ChevronLeft } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 text-white shrink-0" style={{ background: 'linear-gradient(180deg, #3D007B 0%, #290959 100%)' }}>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-white text-purple-900 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-white text-gray-900 text-sm focus:outline-none placeholder:text-gray-500"
          />
        </div>
        
        <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-10 h-10 rounded-full bg-white text-purple-900 flex items-center justify-center font-bold text-lg cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}

