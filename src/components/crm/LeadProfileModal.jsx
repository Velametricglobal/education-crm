import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  PhoneCall,
  MessageCircle,
  Mail,
  Calendar,
  FileText,
  UserCheck,
  Tag,
  Clock,
  Send,
  Building2,
  BookOpen,
  IndianRupee,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const LeadProfileModal = ({ lead, isOpen, onClose }) => {
  const {
    leadStatuses,
    updateLeadStatus,
    updateLeadPriority,
    assignLead,
    scheduleFollowup,
    convertLeadToApplication,
    courses,
    universities
  } = useCrm();

  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'notes' | 'schedule'
  const [newNote, setNewNote] = useState('');
  const [followupType, setFollowupType] = useState('Call');
  const [followupDate, setFollowupDate] = useState('');
  const [followupNotes, setFollowupNotes] = useState('');
  const [notesList, setNotesList] = useState([
    { id: 1, text: lead?.notes || "Initial enquiry captured", author: "Counsellor", time: lead?.createdDate || "2026-08-20" }
  ]);

  if (!lead) return null;

  const currentStatusObj = leadStatuses.find(s => s.id === lead.status);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList(prev => [
      { id: Date.now(), text: newNote, author: lead.counsellorName, time: "Just now" },
      ...prev
    ]);
    setNewNote('');
  };

  const handleScheduleFollowup = (e) => {
    e.preventDefault();
    if (!followupDate) return;
    scheduleFollowup({
      leadId: lead.id,
      leadName: lead.name,
      counsellorId: lead.counsellorId,
      counsellorName: lead.counsellorName,
      type: followupType,
      dueDate: followupDate,
      notes: followupNotes
    });
    alert(`Follow-up scheduled for ${followupDate}`);
    setFollowupNotes('');
    setFollowupDate('');
  };

  const handleConvert = () => {
    const courseObj = courses.find(c => c.name === lead.preferredCourse) || courses[0];
    const uniObj = universities.find(u => u.name === lead.preferredUniversity) || universities[0];
    convertLeadToApplication(lead, courseObj, uniObj);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Lead Profile: ${lead.name} (${lead.id})`} maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Header Profile Summary & Quick Actions */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{lead.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${currentStatusObj?.color || 'bg-blue-100 text-blue-800'}`}>
                  {currentStatusObj?.name || lead.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  lead.priority === 'hot' ? 'bg-red-500 text-white' :
                  lead.priority === 'warm' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {lead.priority?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lead.city}, {lead.state} • Qualification: <span className="font-semibold text-slate-700">{lead.qualification} ({lead.passingYear})</span>
              </p>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${lead.mobile}`}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </a>

            <a
              href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>

            <a
              href={`mailto:${lead.email}`}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>

            <button
              onClick={handleConvert}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" /> Convert to Application
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Timeline & Activity Tab switcher */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex border-b border-slate-200 text-xs font-bold gap-4">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-2 border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Chronological Timeline
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 border-b-2 transition-colors ${activeTab === 'notes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Counsellor Notes ({notesList.length})
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`pb-2 border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Schedule Follow-up
              </button>
            </div>

            {activeTab === 'timeline' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Enquiry Created</span>
                    <span className="text-slate-400 font-normal">{lead.createdDate}</span>
                  </div>
                  <p className="text-slate-600 mt-1">Lead submitted interest for {lead.preferredCourse} via {lead.source}</p>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs">
                  <div className="flex justify-between font-semibold text-blue-900">
                    <span>Counsellor Assigned</span>
                    <span className="text-blue-500 font-normal">{lead.createdDate}</span>
                  </div>
                  <p className="text-blue-800 mt-1">Lead assigned to senior counsellor {lead.counsellorName}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Last Interaction</span>
                    <span className="text-slate-400 font-normal">{lead.lastContacted}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{lead.notes}</p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4 pt-2">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add counselling interaction note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Save Note
                  </button>
                </form>

                <div className="space-y-2">
                  {notesList.map(n => (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                        <span className="font-bold text-slate-700">{n.author}</span>
                        <span>{n.time}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <form onSubmit={handleScheduleFollowup} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Task Type</label>
                  <select
                    value={followupType}
                    onChange={(e) => setFollowupType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Call">Call Prospect</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Meeting">Online Counselling Meeting</option>
                    <option value="Document Reminder">Document Collection Reminder</option>
                    <option value="Fee Reminder">Fee Token Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda / Instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Instructions for follow-up call..."
                    value={followupNotes}
                    onChange={(e) => setFollowupNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Confirm & Schedule Task
                </button>
              </form>
            )}
          </div>

          {/* Right Column (1 Col): Lead Details Sidebar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Preference</span>
              <p className="font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> {lead.preferredCourse}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred University</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600" /> {lead.preferredUniversity}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget Range</span>
              <p className="font-semibold text-slate-700 mt-0.5">{lead.budget}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Source & Campaign</span>
              <p className="font-semibold text-slate-700 mt-0.5">{lead.source} ({lead.campaign})</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Counsellor</span>
              <p className="font-extrabold text-blue-700 mt-0.5">{lead.counsellorName}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next Follow-up Due</span>
              <p className="font-bold text-amber-700 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {lead.nextFollowup}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {lead.tags?.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-600">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
