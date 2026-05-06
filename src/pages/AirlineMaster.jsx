import React, { useState, useRef } from 'react';
import { 
  History, Save, Building2, MapPin, FileText, Mail, 
  ArrowRightCircle, Clock, Plane, Upload, Image as ImageIcon, Trash2, CheckCircle2
} from 'lucide-react';

// Initial Mock Data for the Airport
const initialProfile = { 
  name: 'Bilasa Devi Kevat Airport', 
  address: 'Bilaspur, Chhattisgarh, India - 495001', 
  gstin: '22AAAAA0000A1Z5', 
  email: 'billing@bilaspurairport.in',
  signatureUrl: null // Added signature field
};

// Mock Initial Audit History
const initialAuditLog = [
  {
    id: 101,
    date: '10 May 2026',
    time: '09:45 AM',
    field: 'Billing Email ID',
    oldValue: 'accounts@bilaspurairport.in',
    newValue: 'billing@bilaspurairport.in',
    user: 'Admin (System)'
  },
  {
    id: 102,
    date: '02 May 2026',
    time: '04:20 PM',
    field: 'Registered Address',
    oldValue: 'Chakarbhatha, Bilaspur',
    newValue: 'Bilaspur, Chhattisgarh, India - 495001',
    user: 'Terminal Manager'
  }
];

