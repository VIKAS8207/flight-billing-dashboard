import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Eye, X, 
  Building2, MapPin, FileText, Mail, Plane, ChevronLeft, ChevronRight
} from 'lucide-react';

// Mock Initial Data
const initialAirlines = [
  { id: 1, name: 'IndiGo Airlines', type: 'Public', address: 'Level 1, Tower C, Global Business Park, Gurugram', gstin: '06AACCI1234E1Z1', email: 'billing@goindigo.in' },
  { id: 2, name: 'Air India', type: 'Both', address: 'Airlines House, 113 Gurudwara Rakabganj Road, New Delhi', gstin: '07AAACA1234F1Z9', email: 'finance@airindia.in' },
  { id: 3, name: 'Charter Jets Pvt Ltd', type: 'Private', address: 'Hangar 4, Safdarjung Airport, New Delhi', gstin: '07BBBCD5678G1Z2', email: 'accounts@charterjets.com' },
  { id: 4, name: 'Vistara', type: 'Public', address: 'Tata SIA Airlines Ltd, Jeevan Bharti Tower, New Delhi', gstin: '07CCDDV1234H1Z5', email: 'billing@airvistara.com' },
  { id: 5, name: 'SpiceJet', type: 'Public', address: '319, Udyog Vihar, Phase IV, Gurugram', gstin: '06EEFFS1234J1Z7', email: 'accounts@spicejet.com' },
  { id: 6, name: 'Executive Airways', type: 'Private', address: 'Terminal 1D, IGI Airport, New Delhi', gstin: '07GGHHE1234K1Z8', email: 'finance@executiveair.in' },
];

