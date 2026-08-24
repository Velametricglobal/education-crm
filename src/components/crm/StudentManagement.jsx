import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ReceiptModal } from './ReceiptModal';
import { GraduationCap, Search, PhoneCall, MessageCircle, CreditCard, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentManagement = () => {
  const { students, payments, recordPayment } = useCrm();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentModalStudent, setPaymentModalStudent] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Payment Form State
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [payTxnId, setPayTxnId] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
    s.mobile.includes(search)
  );

  const handleRecordPaySubmit = (e) => {
    e.preventDefault();
    if (!paymentModalStudent || !payAmount) return;

    const newPay = recordPayment({
      studentId: paymentModalStudent.id,
      studentName: paymentModalStudent.name,
      courseName: paymentModalStudent.courseName,
      universityName: paymentModalStudent.universityName,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      transactionId: payTxnId || `TXN-${Date.now().toString().slice(-6)}`,
      receivedBy: "Accounts Dept",
      remarks: `Installment Payment cleared via ${payMethod}`
    });

    setPaymentModalStudent(null);
    setPayAmount('');
    setPayTxnId('');
    setActiveReceipt(newPay);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" /> Enrolled Student Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View active students, university enrollment numbers, installment schedules, and fee balances.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, enrollment #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Student Name & Enrollment</th>
                <th className="p-3">Enrolled Program</th>
                <th className="p-3">University</th>
                <th className="p-3">Counsellor</th>
                <th className="p-3">Total Fee (₹)</th>
                <th className="p-3">Paid Fee (₹)</th>
                <th className="p-3">Balance (₹)</th>
                <th className="p-3">Fee Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No enrolled students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900 text-xs">{student.name}</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {student.enrollmentNo}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{student.courseName}</td>
                    <td className="p-3 font-semibold text-purple-700">{student.universityName}</td>
                    <td className="p-3 font-semibold text-slate-700">{student.counsellorName}</td>
                    <td className="p-3 font-bold text-slate-900">₹{Number(student.totalFee).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-emerald-700">₹{Number(student.paidFee).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-rose-600">₹{Number(student.remainingFee).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        student.feeStatus === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${student.mobile}`}
                          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                          title="Call"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        {student.remainingFee > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalStudent(student);
                              setPayAmount(student.remainingFee);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Pay Fee
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

      {/* Record Payment Form Modal */}
      {paymentModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Record Payment for {paymentModalStudent.name}</h3>
            <p className="text-xs text-slate-500">Remaining Balance: ₹{paymentModalStudent.remainingFee.toLocaleString('en-IN')}</p>

            <form onSubmit={handleRecordPaySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  max={paymentModalStudent.remainingFee}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="Cash">Cash at Office</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Cheque #</label>
                <input
                  type="text"
                  placeholder="e.g. UPI/678912/PAY"
                  value={payTxnId}
                  onChange={(e) => setPayTxnId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalStudent(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                >
                  Save & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        payment={activeReceipt}
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
