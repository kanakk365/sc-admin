'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Calendar, 
  FileCheck, 
  BarChart3, 
  Lock, 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Book,
  UserCog,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { 
    icon: Users, 
    label: 'Volunteer Management', 
    href: '/dashboard/volunteers', 
    subItems: [
      { label: 'Pending Approvals', href: '/dashboard/volunteers/pending-approvals', icon: AlertCircle },
      { label: 'Volunteer Directory', href: '/dashboard/volunteers/directory', icon: Book },
      { label: 'Role Management', href: '/dashboard/volunteers/roles', icon: UserCog },
      { label: 'City & Affiliation Management', href: '/dashboard/volunteers/cities', icon: Globe },
    ]
  },
  { icon: Wallet, label: 'Donation Management', href: '/dashboard/donations', subItems: [] }, // Added empty array to show chevron if needed or just boolean
  { icon: Calendar, label: 'Event management', href: '/dashboard/events' },
  { icon: FileCheck, label: 'Approvals & Governance', href: '/dashboard/approvals' },
  { icon: BarChart3, label: 'Reports & Analytics', href: '/dashboard/reports' },
  { icon: Lock, label: 'Security & Settings', href: '/dashboard/settings' },
  { icon: Sliders, label: 'Website controls', href: '/dashboard/controls' },
];

export default function Sidebar() {
  const pathname = usePathname();
  // Initialize with Volunteer Management expanded for this demo context or based on path
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Volunteer Management');

  const toggleMenu = (label: string) => {
    if (expandedMenu === label) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(label);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="w-72 text-white flex flex-col h-screen shrink-0 sticky top-0" style={{ background: 'linear-gradient(180deg, #3D007B 0%, #290959 100%)' }}>
      <div className="p-6 flex-1 overflow-y-auto sidebar-scroll">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 text-white">
             {/* Simple Hand Icon Placeholder */}
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
               <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
               <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
               <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
             </svg>
          </div>
          <div>
            <div className="font-bold text-lg leading-none">Street<br/>Cause</div>
            <div className="text-[10px] text-gray-300 font-normal tracking-widest">WE CARE</div>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = !item.subItems && isLinkActive(item.href);
            const isExpanded = expandedMenu === item.label;

            return (
              <div key={index}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`}
                  onClick={() => item.subItems ? toggleMenu(item.label) : null}
                >
                  {!item.subItems ? (
                    <Link href={item.href} className="flex items-center gap-3 flex-1">
                       <item.icon size={20} className="opacity-80" />
                       <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <item.icon size={20} className="opacity-80" />
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {item.subItems && (
                        isExpanded ? <ChevronUp size={16} className="opacity-60" /> : <ChevronDown size={16} className="opacity-60" />
                      )}
                    </>
                  )}
                </div>
                
                {/* Submenu */}
                {item.subItems && isExpanded && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.subItems.map((subItem, subIndex) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/10 ${isSubActive ? 'bg-white/20' : ''}`}
                        >
                          <subItem.icon size={18} className="opacity-80" />
                          <span className="text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white text-purple-900 flex items-center justify-center text-lg font-bold">
            A
          </div>
          <div className="overflow-hidden">
            <div className="text-xs text-gray-300">Welcome 👋</div>
            <div className="font-medium truncate">Aleena</div>
          </div>
           <svg className="ml-auto w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
           </svg>
        </div>
      </div>
    </aside>
  );
}
