import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ChevronRight } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole, sampleUsers } = useAuth();

  return (
    <div className="bg-slate-950 text-slate-200 px-3 py-2 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="p-1 bg-amber-500/20 text-amber-400 rounded-md font-bold text-[11px] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Demo RBAC Switcher
          </span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Switch perspective to test counsellor, accountant, or admin features:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {sampleUsers.map(user => {
            const isActive = currentUser.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => switchRole(user.id)}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-semibold flex items-center gap-1.5 shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-normal">({user.role.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
