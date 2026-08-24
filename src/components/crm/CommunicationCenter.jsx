import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { MessageSquare, PhoneCall, MessageCircle, Mail, Send, Copy, Check } from 'lucide-react';

export const CommunicationCenter = () => {
  const { leads, students } = useCrm();

  const [selectedTemplate, setSelectedTemplate] = useState('new_enquiry');
  const [recipientLead, setRecipientLead] = useState(leads[0] || null);
  const [copied, setCopied] = useState(false);

  const templates = {
    new_enquiry: {
      title: "New Enquiry Acknowledgement",
      text: "Hello {student_name}, thank you for enquiring with EduVeda! Our senior education counsellor will assist you shortly regarding {course_name} admissions at {university_name}. For urgent queries call us at +91 98765 43210."
    },
    followup: {
      title: "Follow-up & Syllabus Brochure",
      text: "Dear {student_name}, we are following up regarding your interest in {course_name}. You can explore syllabus & online exam details here. When would be a good time to connect on a call?"
    },
    fee_reminder: {
      title: "Installment Fee Due Reminder",
      text: "Dear {student_name}, your course fee installment for {course_name} ({university_name}) is due on {due_date}. Please clear your balance of ₹{amount} to ensure uninterrupted LMS access."
    },
    admission_welcome: {
      title: "Admission Confirmation & Student Portal",
      text: "Congratulations {student_name}! Your admission for {course_name} at {university_name} has been officially confirmed. Your enrollment number is {enrollment_no}. Welcome to EduVeda!"
    }
  };

  const currentTemplate = templates[selectedTemplate];

  // Render text with variables replaced
  const formattedText = currentTemplate ? currentTemplate.text
    .replace('{student_name}', recipientLead?.name || 'Student')
    .replace('{course_name}', recipientLead?.preferredCourse || recipientLead?.courseName || 'MBA')
    .replace('{university_name}', recipientLead?.preferredUniversity || recipientLead?.universityName || 'University')
    .replace('{due_date}', '15th Sep 2026')
    .replace('{amount}', '12,000')
    .replace('{enrollment_no}', 'SUB-BBA-2026-4412') : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Multi-Channel Communication Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directly message prospects via WhatsApp, Call, SMS, or Email using smart template variables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Template Selector */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Message Templates</h3>
          <div className="space-y-2">
            {Object.keys(templates).map(key => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                  selectedTemplate === key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {templates[key].title}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-slate-700">Target Prospect / Student</label>
            <select
              value={recipientLead?.id}
              onChange={(e) => setRecipientLead(leads.find(l => l.id === e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.mobile})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Col (2 Cols): Live Preview & Direct Trigger */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Generated WhatsApp / Message Preview</h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {formattedText}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`https://wa.me/${(recipientLead?.whatsapp || '919876543210').replace(/\D/g,'')}?text=${encodeURIComponent(formattedText)}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-green-500/20"
            >
              <MessageCircle className="w-4 h-4" /> Send via WhatsApp
            </a>

            <a
              href={`tel:${recipientLead?.mobile}`}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
            >
              <PhoneCall className="w-4 h-4" /> Call Student
            </a>

            <a
              href={`mailto:${recipientLead?.email}?subject=EduVeda%20Distance%20Education&body=${encodeURIComponent(formattedText)}`}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
            >
              <Mail className="w-4 h-4" /> Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
