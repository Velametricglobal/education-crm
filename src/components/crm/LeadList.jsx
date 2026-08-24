import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { LeadKanban } from './LeadKanban';
import { LeadProfileModal } from './LeadProfileModal';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Download,
  PhoneCall,
  MessageCircle,
  Mail,
  UserCheck,
  AlertTriangle,
  Users,
  Clock,
  User,
  Building2,
  BookOpen
} from 'lucide-react';

export const LeadList = () => {
  const {
    leads,
    leadStatuses,
    leadPriorities,
    addLead,
    updateLeadStatus,
    assignLead,
    checkDuplicate
  } = useCrm();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead Form State
  const [newForm, setNewForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: 'New Delhi',
    state: 'Delhi',
    qualification: 'Graduation',
    preferredCourse: 'Master of Business Administration (MBA)',
    preferredUniversity: 'LPU Online',
    budget: '₹50,000 - ₹70,000',
    source: 'Manual Entry',
    priority: 'hot',
    notes: ''
  });

  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
                          l.mobile.includes(search) ||
                          l.email.toLowerCase().includes(search.toLowerCase()) ||
                          l.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || l.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Duplicate Check Handler
  const handleMobileChange = (val) => {
    setNewForm(prev => ({ ...prev, mobile: val, whatsapp: val }));
    if (val.length >= 10) {
      const dup = checkDuplicate(val, newForm.email);
      setDuplicateWarning(dup ? dup : null);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newForm.name || !newForm.mobile) return;
    addLead(newForm);
    setIsAddModalOpen(false);
    setNewForm({
      name: '', mobile: '', whatsapp: '', email: '', city: 'New Delhi', state: 'Delhi',
      qualification: 'Graduation', preferredCourse: 'Master of Business Administration (MBA)',
      preferredUniversity: 'LPU Online', budget: '₹50,000 - ₹70,000', source: 'Manual Entry', priority: 'hot', notes: ''
    });
    setDuplicateWarning(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedLeadIds([...prev, id]);
    }
  };

  const exportCSV = () => {
    const headers = ["Lead ID", "Name", "Mobile", "Email", "City", "Course", "University", "Status", "Priority", "Counsellor", "Created Date"];
    const rows = filteredLeads.map(l => [
      l.id, l.name, l.mobile, l.email, l.city, l.preferredCourse, l.preferredUniversity, l.status, l.priority, l.counsellorName, l.createdDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduVeda_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base md:text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Lead Management Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {filteredLeads.length} leads matching current filters
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban Board
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors hidden sm:flex"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          {/* Add Lead Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lead name, phone, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Dropdown Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {leadStatuses.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="hot">Hot 🔥</option>
            <option value="warm">Warm ☀️</option>
            <option value="cold">Cold ❄️</option>
          </select>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        <LeadKanban onSelectLead={setSelectedLead} onAddNewLead={() => setIsAddModalOpen(true)} />
      ) : (
        <>
          {/* MOBILE RESPONSIVE CARDS VIEW (visible on small screens) */}
          <div className="block sm:hidden space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                No matching leads found.
              </div>
            ) : (
              filteredLeads.map(lead => {
                const statusObj = leadStatuses.find(s => s.id === lead.status);

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-3 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400">{lead.id}</span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{lead.name}</h4>
                        <p className="text-[11px] text-slate-500">{lead.city}, {lead.state}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          lead.priority === 'hot' ? 'bg-red-500 text-white' :
                          lead.priority === 'warm' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {lead.priority?.toUpperCase()}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusObj?.color || 'bg-slate-100'}`}>
                          {statusObj?.name || lead.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" /> {lead.preferredCourse}
                      </p>
                      <p className="text-[11px] text-purple-700 font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-600" /> {lead.preferredUniversity}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {lead.counsellorName.split(' ')[0]}
                      </div>

                      {/* Direct Call & WhatsApp Action Buttons */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`tel:${lead.mobile}`}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Call
                        </a>
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-green-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WA
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DESKTOP DATA TABLE VIEW (hidden on small screens, visible on sm+) */}
          <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-3">Lead ID & Name</th>
                    <th className="p-3">Phone / WhatsApp</th>
                    <th className="p-3">Course & University</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Counsellor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map(lead => {
                    const statusObj = leadStatuses.find(s => s.id === lead.status);
                    const isSelected = selectedLeadIds.includes(lead.id);

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/60' : ''
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(lead.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold text-slate-400">{lead.id}</span>
                          <p className="font-extrabold text-slate-900 text-xs">{lead.name}</p>
                          <span className="text-[10px] text-slate-500">{lead.city}, {lead.state}</span>
                        </td>
                        <td className="p-3 font-medium text-slate-700">
                          {lead.mobile}
                          <p className="text-[10px] text-slate-400">{lead.email}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800 line-clamp-1">{lead.preferredCourse}</p>
                          <span className="text-[10px] text-blue-600 font-semibold">{lead.preferredUniversity}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-600">{lead.source}</td>
                        <td className="p-3 font-extrabold text-slate-800">{lead.counsellorName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusObj?.color || 'bg-slate-100'}`}>
                            {statusObj?.name || lead.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.priority === 'hot' ? 'bg-red-500 text-white' :
                            lead.priority === 'warm' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {lead.priority?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`tel:${lead.mobile}`}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Call"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add New Lead Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Distance Education Lead">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          {duplicateWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Possible Duplicate Found!</p>
                <p className="text-[11px]">An existing lead "{duplicateWarning.name}" ({duplicateWarning.id}) already exists with phone {duplicateWarning.mobile}.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Student Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={newForm.name}
                onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp (+91) *</label>
              <input
                type="text"
                required
                placeholder="10-digit Mobile Number"
                value={newForm.mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="student@gmail.com"
                value={newForm.email}
                onChange={(e) => setNewForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City & State</label>
              <input
                type="text"
                placeholder="e.g. New Delhi, Delhi"
                value={newForm.city}
                onChange={(e) => setNewForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
            >
              Save & Create Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* Selected Lead Profile Modal */}
      <LeadProfileModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
};
