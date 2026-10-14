import React from 'react';
import { UNIVERSITY_INFO, RESEARCH_DISCIPLINES } from '../data/portalData';


export default function Footer({ onOpenForm, onOpenStatus, onOpenPrivacy, setCurrentView }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1E1D1D] text-slate-300 border-t border-neutral-800 mt-0 text-xs">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1: Contact Us & Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white border-b border-[#EC691F] pb-2">
              CONTACT US
            </h3>
            <div className="text-[12px] text-slate-300 leading-relaxed font-medium">
              <strong className="text-white block font-bold text-xs uppercase mb-1">
                Dr. RVR NRI INSTITUTE OF TECHNOLOGY
              </strong>
              <p className="text-slate-300">
                Pothavarappadu (V), Agiripalli (M),<br />
                Vijayawada Rural, Eluru District,<br />
                Andhra Pradesh – 521212
              </p>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300">
              <p>
                <strong>Tel:</strong> +91 9640 334422<br />
                <strong>Admissions:</strong> +91 9247598461 / 62 / 63 / 64 / 65
              </p>
              <p>
                <strong>Email:</strong> info@rvrnriuniversity.edu.in | deanrnd@nriit.edu.in
              </p>
            </div>

                        {/* Social Media Channels */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold">
              <a
                href="https://www.facebook.com/NRIUniversityAP"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-white/10 hover:bg-[#EC691F] text-white transition"
              >
                Facebook
              </a>
              <a
                href="https://x.com/NRIUniversity"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-white/10 hover:bg-[#EC691F] text-white transition"
              >
                Twitter / X
              </a>
              <a
                href="https://www.linkedin.com/school/nri-university-ap/"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-white/10 hover:bg-[#EC691F] text-white transition"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/nriuniversity_ap/"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-white/10 hover:bg-[#EC691F] text-white transition"
              >
                Instagram
              </a>
            </div>

            {/* Google Map Get Direction Link */}
            <div className="pt-1">
              <a
                href="https://maps.google.com/?q=Dr.+RVR+NRI+INSTITUTE+OF+TECHNOLOGY,+Agiripalli"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EC691F] hover:text-white transition"
              >
                <span>Get Campus Direction (Google Maps)</span>
              </a>
            </div>
          </div>

          {/* Column 2: Ph.D. Programmes & Research Areas */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white border-b border-[#EC691F] pb-2">
              PH.D. PROGRAMMES
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-300 font-medium uppercase tracking-wider">
              <li>
                <a href="#programmes" className="hover:text-[#EC691F] transition">
                  Full-Time Ph.D. Programme
                </a>
              </li>
              <li>
                <a href="#programmes" className="hover:text-[#EC691F] transition">
                  Part-Time Ph.D. Programme
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-[#EC691F] transition">
                  Departments & Research Areas (10 Disciplines)
                </a>
              </li>
              <li>
                <a href="#entrance-exam" className="hover:text-[#EC691F] transition">
                  Entrance Examination (Part A & B — 75 Marks)
                </a>
              </li>
              <li>
                <a href="#syllabus" className="hover:text-[#EC691F] transition">
                  Department-Wise Syllabus Downloads
                </a>
              </li>
              <li>
                <a href="#fee-structure" className="hover:text-[#EC691F] transition">
                  Ph.D. Fee Structure Circular
                </a>
              </li>
              <li>
                <a href="#important-dates" className="hover:text-[#EC691F] transition">
                  Important Dates & Schedule
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Admission Guidelines & Regulations */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white border-b border-[#EC691F] pb-2">
              ADMISSION GUIDELINES
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-300 font-medium uppercase tracking-wider">
              <li>
                <a href="#eligibility" className="hover:text-[#EC691F] transition">
                  Eligibility for Admission
                </a>
              </li>
              <li>
                <a href="#procedure" className="hover:text-[#EC691F] transition">
                  7-Stage Admission Procedure
                </a>
              </li>
              <li>
                <a href="#exemptions" className="hover:text-[#EC691F] transition">
                  NET / JRF / GATE Exemptions
                </a>
              </li>
              <li>
                <a href="#interview" className="hover:text-[#EC691F] transition">
                  Interview & Proposal Presentation
                </a>
              </li>
              <li>
                <a href="#downloads" className="hover:text-[#EC691F] transition">
                  Ph.D. Regulations & Guidelines
                </a>
              </li>
              <li>
                <a href="#checklist" className="hover:text-[#EC691F] transition">
                  Final Implementation Checklist
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#EC691F] transition">
                  Contact Admissions Helpdesk
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Ph.D. Admissions & Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white border-b border-[#EC691F] pb-2">
              Ph.D. ADMISSIONS 2026–27
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Applications are invited for Full-Time & Part-Time Ph.D. programmes across Engineering, Pharmacy, Management, and Applied Sciences.
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Central Apply Online CTA Button */}
              <button
                type="button"
                onClick={onOpenForm}
                className="w-full py-2.5 px-4 bg-[#EC691F] hover:bg-[#d95a14] active:scale-[0.98] text-white font-extrabold rounded-md text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider border border-[#d95a14]"
              >
                <span>Apply Online (Ph.D. Form)</span>
              </button>

              <button
                type="button"
                onClick={onOpenStatus}
                className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-md text-xs border border-white/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Track Application Status</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setCurrentView) setCurrentView('admin');
                  scrollToTop();
                }}
                className="w-full py-1.5 px-3 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-[11px] font-medium rounded transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Admin Review Portal (Dean R&D)</span>
              </button>
            </div>

            <div className="p-2.5 rounded bg-[#2A2929] border border-neutral-700 text-[10px] text-slate-300">
              <strong className="text-[#EC691F]">Helpline:</strong> Contact Directorate of R&D at{' '}
              <a href="mailto:deanrnd@nriit.edu.in" className="underline text-white">
                deanrnd@nriit.edu.in
              </a>{' '}
              for admission queries.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-neutral-800 bg-[#141313] py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-400">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert("Official Disclaimer:\n\nDr. RVR NRI Institute of Technology is an Institution deemed to be University u/s 3 of UGC Act, 1956. Ph.D. admissions, proposed schedules, and examination patterns are subject to formal University Statutory Council approvals.")}
              className="hover:text-white transition cursor-pointer"
            >
              Disclaimer
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-white transition cursor-pointer font-semibold text-slate-300"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <span className="text-slate-400">Cookie Notice</span>
          </div>

          <div className="text-slate-400">
            Copyright © {new Date().getFullYear()} - <strong className="text-white">RVRNRIUNIVERSITY.EDU.IN</strong> · Dr. RVR NRI Institute of Technology (Deemed to be University u/s 3 of UGC Act, 1956). All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-white flex items-center gap-1 text-[11px] font-bold text-[#EC691F] transition cursor-pointer"
          >
            <span>Scroll to Top ▲</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

