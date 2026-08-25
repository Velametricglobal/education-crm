import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { useCms } from '../context/CmsContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  PhoneCall,
  MessageCircle,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Send,
  Sparkles,
  ArrowRight,
  UserCheck,
  Menu,
  X,
  ShieldCheck,
  Star,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ExternalLink
} from 'lucide-react';

export const PublicHomepage = ({ onSwitchToCrm, onSwitchToStudentPortal }) => {
  const { settings, courses = [], universities = [], addLead, registerStudent } = useCrm();
  const { cmsData = {} } = useCms();
  const { registerStudentUser } = useAuth();

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Student Admission & Account Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    password: '',
    city: 'Dehradun',
    qualification: 'Graduation (Any Stream)',
    preferredCourse: 'Master of Business Administration (MBA)',
    preferredUniversity: 'LPU Online',
    preferredStudyMode: 'Online LMS'
  });

  // Safe Slide Fallback
  const currentSlide = cmsData?.hero?.slides?.[activeSlideIdx] || cmsData?.hero?.slides?.[0] || {
    badge: "🎓 Admissions Open for July 2026 Session",
    headline: "Era Management Institute of Technology",
    headlineHindi: "इरा मैनेजमेंट इंस्टीट्यूट ऑफ टेक्नोलॉजी (EMIT) - देहरादून",
    subheadline: "Pursue UGC & DEB Approved Distance & Online Degree Programs from Dehradun.",
    ctaText: "Apply Now",
    bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80"
  };

  // Safe Stats Fallback
  const statsList = cmsData?.stats?.items || [
    { label: "Years Experience", value: cmsData?.stats?.yearsExperience || "12+" },
    { label: "Students Guided", value: cmsData?.stats?.studentsGuided || "15,000+" },
    { label: "Partner Universities", value: cmsData?.stats?.partnerUniversities || "25+" },
    { label: "Admission Success", value: cmsData?.stats?.admissionSuccessRate || "99.4%" }
  ];

  const handleStudentRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.mobile || !regForm.email || !regForm.password) return;

    // 1. Create Lead & Student Record in CRM
    const newLead = addLead({
      ...regForm,
      source: 'Website Admission Form',
      campaign: 'Homepage_Student_Registration',
      notes: `Student self-registered for ${regForm.preferredCourse}`
    });
    registerStudent(regForm);

    // 2. Create Student User Account in AuthContext & Supabase
    try {
      await registerStudentUser(regForm.name, regForm.email, regForm.mobile, regForm.password);
    } catch (err) {}

    setCreatedLeadId(newLead.id);
    setFormSubmitted(true);

    try {
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    } catch(err) {}
  };

  const handleEnquireCourseClick = (courseName, uniName) => {
    setRegForm(prev => ({
      ...prev,
      preferredCourse: courseName,
      preferredUniversity: uniName || prev.preferredUniversity
    }));
    const el = document.getElementById('enquiry-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white pb-16 sm:pb-0">
      {/* 1. Public Mobile-Friendly Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Left: Mobile Menu Toggle & Branding */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden active:scale-95 transition-transform"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.agencyName}
                  className="object-contain"
                  style={{
                    width: settings.logoWidth ? `${settings.logoWidth}px` : '140px',
                    height: settings.logoHeight ? `${settings.logoHeight}px` : '40px'
                  }}
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-blue-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
              )}
              <div>
                <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
                  {settings.agencyName}
                </h1>
                <p className="text-[10px] font-medium text-slate-500 hidden sm:block">
                  {settings.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions & Official Website Link */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <a
              href="https://emitdehradun.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" /> Visit Main Website <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> {settings.phone}
            </a>

            {/* Portal Switcher Buttons */}
            <button
              onClick={onSwitchToCrm}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> CRM Login
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2 text-xs font-bold text-slate-700">
              <a
                href="https://emitdehradun.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Visit Main Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('enquiry-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-left flex items-center justify-between"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="p-2 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-emerald-700 font-bold"
              >
                <PhoneCall className="w-4 h-4" /> Helpline: {settings.phone}
              </a>

              <button
                onClick={() => { setIsMobileMenuOpen(false); onSwitchToCrm(); }}
                className="p-2 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-between mt-1"
              >
                <span>Staff & Admin CRM Login</span>
                <UserCheck className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section with Embedded Student Admission Signup Form */}
      <section className="relative bg-slate-950 text-white py-8 sm:py-16 md:py-20 overflow-hidden">
        {/* Dynamic Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{ backgroundImage: `url(${currentSlide.bgImage})` }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] sm:text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {currentSlide.badge}
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {settings.language === 'hi' && currentSlide.headlineHindi ? currentSlide.headlineHindi : currentSlide.headline}
            </h2>

            <p className="text-slate-300 text-xs sm:text-base max-w-xl font-medium leading-relaxed">
              {currentSlide.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('enquiry-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                {currentSlide.ctaText || "Apply Now"} <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://emitdehradun.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
              >
                <Globe className="w-4 h-4 text-blue-400" /> Visit Main Website ↗
              </a>
            </div>
          </div>

          {/* Right Embedded Student Admission Signup Form */}
          <div id="enquiry-form" className="lg:col-span-5 bg-white text-slate-900 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200">
            {formSubmitted ? (
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Student Account Created!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Congratulations! Your student account and application (<span className="font-extrabold text-blue-600">{createdLeadId}</span>) are now ready.
                </p>

                <button
                  onClick={onSwitchToStudentPortal}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  🎓 Enter Student Self-Service Portal <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleStudentRegistrationSubmit} className="space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight flex items-center gap-1.5">
                      <UserPlus className="w-5 h-5 text-emerald-600" /> Student Admission Signup
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">Free Reg</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Create your student account & apply for July 2026 session</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Gupta"
                      value={regForm.name}
                      onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile (+91) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={regForm.mobile}
                        onChange={(e) => setRegForm(prev => ({ ...prev, mobile: e.target.value, whatsapp: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="ananya@gmail.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Create Account Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Choose a strong password"
                        value={regForm.password}
                        onChange={(e) => setRegForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Interested Distance Course *</label>
                    <select
                      value={regForm.preferredCourse}
                      onChange={(e) => setRegForm(prev => ({ ...prev, preferredCourse: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.duration})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred University</label>
                    <select
                      value={regForm.preferredUniversity}
                      onChange={(e) => setRegForm(prev => ({ ...prev, preferredUniversity: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    >
                      {universities.map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-1 active:scale-98"
                  >
                    <UserPlus className="w-4 h-4" /> Create Student Account & Apply
                  </button>

                  <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Secure • Instant Student Portal Access
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3. UGC & DEB Govt Approvals & Accreditations Banner */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {statsList.map((st, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{st.value}</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Distance Courses Offered */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Popular UGC-Approved Distance & Online Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Pursue flexible degree & diploma programs from India's top NAAC A+ Accredited Universities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map(c => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> {c.duration}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.eligibility} • Semesters: {c.semesters}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Total Course Fee</p>
                  <p className="text-base font-extrabold text-slate-900">₹{c.feeTotal?.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleEnquireCourseClick(c.name)}
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  Apply <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Approved Partner Universities */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Recognized Partner Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              100% Government Approved • UGC-DEB • AICTE • WES Recognized Degrees
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map(u => (
              <div key={u.id} className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                      NAAC {u.naacGrade}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{u.location}</span>
                  </div>

                  <h3 className="font-extrabold text-white text-lg">{u.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">Approvals: {u.approvalStatus}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Est. {u.establishedYear}</span>
                  <button
                    onClick={() => handleEnquireCourseClick('MBA', u.name)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    View Courses
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-base">{settings.agencyName}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{settings.address}</p>
            <p className="text-slate-400">Email: {settings.email}</p>
            <a
              href="https://emitdehradun.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:underline font-semibold"
            >
              <Globe className="w-3.5 h-3.5" /> www.emitdehradun.in ↗
            </a>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-sm">Approvals & Accreditations</h4>
            <p className="text-slate-400 leading-relaxed">
              All partner universities featured are recognized by the Distance Education Bureau (DEB) of the University Grants Commission (UGC).
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm">Need Guidance?</h4>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-500 transition-colors"
              >
                <PhoneCall className="w-4 h-4" /> Call {settings.phone}
              </a>
              <a
                href="https://emitdehradun.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-500 transition-colors"
              >
                <Globe className="w-4 h-4" /> Main Website ↗
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-slate-900 text-center text-slate-500 text-[11px]">
          © 2026 {settings.agencyName}. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
