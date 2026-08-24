import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCrm } from '../../context/CrmContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  FileCheck,
  GraduationCap,
  CreditCard,
  BookOpen,
  Building2,
  BarChart3,
  MessageSquare,
  Megaphone,
  PieChart,
  Globe,
  Settings,
  UserPlus,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, activeTab, setActiveTab, onCloseMobile }) => {
  const { currentUser, hasPermission } = useAuth();
  const { leads, followups } = useCrm();

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const overdueFollowupsCount = followups.filter(f => f.status === 'Overdue' || (f.status === 'Pending' && new Date(f.dueDate) < new Date())).length;

  const navGroups = [
    {
      title: "Core Operations",
      items: [
        { id: "dashboard", label: "Consultant Dashboard", icon: LayoutDashboard, perm: "view_leads" },
        { id: "leads", label: "My Priority Leads", icon: Users, badge: newLeadsCount > 0 ? `${newLeadsCount} New` : null, badgeColor: "bg-primary text-white", perm: "view_leads" },
        { id: "my_workspace", label: "Daily Work Queue", icon: CheckSquare, perm: "view_leads" },
        { id: "followups", label: "Follow-ups & Tasks", icon: Clock, badge: overdueFollowupsCount > 0 ? `${overdueFollowupsCount} Due` : null, badgeColor: "bg-error text-white", perm: "schedule_followup" },
      ]
    },
    {
      title: "Admissions & Finance",
      items: [
        { id: "applications", label: "Applications Pipeline", icon: FileCheck, perm: "create_application" },
        { id: "students", label: "Enrolled Students", icon: GraduationCap, perm: "view_students" },
        { id: "fees", label: "Fee & Payment Ledger", icon: CreditCard, perm: "manage_fees" },
      ]
    },
    {
      title: "Academic Catalog",
      items: [
        { id: "courses", label: "Course Catalog", icon: BookOpen, perm: "view_courses" },
        { id: "universities", label: "Universities (DEB)", icon: Building2, perm: "view_universities" },
      ]
    },
    {
      title: "Analytics & System",
      items: [
        { id: "staff_performance", label: "Staff Performance", icon: BarChart3, perm: "view_reports" },
        { id: "communication", label: "Communication Hub", icon: MessageSquare, perm: "call_whatsapp" },
        { id: "campaigns", label: "Campaigns & Marketing", icon: Megaphone, perm: "view_reports" },
        { id: "reports", label: "Executive Reports", icon: PieChart, perm: "view_reports" },
        { id: "cms_builder", label: "Website No-Code CMS", icon: Globe, perm: "view_reports" },
        { id: "settings", label: "System Settings", icon: Settings, perm: "system_security" },
      ]
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside className={`fixed top-[88px] bottom-0 left-0 z-40 w-[280px] bg-surface dark:bg-surface-container-low border-r border-outline-variant/50 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between shadow-xl`}>
        
        {/* Stitch User Header */}
        <div className="p-4 border-b border-outline-variant/40 bg-surface-container-lowest/50">
          <div className="flex items-center gap-3 w-full mb-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-primary/20 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-sm text-primary leading-tight truncate">{currentUser.name}</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5 truncate">{currentUser.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-outline px-2 py-0.5 bg-surface-container-high rounded-full">
              v2.4.0 • EduConsult Pro
            </span>
            <span className="text-[10px] font-bold text-tertiary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> Active
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-4">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const allowed = hasPermission(item.perm);

                  if (!allowed) return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-surface-container-high text-primary font-bold shadow-xs translate-x-1'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-outline'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-primary text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/40 m-2 rounded-xl">
          <button
            onClick={() => handleNavClick('leads')}
            className="w-full py-2 bg-primary text-on-primary font-bold text-xs rounded-lg shadow-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" /> + Add Quick Lead
          </button>
        </div>
      </aside>
    </>
  );
};
