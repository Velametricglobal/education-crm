import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, AlertTriangle, CheckCircle2, User, PhoneCall, MessageCircle, RefreshCw } from 'lucide-react';

export const FollowUpsList = () => {
  const { followups, leads, completeFollowup, assignLead } = useCrm();
  const { currentUser } = useAuth();

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'overdue' | 'completed'

  const filteredFollowups = followups.filter(f => {
    const isOverdue = f.status === 'Overdue' || (f.status === 'Pending' && new Date(f.dueDate) < new Date());
    if (filterTab === 'pending') return f.status === 'Pending' && !isOverdue;
    if (filterTab === 'overdue') return isOverdue;
    if (filterTab === 'completed') return f.status === 'Completed';
    return true;
  });

  const overdueCount = followups.filter(f => f.status === 'Overdue' || (f.status === 'Pending' && new Date(f.dueDate) < new Date())).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Follow-Up & Task Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage scheduled calls, counselling appointments, fee reminders, and manager re-assignments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
          >
            All ({followups.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'pending' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterTab('overdue')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${filterTab === 'overdue' ? 'bg-red-500 text-white shadow-xs' : 'text-red-600'}`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Overdue Manager Panel Alert */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs text-red-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Manager Action Required: {overdueCount} Overdue Follow-ups</p>
              <p className="text-red-700 mt-0.5">Prospects have missed scheduled contact deadlines. Reassign to active counsellors or escalate immediately.</p>
            </div>
          </div>

          {currentUser.role.includes('Admin') && (
            <button
              onClick={() => alert("Reassigning overdue follow-ups equally across active counsellors...")}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Auto-Reassign Overdue
            </button>
          )}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Task Type</th>
                <th className="p-3">Prospect Name</th>
                <th className="p-3">Counsellor</th>
                <th className="p-3">Scheduled Due</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Notes & Agenda</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFollowups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No follow-up tasks match current view.
                  </td>
                </tr>
              ) : (
                filteredFollowups.map(flp => {
                  const isOverdue = flp.status === 'Overdue' || (flp.status === 'Pending' && new Date(flp.dueDate) < new Date());
                  const leadObj = leads.find(l => l.id === flp.leadId);

                  return (
                    <tr key={flp.id} className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50/20' : ''}`}>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          flp.type === 'Call' ? 'bg-blue-100 text-blue-800' :
                          flp.type === 'WhatsApp' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {flp.type}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900">
                        {flp.leadName}
                        <p className="text-[10px] text-slate-400 font-normal">{flp.leadId}</p>
                      </td>
                      <td className="p-3 font-bold text-slate-700">
                        {flp.counsellorName}
                      </td>
                      <td className={`p-3 font-bold ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
                        {flp.dueDate}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          flp.priority === 'High' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {flp.priority}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {flp.notes}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          flp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          isOverdue ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {flp.status === 'Completed' ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`tel:${leadObj?.mobile || '+919876543210'}`}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Call"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${(leadObj?.whatsapp || '919876543210').replace(/\D/g,'')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          {flp.status !== 'Completed' && (
                            <button
                              onClick={() => completeFollowup(flp.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold rounded-lg transition-colors"
                            >
                              ✓ Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
