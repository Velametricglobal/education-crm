import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Modal } from '../common/Modal';
import { FileCheck, CheckCircle2, AlertCircle, UserCheck, ShieldCheck, FileText, Upload } from 'lucide-react';

export const ApplicationManagement = () => {
  const { applications, updateApplicationStatus, convertApplicationToStudent } = useCrm();
  const [selectedApp, setSelectedApp] = useState(null);
  const [enrollModalApp, setEnrollModalApp] = useState(null);

  const [totalFee, setTotalFee] = useState(50000);
  const [initialPaid, setInitialPaid] = useState(15000);

  const handleOpenEnroll = (app) => {
    setEnrollModalApp(app);
    setTotalFee(50000);
    setInitialPaid(15000);
  };

  const handleConfirmEnrollment = (e) => {
    e.preventDefault();
    if (!enrollModalApp) return;
    convertApplicationToStudent(enrollModalApp, totalFee, initialPaid);
    setEnrollModalApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-600" /> Application & Admission Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track student application submissions, document verification checklists, and confirm university enrollments.
          </p>
        </div>
      </div>

      {/* Applications Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">App No & Student</th>
                <th className="p-3">Course & University</th>
                <th className="p-3">Counsellor</th>
                <th className="p-3">App Date</th>
                <th className="p-3">Document Status</th>
                <th className="p-3">Stage Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No active applications found. Convert an interested lead to start an application.
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">
                        {app.applicationNo}
                      </span>
                      <p className="font-extrabold text-slate-900 text-xs mt-0.5">{app.studentName}</p>
                      <span className="text-[10px] text-slate-400">{app.mobile}</span>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{app.courseName}</p>
                      <span className="text-[10px] text-purple-600 font-semibold">{app.universityName}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{app.counsellorName}</td>
                    <td className="p-3 font-medium text-slate-600">{app.applicationDate}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{app.documents.filter(d => d.status === 'Verified').length} / {app.documents.length} Docs Clear</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Admission Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Fee Pending' ? 'bg-amber-100 text-amber-800' : 'bg-cyan-100 text-cyan-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                        >
                          Checklist
                        </button>
                        {app.status !== 'Admission Confirmed' && (
                          <button
                            onClick={() => handleOpenEnroll(app)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Enroll Student
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Checklist Modal */}
      <Modal isOpen={Boolean(selectedApp)} onClose={() => setSelectedApp(null)} title={`Document Verification Checklist: ${selectedApp?.studentName}`}>
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
            <div>
              <p className="font-extrabold text-slate-900">{selectedApp?.courseName}</p>
              <p className="text-slate-500">{selectedApp?.universityName}</p>
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg">
              {selectedApp?.applicationNo}
            </span>
          </div>

          <h4 className="font-bold text-slate-800 text-xs">Uploaded Documents Verification Status:</h4>
          <div className="space-y-2">
            {selectedApp?.documents.map((doc, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{doc.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 bg-slate-100 font-bold text-slate-700 rounded-xl"
            >
              Close Checklist
            </button>
          </div>
        </div>
      </Modal>

      {/* Enroll Student & Fee Structure Modal */}
      <Modal isOpen={Boolean(enrollModalApp)} onClose={() => setEnrollModalApp(null)} title="Confirm Student Admission & Generate Fee Account">
        <form onSubmit={handleConfirmEnrollment} className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
            <p className="font-bold">Confirming Admission for {enrollModalApp?.studentName}</p>
            <p className="text-[11px] mt-0.5">Enrolling in {enrollModalApp?.courseName} ({enrollModalApp?.universityName}). An official student record and fee account will be generated.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Course Fee (₹)</label>
              <input
                type="number"
                required
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">1st Installment Amount Received (₹)</label>
              <input
                type="number"
                required
                value={initialPaid}
                onChange={(e) => setInitialPaid(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 font-medium">
            Remaining Balance: <span className="font-extrabold text-slate-900">₹{(Number(totalFee) - Number(initialPaid)).toLocaleString('en-IN')}</span> (Due in 30 days)
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEnrollModalApp(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
            >
              🎉 Confirm Admission & Issue Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
