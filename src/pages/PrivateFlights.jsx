import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, Plus, Calendar, Clock, Heart, 
  FileSignature, ReceiptIndianRupee, Plane 
} from 'lucide-react';

// Utility to format numbers to Indian Rupee standard
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Modified Number to Words converter to output clean, un-prefixed/suffixed text for receipts
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

export default function PrivateFlights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detail'); // 'detail' or 'royalty'
  
  // Custom Dropdown States
  const [isAirlineOpen, setIsAirlineOpen] = useState(false);
  const [isRAirlineOpen, setIsRAirlineOpen] = useState(false);
  const dropdownRef = useRef(null);
  const rDropdownRef = useRef(null);

  // Detail Form States
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [passengers, setPassengers] = useState('');
  const [landingCharges, setLandingCharges] = useState('');
  const [nightParkingCharges, setNightParkingCharges] = useState('');
  const [watchHourExtension, setWatchHourExtension] = useState('');

  // Royalty Form States
  const [rAirline, setRAirline] = useState('');
  const [rFlightNo, setRFlightNo] = useState('');
  const [rMobile, setRMobile] = useState('');
  const [rGstin, setRGstin] = useState('');
  const [rDate, setRDate] = useState('');
  const [rBaseAmount, setRBaseAmount] = useState('13000');
  const [rRoyaltyRate, setRRoyaltyRate] = useState('36');

  // Signature Mock State
  const [signatureUrl, setSignatureUrl] = useState(null); 

  // Invoice Data State
  const [invoiceData, setInvoiceData] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAirlineOpen(false);
      }
      if (rDropdownRef.current && !rDropdownRef.current.contains(event.target)) {
        setIsRAirlineOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const airlineOptions = [
    'Charter Jets Pvt Ltd',
    'Executive Airways',
    'Reliance Transport',
    'Aureya Aviation Pvt Ltd',
    'Private Owner / NSOP'
  ];

  // Generate Detail Invoice
  const handleGenerateDetail = () => {
    if (!airline || !flightNo || !arrivalDate || !arrivalTime || !departureDate || !departureTime || !passengers) {
      return alert('Please fill in mandatory Flight Details including Dates and Times.');
    }

    const arrival = new Date(`${arrivalDate}T${arrivalTime}`);
    const departure = new Date(`${departureDate}T${departureTime}`);
    if (departure < arrival) return alert('Departure cannot be before Arrival.');

    const passengerCount = parseInt(passengers, 10);
    const diffMs = departure - arrival;
    const totalHours = Math.ceil(diffMs / (1000 * 60 * 60)); 
    const billableHours = Math.max(0, totalHours - 2); 
    
    const parkingRate = 10000;
    const parkingAmount = billableHours * parkingRate;

    const udfRate = 200;
    const udfAmount = passengerCount * udfRate;

    const landingAmt = parseFloat(landingCharges) || 0;
    const nightAmt = parseFloat(nightParkingCharges) || 0;
    const watchAmt = parseFloat(watchHourExtension) || 0;

    const gRate = 0.18; // Standard 18% total GST for calculation

    const calculateRow = (baseAmt) => ({
      amt: baseAmt,
      cgst: baseAmt * (gRate / 2),
      sgst: baseAmt * (gRate / 2),
      igst: baseAmt * gRate,
      total: baseAmt * (1 + gRate)
    });

    const landingRowData = calculateRow(landingAmt);
    const parkingRowData = calculateRow(parkingAmount);
    const nightRowData = calculateRow(nightAmt);
    const watchRowData = calculateRow(watchAmt);
    const udfRowData = calculateRow(udfAmount);

    const grandTaxableAmount = landingRowData.amt + parkingRowData.amt + nightRowData.amt + watchRowData.amt + udfRowData.amt;
    const grandCgst = landingRowData.cgst + parkingRowData.cgst + nightRowData.cgst + watchRowData.cgst + udfRowData.cgst;
    const grandSgst = landingRowData.sgst + parkingRowData.sgst + nightRowData.sgst + watchRowData.sgst + udfRowData.sgst;
    const grandIgst = landingRowData.igst + parkingRowData.igst + nightRowData.igst + watchRowData.igst + udfRowData.igst;
    const finalGrandTotal = grandTaxableAmount + grandCgst + grandSgst + grandIgst;

    const formatDateTime = (d) => {
      return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    setInvoiceData({
      type: 'Detail',
      airline,
      flightNo,
      arrivalDateStr: formatDateTime(arrival),
      departureDateStr: formatDateTime(departure),
      totalHours,
      billableHours,
      passengerCount,
      rows: {
        landing: landingRowData,
        parking: parkingRowData,
        night: nightRowData,
        watch: watchRowData,
        udf: udfRowData
      },
      taxes: {
        taxable: grandTaxableAmount,
        cgst: grandCgst,
        sgst: grandSgst,
        igst: grandIgst
      },
      grandTotal: finalGrandTotal,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  // Generate Royalty Invoice
  const handleGenerateRoyalty = () => {
    if (!rAirline || !rFlightNo || !rGstin || !rDate || !rBaseAmount || !rRoyaltyRate) {
      return alert('Please fill in all mandatory Royalty details.');
    }

    const baseAmount = parseFloat(rBaseAmount) || 0;
    const royaltyRate = parseFloat(rRoyaltyRate) || 0;
    if (baseAmount <= 0) return alert('Invalid Base Amount.');

    const calculatedAmount = baseAmount * (royaltyRate / 100); 

    const cgstAmt = calculatedAmount * 0.09;
    const sgstAmt = calculatedAmount * 0.09;
    
    const unroundedTotal = calculatedAmount + cgstAmt + sgstAmt;
    const grandTotalRounded = Math.round(unroundedTotal);

    setInvoiceData({
      type: 'Royalty',
      airline: rAirline,
      flightNo: rFlightNo,
      mobile: rMobile || 'Not Provided',
      gstin: rGstin,
      invoiceDateRaw: rDate, 
      invoiceDate: new Date(rDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      datedStr: new Date(rDate).toLocaleDateString('en-IN'), 
      rows: {
        baseAmount,
        royaltyRate,
        calculatedAmount,
        cgstAmt,
        sgstAmt
      },
      grandTotalPrecise: unroundedTotal,
      grandTotal: grandTotalRounded,
      invoiceDatePretty: new Date(rDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setInvoiceData(null); 
  };

  const handleGenerate = () => {
    if (activeTab === 'detail') handleGenerateDetail();
    else handleGenerateRoyalty();
  };

  const resetForm = () => {
    setAirline(''); setFlightNo(''); setArrivalDate(''); setArrivalTime(''); setDepartureDate(''); setDepartureTime(''); setPassengers(''); setLandingCharges(''); setNightParkingCharges(''); setWatchHourExtension('');
    setRAirline(''); setRFlightNo(''); setRMobile(''); setRGstin(''); setRDate(''); setRBaseAmount('13000'); setRRoyaltyRate('36');
    setInvoiceData(null);
  };

  const handleBack = () => setInvoiceData(null);
  const handleSave = () => { alert("Invoice saved successfully!"); resetForm(); };
  const handleSaveAndSend = () => { alert("Invoice saved and sent successfully!"); resetForm(); };

  return (
    <div className="flex h-full w-full gap-6 text-slate-900 overflow-hidden font-sans pb-4">
      
      {/* --- LEFT COLUMN: Form Area --- */}
      <div className="flex w-[45%] min-w-[400px] flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Styled Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] p-8 text-white shadow-lg flex flex-col justify-center min-h-[140px]">
          <div 
            className="absolute inset-y-0 right-0 w-2/3 md:w-1/2 pointer-events-none z-0"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 60%)', WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 60%)' }}
          >
            <img 
              src="/image/plane.png" 
              alt="Decorative Background" 
              className="h-full w-full object-cover object-right opacity-50 mix-blend-overlay"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>

          <div className="relative z-10 flex flex-col items-start">
            <h2 className="text-3xl font-bold tracking-tight leading-none">Private Invoices</h2>
            <div className="mt-3 flex items-center gap-4 text-sm font-medium text-white/90">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                NSOP Approved
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
                Auto-Calculate
              </span>
            </div>
          </div>

          <div className="absolute -right-4 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl z-0"></div>
          <div className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl z-0"></div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl mb-4">
          
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <ReceiptIndianRupee className="h-5 w-5 text-[#3B82F6]" />
              Select Invoice Type
            </div>
            {invoiceData && <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700 uppercase tracking-wider">Completed</span>}
          </div>

          {/* TABS */}
          <div className="mb-8 flex gap-2">
            <button onClick={() => switchTab('detail')} className={`flex items-center gap-2.5 justify-center w-full rounded-lg py-3 text-sm font-bold transition-all active:scale-[0.98] ${activeTab === 'detail' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              <Plane size={16}/> Invoice
            </button>
            <button onClick={() => switchTab('royalty')} className={`flex items-center gap-2.5 justify-center w-full rounded-lg py-3 text-sm font-bold transition-all active:scale-[0.98] ${activeTab === 'royalty' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              <FileSignature size={16}/> Royalty Invoice
            </button>
          </div>

          {/* FORMS */}
          {activeTab === 'detail' ? (
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Custom Airline Dropdown for Detail Tab */}
                <div className="relative" ref={dropdownRef}>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Airlines/Company <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => setIsAirlineOpen(!isAirlineOpen)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-colors hover:border-[#3B82F6] hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] shadow-sm"
                  >
                    <span className={airline ? "text-slate-900 font-medium" : "text-slate-400"}>
                      {airline || 'Select Company...'}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isAirlineOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isAirlineOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-[10px] bg-white shadow-xl py-2 flex flex-col border border-slate-100 overflow-hidden">
                      <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {airlineOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAirline(opt);
                              setIsAirlineOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => { setIsAirlineOpen(false); navigate('/flight-master'); }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-[#3B82F6] hover:bg-blue-50 transition-colors"
                        >
                          <Plus size={16} /> Add Flight
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Flight Name/No <span className="text-red-500">*</span></label>
                  <input value={flightNo} onChange={(e) => setFlightNo(e.target.value)} type="text" placeholder="e.g. VT-AAA" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Landing Date & Time <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Calendar size={14} />
                      </div>
                      <input value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} type="date" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm pl-9 pr-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Clock size={14} />
                      </div>
                      <input value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} type="time" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm pl-9 pr-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Departure Date & Time <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Calendar size={14} />
                      </div>
                      <input value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} type="date" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm pl-9 pr-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Clock size={14} />
                      </div>
                      <input value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} type="time" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm pl-9 pr-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Number of Passengers <span className="text-red-500">*</span></label>
                <input value={passengers} onChange={(e) => setPassengers(e.target.value)} type="number" placeholder="e.g. 5" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>

              <div className="my-6 border-t border-slate-100"></div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Base Landing Charges (₹)</label>
                  <input value={landingCharges} onChange={(e) => setLandingCharges(e.target.value)} type="number" placeholder="e.g. 5000" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Night Parking (₹)</label>
                    <input value={nightParkingCharges} onChange={(e) => setNightParkingCharges(e.target.value)} type="number" placeholder="e.g. 2500" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Watch Ext (₹)</label>
                    <input value={watchHourExtension} onChange={(e) => setWatchHourExtension(e.target.value)} type="number" placeholder="e.g. 1000" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button type="button" onClick={handleGenerate} className="w-full rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-[0.98]">
                  Generate Detail Invoice
                </button>
              </div>
            </form>
          ) : (
            // Royalty Form
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Custom Airline Dropdown for Royalty Tab */}
                <div className="relative" ref={rDropdownRef}>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">M/s (Company Name) <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => setIsRAirlineOpen(!isRAirlineOpen)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-colors hover:border-[#3B82F6] hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] shadow-sm"
                  >
                    <span className={rAirline ? "text-slate-900 font-medium" : "text-slate-400"}>
                      {rAirline || 'Select Company...'}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isRAirlineOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isRAirlineOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-[10px] bg-white shadow-xl py-2 flex flex-col border border-slate-100 overflow-hidden">
                      <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {airlineOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setRAirline(opt);
                              setIsRAirlineOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => { setIsRAirlineOpen(false); navigate('/flight-master'); }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-[#3B82F6] hover:bg-blue-50 transition-colors"
                        >
                          <Plus size={16} /> Add Flight
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Client Mobile (Optional)</label>
                  <input value={rMobile} onChange={(e) => setRMobile(e.target.value)} type="text" placeholder="10-digit No." className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Client GSTIN/UIN <span className="text-red-500">*</span></label>
                  <input value={rGstin} onChange={(e) => setRGstin(e.target.value)} type="text" placeholder="15-digit GSTIN" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] uppercase" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Flight No for Royalty <span className="text-red-500">*</span></label>
                  <input value={rFlightNo} onChange={(e) => setRFlightNo(e.target.value)} type="text" placeholder="e.g. VT-JSA" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Invoice Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Calendar size={14} />
                    </div>
                    <input value={rDate} onChange={(e) => setRDate(e.target.value)} type="date" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm pl-9 pr-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                </div>
                <button type="button" className="text-sm font-medium text-[#3B82F6] text-right mb-1">Set Today</button>
              </div>

              <div className="my-6 border-t border-slate-100"></div>

              <div>
                <label className="mb-1.5 block text-[13px] font-extrabold text-slate-800">Royalty Calculation</label>
                <p className="text-xs text-slate-500 mb-3">Amount will be auto-calculated as per image model (36% Rate).</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Base Transaction (₹) <span className="text-red-500">*</span></label>
                    <input value={rBaseAmount} onChange={(e) => setRBaseAmount(e.target.value)} type="number" placeholder="e.g. 13000" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Royalty Rate (%)</label>
                    <input value={rRoyaltyRate} onChange={(e) => setRRoyaltyRate(e.target.value)} type="number" placeholder="36" className="w-full rounded-[10px] border border-slate-200 bg-white shadow-sm px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button type="button" onClick={handleGenerate} className="w-full rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-[0.98]">
                  Generate Royalty Invoice
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* --- RIGHT COLUMN: Live Preview Container --- */}
      <div className="flex flex-1 flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-xl mb-4">
        
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Preview</h3>
          <div className="flex items-center gap-3">
             {invoiceData && (
                <button className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800">
                  PDF
                </button>
             )}
          </div>
        </div>

        {/* The Workspace Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-slate-50/50 border border-slate-100 flex items-start justify-center custom-scrollbar relative">
          
          {!invoiceData ? (
            <div className="m-auto flex flex-col items-center justify-center text-center max-w-sm animate-in fade-in duration-500">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200/50">
                <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-700">No invoice created yet</h4>
              <p className="mt-2 text-sm text-slate-500">Fill in the flight details on the left and hit generate to see the live preview of the receipt.</p>
            </div>
          ) : invoiceData.type === 'Royalty' ? (
            // --- ROYALTY INVOICE PREVIEW ---
            <div className="w-full max-w-3xl transform origin-top transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl bg-white flex flex-col min-h-full font-sans text-slate-800 text-xs px-12 pt-12">
              
              <div className="flex w-full items-start justify-between pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0">
                    <img 
                      src="/logo.png" 
                      alt="Bilaspur Airport Logo" 
                      className="h-full w-full object-contain object-left" 
                      onError={(e) => { e.target.src = '/image/logo.png'; }} 
                    />
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900">BILASPUR AIRPORT, BILASPUR</h1>
                    <p className="font-bold text-sm text-slate-800">छत्तीसगढ़ शासन (Government of Chhattisgarh)</p>
                    <p className="text-slate-600 font-medium pt-1">apb-bilaspur@cg.gov.in | Tel: 07752-291575</p>
                  </div>
                </div>
                <div className="text-right space-y-1 mt-1 shrink-0">
                  <p className="font-bold text-slate-800">TAX INVOICE</p>
                  <p className="font-bold text-slate-700">GSTIN: <span className='font-extrabold text-slate-900'>22AAAGB0886Q1Z8</span></p>
                </div>
              </div>

              <div className="flex justify-between items-start py-6 gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <span className="font-extrabold w-20 text-slate-900">M/s</span>
                    <span className="font-medium text-slate-800 pb-1 flex-1">{invoiceData.airline}</span>
                  </div>
                  <div className="flex gap-2 text-slate-600">
                    <span className="font-extrabold w-20">Mobile No.</span>
                    <span className="font-medium text-slate-800 pb-1 flex-1">{invoiceData.mobile}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-extrabold w-20 text-slate-900">GSTIN/UIN</span>
                    <span className="font-medium text-slate-800 pb-1 flex-1 uppercase">{invoiceData.gstin}</span>
                  </div>
                </div>
                
                <div className="w-56 space-y-2.5 shrink-0 pt-0.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-extrabold text-slate-900">Invoice No.</span>
                    <span className="font-medium text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">05 (NSOP)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Dated</span>
                    <span className="font-medium text-slate-800">{invoiceData.datedStr}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex-1">
                <div className="grid grid-cols-[1fr_80px_100px_90px_90px_120px] gap-2 border-y border-slate-300 py-2.5 text-[10px] font-extrabold text-slate-600 uppercase tracking-widest text-center">
                  <div className='text-left'>Description of Charges</div>
                  <div>HSN/SAC 997212</div>
                  <div className="text-right">Taxable Amt</div>
                  <div className="text-right">CGST (9%)</div>
                  <div className="text-right">SGST (9%)</div>
                  <div className="text-right">Total Amount</div>
                </div>

                {/* Updated Royalty Description per requirements */}
                <div className="grid grid-cols-[1fr_80px_100px_90px_90px_120px] gap-2 py-5 border-b border-slate-100 text-sm font-medium text-slate-800">
                  <div className="leading-relaxed font-bold">
                    <p>Royalty {invoiceData.rows.royaltyRate}%</p>
                    <p className="mt-1">{formatCurrency(invoiceData.rows.baseAmount)}/-</p>
                  </div>
                  <div className="text-center font-bold text-slate-900">997212</div>
                  <div className="text-right font-medium">{formatCurrency(invoiceData.rows.calculatedAmount)}</div>
                  <div className="text-right font-medium">{formatCurrency(invoiceData.rows.cgstAmt)}</div>
                  <div className="text-right font-medium">{formatCurrency(invoiceData.rows.sgstAmt)}</div>
                  <div className="text-right font-bold text-[#3B82F6]">{formatCurrency(invoiceData.rows.calculatedAmount + invoiceData.rows.cgstAmt + invoiceData.rows.sgstAmt)}</div>
                </div>
              </div>

              <div className="bg-[#f0f0ed] mx-[-48px] px-12 py-8 mt-12 flex flex-col gap-6">
                <div className="flex justify-between items-start gap-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">BANK DETAILS</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium">
                      <p>HDFC BANK, A/C No. 50200058021622</p>
                      <p>IFSC - HDFC0002414</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider pt-2 mb-0.5">BRANCH</p>
                      <p>Opp. Sheffers School, Mungeli Road, Bilaspur (C.G.) 495001</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Amount</div>
                    <div className="text-3xl font-extrabold tracking-tight text-[#3B82F6] shrink-0">
                      {formatCurrency(invoiceData.grandTotal)}
                    </div>
                  </div>
                </div>

                <div className="mt-2 border-y border-slate-300 py-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Amount in Words</div>
                  <div className="text-xs font-extrabold leading-relaxed capitalize text-slate-800">
                    {numberToWordsForReceipt(invoiceData.grandTotal)} ONLY
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-end">
                  <div className="flex items-center gap-1.5 font-medium text-xs text-slate-600 mb-4">
                    <svg className="h-4 w-4 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    Thank you!
                  </div>

                  <div className="flex flex-col items-center">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Director Signature" className="h-12 w-auto mb-2 object-contain" />
                    ) : (
                      <div className="h-10 w-40 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-[10px] text-slate-400 mb-2 cursor-pointer hover:bg-white hover:text-slate-600 transition-colors">
                        + Upload Signature
                      </div>
                    )}
                    <div className="h-[1.5px] w-40 bg-slate-900 mb-1.5"></div>
                    <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wide">Airport Director</span>
                    <span className="text-slate-600 font-bold text-[10px] uppercase tracking-wider">Bilaspur Airport</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // --- DETAIL INVOICE PREVIEW ---
            <div className="w-full max-w-3xl transform origin-top transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl bg-white flex flex-col min-h-full font-sans text-slate-800">
              
              <div className="flex w-full items-center justify-between px-12 pt-12 pb-6">
                <div className="h-20 w-20 flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Airport Logo" 
                    className="h-full w-full object-contain object-left" 
                    onError={(e) => { e.target.src = '/image/logo.png'; }} 
                  />
                </div>
                <h1 className="text-2xl font-bold tracking-[0.15em] text-slate-900 uppercase mt-1">Invoice</h1>
              </div>

              <div className="flex justify-between items-start px-12 py-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-slate-800 mb-4">{invoiceData.airline}</h2>
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="text-slate-500">Date Issued:</span>
                    <span className="font-medium text-slate-800">{invoiceData.invoiceDate}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="text-slate-500">Invoice No:</span>
                    <span className="font-medium text-slate-800">23</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="text-slate-500">Flight No:</span>
                    <span className="font-medium text-slate-800">{invoiceData.flightNo}</span>
                  </div>
                </div>
                
                <div className="text-right text-xs text-slate-600 space-y-1 mt-1">
                  <p className="font-medium text-slate-800 text-sm">Bilaspur Airport</p>
                  <p>Chhattisgarh Shasan</p>
                  <p>Bilaspur, Chhattisgarh</p>
                  <p>GSTIN: 22AAABX9999Z1Z0</p>
                </div>
              </div>

              <div className="px-12 mt-4 flex-1">
                <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 border-b border-slate-300 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div>Description</div>
                  <div className="text-right shrink-0">Total Amount</div>
                </div>

                <div className="flex flex-col text-sm border-b border-slate-100 py-2">
                  <div className="grid grid-cols-[1fr_120px] gap-4 py-2 items-center">
                    <div className="font-medium text-slate-800">Landing Charges</div>
                    <div className="text-right font-medium text-slate-800">{formatCurrency(invoiceData.rows.landing.amt)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 py-2 items-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">Parking Charges</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">Billable: {invoiceData.billableHours} hrs ({invoiceData.totalHours} Total - 2 Free)</span>
                    </div>
                    <div className="text-right font-medium text-slate-800">{formatCurrency(invoiceData.rows.parking.amt)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 py-2 items-center">
                    <div className="font-medium text-slate-800">Night Parking Charges</div>
                    <div className="text-right font-medium text-slate-800">{formatCurrency(invoiceData.rows.night.amt)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 py-2 items-center">
                    <div className="font-medium text-slate-800">Watch Hour Extension</div>
                    <div className="text-right font-medium text-slate-800">{formatCurrency(invoiceData.rows.watch.amt)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 py-2 items-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">User Development Fee (UDF)</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">{invoiceData.passengerCount} Passengers applied</span>
                    </div>
                    <div className="text-right font-medium text-slate-800">{formatCurrency(invoiceData.rows.udf.amt)}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end py-4 border-b border-slate-100 gap-2 text-sm">
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">Taxable Value</div>
                    <div className="text-right font-bold text-slate-800 shrink-0">{formatCurrency(invoiceData.taxes.taxable)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">ADD CGST @9%</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.taxes.cgst)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">ADD SGST @9%</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.taxes.sgst)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">ADD IGST @18%</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.taxes.igst)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f0ed] px-12 py-8 mt-12">
                <div className="flex justify-between items-start gap-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">BANK DETAILS</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium">
                      <p>HDFC BANK, A/C No. 50200058021622</p>
                      <p>IFSC - HDFC0002414</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider pt-2 mb-0.5">BRANCH</p>
                      <p>Opp. Sheffers School, Mungeli Road, Bilaspur (C.G.) 495001</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Amount</div>
                    <div className="text-3xl font-extrabold tracking-tight text-[#3B82F6] shrink-0">
                      {formatCurrency(Math.round(invoiceData.grandTotal))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-300 pt-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Amount in Words</div>
                  <div className="text-xs font-bold leading-relaxed capitalize text-slate-800">
                    {numberToWordsForReceipt(Math.round(invoiceData.grandTotal))} ONLY
                  </div>
                </div>

                <div className="mt-6 border-y border-slate-300 py-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Flight Timings</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Landing</p>
                      <p>{invoiceData.arrivalDateStr}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider pt-2 mb-0.5">Departure</p>
                      <p>{invoiceData.departureDateStr}</p>
                    </div>
                </div>

                <div className="mt-12 flex justify-between items-end">
                  <div className="flex items-center gap-1.5 font-medium text-xs text-slate-600 mb-4">
                    <svg className="h-4 w-4 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    Thank you!
                  </div>

                  <div className="flex flex-col items-center">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Director Signature" className="h-12 w-auto mb-2 object-contain" />
                    ) : (
                      <div className="h-10 w-40 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-[10px] text-slate-400 mb-2 cursor-pointer hover:bg-white hover:text-slate-600 transition-colors">
                        + Upload Signature
                      </div>
                    )}
                    <div className="h-[1.5px] w-40 bg-slate-900 mb-1.5"></div>
                    <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wide">Airport Director</span>
                    <span className="text-slate-600 font-bold text-[10px] uppercase tracking-wider">Bilaspur Airport</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {invoiceData && (
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button 
              onClick={handleBack} 
              className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98]"
            >
              Back
            </button>
            <button 
              onClick={handleSave}
              className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              Save
            </button>
            <button 
              onClick={handleSaveAndSend}
              className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#2563EB] active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Save and Send
            </button>
          </div>
        )}

      </div>
    </div>
  );
}