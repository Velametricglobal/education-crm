import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { PieChart, Download, BarChart2, TrendingUp, Users, Building2, BookOpen } from 'lucide-react';

export const ReportsAnalytics = () => {
  const { leads, students, courses, universities, payments } = useCrm();

  const [selectedReport, setSelectedReport] = useState('course_wise');

  // Course-wise breakdown
  const courseBreakdown = courses.map(c => {
    const leadCount = leads.filter(l => l.preferredCourse === c.name).length;
    const studentCount = students.filter(s => s.courseId === c.id || s.courseName === c.name).length;
    const rev = payments.filter(p => p.courseName === c.name).reduce((acc, p) => acc + Number(p.amount), 0);
    return { course: c.name, leads: leadCount, admissions: studentCount, revenue: rev };
  });

  const exportReportCSV = () => {
    const headers = ["Course", "Leads", "Admissions", "Revenue Collected"];
    const rows = courseBreakdown.map(r => [r.course, r.leads, r.admissions, r.revenue]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduVeda_Analytics_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" /> Executive Analytics & Report Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate custom course-wise, university-wise, and financial collection analytics reports.
          </p>
        </div>

        <button
          onClick={exportReportCSV}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Report CSV
        </button>
      </div>

      {/* Analytics Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-extrabold text-slate-900 text-sm">Course-Wise Performance & Revenue Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Course Name</th>
                <th className="p-3">Total Enquiries</th>
                <th className="p-3">Confirmed Admissions</th>
                <th className="p-3">Conversion Rate</th>
                <th className="p-3 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {courseBreakdown.map((row, idx) => {
                const conv = row.leads > 0 ? ((row.admissions / row.leads) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900">{row.course}</td>
                    <td className="p-3 text-blue-700 font-bold">{row.leads} leads</td>
                    <td className="p-3 text-emerald-700 font-bold">{row.admissions} students</td>
                    <td className="p-3 text-purple-700 font-bold">{conv}%</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">₹{row.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
