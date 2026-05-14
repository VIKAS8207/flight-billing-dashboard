import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Send, FileDown, ChevronDown, ChevronLeft, ChevronRight, Plane, Building, Calendar 
} from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Expanded Mock Data - Updated to reflect Month-Wise billing consolidation
const initialInvoices = [
  { id: 'PUB-2026-015', airline: 'Air India', category: 'Public', type: 'UDF', billingMonths: 'May 2026', date: '08 May 2026', amount: 145000, status: 'Saved' },
  { id: 'PUB-2026-014', airline: 'IndiGo Airlines', category: 'Public', type: 'Watch Ext.', billingMonths: 'April, May 2026', date: '08 May 2026', amount: 85000, status: 'Awaiting Payment' },
  { id: 'NSOP-2026-013', airline: 'Charter Jets Pvt Ltd', category: 'Private', type: 'Royalty', billingMonths: 'May 2026', date: '07 May 2026', amount: 22000, status: 'Paid' },
  { id: 'PUB-2026-012', airline: 'Alliance Air Aviation', category: 'Public', type: 'Parking', billingMonths: 'April 2026', date: '07 May 2026', amount: 67000, status: 'Saved' },
  { id: 'PUB-2026-011', airline: 'IndiGo Airlines', category: 'Public', type: 'UDF', billingMonths: 'March 2026', date: '06 May 2026', amount: 110000, status: 'Awaiting Payment' },
  { id: 'NSOP-2026-010', airline: 'Executive Airways', category: 'Private', type: 'Detail', billingMonths: 'February 2026', date: '06 May 2026', amount: 35000, status: 'Paid' },
  { id: 'PUB-2026-009', airline: 'Air India', category: 'Public', type: 'Parking', billingMonths: 'February, March 2026', date: '06 May 2026', amount: 95000, status: 'Saved' },
  { id: 'NSOP-2026-008', airline: 'Reliance Transport', category: 'Private', type: 'Detail', billingMonths: 'March 2026', date: '05 May 2026', amount: 41000, status: 'Saved' },
  { id: 'PUB-2026-007', airline: 'IndiGo Airlines', category: 'Public', type: 'Watch Ext.', billingMonths: 'February 2026', date: '05 May 2026', amount: 105000, status: 'Awaiting Payment' },
  { id: 'PUB-2026-006', airline: 'Alliance Air Aviation', category: 'Public', type: 'UDF', billingMonths: 'January 2026', date: '04 May 2026', amount: 52000, status: 'Paid' },
  { id: 'PUB-2026-005', airline: 'Alliance Air Aviation', category: 'Public', type: 'Parking', billingMonths: 'January 2026', date: '04 May 2026', amount: 45000, status: 'Saved' },
  { id: 'PUB-2026-004', airline: 'IndiGo Airlines', category: 'Public', type: 'UDF', billingMonths: 'January 2026', date: '03 May 2026', amount: 125000, status: 'Awaiting Payment' },
  { id: 'PUB-2026-003', airline: 'Air India', category: 'Public', type: 'Watch Ext.', billingMonths: 'January 2026', date: '01 May 2026', amount: 89000, status: 'Paid' },
  { id: 'NSOP-2026-002', airline: 'Aureya Aviation Pvt Ltd', category: 'Private', type: 'Royalty', billingMonths: 'January 2026', date: '28 Apr 2026', amount: 32000, status: 'Awaiting Payment' },
  { id: 'PUB-2026-001', airline: 'IndiGo Airlines', category: 'Public', type: 'Parking', billingMonths: 'December 2025', date: '25 Apr 2026', amount: 110000, status: 'Paid' },
];

