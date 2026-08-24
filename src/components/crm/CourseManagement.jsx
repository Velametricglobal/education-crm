import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Modal } from '../common/Modal';
import { BookOpen, Plus, Building2, IndianRupee, Edit3, CheckCircle2 } from 'lucide-react';

export const CourseManagement = () => {
  const { courses, universities, saveCourse } = useCrm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Postgraduate',
    degreeType: "Master's Degree",
    duration: '2 Years',
    eligibility: 'Graduation with 50% marks',
    universityId: 'UNI-103',
    universityName: 'LPU Online',
    studyMode: 'Distance / Online LMS',
    totalFee: 50000,
    yearlyFee: 25000,
    admissionDates: 'July 2026 Session Open',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setForm({
      name: '', category: 'Postgraduate', degreeType: "Master's Degree", duration: '2 Years',
      eligibility: 'Graduation with 50% marks', universityId: universities[0]?.id || 'UNI-101',
      universityName: universities[0]?.name || 'IGNOU', studyMode: 'Distance / Online LMS',
      totalFee: 50000, yearlyFee: 25000, admissionDates: 'July Session Open', description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crs) => {
    setEditingCourse(crs);
    setForm({ ...crs });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uni = universities.find(u => u.id === form.universityId);
    saveCourse({
      ...form,
      id: editingCourse?.id,
      universityName: uni?.name || form.universityName
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Distance & Online Course Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage course fees, eligibility criteria, study modes, duration, and prospectus details.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(crs => (
          <div key={crs.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  {crs.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{crs.id}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">{crs.name}</h3>

              <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> {crs.universityName}
              </p>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <p><span className="font-semibold text-slate-500">Duration:</span> {crs.duration}</p>
                <p><span className="font-semibold text-slate-500">Eligibility:</span> {crs.eligibility}</p>
                <p><span className="font-semibold text-slate-500">Study Mode:</span> {crs.studyMode}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{crs.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Course Fee</p>
                <p className="text-base font-extrabold text-emerald-700">₹{Number(crs.totalFee).toLocaleString('en-IN')}</p>
              </div>

              <button
                onClick={() => handleOpenEdit(crs)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? "Edit Course" : "Add New Course"}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Master of Business Administration (MBA)"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
              >
                <option value="Postgraduate">Postgraduate</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">University</label>
              <select
                value={form.universityId}
                onChange={(e) => setForm(prev => ({ ...prev, universityId: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
              >
                {universities.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Fee (₹)</label>
              <input
                type="number"
                value={form.totalFee}
                onChange={(e) => setForm(prev => ({ ...prev, totalFee: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
            <input
              type="text"
              value={form.eligibility}
              onChange={(e) => setForm(prev => ({ ...prev, eligibility: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
            >
              Save Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
