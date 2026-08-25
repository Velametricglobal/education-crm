import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCrm } from '../../context/CrmContext';
import { NotificationBell } from '../common/NotificationBell';
import { Search, Globe, ExternalLink, Menu, GraduationCap, X, LogOut } from 'lucide-react';

export const Navbar = ({ onToggleSidebar, activeTab, setActiveTab, onGlobalSearchSelect }) => {
  const { currentUser, logout } = useAuth();
  const { settings, leads, students, courses, updateSettings } = useCrm();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Instant global search matcher
  const searchResults = searchQuery.trim().length > 1 ? [
    ...leads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.mobile.includes(searchQuery) || l.id.toLowerCase().includes(searchQuery.toLowerCase())).map(l => ({ ...l, type: 'Lead' })),
    ...students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.mobile.includes(searchQuery) || s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase())).map(s => ({ ...s, type: 'Student' })),
    ...courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ ...c, type: 'Course' }))
  ].slice(0, 6) : [];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-3 md:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu & Customized Agency Brand Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden active:scale-95 transition-transform"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('public_homepage')}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Go to Public Website Homepage"
          >
            {settings.logoUrl && !logoError ? (
              <img
                src={settings.logoUrl}
                alt={settings.agencyName}
                onError={() => setLogoError(true)}
                className="object-contain transition-transform group-hover:scale-105"
                style={{
                  width: settings.logoWidth ? `${settings.logoWidth}px` : 'auto',
                  height: settings.logoHeight ? `${settings.logoHeight}px` : '36px',
                  maxHeight: '48px'
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
            )}

            <div className="hidden sm:block">
              <h1 className="font-extrabold text-xs sm:text-base leading-none text-slate-900 tracking-tight flex items-center gap-1.5">
                {settings.agencyName}
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">
                {settings.currentSession} • CRM
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop + Expandable Mobile) */}
        <div className={`relative flex-1 max-w-md ${isMobileSearchExpanded ? 'absolute inset-x-2 top-2 z-50 bg-white p-2 rounded-2xl shadow-xl' : 'hidden md:block'}`}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, students, phone #, enrollment #..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
            {(searchQuery || isMobileSearchExpanded) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsMobileSearchExpanded(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Overlay Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)}></div>
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setIsMobileSearchExpanded(false);
                      setSearchQuery('');
                      if (onGlobalSearchSelect) onGlobalSearchSelect(item);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'Lead' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'Student' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.mobile || item.enrollmentNo || item.category || ''} {item.preferredCourse || item.courseName || ''}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-bold">View →</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Actions, Notifications, User Profile & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Icon Trigger */}
          <button
            onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => updateSettings({ language: settings.language === 'en' ? 'hi' : 'en' })}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{settings.language === 'en' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Public Website / Home Button */}
          <button
            onClick={() => setActiveTab('public_homepage')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            title="Go to Public Website Home"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Website Home</span>
          </button>

          <NotificationBell />

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-extrabold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-blue-600">{currentUser.role}</p>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Sign Out to Login Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
