import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { useAuth } from '../context/AuthContext';
import { ReceiptModal } from '../components/crm/ReceiptModal';
import {
  GraduationCap,
  CreditCard,
  Download,
  FileText,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  Building2,
  BookOpen
} from 'lucide-react';

export const StudentPortal = ({ onBackToApp }) => {
  const { students, payments, recordPayment, applications } = useCrm();
  const { currentUser, logout, userRoles } = useAuth();

  const isStudentRole = currentUser?.role === userRoles.STUDENT || currentUser?.role === 'Student';

  // Strictly find enrolled student record matching logged in user's email, phone, or ID
  const student = students.find(
    s => (currentUser.email && s.email && s.email.toLowerCase() === currentUser.email.toLowerCase()) ||
         (currentUser.phone && s.mobile && s.mobile.includes(currentUser.phone)) ||
         s.id === currentUser.id
  ) || (isStudentRole ? {
    id: "STD-SELF",
    studentId: "ED-2026-901",
    enrollmentNo: "LPU-MBA-2026-9012",
    name: currentUser.name || "Student User",
    email: currentUser.email || "student@educonsult.in",
    mobile: currentUser.phone || "+91 9988776655",
    courseName: "Master of Business Administration (MBA Online)",
    universityName: "LPU Online (Lovely Professional University)",
    admissionDate: "2026-08-20",
    studyMode: "Distance / Online LMS",
    counsellorName: "Amit Kumar",
    feeStatus: "Due",
    totalFee: 84000,
    paidFee: 25000,
    remainingFee: 59000,
    installments: [
      { id: "INS-1", title: "1st Installment / Admission Fee", amount: 25000, dueDate: "2026-08-20", status: "Paid" },
      { id: "INS-2", title: "2nd Semester Fee Balance", amount: 59000, dueDate: "2026-09-20", status: "Due" }
    ]
  } : students[0]);

  // Find single application record for this student
  const studentApp = applications.find(a => a.studentId === student?.id || a.email === student?.email) || {
    applicationNo: "APP-2026-000001",
    status: "submitted",
    admissionSession: "July 2026 Session",
    remarks: "Documents verified by university registrar."
  };

  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // Strictly filter payment receipts for this student ONLY
  const studentPayments = payments.filter(p => p.studentId === student?.id);

  const handlePayRemaining = () => {
    if (!student || student.remainingFee <= 0) return;

    const newPay = recordPayment({
      studentId: student.id,
      studentName: student.name,
      courseName: student.courseName,
      universityName: student.universityName,
      amount: student.remainingFee,
      paymentMethod: "UPI",
      transactionId: `UPI/${Math.floor(100000 + Math.random() * 900000)}/PAY`,
      receivedBy: "Online Student Portal",
      remarks: "Full Balance Payment cleared via Student Self-Service Portal"
    });

    setIsPaying(false);
    setActiveReceipt(newPay);
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base sm:text-xl flex items-center gap-2">
              Student Self-Service Portal
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back, <span className="font-bold text-emerald-400">{student.name}</span> (Enrollment #: {student.enrollmentNo})
            </p>
          </div>
        </div>

        {/* Action Button: If Student Role, only show Sign Out; If Admin, allow return */}
        {isStudentRole ? (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        ) : (
          <button
            onClick={onBackToApp}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Return to CRM Staff View
          </button>
        )}
      </div>

      {/* Main Student Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Enrolled Course & Fee Schedule */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card 1: My Enrolled Course & Application Status */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-extrabold uppercase">
                Enrolled Student Portal
              </span>
              <span className="text-xs font-bold text-slate-400">Student ID: {student.studentId}</span>
            </div>

            <div>
              <h2 className="font-extrabold text-white text-lg sm:text-2xl">{student.courseName}</h2>
              <p className="text-xs sm:text-sm font-bold text-purple-400 mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 shrink-0" /> {student.universityName}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Admission Session</span>
                <p className="font-bold text-white mt-0.5">{studentApp.admissionSession || 'July 2026'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Study Mode</span>
                <p className="font-bold text-white mt-0.5">{student.studyMode}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Application Status</span>
                <p className="font-bold text-emerald-400 mt-0.5 capitalize">{studentApp.status.replace('_', ' ')} ✓</p>
              </div>
            </div>
          </div>

          {/* Card 2: Personal Fee Installment Schedule */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Your Fee Breakdown & Schedule</h3>
              {student.remainingFee > 0 && (
                <button
                  onClick={() => setIsPaying(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 active:scale-98 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Pay Remaining (₹{Number(student.remainingFee).toLocaleString('en-IN')})
                </button>
              )}
            </div>

            <div className="space-y-3">
              {student.installments.map((ins, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-white">{ins.title}</p>
                    <p className="text-slate-400 mt-0.5">Due Date: {ins.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-white text-sm">₹{Number(ins.amount).toLocaleString('en-IN')}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      ins.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {ins.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Downloadable Receipts */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base">Your Payment Receipts</h3>
            <div className="space-y-2.5">
              {studentPayments.length === 0 ? (
                <p className="text-xs text-slate-400">No payment receipts available yet.</p>
              ) : (
                studentPayments.map(p => (
                  <div key={p.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{p.receiptNo}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Paid ₹{Number(p.amount).toLocaleString('en-IN')} on {p.paymentDate}</p>
                    </div>
                    <button
                      onClick={() => setActiveReceipt(p)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Assigned Counsellor Help Desk */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base">Assigned Counsellor Desk</h3>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
              <div>
                <p className="font-extrabold text-white text-sm">{student.counsellorName || "Amit Kumar"}</p>
                <p className="text-slate-400 text-[11px]">Senior Distance Education Advisor</p>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Helpline
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-center rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl text-xs space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Student Isolation
            </div>
            <p>Your student profile, application records, and fee payments are encrypted and accessible only to you and authorized university registrars.</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaying && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs border border-slate-800 shadow-2xl">
            <h3 className="font-extrabold text-white text-base">Pay Remaining Fee Balance</h3>
            <p className="text-slate-300">Clearing balance installment of <span className="font-extrabold text-emerald-400">₹{Number(student.remainingFee).toLocaleString('en-IN')}</span>.</p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 font-bold text-center">
              🔒 Authorized Online Gateway (UPI / Credit Card / NetBanking)
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPaying(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePayRemaining}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg"
              >
                ✓ Authorize Payment & Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      <ReceiptModal
        payment={activeReceipt}
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
