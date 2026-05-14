import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Plane, Settings, Bell } from 'lucide-react';
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
  const [isBudgetTrackingOpen, setIsBudgetTrackingOpen] = useState(false);

  // Reference for the sidebar to detect clicks outside
  const sidebarRef = useRef(null);

  // Logic: Close all dropdowns
  const closeDropdowns = () => {
    setIsBillingOpen(false);
    setIsBudgetTrackingOpen(false);
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
                        Schedule Airline
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

                {/* BUDGET TRACKING DROPDOWN */}
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

            <div className="mb-6">
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
              </nav>
            </div>

            {/* SYSTEM AREA */}
            <div>
              <div className="mb-2 px-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                System
              </div>
              <nav className="flex flex-col gap-1.5">
                {/* AIRPORT SETTINGS */}
                <SidebarLink 
                  to="/airline-master" 
                  label="Airport Settings" 
                  onClick={closeDropdowns}
                  active={location.pathname === '/airline-master'}
                  icon={<Settings className="h-4 w-4" strokeWidth={2} />} 
                />
              </nav>
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
             <div className="flex items-center gap-3">
   {/* ... other header icons ... */}

   {/* NOTIFICATION BELL LINK */}
   <Link 
     to="/notifications" 
     className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 shadow-sm transition-colors border border-slate-100"
   >
     <Bell className="h-5 w-5" />
     {/* Red Notification Dot */}
     <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
   </Link>
</div>
          </div>
        </header>

        {/* --- THE INNER BOX CONTAINER --- */}
        <div className="flex-1 overflow-hidden pr-2 pb-2  bg-white">
          
          <main className="h-full w-full rounded-[15px] bg-gradient-to-br from-[#007BFF] to-[#B0E0E6] shadow-2xl shadow-[#007BFF]/20 overflow-y-auto p-8 custom-scrollbar text-white">
            <Outlet />
          </main>

        </div>

      </div>

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