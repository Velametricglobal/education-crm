import React, { createContext, useContext, useState } from 'react';
import { initialCmsState } from '../services/mockData';

const CmsContext = createContext(null);

export const CmsProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState(initialCmsState);
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [selectedSection, setSelectedSection] = useState('hero'); // 'hero' | 'stats' | 'about' | 'courses' | 'universities' | 'testimonials' | 'faqs' | 'cta'
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [isPublished, setIsPublished] = useState(true);

  const pushState = (newData) => {
    setHistory(prev => [...prev, cmsData]);
    setFuture([]);
    setCmsData(newData);
    setIsPublished(false);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture(prev => [cmsData, ...prev]);
    setCmsData(previous);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(prev => [...prev, cmsData]);
    setCmsData(next);
    setFuture(prev => prev.slice(1));
  };

  const publishChanges = () => {
    setIsPublished(true);
    // Persist or notify
  };

  const updateHeroSlide = (slideId, updatedSlide) => {
    const newSlides = cmsData.hero.slides.map(s => s.id === slideId ? { ...s, ...updatedSlide } : s);
    pushState({
      ...cmsData,
      hero: { ...cmsData.hero, slides: newSlides }
    });
  };

  const addHeroSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      headline: "Explore UGC Recognized Distance Degrees",
      headlineHindi: "यूजीसी मान्यता प्राप्त दूरस्थ डिग्री का अन्वेषण करें",
      subheadline: "Get free counselling for top open university admissions in India.",
      ctaText: "Apply Now",
      ctaUrl: "#enquiry-form",
      bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
      badge: "🔥 New Batch Starting Soon"
    };
    pushState({
      ...cmsData,
      hero: { ...cmsData.hero, slides: [...cmsData.hero.slides, newSlide] }
    });
  };

  const deleteHeroSlide = (slideId) => {
    if (cmsData.hero.slides.length <= 1) return; // Keep at least one
    const newSlides = cmsData.hero.slides.filter(s => s.id !== slideId);
    pushState({
      ...cmsData,
      hero: { ...cmsData.hero, slides: newSlides }
    });
  };

  const updateStats = (newStats) => {
    pushState({
      ...cmsData,
      stats: { ...cmsData.stats, ...newStats }
    });
  };

  const updateAbout = (newAbout) => {
    pushState({
      ...cmsData,
      about: { ...cmsData.about, ...newAbout }
    });
  };

  const updateTestimonial = (id, data) => {
    const newTestimonials = cmsData.testimonials.map(t => t.id === id ? { ...t, ...data } : t);
    pushState({ ...cmsData, testimonials: newTestimonials });
  };

  const addTestimonial = (data) => {
    const newT = {
      id: `TST-${Date.now()}`,
      studentName: data.studentName || "Student Name",
      course: data.course || "MBA",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      review: data.review || "Excellent admission guidance by EduVeda team!"
    };
    pushState({ ...cmsData, testimonials: [...cmsData.testimonials, newT] });
  };

  const updateFaq = (id, data) => {
    const newFaqs = cmsData.faqs.map(f => f.id === id ? { ...f, ...data } : f);
    pushState({ ...cmsData, faqs: newFaqs });
  };

  const addFaq = (data) => {
    const newFaq = {
      id: `FAQ-${Date.now()}`,
      category: data.category || "General",
      question: data.question || "New Question?",
      answer: data.answer || "Answer details..."
    };
    pushState({ ...cmsData, faqs: [...cmsData.faqs, newFaq] });
  };

  return (
    <CmsContext.Provider value={{
      cmsData,
      viewportMode,
      setViewportMode,
      selectedSection,
      setSelectedSection,
      isPublished,
      publishChanges,
      undo,
      redo,
      canUndo: history.length > 0,
      canRedo: future.length > 0,
      updateHeroSlide,
      addHeroSlide,
      deleteHeroSlide,
      updateStats,
      updateAbout,
      updateTestimonial,
      addTestimonial,
      updateFaq,
      addFaq
    }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