export default function AirportMaster() {
  const [profile, setProfile] = useState(initialProfile);
  const [auditLog, setAuditLog] = useState(initialAuditLog);
  
  // Form State
  const [formData, setFormData] = useState({ ...initialProfile });
  
  // Signature Upload States
  const [selectedImage, setSelectedImage] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      
      // If there's already an active signature, show the warning modal first
      if (profile.signatureUrl) {
        setSelectedImage(imageUrl);
        setShowWarningModal(true);
      } else {
        // If no signature exists yet, just update the form state
        setFormData({ ...formData, signatureUrl: imageUrl });
      }
    }
    // Reset input value so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const confirmSignatureChange = () => {
    setFormData({ ...formData, signatureUrl: selectedImage });
    setShowWarningModal(false);
  };

  const cancelSignatureChange = () => {
    setSelectedImage(null);
    setShowWarningModal(false);
  };

  const removeSignature = () => {
    setFormData({ ...formData, signatureUrl: null });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const currentTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let newLogs = [];

    // Check which fields specifically changed to log them individually
    if (formData.gstin !== profile.gstin) {
      newLogs.push({ id: Date.now() + 1, date: currentDate, time: currentTime, field: 'GSTIN No.', oldValue: profile.gstin, newValue: formData.gstin, user: 'Terminal Manager (Active)' });
    }
    if (formData.email !== profile.email) {
      newLogs.push({ id: Date.now() + 2, date: currentDate, time: currentTime, field: 'Billing Email ID', oldValue: profile.email, newValue: formData.email, user: 'Terminal Manager (Active)' });
    }
    if (formData.address !== profile.address) {
      newLogs.push({ id: Date.now() + 3, date: currentDate, time: currentTime, field: 'Registered Address', oldValue: profile.address, newValue: formData.address, user: 'Terminal Manager (Active)' });
    }
    if (formData.signatureUrl !== profile.signatureUrl) {
      newLogs.push({ 
        id: Date.now() + 4, 
        date: currentDate, 
        time: currentTime, 
        field: 'Manager Signature', 
        oldValue: profile.signatureUrl ? '[Previous Image]' : '[None]', 
        newValue: formData.signatureUrl ? '[New Image]' : '[Removed]', 
        user: 'Terminal Manager (Active)' 
      });
    }

    if (newLogs.length === 0) {
      alert("No changes detected.");
      return;
    }

    // Update Master Data
    setProfile(formData);
    
    // Update History Log
    setAuditLog([...newLogs, ...auditLog]);
    alert("Airport profile updated successfully!");
  };

  // Check if button should be disabled (no changes made)
  const isUnchanged = 
    formData.gstin === profile.gstin && 
    formData.email === profile.email && 
    formData.address === profile.address &&
    formData.signatureUrl === profile.signatureUrl;

  return (
    <div className="flex min-h-full w-full flex-col gap-6 font-sans pb-4 relative">
      
      {/* HEADER CONTAINER */}
      <div className="relative p-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef6ff] to-[#d9eeff] rounded-2xl shadow-md border border-[#007BFF]/10 overflow-hidden -z-10">
          <svg className="absolute bottom-0 left-0 w-full h-16 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
            <path d="M0 54H1440V34.5C1440 34.5 1320 8.5 1176 16.5C1032 24.5 960 44.5 816 38.5C672 32.5 612 8.5 468 12.5C324 16.5 216 46.5 72 46.5C28.8 46.5 0 34.5 0 34.5V54Z" />
          </svg>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Airport Settings</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Manage permanent airport billing details and track profile changes.</p>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* LEFT COLUMN: Profile Form */}
        <div className="flex flex-col h-full">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl relative overflow-hidden group flex-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-[#007BFF] pointer-events-none">
              <Building2 size={120} />
            </div>
            
            <div className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#007BFF]">
                  <Plane size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{profile.name}</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Primary Billing Profile</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="relative z-10 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-slate-700">GSTIN No.</label>
                  <div className="relative flex items-center">
                    <FileText className="absolute left-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      name="gstin" 
                      value={formData.gstin} 
                      onChange={handleChange} 
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-bold focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all uppercase" 
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-slate-700">Billing Email ID</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-bold focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-slate-700">Registered Address</label>
                <div className="relative flex">
                  <MapPin className="absolute left-3 top-3.5 text-slate-400 h-4 w-4" />
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows="3" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-bold focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all resize-none custom-scrollbar" 
                  ></textarea>
                </div>
              </div>

              {/* TERMINAL MANAGER SIGNATURE UPLOAD */}
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-slate-700">Terminal Manager Signature</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                />
                
                {!formData.signatureUrl ? (
                  <div 
                    onClick={triggerFileInput}
                    className="w-full border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-[#007BFF]/50 transition-all cursor-pointer flex flex-col items-center justify-center py-6 gap-2"
                  >
                    <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                      <Upload size={18} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Click to upload signature</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="h-16 w-32 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={formData.signatureUrl} alt="Signature Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                        <CheckCircle2 size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Signature Attached</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button 
                          type="button"
                          onClick={triggerFileInput}
                          className="px-3 py-1.5 text-xs font-bold text-[#007BFF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Change
                        </button>
                        <button 
                          type="button"
                          onClick={removeSignature}
                          className="px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isUnchanged}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#007BFF] px-8 text-sm font-bold text-white shadow-md shadow-[#007BFF]/20 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#007BFF]"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Audit History Timeline */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <History size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">Profile Change History</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>

            <div className="flex flex-col gap-6">
              {auditLog.length === 0 ? (
                <p className="text-sm text-slate-500 font-medium pl-10">No changes recorded yet.</p>
              ) : (
                auditLog.map((log) => (
                  <div key={log.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[#007BFF]"></div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-[13px] text-slate-800">{log.field}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-slate-500">{log.date}</div>
                          <div className="text-[10px] flex items-center justify-end gap-1 text-slate-400 mt-0.5">
                            <Clock size={10} /> {log.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
                        <div className="flex-1 text-center truncate">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Previous</div>
                          <div className="text-xs font-bold text-slate-500 line-through decoration-slate-300 truncate" title={log.oldValue}>
                            {log.oldValue}
                          </div>
                        </div>
                        <div className="text-slate-300 shrink-0">
                          <ArrowRightCircle size={18} />
                        </div>
                        <div className="flex-1 text-center truncate">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 mb-1">Updated</div>
                          <div className="text-xs font-bold text-emerald-600 truncate" title={log.newValue}>
                            {log.newValue}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-[10px] font-medium text-slate-500 text-right">
                        Updated by: <span className="font-bold text-slate-700">{log.user}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* WARNING MODAL: Changing Signature */}
      {showWarningModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-2xl">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-80 max-w-[90%] transform transition-all border border-slate-100">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <ImageIcon size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2 text-center">Replace Signature?</h3>
            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed text-center">
              An active signature is already uploaded. Are you sure you want to replace it with this new image?
            </p>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={cancelSignatureChange}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmSignatureChange}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-all"
              >
                Yes, Replace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}