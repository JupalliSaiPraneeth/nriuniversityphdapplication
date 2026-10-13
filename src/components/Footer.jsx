import React from 'react';
import { Mail, MapPin, Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide mb-2 uppercase">
              Dr RVR NRI Institute of Technology
            </h3>
            <p className="text-slate-300 font-medium mb-1">(Deemed to be University)</p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Approved by AICTE & UGC. Dedicated to advanced interdisciplinary doctoral research, technological innovation, and academic excellence.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm tracking-wide mb-2 uppercase">
              Directorate of Research & Development (R&D)
            </h3>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Pothavarappadu, Agiripalli, Vijayawada Rural, Andhra Pradesh – 521212, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:deanrnd@nriit.edu.in" className="hover:text-white underline">
                  deanrnd@nriit.edu.in
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm tracking-wide mb-2 uppercase">
              Application & Security Notice
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-400">
              All personal biodata and uploaded identity/qualification credentials are encrypted and stored securely under strict university data protection policies.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Row Level Security (RLS) & Private Storage Enabled</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Dr RVR NRI Institute of Technology. All Rights Reserved.</p>
          <p>Ph.D. Admissions & Evaluation System</p>
        </div>
      </div>
    </footer>
  );
}
