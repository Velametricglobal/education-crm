import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Modal } from '../common/Modal';
import { Building2, Plus, Globe, CheckCircle2, Award, Edit3 } from 'lucide-react';

export const UniversityManagement = () => {
  const { universities, saveUniversity } = useCrm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState(null);

  const [form, setForm] = useState({
    name: '',
    shortName: '',
    logo: '🏛️',
    accreditation: 'UGC-DEB Approved | NAAC A Grade',
    website: 'https://',
    description: '',
    location: 'New Delhi'
  });

  const handleOpenAdd = () => {
    setEditingUni(null);
    setForm({
      name: '', shortName: '', logo: '🏛️', accreditation: 'UGC-DEB Approved | NAAC A Grade',
      website: 'https://', description: '', location: 'New Delhi'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (uni) => {
    setEditingUni(uni);
    setForm({ ...uni });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUniversity({
      ...form,
      id: editingUni?.id
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" /> Recognized Open University Database
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage partner universities, UGC-DEB recognition details, NAAC grades, and campus locations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add University
        </button>
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map(uni => (
          <div key={uni.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{uni.logo}</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  UGC-DEB Approved
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{uni.name}</h3>
                <p className="text-xs font-bold text-purple-700 mt-0.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {uni.accreditation}
                </p>
              </div>

              <p className="text-xs text-slate-600">{uni.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={uni.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" /> Official Portal ↗
              </a>

              <button
                onClick={() => handleOpenEdit(uni)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUni ? "Edit University" : "Add Partner University"}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Institution Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Subharti University DDE"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Accreditation / NAAC Grade</label>
              <input
                type="text"
                placeholder="UGC-DEB Approved | NAAC A+"
                value={form.accreditation}
                onChange={(e) => setForm(prev => ({ ...prev, accreditation: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Website URL</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))}
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
              Save University
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
