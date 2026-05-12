import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, Plus, Calendar, Clock, X, Download, Trash2, CheckCircle2,
  ReceiptIndianRupee, Plane, FileSignature
} from 'lucide-react';

// Utility to format numbers
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Date formatter
const formatDateTimeStr = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';
  const date = new Date(`${dateStr}T${timeStr}`);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + 
         date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Number to Words
const numberToWords = (num) => {
  if (num === 0) return 'ZERO ONLY';
  const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
  const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  const convert = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'HUNDRED ' + (n % 100 !== 0 ? 'AND ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + 'THOUSAND ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
    return convert(Math.floor(n / 100000)) + 'LAKH ' + (n % 100000 !== 0 ? convert(n % 100000) : '');
  };
  return 'RUPEES ' + convert(num).trim() + ' ONLY';
};

const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const AIRLINE_OPTIONS = ['M/s Alliance Air Aviation Limited', 'M/s IndiGo Airlines', 'M/s Air India', 'M/s Vistara', 'M/s SpiceJet'];

export default function PublicFlights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('parking');
  
  // Global Airline State
  const [airline, setAirline] = useState('');
  const [isAirlineOpen, setIsAirlineOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamic State for Months & Records
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [monthRecords, setMonthRecords] = useState({});

  const [signatureUrl, setSignatureUrl] = useState(null); 
  const [invoiceData, setInvoiceData] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAirlineOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Step 1: Month Selection Logic ---
  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
      if (!monthRecords[month]) {
        setMonthRecords(prev => ({
          ...prev, 
          [month]: [{ 
            id: Date.now() + Math.random(), flightName: '', 
            arrivalDate: '', arrivalTime: '', departureDate: '', departureTime: '', passengers: '' 
          }]
        }));
      }
    }
  };

  // --- Step 2: Flight Entry Handlers ---
  const handleAddEntry = (month) => {
    setMonthRecords(prev => ({
      ...prev,
      [month]: [...prev[month], { 
        id: Date.now() + Math.random(), flightName: '', 
        arrivalDate: '', arrivalTime: '', departureDate: '', departureTime: '', passengers: '' 
      }]
    }));
  };

  const handleRemoveEntry = (month, entryId) => {
    if (monthRecords[month].length > 1) {
      setMonthRecords(prev => ({
        ...prev,
        [month]: prev[month].filter(e => e.id !== entryId)
      }));
    }
  };

  const updateEntry = (month, entryId, field, value) => {
    setMonthRecords(prev => ({
      ...prev,
      [month]: prev[month].map(e => e.id === entryId ? { ...e, [field]: value } : e)
    }));
  };

  // --- Step 3: Generation Logic ---
  const handleGenerate = () => {
    if (!airline) return alert('Please select an Airline Company first.');
    if (selectedMonths.length === 0) return alert('Please select at least one month to bill.');

    let processedMonths = [];
    let grandTotalAmount = 0;

    for (const month of selectedMonths) {
      let monthFlights = [];
      let monthSubTotal = 0;

      for (let i = 0; i < monthRecords[month].length; i++) {
        const entry = monthRecords[month][i];

        if (!entry.flightName) {
          return alert(`Please enter a Flight Name/Number for ${month} - Record #${i + 1}`);
        }

        if (activeTab === 'parking') {
          if (!entry.arrivalDate || !entry.arrivalTime || !entry.departureDate || !entry.departureTime) 
            return alert(`Please complete all dates/times for ${month} - Record #${i + 1}`);

          const arrival = new Date(`${entry.arrivalDate}T${entry.arrivalTime}`);
          const departure = new Date(`${entry.departureDate}T${entry.departureTime}`);
          
          if (departure - arrival < 0) return alert(`Departure cannot be before Arrival in ${month} - Record #${i + 1}`);
          
          const totalHours = Math.ceil((departure - arrival) / (1000 * 60 * 60));
          const billableHours = Math.max(0, totalHours - 2);
          const hourlyRate = 5000;
          const amount = billableHours * hourlyRate;

          monthFlights.push({
            ...entry,
            arrivalStr: formatDateTimeStr(entry.arrivalDate, entry.arrivalTime),
            departureStr: formatDateTimeStr(entry.departureDate, entry.departureTime),
            totalHours,
            billableHours,
            rate: hourlyRate,
            amount
          });
          monthSubTotal += amount;

        } else {
          if (!entry.arrivalDate || !entry.arrivalTime || !entry.departureDate || !entry.departureTime || !entry.passengers) 
            return alert(`Please complete all details and passengers for ${month} - Record #${i + 1}`);

          const arrival = new Date(`${entry.arrivalDate}T${entry.arrivalTime}`);
          const departure = new Date(`${entry.departureDate}T${entry.departureTime}`);
          if (departure - arrival < 0) return alert(`Departure cannot be before Arrival in ${month} - Record #${i + 1}`);

          const passengerCount = parseInt(entry.passengers, 10);
          if (isNaN(passengerCount) || passengerCount <= 0) return alert(`Invalid passenger count in ${month} - Record #${i + 1}`);

          const passengerRate = 200;
          const amount = passengerCount * passengerRate;

          monthFlights.push({
            ...entry,
            arrivalStr: formatDateTimeStr(entry.arrivalDate, entry.arrivalTime),
            departureStr: formatDateTimeStr(entry.departureDate, entry.departureTime),
            passengerCount,
            rate: passengerRate,
            amount
          });
          monthSubTotal += amount;
        }
      }

      processedMonths.push({
        monthName: month,
        flights: monthFlights,
        monthTotal: monthSubTotal
      });
      grandTotalAmount += monthSubTotal;
    }

    const cgst = grandTotalAmount * 0.09;
    const sgst = grandTotalAmount * 0.09;
    const igst = grandTotalAmount * 0.18;
    const grandTotal = grandTotalAmount + cgst + sgst + igst;

    setInvoiceData({
      type: activeTab === 'parking' ? 'Parking' : 'UDF',
      airline,
      processedMonths,
      subTotal: grandTotalAmount,
      cgst,
      sgst,
      igst,
      total: grandTotal,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const resetForm = () => {
    setAirline('');
    setSelectedMonths([]);
    setMonthRecords({});
    setInvoiceData(null);
  };

  return (
    <div className="flex min-h-screen w-full text-slate-900 font-sans p-6 justify-center bg-transparent">
      
      <div className="w-full flex flex-col items-center gap-6">
        
        {!invoiceData ? (
          // ==========================================
          // 1. FORM VIEW (Dynamic Builder)
          // ==========================================
          <div className="animate-in fade-in zoom-in-[0.99] duration-300 ease-out w-full max-w-4xl flex flex-col gap-6">
            
            {/* Styled Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] p-8 text-white shadow-lg flex flex-col justify-center min-h-[140px]">
              <div className="absolute inset-y-0 right-0 w-2/3 md:w-1/2 pointer-events-none z-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 60%)', WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 60%)' }}>
                <img src="/image/plane.png" alt="Decorative Background" className="h-full w-full object-cover object-right opacity-50 mix-blend-overlay" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="relative z-10 flex flex-col items-start">
                <h2 className="text-3xl font-bold tracking-tight leading-none">Flight Billing Maker</h2>
                <p className="mt-2 text-sm text-blue-100">Select an airline, billing months, and build flight logs.</p>
              </div>
            </div>

            {/* CONFIGURATION CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-lg text-slate-800 font-bold">
                  <ReceiptIndianRupee className="h-6 w-6 text-[#3B82F6]" /> Invoice Configuration
                </div>
              </div>

              {/* TABS */}
              <div className="mb-6 flex gap-4 max-w-md">
                <button onClick={() => { setActiveTab('parking'); setSelectedMonths([]); setMonthRecords({}); }} className={`w-full rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'parking' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Invoice Value</button>
                <button onClick={() => { setActiveTab('udf'); setSelectedMonths([]); setMonthRecords({}); }} className={`w-full rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'udf' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>UDF Invoice</button>
              </div>

              {/* GLOBAL AIRLINE DROPDOWN */}
              <div className="mb-8 relative max-w-md" ref={dropdownRef}>
                <label className="mb-2 block text-sm font-bold text-slate-700">Airlines Company <span className="text-red-500">*</span></label>
                <div 
                  onClick={() => setIsAirlineOpen(!isAirlineOpen)} 
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 hover:border-[#3B82F6] transition-colors"
                >
                  <span className={airline ? "text-slate-900 font-medium" : "text-slate-400"}>
                    {airline || 'Select Airline...'}
                  </span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${isAirlineOpen ? 'rotate-180' : ''}`} />
                </div>
                {isAirlineOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-xl bg-white shadow-xl py-2 flex flex-col border border-slate-100">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {AIRLINE_OPTIONS.map((opt, idx) => (
                        <button 
                          key={idx} type="button" 
                          onClick={() => { setAirline(opt); setIsAirlineOpen(false); }} 
                          className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* MONTH SELECTOR */}
              <div className="mb-4 flex items-center gap-2 text-lg text-slate-800 font-bold border-b border-slate-100 pb-4">
                <Calendar className="h-5 w-5 text-[#3B82F6]" /> Select Billing Months
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-2">
                {ALL_MONTHS.map(month => {
                  const isSelected = selectedMonths.includes(month);
                  return (
                    <button
                      key={month}
                      onClick={() => toggleMonth(month)}
                      className={`relative flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all border ${
                        isSelected 
                          ? 'bg-blue-50 border-[#3B82F6] text-[#3B82F6] shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={14} className="absolute left-2" />}
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC MONTH CONTAINERS */}
            {selectedMonths.length > 0 && (
              <div className="space-y-8 animate-in fade-in duration-300 mt-2">
                {selectedMonths.map(month => (
                  <div key={month} className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                    
                    {/* Month Header */}
                    <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="text-xl font-extrabold text-slate-800">{month} Operations</h3>
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{monthRecords[month].length} Flights</span>
                    </div>

                    <div className="p-8 space-y-8">
                      {monthRecords[month].map((entry, index) => (
                        <div key={entry.id} className="relative p-6 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all hover:border-slate-300">
                          
                          {monthRecords[month].length > 1 && (
                            <button onClick={() => handleRemoveEntry(month, entry.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors" title="Remove Flight">
                              <Trash2 size={16} />
                            </button>
                          )}
                          
                          <div className="font-bold text-sm text-[#3B82F6] mb-5 border-b border-slate-200 pb-2 inline-block">Flight Record #{index + 1}</div>
                          
                          <div className="mb-6 w-full md:w-1/2 md:pr-3">
                            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Flight Name / Number <span className="text-red-500">*</span></label>
                            <input 
                              value={entry.flightName} onChange={(e) => updateEntry(month, entry.id, 'flightName', e.target.value)} 
                              type="text" placeholder="e.g. 6E-201" 
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" 
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                            <div>
                              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Arrival <span className="text-red-500">*</span></label>
                              <div className="grid grid-cols-2 gap-3">
                                <input value={entry.arrivalDate} onChange={(e) => updateEntry(month, entry.id, 'arrivalDate', e.target.value)} type="date" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                <input value={entry.arrivalTime} onChange={(e) => updateEntry(month, entry.id, 'arrivalTime', e.target.value)} type="time" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                              </div>
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Departure <span className="text-red-500">*</span></label>
                              <div className="grid grid-cols-2 gap-3">
                                <input value={entry.departureDate} onChange={(e) => updateEntry(month, entry.id, 'departureDate', e.target.value)} type="date" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                <input value={entry.departureTime} onChange={(e) => updateEntry(month, entry.id, 'departureTime', e.target.value)} type="time" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                              </div>
                            </div>
                          </div>

                          {activeTab === 'udf' && (
                            <div className="mt-6 pt-4 border-t border-slate-200 w-full md:w-1/2 md:pr-3">
                              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Total Passengers <span className="text-red-500">*</span></label>
                              <input value={entry.passengers} onChange={(e) => updateEntry(month, entry.id, 'passengers', e.target.value)} type="number" className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" placeholder="e.g. 145" />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Entry Button for this specific month */}
                      <button type="button" onClick={() => handleAddEntry(month)} className="flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:text-[#1E40AF] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors w-max">
                        <Plus size={18} /> Add Another Flight to {month}
                      </button>
                    </div>

                  </div>
                ))}

                {/* Final Master Generate Button */}
                <div className="flex justify-end pt-4">
                  <button type="button" onClick={handleGenerate} className="rounded-xl bg-[#3B82F6] px-12 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0">
                    Generate Final Invoice
                  </button>
                </div>
              </div>
            )}
          </div>

        ) : (

          // ==========================================
          // 2. INVOICE VIEW (Professional Document)
          // ==========================================
          <div className="animate-in fade-in zoom-in-[0.99] duration-300 ease-out w-full max-w-5xl bg-white shadow-2xl border border-slate-200 mb-12 flex flex-col">
            
            {/* System Action Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-slate-100 print:hidden">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Invoice Document Preview</h3>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                  <Download size={14} /> DOWNLOAD PDF
                </button>
                <button onClick={() => setInvoiceData(null)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors" title="Close">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* --- INVOICE PAPER BODY --- */}
            <div className="p-10 md:p-14 bg-white text-slate-900">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-800">
                <div className="flex items-end gap-4">
                  <div className="h-14 w-12 flex-shrink-0">
                    <img src="/logo.png" alt="Logo" className="h-full w-full object-contain object-left" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Bilasa Devi Kevat Airport</h1>
                    <p className="text-xs text-slate-600 font-medium tracking-wide">GOVERNMENT OF CHHATTISGARH</p>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wide pt-0.5">apb-bilaspur@cg.gov.in | Tel: 07752-291575</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold tracking-widest text-slate-800 uppercase mb-2">TAX INVOICE</h2>
                  <p className="text-xs text-slate-600">GSTIN: <span className="font-bold text-slate-800">22AAAGB0886Q1Z8</span></p>
                </div>
              </div>

              {/* Bill To / Info Grid */}
              <div className="grid grid-cols-2 gap-12 py-8 border-b border-slate-300">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Billed To:</div>
                  <h2 className="text-base font-bold text-slate-900">{invoiceData.airline}</h2>
                  <p className="text-xs text-slate-700">Corporate Head Office</p>
                  <p className="text-xs text-slate-700 pt-2"><span className="text-slate-500 mr-2">GSTIN/UIN:</span> <span className="uppercase">07AAACA1517B1Z1</span></p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600 uppercase text-xs w-32">Invoice No:</span>
                    <span className="font-bold text-slate-900 text-right">INV-2026-005</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600 uppercase text-xs w-32">Date Issued:</span>
                    <span className="font-medium text-slate-900 text-right">{invoiceData.invoiceDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600 uppercase text-xs w-32">Charge Type:</span>
                    <span className="font-medium text-slate-900 text-right">{invoiceData.type === 'Parking' ? 'Aircraft Parking Charges' : 'User Development Fee'}</span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="mt-8 border border-slate-800 border-b-0">
                
                {/* Dynamic Table Header */}
                <div className="grid grid-cols-[1fr_80px_100px_100px_120px] gap-4 bg-slate-800 text-white p-3 text-[10px] font-bold uppercase tracking-widest">
                  <div>Description & Flight Details</div>
                  <div className="text-right">HSN/SAC</div>
                  <div className="text-right">{invoiceData.type === 'Parking' ? 'BILLABLE HRS' : 'PASSENGERS'}</div>
                  <div className="text-right">RATE</div>
                  <div className="text-right">AMOUNT</div>
                </div>

                {/* Iterate through Months */}
                {invoiceData.processedMonths.map((monthGroup, mIdx) => (
                  <React.Fragment key={mIdx}>
                    {/* Month Section Header */}
                    <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-300 text-xs font-extrabold text-slate-800 uppercase tracking-widest flex justify-between">
                      <span>{monthGroup.monthName} Operations</span>
                      <span>Subtotal: {formatCurrency(monthGroup.monthTotal)}</span>
                    </div>

                    {/* Flights within the month */}
                    {monthGroup.flights.map((entry, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_80px_100px_100px_120px] gap-4 p-4 border-b border-slate-300 items-start text-sm bg-white">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{invoiceData.airline}</span>
                          <span className="text-xs font-bold text-slate-500 mb-1.5">Flight: {entry.flightName}</span>
                          
                          <div className="text-[11px] text-slate-600 space-y-0.5 border-l-2 border-slate-300 pl-2">
                            <p><span className="font-medium text-slate-500">Arr:</span> {entry.arrivalStr}</p>
                            <p><span className="font-medium text-slate-500">Dep:</span> {entry.departureStr}</p>
                          </div>
                          
                          {invoiceData.type === 'Parking' && (
                            <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide bg-slate-50 p-1 rounded w-max border border-slate-100">
                              Total: {entry.totalHours} Hrs (Less 2 Hrs Free)
                            </div>
                          )}
                        </div>
                        <div className="text-right font-medium text-slate-700 mt-1">9967</div>
                        <div className="text-right font-medium text-slate-900 mt-1">
                          {invoiceData.type === 'Parking' ? entry.billableHours : entry.passengerCount}
                        </div>
                        <div className="text-right font-medium text-slate-700 mt-1">{formatCurrency(entry.rate)}</div>
                        <div className="text-right font-bold text-slate-900 mt-1">{formatCurrency(entry.amount)}</div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Subtotals & Taxes */}
                <div className="flex justify-end border-b border-slate-800 p-4 bg-slate-50">
                  <div className="w-80 space-y-3 text-sm">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-bold text-xs uppercase tracking-wide">Total Taxable Value</span>
                      <span className="font-bold">{formatCurrency(invoiceData.subTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 border-t border-dashed border-slate-300 pt-2">
                      <span className="text-xs">ADD CGST @9%</span>
                      <span>{formatCurrency(invoiceData.cgst)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-xs">ADD SGST @9%</span>
                      <span>{formatCurrency(invoiceData.sgst)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-slate-800">
                      <span className="text-xs">ADD IGST @18%</span>
                      <span>{formatCurrency(invoiceData.igst)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900 pt-1">
                      <span className="font-bold text-sm uppercase tracking-widest">Grand Total Due</span>
                      <span className="font-bold text-xl">{formatCurrency(invoiceData.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Block */}
              <div className="mt-8 flex justify-between items-end border-t-2 border-slate-800 pt-6">
                
                {/* Amount in words & Bank Details */}
                <div className="w-1/2 space-y-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Amount in Words</div>
                    <div className="text-xs font-bold text-slate-800 uppercase">
                      {numberToWords(Math.round(invoiceData.total))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bank Remittance Details</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium border border-slate-300 p-3 bg-slate-50 w-max">
                      <p><span className="text-slate-500 w-16 inline-block">Bank:</span> HDFC BANK</p>
                      <p><span className="text-slate-500 w-16 inline-block">A/C No:</span> 028205501441</p>
                      <p><span className="text-slate-500 w-16 inline-block">IFSC:</span> HDFC0004352</p>
                      <p><span className="text-slate-500 w-16 inline-block">Branch:</span> Vardhaman Complex, Bilaspur (C.G.)</p>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-48 border-b-2 border-slate-800 flex items-end justify-center pb-2 mb-1">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Signature" className="h-12 object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic font-medium">Digital Signature Authorized</span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-widest">Terminal Manager</span>
                  <span className="text-slate-600 text-[10px] uppercase tracking-widest mt-0.5">Bilaspur Airport</span>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions (Not printed) */}
            <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-200 bg-slate-100 print:hidden">
              <button onClick={() => setInvoiceData(null)} className="px-6 py-2.5 text-xs font-bold text-slate-600 transition hover:text-slate-900 uppercase tracking-wide">
                Discard
              </button>
              <button onClick={() => alert("Saved Draft!")} className="border border-slate-800 bg-white px-8 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-50 uppercase tracking-wide">
                Save Draft
              </button>
              <button onClick={resetForm} className="bg-[#3B82F6] px-8 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 shadow-md shadow-blue-500/20 uppercase tracking-wide flex items-center gap-2">
                Save & Send Invoice
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}