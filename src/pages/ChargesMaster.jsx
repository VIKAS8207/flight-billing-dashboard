import React, { useState } from 'react';
import { 
  IndianRupee, History, Save, Users, ArrowRightCircle, Clock, 
  PlaneLanding, Sun, Moon, Timer, Percent
} from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// Utility to format percentages
const formatPercent = (amount) => {
  return `${amount}%`;
};

export default function ChargesMaster() {
  // Unified State for all Active Charges
  const [charges, setCharges] = useState({
    landing: 5000,
    parking: 1000,
    dayParking: 1500,
    nightParking: 2500,
    watch: 1000,
    udf: 200,
    royalty: 36
  });

  // Unified State for Input Fields (so users can type without immediately saving)
  const [inputs, setInputs] = useState({ ...charges });

  // Audit Log State (Pre-populated)
  const [auditLog, setAuditLog] = useState([
    {
      id: 1,
      date: '03 May 2026',
      time: '10:15 AM',
      field: 'UDF Charge (Per Passenger)',
      oldValue: 150,
      newValue: 200,
      user: 'Admin (System)',
      isPercent: false
    },
    {
      id: 2,
      date: '15 Apr 2026',
      time: '02:30 PM',
      field: 'Night Parking Charges',
      oldValue: 2000,
      newValue: 2500,
      user: 'Terminal Manager',
      isPercent: false
    }
  ]);

  // Master Configuration Array for rendering cards cleanly
  const masterConfigs = [
    { key: 'landing', title: 'Landing Charges', sub: 'Base landing fee', icon: PlaneLanding, color: 'text-indigo-500', bg: 'bg-indigo-50', isPercent: false },
    { key: 'dayParking', title: 'Day Parking Charges', sub: 'Daytime block rate', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50', isPercent: false },
    { key: 'nightParking', title: 'Night Parking Charges', sub: 'Overnight block rate', icon: Moon, color: 'text-slate-700', bg: 'bg-slate-100', isPercent: false },
    { key: 'watch', title: 'Watch Hour Extension', sub: 'Per hour extension', icon: Timer, color: 'text-rose-500', bg: 'bg-rose-50', isPercent: false },
    { key: 'udf', title: 'UDF Charge', sub: 'Per passenger fee', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', isPercent: false },
    { key: 'royalty', title: 'Royalty Charge', sub: 'NSOP percentage rate', icon: Percent, color: 'text-purple-500', bg: 'bg-purple-50', isPercent: true },
  ];

  // Generic Update Handler
  const handleUpdate = (key, title, isPercent) => {
    const newVal = Number(inputs[key]);
    const oldVal = charges[key];

    if (newVal === oldVal) return; // No actual change

    const now = new Date();
    const newLog = {
      id: Date.now(),
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      field: title,
      oldValue: oldVal,
      newValue: newVal,
      user: 'Terminal Manager (Active)',
      isPercent
    };

    setCharges(prev => ({ ...prev, [key]: newVal }));
    setAuditLog(prev => [newLog, ...prev]);
    alert(`${title} updated successfully to ${isPercent ? formatPercent(newVal) : formatCurrency(newVal)}!`);
  };

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-8 font-sans pb-8 animate-in fade-in duration-300">
      
      {/* HEADER CONTAINER */}
      <div className="relative p-8 flex flex-col justify-center gap-2 z-20 overflow-hidden rounded-2xl shadow-sm border border-[#007BFF]/10 bg-gradient-to-r from-[#eef6ff] to-[#d9eeff]">
        <svg className="absolute bottom-0 left-0 w-full h-24 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
          <path d="M0 54H1440V34.5C1440 34.5 1320 8.5 1176 16.5C1032 24.5 960 44.5 816 38.5C672 32.5 612 8.5 468 12.5C324 16.5 216 46.5 72 46.5C28.8 46.5 0 34.5 0 34.5V54Z" />
        </svg>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Charges Master Control</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Configure global fee parameters for automatic invoice calculation across all flights.</p>
        </div>
      </div>

      {/* TOP SECTION: MASTER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {masterConfigs.map((config) => (
          <div key={config.key} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                <config.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">{config.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{config.sub}</p>
              </div>
            </div>

            {/* Input & Action */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  {config.isPercent ? <Percent size={14} /> : <IndianRupee size={14} />}
                </div>
                <input 
                  type="number" 
                  value={inputs[config.key]}
                  onChange={(e) => handleInputChange(config.key, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-slate-900 font-extrabold outline-none focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 transition-all text-base"
                />
              </div>
              <button 
                onClick={() => handleUpdate(config.key, config.title, config.isPercent)}
                disabled={Number(inputs[config.key]) === charges[config.key]}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
              >
                <Save size={14} /> Update Rate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION: AUDIT HISTORY TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden mt-4">
        <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm">
            <History size={16} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">Master Change History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <th className="px-8 py-4">Date & Time</th>
                <th className="px-8 py-4">Parameter Changed</th>
                <th className="px-8 py-4 text-center">Value Update</th>
                <th className="px-8 py-4 text-right">Updated By</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {auditLog.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  
                  {/* Date/Time */}
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-800">{log.date}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock size={12} /> {log.time}
                    </div>
                  </td>
                  
                  {/* Field */}
                  <td className="px-8 py-5 font-bold text-[#007BFF]">
                    {log.field}
                  </td>
                  
                  {/* Old -> New Values */}
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-4 bg-white border border-slate-200 py-2 px-4 rounded-xl shadow-sm w-max mx-auto">
                      <span className="font-bold text-slate-400 line-through decoration-slate-300">
                        {log.isPercent ? formatPercent(log.oldValue) : formatCurrency(log.oldValue)}
                      </span>
                      <ArrowRightCircle size={16} className="text-slate-300" />
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {log.isPercent ? formatPercent(log.newValue) : formatCurrency(log.newValue)}
                      </span>
                    </div>
                  </td>
                  
                  {/* User */}
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <div className="h-5 w-5 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {log.user.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 text-xs">{log.user}</span>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          
          {auditLog.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-medium">
              No changes recorded yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}