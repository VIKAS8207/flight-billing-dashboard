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
const numberToWordsForReceipt = (num) => {
  if (num === 0) return 'zero ONLY';
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const convert = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 !== 0 ? 'and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + 'thousand ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
    return convert(Math.floor(n / 100000)) + 'lakh ' + (n % 100000 !== 0 ? convert(n % 100000) : '');
  };
  return convert(Math.round(num)).trim() + ' rupee';
};

const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const AIRLINE_OPTIONS = ['Charter Jets Pvt Ltd', 'Executive Airways', 'Reliance Transport', 'Aureya Aviation Pvt Ltd', 'Private Owner / NSOP'];

export default function PrivateFlights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detail'); 
  
  // Global Configuration Fields
  const [airline, setAirline] = useState('');
  const [mobile, setMobile] = useState('');
  const [gstin, setGstin] = useState('');
  const [isAirlineOpen, setIsAirlineOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamic State for Months & Records
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [detailRecords, setDetailRecords] = useState({});
  const [royaltyRecords, setRoyaltyRecords] = useState({});

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

  // Base Entry Models
  const emptyDetailEntry = { 
    id: 0, flightNo: '', arrivalDate: '', arrivalTime: '', departureDate: '', departureTime: '', 
    passengers: '', landingCharges: '', dayParkingCharges: '', nightParkingCharges: '', watchHourExtension: '' 
  };
  const emptyRoyaltyEntry = { 
    id: 0, flightNo: '', arrivalDate: '', arrivalTime: '', departureDate: '', departureTime: '', 
    baseAmount: '13000', royaltyRate: '36' 
  };

  // --- Step 1: Month Selection Logic ---
  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
      if (activeTab === 'detail' && !detailRecords[month]) {
        setDetailRecords(prev => ({ ...prev, [month]: [{ ...emptyDetailEntry, id: Date.now() + Math.random() }] }));
      }
      if (activeTab === 'royalty' && !royaltyRecords[month]) {
        setRoyaltyRecords(prev => ({ ...prev, [month]: [{ ...emptyRoyaltyEntry, id: Date.now() + Math.random() }] }));
      }
    }
  };

  // --- Step 2: Flight Entry Handlers ---
  const handleAddEntry = (month) => {
    if (activeTab === 'detail') {
      setDetailRecords(prev => ({ ...prev, [month]: [...prev[month], { ...emptyDetailEntry, id: Date.now() + Math.random() }] }));
    } else {
      setRoyaltyRecords(prev => ({ ...prev, [month]: [...prev[month], { ...emptyRoyaltyEntry, id: Date.now() + Math.random() }] }));
    }
  };

  const handleRemoveEntry = (month, entryId) => {
    if (activeTab === 'detail' && detailRecords[month].length > 1) {
      setDetailRecords(prev => ({ ...prev, [month]: prev[month].filter(e => e.id !== entryId) }));
    } else if (activeTab === 'royalty' && royaltyRecords[month].length > 1) {
      setRoyaltyRecords(prev => ({ ...prev, [month]: prev[month].filter(e => e.id !== entryId) }));
    }
  };

  const updateEntry = (month, entryId, field, value) => {
    if (activeTab === 'detail') {
      setDetailRecords(prev => ({ ...prev, [month]: prev[month].map(e => e.id === entryId ? { ...e, [field]: value } : e) }));
    } else {
      setRoyaltyRecords(prev => ({ ...prev, [month]: prev[month].map(e => e.id === entryId ? { ...e, [field]: value } : e) }));
    }
  };

  // --- Step 3: Generation Logic ---
  const handleGenerate = () => {
    if (!airline) return alert('Please select M/s Company Name first.');
    if (activeTab === 'royalty' && !gstin) return alert('GSTIN is required for Royalty Invoices.');
    if (selectedMonths.length === 0) return alert('Please select at least one month to bill.');

    let processedMonths = [];
    let grandTaxableAmount = 0;
    let grandCgst = 0;
    let grandSgst = 0;

    for (const month of selectedMonths) {
      let monthFlights = [];
      let monthSubTotal = 0;

      if (activeTab === 'detail') {
        for (let i = 0; i < detailRecords[month].length; i++) {
          const entry = detailRecords[month][i];

          if (!entry.flightNo || !entry.arrivalDate || !entry.arrivalTime || !entry.departureDate || !entry.departureTime || !entry.passengers) 
            return alert(`Please complete all Dates, Times, Passengers, and Flight No for ${month} - Record #${i + 1}`);

          const arrival = new Date(`${entry.arrivalDate}T${entry.arrivalTime}`);
          const departure = new Date(`${entry.departureDate}T${entry.departureTime}`);
          if (departure - arrival < 0) return alert(`Departure cannot be before Arrival in ${month} - Record #${i + 1}`);

          const passengerCount = parseInt(entry.passengers, 10);
          if (isNaN(passengerCount) || passengerCount <= 0) return alert(`Invalid passenger count in ${month} - Record #${i + 1}`);

          const totalHours = Math.ceil((departure - arrival) / (1000 * 60 * 60));
          const billableHours = Math.max(0, totalHours - 2);
          
          const parkingAmt = billableHours * 10000; 
          const udfAmt = passengerCount * 200;
          const landingAmt = parseFloat(entry.landingCharges) || 0;
          const dayParkingAmt = parseFloat(entry.dayParkingCharges) || 0;
          const nightAmt = parseFloat(entry.nightParkingCharges) || 0;
          const watchAmt = parseFloat(entry.watchHourExtension) || 0;

          const rowTaxable = landingAmt + parkingAmt + dayParkingAmt + nightAmt + watchAmt + udfAmt;
          const rowCgst = rowTaxable * 0.09;
          const rowSgst = rowTaxable * 0.09;

          monthFlights.push({
            ...entry,
            arrivalStr: formatDateTimeStr(entry.arrivalDate, entry.arrivalTime),
            departureStr: formatDateTimeStr(entry.departureDate, entry.departureTime),
            totalHours, billableHours, passengerCount,
            landingAmt, parkingAmt, dayParkingAmt, nightAmt, watchAmt, udfAmt,
            rowTaxable, rowCgst, rowSgst, rowTotal: rowTaxable + rowCgst + rowSgst
          });
          monthSubTotal += rowTaxable;
          grandCgst += rowCgst;
          grandSgst += rowSgst;
        }

      } else {
        for (let i = 0; i < royaltyRecords[month].length; i++) {
          const entry = royaltyRecords[month][i];

          if (!entry.flightNo || !entry.arrivalDate || !entry.arrivalTime || !entry.departureDate || !entry.departureTime || !entry.baseAmount || !entry.royaltyRate) 
            return alert(`Please complete all details for ${month} - Record #${i + 1}`);

          const arrival = new Date(`${entry.arrivalDate}T${entry.arrivalTime}`);
          const departure = new Date(`${entry.departureDate}T${entry.departureTime}`);
          if (departure - arrival < 0) return alert(`Departure cannot be before Arrival in ${month} - Record #${i + 1}`);

          const baseAmt = parseFloat(entry.baseAmount) || 0;
          const rate = parseFloat(entry.royaltyRate) || 0;
          if (baseAmt <= 0) return alert(`Invalid Base Amount in ${month} - Record #${i + 1}`);

          const calculatedAmount = baseAmt * (rate / 100);
          const cgstAmt = calculatedAmount * 0.09;
          const sgstAmt = calculatedAmount * 0.09;

          monthFlights.push({
            ...entry,
            arrivalStr: formatDateTimeStr(entry.arrivalDate, entry.arrivalTime),
            departureStr: formatDateTimeStr(entry.departureDate, entry.departureTime),
            baseAmount: baseAmt, royaltyRate: rate, calculatedAmount, cgstAmt, sgstAmt,
            rowTotal: calculatedAmount + cgstAmt + sgstAmt
          });
          monthSubTotal += calculatedAmount;
          grandCgst += cgstAmt;
          grandSgst += sgstAmt;
        }
      }

      processedMonths.push({ monthName: month, flights: monthFlights, monthTotal: monthSubTotal });
      grandTaxableAmount += monthSubTotal;
    }

    const grandTotal = grandTaxableAmount + grandCgst + grandSgst;

    setInvoiceData({
      type: activeTab === 'detail' ? 'Detail' : 'Royalty',
      airline, mobile, gstin, processedMonths,
      subTotal: grandTaxableAmount,
      cgst: grandCgst,
      sgst: grandSgst,
      total: grandTotal,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedMonths([]);
    setInvoiceData(null); 
  };

  const resetForm = () => {
    setAirline(''); setMobile(''); setGstin('');
    setSelectedMonths([]);
    setDetailRecords({}); setRoyaltyRecords({});
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
                <h2 className="text-3xl font-bold tracking-tight leading-none">Private / NSOP Billing Maker</h2>
                <p className="mt-2 text-sm text-blue-100">Configure global settings, select months, and add flight logs.</p>
              </div>
            </div>

            {/* CONFIGURATION CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              
              {/* TABS */}
              <div className="mb-8 flex gap-4 max-w-md">
                <button onClick={() => switchTab('detail')} className={`flex items-center gap-2.5 justify-center w-full rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'detail' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  <Plane size={18}/> Detail Invoice
                </button>
                <button onClick={() => switchTab('royalty')} className={`flex items-center gap-2.5 justify-center w-full rounded-lg py-3 text-sm font-bold transition-all ${activeTab === 'royalty' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  <FileSignature size={18}/> Royalty Invoice
                </button>
              </div>

              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-lg text-slate-800 font-bold">
                  <ReceiptIndianRupee className="h-6 w-6 text-[#3B82F6]" /> Global Configuration
                </div>
              </div>

              {/* GLOBAL CONFIGURATION FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative" ref={dropdownRef}>
                  <label className="mb-2 block text-sm font-bold text-slate-700">M/s Company Name <span className="text-red-500">*</span></label>
                  <div onClick={() => setIsAirlineOpen(!isAirlineOpen)} className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 hover:border-[#3B82F6] transition-colors">
                    <span className={airline ? "text-slate-900 font-medium" : "text-slate-400"}>{airline || 'Select Company...'}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isAirlineOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isAirlineOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-xl bg-white shadow-xl py-2 flex flex-col border border-slate-100">
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {AIRLINE_OPTIONS.map((opt, idx) => (
                          <button key={idx} type="button" onClick={() => { setAirline(opt); setIsAirlineOpen(false); }} className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Client Mobile (Optional)</label>
                  <input value={mobile} onChange={(e) => setMobile(e.target.value)} type="text" placeholder="10-digit No." className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-[#3B82F6] focus:bg-white focus:outline-none" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">Client GSTIN/UIN {activeTab === 'royalty' && <span className="text-red-500">*</span>}</label>
                  <input value={gstin} onChange={(e) => setGstin(e.target.value)} type="text" placeholder="15-digit GSTIN" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-[#3B82F6] focus:bg-white focus:outline-none uppercase" />
                </div>
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
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                        {activeTab === 'detail' ? detailRecords[month].length : royaltyRecords[month].length} Flights
                      </span>
                    </div>

                    <div className="p-8 space-y-8">
                      {(activeTab === 'detail' ? detailRecords[month] : royaltyRecords[month]).map((entry, index) => (
                        <div key={entry.id} className="relative p-6 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all hover:border-slate-300">
                          
                          {(activeTab === 'detail' ? detailRecords[month].length : royaltyRecords[month].length) > 1 && (
                            <button onClick={() => handleRemoveEntry(month, entry.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors" title="Remove Flight">
                              <Trash2 size={16} />
                            </button>
                          )}
                          
                          <div className="font-bold text-sm text-[#3B82F6] mb-5 border-b border-slate-200 pb-2 inline-block">
                            {activeTab === 'detail' ? 'Flight Record' : 'Transaction'} #{index + 1}
                          </div>
                          
                          <div className="mb-6 w-full md:w-1/2 md:pr-3">
                            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Flight Name / Number <span className="text-red-500">*</span></label>
                            <input 
                              value={entry.flightNo} onChange={(e) => updateEntry(month, entry.id, 'flightNo', e.target.value)} 
                              type="text" placeholder="e.g. VT-AAA" 
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" 
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Landing Details <span className="text-red-500">*</span></label>
                              <div className="grid grid-cols-2 gap-3">
                                <input value={entry.arrivalDate} onChange={(e) => updateEntry(month, entry.id, 'arrivalDate', e.target.value)} type="date" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                <input value={entry.arrivalTime} onChange={(e) => updateEntry(month, entry.id, 'arrivalTime', e.target.value)} type="time" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                              </div>
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Departure Details <span className="text-red-500">*</span></label>
                              <div className="grid grid-cols-2 gap-3">
                                <input value={entry.departureDate} onChange={(e) => updateEntry(month, entry.id, 'departureDate', e.target.value)} type="date" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                <input value={entry.departureTime} onChange={(e) => updateEntry(month, entry.id, 'departureTime', e.target.value)} type="time" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                              </div>
                            </div>
                          </div>

                          {activeTab === 'detail' ? (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-200 pt-4 mb-4">
                                <div>
                                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Passengers <span className="text-red-500">*</span></label>
                                  <input value={entry.passengers} onChange={(e) => updateEntry(month, entry.id, 'passengers', e.target.value)} type="number" placeholder="e.g. 5" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Landing Charges (₹)</label>
                                  <input value={entry.landingCharges} onChange={(e) => updateEntry(month, entry.id, 'landingCharges', e.target.value)} type="number" placeholder="e.g. 5000" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Day Parking (₹)</label>
                                  <input value={entry.dayParkingCharges} onChange={(e) => updateEntry(month, entry.id, 'dayParkingCharges', e.target.value)} type="number" placeholder="e.g. 1500" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Night Parking (₹)</label>
                                  <input value={entry.nightParkingCharges} onChange={(e) => updateEntry(month, entry.id, 'nightParkingCharges', e.target.value)} type="number" placeholder="e.g. 2500" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Watch Ext (₹)</label>
                                  <input value={entry.watchHourExtension} onChange={(e) => updateEntry(month, entry.id, 'watchHourExtension', e.target.value)} type="number" placeholder="e.g. 1000" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                              <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700">Base Trxn (₹) <span className="text-red-500">*</span></label>
                                <input value={entry.baseAmount} onChange={(e) => updateEntry(month, entry.id, 'baseAmount', e.target.value)} type="number" placeholder="e.g. 13000" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700">Royalty Rate (%) <span className="text-red-500">*</span></label>
                                <input value={entry.royaltyRate} onChange={(e) => updateEntry(month, entry.id, 'royaltyRate', e.target.value)} type="number" placeholder="36" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#3B82F6] focus:outline-none" />
                              </div>
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
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Primary Billed Entity:</div>
                  <h2 className="text-base font-bold text-slate-900">{invoiceData.airline}</h2>
                  <p className="text-xs text-slate-700">Corporate Head Office</p>
                  {invoiceData.mobile && <p className="text-xs text-slate-700 pt-1">Mobile: {invoiceData.mobile}</p>}
                  <p className="text-xs text-slate-700 pt-2"><span className="text-slate-500 mr-2">GSTIN/UIN:</span> <span className="uppercase">{invoiceData.gstin || '07AAACA1517B1Z1'}</span></p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600 uppercase text-xs w-32">Invoice No:</span>
                    <span className="font-bold text-slate-900 text-right">NSOP-2026-045</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600 uppercase text-xs w-32">Date Issued:</span>
                    <span className="font-medium text-slate-900 text-right">{invoiceData.invoiceDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600 uppercase text-xs w-32">Charge Type:</span>
                    <span className="font-medium text-slate-900 text-right">{invoiceData.type === 'Detail' ? 'Aircraft Ground Charges' : 'Royalty Fee Calculation'}</span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="mt-8 border border-slate-800 border-b-0">
                
                {/* Dynamic Table Header */}
                <div className="grid grid-cols-[1fr_80px_100px_100px_120px] gap-4 bg-slate-800 text-white p-3 text-[10px] font-bold uppercase tracking-widest">
                  <div>Description & Flight Details</div>
                  <div className="text-right">HSN/SAC</div>
                  <div className="text-right">Taxable Value</div>
                  <div className="text-right">GST (18%)</div>
                  <div className="text-right">Total Amount</div>
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
                        
                        {invoiceData.type === 'Detail' ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{invoiceData.airline}</span>
                            <span className="text-xs font-bold text-slate-500 mb-1.5">Flight: {entry.flightNo}</span>
                            
                            <div className="text-[11px] text-slate-600 space-y-0.5 border-l-2 border-slate-300 pl-2">
                              <p><span className="font-medium text-slate-500">Arr:</span> {entry.arrivalStr}</p>
                              <p><span className="font-medium text-slate-500">Dep:</span> {entry.departureStr}</p>
                            </div>
                            
                            <div className="mt-2 text-[11px] space-y-1">
                              {entry.landingAmt > 0 && <p className="flex justify-between w-48"><span className="text-slate-500">Landing:</span> <span>{formatCurrency(entry.landingAmt)}</span></p>}
                              {entry.parkingAmt > 0 && <p className="flex justify-between w-48"><span className="text-slate-500">Hourly Park ({entry.billableHours}h):</span> <span>{formatCurrency(entry.parkingAmt)}</span></p>}
                              {entry.dayParkingAmt > 0 && <p className="flex justify-between w-48"><span className="text-slate-500">Day Park:</span> <span>{formatCurrency(entry.dayParkingAmt)}</span></p>}
                              {entry.nightAmt > 0 && <p className="flex justify-between w-48"><span className="text-slate-500">Night Park:</span> <span>{formatCurrency(entry.nightAmt)}</span></p>}
                              {entry.watchAmt > 0 && <p className="flex justify-between w-48"><span className="text-slate-500">Watch Ext:</span> <span>{formatCurrency(entry.watchAmt)}</span></p>}
                              {entry.udfAmt > 0 && <p className="flex justify-between w-48"><span className="text-slate-500">UDF ({entry.passengerCount}pax):</span> <span>{formatCurrency(entry.udfAmt)}</span></p>}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">Royalty Assessment ({entry.royaltyRate}%)</span>
                            <div className="text-[11px] text-slate-600 mt-1.5 space-y-0.5 border-l-2 border-slate-300 pl-2">
                              <p><span className="font-medium text-slate-500">Flight:</span> {entry.flightNo}</p>
                              <p><span className="font-medium text-slate-500">Arr:</span> {entry.arrivalStr}</p>
                              <p><span className="font-medium text-slate-500">Dep:</span> {entry.departureStr}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Base Trxn: {formatCurrency(entry.baseAmount)}</p>
                          </div>
                        )}

                        <div className="text-right font-medium text-slate-700 mt-1">997212</div>
                        <div className="text-right font-medium text-slate-900 mt-1">
                          {formatCurrency(invoiceData.type === 'Detail' ? entry.rowTaxable : entry.calculatedAmount)}
                        </div>
                        <div className="text-right font-medium text-slate-700 mt-1">
                          {formatCurrency(invoiceData.type === 'Detail' ? (entry.rowCgst + entry.rowSgst) : (entry.cgstAmt + entry.sgstAmt))}
                        </div>
                        <div className="text-right font-bold text-slate-900 mt-1">{formatCurrency(entry.rowTotal)}</div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Subtotals & Taxes */}
                <div className="flex justify-end border-b border-slate-800 p-4 bg-slate-50">
                  <div className="w-80 space-y-3 text-sm">
                    {invoiceData.type === 'Detail' ? (
                      <>
                        <div className="flex justify-between items-center text-slate-700">
                          <span className="font-bold text-xs uppercase tracking-wide">Total Taxable Value</span>
                          <span className="font-bold">{formatCurrency(invoiceData.subTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 border-t border-dashed border-slate-300 pt-2">
                          <span className="text-xs">ADD CGST @9%</span>
                          <span>{formatCurrency(invoiceData.cgst)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-slate-800">
                          <span className="text-xs">ADD SGST @9%</span>
                          <span>{formatCurrency(invoiceData.sgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-slate-700 pb-2 border-b border-slate-800">
                        <span className="font-bold text-xs uppercase tracking-wide">Total Taxes Added</span>
                        <span className="font-bold text-xs italic">(Included in row calculations)</span>
                      </div>
                    )}
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
                      {numberToWordsForReceipt(Math.round(invoiceData.total))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bank Remittance Details</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium border border-slate-300 p-3 bg-slate-50 w-max">
                      <p><span className="text-slate-500 w-16 inline-block">Bank:</span> HDFC BANK</p>
                      <p><span className="text-slate-500 w-16 inline-block">A/C No:</span> 50200058021622</p>
                      <p><span className="text-slate-500 w-16 inline-block">IFSC:</span> HDFC0002414</p>
                      <p><span className="text-slate-500 w-16 inline-block">Branch:</span> Mungeli Road, Bilaspur (C.G.)</p>
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
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-widest">Airport Director</span>
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