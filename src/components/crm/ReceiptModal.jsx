import React from 'react';
import { Modal } from '../common/Modal';
import { useCrm } from '../../context/CrmContext';
import { Printer, Download, GraduationCap, CheckCircle2 } from 'lucide-react';

export const ReceiptModal = ({ payment, isOpen, onClose }) => {
  const { settings } = useCrm();

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Fee Payment Receipt" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Printable Area Container */}
        <div id="printable-receipt" className="p-6 bg-white border border-slate-200 rounded-2xl space-y-6 text-xs text-slate-800 shadow-xs">
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-base">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-base text-slate-900">{settings.agencyName}</h2>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs">{settings.address}</p>
              <p className="text-[10px] text-slate-500">GSTIN: {settings.gstin} • Ph: {settings.phone}</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-xs uppercase tracking-wider">
                PAID RECEIPT
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-2">{payment.receiptNo}</p>
              <p className="text-[11px] text-slate-500">Date: {payment.paymentDate}</p>
            </div>
          </div>

          {/* Student & Course Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Student Information</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{payment.studentName}</p>
              <p className="text-slate-600 text-[11px]">ID: {payment.studentId}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Academic Enrollment</span>
              <p className="font-bold text-slate-800 text-xs mt-0.5">{payment.courseName}</p>
              <p className="text-purple-700 font-semibold text-[11px]">{payment.universityName}</p>
            </div>
          </div>

          {/* Payment Summary Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                <th className="py-2">Description / Transaction Remarks</th>
                <th className="py-2">Payment Method</th>
                <th className="py-2 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3">
                  <p className="font-bold text-slate-900">{payment.remarks || 'Distance University Admission / Installment Fee'}</p>
                  <p className="text-[10px] text-slate-500">Txn Ref: {payment.transactionId}</p>
                </td>
                <td className="py-3 font-semibold text-slate-700">{payment.paymentMethod}</td>
                <td className="py-3 text-right font-extrabold text-emerald-700 text-sm">
                  ₹{Number(payment.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Balance & Signature */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
            <div>
              <p className="text-slate-600 font-semibold">
                Remaining Outstanding Balance: <span className="font-extrabold text-slate-900">₹{Number(payment.remainingBalance).toLocaleString('en-IN')}</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Received By: {payment.receivedBy}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-10 border-b border-slate-300 mb-1 flex items-end justify-center font-serif text-[10px] text-slate-400 italic">
                Authorized Signatory
              </div>
              <p className="text-[10px] font-bold text-slate-700">{settings.agencyName}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Download PDF Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};