export default function FlightMaster() {
  const [airlines, setAirlines] = useState(initialAirlines);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI States
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Form State
  const [formData, setFormData] = useState({
    id: null, name: '', type: 'Public', address: '', gstin: '', email: ''
  });

  // Filter Logic
  const filteredAirlines = airlines.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalItems = filteredAirlines.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentAirlines = filteredAirlines.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // --- HANDLERS ---
  
  const handleAddClick = () => {
    setFormData({ id: null, name: '', type: 'Public', address: '', gstin: '', email: '' });
    setModalMode('add');
    setIsFormVisible(true);
  };

  const handleEditClick = (airline) => {
    setFormData(airline);
    setModalMode('edit');
    setIsFormVisible(true);
    // Scroll to top when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewClick = (airline) => {
    setFormData(airline);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this airline?")) {
      setAirlines(airlines.filter(a => a.id !== id));
      // Adjust pagination if deleting the last item on a page
      if (currentAirlines.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newAirline = { ...formData, id: Date.now() };
      setAirlines([newAirline, ...airlines]);
    } else {
      setAirlines(airlines.map(a => a.id === formData.id ? formData : a));
    }
    setIsFormVisible(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, type });
  };

  // Badge Styling
  const getTypeBadge = (type) => {
    const styles = {
      Public: 'bg-blue-50 text-blue-600 border-blue-200',
      Private: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      Both: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return (
      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-md ${styles[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-6 font-sans pb-4">
      
      {/* HEADER */}
      <div className="relative p-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef6ff] to-[#d9eeff] rounded-2xl shadow-md border border-[#007BFF]/10 overflow-hidden -z-10">
          <svg className="absolute bottom-0 left-0 w-full h-16 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 54H1440V24.5C1440 24.5 1308 -11.5 1164 4.5C1020 20.5 948 45.5 804 36.5C660 27.5 600 -3.5 456 0.5C312 4.5 204 45.5 60 45.5C24 45.5 0 24.5 0 24.5V54Z" opacity="0.4"/>
            <path d="M0 54H1440V34.5C1440 34.5 1320 8.5 1176 16.5C1032 24.5 960 44.5 816 38.5C672 32.5 612 8.5 468 12.5C324 16.5 216 46.5 72 46.5C28.8 46.5 0 34.5 0 34.5V54Z" />
          </svg>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Airline Master</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">Manage airline profiles, GSTINs, and operational types.</p>
        </div>

        <div className="relative flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-64 h-11 rounded-2xl bg-white/80 backdrop-blur-sm px-4 border border-white focus-within:border-[#007BFF] focus-within:ring-2 focus-within:ring-[#007BFF]/20 transition-all shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or GSTIN..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent px-3 text-[13px] font-medium text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          {!isFormVisible && (
            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#409cff] text-white font-bold shadow-md shadow-[#007BFF]/20 hover:shadow-lg hover:scale-[1.02] transition-all whitespace-nowrap"
            >
              <Plus size={18} /> Add New Airline
            </button>
          )}
        </div>
      </div>

      {/* IN-PAGE FORM SECTION */}
      {isFormVisible && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col z-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              {modalMode === 'add' ? <Plus className="text-[#007BFF]" /> : <Edit className="text-[#007BFF]" />}
              {modalMode === 'add' ? 'Add New Airline' : 'Edit Airline Details'}
            </h3>
            <button onClick={() => setIsFormVisible(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-slate-700">Airline Name <span className="text-rose-500">*</span></label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-3 text-slate-400 h-4 w-4" />
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all" placeholder="e.g. Air India" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold text-slate-700">Flight Type <span className="text-rose-500">*</span></label>
                  <div className="flex items-center gap-4">
                    {['Public', 'Private', 'Both'].map((type) => (
                      <label key={type} className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border cursor-pointer transition-all ${formData.type === type ? 'bg-blue-50 border-[#007BFF] text-[#007BFF]' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                        <input 
                          type="radio" 
                          name="flightType" 
                          className="hidden" 
                          checked={formData.type === type}
                          onChange={() => handleTypeSelect(type)}
                        />
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${formData.type === type ? 'border-[#007BFF]' : 'border-slate-300'}`}>
                          {formData.type === type && <div className="h-2 w-2 rounded-full bg-[#007BFF]"></div>}
                        </div>
                        <span className="text-sm font-bold">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-slate-700">GSTIN No. <span className="text-rose-500">*</span></label>
                  <div className="relative flex items-center">
                    <FileText className="absolute left-3 text-slate-400 h-4 w-4" />
                    <input required type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all uppercase" placeholder="15-digit GSTIN" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-slate-700">Email ID <span className="text-rose-500">*</span></label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-slate-400 h-4 w-4" />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all" placeholder="billing@airline.com" />
                  </div>
                </div>
              </div>

            </div>

            {/* Full Width */}
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-slate-700">Registered Address <span className="text-rose-500">*</span></label>
              <div className="relative flex">
                <MapPin className="absolute left-3 top-3.5 text-slate-400 h-4 w-4" />
                <textarea required name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 outline-none transition-all resize-none custom-scrollbar" placeholder="Enter complete registered address..."></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsFormVisible(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#007BFF] hover:bg-blue-600 shadow-md shadow-[#007BFF]/20 transition-all">
                {modalMode === 'add' ? 'Save Airline' : 'Update Details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTING TABLE - Removed flex-1 to prevent empty space stretching */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-xl flex flex-col z-10">
        <div className="w-full overflow-x-auto rounded-t-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-500">
                <th className="p-5 font-bold w-16 text-center">S.No</th>
                <th className="p-5 font-bold">Airline Name</th>
                <th className="p-5 font-bold">GSTIN No.</th>
                <th className="p-5 font-bold">Address</th>
                <th className="p-5 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentAirlines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">
                    No airlines found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentAirlines.map((airline, index) => (
                  <tr key={airline.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-slate-400 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {airline.name}
                        {getTypeBadge(airline.type)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{airline.email}</div>
                    </td>
                    <td className="p-5 font-bold text-slate-700">{airline.gstin}</td>
                    <td className="p-5">
                      <p className="text-slate-600 text-[13px] line-clamp-1 max-w-xs" title={airline.address}>
                        {airline.address}
                      </p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleViewClick(airline)} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-[#007BFF] transition-colors tooltip" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditClick(airline)} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-600 transition-colors tooltip" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(airline.id)} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors tooltip" title="Delete">
                          <Trash2 size={16} />
                        </button>
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

      {/* VIEW ONLY MODAL */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{formData.name}</h3>
                <div className="mt-1">{getTypeBadge(formData.type)}</div>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 bg-white rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-4">
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">GSTIN Number</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><FileText size={14} className="text-[#007BFF]"/> {formData.gstin}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">Billing Email</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Mail size={14} className="text-[#007BFF]"/> {formData.email}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">Registered Address</p>
                  <p className="text-sm font-medium text-slate-700 flex items-start gap-2 leading-relaxed"><MapPin size={14} className="text-[#007BFF] mt-1 shrink-0"/> {formData.address}</p>
                </div>
              </div>

              <button onClick={() => setIsViewModalOpen(false)} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}