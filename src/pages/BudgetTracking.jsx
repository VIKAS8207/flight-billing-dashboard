import React, { useState, useEffect, useRef } from 'react';
import { IndianRupee, TrendingUp, AlertCircle, Wrench, Shield, Plane, Briefcase } from 'lucide-react';

// --- CUSTOM ANIMATION HOOK ---
const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };
    animationFrame = window.requestAnimationFrame(animate);
    
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

// Utility to format currency
const formatCrores = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- MULTI-YEAR MOCK DATA ---
const yearlyData = {
  '2025-26': {
    annualFund: 450000000,
    totalSpent: 420000000,
    quarters: [
      { id: 'Q1', months: 'Apr - Jun', allocated: 100000000, spent: 100000000, status: 'Completed' },
      { id: 'Q2', months: 'Jul - Sep', allocated: 120000000, spent: 115000000, status: 'Completed' },
      { id: 'Q3', months: 'Oct - Dec', allocated: 130000000, spent: 125000000, status: 'Completed' },
      { id: 'Q4', months: 'Jan - Mar', allocated: 100000000, spent: 80000000, status: 'Completed' },
    ],
    departments: [
      { name: 'Infrastructure Maintenance', icon: <Wrench size={18}/>, allocated: 180000000, spent: 175000000 },
      { name: 'Operational Growth', icon: <TrendingUp size={18}/>, allocated: 120000000, spent: 110000000 },
      { name: 'Security & Surveillance', icon: <Shield size={18}/>, allocated: 80000000, spent: 75000000 },
      { name: 'Passenger Services', icon: <Plane size={18}/>, allocated: 70000000, spent: 60000000 },
    ]
  },
  '2026-27': {
    annualFund: 500000000,
    totalSpent: 185000000,
    quarters: [
      { id: 'Q1', months: 'Apr - Jun', allocated: 100000000, spent: 85000000, status: 'Completed' },
      { id: 'Q2', months: 'Jul - Sep', allocated: 120000000, spent: 100000000, status: 'Active' },
      { id: 'Q3', months: 'Oct - Dec', allocated: 150000000, spent: 0, status: 'Upcoming' },
      { id: 'Q4', months: 'Jan - Mar', allocated: 130000000, spent: 0, status: 'Planned' },
    ],
    departments: [
      { name: 'Infrastructure Maintenance', icon: <Wrench size={18}/>, allocated: 200000000, spent: 90000000 },
      { name: 'Operational Growth', icon: <TrendingUp size={18}/>, allocated: 150000000, spent: 60000000 },
      { name: 'Security & Surveillance', icon: <Shield size={18}/>, allocated: 80000000, spent: 25000000 },
      { name: 'Passenger Services', icon: <Plane size={18}/>, allocated: 70000000, spent: 10000000 },
    ]
  },
  '2027-28': {
    annualFund: 600000000,
    totalSpent: 0,
    quarters: [
      { id: 'Q1', months: 'Apr - Jun', allocated: 150000000, spent: 0, status: 'Planned' },
      { id: 'Q2', months: 'Jul - Sep', allocated: 150000000, spent: 0, status: 'Planned' },
      { id: 'Q3', months: 'Oct - Dec', allocated: 150000000, spent: 0, status: 'Planned' },
      { id: 'Q4', months: 'Jan - Mar', allocated: 150000000, spent: 0, status: 'Planned' },
    ],
    departments: [
      { name: 'Infrastructure Maintenance', icon: <Wrench size={18}/>, allocated: 250000000, spent: 0 },
      { name: 'Operational Growth', icon: <TrendingUp size={18}/>, allocated: 150000000, spent: 0 },
      { name: 'Security & Surveillance', icon: <Shield size={18}/>, allocated: 100000000, spent: 0 },
      { name: 'Passenger Services', icon: <Plane size={18}/>, allocated: 100000000, spent: 0 },
    ]
  }
};

