import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Clock, PhoneCall, MessageCircle, AlertCircle, ArrowRight, CheckCircle2, Flame, User } from 'lucide-react';

export const DailyWorkspace = () => {
  const { currentUser } = useAuth();
  const { leads, followups, completeFollowup, updateLeadStatus } = useCrm();

  // Filter tasks assigned to current logged in user (or all if super admin)
  const myFollowups = followups.filter(f => f.counsellorId === currentUser.id || currentUser.role.includes('Admin'));
  const pendingTasks = myFollowups.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const completedToday = myFollowups.filter(f => f.status === 'Completed').length;

  // Automated priority queue sorting: Overdue first -> Hot leads -> High priority followups
  const sortedQueue = [...pendingTasks].sort((a, b) => {
    const isAOverdue = new Date(a.dueDate) < new Date();
    const isBOverdue = new Date(b.dueDate) < new Date();
    if (isAOverdue && !isBOverdue) return -1;
    if (!isAOverdue && isBOverdue) return 1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Daily Counsellor Desk
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            My Work Queue — {currentUser.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Smart automated task queue prioritized by follow-up deadlines, hot prospect activity, and overdue calls.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="text-center px-3 border-r border-slate-200">
            <p className="text-xs text-slate-500 font-semibold">Pending Queue</p>
            <p className="text-xl font-extrabold text-slate-900">{pendingTasks.length}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-xs text-slate-500 font-semibold">Completed Today</p>
            <p className="text-xl font-extrabold text-emerald-600">{completedToday}</p>
          </div>
        </div>
      </div>

      {/* Main Task List Queue */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-600" /> Action Items ({sortedQueue.length})
        </h3>

        {sortedQueue.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">All Caught Up!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no pending follow-up tasks or overdue calls for today. Great job maintaining zero overdue enquiries!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedQueue.map(task => {
              const leadObj = leads.find(l => l.id === task.leadId);
              const isOverdue = new Date(task.dueDate) < new Date();

              return (
                <div
                  key={task.id}
                  className={`bg-white p-4 rounded-2xl border transition-all shadow-xs flex flex-wrap items-center justify-between gap-4 ${
                    isOverdue ? 'border-red-300 bg-red-50/20' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isOverdue ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isOverdue ? 'OVERDUE' : task.type}
                      </span>

                      {leadObj?.priority === 'hot' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-red-500" /> HOT PROSPECT
                        </span>
                      )}

                      <h4 className="font-extrabold text-slate-900 text-sm">{task.leadName}</h4>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      🎯 {leadObj?.preferredCourse || 'Distance Education Enquiry'} ({leadObj?.preferredUniversity || 'University'})
                    </p>

                    <p className="text-xs text-slate-500">{task.notes}</p>

                    <p className="text-[11px] text-slate-400 font-medium">
                      Scheduled Due: <span className="font-semibold text-slate-700">{task.dueDate}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${leadObj?.mobile || '+919876543210'}`}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Now
                    </a>

                    <a
                      href={`https://wa.me/${(leadObj?.whatsapp || '919876543210').replace(/\D/g,'')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>

                    <button
                      onClick={() => completeFollowup(task.id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Complete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
