import React, { useState, useEffect, useRef } from 'react';
// FIX 1: Added 'Download' to the imports
import { IndianRupee, TrendingUp, CheckCircle2, LayoutGrid, ArrowDownToLine, Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

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
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- STYLISH GRADIENTS FOR BARS ---
const chartGradients = [
  'bg-gradient-to-r from-[#007BFF] to-[#60A5FA]', // Blue
  'bg-gradient-to-r from-[#10B981] to-[#34D399]', // Emerald
  'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]', // Purple
  'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]', // Amber
  'bg-gradient-to-r from-[#F43F5E] to-[#FB7185]', // Rose
  'bg-gradient-to-r from-[#06B6D4] to-[#22D3EE]', // Cyan
  'bg-gradient-to-r from-[#6366F1] to-[#818CF8]'  // Indigo
];

// --- RESTRUCTURED MOCK DATA ---
const yearlyData = {
  '2025-26': {
    promisedAmount: 450000000,
    receivedAmount: 420000000,
    heads: [
      { id: 1, name: 'Infrastructure Maintenance', spent: 175000000 },
      { id: 2, name: 'Operational Growth', spent: 110000000 },
      { id: 3, name: 'Security & Surveillance', spent: 75000000 },
      { id: 4, name: 'Passenger Services', spent: 60000000 },
    ]
  },
  '2026-27': {
    promisedAmount: 500000000,
    receivedAmount: 250000000,
    heads: [
      { id: 1, name: 'Infrastructure Maintenance', spent: 90000000 },
      { id: 2, name: 'Operational Growth', spent: 60000000 },
      { id: 3, name: 'Security & Surveillance', spent: 25000000 },
      { id: 4, name: 'Passenger Services', spent: 10000000 },
      { id: 5, name: 'IT & Digital Infrastructure', spent: 45000000 }, 
    ]
  },
  '2027-28': {
    promisedAmount: 600000000,
    receivedAmount: 50000000,
    heads: [
      { id: 1, name: 'Infrastructure Maintenance', spent: 15000000 },
      { id: 2, name: 'Advance Equipment Booking', spent: 25000000 },
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
  const { promisedAmount, receivedAmount, heads } = currentData;

  const animatedPromised = useCountUp(promisedAmount);
  const animatedReceived = useCountUp(receivedAmount);

  const availableYears = Object.keys(yearlyData);

  // Math for Dynamic Graph (Find the highest spent amount to scale the bars)
  const maxSpent = Math.max(...heads.map(h => h.spent), 1); 

  return (
    <div className="flex min-h-full w-full flex-col gap-6 font-sans pb-4">
      
      {/* ==========================================
          HEADER
          ========================================== */}
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

        {/* FIX 2: Wrapped buttons nicely in a flex container */}
        <div className="flex items-center gap-3 relative z-50">
          
          {/* FIX 3: Removed <button> wrapper and updated colors to blue */}
          <Link 
            to="/budget-report"
            className="flex items-center gap-2 rounded-xl bg-[#007BFF] px-4 py-2 shadow-md transition-all text-sm font-bold text-white hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download Report</span>
          </Link>

          {/* Custom Financial Year Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm border transition-all text-sm font-bold text-slate-700 hover:bg-white ${isDropdownOpen ? 'border-[#007BFF] ring-2 ring-[#007BFF]/20' : 'border-white'}`}
            >
              FY {selectedYear}
              <svg className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#007BFF]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

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
      </div>

      {/* ==========================================
          CONTENT AREA
          ========================================== */}
      
      {/* 1. TOP CARDS: Promised vs Received */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="text-[#007BFF]" size={28} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Total Promised Annual Income</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatCurrency(animatedPromised)}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="text-emerald-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Amount Received Till Now</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatCurrency(animatedReceived)}
            </h3>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID: Graph & Heads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* ==========================================
            LEFT: STYLISH EXPENSE GRAPH
            ========================================== */}
        <div className="rounded-2xl bg-white border border-slate-100 p-8 shadow-lg shadow-slate-200/40 flex flex-col relative overflow-hidden group">
          
          {/* Decorative Ambient Gradients (Blobs) */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-[#007BFF]/10 to-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000 ease-in-out"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-[#10B981]/10 to-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000 ease-in-out"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <TrendingUp size={18} className="text-[#007BFF]" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800">Expense Analysis</h3>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center gap-7">
            {heads.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-10">No expenses recorded yet.</p>
            ) : (
              heads.map((head, index) => {
                // Calculate percentage relative to the highest expense for dynamic scaling
                const widthPercent = (head.spent / maxSpent) * 100;
                const barGradient = chartGradients[index % chartGradients.length];

                return (
                  <div key={head.id} className="relative group/item">
                    <div className="flex justify-between items-end mb-2.5">
                      <span className="text-[13px] font-bold text-slate-600 truncate pr-4 group-hover/item:text-[#007BFF] transition-colors duration-300">
                        {head.name}
                      </span>
                      <span className="text-[14px] font-extrabold text-slate-900 shrink-0 tabular-nums">
                        {formatCurrency(head.spent)}
                      </span>
                    </div>
                    
                    {/* Stylish Graph Bar */}
                    <div className="h-2.5 w-full bg-slate-100/80 rounded-full overflow-hidden shadow-inner relative backdrop-blur-sm">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${barGradient} shadow-sm`}
                        style={{ width: `${widthPercent}%` }}
                      >
                        {/* Subtle inner shine for the gradient bar */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40"></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Simple Department Heads List */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm flex flex-col max-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid size={18} className="text-slate-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Expense Heads</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                {heads.length} Heads
              </span>
              <Link 
                to="/budget-master"
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-xs"
              >
                <Plus size={14} /> Add Head
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {heads.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-10">Waiting for data from Master...</p>
            ) : (
              heads.map((head, index) => (
                <div 
                  key={head.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Small color indicator matching the stylish graph */}
                    <div className={`h-3 w-3 rounded-full shadow-sm ${chartGradients[index % chartGradients.length]}`} />
                    <h4 className="text-sm font-bold text-slate-800">{head.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Spent</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(head.spent)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
