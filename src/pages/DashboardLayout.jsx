import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Plane, Upload, CheckCircle2, Trash2 } from 'lucide-react';

// Reusable component for sidebar links
const SidebarLink = ({ to, icon, label, badge, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-[#007BFF] to-[#409cff] text-white shadow-lg shadow-[#007BFF]/30 font-semibold' 
        : 'text-slate-500 hover:bg-[#B0E0E6]/20 hover:text-[#007BFF] font-medium'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-[#007BFF] transition-colors'}`}>
        {icon}
      </div>
      <span className="text-[13px]">{label}</span>
    </div>
    {badge && (
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
        active ? 'bg-white/20 text-white' : 'bg-[#B0E0E6]/40 text-[#007BFF]'
      }`}>
        {badge}
      </span>
    )}
  </Link>
);

export default function DashboardLayout() {
  const location = useLocation();
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isBudgetTrackingOpen, setIsBudgetTrackingOpen] = useState(false); // NEW STATE

  // Reference for the sidebar to detect clicks outside
  const sidebarRef = useRef(null);

  // States and refs for Signature Upload
  const [signatureFile, setSignatureFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef(null);

  // Logic: Close all dropdowns
  const closeDropdowns = () => {
    setIsBillingOpen(false);
    setIsBudgetTrackingOpen(false); // CLOSE NEW DROPDOWN
  };

  // Logic: Detect clicks outside the sidebar to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeDropdowns();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers for file upload and deletion
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSignatureFile(e.target.files[0]);
    }
  };

  const confirmDelete = () => {
    setSignatureFile(null);
    setShowConfirmModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the input
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans antialiased text-slate-900 overflow-hidden relative">
      
      {/* --- SIDEBAR: Solid White --- */}
      <aside ref={sidebarRef} className="flex h-full w-[260px] flex-col bg-white z-20">
        
        {/* Logo Section */}
        <div className="flex h-20 shrink-0 items-center gap-3 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-md shadow-[#007BFF]/10 border border-[#007BFF]/10">
            <Plane 
              size={22} 
              className="text-[#007BFF] rotate-45" 
              strokeWidth={2.5} 
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#007BFF] to-[#409cff] bg-clip-text text-transparent">
            Flight Billing
          </span>
        </div>

        {/* Navigation Menus */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar flex flex-col justify-between">
          
          <div>
            <div className="mb-6 pt-4">
              <div className="mb-2 px-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                Menu
              </div>
              <nav className="flex flex-col gap-1.5">
                <SidebarLink 
                  to="/dashboard" 
                  label="Dashboard" 
                  active={location.pathname === '/dashboard'} 
                  onClick={closeDropdowns}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>} 
                />
                
                {/* BILLING DROPDOWN */}
                <div>
                  <button 
                    onClick={() => setIsBillingOpen(!isBillingOpen)}
                    className="group flex w-full items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-500 hover:bg-[#B0E0E6]/20 hover:text-[#007BFF] font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      <span className="text-[13px]">Billing</span>
                    </div>
                    <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isBillingOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${isBillingOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-[#B0E0E6]/50 pl-3">
                      <Link to="/public-flights" className={`py-1.5 text-[13px] font-semibold transition-colors ${location.pathname === '/public-flights' ? 'text-[#007BFF]' : 'text-slate-500 hover:text-[#007BFF]'}`}>
                        Public Flights
                      </Link>
                      <Link to="/private-flights" className={`py-1.5 text-[13px] font-semibold transition-colors ${location.pathname === '/private-flights' ? 'text-[#007BFF]' : 'text-slate-500 hover:text-[#007BFF]'}`}>
                        Private Flights
                      </Link>
                    </div>
                  </div>
                </div>

                <SidebarLink 
                  to="/payment" 
                  label="Payment" 
                  onClick={closeDropdowns}
                  active={location.pathname === '/payment'}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>} 
                />

                {/* BUDGET TRACKING DROPDOWN (UPDATED) */}
                <div>
                  <button 
                    onClick={() => setIsBudgetTrackingOpen(!isBudgetTrackingOpen)}
                    className="group flex w-full items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-500 hover:bg-[#B0E0E6]/20 hover:text-[#007BFF] font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                      <span className="text-[13px]">Budget Tracking</span>
                    </div>
                    <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isBudgetTrackingOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${isBudgetTrackingOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-[#B0E0E6]/50 pl-3">
                      <Link to="/budget" className={`py-1.5 text-[13px] font-semibold transition-colors ${location.pathname === '/budget' ? 'text-[#007BFF]' : 'text-slate-500 hover:text-[#007BFF]'}`}>
                        Track Expense
                      </Link>
                      <Link to="/budget-master" className={`py-1.5 text-[13px] font-semibold transition-colors ${location.pathname === '/budget-master' ? 'text-[#007BFF]' : 'text-slate-500 hover:text-[#007BFF]'}`}>
                        Add Expense
                      </Link>
                    </div>
                  </div>
                </div>
                
              </nav>
            </div>

            <div>
              <div className="mb-2 px-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                Masters
              </div>
              
              <nav className="flex flex-col gap-1.5">
                {/* CHARGES MASTER */}
                <SidebarLink 
                  to="/charges-master" 
                  label="Charges Master" 
                  onClick={closeDropdowns}
                  active={location.pathname === '/charges-master'}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>} 
                />

                {/* FLIGHT MASTER */}
                <SidebarLink 
                  to="/flight-master" 
                  label="Flight Master" 
                  onClick={closeDropdowns}
                  active={location.pathname === '/flight-master'}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} 
                />

                {/* AIRLINE MASTER */}
                <SidebarLink 
                  to="/airline-master" 
                  label="Airline Master" 
                  onClick={closeDropdowns}
                  active={location.pathname === '/airline-master'}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
                />
                
                {/* Budget Master removed from here as requested */}
              </nav>

              {/* SIGNATURE UPLOAD COMPONENT */}
              <div className="mt-6 mx-2 rounded-2xl border border-[#007BFF]/20 bg-gradient-to-br from-white to-[#B0E0E6]/30 p-4 text-center hover:shadow-lg hover:shadow-[#007BFF]/10 transition-all duration-300 group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,.pdf" 
                />
                
                {!signatureFile ? (
                  <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#007BFF] to-[#B0E0E6] text-white shadow-md group-hover:scale-110 transition-transform">
                      <Upload className="h-4 w-4" />
                    </div>
                    <p className="text-[13px] font-bold text-slate-800">Upload Signature</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Terminal Manager</p>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-[13px] font-bold text-emerald-600 truncate px-1">
                      {signatureFile.name}
                    </p>
                    <button 
                      onClick={() => setShowConfirmModal(true)}
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Change / Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LOGOUT BUTTON AT BOTTOM */}
          <div className="mt-6 border-t border-slate-100 pt-4">
             <SidebarLink 
               to="/login" 
               label="Logout" 
               active={false} 
               onClick={closeDropdowns}
               icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>} 
             />
          </div>

        </div>

      </aside>

      {/* --- RIGHT COLUMN --- */}
      <div className="flex flex-1 flex-col relative z-10">
        
        {/* HEADER: Solid White */}
        <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-white">
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
              <img 
                src="YOUR_LOGO_URL_HERE" 
                alt="Logo" 
                className="h-full w-full object-contain"
                onError={(e) => e.target.src = "/image/logo.png"} 
              />
            </div>
            <div>
              <h2 className="text-[16px] font-bold leading-tight text-slate-900">Bilasa Devi Kevat Airport</h2>
              <p className="text-[12px] font-medium text-slate-500">Bilaspur, Chhattisgarh</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative flex items-center w-full h-11 rounded-full bg-slate-50 px-4 border border-slate-200 focus-within:border-[#007BFF] focus-within:ring-2 focus-within:ring-[#007BFF]/20 transition-all shadow-sm">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="Start searching here..." 
                className="w-full bg-transparent px-3 text-[13px] font-medium text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 shadow-sm transition-colors border border-slate-100">
               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             </button>
             <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 shadow-sm transition-colors border border-slate-100">
               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
               <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#007BFF] to-[#B0E0E6] ring-2 ring-white"></span>
             </button>
          </div>
        </header>

        {/* --- THE INNER BOX CONTAINER --- */}
        <div className="flex-1 overflow-hidden pr-2 pb-2  bg-white">
          
          <main className="h-full w-full rounded-[15px] bg-gradient-to-br from-[#007BFF] to-[#B0E0E6] shadow-2xl shadow-[#007BFF]/20 overflow-y-auto p-8 custom-scrollbar text-white">
            <Outlet />
          </main>

        </div>

      </div>

      {/* CONFIRMATION MODAL PORTAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-80 max-w-[90%] transform transition-all border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Modify Signature?</h3>
            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete or change the currently uploaded signature file?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #B0E0E6;
          border-radius: 20px;
          opacity: 0.8;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}