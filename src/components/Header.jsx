import React from 'react';

export default function Header({ currentView, setCurrentView }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Main branding & navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/nrilogo.png"
              alt="Dr RVR NRIIT Logo"
              className="h-12 sm:h-14 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-brand-950 tracking-tight leading-tight">
                Dr RVR NRI INSTITUTE OF TECHNOLOGY
              </h1>
              <p className="text-xs font-semibold text-brand-700">
                (Deemed to be University) · Directorate of Research & Development
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Pothavarappadu, Agiripalli, Vijayawada Rural, A.P. – 521212
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              type="button"
              onClick={() => setCurrentView('form')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'form'
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Applicant Form
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'admin'
                  ? 'bg-brand-950 text-white shadow-sm'
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
