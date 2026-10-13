import React from 'react';
import { Award, Mail, Phone, MapPin, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Header({ currentView, setCurrentView }) {
  const isSupabaseLive = isSupabaseConfigured();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Top utility bar */}
      <div className="bg-brand-950 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-brand-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Vijayawada Rural, Andhra Pradesh – 521212
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <a href="mailto:deanrnd@nriit.edu.in" className="hover:text-white underline">
                deanrnd@nriit.edu.in
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                isSupabaseLive
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                  : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
              }`}
              title={
                isSupabaseLive
                  ? 'Connected to Live Supabase PostgreSQL & Storage'
                  : 'Operating in Persistent Sandbox Mode (Configure .env for Live Supabase)'
              }
            >
              <Database className="w-3 h-3" />
              {isSupabaseLive ? 'Supabase Live' : 'Active Local DB'}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-gold-400 font-semibold text-[11px] tracking-wide">
              Ph.D. Admissions 2025-26
            </span>
          </div>
        </div>
      </div>

      {/* Main branding & navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/nrilogo.png"
              alt="Dr RVR NRIIT Logo"
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-brand-950 tracking-tight leading-tight">
                  Dr RVR NRI INSTITUTE OF TECHNOLOGY
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-brand-700">
                (Deemed to be University)
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Pothavarappadu, Agiripalli, Vijayawada Rural, A.P. – 521212
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center">
            <button
              type="button"
              onClick={() => setCurrentView('form')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentView === 'form'
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Applicant Form
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'bg-brand-950 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
