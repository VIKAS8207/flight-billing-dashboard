import React, { useState } from 'react';
import { Search, Filter, Send, FileDown, CheckCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Expanded Mock Data to demonstrate page-level scrolling
const initialInvoices = [
  { id: 'INV-2026-015', airline: 'Air India', flightNo: 'AI-101', date: '08 May 2026', amount: 145000, status: 'Saved' },
  { id: 'INV-2026-014', airline: 'IndiGo Airlines', flightNo: '6E-555', date: '08 May 2026', amount: 85000, status: 'Sent' },
  { id: 'INV-2026-013', airline: 'Private Charter', flightNo: 'VT-ZZZ', date: '07 May 2026', amount: 22000, status: 'Paid' },
  { id: 'INV-2026-012', airline: 'Alliance Air Aviation', flightNo: '9I-404', date: '07 May 2026', amount: 67000, status: 'Saved' },
  { id: 'INV-2026-011', airline: 'IndiGo Airlines', flightNo: '6E-888', date: '06 May 2026', amount: 110000, status: 'Sent' },
  { id: 'INV-2026-010', airline: 'Private Charter', flightNo: 'VT-LMN', date: '06 May 2026', amount: 35000, status: 'Paid' },
  { id: 'INV-2026-009', airline: 'Air India', flightNo: 'AI-211', date: '06 May 2026', amount: 95000, status: 'Saved' },
  { id: 'INV-2026-008', airline: 'Private Charter', flightNo: 'VT-ABC', date: '05 May 2026', amount: 41000, status: 'Saved' },
  { id: 'INV-2026-007', airline: 'IndiGo Airlines', flightNo: '6E-444', date: '05 May 2026', amount: 105000, status: 'Sent' },
  { id: 'INV-2026-006', airline: 'Alliance Air Aviation', flightNo: '9I-305', date: '04 May 2026', amount: 52000, status: 'Paid' },
  { id: 'INV-2026-005', airline: 'Alliance Air Aviation', flightNo: '9I-201', date: '04 May 2026', amount: 45000, status: 'Saved' },
  { id: 'INV-2026-004', airline: 'IndiGo Airlines', flightNo: '6E-782', date: '03 May 2026', amount: 125000, status: 'Sent' },
  { id: 'INV-2026-003', airline: 'Air India', flightNo: 'AI-404', date: '01 May 2026', amount: 89000, status: 'Paid' },
  { id: 'INV-2026-002', airline: 'Private Charter', flightNo: 'VT-XYZ', date: '28 Apr 2026', amount: 32000, status: 'Sent' },
  { id: 'INV-2026-001', airline: 'IndiGo Airlines', flightNo: '6E-112', date: '25 Apr 2026', amount: 110000, status: 'Paid' },
];

export default function Payment() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Dropdown State
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter Logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.airline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.flightNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
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
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Sent' } : inv));
    alert(`Invoice ${id} has been sent to the airline!`);
  };

  const handleMarkPaid = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  const handleSelectFilter = (status) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
    setCurrentPage(1); 
  };

  // Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Saved':
        return <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full">Saved (Draft)</span>;
      case 'Sent':
        return <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200/50 rounded-full">Sent (Unpaid)</span>;
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
          <p className="text-sm text-slate-600 font-medium mt-1">Track, send, and manage airline billing.</p>
        </div>

        <div className="relative flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-64 h-11 rounded-2xl bg-white/80 backdrop-blur-sm px-4 border border-white focus-within:border-[#007BFF] focus-within:ring-2 focus-within:ring-[#007BFF]/20 transition-all shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoice..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-transparent px-3 text-[13px] font-medium text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#409cff] text-white font-bold shadow-md shadow-[#007BFF]/20 hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <Filter size={16} className="opacity-90" />
              <span className="text-[13px] tracking-wide">
                {filterStatus === 'All' ? 'All Statuses' : filterStatus}
              </span>
              <ChevronDown size={16} className={`ml-1 opacity-90 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-xl shadow-[#007BFF]/10 py-2 border border-slate-100 overflow-hidden transform origin-top-right transition-all duration-200 z-50 ${isFilterOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
              {['All', 'Saved', 'Sent', 'Paid'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectFilter(opt)}
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

      {/* TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-xl flex flex-col z-10">
        <div className="w-full overflow-x-auto rounded-t-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-500">
                <th className="p-5 font-bold w-16 text-center">S.No</th>
                <th className="p-5 font-bold">Invoice Number</th>
                <th className="p-5 font-bold">Airline & Flight</th>
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
                      <div className="font-bold text-slate-800">{inv.airline}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Flight: {inv.flightNo}</div>
                    </td>
                    <td className="p-5 font-medium text-slate-600">{inv.date}</td>
                    <td className="p-5 font-bold text-[#007BFF]">{formatCurrency(inv.amount)}</td>
                    <td className="p-5">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="p-5 pr-6">
                      {/* Changed to justify-end so everything groups tightly on the right */}
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
                          {inv.status === 'Sent' && (
                            <button 
                              onClick={() => handleMarkPaid(inv.id)}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20 text-xs font-bold"
                            >
                              <CheckCircle size={14} /> Mark Paid
                            </button>
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