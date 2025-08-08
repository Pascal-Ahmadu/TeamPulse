'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users
  },
  {
    name: 'Sentiment Trends',
    href: '/sentiment-trends',
    icon: TrendingUp
  },
  {
    name: 'Admin Settings',
    href: '/admin-settings',
    icon: Settings
  }
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle responsiveness with proper cleanup
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const shouldCollapse = window.innerWidth < 1024 && window.innerWidth >= 768;
      
      setIsMobile(mobile);
      
      // Only auto-collapse on desktop breakpoint changes
      if (!mobile) {
        setIsCollapsed(shouldCollapse);
        setMobileOpen(false); // Close mobile menu when switching to desktop
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, mobileOpen]);

  // Handle sidebar toggle with proper state management
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => !prev);
    }
  }, [isMobile]);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-slate-600" />
            ) : (
              <Menu className="h-5 w-5 text-slate-600" />
            )}
          </Button>
        </div>
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed h-full bg-white/90 backdrop-blur-sm border-r border-blue-100/80 shadow-xl z-40 transition-all duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          // Desktop width handling
          !isMobile && (isCollapsed ? "w-20" : "w-64"),
          // Mobile handling
          isMobile && (
            mobileOpen 
              ? "translate-x-0 w-64" 
              : "-translate-x-full w-64"
          )
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex h-16 items-center border-b border-blue-100/80",
            isCollapsed && !isMobile ? "justify-center px-2" : "px-6"
          )}>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              {(!isCollapsed || isMobile) && (
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 tracking-tight">TeamPulse</h1>
                  <p className="text-xs font-medium text-slate-500">Enterprise Analytics</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={isMobile ? closeMobileMenu : undefined}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                  )}
                  title={(isCollapsed && !isMobile) ? item.name : undefined}
                >
                  <div className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-200',
                    'h-8 w-8',
                    isActive
                      ? 'bg-white/20'
                      : 'bg-slate-100 group-hover:bg-blue-100',
                    (isCollapsed && !isMobile) ? 'mx-auto' : 'mr-3'
                  )}>
                    <Icon className={cn(
                      'h-4 w-4 transition-colors duration-200',
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                    )} />
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <span className="tracking-tight truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Collapse Button - Desktop Only */}
          {!isMobile && (
            <div className="p-3 border-t border-blue-100/80">
              <Button
                variant="ghost"
                className={cn(
                  "group w-full text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-xl py-3 h-auto transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start px-3"
                )}
                onClick={toggleSidebar}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-all duration-200",
                  isCollapsed ? "mx-auto" : "mr-3"
                )}>
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
                  ) : (
                    <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="tracking-tight">Collapse</span>
                )}
              </Button>
            </div>
          )}

          {/* Logout */}
          <div className="p-3 border-t border-blue-100/80">
            <Button
              variant="ghost"
              className={cn(
                "group w-full text-slate-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-xl py-3 h-auto transition-all duration-200",
                (isCollapsed && !isMobile) ? "justify-center px-2" : "justify-start px-3"
              )}
              onClick={onLogout}
              title={(isCollapsed && !isMobile) ? "Logout" : undefined}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 transition-all duration-200",
                (isCollapsed && !isMobile) ? "mx-auto" : "mr-3"
              )}>
                <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-600" />
              </div>
              {(!isCollapsed || isMobile) && (
                <span className="tracking-tight">Logout</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}