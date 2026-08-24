import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { PublicHomepage } from '../../pages/PublicHomepage';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  UploadCloud,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
  Globe
} from 'lucide-react';

export const HomepageBuilder = ({ onExitCMS }) => {
  const {
    cmsData,
    viewportMode,
    setViewportMode,
    selectedSection,
    setSelectedSection,
    isPublished,
    publishChanges,
    undo,
    redo,
    canUndo,
    canRedo,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    updateStats,
    updateTestimonial,
    addTestimonial,
    updateFaq,
    addFaq
  } = useCms();

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const sections = [
    { id: 'hero', label: 'Hero Banner Slider', icon: '🖼️' },
    { id: 'stats', label: 'Trust Statistics', icon: '📊' },
    { id: 'universities', label: 'Partner Universities', icon: '🏛️' },
    { id: 'courses', label: 'Distance Courses', icon: '📚' },
    { id: 'faqs', label: 'FAQ Accordion', icon: '❓' }
  ];

  const currentSlide = cmsData.hero.slides[activeSlideIndex] || cmsData.hero.slides[0];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-900 text-slate-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Toolbar */}
      <div className="bg-slate-950 px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-xl">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xs sm:text-sm text-white">Visual No-Code Homepage Builder</h2>
            <p className="text-[10px] text-slate-400 hidden sm:block">Edit slides, text, UGC partner universities & device preview</p>
          </div>
        </div>

        {/* Device Viewport Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
              viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
              viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
              viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Undo/Redo & Publish Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 border border-slate-800"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 border border-slate-800"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={publishChanges}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-lg flex items-center gap-1 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" /> {isPublished ? 'Published Live ✓' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Panel 1: Section List */}
        <div className="w-full lg:w-48 bg-slate-950 p-2 sm:p-3 border-b lg:border-b-0 lg:border-r border-slate-800 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto shrink-0">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden lg:block">Page Sections</p>
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-2 lg:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left whitespace-nowrap transition-all ${
                selectedSection === sec.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Center: Live Interactive Responsive Canvas */}
        <div className="flex-1 bg-slate-950/60 p-2 sm:p-4 flex items-center justify-center overflow-auto min-h-[300px]">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 h-full ${
              viewportMode === 'mobile' ? 'w-[375px]' :
              viewportMode === 'tablet' ? 'w-[768px]' : 'w-full'
            }`}
          >
            <div className="h-full overflow-y-auto pointer-events-auto">
              <PublicHomepage onSwitchToCrm={onExitCMS} onSwitchToStudentPortal={onExitCMS} />
            </div>
          </div>
        </div>

        {/* Right Panel 2: Live Editor Settings */}
        <div className="w-full lg:w-72 bg-slate-950 p-3 sm:p-4 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-3 overflow-y-auto text-xs text-slate-300 shrink-0 max-h-48 lg:max-h-none">
          <h3 className="font-extrabold text-white text-xs sm:text-sm border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>Edit Section: {sections.find(s => s.id === selectedSection)?.label}</span>
          </h3>

          {/* Editor for Hero Slider */}
          {selectedSection === 'hero' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Slide {activeSlideIndex + 1} of {cmsData.hero.slides.length}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={addHeroSlide}
                    className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    title="Add Slide"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  {cmsData.hero.slides.length > 1 && (
                    <button
                      onClick={() => deleteHeroSlide(currentSlide.id)}
                      className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-500"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Headline Text (English)</label>
                <textarea
                  rows={2}
                  value={currentSlide.headline}
                  onChange={(e) => updateHeroSlide(currentSlide.id, { headline: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Subheadline</label>
                <textarea
                  rows={2}
                  value={currentSlide.subheadline}
                  onChange={(e) => updateHeroSlide(currentSlide.id, { subheadline: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={currentSlide.ctaText}
                  onChange={(e) => updateHeroSlide(currentSlide.id, { ctaText: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Editor for Stats */}
          {selectedSection === 'stats' && (
            <div className="space-y-2.5">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Years Experience</label>
                <input
                  type="text"
                  value={cmsData.stats.yearsExperience}
                  onChange={(e) => updateStats({ yearsExperience: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Students Guided</label>
                <input
                  type="text"
                  value={cmsData.stats.studentsGuided}
                  onChange={(e) => updateStats({ studentsGuided: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Partner Universities</label>
                <input
                  type="text"
                  value={cmsData.stats.partnerUniversities}
                  onChange={(e) => updateStats({ partnerUniversities: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
          )}

          {/* Editor for FAQs */}
          {selectedSection === 'faqs' && (
            <div className="space-y-3">
              <button
                onClick={() => addFaq({ question: "New FAQ Question?", answer: "Answer details..." })}
                className="w-full py-1.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New FAQ Item
              </button>

              <div className="space-y-2">
                {cmsData.faqs.map(faq => (
                  <div key={faq.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-white font-bold"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300"
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
