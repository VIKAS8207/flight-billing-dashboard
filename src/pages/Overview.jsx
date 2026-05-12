import React, { useState } from 'react';
import { PlaneTakeoff, TrendingUp, Activity } from 'lucide-react';

// --- CARD COMPONENTS ---
const DarkStatCard = ({ title, value, badge, subtext }) => (
  <div className="flex flex-col justify-between rounded-2xl bg-[#0f172a] p-5 shadow-lg border border-slate-800 text-white transition-all duration-300">
    <p className="text-[13px] font-bold text-slate-300">{title}</p>
    <p className="my-3 text-3xl font-extrabold tracking-tight">{value}</p>
    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400 font-bold">{badge}</span>
      <span>{subtext}</span>
    </div>
  </div>
);

const LightStatCard = ({ title, value, badge, subtext, badgeColor = 'bg-[#007BFF]/10 text-[#007BFF]' }) => (
  <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-100 transition-all duration-300">
    <p className="text-[13px] font-bold text-slate-500">{title}</p>
    <p className="my-3 text-3xl font-extrabold tracking-tight text-slate-800">{value}</p>
    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
      <span className={`rounded px-1.5 py-0.5 font-bold ${badgeColor}`}>{badge}</span>
      <span>{subtext}</span>
    </div>
  </div>
);

