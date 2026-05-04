import React, { useState } from 'react';

// Utility to format numbers to Indian Rupee standard
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Simplified Number to Words converter for receipt requirements
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
  return 'RUPEES ' + convert(Math.round(num)).trim() + ' ONLY';
};

export default function PrivateFlights() {
  // Form input states
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState('');
  
  // States for other charges
  const [landingCharges, setLandingCharges] = useState('');
  const [nightParkingCharges, setNightParkingCharges] = useState('');
  const [watchHourExtension, setWatchHourExtension] = useState('');

  // Signature Mock State (In a real app, this would be fetched from context/API)
  const [signatureUrl, setSignatureUrl] = useState(null); 

  // Invoice Data State
  const [invoiceData, setInvoiceData] = useState(null);

  const handleGenerate = () => {
    // Validations
    if (!airline || !flightNo || !arrivalDate || !departureDate || !passengers) {
      return alert('Please fill in Airline, Flight No, Both Dates, and Passenger count.');
    }

    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const passengerCount = parseInt(passengers, 10);

    if (departure < arrival) {
      return alert('Departure time cannot be before Arrival time.');
    }

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

    const gRate = 0.18; 

    const calculateRow = (baseAmt) => ({
      amt: baseAmt,
      gst: baseAmt * gRate,
      total: baseAmt * (1 + gRate)
    });

    const landingRowData = calculateRow(landingAmt);
    const parkingRowData = calculateRow(parkingAmount);
    const nightRowData = calculateRow(nightAmt);
    const watchRowData = calculateRow(watchAmt);
    const udfRowData = calculateRow(udfAmount);

    const grandTaxableAmount = landingRowData.amt + parkingRowData.amt + nightRowData.amt + watchRowData.amt + udfRowData.amt;
    const grandGstAmount = landingRowData.gst + parkingRowData.gst + nightRowData.gst + watchRowData.gst + udfRowData.gst;
    const finalGrandTotal = grandTaxableAmount + grandGstAmount;

    setInvoiceData({
      airline,
      flightNo,
      arrivalDateStr: arrival.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      departureDateStr: departure.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
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
      grandTotal: finalGrandTotal,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  // Resets the entire form for a new entry
  const resetForm = () => {
    setAirline('');
    setFlightNo('');
    setArrivalDate('');
    setDepartureDate('');
    setPassengers('');
    setLandingCharges('');
    setNightParkingCharges('');
    setWatchHourExtension('');
    setInvoiceData(null);
  };

  // Action Handlers
  const handleBack = () => {
    // Only clears preview, keeps form data
    setInvoiceData(null);
  };

  const handleSave = () => {
    // Simulate sending data somewhere
    console.log("Saving data:", invoiceData);
    alert("Invoice saved successfully!");
    resetForm();
  };

  const handleSaveAndSend = () => {
    // Simulate sending email/data somewhere
    console.log("Saving and Sending data:", invoiceData);
    alert("Invoice saved and sent successfully!");
    resetForm();
  };

  return (
    <div className="flex h-full w-full gap-6 text-slate-900 overflow-hidden font-sans">

      {/* --- LEFT COLUMN: Form Area --- */}
      <div className="flex w-[45%] min-w-[400px] flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Styled Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] p-8 text-white shadow-lg flex flex-col justify-center min-h-[140px]">
  
  {/* NEW: Faded Image Background on the Right */}
  <div 
    className="absolute inset-y-0 right-0 w-2/3 md:w-1/2 pointer-events-none z-0"
    style={{ 
      maskImage: 'linear-gradient(to right, transparent, black 60%)', 
      WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 60%)' 
    }}
  >
    <img 
      src="/image/plane.png" // e.g., an airplane or private jet image
      alt="Decorative Background" 
      className="h-full w-full object-cover object-right opacity-50 mix-blend-overlay"
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

  {/* Abstract background elements */}
  <div className="absolute -right-4 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl z-0"></div>
  <div className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl z-0"></div>
</div>

        {/* Input Form Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl mb-4">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <svg className="h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
              Flight Detail
            </div>
            {invoiceData && <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700 uppercase tracking-wider">Completed</span>}
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Airlines/Company Name <span className="text-red-500">*</span></label>
                <input value={airline} onChange={(e) => setAirline(e.target.value)} type="text" placeholder="e.g. Alliance Air" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Flight Name/No <span className="text-red-500">*</span></label>
                <input value={flightNo} onChange={(e) => setFlightNo(e.target.value)} type="text" placeholder="e.g. VT-AAA" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Landing Time & Date <span className="text-red-500">*</span></label>
                <input value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} type="datetime-local" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Departure Time & Date <span className="text-red-500">*</span></label>
                <input value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} type="datetime-local" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Number of Passengers <span className="text-red-500">*</span></label>
              <input value={passengers} onChange={(e) => setPassengers(e.target.value)} type="number" placeholder="e.g. 5" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
            </div>

            <div className="my-6 border-t border-slate-100"></div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Base Landing Charges (₹)</label>
                <input value={landingCharges} onChange={(e) => setLandingCharges(e.target.value)} type="number" placeholder="e.g. 5000" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Night Parking (₹)</label>
                  <input value={nightParkingCharges} onChange={(e) => setNightParkingCharges(e.target.value)} type="number" placeholder="e.g. 2500" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Watch Ext (₹)</label>
                  <input value={watchHourExtension} onChange={(e) => setWatchHourExtension(e.target.value)} type="number" placeholder="e.g. 1000" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2">
              <button type="button" onClick={handleGenerate} className="w-full rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-[0.98]">
                Generate Invoice Details
              </button>
            </div>
          </form>
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
              <p className="mt-2 text-sm text-slate-500">Fill in the flight details on the left and hit generate to see the live preview of the charges receipt.</p>
            </div>
          ) : (
            
            <div className="w-full max-w-3xl transform origin-top transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl bg-white flex flex-col min-h-full font-sans text-slate-800">
              
              {/* Header: Logo and "INVOICE" */}
            <div className="flex w-full items-center justify-between px-12 pt-12 pb-6">
              <div className="h-20 w-20 flex-shrink-0">
                {/* Image Container */}
                <img 
                  src="/logo.png" 
                  alt="Airport Logo" 
                  className="h-full w-full object-contain object-left" 
                  onError={(e) => {
                  e.target.src = '/image/logo.png';
                }} 
              />
              </div>
              <h1 className="text-2xl font-bold tracking-[0.15em] text-slate-900 uppercase mt-1">Invoice</h1>
            </div>

              {/* Client & Company Info */}
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

              {/* Data Table with FIXED Grid spacing to prevent overlap */}
              <div className="px-12 mt-4 flex-1">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 border-b border-slate-300 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div>Description</div>
                  <div className="text-right shrink-0">Rate / Amt</div>
                  <div className="text-right shrink-0">GST (18%)</div>
                  <div className="text-right shrink-0">Subtotal</div>
                </div>

                {/* Rows */}
                <div className="flex flex-col text-sm">
                  {/* Landing Row */}
                  <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 py-4 border-b border-slate-100 items-center">
                    <div className="font-medium text-slate-800">Landing Charges</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.landing.amt)}</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.landing.gst)}</div>
                    <div className="text-right font-bold text-[#3B82F6] shrink-0">{formatCurrency(invoiceData.rows.landing.total)}</div>
                  </div>

                  {/* Parking Row */}
                  <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 py-4 border-b border-slate-100 items-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">Parking Charges</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">Billable: {invoiceData.billableHours} hrs ({invoiceData.totalHours} Total - 2 Free)</span>
                    </div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.parking.amt)}</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.parking.gst)}</div>
                    <div className="text-right font-bold text-[#3B82F6] shrink-0">{formatCurrency(invoiceData.rows.parking.total)}</div>
                  </div>

                  {/* Night Parking Row */}
                  <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 py-4 border-b border-slate-100 items-center">
                    <div className="font-medium text-slate-800">Night Parking Charges</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.night.amt)}</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.night.gst)}</div>
                    <div className="text-right font-bold text-[#3B82F6] shrink-0">{formatCurrency(invoiceData.rows.night.total)}</div>
                  </div>

                  {/* Watch Hour Row */}
                  <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 py-4 border-b border-slate-100 items-center">
                    <div className="font-medium text-slate-800">Watch Hour Extension</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.watch.amt)}</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.watch.gst)}</div>
                    <div className="text-right font-bold text-[#3B82F6] shrink-0">{formatCurrency(invoiceData.rows.watch.total)}</div>
                  </div>

                  {/* UDF Row */}
                  <div className="grid grid-cols-[1fr_100px_100px_120px] gap-4 py-4 border-b border-slate-100 items-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">User Development Fee (UDF)</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">{invoiceData.passengerCount} Passengers applied</span>
                    </div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.udf.amt)}</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.rows.udf.gst)}</div>
                    <div className="text-right font-bold text-[#3B82F6] shrink-0">{formatCurrency(invoiceData.rows.udf.total)}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Gray Footer Block */}
              <div className="bg-[#f0f0ed] px-12 py-8 mt-12">
                
                {/* 1. AMOUNT IN WORDS MOVED TO TOP */}
                <div className="mb-6 border-b border-slate-300 pb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Amount in Words</div>
                  <div className="text-xs font-medium text-slate-700 leading-relaxed uppercase">
                    {numberToWords(Math.round(invoiceData.grandTotal))}
                  </div>
                </div>

                {/* 2. FLIGHT TIMINGS & TOTAL DUE ON NEXT LINE */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Flight Timings</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Landing</p>
                      <p>{invoiceData.arrivalDateStr}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider pt-2 mb-0.5">Departure</p>
                      <p>{invoiceData.departureDateStr}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Due</div>
                    <div className="text-2xl font-bold tracking-tight text-[#3B82F6] shrink-0">
                      {formatCurrency(invoiceData.grandTotal)}
                    </div>
                  </div>
                </div>

                {/* 3. Terminal Manager Signature Block */}
                <div className="mt-12 flex justify-between items-end">
                  <div className="flex items-center gap-1.5 font-medium text-xs text-slate-600 mb-4">
                    <svg className="h-4 w-4 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    Thank you!
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Terminal Manager Signature" className="h-12 w-auto mb-2 object-contain" />
                    ) : (
                      <div className="h-10 w-32 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-[10px] text-slate-400 mb-2 cursor-pointer hover:bg-white hover:text-slate-600 transition-colors">
                        + Upload Signature
                      </div>
                    )}
                    <div className="h-[1px] w-32 bg-slate-800 mb-1"></div>
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">Terminal Manager</span>
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">Bilaspur Airport</span>
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
              className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              Back
            </button>
            <button 
              onClick={handleSave}
              className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
            >
              Save
            </button>
            <button 
              onClick={handleSaveAndSend}
              className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#2563EB]"
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