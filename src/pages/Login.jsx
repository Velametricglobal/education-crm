import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrm } from '../context/CrmContext';
import {
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  PhoneCall,
  UserCheck,
  Calculator,
  User,
  Globe
} from 'lucide-react';

export const Login = ({ onLoginSuccess, onSwitchToPublicHomepage }) => {
  const { login } = useAuth();
  const { settings } = useCrm();

  // 3 Login Role Settings: 'admin' | 'accountant' | 'student'
  const [selectedRole, setSelectedRole] = useState('admin');

  // Login Form State
  const [email, setEmail] = useState('admin@emit.edu.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle switching role selector
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMsg('');
    if (roleKey === 'admin') setEmail('admin@emit.edu.in');
    if (roleKey === 'accountant') setEmail('finance@emit.edu.in');
    if (roleKey === 'student') setEmail('student@emit.edu.in');
    setPassword('');
  };

  // Secure credential authentication handler
  const handleSecureLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your registered email address and password.');
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await login(email, password);

      if (!loggedUser) {
        setErrorMsg('Invalid email address or password.');
        setLoading(false);
        return;
      }

      // Route to role-specific default workspace
      let defaultTab = 'dashboard';
      if (loggedUser.role === 'Admin / Manager' || loggedUser.role === 'Super Admin') defaultTab = 'staff_performance';
      if (loggedUser.role === 'Counsellor / Sales Executive') defaultTab = 'my_workspace';
      if (loggedUser.role === 'Accountant') defaultTab = 'fees';
      if (loggedUser.role === 'Student') defaultTab = 'student_portal';

      if (onLoginSuccess) onLoginSuccess(defaultTab);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <div
          onClick={onSwitchToPublicHomepage}
          className="flex items-center gap-3 cursor-pointer group"
          title="Visit Public Website Homepage"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.agencyName}
              style={{
                width: settings.logoWidth ? `${settings.logoWidth}px` : '140px',
                height: settings.logoHeight ? `${settings.logoHeight}px` : '40px'
              }}
              className="object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="font-extrabold text-white text-base sm:text-lg leading-tight tracking-tight group-hover:text-blue-400 transition-colors">
              {settings.agencyName}
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              {settings.currentSession} • Official Secure Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSwitchToPublicHomepage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            title="Visit Public Website Homepage"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit Website</span>
          </button>
          <a
            href={`tel:${settings.phone}`}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Helpline: {settings.phone}
          </a>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md mx-auto w-full my-6">
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md relative overflow-hidden">
          {/* Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Select Account Login</h2>
            <p className="text-xs text-slate-400">Choose your account role and enter authorized credentials.</p>
          </div>

          {/* 3 LOGIN ROLE SELECTORS (1. Super Admin / Admin, 2. Accountant, 3. Student) */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2.5 px-2 font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-[11px] leading-tight">Super Admin / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('accountant')}
              className={`py-2.5 px-2 font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                selectedRole === 'accountant'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-[11px] leading-tight">Accountant</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`py-2.5 px-2 font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                selectedRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-[11px] leading-tight">Student</span>
            </button>
          </div>

          {/* Validation Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSecureLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {selectedRole === 'admin' && 'Super Admin / Admin Email *'}
                {selectedRole === 'accountant' && 'Accountant Email *'}
                {selectedRole === 'student' && 'Student Registered Email *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@emit.edu.in'
                      : selectedRole === 'accountant'
                      ? 'finance@emit.edu.in'
                      : 'student@emit.edu.in'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 accent-blue-600" />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  : selectedRole === 'accountant'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              {loading ? "Authenticating Credentials..." : `Sign In as ${selectedRole === 'admin' ? 'Super Admin / Admin' : selectedRole === 'accountant' ? 'Accountant' : 'Student'}`} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authenticated Access Only • Official UGC-DEB Portal
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800/60">
        <p>© 2026 {settings.agencyName}. Authenticated Education CRM.</p>
      </div>
    </div>
  );
};
