import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // 1. Manage current view: 'login', 'signup', 'verify', 'forgot', 'reset'
  const [view, setView] = useState('login');
  
  // 2. Track WHICH flow triggered the verification ('signup' or 'forgot')
  const [authFlow, setAuthFlow] = useState('');

  // Logic Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setAuthFlow('signup'); // Remember we are in the signup flow
    setView('verify');     // Move to verification
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setAuthFlow('forgot'); // Remember we are in the forgot password flow
    setView('verify');     // Move to verification
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // Route based on the flow they were in
    if (authFlow === 'forgot') {
      setView('reset'); // Forgot password goes to set new password
    } else {
      setView('login'); // Sign up goes straight to login
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setView('login'); // Back to login after setting new password
  };

  return (
    <div className="relative flex min-h-screen font-sans antialiased text-white selection:bg-white selection:text-[#007BFF]">
      {/* Background Image */}
      <img 
        src="/image/planelong.png" 
        alt="Aviation Background" 
        className="absolute inset-0 h-full w-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(10, 10, 25, 0.95) 100%)" }}
      />

      <div className="relative z-10 flex w-full items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 px-10 py-8 shadow-2xl backdrop-blur-2xl">
          
          {/* Top Status Bar */}
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">System Online</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">v4.2.0-PRO</span>
          </div>

          {/* Header & Image Logo Option */}
          <div className="mb-8 flex items-center gap-5">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
              <img 
                src="YOUR_LOGO_URL_HERE" 
                alt="Logo" 
                className="h-full w-full object-contain"
                onError={(e) => e.target.src = "/image/logo.png"} 
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">Bilasa Devi Kevat Airport</h1>
              <p className="text-xs font-medium text-[#B0E0E6]/80 uppercase tracking-wide">
                {view === 'login' && 'Aviation Billing Portal'}
                {view === 'signup' && 'Account Registration'}
                {view === 'verify' && 'Security Verification'}
                {view === 'forgot' && 'Access Recovery'}
                {view === 'reset' && 'Set New Access Key'}
              </p>
            </div>
          </div>

          {/* --- VIEW 1: LOGIN --- */}
          {view === 'login' && (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-white/60">User ID</label>
                  <input type="text" className="input-style" placeholder="ID Number" required />
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-white/60">Access Key</label>
                  <input type="password" className="input-style" placeholder="••••••••" required />
                </div>
              </div>
              
              {/* Remember Me Checkbox is right here! */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-white/60 hover:text-white">
                  <input type="checkbox" className="h-3.5 w-3.5 accent-[#007BFF]" /> Remember me
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setView('signup')} className="text-xs font-bold text-white/60 hover:text-[#B0E0E6] transition-colors cursor-pointer">Request Access</button>
                  <span className="text-white/30">|</span>
                  <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-[#B0E0E6] hover:underline cursor-pointer">Forgot Key?</button>
                </div>
              </div>
              
              <button type="submit" className="btn-primary cursor-pointer">LOGIN</button>
            </form>
          )}

          {/* --- VIEW 2: SIGN UP --- */}
          {view === 'signup' && (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="flex flex-col gap-3">
                <input type="text" className="input-style" placeholder="Full Name" required />
                <input type="email" className="input-style" placeholder="Work Email" required />
                <input type="password" className="input-style" placeholder="Create Access Key" required />
                <input type="password" className="input-style" placeholder="Confirm Access Key" required />
              </div>
              <button type="submit" className="btn-primary mt-2 cursor-pointer">GENERATE VERIFICATION CODE</button>
              <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Return to Login</button>
            </form>
          )}

          {/* --- VIEW 3: FORGOT PASSWORD (EMAIL ENTRY) --- */}
          {view === 'forgot' && (
            <form className="space-y-4" onSubmit={handleForgot}>
              <p className="text-xs text-white/60 mb-2">Enter your registered email to receive a recovery code.</p>
              <input type="email" className="input-style" placeholder="registered@airport.com" required />
              <button type="submit" className="btn-primary mt-2 cursor-pointer">SEND RECOVERY CODE</button>
              <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Return to Login</button>
            </form>
          )}

          {/* --- VIEW 4: VERIFICATION --- */}
          {view === 'verify' && (
            <form className="space-y-4" onSubmit={handleVerify}>
              <p className="text-center text-xs text-white/60 mb-4">A 6-digit security code was sent to your email.</p>
              <div className="flex justify-center gap-2">
                <input type="text" maxLength="6" className="input-style text-center text-lg tracking-[0.5em] font-mono" placeholder="000000" required />
              </div>
              <button type="submit" className="btn-primary mt-4 cursor-pointer">VERIFY IDENTITY</button>
            </form>
          )}

          {/* --- VIEW 5: RESET PASSWORD --- */}
          {view === 'reset' && (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-3">
                <p className="text-xs text-white/60">Verification successful. Please set a new secure access key.</p>
                <input type="password" className="input-style" placeholder="New Access Key" required />
                <input type="password" className="input-style" placeholder="Confirm New Key" required />
              </div>
              <button type="submit" className="btn-primary mt-2 cursor-pointer">UPDATE KEY & LOGIN</button>
            </form>
          )}

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-[10px] font-medium tracking-wide text-white/30">
            CONFIDENTIAL AIRPORT AUTHORITY SYSTEM
          </div>
        </div>
      </div>

     
    </div>
  );
}