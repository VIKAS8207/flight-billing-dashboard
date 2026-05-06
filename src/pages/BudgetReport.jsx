import React, { useState } from 'react';
import { IndianRupee, FileText, Filter, Calendar, Download, Building, Wallet, ArrowDownToLine, TrendingUp, LayoutGrid, CalendarDays } from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// Utility to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// --- MOCK DATA ---
const reportData = {
  promisedAmount: 500000000, // 50 Cr
  receivedAmount: 250000000, // 25 Cr
  expenses: [
    { id: 1, date: '2026-04-10', name: 'Infrastructure Maintenance', spent: 90000000, quarter: 'Q1', month: 'April 2026', financialYear: 'FY 2026-27' },
    { id: 2, date: '2026-04-15', name: 'Operational Growth', spent: 60000000, quarter: 'Q1', month: 'April 2026', financialYear: 'FY 2026-27' },
    { id: 3, date: '2026-07-20', name: 'Security & Surveillance', spent: 25000000, quarter: 'Q2', month: 'July 2026', financialYear: 'FY 2026-27' },
    { id: 4, date: '2026-10-22', name: 'Passenger Services', spent: 10000000, quarter: 'Q3', month: 'October 2026', financialYear: 'FY 2026-27' },
    { id: 5, date: '2027-01-05', name: 'IT Upgrades', spent: 5000000, quarter: 'Q4', month: 'January 2027', financialYear: 'FY 2026-27' },
    { id: 6, date: '2026-05-12', name: 'Infrastructure Maintenance', spent: 15000000, quarter: 'Q1', month: 'May 2026', financialYear: 'FY 2026-27' },
    { id: 7, date: '2025-11-10', name: 'IT Upgrades', spent: 8000000, quarter: 'Q3', month: 'November 2025', financialYear: 'FY 2025-26' }, // Older entry for testing Yearly filter
  ]
};

