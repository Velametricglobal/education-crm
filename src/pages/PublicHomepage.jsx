import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { useCms } from '../context/CmsContext';
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
  Star
} from 'lucide-react';

export const PublicHomepage = ({ onSwitchToCrm, onSwitchToStudentPortal }) => {
  const { settings, courses, universities, addLead } = useCrm();
  const { cmsData } = useCms();

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // High-converting Lead Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: 'Delhi NCR',
    qualification: 'Graduation (Any Stream)',
    preferredCourse: 'Master of Business Administration (MBA)',
    preferredUniversity: 'LPU Online',
    preferredStudyMode: 'Online LMS',
    message: ''
  });

  const currentSlide = cmsData.hero.slides[activeSlideIdx] || cmsData.hero.slides[0];

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.mobile) return;

    const newLead = addLead({
      ...enquiryForm,
      source: 'Website Lead Form',
      campaign: 'Homepage_Organic_Enquiry',
      notes: enquiryForm.message || `Website enquiry for ${enquiryForm.preferredCourse}`
    });

    setCreatedLeadId(newLead.id);
    setFormSubmitted(true);

    try {
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    } catch(err) {}
  };

  const handleEnquireCourseClick = (courseName, uniName) => {
    setEnquiryForm(prev => ({
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
                    width: settings.logoWidth ? `${settings.logoWidth}px` : 'auto',
                    height: settings.logoHeight ? `${settings.logoHeight}px` : '36px',
                    maxHeight: '48px'
                  }}
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-md shadow-blue-500/20 shrink-0">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              )}
              <div>
                <h1 className="font-extrabold text-slate-900 text-xs sm:text-base leading-none tracking-tight">
                  {settings.agencyName}
                </h1>
                <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-0.5 hidden xs:block">
                  UGC-DEB Distance Degrees
                </p>
              </div>
            </div>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#courses-grid" className="hover:text-blue-600 transition-colors">Courses</a>
            <a href="#universities" className="hover:text-blue-600 transition-colors">Universities</a>
            <a href="#why-choose-us" className="hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('enquiry-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-sm transition-all"
            >
              Enquire Now
            </button>

            <button
              onClick={onSwitchToStudentPortal}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl transition-colors hidden sm:block"
            >
              Create Student Account
            </button>

            <button
              onClick={onSwitchToCrm}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-100 font-extrabold text-[11px] sm:text-xs rounded-xl transition-colors"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs font-bold text-slate-700 divide-y divide-slate-100">
            <div className="py-1">
              <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-600">🏠 Home</a>
              <a href="#courses-grid" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-600">📚 Distance Courses</a>
              <a href="#universities" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-600">🏛️ UGC Universities</a>
              <a href="#faqs" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-600">❓ FAQs & Validity</a>
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Helpline: {settings.phone}</span>
              <button onClick={onSwitchToStudentPortal} className="text-blue-600 font-bold underline">Student Portal →</button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Responsive Hero Slider Section */}
      <section id="hero" className="relative bg-slate-900 text-white py-8 sm:py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay transition-all duration-700"
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
                {currentSlide.ctaText} <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" /> Call {settings.phone}
              </a>
            </div>
          </div>

          {/* Right Mobile Responsive Lead Generation Form */}
          <div id="enquiry-form" className="lg:col-span-5 bg-white text-slate-900 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200">
            {formSubmitted ? (
              <div className="text-center py-6 sm:py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Enquiry Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you! Your Lead ID is <span className="font-extrabold text-blue-600">{createdLeadId}</span>. Our senior education counsellor will call & WhatsApp you shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">Get Free 1-on-1 Counselling</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Instant guidance for July 2026 distance admissions</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile (+91) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={enquiryForm.mobile}
                        onChange={(e) => setEnquiryForm(prev => ({ ...prev, mobile: e.target.value, whatsapp: e.target.value }))}
                        className="w-full px-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi / Patna"
                        value={enquiryForm.city}
                        onChange={(e) => setEnquiryForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Course Interested In *</label>
                    <select
                      value={enquiryForm.preferredCourse}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, preferredCourse: e.target.value }))}
                      className="w-full px-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.duration})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">University Preference</label>
                    <select
                      value={enquiryForm.preferredUniversity}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, preferredUniversity: e.target.value }))}
                      className="w-full px-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    >
                      {universities.map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-1 active:scale-98"
                  >
                    <Send className="w-4 h-4" /> Get Free Admission Guidance
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    🔒 100% Confidential • Official Authorized University Partner
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3. Trust Statistics Section */}
      <section className="bg-white border-b border-slate-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-blue-600">{cmsData.stats.yearsExperience}</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5">Years Experience</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-blue-600">{cmsData.stats.studentsGuided}</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5">Students Guided</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-blue-600">{cmsData.stats.partnerUniversities}</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5">Partner Universities</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-blue-600">{cmsData.stats.admissionSuccessRate}</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5">Approval Rate</p>
          </div>
        </div>
      </section>

      {/* 4. UGC-DEB Recognized Universities Showcase */}
      <section id="universities" className="py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              100% Recognized Degrees
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Approved Partner Universities
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">All degrees are 100% valid for Central & State Government Jobs, Higher Studies, and Abroad Evaluations</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {universities.map(uni => (
              <div key={uni.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3">
                <div className="flex items-center gap-3">
                  <img src={uni.logo} alt={uni.name} className="w-12 h-12 rounded-xl object-cover bg-white p-1 border border-slate-200" />
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">{uni.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{uni.city}, {uni.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{uni.recognition}</span>
                </div>

                <button
                  onClick={() => handleEnquireCourseClick('MBA', uni.name)}
                  className="w-full py-2 bg-white border border-slate-200 hover:bg-blue-600 hover:text-white text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  View Admission Fees
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Popular Distance Courses Catalog */}
      <section id="courses-grid" className="py-10 sm:py-16 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 space-y-6 sm:space-y-8">
          <div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Explore Degree Programs
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Distance & Online Degree Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {courses.map(crs => (
              <div key={crs.id} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                      {crs.category}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">₹{Number(crs.totalFee).toLocaleString('en-IN')} Total</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{crs.name}</h3>

                  <p className="text-xs text-purple-700 font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0" /> {crs.universityName}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs space-y-1">
                    <p><span className="font-semibold text-slate-500">Duration:</span> {crs.duration}</p>
                    <p><span className="font-semibold text-slate-500">Eligibility:</span> {crs.eligibility}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleEnquireCourseClick(crs.name, crs.universityName)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-98"
                >
                  Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section id="faqs" className="py-10 sm:py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 space-y-6 sm:space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about distance education validity & admissions</p>
          </div>

          <div className="space-y-2.5">
            {cmsData.faqs.map((faq, idx) => (
              <div
                key={faq.id}
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? -1 : idx)}
                className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900">
                  <span className="pr-2">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                </div>
                {openFaqIdx === idx && (
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed pt-2 border-t border-slate-200/60">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Sticky Floating Contact Bar on Mobile Smartphones */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2 sm:hidden flex items-center gap-2 shadow-2xl">
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Us
        </a>
        <a
          href={`tel:${settings.phone}`}
          className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <PhoneCall className="w-4 h-4" /> Call Admissions
        </a>
      </div>
    </div>
  );
};
