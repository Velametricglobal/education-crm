import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Bell, CheckCircle2, User, CreditCard, FileText } from 'lucide-react';

export const NotificationBell = () => {
  const { notifications, markNotificationRead } = useCrm();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'lead': return <User className="w-4 h-4 text-blue-500" />;
      case 'payment': case 'fee': return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'application': case 'admission': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 p-2 bg-slate-100 rounded-lg">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 py-1 px-3"
              >
                Close Panel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
