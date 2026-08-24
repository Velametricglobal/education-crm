import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrmProvider } from './context/CrmContext';
import { CmsProvider } from './context/CmsContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

import { Dashboard } from './components/crm/Dashboard';
import { LeadList } from './components/crm/LeadList';
import { DailyWorkspace } from './components/crm/DailyWorkspace';
import { FollowUpsList } from './components/crm/FollowUpsList';
import { StaffPerformance } from './components/crm/StaffPerformance';
import { CourseManagement } from './components/crm/CourseManagement';
import { UniversityManagement } from './components/crm/UniversityManagement';
import { ApplicationManagement } from './components/crm/ApplicationManagement';
import { StudentManagement } from './components/crm/StudentManagement';
import { FeeManagement } from './components/crm/FeeManagement';
import { CommunicationCenter } from './components/crm/CommunicationCenter';
import { MarketingCampaigns } from './components/crm/MarketingCampaigns';
import { ReportsAnalytics } from './components/crm/ReportsAnalytics';
import { SystemSettings } from './components/crm/SystemSettings';

import { HomepageBuilder } from './components/cms/HomepageBuilder';
import { PublicHomepage } from './pages/PublicHomepage';
import { StudentPortal } from './pages/StudentPortal';
import { Login } from './pages/Login';

export function AppContent() {
  const { currentUser, isAuthenticated, userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. If not authenticated, show dedicated Login screen
  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={(defaultTab) => {
          setActiveTab(defaultTab || 'dashboard');
        }}
      />
    );
  }

  // 2. Strict Student Role Security: Student accounts ONLY see their own Student Portal and have ZERO access to CRM
  const isStudentRole = currentUser?.role === userRoles.STUDENT || currentUser?.role === 'Student';
  if (isStudentRole) {
    return <StudentPortal onBackToApp={() => {}} />;
  }

  // 3. Direct public homepage view for staff
  if (activeTab === 'public_homepage') {
    return (
      <PublicHomepage
        onSwitchToCrm={() => setActiveTab('dashboard')}
        onSwitchToStudentPortal={() => setActiveTab('student_portal')}
      />
    );
  }

  // 4. Direct student portal view for staff preview
  if (activeTab === 'student_portal') {
    return <StudentPortal onBackToApp={() => setActiveTab('dashboard')} />;
  }

  // 5. No-code homepage CMS builder for staff
  if (activeTab === 'cms_builder') {
    return (
      <div className="p-2 sm:p-4 bg-slate-950 min-h-screen">
        <HomepageBuilder onExitCMS={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  // 6. CRM Administrative & Operational Workspace Layout (Staff only)
  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800 pb-16 lg:pb-0">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 lg:ml-64 p-3 sm:p-6 overflow-x-hidden min-h-[calc(100vh-80px)]">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'leads' && <LeadList />}
          {activeTab === 'my_workspace' && <DailyWorkspace />}
          {activeTab === 'followups' && <FollowUpsList />}
          {activeTab === 'staff_performance' && <StaffPerformance />}
          {activeTab === 'courses' && <CourseManagement />}
          {activeTab === 'universities' && <UniversityManagement />}
          {activeTab === 'applications' && <ApplicationManagement />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'fees' && <FeeManagement />}
          {activeTab === 'communication' && <CommunicationCenter />}
          {activeTab === 'campaigns' && <MarketingCampaigns />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'settings' && <SystemSettings />}
        </main>
      </div>

      {/* Smartphone Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CrmProvider>
        <CmsProvider>
          <AppContent />
        </CmsProvider>
      </CrmProvider>
    </AuthProvider>
  );
}