export default function Overview() {
  // Toggle State
  const [view, setView] = useState('public');

  // Chart Data - Public (Jan - Dec)
  const publicChartData = [
    { month: 'Jan', income: 40, expense: 20 },
    { month: 'Feb', income: 60, expense: 30 },
    { month: 'Mar', income: 55, expense: 25 },
    { month: 'Apr', income: 80, expense: 40 },
    { month: 'May', income: 65, expense: 35 },
    { month: 'Jun', income: 90, expense: 45 },
    { month: 'Jul', income: 85, expense: 40 },
    { month: 'Aug', income: 100, expense: 55, active: true }, // Active Month
    { month: 'Sep', income: 70, expense: 30 },
    { month: 'Oct', income: 60, expense: 25 },
    { month: 'Nov', income: 85, expense: 45 },
    { month: 'Dec', income: 75, expense: 35 },
  ];

  // Chart Data - Private (Jan - Dec) - Slightly varied for visual feedback
  const privateChartData = [
    { month: 'Jan', income: 30, expense: 15 },
    { month: 'Feb', income: 50, expense: 25 },
    { month: 'Mar', income: 45, expense: 20 },
    { month: 'Apr', income: 90, expense: 50 },
    { month: 'May', income: 75, expense: 40 },
    { month: 'Jun', income: 85, expense: 35 },
    { month: 'Jul', income: 95, expense: 45 },
    { month: 'Aug', income: 110, expense: 60, active: true }, // Active Month
    { month: 'Sep', income: 80, expense: 40 },
    { month: 'Oct', income: 70, expense: 35 },
    { month: 'Nov', income: 65, expense: 30 },
    { month: 'Dec', income: 85, expense: 45 },
  ];

  const currentData = view === 'public' ? publicChartData : privateChartData;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-6">
      
      {/* 1. HERO BANNER & TOGGLES */}
      <div className="relative flex h-40 w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#eef6ff] to-[#baddff] px-8 shadow-sm border border-[#007BFF]/10">
        {/* Abstract Background Shapes mimicking an illustration */}
        <div className="absolute -left-10 -bottom-20 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
        <div className="absolute right-20 -top-10 h-40 w-40 rounded-full bg-[#007BFF]/10 blur-2xl"></div>
        <svg className="absolute bottom-0 left-0 w-full h-16 text-white/50" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
        </svg>

        {/* Banner Content */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#007BFF] shadow-md transition-transform duration-500 hover:scale-105">
            <PlaneTakeoff size={28} className="ml-1" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Airport Billing Overview</h2>
            <p className="text-sm font-medium text-slate-600">
              Currently viewing <span className="font-bold text-[#007BFF]">{view === 'public' ? 'Public' : 'Private'}</span> Flight Metrics.
            </p>
          </div>
        </div>

        {/* Banner Actions (Now View Toggles) */}
        <div className="relative z-10 flex items-center gap-3 bg-white/40 p-1 rounded-xl shadow-sm border border-white/60 backdrop-blur-md">
          <button 
            onClick={() => setView('public')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-[13px] font-bold transition-all duration-300 ${
              view === 'public' 
                ? 'bg-[#007BFF] text-white shadow-md shadow-[#007BFF]/30 scale-100' 
                : 'bg-transparent text-slate-700 hover:bg-white/60 scale-95 opacity-80 hover:opacity-100'
            }`}
          >
            <Activity size={16} /> Public Dash
          </button>
          <button 
            onClick={() => setView('private')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-[13px] font-bold transition-all duration-300 ${
              view === 'private' 
                ? 'bg-[#0f172a] text-white shadow-md shadow-slate-900/30 scale-100' 
                : 'bg-transparent text-slate-700 hover:bg-white/60 scale-95 opacity-80 hover:opacity-100'
            }`}
          >
            <TrendingUp size={16} /> Private Dash
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT BASED ON TOGGLE */}
      {view === 'public' ? (
        // --- PUBLIC FLIGHTS VIEW ---
        <div className="space-y-6 animate-in fade-in zoom-in-[0.98] duration-300">
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <DarkStatCard 
              title="Total Public Revenue" 
              value="₹14,82,900" 
              badge="+12%" 
              subtext="driven by scheduled airlines" 
            />
            <LightStatCard 
              title="Total Scheduled Flights" 
              value="124 Units" 
              badge="+2" 
              subtext="New flights added" 
            />
            <LightStatCard 
              title="Public Parking Income" 
              value="₹2,08,240" 
              badge="-5%" 
              subtext="Compared to last month" 
              badgeColor="bg-red-50 text-red-600 border border-red-100"
            />
            <LightStatCard 
              title="UDF Income" 
              value="₹1,18,240" 
              badge="+8%" 
              subtext="Compared to last month" 
              badgeColor="bg-emerald-50 text-emerald-600 border border-emerald-100"
            />
            <LightStatCard 
              title="" 
              value="₹84,500" 
              badge="+4%" 
              subtext="Watch & overstay charges" 
              badgeColor="bg-[#007BFF]/10 text-[#007BFF]"
            />
          </div>

          {/* CHARTS & SUMMARY ROW */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Cash Flow Chart */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800">Public Cash Flow</h3>
                <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#007BFF]"></span> Total Revenue</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#B0E0E6]"></span> Parking</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span> UDF</div>
                  <select className="ml-2 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none hover:bg-slate-100">
                    <option>1 Year</option>
                    <option>6 Months</option>
                  </select>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="flex h-56 flex-1 items-end justify-between gap-2 px-2">
                {currentData.map((data, index) => (
                  <div key={index} className="group flex flex-1 flex-col items-center gap-3">
                    <div className="relative flex h-full w-full max-w-[28px] flex-col justify-end">
                      <div className={`absolute bottom-0 w-full rounded-md transition-all duration-300 ${data.active ? 'bg-[#007BFF]/20' : 'bg-slate-100 group-hover:bg-slate-200'}`} style={{ height: `${data.income}%` }}></div>
                      <div className={`absolute bottom-0 w-full rounded-md transition-all duration-300 ${data.active ? 'bg-[#007BFF]' : 'bg-[#B0E0E6]/60 group-hover:bg-[#B0E0E6]'}`} style={{ height: `${data.expense}%` }}></div>
                    </div>
                    <span className={`text-[11px] font-bold ${data.active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Monthly Breakdown Summary */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800">August Summary</h3>
                <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">+8% Compared</span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-8">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Total Revenue</span>
                    <span className="text-slate-900">₹ 12,320</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[80%] rounded-full bg-[#007BFF]"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Parking Charges</span>
                    <span className="text-slate-900">₹ 4,540</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[35%] rounded-full bg-[#B0E0E6]"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">UDF Charges</span>
                    <span className="text-[#007BFF]">₹ 7,780</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[45%] rounded-full bg-[#007BFF]/40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // --- PRIVATE FLIGHTS VIEW ---
        <div className="space-y-6 animate-in fade-in zoom-in-[0.98] duration-300">
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <DarkStatCard 
              title="Total Private Revenue" 
              value="₹32,45,000" 
              badge="+24%" 
              subtext="NSOP & Charters" 
            />
            {/* Highlighted Royalty Card */}
            <div className="flex flex-col justify-between rounded-2xl bg-indigo-50 p-5 shadow-sm border border-indigo-200 transition-all duration-300">
              <p className="text-[13px] font-bold text-indigo-600">Royalty Income Total</p>
              <p className="my-3 text-3xl font-extrabold tracking-tight text-indigo-900">₹8,12,000</p>
              <div className="flex items-center gap-2 text-[11px] font-medium text-indigo-500">
                <span className="rounded px-1.5 py-0.5 font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">+15%</span>
                <span>Accumulated base trxns</span>
              </div>
            </div>
            <LightStatCard 
              title="Private Landing & Parking" 
              value="₹24,33,000" 
              badge="+12%" 
              subtext="Base landing & park" 
            />
            <LightStatCard 
              title="UDF Charges" 
              value="₹3,45,000" 
              badge="+14%" 
              subtext="Private pax collections" 
              badgeColor="bg-emerald-50 text-emerald-600 border border-emerald-100"
            />
            <LightStatCard 
              title="Waiting Hours Charge" 
              value="₹1,24,000" 
              badge="+9%" 
              subtext="Watch & extensions" 
              badgeColor="bg-[#007BFF]/10 text-[#007BFF]"
            />
          </div>

          {/* CHARTS & SUMMARY ROW */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Cash Flow Chart */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800">Private / NSOP Cash Flow</h3>
                <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#0f172a]"></span> Total Revenue</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span> Royalty</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span> Landing/Park</div>
                  <select className="ml-2 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none hover:bg-slate-100">
                    <option>1 Year</option>
                    <option>6 Months</option>
                  </select>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="flex h-56 flex-1 items-end justify-between gap-2 px-2">
                {currentData.map((data, index) => (
                  <div key={index} className="group flex flex-1 flex-col items-center gap-3">
                    <div className="relative flex h-full w-full max-w-[28px] flex-col justify-end">
                      <div className={`absolute bottom-0 w-full rounded-md transition-all duration-300 ${data.active ? 'bg-[#0f172a]/20' : 'bg-slate-100 group-hover:bg-slate-200'}`} style={{ height: `${data.income}%` }}></div>
                      <div className={`absolute bottom-0 w-full rounded-md transition-all duration-300 ${data.active ? 'bg-indigo-600' : 'bg-indigo-300 group-hover:bg-indigo-400'}`} style={{ height: `${data.expense}%` }}></div>
                    </div>
                    <span className={`text-[11px] font-bold ${data.active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Monthly Breakdown Summary */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800">August Summary</h3>
                <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">+12% Compared</span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-8">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Total Revenue</span>
                    <span className="text-slate-900">₹ 28,400</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[85%] rounded-full bg-[#0f172a]"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Royalty Income</span>
                    <span className="text-indigo-600">₹ 14,200</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[50%] rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">Landing & Parking</span>
                    <span className="text-slate-900">₹ 14,200</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[50%] rounded-full bg-slate-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}