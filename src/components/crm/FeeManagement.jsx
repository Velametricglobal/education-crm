import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ReceiptModal } from './ReceiptModal';
import { CreditCard, IndianRupee, AlertCircle, CheckCircle2, Download, Printer, Search } from 'lucide-react';

export const FeeManagement = () => {
  const { payments, students } = useCrm();
  const [activeReceipt, setActiveReceipt] = useState(null);

  const totalCollected = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalPending = students.reduce((acc, s) => acc + Number(s.remainingFee), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" /> Fee & Collection Financial Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track total fee collections, installment due schedules, payment transaction logs, and printable receipts.
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Fee Collected</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified Bank & UPI Collections</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Outstanding Dues</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Scheduled Student Installments</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Receipts Issued</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{payments.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">100% Tax Compliant Receipts</p>
        </div>
      </div>

      {/* Payment Transactions Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-2">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-extrabold text-slate-900 text-sm">Official Fee Payment Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Receipt No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Course & University</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3">Method</th>
                <th className="p-3">Txn Reference</th>
                <th className="p-3">Amount Paid</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {payments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[10px]">
                      {pay.receiptNo}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-slate-900">{pay.studentName}</td>
                  <td className="p-3 text-slate-700">
                    {pay.courseName}
                    <p className="text-[10px] text-purple-700 font-semibold">{pay.universityName}</p>
                  </td>
                  <td className="p-3 text-slate-600">{pay.paymentDate}</td>
                  <td className="p-3 text-slate-700">{pay.paymentMethod}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-500">{pay.transactionId}</td>
                  <td className="p-3 font-extrabold text-emerald-700">₹{Number(pay.amount).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveReceipt(pay)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal
        payment={activeReceipt}
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
