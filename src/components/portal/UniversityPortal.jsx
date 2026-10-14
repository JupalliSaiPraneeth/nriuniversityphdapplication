import React, { useState } from 'react';
import {
  UNIVERSITY_INFO,
  IMPORTANT_DATES,
  IMPORTANT_DATES_DISCLAIMER,
  PROGRAMME_OPTIONS,
  RESEARCH_DISCIPLINES,
  ELIGIBILITY_CRITERIA,
  ADMISSION_PROCEDURE,
  ENTRANCE_EXAMINATION,
  EXEMPTION_CRITERIA,
  INTERVIEW_PRESENTATION,
  FEE_STRUCTURE,
  ONLINE_FORM_DETAILS,
  WEBSITE_DOWNLOADS_LINKS,
  ADMIN_DASHBOARD_SPECS,
  IMPLEMENTATION_CHECKLIST,
  DEPARTMENT_SYLLABI
} from '../../data/portalData';
import DepartmentDetailModal from './DepartmentDetailModal';

export default function UniversityPortal({ onOpenForm, onOpenStatus, onOpenAdmin }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSyllabusDept, setSelectedSyllabusDept] = useState('cse');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubject, setContactSubject] = useState('Ph.D. Admissions Enquiry');
  const [previewCategory, setPreviewCategory] = useState('Full-Time');
  const [previewDiscipline, setPreviewDiscipline] = useState('');
  const [previewValidationMsg, setPreviewValidationMsg] = useState(null);

  const handleValidatePreview = () => {
    if (!previewDiscipline) {
      setPreviewValidationMsg({
        type: 'error',
        text: 'Please select a department / discipline in Programme Details before validating preview.',
      });
    } else {
      setPreviewValidationMsg({
        type: 'success',
        text: `Preview validated successfully for ${previewCategory} Ph.D. in ${previewDiscipline}. All sections A through D, declaration, and payment terms are confirmed.`,
      });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="space-y-0 pb-0 bg-white text-slate-900">
      {/* ========================================================= */}
      {/* 1. HOME PAGE / HERO SECTION                              */}
      {/* ========================================================= */}
      <section id="home" className="relative bg-[#1E1D1D] text-white overflow-hidden border-b border-[#EC691F]">
        {/* Background gradient & decorative texture matching university website */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1D1D] via-[#2A2929] to-[#1E1D1D] opacity-95" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#EC691F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              {/* Badges strip */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-[#EC691F]/40 text-[#EC691F] text-[11px] sm:text-xs font-bold tracking-wide shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#EC691F] animate-pulse" />
                  {UNIVERSITY_INFO.programmeTitle}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#A51C30]/80 border border-[#A51C30] text-rose-100 text-[11px] sm:text-xs font-semibold shrink-0">
                  UGC Act 1956 Deemed to be University
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-[11px] sm:text-xs font-semibold shrink-0">
                  NAAC 'A' Grade · NBA Accredited
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Ph.D. Admissions 2026–2027
                </h1>
                <p className="text-base sm:text-xl md:text-2xl font-bold text-[#EC691F] mt-1.5 font-serif tracking-wide">
                  {UNIVERSITY_INFO.tagline}
                </p>
              </div>

              {/* Exact Invitation Paragraph */}
              <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed max-w-2xl font-normal bg-white/5 p-3.5 rounded-lg border border-white/10">
                {UNIVERSITY_INFO.introParagraph}
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-1">
                {/* PROMINENT ONLINE APPLICATION BUTTON */}
                <button
                  type="button"
                  onClick={onOpenForm}
                  className="w-full sm:w-auto px-5 py-3 rounded-md bg-[#EC691F] hover:bg-[#d95a14] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider border border-[#d95a14] text-center"
                  title="Click to Open the 7-Step Ph.D. Online Application Form"
                >
                  <span>Pay Fee & Apply Online →</span>
                </button>

                <a
                  href="#important-dates"
                  className="w-full sm:w-auto px-4 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>Admission Schedule</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenStatus}
                  className="w-full sm:w-auto px-4 py-3 rounded-md bg-transparent hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center border border-white/10 sm:border-transparent"
                >
                  <span>Check Application Status</span>
                </button>
              </div>
            </div>

            {/* Right Card: Snapshot of Admissions */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl p-4 sm:p-5 text-slate-900 shadow-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-[#EC691F] uppercase tracking-wider block">
                      Admissions Desk
                    </span>
                    <h3 className="font-extrabold text-sm text-[#1E1D1D]">
                      Ph.D. Session 2026–2027
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full border border-emerald-600 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    Online Open
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-600 font-medium">Application Portal Opens:</span>
                    <strong className="text-[#1E1D1D]">02 December 2026</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-600 font-medium">Last Date for Submission:</span>
                    <strong className="text-rose-700 font-bold">25 December 2026</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-600 font-medium">Entrance Exam (Proposed):</span>
                    <strong className="text-[#1E1D1D]">02 January 2027</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-orange-50 border border-orange-200 text-[#EC691F]">
                    <span className="font-medium">Total Exam Marks:</span>
                    <strong className="font-bold">75 Marks (Part A: 25, Part B: 50)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#FAF7F5] border border-stone-200 text-[#1E1D1D]">
                    <span className="font-medium">Programme Modes:</span>
                    <strong className="font-bold">Full-Time & Part-Time</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenForm}
                  className="w-full py-2.5 rounded bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-2 cursor-pointer border border-[#d95a14]"
                >
                  Start Online Application Form
                </button>
              </div>
            </div>
          </div>

          {/* Quick Counter Strip - gap-0 with divide-x */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/20 border border-white/20 mt-6 sm:mt-8 rounded overflow-hidden">
            <div className="bg-white/10 backdrop-blur-xs p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-[#EC691F] block">10</span>
              <span className="text-[11px] text-slate-200 uppercase font-semibold">Research Disciplines</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-[#EC691F] block">75 Marks</span>
              <span className="text-[11px] text-slate-200 uppercase font-semibold">Entrance Exam Pattern</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-[#EC691F] block">Full & Part</span>
              <span className="text-[11px] text-slate-200 uppercase font-semibold">Flexible Modes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-[#EC691F] block">UGC Aligned</span>
              <span className="text-[11px] text-slate-200 uppercase font-semibold">Approved Regulations</span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 2. IMPORTANT DATES SECTION                                */}
      {/* ========================================================= */}
      <section id="important-dates" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#1E1D1D] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EC691F]">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Admission Activity Schedule
                </span>
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                  2. Important Dates — Ph.D. Admissions 2026–2027
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenForm}
                  className="px-4 py-2 bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold rounded shadow-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border border-[#d95a14]"
                >
                  Online Application Form
                </button>
                <a
                  href="#downloads"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded border border-white/20 flex items-center gap-1.5 transition"
                >
                  Admission Notification
                </a>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base border-collapse min-w-[500px]">
                <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase text-xs sm:text-sm font-extrabold tracking-wider border-b border-stone-200">
                  <tr className="divide-x divide-slate-200">
                    <th className="py-2.5 px-3 sm:px-4 w-1/2">Admission Activity</th>
                    <th className="py-2.5 px-3 sm:px-4 w-1/4">Proposed Date</th>
                    <th className="py-2.5 px-3 sm:px-4 w-1/4">Status / Notice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {IMPORTANT_DATES.map((item, idx) => (
                    <tr key={idx} className="divide-x divide-slate-200 hover:bg-orange-50/40 transition">
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-[#1E1D1D] text-sm sm:text-base">
                        {item.activity}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-[#EC691F] text-sm sm:text-base">
                        {item.date}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-sm font-semibold text-slate-800">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formal Disclaimer Note */}
            <div className="p-3.5 sm:p-4 bg-amber-50/80 border-t border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <p className="leading-relaxed font-medium text-xs">
                <strong className="font-bold">Important Notice: </strong>
                {IMPORTANT_DATES_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PH.D. PROGRAMME OPTIONS                                */}
      {/* ========================================================= */}
      <section id="programmes" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
            <span className="text-[#EC691F] text-xs font-extrabold uppercase tracking-widest block mb-0.5">
              Doctoral Categories
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E1D1D]">
              3. Ph.D. Programme Options
            </h2>
            <div className="w-12 h-1 bg-[#EC691F] mx-auto my-1.5 rounded" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {PROGRAMME_OPTIONS.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300 rounded-none overflow-hidden bg-white">
            {PROGRAMME_OPTIONS.options.map((opt) => (
              <div
                key={opt.id}
                className={`p-4 sm:p-5 flex flex-col justify-between ${opt.accentColor} hover:bg-orange-50/10 transition`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF5EE] text-[#EC691F] border border-orange-200 uppercase tracking-wider">
                      {opt.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">Session 2026–2027</span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1E1D1D]">
                      {opt.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#EC691F]">
                      {opt.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal bg-[#FAF7F5] p-3 rounded-none border border-stone-200">
                    {opt.description}
                  </p>

                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="px-3.5 py-1.5 bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider border border-[#d95a14]"
                  >
                    Apply for {opt.title} →
                  </button>
                  <a
                    href="#fee-structure"
                    className="text-xs font-semibold text-slate-600 hover:text-[#EC691F] transition"
                  >
                    View Fee Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. DEPARTMENTS AND RESEARCH DISCIPLINES                   */}
      {/* ========================================================= */}
      <section id="departments" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header matching Section 4 */}
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-6">
            <span className="text-[#EC691F] text-xs font-extrabold uppercase tracking-widest block mb-0.5">
              Doctoral Disciplines & Specializations
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E1D1D]">
              4. Departments and Research Disciplines
            </h2>
            <div className="w-12 h-1 bg-[#EC691F] mx-auto my-1.5 rounded" />
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Applications may be invited in the following broad areas, subject to the University's approved research programmes and recognized supervisors.
            </p>
          </div>

          {/* Department / discipline & Indicative research areas Table */}
          <div className="bg-white border border-slate-300 rounded-none overflow-hidden shadow-xs">
            <div className="bg-[#1E1D1D] text-white px-3 py-2 flex items-center justify-between border-b border-[#EC691F]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC691F]">
                Department / Discipline & Indicative Research Areas
              </span>
              <span className="text-xs text-slate-300">10 Approved Disciplines</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base border-collapse min-w-[540px]">
                <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs sm:text-sm border-b border-stone-200">
                  <tr className="divide-x divide-slate-200">
                    <th className="py-2.5 px-3 sm:px-4 w-1/3">Department / discipline</th>
                    <th className="py-2.5 px-3 sm:px-4 w-1/2">Indicative research areas</th>
                    <th className="py-2.5 px-3 sm:px-4 w-24 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {RESEARCH_DISCIPLINES.map((dept, idx) => (
                    <tr key={idx} className="divide-x divide-slate-200 hover:bg-orange-50/40 transition">
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-[#1E1D1D] text-sm sm:text-base">
                        {dept.name}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
                        {dept.researchAreas.join(', ')}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={onOpenForm}
                          className="px-3 py-1 bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold rounded shadow-xs transition uppercase tracking-wider cursor-pointer border border-[#d95a14]"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. ELIGIBILITY FOR ADMISSION                              */}
      {/* ========================================================= */}
      <section id="eligibility" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Admission Regulations & Qualifications
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                5. Eligibility for Admission
              </h2>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed bg-[#FAF7F5] p-3 rounded-none border border-orange-200">
                {ELIGIBILITY_CRITERIA.header}
              </p>

              <div className="border border-slate-300 divide-y divide-slate-200 rounded-none overflow-hidden bg-white">
                {ELIGIBILITY_CRITERIA.points.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-3.5 bg-white hover:bg-orange-50/20 transition flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#EC691F] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  * Category relaxations and interdisciplinary mapping apply in accordance with prevailing UGC standards.
                </span>
                <a
                  href="#downloads"
                  className="text-xs font-bold text-[#EC691F] hover:underline flex items-center gap-1"
                >
                  Download Detailed Eligibility Guidelines PDF →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. ADMISSION PROCEDURE (7 Steps)                          */}
      {/* ========================================================= */}
      <section id="procedure" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4">
            <span className="text-[#EC691F] text-xs font-extrabold uppercase tracking-widest block mb-0.5">
              Doctoral Admissions Roadmap
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E1D1D]">
              6. Admission Procedure
            </h2>
            <div className="w-12 h-1 bg-[#EC691F] mx-auto my-1.5 rounded" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Step-by-step workflow for admission into the Dr. RVR NRIIT Ph.D. programme 2026–2027.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-300 border border-slate-300 rounded-none overflow-hidden">
            {ADMISSION_PROCEDURE.map((step) => (
              <div
                key={step.step}
                className="bg-white p-3.5 sm:p-4 flex flex-col justify-between hover:bg-orange-50/20 transition group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-[#1E1D1D] text-[#EC691F] flex items-center justify-center font-black text-xs group-hover:bg-[#EC691F] group-hover:text-white transition">
                      0{step.step}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Stage {step.step} of 7
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-[#1E1D1D] leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {step.step === 1 && (
                  <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onOpenForm}
                      className="w-full py-1.5 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs rounded transition uppercase tracking-wider cursor-pointer border border-[#d95a14]"
                    >
                      Register Online Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. PH.D. ENTRANCE EXAMINATION                             */}
      {/* ========================================================= */}
      <section id="entrance-exam" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Selection Test Architecture
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                7. Ph.D. Entrance Examination
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {ENTRANCE_EXAMINATION.intro}
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {/* Examination Pattern Table */}
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1E1D1D] mb-2">
                  Proposed Examination Pattern
                </h3>
                <div className="overflow-x-auto rounded-none border border-slate-200">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[320px]">
                    <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs">
                      <tr>
                        <th className="py-2 px-3 sm:px-4">Component</th>
                        <th className="py-2 px-3 sm:px-4 text-right">Proposed Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ENTRANCE_EXAMINATION.pattern.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 sm:px-4 font-semibold text-slate-800">
                            {p.component}
                            <span className="block text-xs font-normal text-slate-500 mt-0.5">
                              {p.description}
                            </span>
                          </td>
                          <td className="py-2 px-3 sm:px-4 text-right font-extrabold text-[#EC691F]">
                            {p.marks}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-orange-50/50 font-bold text-[#1E1D1D]">
                        <td className="py-2 px-3 sm:px-4 uppercase">Total</td>
                        <td className="py-2 px-3 sm:px-4 text-right font-black text-base sm:text-lg text-[#EC691F]">
                          {ENTRANCE_EXAMINATION.totalMarks}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part A Coverage */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                  Part A: Research Aptitude and Methodology (Proposed Coverage)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-orange-200 divide-y sm:divide-y-0 sm:divide-x divide-orange-200 rounded-none overflow-hidden bg-white text-xs text-slate-700">
                  {ENTRANCE_EXAMINATION.partACoverage.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-[#FAF7F5] flex items-start gap-2">
                      <span className="text-[#EC691F] font-bold shrink-0">•</span>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B Coverage */}
              <div className="space-y-1.5 bg-[#FAF7F5] p-3 rounded-none border border-orange-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                  Part B: Subject Knowledge (Subject-Specific Examination)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {ENTRANCE_EXAMINATION.partBCoverageText}
                </p>
              </div>

              {/* Examination Instructions Display */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                  Examination Instructions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-none overflow-hidden">
                  {ENTRANCE_EXAMINATION.instructions.map((inst, idx) => (
                    <div key={idx} className="p-2.5 bg-white flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-stone-100 text-[#1E1D1D] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 font-medium">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working pattern disclaimer */}
              <div className="p-3 rounded-none bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <p className="leading-relaxed font-medium">
                  <strong className="font-bold">Approval Note: </strong>
                  {ENTRANCE_EXAMINATION.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. ENTRANCE EXAMINATION EXEMPTIONS                        */}
      {/* ========================================================= */}
      <section id="exemptions" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                National Examination Equivalencies
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                8. Entrance Examination Exemptions
              </h2>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed bg-[#FAF7F5] p-3 rounded-none border border-orange-200">
                {EXEMPTION_CRITERIA.header}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-none overflow-hidden text-xs sm:text-sm">
                {EXEMPTION_CRITERIA.qualifications.map((q, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span className="font-semibold text-slate-800">{q}</span>
                  </div>
                ))}
              </div>

              {/* Critical Verification Clause */}
              <div className="p-3 rounded-none bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-2.5">
                <p className="leading-relaxed font-medium">
                  <strong className="font-bold text-rose-800">Important Scrutiny Requirement: </strong>
                  {EXEMPTION_CRITERIA.importantNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. INTERVIEW AND RESEARCH PROPOSAL PRESENTATION           */}
      {/* ========================================================= */}
      <section id="interview" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Selection Committee Evaluation
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                9. Interview and Research Proposal Presentation
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {INTERVIEW_PRESENTATION.header}
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D] mb-2">
                  The Interview May Assess:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 rounded-none overflow-hidden bg-[#FAF7F5]">
                  {INTERVIEW_PRESENTATION.assessmentPoints.map((point, idx) => (
                    <div key={idx} className="p-3 bg-[#FAF7F5] flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-[#EC691F] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="font-medium text-slate-800">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-none bg-orange-50/60 border border-orange-200 text-slate-900 text-xs space-y-1">
                <strong className="font-bold block text-xs text-[#1E1D1D]">
                  Candidate Instructions & Documentation:
                </strong>
                <p className="leading-relaxed">
                  {INTERVIEW_PRESENTATION.candidateInstructions}
                </p>
                <p className="text-[10px] text-[#A51C30] font-medium italic pt-0.5">
                  {INTERVIEW_PRESENTATION.scheduleNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. PH.D. FEE STRUCTURE                                   */}
      {/* ========================================================= */}
      <section id="fee-structure" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Tuition & Academic Fees
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                10. Ph.D. Fee Structure
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {FEE_STRUCTURE.note}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[460px]">
                <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3 sm:px-4">Fee Component</th>
                    <th className="py-2.5 px-3 sm:px-4">Full-Time Ph.D.</th>
                    <th className="py-2.5 px-3 sm:px-4">Part-Time Ph.D.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {FEE_STRUCTURE.table.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 sm:px-6 font-semibold text-slate-800">
                        {row.component}
                      </td>
                      <td className="py-3 px-4 sm:px-6 font-bold text-[#EC691F]">
                        {row.fullTime}
                      </td>
                      <td className="py-3 px-4 sm:px-6 font-bold text-[#A51C30]">
                        {row.partTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 text-slate-600 text-xs sm:text-sm flex items-start gap-2.5">
              <p className="leading-relaxed text-xs">
                {FEE_STRUCTURE.footerNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. ONLINE PH.D. APPLICATION FORM SPECIFICATION          */}
      {/* ========================================================= */}
      <section id="apply-online" className="bg-[#1E1D1D] text-white border-b border-[#EC691F] py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1E1D1D] via-[#2A2929] to-[#1E1D1D] text-white rounded-none shadow-md p-4 sm:p-6 border border-[#EC691F]/40 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/20 pb-3">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Interactive Candidate Portal
                </span>
                <h2 className="text-base sm:text-2xl font-extrabold tracking-tight">
                  11. Online Ph.D. Application Form
                </h2>
                <p className="text-xs text-stone-300 mt-0.5">
                  The website should provide an online application portal with the following sections.
                </p>
              </div>

              {/* DIRECT CTA BUTTON TO OPEN 7-STEP APPLICATION FORM */}
              <button
                type="button"
                onClick={onOpenForm}
                className="px-5 py-2.5 rounded-md bg-[#EC691F] hover:bg-[#d95a14] text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0 border border-[#d95a14]"
                title="Click to Open the 7-Step Ph.D. Application Form"
              >
                <span>Open Online Application Form →</span>
              </button>
            </div>

            {/* Illustrative Form Preview Card */}
            <div className="bg-white text-slate-900 rounded-none border-2 border-[#EC691F] p-4 sm:p-5 shadow-lg space-y-4">
              <div className="border-b border-slate-200 pb-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1E1D1D] uppercase tracking-wide">
                    Ph.D. Admission Application — 2026–2027
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold uppercase tracking-wider rounded">
                    Illustrative Form Preview
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 italic">
                  Illustrative form preview. This form does not submit data to the University or process payments.
                </p>
              </div>

              {/* A. Programme Details */}
              <div className="p-3.5 bg-[#FAF7F5] border border-orange-200 rounded-none space-y-3">
                <h4 className="text-xs font-extrabold text-[#EC691F] uppercase tracking-wider">
                  A. Programme Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5 uppercase text-[11px]">
                      Admission category
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                        <input
                          type="radio"
                          name="preview_category"
                          value="Full-Time"
                          checked={previewCategory === 'Full-Time'}
                          onChange={(e) => setPreviewCategory(e.target.value)}
                          className="text-[#EC691F] focus:ring-[#EC691F]"
                        />
                        <span>Full-Time</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                        <input
                          type="radio"
                          name="preview_category"
                          value="Part-Time"
                          checked={previewCategory === 'Part-Time'}
                          onChange={(e) => setPreviewCategory(e.target.value)}
                          className="text-[#EC691F] focus:ring-[#EC691F]"
                        />
                        <span>Part-Time</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5 uppercase text-[11px]">
                      Department / discipline
                    </label>
                    <select
                      value={previewDiscipline}
                      onChange={(e) => setPreviewDiscipline(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium focus:border-[#EC691F] focus:outline-hidden"
                    >
                      <option value="">Select discipline</option>
                      {RESEARCH_DISCIPLINES.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* B, C, D Sections Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300 rounded-none overflow-hidden text-xs">
                <div className="p-3 bg-white space-y-1">
                  <h4 className="font-extrabold text-[#1E1D1D] uppercase text-[11px]">
                    B. Candidate Details
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Personal identity, parental details, date of birth, category, address & mobile verification.
                  </p>
                </div>
                <div className="p-3 bg-white space-y-1">
                  <h4 className="font-extrabold text-[#1E1D1D] uppercase text-[11px]">
                    C. Educational Qualifications
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Relevant Master's degree, Bachelor's degree, qualifying marks & institutional certificates.
                  </p>
                </div>
                <div className="p-3 bg-white space-y-1">
                  <h4 className="font-extrabold text-[#1E1D1D] uppercase text-[11px]">
                    D. Research Information
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Proposed research area, objectives, methodology, supervisor mapping & NET/GATE qualification.
                  </p>
                </div>
              </div>

              {/* Declaration and payment */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none text-xs space-y-2">
                <h4 className="font-extrabold text-[#1E1D1D] uppercase text-[11px]">
                  Declaration and payment
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal">
                  The production portal should include a declaration of the accuracy of submitted information, consent to the University's admission terms, document uploads, application fee payment, transaction verification and application acknowledgement.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleValidatePreview}
                    className="px-4 py-2 bg-[#1E1D1D] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Validate Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="px-4 py-2 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs cursor-pointer flex items-center gap-1.5 border border-[#d95a14]"
                  >
                    <span>Open Live 7-Step Form</span>
                  </button>
                </div>

                {previewValidationMsg && (
                  <div className={`p-2.5 rounded text-xs font-semibold flex items-start gap-2 ${
                    previewValidationMsg.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-300'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  }`}>
                    <span>{previewValidationMsg.text}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Required document uploads */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-none border border-white/15 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                Required Document Uploads
              </h4>
              <p className="text-xs text-slate-300">
                The actual application portal should support PDF uploads for:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/15 divide-y sm:divide-y-0 sm:divide-x divide-white/15 p-2 rounded-none overflow-hidden text-xs text-slate-200">
                {ONLINE_FORM_DETAILS.requiredUploads.map((up, idx) => (
                  <div key={idx} className="p-2 flex items-start gap-1.5">
                    <span className="text-[#EC691F] font-bold">•</span>
                    <span>{up}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application payment workflow */}
            <div className="space-y-1.5 text-xs text-slate-200">
              <h4 className="font-bold text-white uppercase tracking-wider">
                Application payment workflow
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15 p-2 rounded-none overflow-hidden">
                {ONLINE_FORM_DETAILS.paymentWorkflow.map((wf, idx) => (
                  <div key={idx} className="p-2 flex items-start gap-1.5">
                    <span className="text-[#EC691F] font-bold">{idx + 1}.</span>
                    <span>{wf}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={onOpenForm}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#EC691F] hover:bg-[#d95a14] text-white font-black text-xs sm:text-sm rounded shadow transition uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2 border border-[#d95a14]"
              >
                <span>Proceed to 7-Step Ph.D. Online Application Form</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. WEBSITE DOWNLOADS AND IMPORTANT LINKS                 */}
      {/* ========================================================= */}
      <section id="downloads" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F] flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Official Institutional Repository
                </span>
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                  12. Website Downloads and Important Links
                </h2>
              </div>
              <span className="text-xs text-slate-300">
                11 Official Documents & Links
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[520px]">
                <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-3 sm:px-4">Website Link</th>
                    <th className="py-2 px-3 sm:px-4">Purpose / Scope</th>
                    <th className="py-2 px-3 sm:px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {WEBSITE_DOWNLOADS_LINKS.map((link, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-[#1E1D1D] flex items-center gap-2">
                        <span>{link.title}</span>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-slate-600 font-medium">
                        {link.purpose}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (link.downloadId === 'contact') {
                              const el = document.querySelector('#contact');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            } else if (link.downloadId === 'dates') {
                              const el = document.querySelector('#important-dates');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              alert(`Official Document: ${link.title}\n\nThis official PDF download will be linked to the approved University server upon final notification release.`);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer border border-[#d95a14]"
                        >
                          <span>Access / View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 13. DEPARTMENT-WISE SYLLABI EXPLORER (Supporting Sec 7/12) */}
      {/* ========================================================= */}
      <section id="syllabus" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="border-b border-slate-200 pb-2.5">
              <span className="text-[#EC691F] text-xs font-extrabold uppercase tracking-widest block mb-0.5">
                Entrance Exam Syllabi
              </span>
              <h2 className="text-base sm:text-xl font-extrabold text-[#1E1D1D]">
                Department-Wise Ph.D. Entrance Syllabi (Part A & Part B)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Select a research discipline below to inspect the syllabus components for the entrance test.
              </p>
            </div>

            {/* Department buttons */}
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(DEPARTMENT_SYLLABI).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSyllabusDept(key)}
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    selectedSyllabusDept === key
                      ? 'bg-[#EC691F] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {DEPARTMENT_SYLLABI[key].name}
                </button>
              ))}
            </div>

            {/* Selected Department Syllabus Card */}
            {selectedSyllabusDept && (
              <div className="bg-[#FAF7F5] rounded-none p-3.5 border border-orange-200 space-y-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-[#1E1D1D]">
                  {DEPARTMENT_SYLLABI[selectedSyllabusDept].name} — Entrance Syllabus
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 rounded-none overflow-hidden bg-white text-xs">
                  <div className="bg-white p-3 space-y-0.5">
                    <span className="font-bold text-[#EC691F] block text-[11px]">Part A Component:</span>
                    <p className="text-slate-700">{DEPARTMENT_SYLLABI[selectedSyllabusDept].partA}</p>
                  </div>
                  <div className="bg-white p-3 space-y-0.5">
                    <span className="font-bold text-[#A51C30] block text-[11px]">Part B Core Domain:</span>
                    <p className="text-slate-700">{DEPARTMENT_SYLLABI[selectedSyllabusDept].partB}</p>
                  </div>
                </div>
                <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Total Entrance Marks: 75 Marks · Duration: 120 Minutes
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Official syllabus PDF for ${DEPARTMENT_SYLLABI[selectedSyllabusDept].name} will download.`)}
                    className="px-2.5 py-1 bg-[#1E1D1D] hover:bg-[#EC691F] text-white text-xs font-bold rounded flex items-center gap-1 transition cursor-pointer"
                  >
                    Download Syllabus PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 14. ADMINISTRATIVE DASHBOARD REQUIREMENTS                 */}
      {/* ========================================================= */}
      <section id="admin-requirements" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Admissions Directorate Interface
                </span>
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                  14. Administrative Dashboard Requirements
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3.5 py-1.5 bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold rounded shadow-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border border-[#d95a14]"
              >
                Open Admin Dashboard
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-2.5">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                The website provides a secure administrator interface for the Ph.D. admissions office to manage applications, verify credentials, generate exam lists, and record selection outcomes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-none overflow-hidden">
                {ADMIN_DASHBOARD_SPECS.map((spec, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF7F5] flex items-start gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-[#1E1D1D] text-[#EC691F] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 15. FINAL IMPLEMENTATION CHECKLIST                        */}
      {/* ========================================================= */}
      <section id="checklist" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                University Institutional Approval Governance
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                15. Final Implementation Checklist
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Before the website is made live, the University should approve the following 10 items:
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-none overflow-hidden">
                {IMPLEMENTATION_CHECKLIST.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white hover:bg-orange-50/20 transition flex items-start gap-2.5">
                    <span className="text-[#EC691F] font-bold shrink-0 mt-0.5">•</span>
                    <div className="text-xs">
                      <span className="font-bold text-[#1E1D1D] block">Item {idx + 1}</span>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-none bg-orange-50/60 border border-orange-200 text-xs text-slate-800 leading-relaxed">
                <strong className="text-[#1E1D1D] font-bold block mb-0.5">Recommended Implementation Approach:</strong>
                The portal is developed as a complete admissions workflow rather than a static information page. The public website provides all admission information and downloads, while the online application system handles registration, payments, document verification, examinations, interviews, selection and application-status tracking in strict adherence to UGC requirements and university regulations.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CONTACT ADMISSIONS OFFICE SECTION                         */}
      {/* ========================================================= */}
      <section id="contact" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Directorate of Research & Development
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                Contact the Ph.D. Admissions Office
              </h2>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 rounded-none overflow-hidden bg-white">
              {/* Contact Details */}
              <div className="lg:col-span-5 p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm bg-white">
                <div>
                  <strong className="text-[#1E1D1D] font-extrabold block text-sm uppercase">
                    Dr. RVR NRI INSTITUTE OF TECHNOLOGY
                  </strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed text-xs">
                    Pothavarappadu (V), Agiripalli (M),<br />
                    Vijayawada Rural, Eluru District,<br />
                    Andhra Pradesh – 521212
                  </p>
                </div>

                <div className="space-y-2 text-slate-700 text-xs">
                  <p className="flex items-start gap-2">
                    <span>
                      <strong>Telephone:</strong> +91 9640 334422<br />
                      <strong>Admissions Helpline:</strong> +91 9247598461 / 62 / 63 / 64 / 65
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>
                      <strong>Directorate Email:</strong> deanrnd@nriit.edu.in
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>
                      <strong>Office Hours:</strong> Monday – Saturday: 9:30 AM – 5:00 PM IST
                    </span>
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="w-full py-2.5 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs rounded transition uppercase tracking-wider shadow-sm cursor-pointer flex items-center justify-center gap-1.5 border border-[#d95a14]"
                  >
                    Apply Online for Ph.D. 2026–2027
                  </button>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="lg:col-span-7 bg-[#FAF7F5] p-5 sm:p-6">
                <h3 className="font-extrabold text-sm text-[#1E1D1D] uppercase tracking-wider mb-3">
                  Send an Admissions Query
                </h3>

                {contactSuccess && (
                  <div className="p-3 mb-4 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-300">
                    Your enquiry has been received. Our doctoral admissions coordinator will respond shortly.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 bg-white rounded border border-slate-300 focus:border-[#EC691F] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="ramesh@example.com"
                        className="w-full px-3 py-2 bg-white rounded border border-slate-300 focus:border-[#EC691F] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-white rounded border border-slate-300 focus:border-[#EC691F] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded border border-slate-300 focus:border-[#EC691F] focus:outline-hidden"
                      >
                        <option value="Eligibility Criteria">Eligibility Criteria Enquiry</option>
                        <option value="Entrance Exam Exemption">NET / GATE Exemption Query</option>
                        <option value="Part-Time Ph.D.">Part-Time Ph.D. Regulations</option>
                        <option value="Fee Structure">Fee Structure & Fellowships</option>
                        <option value="General Enquiry">General Admission Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Query / Message *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter details of your proposed research discipline or questions..."
                      className="w-full px-3 py-2 bg-white rounded border border-slate-300 focus:border-[#EC691F] focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs rounded transition uppercase tracking-wider shadow cursor-pointer border border-[#d95a14]"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Detail Modal */}
      <DepartmentDetailModal
        department={selectedDept}
        isOpen={!!selectedDept}
        onClose={() => setSelectedDept(null)}
        onApply={() => {
          setSelectedDept(null);
          onOpenForm();
        }}
      />

      {/* Floating Back to Top Button matching Photo 3 */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-[#0070BA] hover:bg-[#005a96] text-white flex items-center justify-center rounded shadow-lg transition-transform hover:scale-105 cursor-pointer"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <span className="text-base font-bold">▲</span>
      </button>
    </div>
  );
}
