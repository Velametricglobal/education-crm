import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Megaphone, TrendingUp, DollarSign, Target, Plus } from 'lucide-react';

export const MarketingCampaigns = () => {
  const { campaigns } = useCrm();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" /> Marketing Campaign ROI Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track Meta Ads, Google Ads, and Offline Campaign lead generation, conversions, ad spend budget, and ROI %.
          </p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Ad Spend Budget</th>
                <th className="p-3">Leads Generated</th>
                <th className="p-3">Applications</th>
                <th className="p-3">Confirmed Admissions</th>
                <th className="p-3">Revenue Generated</th>
                <th className="p-3">Calculated ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {campaigns.map(cmp => (
                <tr key={cmp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-extrabold text-slate-900">{cmp.name}</td>
                  <td className="p-3 text-slate-700">{cmp.platform}</td>
                  <td className="p-3 text-slate-700">₹{cmp.budget.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-blue-700">{cmp.leadsGenerated} leads</td>
                  <td className="p-3 text-purple-700">{cmp.applications}</td>
                  <td className="p-3 font-extrabold text-emerald-700">{cmp.admissions} students</td>
                  <td className="p-3 font-extrabold text-slate-900">₹{cmp.revenue.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      {cmp.roi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
