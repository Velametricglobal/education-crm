import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Clock,
  Flame,
  FileText,
  Award,
  GraduationCap,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  Filter,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Calendar,
  MoreVertical
} from 'lucide-react';

export const Dashboard = ({ setActiveTab, onSelectLead }) => {
  const { currentUser } = useAuth();
  const { leads, followups, applications, students, payments, auditLogs } = useCrm();

  // Metric Computations matching Stitch specs
  const myLeadsCount = leads.length;
  const newLeads7d = leads.filter(l => l.status === 'new').length;
  const followupsTodayCount = followups.filter(f => f.status === 'Pending').length;
  const overdueTasksCount = followups.filter(f => f.status === 'Overdue' || (f.status === 'Pending' && new Date(f.dueDate) < new Date())).length;

  const totalAdmissions = students.length;
  const totalFeesCollected = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const pendingFees = students.reduce((acc, s) => acc + Number(s.remainingFee), 0);

  // Next Best Action Lead (Hot prospect needing call)
  const nextBestLead = leads.find(l => l.priority === 'hot' || l.status === 'interested') || leads[0];

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* 1. Welcome & Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-on-background tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}.
          </h2>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Here is what's happening with your distance education leads and admissions today.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('leads')}
          className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-semibold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98"
        >
          <UserPlus className="w-4 h-4" /> + New Lead
        </button>
      </div>

      {/* 2. Stitch KPI Metrics Cards (4 Grid with Direct Dashboard Section Redirection) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: My Leads -> Redirects to Leads Tab */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-md transition-all border border-outline-variant/30 cursor-pointer group"
          title="Click to view all My Leads"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors">My Leads</span>
            <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors"><Users className="w-4 h-4" /></div>
          </div>
          <div className="font-extrabold text-2xl text-on-background group-hover:text-primary transition-colors">{myLeadsCount}</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-emerald-600 font-semibold">Active Pipeline</p>
            <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>

        {/* Card 2: New Enquiries (7d) -> Redirects to Leads Tab */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-md transition-all border border-outline-variant/30 cursor-pointer group"
          title="Click to view New Enquiries"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-secondary transition-colors">New Enquiries (7d)</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors"><Sparkles className="w-4 h-4" /></div>
          </div>
          <div className="font-extrabold text-2xl text-on-background group-hover:text-secondary transition-colors">{newLeads7d}</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-blue-600 font-semibold">Requires assignment</p>
            <span className="text-[10px] text-secondary font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>

        {/* Card 3: Follow-ups Today -> Redirects to Follow-ups Tab */}
        <div
          onClick={() => setActiveTab('followups')}
          className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] border-l-4 border-tertiary hover:-translate-y-1 hover:shadow-md transition-all border-y border-r border-outline-variant/30 cursor-pointer group"
          title="Click to view Scheduled Follow-ups"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-tertiary transition-colors">Follow-ups Today</span>
            <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg group-hover:bg-tertiary group-hover:text-white transition-colors"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="font-extrabold text-2xl text-on-background group-hover:text-tertiary transition-colors">{followupsTodayCount}</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-tertiary font-semibold">Scheduled calls</p>
            <span className="text-[10px] text-tertiary font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>

        {/* Card 4: Overdue Tasks -> Redirects to Follow-ups & Tasks Tab */}
        <div
          onClick={() => setActiveTab('followups')}
          className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] border-l-4 border-error hover:-translate-y-1 hover:shadow-md transition-all border-y border-r border-outline-variant/30 cursor-pointer group"
          title="Click to view Overdue Tasks"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-error">Overdue Tasks</span>
            <div className="p-2 bg-error/10 text-error rounded-lg group-hover:bg-error group-hover:text-white transition-colors"><AlertCircle className="w-4 h-4" /></div>
          </div>
          <div className="font-extrabold text-2xl text-error">{overdueTasksCount}</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-error font-semibold">Action required</p>
            <span className="text-[10px] text-error font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>
      </div>

      {/* 3. Stitch "Next Best Action" Hero Banner */}
      {nextBestLead && (
        <div className="bg-primary-container rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-on-primary">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary rounded-full opacity-30 blur-3xl pointer-events-none"></div>

          <div className="flex-1 space-y-3 z-10">
            <div className="flex items-center gap-2 text-on-primary-container font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Next Best Action</span>
            </div>

            <h3 className="font-extrabold text-2xl md:text-3xl text-white">
              Call {nextBestLead.name}
            </h3>

            <p className="text-xs md:text-sm text-on-primary-container max-w-xl leading-relaxed font-medium">
              {nextBestLead.name} requested guidance regarding {nextBestLead.preferredCourse} at {nextBestLead.preferredUniversity}. This lead is flagged as <span className="font-extrabold text-white uppercase">{nextBestLead.priority}</span> and requires immediate contact.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${nextBestLead.mobile}`}
                className="bg-white text-primary px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-100 shadow-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" /> Call Now ({nextBestLead.mobile})
              </a>

              <a
                href={`https://wa.me/${nextBestLead.whatsapp.replace(/\D/g,'')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-primary/30 text-white border border-on-primary-container/40 px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-primary/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Chat
              </a>

              <button
                onClick={() => setActiveTab('leads')}
                className="text-white hover:text-amber-200 text-xs font-bold underline ml-2 hidden sm:inline-block"
              >
                View in Leads Directory →
              </button>
            </div>
          </div>

          <div className="hidden md:block w-40 h-40 rounded-full overflow-hidden border-4 border-on-primary-container/30 shrink-0 z-10 shadow-lg cursor-pointer" onClick={() => setActiveTab('leads')}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
              alt="Lead Portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 4. Stitch Data Table: Priority Leads */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] border border-outline-variant/30 overflow-hidden space-y-2">
        <div className="p-4 md:p-6 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h3 className="font-extrabold text-base text-on-background">My Priority Leads</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Assigned distance university enquiries awaiting next action</p>
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
          >
            View All Leads →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-semibold uppercase tracking-wider">
                <th className="p-4">Student Name</th>
                <th className="p-4 hidden md:table-cell">Program Interest</th>
                <th className="p-4">Status</th>
                <th className="p-4 hidden sm:table-cell">Last Contact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-medium text-on-background">
              {leads.slice(0, 5).map(lead => {
                const getStatusBadge = (st) => {
                  if (st === 'interested' || st === 'new') return 'bg-tertiary/10 text-tertiary font-bold';
                  if (st === 'followup_required' || st === 'documents_pending') return 'bg-[#B45309]/10 text-[#B45309] font-bold';
                  if (st === 'converted' || st === 'admission_confirmed') return 'bg-[#047857]/10 text-[#047857] font-bold';
                  return 'bg-surface-container-high text-on-surface-variant font-bold';
                };

                return (
                  <tr key={lead.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="p-4 cursor-pointer" onClick={() => setActiveTab('leads')}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-on-background text-xs hover:text-primary transition-colors">{lead.name}</div>
                          <div className="text-[10px] text-on-surface-variant md:hidden">{lead.preferredCourse}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant hidden md:table-cell font-semibold">
                      {lead.preferredCourse} ({lead.preferredUniversity})
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getStatusBadge(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant hidden sm:table-cell font-medium">
                      {lead.lastContacted}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <a
                          href={`tel:${lead.mobile}`}
                          className="p-1.5 text-primary hover:bg-primary-container/20 rounded-md transition-colors"
                          title="Call"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-secondary hover:bg-secondary-container/30 rounded-md transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
