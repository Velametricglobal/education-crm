import React from 'react';
import {
  Home,
  UserSearch,
  CheckCircle2,
  GraduationCap,
  Menu
} from 'lucide-react';

export const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'leads', label: 'Leads', icon: UserSearch },
    { id: 'my_workspace', label: 'Tasks', icon: CheckCircle2 },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'public_homepage', label: 'Website', icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface-container-lowest border-t border-outline-variant/40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)] rounded-t-xl">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-95 font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-primary font-medium py-1 px-2'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-on-primary-container' : 'text-outline'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
