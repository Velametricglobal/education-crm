import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  TrendingUp,
  Users,
  PhoneCall,
  Award,
  IndianRupee,
  Clock,
  Star,
  UserPlus,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  KeyRound
} from 'lucide-react';

export const StaffPerformance = () => {
  const { leads, students, payments } = useCrm();
  const { usersList, createStaffUser, userRoles, currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Staff User Form State
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: userRoles.COUNSELLOR,
    empCode: `EMP-2026-${Math.floor(100 + Math.random() * 800)}`,
    designation: 'Senior Admissions Counsellor',
    phone: ''
  });

  const counsellors = usersList.filter(u => u.role !== userRoles.STUDENT);

  // Calculate metrics per counsellor
  const performanceData = counsellors.map(counsellor => {
    const assignedLeads = leads.filter(l => l.counsellorId === counsellor.id);
    const contactedLeads = assignedLeads.filter(l => l.status !== 'new');
    const confirmedAdmissions = students.filter(s => s.counsellorId === counsellor.id);
    const totalRevenue = payments.filter(p => {
      const student = students.find(s => s.id === p.studentId);
      return student && student.counsellorId === counsellor.id;
    }).reduce((acc, p) => acc + Number(p.amount), 0);

    const conversionRate = assignedLeads.length > 0
      ? ((confirmedAdmissions.length / assignedLeads.length) * 100).toFixed(1)
      : 0;

    return {
      counsellor,
      leadsAssigned: assignedLeads.length,
      leadsContacted: contactedLeads.length,
      callsMade: assignedLeads.length * 4 + 5,
      admissions: confirmedAdmissions.length,
      revenue: totalRevenue,
      conversionRate: Number(conversionRate),
      avgResponseTime: "14 mins",
      score: confirmedAdmissions.length * 100 + Number(conversionRate) * 10
    };
  }).sort((a, b) => b.score - a.score);

  const handleCreateStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email || !staffForm.password) return;

    createStaffUser(staffForm);

    setToastMsg(`Staff User '${staffForm.name}' created successfully with login password!`);
    setIsModalOpen(false);

    // Reset form
    setStaffForm({
      name: '',
      email: '',
      password: '',
      role: userRoles.COUNSELLOR,
      empCode: `EMP-2026-${Math.floor(100 + Math.random() * 800)}`,
      designation: 'Senior Admissions Counsellor',
      phone: ''
    });

    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Top Header with Create User CTA */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Admin Management & Staff Performance
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Staff Directory & User Password Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create new staff accounts, assign operational roles, set secure login passwords, and track team performance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-98"
        >
          <UserPlus className="w-4 h-4" /> Create New Staff User & Password
        </button>
      </div>

      {/* Top Performers Leaderboard Cards (Podium Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceData.slice(0, 3).map((item, index) => {
          const ranks = [
            { title: "🥇 Top Performer", color: "from-amber-500 to-yellow-600", text: "text-amber-700" },
            { title: "🥈 2nd Rank Counsellor", color: "from-slate-400 to-slate-600", text: "text-slate-700" },
            { title: "🥉 3rd Rank Counsellor", color: "from-amber-700 to-amber-900", text: "text-amber-800" }
          ];
          const rank = ranks[index] || ranks[1];

          return (
            <div key={item.counsellor.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r ${rank.color} text-white shadow-xs`}>
                  {rank.title}
                </span>
                <Trophy className={`w-6 h-6 ${rank.text}`} />
              </div>

              <div className="flex items-center gap-3">
                <img src={item.counsellor.avatar} alt={item.counsellor.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{item.counsellor.name}</h3>
                  <p className="text-xs text-slate-500">{item.counsellor.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Admissions</p>
                  <p className="font-extrabold text-slate-900 text-lg mt-0.5">{item.admissions}</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-emerald-700 font-bold uppercase">Conversion %</p>
                  <p className="font-extrabold text-emerald-700 text-lg mt-0.5">{item.conversionRate}%</p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Revenue Generated:</span>
                <span className="font-extrabold text-slate-900">₹{item.revenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Staff Directory & Credentials Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> Active Staff User Directory & Assigned Roles
          </h3>
          <span className="text-xs font-bold text-slate-500">{usersList.length} Total Registered Users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Staff Name & Avatar</th>
                <th className="p-3">Emp Code</th>
                <th className="p-3">Work Email</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Admissions</th>
                <th className="p-3">Conversion Rate</th>
                <th className="p-3">Revenue Collected</th>
                <th className="p-3">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {performanceData.map((item, idx) => (
                <tr key={item.counsellor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <img src={item.counsellor.avatar} alt={item.counsellor.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{item.counsellor.name}</p>
                      <span className="text-[10px] text-slate-400 font-normal">{item.counsellor.designation || 'Staff Member'}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{item.counsellor.empCode || `EMP-${100 + idx}`}</td>
                  <td className="p-3 text-slate-700 font-mono text-[11px]">{item.counsellor.email}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-extrabold text-[10px]">
                      {item.counsellor.role}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-emerald-700">{item.admissions} students</td>
                  <td className="p-3 font-extrabold text-blue-700">{item.conversionRate}%</td>
                  <td className="p-3 font-extrabold text-slate-900">₹{item.revenue.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                      <UserCheck className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE STAFF USER & PASSWORD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Create Staff User & Password</h3>
                  <p className="text-xs text-slate-500">Admin utility to provision staff accounts and credentials.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaffSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Sharma"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="suresh@educonsult.in"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee ID Code</label>
                  <input
                    type="text"
                    required
                    value={staffForm.empCode}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, empCode: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Set Login Password *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Set strong password"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign CRM Role *</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none"
                  >
                    <option value={userRoles.SUPER_ADMIN}>👑 Super Admin</option>
                    <option value={userRoles.ADMIN_MANAGER}>👔 Admin / Manager</option>
                    <option value={userRoles.COUNSELLOR}>🎧 Counsellor / Sales Executive</option>
                    <option value={userRoles.ACCOUNTANT}>💳 Accountant</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="Senior Admissions Lead"
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone (+91)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Save User & Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
