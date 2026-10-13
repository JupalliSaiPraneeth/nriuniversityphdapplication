import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-4 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            <strong className="text-white">Dr RVR NRI Institute of Technology (Deemed to be University)</strong>
            <span className="hidden sm:inline"> · Pothavarappadu, Agiripalli, Vijayawada Rural, AP – 521212</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Dean R&D: <a href="mailto:deanrnd@nriit.edu.in" className="text-slate-300 hover:text-white underline">deanrnd@nriit.edu.in</a></span>
            <span>·</span>
            <span>© {new Date().getFullYear()} NRIIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
