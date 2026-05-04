import React, { useState } from 'react';
import { IndianRupee, History, Save, Car, Users, ArrowRightCircle, Clock, PlaneTakeoff } from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function ChargesMaster() {
  // Current Charge States
  const [parkingCharge, setParkingCharge] = useState(1000);
  const [udfCharge, setUdfCharge] = useState(200);

  // Input Field States
  const [parkingInput, setParkingInput] = useState(1000);
  const [udfInput, setUdfInput] = useState(200);

  // Audit Log State (Pre-populated with some history for visual reference)
  const [auditLog, setAuditLog] = useState([
    {
      id: 1,
      date: '03 May 2026',
      time: '10:15 AM',
      field: 'UDF Charge (Per Passenger)',
      oldValue: 150,
      newValue: 200,
      user: 'Admin (System)'
    },
    {
      id: 2,
      date: '15 Apr 2026',
      time: '02:30 PM',
      field: 'Parking Charge (Per Hour)',
      oldValue: 800,
      newValue: 1000,
      user: 'Terminal Manager'
    }
  ]);

  // Handlers
  const handleUpdateParking = () => {
    if (parkingInput === parkingCharge) return; // No change made
    
    const now = new Date();
    const newLog = {
      id: Date.now(),
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      field: 'Parking Charge (Per Hour)',
      oldValue: parkingCharge,
      newValue: Number(parkingInput),
      user: 'Terminal Manager (Active)'
    };

    setParkingCharge(Number(parkingInput));
    setAuditLog([newLog, ...auditLog]);
    alert('Parking Charge updated successfully!');
  };

  const handleUpdateUDF = () => {
    if (udfInput === udfCharge) return; // No change made
    
    const now = new Date();
    const newLog = {
      id: Date.now(),
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      field: 'UDF Charge (Per Passenger)',
      oldValue: udfCharge,
      newValue: Number(udfInput),
      user: 'Terminal Manager (Active)'
    };

    setUdfCharge(Number(udfInput));
    setAuditLog([newLog, ...auditLog]);
    alert('UDF Charge updated successfully!');
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
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Charges Master</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Configure global fee parameters for automatic invoice calculation.</p>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* LEFT COLUMN: Configuration Cards */}
        <div className="flex flex-col gap-6">
          
          {/* Parking Charge Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-[#007BFF] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <PlaneTakeoff size={100} />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#007BFF]">
                <PlaneTakeoff size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Parking Charge</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applied per billable hour</p>
              </div>
            </div>

            <div className="flex items-end gap-4 relative z-10">
              <div className="flex-1">
                <label className="mb-2 block text-[13px] font-bold text-slate-700">Current Rate (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <IndianRupee size={16} />
                  </div>
                  <input 
                    type="number" 
                    value={parkingInput}
                    onChange={(e) => setParkingInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 font-bold outline-none focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 transition-all text-lg"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdateParking}
                disabled={Number(parkingInput) === parkingCharge}
                className="flex h-[52px] items-center gap-2 rounded-xl bg-[#007BFF] px-6 text-sm font-bold text-white shadow-md shadow-[#007BFF]/20 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#007BFF]"
              >
                <Save size={18} /> Update
              </button>
            </div>
          </div>

          {/* UDF Charge Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <Users size={100} />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">User Development Fee (UDF)</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applied per passenger</p>
              </div>
            </div>

            <div className="flex items-end gap-4 relative z-10">
              <div className="flex-1">
                <label className="mb-2 block text-[13px] font-bold text-slate-700">Current Rate (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <IndianRupee size={16} />
                  </div>
                  <input 
                    type="number" 
                    value={udfInput}
                    onChange={(e) => setUdfInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 font-bold outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-lg"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdateUDF}
                disabled={Number(udfInput) === udfCharge}
                className="flex h-[52px] items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
              >
                <Save size={18} /> Update
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Audit History Timeline */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex flex-col h-[500px]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <History size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Change History</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>

            <div className="flex flex-col gap-6">
              {auditLog.map((log, index) => (
                <div key={log.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-[#007BFF]"></div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-[13px] text-slate-800">{log.field}</div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-slate-500">{log.date}</div>
                        <div className="text-[10px] flex items-center justify-end gap-1 text-slate-400 mt-0.5">
                          <Clock size={10} /> {log.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
                      <div className="flex-1 text-center">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Previous</div>
                        <div className="text-sm font-bold text-slate-600 line-through decoration-slate-300">{formatCurrency(log.oldValue)}</div>
                      </div>
                      <div className="text-slate-300">
                        <ArrowRightCircle size={20} />
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-[#007BFF] mb-1">Updated</div>
                        <div className="text-sm font-bold text-[#007BFF]">{formatCurrency(log.newValue)}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-[10px] font-medium text-slate-500 text-right">
                      Updated by: <span className="font-bold text-slate-700">{log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}