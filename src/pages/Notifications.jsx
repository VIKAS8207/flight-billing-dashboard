import React, { useState } from 'react';
import { Bell, CheckCircle2, Plane, Building, Clock, CheckCheck } from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

// Mock Notification Data
const initialNotifications = [
  {
    id: 1,
    airline: 'IndiGo Airlines',
    type: 'Public',
    amount: 85000,
    date: '08 May 2026',
    time: '10:30 AM',
    isRead: false,
  },
  {
    id: 2,
    airline: 'Private Charter (VT-ZZZ)',
    type: 'Private',
    amount: 22000,
    date: '07 May 2026',
    time: '04:15 PM',
    isRead: false,
  },
  {
    id: 3,
    airline: 'Air India',
    type: 'Public',
    amount: 145000,
    date: '06 May 2026',
    time: '11:00 AM',
    isRead: true,
  },
  {
    id: 4,
    airline: 'Alliance Air Aviation',
    type: 'Public',
    amount: 67000,
    date: '05 May 2026',
    time: '09:20 AM',
    isRead: true,
  },
  {
    id: 5,
    airline: 'Corporate Jet (VT-ABC)',
    type: 'Private',
    amount: 41000,
    date: '03 May 2026',
    time: '02:45 PM',
    isRead: true,
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

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

        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#007BFF] shadow-sm">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              You have <span className="font-bold text-[#007BFF]">{unreadCount}</span> unread messages.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 shadow-sm border border-slate-200 hover:text-[#007BFF] hover:border-[#007BFF] transition-all"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="flex-1 rounded-2xl border border-slate-100 bg-white shadow-xl p-2 z-10 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-3">
          
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium">No notifications to display.</div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead 
                    ? 'bg-white border-slate-100 hover:bg-slate-50' 
                    : 'bg-[#eef6ff]/50 border-[#007BFF]/20 shadow-sm hover:bg-[#eef6ff]'
                }`}
              >
                {/* Unread Indicator Dot */}
                {!notif.isRead && (
                  <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-[#007BFF] animate-pulse"></div>
                )}

                {/* Icon */}
                <div className={`flex shrink-0 h-12 w-12 items-center justify-center rounded-full ${
                  notif.isRead ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <CheckCircle2 size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-extrabold text-slate-900 truncate">
                      {notif.airline}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider font-bold ${
                      notif.type === 'Public' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {notif.type === 'Public' ? <Plane size={10} className="inline mr-1"/> : <Building size={10} className="inline mr-1"/>}
                      {notif.type}
                    </span>
                  </div>
                  
                  <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                    Successfully paid the amount of <span className="font-bold text-[#007BFF]">{formatCurrency(notif.amount)}</span> for recent billing.
                  </p>
                </div>

                {/* Timestamp */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-slate-400 shrink-0 mt-2 sm:mt-0">
                  <div className="text-xs font-bold">{notif.date}</div>
                  <div className="flex items-center gap-1 text-[11px] font-medium">
                    <Clock size={12} />
                    {notif.time}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}