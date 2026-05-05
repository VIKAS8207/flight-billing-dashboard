import React, { useState, useEffect, useRef } from 'react';
import { 
  IndianRupee, Save, Plus, Trash2, History, 
  CheckCircle2, AlertCircle, Clock, Building, Wallet, ArrowDownToLine, PieChart, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function BudgetMaster() {
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableYears = ['2025-26', '2026-27', '2027-28'];

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- NEW SIMPLIFIED FORM STATES ---
  const [promisedAmount, setPromisedAmount] = useState(500000000); // 50 Cr
  const [receivedAmount, setReceivedAmount] = useState(250000000); // 25 Cr
  
  // Dynamic Heads State (Date, Name and Spent Amount)
  const [heads, setHeads] = useState([
    { id: 1, date: '2026-04-10', name: 'Infrastructure Maintenance', spent: 90000000 },
    { id: 2, date: '2026-04-15', name: 'Operational Growth', spent: 60000000 },
    { id: 3, date: '2026-04-20', name: 'Security & Surveillance', spent: 25000000 },
    { id: 4, date: '2026-04-22', name: 'Passenger Services', spent: 10000000 },
  ]);

  // Audit Log State
  const [auditLog, setAuditLog] = useState([
    {
      id: 101,
      date: '01 Apr 2026',
      time: '10:00 AM',
      action: 'FY 2026-27 Initial Data Seeded',
      user: 'Admin (System)'
    }
  ]);

  // --- REAL-TIME CALCULATIONS ---
  const totalSpent = heads.reduce((acc, curr) => acc + (Number(curr.spent) || 0), 0);
  const remainingReceived = Number(receivedAmount) - totalSpent;
  
  // Health checks
  const isOverSpentReceived = totalSpent > Number(receivedAmount);
  const isOverSpentPromised = totalSpent > Number(promisedAmount);
  const spentPercentage = Number(receivedAmount) > 0 ? (totalSpent / Number(receivedAmount)) * 100 : 0;

  // --- HANDLERS ---
  const handleAddHead = () => {
    const newId = heads.length ? Math.max(...heads.map(h => h.id)) + 1 : 1;
    // Added date field and pushed to the TOP of the array
    setHeads([{ id: newId, date: '', name: '', spent: 0 }, ...heads]);
  };

  const handleRemoveHead = (id) => {
    setHeads(heads.filter(h => h.id !== id));
  };

  const handleHeadChange = (id, field, value) => {
    setHeads(heads.map(h => 
      h.id === id ? { ...h, [field]: field === 'spent' ? Number(value) : value } : h
    ));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Basic Validation: Ensure both Date and Name are filled
    const hasEmptyFields = heads.some(h => h.name.trim() === '' || h.date.trim() === '');
    if (hasEmptyFields) {
      return alert("Please provide a Date and Name for all Expense Heads.");
    }

    if (isOverSpentPromised) {
       const proceed = window.confirm("Warning: Total spent exceeds the PROMISED annual amount. Do you want to save anyway?");
       if (!proceed) return;
    }

    // Log the save action
    const now = new Date();
    const newLog = {
      id: Date.now(),
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      action: `Updated Budget Master for FY ${selectedYear}`,
      user: 'Terminal Manager (Active)'
    };

    setAuditLog([newLog, ...auditLog]);
    alert('Master data published successfully! Changes will reflect on the Tracking Dashboard.');
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-6 font-sans pb-4">
      
      {/* HEADER CONTAINER */}
      <div className="relative p-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef6ff] to-[#d9eeff] rounded-2xl shadow-md border border-[#007BFF]/10 overflow-hidden -z-10">
          <svg className="absolute bottom-0 left-0 w-full h-16 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
            <path d="M0 54H1440V34.5C1440 34.5 1320 8.5 1176 16.5C1032 24.5 960 44.5 816 38.5C672 32.5 612 8.5 468 12.5C324 16.5 216 46.5 72 46.5C28.8 46.5 0 34.5 0 34.5V54Z" />
          </svg>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Budget Master</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Configure global funds and define departmental expense heads.</p>
        </div>

        {/* Buttons and Dropdown Container */}
        <div className="flex items-center gap-3">
          
          {/* Download Report Button */}
          <button>
            <Link to="/budget-report"
              className="flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-slate-200 transition-all text-sm font-bold text-slate-700 hover:bg-white hover:text-[#007BFF] hover:border-[#007BFF]"
            >
            <Download size={16} />
            <span className="hidden sm:inline">Download Report</span>
            </Link>
          </button>

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

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* LEFT COLUMN: Input Forms (Spans 2 cols) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          <form id="master-form" onSubmit={handleSave} className="flex flex-col gap-6">
            
            {/* 1. Global Funding Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#007BFF]">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Global Funding</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Set promised and received macro budgets</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Promised Input */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Total Promised Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                      <IndianRupee size={20} />
                    </div>
                    <input 
                      type="number" 
                      value={promisedAmount}
                      onChange={(e) => setPromisedAmount(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 font-extrabold outline-none focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 transition-all text-xl"
                    />
                  </div>
                </div>

                {/* Received Input */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-emerald-600 uppercase tracking-wider">Amount Received Till Now</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-500">
                      <IndianRupee size={20} />
                    </div>
                    <input 
                      type="number" 
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(Number(e.target.value))}
                      className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 py-4 pl-12 pr-4 text-slate-900 font-extrabold outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Expense Heads Master */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Expense Heads</h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Create heads and record expenditures</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleAddHead}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-xs"
                >
                  <Plus size={14} /> Add Head
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {heads.map((head, index) => (
                  <div key={head.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all group">
                    <div className="flex items-center justify-center h-11 w-10 bg-slate-100 rounded-lg text-slate-400 font-bold text-xs shrink-0 mt-6">
                      {index + 1}
                    </div>
                    
                    {/* Updated to 3 columns to include Date */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Date Input */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
                        <input 
                          type="date" 
                          value={head.date}
                          onChange={(e) => handleHeadChange(head.id, 'date', e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-slate-900 font-bold outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all text-sm shadow-sm"
                        />
                      </div>

                      {/* Name Input */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department / Head Name</label>
                        <input 
                          type="text" 
                          value={head.name}
                          onChange={(e) => handleHeadChange(head.id, 'name', e.target.value)}
                          placeholder="e.g. IT Infrastructure"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-slate-900 font-bold outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all text-sm shadow-sm"
                        />
                      </div>
                      
                      {/* Spent Input */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount Spent (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            <IndianRupee size={14} />
                          </div>
                          <input 
                            type="number" 
                            value={head.spent}
                            onChange={(e) => handleHeadChange(head.id, 'spent', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-slate-900 font-bold outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-all text-sm shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleRemoveHead(head.id)}
                      className="mt-6 p-2.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-colors shrink-0"
                      title="Remove Head"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {heads.length === 0 && (
                  <div className="text-center py-10 text-sm font-medium text-slate-400 italic border-2 border-dashed border-slate-200 rounded-xl">
                    No expense heads created yet. Click "Add Head" to begin.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 pb-4">
               <button 
                type="submit"
                form="master-form"
                className="flex h-12 items-center gap-2 rounded-xl bg-[#007BFF] px-8 text-sm font-bold text-white shadow-md shadow-[#007BFF]/20 transition-all hover:bg-blue-600 hover:scale-[1.02]"
              >
                <Save size={18} /> Publish Master Data
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Utilization & Audit History */}
        <div className="col-span-1 flex flex-col gap-6 h-full">
          
          {/* Fund Utilization Summary */}
          <div className="rounded-2xl border border-slate-100 bg-slate-900 p-6 shadow-xl text-white shrink-0">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <PieChart size={16} /> Fund Utilization Check
            </h3>
            
            <div className="space-y-5">
              {/* Total Spent vs Received Bar */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300">Spent vs Received</span>
                  {isOverSpentReceived ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-400/10 px-2 py-0.5 rounded">
                      <AlertCircle size={12}/> Overspent
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {spentPercentage.toFixed(1)}% Used
                    </span>
                  )}
                </div>
                
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-500 ${isOverSpentReceived ? 'bg-rose-500' : 'bg-[#3B82F6]'}`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Spent</p>
                  <p className={`text-sm font-bold ${isOverSpentReceived ? 'text-rose-400' : 'text-white'}`}>
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Remaining (Cash)</p>
                  <p className="text-sm font-bold text-emerald-400">
                    {formatCurrency(Math.max(remainingReceived, 0))}
                  </p>
                </div>
              </div>

              {/* Master Warnings */}
              {isOverSpentPromised && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex gap-3 text-rose-400 items-start">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">
                    <strong>Critical:</strong> Total expenditures have exceeded the overall annual promised amount.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex flex-col flex-1 min-h-[350px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <History size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">Master Audit Log</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>

              <div className="flex flex-col gap-6">
                {auditLog.map((log) => (
                  <div key={log.id} className="relative pl-10">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[#007BFF]"></div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                      <div className="font-bold text-[13px] text-slate-800 leading-tight mb-2">{log.action}</div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/60">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{log.user}</div>
                        <div className="text-[10px] flex items-center justify-end gap-1 text-slate-500 font-medium">
                          <Clock size={10} /> {log.date}, {log.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}