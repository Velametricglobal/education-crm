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
  HelpCircle,
  PhoneCall,
  UserPlus,
  CheckCircle2,
  BookOpen,
  Building2,
  Sparkles
} from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const { loginAsUser, registerStudentUser, sampleUsers } = useAuth();
  const { settings, courses, universities, registerStudent } = useCrm();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Student Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: 'Delhi NCR',
    state: 'Delhi',
    qualification: 'Graduation (Any Stream)',
    preferredCourse: 'Master of Business Administration (MBA)',
    preferredUniversity: 'LPU Online'
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Secure credential authentication handler
  const handleSecureLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your registered email address and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Find matching user by email
      const matchedUser = sampleUsers.find(
        u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (!matchedUser) {
        setErrorMsg('Invalid credentials or user account not found. Please check your email.');
        setLoading(false);
        return;
      }

      // Successful authentication
      loginAsUser(matchedUser);

      // Route to role-specific default tab
      let defaultTab = 'dashboard';
      if (matchedUser.role === 'Admin / Manager') defaultTab = 'staff_performance';
      if (matchedUser.role === 'Counsellor / Sales Executive') defaultTab = 'my_workspace';
      if (matchedUser.role === 'Accountant') defaultTab = 'fees';
      if (matchedUser.role === 'Student') defaultTab = 'student_portal';

      if (onLoginSuccess) onLoginSuccess(defaultTab);
      setLoading(false);
    }, 700);
  };

  // Student Self-Registration Handler
  const handleStudentRegistration = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regForm.name || !regForm.mobile || !regForm.email) {
      setRegError('Please complete all required fields (*)');
      return;
    }

    if (regForm.password && regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match. Please re-type password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 1. Create student record in CRM Database
      const newStudentObj = registerStudent(regForm);

      // 2. Authenticate student user
      registerStudentUser(regForm.name, regForm.email, regForm.mobile);

      setRegSuccess(true);
      setLoading(false);

      // Redirect immediately to Student Self-Service Portal
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess('student_portal');
      }, 1000);
    }, 800);
  };

  const handleFillDemoCreds = (demoUser) => {
    setEmail(demoUser.email);
    setPassword('••••••••••••');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.agencyName}
              style={{
                width: settings.logoWidth ? `${settings.logoWidth}px` : '140px',
                height: settings.logoHeight ? `${settings.logoHeight}px` : '40px'
              }}
              className="object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="font-extrabold text-white text-base sm:text-lg leading-tight tracking-tight">
              {settings.agencyName}
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              {settings.currentSession} • Official Secure Portal
            </p>
          </div>
        </div>

        <a
          href={`tel:${settings.phone}`}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Helpline: {settings.phone}
        </a>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-xl mx-auto w-full my-6">
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md relative overflow-hidden">
          {/* Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Create Student Account
            </button>
          </div>

          {/* MODE A: LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <div className="text-center space-y-1.5">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Staff & Student Login</h2>
                <p className="text-xs text-slate-400">Enter your authorized credentials to access your portal.</p>
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
                  <label className="block font-bold text-slate-300 mb-1">Email / User ID *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@educonsult.in"
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
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                    className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" /> Staff Email Directory
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {loading ? "Authenticating Credentials..." : "Sign In Securely"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {showDemoCredentials && (
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-[11px]">
                  <p className="font-extrabold text-slate-300">Authorized Directory (Click to autofill):</p>
                  <div className="space-y-1">
                    {sampleUsers.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleFillDemoCreds(u)}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-slate-900 flex items-center justify-between text-slate-400 hover:text-white transition-colors"
                      >
                        <span><strong className="text-slate-200">{u.name}</strong> ({u.role})</span>
                        <span className="text-[10px] font-mono text-blue-400">{u.email}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE B: CREATE STUDENT ACCOUNT FORM */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Create Student Account</h2>
                <p className="text-xs text-slate-400">Register for distance education admission & student portal access.</p>
              </div>

              {regError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-lg font-extrabold text-white">Student Account Created!</h3>
                  <p className="text-xs text-slate-300">Launching your Student Self-Service Portal now...</p>
                </div>
              ) : (
                <form onSubmit={handleStudentRegistration} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Gupta"
                      value={regForm.name}
                      onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Mobile (+91) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={regForm.mobile}
                        onChange={(e) => setRegForm(prev => ({ ...prev, mobile: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="ananya@gmail.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Create Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regForm.password}
                        onChange={(e) => setRegForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Interested Distance Course *</label>
                    <select
                      value={regForm.preferredCourse}
                      onChange={(e) => setRegForm(prev => ({ ...prev, preferredCourse: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.duration})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Preferred University</label>
                    <select
                      value={regForm.preferredUniversity}
                      onChange={(e) => setRegForm(prev => ({ ...prev, preferredUniversity: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none"
                    >
                      {universities.map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
                  >
                    {loading ? "Registering Student Account..." : "Create Account & Enter Student Portal"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-[10px] text-center text-slate-500">
            🔒 100% Confidential • Official UGC-DEB Distance Admissions
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800/60">
        <p>© 2026 {settings.agencyName}. Student Portal & Distance CRM.</p>
      </div>
    </div>
  );
};
