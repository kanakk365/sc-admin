'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Globe,
  MapPin,
  Link as LinkIcon,
  HeartHandshake,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

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
  { 
    icon: Wallet, 
    label: 'Donation Management', 
    href: '/dashboard/donations', 
    subItems: [
      { label: 'All Donations', href: '/dashboard/donations', icon: Wallet },
      { label: 'Volunteer-wise Donations', href: '/dashboard/donations/volunteer-wise', icon: HeartHandshake },
      { label: 'City-wise Reports', href: '/dashboard/donations/city-wise', icon: MapPin },
      { label: 'Link / Unlink Donations', href: '/dashboard/donations/link-unlink', icon: LinkIcon },
    ]
  },
  { icon: Calendar, label: 'Event management', href: '/dashboard/events' },
  { icon: FileCheck, label: 'Approvals & Governance', href: '/dashboard/approvals' },
  { icon: BarChart3, label: 'Reports & Analytics', href: '/dashboard/reports' },
  { icon: Lock, label: 'Security & Settings', href: '/dashboard/settings' },
  { icon: Sliders, label: 'Website controls', href: '/dashboard/controls' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const { clearAuth } = useAuthStore();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Volunteer Management');
  const [showLogoutPopover, setShowLogoutPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowLogoutPopover(false);
      }
    };

    if (showLogoutPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutPopover]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

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
        <div className="flex items-center mb-10">
          <Image
            src="/logo.png"
            alt="Street Cause Logo"
            width={150}
            height={60}
            className="object-contain"
            priority
          />
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

      <div className="p-6 border-t border-white/10 relative">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors"
          onClick={() => setShowLogoutPopover(!showLogoutPopover)}
        >
          <div className="w-10 h-10 rounded-full bg-white text-purple-900 flex items-center justify-center text-lg font-bold">
            {email ? email.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs text-gray-300">Welcome 👋</div>
            <div className="font-medium truncate">Welcome</div>
          </div>
          <svg className="ml-auto w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {showLogoutPopover && (
          <div 
            ref={popoverRef}
            className="absolute bottom-20 left-6 right-6 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={18} className="text-red-600" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