export default function BudgetReport() {
  // Dropdown Management State
  const [openDropdown, setOpenDropdown] = useState(null); // 'head', 'timeMode', or 'subTime'

  // Filter States
  const [headFilter, setHeadFilter] = useState('All Heads');
  const [timeMode, setTimeMode] = useState('All'); // 'All', 'Yearly', 'Quarterly', 'Monthly'
  const [subTimeFilter, setSubTimeFilter] = useState('All'); 

  // Extract unique filter options dynamically from data
  const availableHeads = ['All Heads', ...new Set(reportData.expenses.map(e => e.name))];
  const availableQuarters = [...new Set(reportData.expenses.map(e => e.quarter))].sort();
  const availableMonths = [...new Set(reportData.expenses.map(e => e.month))];
  const availableYears = [...new Set(reportData.expenses.map(e => e.financialYear))].sort();

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleTimeModeChange = (mode) => {
    setTimeMode(mode);
    // Reset the secondary filter to its respective "All" option when primary changes
    if (mode === 'Quarterly') setSubTimeFilter('All Quarters');
    else if (mode === 'Monthly') setSubTimeFilter('All Months');
    else if (mode === 'Yearly') setSubTimeFilter('All Years');
    else setSubTimeFilter('All');
    setOpenDropdown(null);
  };

  // Calculate global totals
  const globalTotalSpent = reportData.expenses.reduce((acc, curr) => acc + curr.spent, 0);
  const remainingAmount = reportData.receivedAmount - globalTotalSpent;

  // 1. Filter the expenses based on selected Head AND specific Time constraints
  const filteredExpenses = reportData.expenses.filter(expense => {
    const matchHead = headFilter === 'All Heads' ? true : expense.name === headFilter;
    
    let matchTime = true;
    if (timeMode === 'Quarterly' && subTimeFilter !== 'All Quarters') matchTime = expense.quarter === subTimeFilter;
    if (timeMode === 'Monthly' && subTimeFilter !== 'All Months') matchTime = expense.month === subTimeFilter;
    if (timeMode === 'Yearly' && subTimeFilter !== 'All Years') matchTime = expense.financialYear === subTimeFilter;
    
    return matchHead && matchTime;
  });

  // 2. Group the filtered expenses for display
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    let key = 'All Expenses';
    if (timeMode === 'Monthly') key = expense.month;
    if (timeMode === 'Quarterly') key = expense.quarter;
    if (timeMode === 'Yearly') key = expense.financialYear;

    if (!acc[key]) acc[key] = [];
    acc[key].push(expense);
    return acc;
  }, {});

  // Calculate total spent for the CURRENTLY selected filter view
  const currentViewTotalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.spent, 0);

  // Simulate downloading the specific report
  const handleDownload = () => {
    const timeString = timeMode === 'All' ? 'All Time' : `${timeMode} (${subTimeFilter})`;
    alert(`Downloading PDF Report...\n\nFilters Applied:\n- Time Period: ${timeString}\n- Expense Head: ${headFilter}\n- Total Records: ${filteredExpenses.length}\n- Total Amount: ${formatCurrency(currentViewTotalSpent)}`);
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-6 font-sans pb-4">
      
      {/* HEADER */}
      <div className="relative p-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef6ff] to-[#d9eeff] rounded-2xl shadow-md border border-[#007BFF]/10 overflow-hidden -z-10">
           <svg className="absolute bottom-0 left-0 w-full h-16 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
          </svg>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Financial Report</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Detailed breakdown of allocations, receipts, and expenditures.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-slate-200 transition-all text-sm font-bold text-slate-700 hover:bg-white hover:text-[#007BFF] hover:border-[#007BFF]"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-[#007BFF]"><Wallet size={16} /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Promised Budget</p>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{formatCurrency(reportData.promisedAmount)}</h3>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><ArrowDownToLine size={16} /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Received</p>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{formatCurrency(reportData.receivedAmount)}</h3>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-500"><TrendingUp size={16} /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              View Total Spent
            </p>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 text-rose-500">{formatCurrency(currentViewTotalSpent)}</h3>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500"><Building size={16} /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Cash Remaining</p>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{formatCurrency(remainingAmount)}</h3>
        </div>
      </div>

      {/* DETAILED REPORT SECTION */}
      <div className="rounded-2xl bg-white border border-slate-100 shadow-xl flex flex-col flex-1 relative z-10 overflow-hidden">
        
        {/* Table Header & Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#007BFF]" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Expenditure Ledger</h3>
          </div>

          {/* Filters Container */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* 1. HEAD FILTER */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('head')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:border-[#007BFF] transition-colors"
              >
                <LayoutGrid size={14} className="text-slate-400" />
                Head: <span className="text-[#007BFF] truncate max-w-[150px]">{headFilter}</span>
              </button>
              
              {openDropdown === 'head' && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {availableHeads.map(h => (
                    <button
                      key={h}
                      onClick={() => { setHeadFilter(h); setOpenDropdown(null); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-[#007BFF] transition-colors truncate ${headFilter === h ? 'text-[#007BFF] bg-blue-50/50' : 'text-slate-600'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PRIMARY TIME FILTER (Mode) */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('timeMode')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:border-[#007BFF] transition-colors"
              >
                <Filter size={14} className="text-slate-400" />
                View: <span className="text-[#007BFF] truncate max-w-[120px]">{timeMode}</span>
              </button>
              
              {openDropdown === 'timeMode' && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden z-50">
                  {['All', 'Yearly', 'Quarterly', 'Monthly'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleTimeModeChange(mode)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-[#007BFF] transition-colors ${timeMode === mode ? 'text-[#007BFF] bg-blue-50/50' : 'text-slate-600'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. SECONDARY TIME FILTER (Conditional based on mode) */}
            {timeMode !== 'All' && (
              <div className="relative animate-in fade-in slide-in-from-left-2 duration-300">
                <button 
                  onClick={() => toggleDropdown('subTime')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#007BFF]/30 rounded-xl text-sm font-bold text-[#007BFF] shadow-sm hover:border-[#007BFF] bg-blue-50/50 transition-colors"
                >
                  <CalendarDays size={14} className="text-[#007BFF]" />
                  <span className="truncate max-w-[150px]">{subTimeFilter}</span>
                </button>
                
                {openDropdown === 'subTime' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                    
                    {/* Render Options based on Time Mode */}
                    {timeMode === 'Quarterly' && ['All Quarters', ...availableQuarters].map(q => (
                      <button
                        key={q}
                        onClick={() => { setSubTimeFilter(q); setOpenDropdown(null); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-[#007BFF] transition-colors ${subTimeFilter === q ? 'text-[#007BFF] bg-blue-50/50' : 'text-slate-600'}`}
                      >
                        {q}
                      </button>
                    ))}

                    {timeMode === 'Monthly' && ['All Months', ...availableMonths].map(m => (
                      <button
                        key={m}
                        onClick={() => { setSubTimeFilter(m); setOpenDropdown(null); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-[#007BFF] transition-colors ${subTimeFilter === m ? 'text-[#007BFF] bg-blue-50/50' : 'text-slate-600'}`}
                      >
                        {m}
                      </button>
                    ))}

                    {timeMode === 'Yearly' && ['All Years', ...availableYears].map(y => (
                      <button
                        key={y}
                        onClick={() => { setSubTimeFilter(y); setOpenDropdown(null); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-[#007BFF] transition-colors ${subTimeFilter === y ? 'text-[#007BFF] bg-blue-50/50' : 'text-slate-600'}`}
                      >
                        {y}
                      </button>
                    ))}

                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1 p-6">
          {Object.keys(groupedExpenses).length === 0 ? (
            <div className="text-center py-10 text-sm font-medium text-slate-400 italic">
              No expenses found for this selection.
            </div>
          ) : (
            Object.entries(groupedExpenses).map(([groupName, expenses]) => (
              <div key={groupName} className="mb-8 last:mb-0">
                {timeMode !== 'All' && (
                  <div className="flex items-center gap-2 mb-4 text-[#007BFF] bg-blue-50 py-1.5 px-3 rounded-lg inline-flex">
                    <Calendar size={14} />
                    <span className="text-xs font-extrabold uppercase tracking-widest">{groupName}</span>
                  </div>
                )}

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2 w-1/4">Date</th>
                      <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-1/2">Expense Head</th>
                      <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right pr-2 w-1/4">Amount Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => (
                      <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 pl-2">
                          <span className="text-sm font-semibold text-slate-600">{formatDate(expense.date)}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-[#007BFF] transition-colors">{expense.name}</span>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <span className="text-sm font-extrabold text-slate-900">{formatCurrency(expense.spent)}</span>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Subtotal row for grouped views */}
                    {timeMode !== 'All' && (
                      <tr className="bg-slate-50/80">
                        <td colSpan="2" className="py-3 pl-2 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {groupName} Subtotal:
                        </td>
                        <td className="py-3 pr-2 text-right text-sm font-extrabold text-[#007BFF]">
                          {formatCurrency(expenses.reduce((acc, curr) => acc + curr.spent, 0))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}