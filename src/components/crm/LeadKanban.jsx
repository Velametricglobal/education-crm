import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { PhoneCall, MessageCircle, Clock, Plus, Flame, User } from 'lucide-react';

export const LeadKanban = ({ onSelectLead, onAddNewLead }) => {
  const { leads, leadStatuses, updateLeadStatus } = useCrm();

  // Highlight key statuses in Kanban columns
  const kanbanStatuses = leadStatuses.slice(0, 8); // Top statuses for visual space

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatusId) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      updateLeadStatus(leadId, targetStatusId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Info Banner */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          💡 Drag & Drop lead cards between status columns to update pipeline stage instantly.
        </p>
        <button
          onClick={onAddNewLead}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Lead
        </button>
      </div>

      {/* Kanban Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[600px]">
        {kanbanStatuses.map(status => {
          const columnLeads = leads.filter(l => l.status === status.id);

          return (
            <div
              key={status.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.id)}
              className="w-72 shrink-0 bg-slate-100/80 rounded-2xl border border-slate-200/80 p-3 space-y-3 flex flex-col max-h-[750px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status.id === 'new' ? 'bg-blue-500' :
                    status.id === 'interested' ? 'bg-emerald-500' :
                    status.id === 'documents_pending' ? 'bg-orange-500' : 'bg-indigo-500'
                  }`}></span>
                  <h4 className="font-extrabold text-xs text-slate-800 tracking-tight">{status.name}</h4>
                </div>
                <span className="px-2 py-0.5 bg-white text-slate-700 font-bold rounded-lg text-[10px] shadow-2xs">
                  {columnLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-0.5">
                {columnLeads.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs font-medium">
                    Drop leads here
                  </div>
                ) : (
                  columnLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => onSelectLead(lead)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing space-y-2 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400">{lead.id}</span>
                          <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {lead.name}
                          </h5>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          lead.priority === 'hot' ? 'bg-red-500 text-white' :
                          lead.priority === 'warm' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {lead.priority?.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-slate-600 line-clamp-1">
                        🎓 {lead.preferredCourse}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <User className="w-3 h-3 text-slate-400" /> {lead.counsellorName.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1 text-amber-700 font-semibold">
                          <Clock className="w-3 h-3 text-amber-500" /> {lead.nextFollowup?.split(' ')[0]}
                        </span>
                      </div>

                      {/* Quick Communication Trigger */}
                      <div className="flex items-center justify-end gap-1 pt-1">
                        <a
                          href={`tel:${lead.mobile}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 rounded text-slate-600 transition-colors"
                          title="Call"
                        >
                          <PhoneCall className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 bg-slate-100 hover:bg-green-100 hover:text-green-700 rounded text-slate-600 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
