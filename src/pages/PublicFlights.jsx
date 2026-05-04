import React, { useState } from 'react';

// Utility to format numbers to Indian Rupee standard (e.g., 1,00,000)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Simplified Number to Words converter for the invoice requirement
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

export default function PublicFlights() {
  const [activeTab, setActiveTab] = useState('parking');
  
  // Form States
  const [airline, setAirline] = useState('');
  const [flightName, setFlightName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState('');

  // Signature Mock State 
  const [signatureUrl, setSignatureUrl] = useState(null); 
  
  // Invoice Data State
  const [invoiceData, setInvoiceData] = useState(null);

  const handleGenerate = () => {
    if (!airline || !flightName) return alert('Please select Airline and Flight.');

    if (activeTab === 'parking') {
      if (!arrivalDate || !departureDate) return alert('Please enter both Arrival and Departure dates.');

      const arrival = new Date(arrivalDate);
      const departure = new Date(departureDate);
      
      const diffMs = departure - arrival;
      if (diffMs < 0) return alert('Departure cannot be before Arrival.');
      
      const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
      const billableHours = Math.max(0, totalHours - 2);
      
      const hourlyRate = 5000;
      const amount = billableHours * hourlyRate;
      
      const cgst = amount * 0.09;
      const sgst = amount * 0.09;
      const total = amount + cgst + sgst;

      setInvoiceData({
        type: 'Parking',
        airline,
        flightName,
        arrivalDate: arrival.toLocaleDateString('en-IN'),
        departureDate: departure.toLocaleDateString('en-IN'),
        totalHours,
        billableHours,
        rate: hourlyRate,
        amount,
        cgst,
        sgst,
        total,
        invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    } else {
      if (!arrivalDate || !passengers) return alert('Please enter Arrival Date and Number of Passengers.');

      const arrival = new Date(arrivalDate);
      const passengerCount = parseInt(passengers, 10);

      if (isNaN(passengerCount) || passengerCount <= 0) return alert('Please enter a valid passenger count.');

      const passengerRate = 200;
      const amount = passengerCount * passengerRate;
      
      const cgst = amount * 0.09;
      const sgst = amount * 0.09;
      const total = amount + cgst + sgst;

      setInvoiceData({
        type: 'UDF',
        airline,
        flightName,
        arrivalDate: arrival.toLocaleDateString('en-IN'),
        passengerCount,
        rate: passengerRate,
        amount,
        cgst,
        sgst,
        total,
        invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }
  };

  // Resets the entire form for a new entry
  const resetForm = () => {
    setAirline('');
    setFlightName('');
    setArrivalDate('');
    setDepartureDate('');
    setPassengers('');
    setInvoiceData(null);
  };

  // Action Handlers
  const handleBack = () => {
    setInvoiceData(null); // Keeps form data intact
  };

  const handleSave = () => {
    console.log("Saving data:", invoiceData);
    alert("Invoice saved successfully!");
    resetForm();
  };

  const handleSaveAndSend = () => {
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
      src="/image/plane.png" // e.g., a commercial airliner or terminal image
      alt="Decorative Background" 
      className="h-full w-full object-cover object-right opacity-50 mix-blend-overlay"
    />
  </div>

  <div className="relative z-10 flex flex-col items-start">
    <h2 className="text-3xl font-bold tracking-tight leading-none">Public Invoices</h2>
    <div className="mt-3 flex items-center gap-4 text-sm font-medium text-white/90">
      <span className="flex items-center gap-1.5">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
        Commercial Airlines
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

          {/* TABS */}
          <div className="mb-6 flex gap-2">
            <button onClick={() => { setActiveTab('parking'); setInvoiceData(null); }} className={`w-full rounded-lg py-2.5 text-sm font-bold transition-all ${activeTab === 'parking' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>Parking Invoice</button>
            <button onClick={() => { setActiveTab('udf'); setInvoiceData(null); }} className={`w-full rounded-lg py-2.5 text-sm font-bold transition-all ${activeTab === 'udf' ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>UDF Invoice</button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Airlines Company <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={airline} onChange={(e) => setAirline(e.target.value)} className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]">
                    <option value="" disabled>Select Airline...</option>
                    <option value="M/s Alliance Air Aviation Limited">Alliance Air Aviation</option>
                    <option value="M/s IndiGo Airlines">IndiGo Airlines</option>
                    <option value="M/s Air India">Air India</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-3.5 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Flight Name / Number <span className="text-red-500">*</span></label>
                <input value={flightName} onChange={(e) => setFlightName(e.target.value)} type="text" placeholder="e.g. 6E-201" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
              </div>
            </div>

            {/* CONDITIONAL FIELDS BASED ON TAB */}
            {activeTab === 'parking' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Arrival Date & Time <span className="text-red-500">*</span></label>
                  <input value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} type="datetime-local" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Departure Date & Time <span className="text-red-500">*</span></label>
                  <input value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} type="datetime-local" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Arrival Date <span className="text-red-500">*</span></label>
                  <input value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} type="date" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Number of Passengers <span className="text-red-500">*</span></label>
                  <input value={passengers} onChange={(e) => setPassengers(e.target.value)} type="number" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]" placeholder="e.g. 145" />
                </div>
              </div>
            )}

            <div className="pt-4 pb-2">
              <button type="button" onClick={handleGenerate} className="w-full rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-[0.98]">
                Generate {activeTab === 'parking' ? 'Parking' : 'UDF'} Invoice
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
              <p className="mt-2 text-sm text-slate-500">Fill in the flight details on the left and hit generate to see the live preview of the commercial receipt.</p>
            </div>
          ) : (
            
            <div className="w-full max-w-3xl transform origin-top transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl bg-white flex flex-col min-h-full font-sans text-slate-800">
              
              {/* Header: Logo and "INVOICE" */}
              <div className="flex w-full items-center justify-between px-12 pt-12 pb-6">
                <div className="h-12 w-10 flex-shrink-0">
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
                  <h2 className="text-lg font-medium text-slate-800 mb-2">{invoiceData.airline}</h2>
                  <p className="text-xs text-slate-600">Alliance Bhawan, Domestic Terminal</p>
                  <p className="text-xs text-slate-600 mb-4">1, I.G.I Airport, New Delhi - 110037</p>
                  
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-xs pt-2">
                    <span className="text-slate-500">Date Issued:</span>
                    <span className="font-medium text-slate-800">{invoiceData.invoiceDate}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                    <span className="text-slate-500">Invoice No:</span>
                    <span className="font-medium text-slate-800">5</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                    <span className="text-slate-500">Flight No:</span>
                    <span className="font-medium text-slate-800">{invoiceData.flightName}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                    <span className="text-slate-500">
                      {invoiceData.type === 'Parking' ? 'Period:' : 'Date of Flight:'}
                    </span>
                    <span className="font-medium text-slate-800">
                      {invoiceData.type === 'Parking' ? `${invoiceData.arrivalDate} TO ${invoiceData.departureDate}` : invoiceData.arrivalDate}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-xs mt-1">
                    <span className="text-slate-500">GSTIN/UIN:</span>
                    <span className="font-medium text-slate-800">07AAACA1517B1Z1</span>
                  </div>
                </div>
                
                <div className="text-right text-xs text-slate-600 space-y-1 mt-1">
                  <p className="font-medium text-slate-800 text-sm">BILASA DEVI KEVAT AIRPORT, BILASPUR</p>
                  <p>GOVERNMENT OF CHHATTISGARH</p>
                  <p>GSTIN: 22AAAGB0886Q1Z8</p>
                  <p className="pt-2">Tel: 07752-291575</p>
                  <p>Email: apd-bilaspur@cg.gov.in</p>
                </div>
              </div>

              {/* Data Table with FIXED Grid spacing */}
              <div className="px-12 mt-4 flex-1">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_80px_80px_100px_120px] gap-4 border-b border-slate-300 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div>Description of Charges</div>
                  <div className="text-right shrink-0">HSN/SAC</div>
                  <div className="text-right shrink-0">{invoiceData.type === 'Parking' ? 'HOURS' : 'QTY'}</div>
                  <div className="text-right shrink-0">RATE</div>
                  <div className="text-right shrink-0">AMOUNT</div>
                </div>

                {/* Main Table Row */}
                <div className="grid grid-cols-[1fr_80px_80px_100px_120px] gap-4 py-4 border-b border-slate-100 items-start text-sm">
                  <div className="flex flex-col">
                    {invoiceData.type === 'Parking' ? (
                      <>
                        <span className="font-medium text-slate-800">Parking Charges</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">Total Hours: {invoiceData.totalHours}</span>
                        <span className="text-[11px] text-slate-500">Free Hours: 2</span>
                        <span className="font-medium text-slate-800 mt-3">WATCH HOURS EXTENSION</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-slate-800">User Development Fee (UDF)</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">Total Passengers: {invoiceData.passengerCount}</span>
                        <span className="text-[11px] text-slate-500">Rate applied per departing passenger</span>
                      </>
                    )}
                  </div>
                  <div className="text-right font-medium text-slate-800 shrink-0 mt-1">9967</div>
                  <div className="text-right font-medium text-slate-800 shrink-0 mt-1">
                    {invoiceData.type === 'Parking' ? invoiceData.billableHours : invoiceData.passengerCount}
                  </div>
                  <div className="text-right font-medium text-slate-800 shrink-0 mt-1">{formatCurrency(invoiceData.rate)}</div>
                  <div className="text-right font-medium text-slate-800 shrink-0 mt-1">{formatCurrency(invoiceData.amount)}</div>
                </div>

                {/* Tax Rows - Aligned Right */}
                <div className="flex flex-col items-end py-4 border-b border-slate-100 gap-2 text-sm">
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">Taxable Value</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.amount)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">ADD CGST @9%</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.cgst)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-4 w-64 items-center">
                    <div className="text-right font-medium text-slate-500">ADD SGST @9%</div>
                    <div className="text-right font-medium text-slate-800 shrink-0">{formatCurrency(invoiceData.sgst)}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Gray Footer Block */}
              <div className="bg-[#f0f0ed] px-12 py-8 mt-12">
                
                {/* 1. AMOUNT IN WORDS MOVED TO TOP */}
                <div className="mb-6 border-b border-slate-300 pb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Amount in Words</div>
                  <div className="text-xs font-medium text-slate-700 leading-relaxed uppercase">
                    {numberToWords(Math.round(invoiceData.total))}
                  </div>
                </div>

                {/* 2. BANK DETAILS & TOTAL DUE */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bank Details</div>
                    <div className="text-xs text-slate-800 space-y-1 font-medium">
                      <p>ICICI BANK, A/C No. 028205501441</p>
                      <p>IFSC - ICIC0004352</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider pt-2 mb-0.5">Branch</p>
                      <p>Vardhaman Complex, Raipur Road,</p>
                      <p>Parsada, Bilaspur (C.G.) 495220</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Due</div>
                    <div className="text-2xl font-bold tracking-tight text-[#3B82F6] shrink-0">
                      {formatCurrency(invoiceData.total)}
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