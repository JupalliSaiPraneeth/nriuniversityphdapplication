import React from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Header({ currentView, setCurrentView }) {
  const isSupabaseLive = isSupabaseConfigured();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Top utility bar */}
      <div className="bg-brand-950 text-slate-200 text-xs py-1 px-4 sm:px-8 border-b border-brand-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-300">
              Pothavarappadu, Agiripalli, Vijayawada Rural, AP – 521212
            </span>
            <span className="text-slate-500">|</span>
            <span>
              Email:{' '}
              <a href="mailto:deanrnd@nriit.edu.in" className="text-gold-400 hover:text-white underline">
                deanrnd@nriit.edu.in
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-block px-2 py-0.2 rounded text-[10px] font-semibold ${
                isSupabaseLive
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                  : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
              }`}
            >
              {isSupabaseLive ? '● Supabase Live' : '● Local DB Active'}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-gold-400 font-semibold text-[11px]">
              Ph.D. Admissions 2025-26
            </span>
          </div>
        </div>
      </div>

      {/* Main branding & navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              src="/nrilogo.png"
              alt="Dr RVR NRIIT"
              className="h-11 sm:h-12 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-brand-950 tracking-tight leading-tight">
                Dr RVR NRI INSTITUTE OF TECHNOLOGY
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-brand-700 leading-tight">
                (Deemed to be University) · Directorate of Research & Development (R&D)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end md:self-center">
            <button
              type="button"
              onClick={() => setCurrentView('form')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                currentView === 'form'
                  ? 'bg-brand-800 text-white'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Applicant Form
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                currentView === 'admin'
                  ? 'bg-brand-950 text-white'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