export default function Payment() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Dropdown States
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterCategory, setFilterCategory] = useState('All'); // 'Public' or 'Private'
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);

  // Airline Sub-Filter States
  const [filterAirline, setFilterAirline] = useState('All');
  const [isAirlineFilterOpen, setIsAirlineFilterOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Derive available airlines dynamically based on the selected Flight Category
  const availableAirlines = filterCategory === 'All' 
    ? [] 
    : [...new Set(invoices.filter(inv => inv.category === filterCategory).map(inv => inv.airline))].sort();

  // Filter Logic
  const filteredInvoices = invoices.filter(inv => {
    // Search now properly scans the billing months as well
    const matchesSearch = inv.airline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.billingMonths.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || inv.category === filterCategory;
    const matchesAirline = filterAirline === 'All' || inv.airline === filterAirline;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesAirline;
  });

  // Pagination Logic
  const totalItems = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Action Handlers
  const handleSend = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Awaiting Payment' } : inv));
    alert(`Invoice ${id} has been finalized and sent to the airline!`);
  };

  const handleSelectStatus = (status) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
    setCurrentPage(1); 
  };

  const handleSelectCategory = (category) => {
    setFilterCategory(category);
    setFilterAirline('All'); // Reset airline filter when parent category changes
    setIsCategoryFilterOpen(false);
    setCurrentPage(1);
  };

  const handleSelectAirline = (airline) => {
    setFilterAirline(airline);
    setIsAirlineFilterOpen(false);
    setCurrentPage(1);
  };

  // Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Saved':
        return <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full border border-slate-200">Saved (Draft)</span>;
      case 'Awaiting Payment':
        return <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200/50 rounded-full">Awaiting Payment</span>;
      case 'Paid':
        return <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200/50 rounded-full">Paid</span>;
      default:
        return null;
    }
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
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Payment & Invoices</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Track, send, and manage consolidated monthly airline billing.</p>
        </div>

        <div className="relative flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-64 h-11 rounded-2xl bg-white/80 backdrop-blur-sm px-4 border border-white focus-within:border-[#007BFF] focus-within:ring-2 focus-within:ring-[#007BFF]/20 transition-all shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by invoice or month..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-transparent px-3 text-[13px] font-medium text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            
            {/* 1. Category (Public/Private) Filter */}
            <div className="relative">
              <button 
                onClick={() => { setIsCategoryFilterOpen(!isCategoryFilterOpen); setIsFilterOpen(false); setIsAirlineFilterOpen(false); }}
                className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#409cff] text-white font-bold shadow-md shadow-[#007BFF]/20 hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <Plane size={16} className="opacity-90" />
                <span className="text-[13px] tracking-wide whitespace-nowrap">
                  {filterCategory === 'All' ? 'All Flights' : `${filterCategory} Flights`}
                </span>
                <ChevronDown size={16} className={`ml-1 opacity-90 transition-transform duration-300 ${isCategoryFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-xl shadow-[#007BFF]/10 py-2 border border-slate-100 overflow-hidden transform origin-top-right transition-all duration-200 z-50 ${isCategoryFilterOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {['All', 'Public', 'Private'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectCategory(opt)}
                    className={`w-full text-left px-5 py-2.5 text-[13px] font-bold transition-colors ${
                      filterCategory === opt 
                        ? 'bg-[#007BFF]/10 text-[#007BFF]' 
                        : 'text-slate-600 hover:bg-[#007BFF]/5 hover:text-[#007BFF]'
                    }`}
                  >
                    {opt === 'All' ? 'View All Flights' : `${opt} Flights`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CONDITIONAL Airline Filter */}
            {filterCategory !== 'All' && (
              <div className="relative animate-in fade-in slide-in-from-left-2 duration-300">
                <button 
                  onClick={() => { setIsAirlineFilterOpen(!isAirlineFilterOpen); setIsCategoryFilterOpen(false); setIsFilterOpen(false); }}
                  className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-white border border-[#007BFF]/30 text-[#007BFF] font-bold shadow-sm hover:shadow-md hover:bg-blue-50 transition-all"
                >
                  <Building size={16} className="opacity-90" />
                  <span className="text-[13px] tracking-wide whitespace-nowrap max-w-[120px] truncate">
                    {filterAirline === 'All' ? 'All Airlines' : filterAirline}
                  </span>
                  <ChevronDown size={16} className={`ml-1 opacity-90 transition-transform duration-300 ${isAirlineFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute right-0 lg:left-0 top-full mt-2 w-52 rounded-2xl bg-white shadow-xl shadow-[#007BFF]/10 py-2 border border-slate-100 overflow-hidden transform origin-top transition-all duration-200 z-50 ${isAirlineFilterOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <button
                    onClick={() => handleSelectAirline('All')}
                    className={`w-full text-left px-5 py-2.5 text-[13px] font-bold transition-colors ${
                      filterAirline === 'All' 
                        ? 'bg-[#007BFF]/10 text-[#007BFF]' 
                        : 'text-slate-600 hover:bg-[#007BFF]/5 hover:text-[#007BFF]'
                    }`}
                  >
                    All Airlines
                  </button>
                  {availableAirlines.map((airline) => (
                    <button
                      key={airline}
                      onClick={() => handleSelectAirline(airline)}
                      className={`w-full text-left px-5 py-2.5 text-[13px] font-bold transition-colors truncate ${
                        filterAirline === airline 
                          ? 'bg-[#007BFF]/10 text-[#007BFF]' 
                          : 'text-slate-600 hover:bg-[#007BFF]/5 hover:text-[#007BFF]'
                      }`}
                      title={airline}
                    >
                      {airline}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Status Filter */}
            <div className="relative">
              <button 
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsCategoryFilterOpen(false); setIsAirlineFilterOpen(false); }}
                className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#409cff] text-white font-bold shadow-md shadow-[#007BFF]/20 hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <Filter size={16} className="opacity-90" />
                <span className="text-[13px] tracking-wide whitespace-nowrap">
                  {filterStatus === 'All' ? 'All Statuses' : filterStatus}
                </span>
                <ChevronDown size={16} className={`ml-1 opacity-90 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-xl shadow-[#007BFF]/10 py-2 border border-slate-100 overflow-hidden transform origin-top-right transition-all duration-200 z-50 ${isFilterOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {['All', 'Saved', 'Awaiting Payment', 'Paid'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectStatus(opt)}
                    className={`w-full text-left px-5 py-2.5 text-[13px] font-bold transition-colors ${
                      filterStatus === opt 
                        ? 'bg-[#007BFF]/10 text-[#007BFF]' 
                        : 'text-slate-600 hover:bg-[#007BFF]/5 hover:text-[#007BFF]'
                    }`}
                  >
                    {opt === 'All' ? 'View All' : opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-xl flex flex-col z-10">
        <div className="w-full overflow-x-auto rounded-t-2xl">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-500">
                <th className="p-5 font-bold w-16 text-center">S.No</th>
                <th className="p-5 font-bold">Invoice Number</th>
                <th className="p-5 font-bold">Airline & Details</th>
                <th className="p-5 font-bold">Date Created</th>
                <th className="p-5 font-bold">Amount</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-500 font-medium">
                    No invoices match your search or filter.
                  </td>
                </tr>
              ) : (
                currentInvoices.map((inv, index) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 font-bold text-slate-400 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-5 font-bold text-slate-800">{inv.id}</td>
                    <td className="p-5">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {inv.airline}
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">
                          {inv.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#007BFF] font-semibold mt-1 flex items-center gap-1.5 bg-blue-50 w-max px-2 py-0.5 rounded">
                         <Calendar size={12} className="opacity-70"/> Billing Period: {inv.billingMonths}
                      </div>
                    </td>
                    <td className="p-5 font-medium text-slate-600">{inv.date}</td>
                    <td className="p-5 font-bold text-[#007BFF]">{formatCurrency(inv.amount)}</td>
                    <td className="p-5">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="p-5 pr-6">
                      <div className="flex items-center justify-end gap-3 w-full min-w-[140px]">
                        <div>
                          {inv.status === 'Saved' && (
                            <button 
                              onClick={() => handleSend(inv.id)}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#007BFF] text-white hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20 text-xs font-bold"
                            >
                              <Send size={14} /> Send
                            </button>
                          )}
                          {inv.status === 'Awaiting Payment' && (
                            <span className="text-[11px] font-medium text-amber-500 italic px-1">
                              Awaiting Payment...
                            </span>
                          )}
                          {inv.status === 'Paid' && (
                            <span className="text-[11px] font-medium text-slate-400 italic px-1">
                              No action required
                            </span>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-[#007BFF]/10 hover:text-[#007BFF] transition-colors tooltip" title="Download PDF">
                            <FileDown size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION UX --- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white text-[13px] text-slate-600 font-medium rounded-b-2xl">
          
          <div className="flex items-center gap-4">
            <span>Total: {totalItems}</span>
            <div className="flex items-center gap-2">
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); 
                }}
                className="h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-3 text-slate-800 outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all cursor-pointer shadow-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>items per page</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-3 text-slate-800 outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all cursor-pointer shadow-sm"
              >
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                ))}
              </select>
              <span>of {totalPages} pages</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white shadow-sm hover:bg-slate-50 hover:text-[#007BFF] disabled:opacity-40 disabled:hover:text-slate-500 disabled:hover:bg-white disabled:shadow-none transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white shadow-sm hover:bg-slate-50 hover:text-[#007BFF] disabled:opacity-40 disabled:hover:text-slate-500 disabled:hover:bg-white disabled:shadow-none transition-all"
                aria-label="Next Page"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}