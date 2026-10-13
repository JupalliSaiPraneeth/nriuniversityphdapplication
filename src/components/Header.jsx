import React from 'react';

export default function Header({ currentView, setCurrentView }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Main branding & navigation bar */}
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <img
              src="/nrilogo.png"
              alt="Dr RVR NRIIT Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-brand-950 tracking-tight leading-tight">
                Dr RVR NRI INSTITUTE OF TECHNOLOGY
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-brand-700 leading-tight">
                (Deemed to be University) · Directorate of Research & Development
              </p>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium leading-tight">
                Pothavarappadu, Agiripalli, Vijayawada Rural, A.P. – 521212
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-stretch sm:self-auto bg-slate-100/90 sm:bg-transparent p-1 sm:p-0 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setCurrentView('form')}
              className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all text-center ${
                currentView === 'form'
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/80 sm:hover:bg-slate-100 sm:border sm:border-slate-200'
              }`}
            >
              Applicant Form
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all text-center ${
                currentView === 'admin'
                  ? 'bg-brand-950 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/80 sm:hover:bg-slate-100 sm:border sm:border-slate-200'
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
