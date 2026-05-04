import React, { useState, useEffect, useRef } from 'react';
import { 
  IndianRupee, Save, Plus, Trash2, History, Briefcase, 
  PieChart, CalendarDays, AlertCircle, CheckCircle2, Clock 
} from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function BudgetMaster() {
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Missing array added here:
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

  // --- FORM STATES ---
  const [annualBudget, setAnnualBudget] = useState(500000000); // 50 Cr
  
  // Updated Quarters state to hold both allocated and spent
  const [quarters, setQuarters] = useState({
    Q1: { allocated: 100000000, spent: 85000000 },
    Q2: { allocated: 120000000, spent: 10000000 },
    Q3: { allocated: 150000000, spent: 0 },
    Q4: { allocated: 130000000, spent: 0 },
  });

  // Updated Departments state to hold both allocated and received/spent
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Infrastructure Maintenance', allocated: 200000000, received: 175000000 },
    { id: 2, name: 'Operational Growth', allocated: 150000000, received: 110000000 },
    { id: 3, name: 'Security & Surveillance', allocated: 80000000, received: 75000000 },
    { id: 4, name: 'Passenger Services', allocated: 70000000, received: 60000000 },
  ]);

  // Audit Log State
  const [auditLog, setAuditLog] = useState([
    {
      id: 101,
      date: '01 Apr 2026',
      time: '10:00 AM',
      action: 'FY 2026-27 Initial Budget Allocated',
      user: 'Admin (System)'
    }
  ]);

  // --- CALCULATIONS ---
  // We check validation against the 'allocated' amounts
  const totalQuarterlyAllocated = Object.values(quarters).reduce((acc, curr) => acc + (Number(curr.allocated) || 0), 0);
  const totalDepartmentalAllocated = departments.reduce((acc, curr) => acc + (Number(curr.allocated) || 0), 0);
  
  const isQuarterlyBalanced = totalQuarterlyAllocated === Number(annualBudget);
  const isDepartmentalBalanced = totalDepartmentalAllocated === Number(annualBudget);

  // --- HANDLERS ---
  const handleQuarterChange = (q, field, value) => {
    setQuarters({
      ...quarters,
      [q]: { ...quarters[q], [field]: Number(value) }
    });
  };

  const handleAddDepartment = () => {
    const newId = departments.length ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    setDepartments([...departments, { id: newId, name: '', allocated: 0, received: 0 }]);
  };

  const handleRemoveDepartment = (id) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const handleDepartmentChange = (id, field, value) => {
    setDepartments(departments.map(d => 
      d.id === id ? { ...d, [field]: (field === 'allocated' || field === 'received') ? Number(value) : value } : d
    ));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isQuarterlyBalanced) {
      return alert("Cannot save: Quarterly allocation does not match Total Annual Budget.");
    }
    if (!isDepartmentalBalanced) {
      return alert("Cannot save: Departmental allocation does not match Total Annual Budget.");
    }

    const hasEmptyDeptName = departments.some(d => d.name.trim() === '');
    if (hasEmptyDeptName) {
      return alert("Please provide a name for all departments.");
    }

    const now = new Date();
    const newLog = {
      id: Date.now(),
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      action: `Updated Allocations & Spendings for FY ${selectedYear}`,
      user: 'Terminal Manager (Active)'
    };

    setAuditLog([newLog, ...auditLog]);
    alert('Budget Master updated successfully! Changes will reflect in Budget Tracking.');
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
          <p className="text-sm text-slate-600 font-medium mt-1">Configure annual allocations, quarterly splits, and dynamic department heads.</p>
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

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* LEFT COLUMN: Input Forms (Spans 2 cols) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <form id="budget-form" onSubmit={handleSave} className="flex flex-col gap-6">
            
            {/* 1. Master Budget Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl relative overflow-hidden group shrink-0">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-[#007BFF] pointer-events-none">
                <PieChart size={120} />
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#007BFF]">
                  <PieChart size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Total Annual Budget</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross allocation for the year</p>
                </div>
              </div>

              <div className="relative z-10 max-w-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <IndianRupee size={20} />
                  </div>
                  <input 
                    type="number" 
                    value={annualBudget}
                    onChange={(e) => setAnnualBudget(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 font-extrabold outline-none focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 transition-all text-2xl"
                  />
                </div>
              </div>
            </div>

            {/* 2. Quarterly Distribution */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Quarterly Tranches</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Distribute total budget and track spending across 4 quarters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                  <div key={q} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white transition-colors group">
                    <div className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200/60">{q} Snapshot</div>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Allocated (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                            <IndianRupee size={12} />
                          </div>
                          <input 
                            type="number" 
                            value={quarters[q].allocated}
                            onChange={(e) => handleQuarterChange(q, 'allocated', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-2 text-slate-900 font-bold outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all text-sm shadow-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Spent (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                            <IndianRupee size={12} />
                          </div>
                          <input 
                            type="number" 
                            value={quarters[q].spent}
                            onChange={(e) => handleQuarterChange(q, 'spent', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-2 text-slate-900 font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all text-sm shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Departmental Distribution (Dynamic) */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shrink-0">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Departmental Head Allocations</h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assign budgets and track receipts per head</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleAddDepartment}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-xs"
                >
                  <Plus size={14} /> Add Head
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {departments.map((dept, index) => (
                  <div key={dept.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all group">
                    <div className="flex items-center justify-center h-11 w-10 bg-slate-100 rounded-lg text-slate-400 font-bold text-xs shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Head Name</label>
                        <input 
                          type="text" 
                          value={dept.name}
                          onChange={(e) => handleDepartmentChange(dept.id, 'name', e.target.value)}
                          placeholder="e.g. VIP Lounge"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-slate-900 font-bold outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Allocated (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            <IndianRupee size={14} />
                          </div>
                          <input 
                            type="number" 
                            value={dept.allocated}
                            onChange={(e) => handleDepartmentChange(dept.id, 'allocated', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-slate-900 font-bold outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Received (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            <IndianRupee size={14} />
                          </div>
                          <input 
                            type="number" 
                            value={dept.received}
                            onChange={(e) => handleDepartmentChange(dept.id, 'received', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleRemoveDepartment(dept.id)}
                      className="mt-6 p-2.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-colors shrink-0"
                      title="Remove Department"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {departments.length === 0 && (
                  <div className="text-center py-6 text-sm font-medium text-slate-500">
                    No departments added. Click "Add Head" to start.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 pb-4">
               <button 
                type="submit"
                form="budget-form"
                className="flex h-12 items-center gap-2 rounded-xl bg-[#007BFF] px-8 text-sm font-bold text-white shadow-md shadow-[#007BFF]/20 transition-all hover:bg-blue-600 hover:scale-[1.02]"
              >
                <Save size={18} /> Publish Master Budget
              </button>
            </div>
          </form>

        </div>

        {/* RIGHT COLUMN: Summary & Audit History (Spans 1 col) */}
        <div className="col-span-1 flex flex-col gap-6 h-full">
          
          {/* Mathematical Validation Summary */}
          <div className="rounded-2xl border border-slate-100 bg-slate-900 p-6 shadow-xl text-white shrink-0">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6">Validation Summary</h3>
            
            <div className="space-y-6">
              {/* Quarterly Check */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300">Quarterly Allocation</span>
                  {isQuarterlyBalanced ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded"><CheckCircle2 size={12}/> Balanced</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-400/10 px-2 py-0.5 rounded"><AlertCircle size={12}/> Mismatch</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-b border-slate-700 pb-2">
                  <span>Sum of Allocated Q1-Q4:</span>
                  <span className={isQuarterlyBalanced ? 'text-white' : 'text-rose-400'}>{formatCurrency(totalQuarterlyAllocated)}</span>
                </div>
              </div>

              {/* Departmental Check */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300">Departmental Allocation</span>
                  {isDepartmentalBalanced ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded"><CheckCircle2 size={12}/> Balanced</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-400/10 px-2 py-0.5 rounded"><AlertCircle size={12}/> Mismatch</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-b border-slate-700 pb-2">
                  <span>Sum of Allocated Heads:</span>
                  <span className={isDepartmentalBalanced ? 'text-white' : 'text-rose-400'}>{formatCurrency(totalDepartmentalAllocated)}</span>
                </div>
              </div>

              {/* Master Display */}
              <div className="bg-slate-800 rounded-xl p-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Annual Budget</span>
                <span className="text-xl font-extrabold tracking-tight text-[#3B82F6]">{formatCurrency(annualBudget)}</span>
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex flex-col flex-1 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
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