export default function BudgetTracking() {
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const currentData = yearlyData[selectedYear];
  const { annualFund, totalSpent, quarters, departments } = currentData;

  const animatedAnnual = useCountUp(annualFund);
  const percentUsed = (totalSpent / annualFund) * 100;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentUsed / 100) * circumference;

  const availableYears = ['2025-26', '2026-27', '2027-28'];

  return (
    <div className="flex min-h-full w-full flex-col gap-6 font-sans pb-4">
      
      {/* HEADER */}
      <div className="relative p-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef6ff] to-[#d9eeff] rounded-2xl shadow-md border border-[#007BFF]/10 overflow-hidden -z-10">
          <svg className="absolute bottom-0 left-0 w-full h-16 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
            <path d="M0 54H1440V34.5C1440 34.5 1320 8.5 1176 16.5C1032 24.5 960 44.5 816 38.5C672 32.5 612 8.5 468 12.5C324 16.5 216 46.5 72 46.5C28.8 46.5 0 34.5 0 34.5V54Z" />
          </svg>
        </div>
        
        <div className="relative">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Financial Flow</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Macro budget allocations and micro departmental burn rates.</p>
        </div>

        {/* Custom Financial Year Dropdown */}
        <div className="relative z-50" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm border transition-all text-sm font-bold text-slate-700 hover:bg-white ${isDropdownOpen ? 'border-[#007BFF] ring-2 ring-[#007BFF]/20' : 'border-white'}`}
          >
            FY {selectedYear}
            <svg className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#007BFF]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Absolute Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-[10px] shadow-xl border border-slate-100 overflow-hidden z-[100]">
              <div className="flex flex-col">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                      selectedYear === year 
                        ? 'bg-blue-50 text-[#007BFF]' 
                        : 'text-slate-600 hover:bg-[#F0F8FF] hover:text-[#007BFF]'
                    }`}
                  >
                    FY {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BENTO BOX GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* --- LEFT COLUMN (Macro & Mid View) --- */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. Macro View: Annual Fund Hero Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#007BFF] to-[#3b9aff] p-8 shadow-xl shadow-[#007BFF]/20 flex items-center justify-between overflow-hidden group">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full border-[20px] border-white/10 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-10 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-100 mb-2">Total Annual Budget ({selectedYear})</p>
              <h3 className="text-5xl font-extrabold tracking-tight tabular-nums">
                {formatCrores(animatedAnnual)}
              </h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-md text-sm font-semibold">
                  <TrendingUp size={16} /> Disbursed: {formatCrores(totalSpent)}
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <svg className="h-36 w-36 transform -rotate-90">
                <circle cx="72" cy="72" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
                <circle 
                  cx="72" cy="72" r={radius} 
                  stroke="white" strokeWidth="12" fill="none" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{percentUsed.toFixed(1)}%</span>
                <span className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Burned</span>
              </div>
            </div>
          </div>

          {/* 2. Mid View: Quarterly Tranches */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex-1 flex flex-col">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-6">Tranche Distribution Flow</h3>
            
            <div className="flex flex-col gap-4 flex-1">
              {quarters.map((q) => {
                const getStatusColor = (status) => {
                  if (status === 'Active') return 'bg-emerald-100 text-emerald-700';
                  if (status === 'Completed') return 'bg-slate-100 text-slate-600';
                  if (status === 'Upcoming') return 'bg-blue-100 text-[#007BFF]';
                  return 'bg-amber-100 text-amber-700';
                };

                return (
                  <div 
                    key={q.id} 
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-xl">
                      {q.id}
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[14px] font-bold text-slate-800">{q.months}</h4>
                        <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(q.status)}`}>
                          {q.status}
                        </span>
                      </div>
                      
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-slate-800">{formatCrores(q.allocated)}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Spent: {formatCrores(q.spent)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Micro View: Departments) --- */}
        <div className="col-span-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Departmental Burn (Annual)</h3>
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
              <Briefcase size={14} className="text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {departments.map((dept, index) => {
              const spentRatio = dept.allocated > 0 ? (dept.spent / dept.allocated) * 100 : 0;
              const isWarning = spentRatio > 85;
              const isDanger = spentRatio > 95;

              let barColor = 'bg-[#007BFF]';
              if (isDanger) barColor = 'bg-rose-500';
              else if (isWarning) barColor = 'bg-amber-500';

              return (
                <div key={index} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                      {dept.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{dept.name}</h4>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Budget: {formatCrores(dept.allocated)}</p>
                    </div>
                    {isWarning && <AlertCircle size={16} className={isDanger ? 'text-rose-500' : 'text-amber-500'} />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className={isDanger ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-700'}>
                        {formatCrores(dept.spent)}
                      </span>
                      <span className="text-slate-400">{spentRatio.toFixed(0)}%</span>
                    </div>
                    
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden relative">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} 
                        style={{ width: `${Math.min(spentRatio, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}