import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { isSupabaseConfigured, supabaseService } from '../../lib/supabaseClient';
import {
  Settings,
  Shield,
  Palette,
  Image,
  Sliders,
  Building,
  Check,
  Globe,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Award,
  Upload
} from 'lucide-react';

export const SystemSettings = () => {
  const { settings, updateSettings, auditLogs } = useCrm();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);

    // If Supabase configured, upload to storage bucket
    if (isSupabaseConfigured) {
      try {
        const publicUrl = await supabaseService.uploadMediaAsset(file, 'website-media');
        if (publicUrl) {
          setForm(prev => ({ ...prev, logoUrl: publicUrl }));
          setUploadingLogo(false);
          return;
        }
      } catch (err) {
        console.warn("Supabase logo storage upload fallback to data URL:", err);
      }
    }

    // Fallback: Read file as Data URL (Base64) for instant live preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm(prev => ({ ...prev, logoUrl: event.target?.result || '' }));
      setUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Pre-configured Education Brand Presets
  const brandPresets = [
    {
      name: "EduConsult Pro",
      agencyName: "EduConsult Distance Education CRM",
      tagline: "India's Premier Recognized Distance & Online University Guidance Platform",
      logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200",
      logoWidth: 140,
      logoHeight: 40,
      primaryColor: "#003FB1",
      secondaryColor: "#006A61",
      accentColor: "#059669",
      phone: "+91 98765 43210",
      email: "admissions@educonsult.in"
    },
    {
      name: "Distance Degree Hub",
      agencyName: "Distance Degree Hub India",
      tagline: "UGC-DEB Approved Distance Degree Admission Desk",
      logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=200",
      logoWidth: 160,
      logoHeight: 45,
      primaryColor: "#006A61",
      secondaryColor: "#003FB1",
      accentColor: "#D97706",
      phone: "+91 98123 45678",
      email: "info@distancedegreehub.com"
    },
    {
      name: "Vidyarthi Online Academy",
      agencyName: "Vidyarthi Online Admission Consultancy",
      tagline: "विद्यार्थी ऑनलाइन प्रवेश परामर्श केंद्र",
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200",
      logoWidth: 150,
      logoHeight: 42,
      primaryColor: "#4F46E5",
      secondaryColor: "#059669",
      accentColor: "#7C3AED",
      phone: "+91 97112 23344",
      email: "help@vidyarthionline.in"
    },
    {
      name: "Global University Admissions",
      agencyName: "Global University Distance Portal",
      tagline: "Official Authorized Distance University Admission Center",
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200",
      logoWidth: 180,
      logoHeight: 50,
      primaryColor: "#B91C1C",
      secondaryColor: "#1E293B",
      accentColor: "#D97706",
      phone: "+91 99887 76655",
      email: "contact@globaluniportal.org"
    }
  ];

  const applyPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      agencyName: preset.agencyName,
      tagline: preset.tagline,
      logoUrl: preset.logoUrl,
      logoWidth: preset.logoWidth,
      logoHeight: preset.logoHeight,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      phone: preset.phone,
      email: preset.email
    }));
  };

  const presetColors = ['#003FB1', '#006A61', '#4F46E5', '#B91C1C', '#059669', '#1E293B', '#7C3AED'];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Multi-Brand Setup & Agency Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure custom education consultancy branding, logo dimensions, theme palette, and helpline numbers.
          </p>
        </div>

        {/* 1-Click Brand Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Brand Preset:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {brandPresets.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Brand Settings Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Section A: Brand Identity & Logo Customization */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-600" /> Custom Brand Logo & Size Dimensions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agency / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={form.agencyName}
                    onChange={(e) => setForm(prev => ({ ...prev, agencyName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Logo (Upload File or Enter URL)</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={form.logoUrl || ''}
                        onChange={(e) => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                      />
                      <label className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl cursor-pointer shrink-0 flex items-center gap-1.5 transition-all shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>{uploadingLogo ? 'Uploading...' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400">Select PNG, JPG, or SVG logo file from your computer to update live.</p>
                  </div>
                </div>
              </div>

              {/* Logo Dimensions Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Logo Width (px)</label>
                    <span className="font-extrabold text-blue-600 text-xs">{form.logoWidth || 140}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    step="5"
                    value={form.logoWidth || 140}
                    onChange={(e) => setForm(prev => ({ ...prev, logoWidth: Number(e.target.value) }))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>50px</span>
                    <span>140px (Default)</span>
                    <span>300px</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Logo Height (px)</label>
                    <span className="font-extrabold text-blue-600 text-xs">{form.logoHeight || 40}px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="2"
                    value={form.logoHeight || 40}
                    onChange={(e) => setForm(prev => ({ ...prev, logoHeight: Number(e.target.value) }))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>20px</span>
                    <span>40px (Default)</span>
                    <span>100px</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agency Tagline (English)</label>
                <input
                  type="text"
                  value={form.tagline || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Section B: Theme Colors & Palette */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" /> Brand Color Palette
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.primaryColor || '#003FB1'}
                      onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={form.primaryColor || '#003FB1'}
                      onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.secondaryColor || '#006A61'}
                      onChange={(e) => setForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={form.secondaryColor || '#006A61'}
                      onChange={(e) => setForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.accentColor || '#059669'}
                      onChange={(e) => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={form.accentColor || '#059669'}
                      onChange={(e) => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Helpline & Legal Contact Details */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" /> Helpline & Admissions Office Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={form.phone || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Helpline</label>
                  <input
                    type="text"
                    value={form.whatsapp || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Session Intake</label>
                  <input
                    type="text"
                    value={form.currentSession || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, currentSession: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 active:scale-98 transition-all"
              >
                {saved ? <Check className="w-4 h-4 text-white" /> : null}
                {saved ? 'Brand Configuration Saved & Applied ✓' : 'Save Brand Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Real-Time Brand Preview & Audit Logs (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Real-Time Brand Preview Card */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Live Brand Preview
              </span>
              <span className="text-[10px] bg-blue-600/30 text-blue-300 font-bold px-2 py-0.5 rounded-full">
                Real-Time
              </span>
            </div>

            {/* Header Preview Box */}
            <div className="bg-white text-slate-900 p-3 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt="Logo Preview"
                    className="object-contain"
                    style={{
                      width: `${form.logoWidth || 140}px`,
                      height: `${form.logoHeight || 40}px`
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    E
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-xs leading-tight text-slate-900">{form.agencyName || 'Brand Name'}</h4>
                  <p className="text-[9px] text-slate-500 font-medium">{form.currentSession || 'July 2026'}</p>
                </div>
              </div>

              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: form.primaryColor || '#003FB1' }}
              ></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 text-[11px] space-y-1">
              <p className="font-bold text-slate-200">Custom Dimensions:</p>
              <p className="text-slate-400">Width: <span className="text-white font-bold">{form.logoWidth || 140}px</span> | Height: <span className="text-white font-bold">{form.logoHeight || 40}px</span></p>
              <p className="text-slate-400">Primary Color: <span className="font-mono text-blue-400 font-bold">{form.primaryColor || '#003FB1'}</span></p>
            </div>
          </div>

          {/* Security & Audit Logs Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Audit Log History
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{log.user}</span>
                    <span className="text-[9px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-blue-700 font-bold text-[10px] mt-0.5">{log.action}</p>
                  <p className="text-slate-600 mt-0.5 text-[10px] truncate">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
