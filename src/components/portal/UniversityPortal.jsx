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
  FEE_STRUCTURE,
  ONLINE_APPLICATION_GUIDE,
  WEBSITE_DOWNLOADS_LINKS,
  DEPARTMENT_SYLLABI,
} from '../../data/portalData';
import DepartmentDetailModal from './DepartmentDetailModal';
import {
  generatePartAResearchSyllabusPDF,
  generateDepartmentSyllabusPDF,
  generateRegulationsSummaryPDF,
} from '../../lib/syllabusPdfGenerator';

// 7-Stage Ph.D. Selection Flowchart Steps
const FLOWCHART_STEPS = [
  {
    step: 1,
    title: 'Online Application & Profile Submission',
    desc: 'Candidates submit their online application through the admissions portal with academic & research details.',
  },
  {
    step: 2,
    title: 'Application Fee Payment & Verification',
    desc: 'Candidates remit prescribed fee online and enter the transaction reference (UTR) in the application.',
  },
  {
    step: 3,
    title: 'Scrutiny of Applications & Qualifications',
    desc: 'Directorate of Research & DRC scrutinize academic credentials, eligibility, and document authenticity.',
  },
  {
    step: 4,
    title: 'University Ph.D. Selection Test (or Exemption)',
    desc: 'Entrance examination (Part A Research + Part B Department). Candidates with NET/GATE/SLET are exempt.',
    isExemptible: true,
  },
  {
    step: 5,
    title: 'Research Proposal Presentation & Interview',
    desc: 'Candidates present research proposal and defend research competence before the DRC panel.',
  },
  {
    step: 6,
    title: 'Merit List Declaration & Supervisor Allocation',
    desc: 'Consolidated merit list declared and recognized research supervisor vacancies allocated.',
  },
  {
    step: 7,
    title: 'Provisional Admission & Coursework Registration',
    desc: 'Document verification, admission fee payment, and mandatory doctoral coursework registration.',
  },
];

export default function UniversityPortal({ onOpenForm, onOpenStatus, onOpenEdit, onOpenAdmin: _onOpenAdmin }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSyllabusDept, setSelectedSyllabusDept] = useState('econ');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubject, setContactSubject] = useState('Economics Ph.D. Enquiry');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const handleDownloadPartA = async () => {
    setIsDownloading(true);
    try {
      await generatePartAResearchSyllabusPDF();
    } catch (err) {
      console.error('Error generating Part A syllabus:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDeptSyllabus = async (deptKey) => {
    setIsDownloading(true);
    try {
      const deptObj =
        RESEARCH_DISCIPLINES.find((d) => d.id === deptKey || d.code.toLowerCase() === deptKey.toLowerCase()) || {
          name: DEPARTMENT_SYLLABI[deptKey]?.name || 'Discipline',
          code: DEPARTMENT_SYLLABI[deptKey]?.code || deptKey.toUpperCase(),
          category: DEPARTMENT_SYLLABI[deptKey]?.category || 'Academic Faculty',
          description: DEPARTMENT_SYLLABI[deptKey]?.partB || '',
          eligibility: "Master's degree meeting prescribed minimum marks.",
          researchAreas: [],
        };
      await generateDepartmentSyllabusPDF(deptObj);
    } catch (err) {
      console.error('Error generating department syllabus:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadRegulations = async () => {
    setIsDownloading(true);
    try {
      await generateRegulationsSummaryPDF();
    } catch (err) {
      console.error('Error generating regulations PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadLinkAction = (link) => {
    if (link.actionType === 'part-a-pdf') {
      handleDownloadPartA();
    } else if (link.actionType === 'scroll-part-b') {
      const el = document.querySelector('#part-b-syllabus');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleDownloadRegulations();
    }
  };

  return (
    <div className="space-y-0 pb-0 bg-white text-slate-900">
      {/* ========================================================= */}
      {/* 1. UNIVERSITY HERO & ADMISSIONS OVERVIEW                  */}
      {/* ========================================================= */}
      <section
        id="home"
        className="relative text-white overflow-hidden border-b-2 border-[#EC691F] min-h-[500px]"
        style={{
          backgroundImage: "url('https://i.ytimg.com/vi/hqTV5uosc5M/maxresdefault.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Full Visibility Live YouTube Video Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <iframe
            src="https://www.youtube.com/embed/hqTV5uosc5M?autoplay=1&mute=1&loop=1&playlist=hqTV5uosc5M&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1"
            title="NRI Institute of Technology Campus Video Background"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360vw] h-[202.5vw] sm:w-[220vw] sm:h-[123.75vw] lg:w-[150vw] lg:h-[84.375vw] min-w-[178vh] min-h-full pointer-events-none object-cover opacity-100"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex="-1"
          />
        </div>

        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
          {/* Main Hero Content directly over the background video */}
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs border border-[#EC691F] text-[#EC691F] text-[11px] sm:text-xs font-bold tracking-wide shrink-0 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#EC691F] animate-pulse" />
                {UNIVERSITY_INFO.programmeTitle}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#A51C30] border border-[#A51C30] text-rose-100 text-[11px] sm:text-xs font-semibold shrink-0 shadow-md">
                UGC Act 1956 Deemed to be University
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-900/90 border border-emerald-500 text-emerald-200 text-[11px] sm:text-xs font-semibold shrink-0 shadow-md">
                NAAC 'A' Grade · NBA Accredited
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
                Ph.D. Admissions 2026–2027
              </h1>
              <p className="text-base sm:text-xl md:text-2xl font-bold text-[#EC691F] mt-1.5 font-serif tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                {UNIVERSITY_INFO.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {UNIVERSITY_INFO.introParagraph}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenForm}
                className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-[#EC691F] hover:bg-[#d95a14] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider border border-[#d95a14] text-center"
                title="Click to Open the 7-Step Ph.D. Online Application Form"
              >
                <span>Pay Fee & Apply Online →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. IMPORTANT DATES & NOTIFICATIONS                        */}
      {/* ========================================================= */}
      <section id="important-dates" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white py-2 px-3.5 sm:px-4 border-b border-[#EC691F] flex items-center justify-between">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider">
                Admission Schedule
              </span>
              <h2 className="sr-only">
                Important Dates & Admission Notifications
              </h2>
              <span className="text-xs text-slate-300">
                Academic Year 2026–2027
              </span>
            </div>

            <div className="p-3.5 sm:p-5 space-y-3">
              {/* Mobile View: Clean Structured Cards (Zero Cutoff) */}
              <div className="sm:hidden border border-slate-200 divide-y divide-slate-200 bg-white">
                {IMPORTANT_DATES.map((item, idx) => (
                  <div key={idx} className="p-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-800 text-xs flex items-start gap-1.5 flex-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC691F] shrink-0 mt-1" />
                        <span>{item.activity}</span>
                      </div>
                      <span className={`text-[11px] font-bold shrink-0 ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="pl-3 text-xs font-bold text-[#1E1D1D]">
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop / Tablet Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4">Admission Milestone / Activity</th>
                      <th className="py-2.5 px-3 sm:px-4">Scheduled Date</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Status / Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IMPORTANT_DATES.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 sm:px-4 font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EC691F] shrink-0" />
                          <span>{item.activity}</span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 font-bold text-[#1E1D1D]">
                          {item.date}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right">
                          <span
                            className={`inline-block text-xs font-bold ${item.badgeColor}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong className="font-bold text-amber-800 block mb-0.5">Official Schedule Notice:</strong>
                <span>{IMPORTANT_DATES_DISCLAIMER}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PH.D. PROGRAMME OPTIONS                                */}
      {/* ========================================================= */}
      <section id="programmes" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
              Admission Categories
            </span>
            <h2 className="text-base sm:text-2xl font-extrabold text-[#1E1D1D] tracking-tight">
              Ph.D. Programme Options & Research Tracks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {PROGRAMME_OPTIONS.options.map((option) => (
              <div
                key={option.id}
                className={`bg-white rounded-none p-3.5 sm:p-4 shadow-xs space-y-2.5 flex flex-col justify-between ${option.accentColor}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EC691F] bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      {option.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">UGC Norms</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#1E1D1D]">
                    {option.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#A51C30]">
                    {option.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 space-y-1">
                    <strong className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Key Highlights & Governance:
                    </strong>
                    <ul className="space-y-0.5 text-xs text-slate-600">
                      {option.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#EC691F] font-bold shrink-0">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="w-full py-2 bg-[#1E1D1D] hover:bg-[#EC691F] text-white text-xs font-bold rounded transition cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>Apply for {option.title}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ACADEMIC DEPARTMENTS & DISCIPLINES (Including Economics) */}
      {/* ========================================================= */}
      <section id="departments" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div>
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Approved Faculties & Subjects
              </span>
              <h2 className="text-base sm:text-2xl font-extrabold text-[#1E1D1D] tracking-tight">
                Academic Departments & Research Disciplines
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded border border-slate-200 self-start md:self-auto shrink-0">
              11 Approved Research Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {RESEARCH_DISCIPLINES.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-none border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:border-[#EC691F] transition group space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A51C30] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 truncate">
                      {dept.category}
                    </span>
                    <span className="text-[10px] font-black text-[#EC691F] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 shrink-0">
                      {dept.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#1E1D1D] group-hover:text-[#EC691F] transition-colors leading-snug">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Prescribed Eligibility:
                    </span>
                    <p className="text-[11px] text-slate-700 leading-normal line-clamp-2">
                      {dept.eligibility}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className="flex-1 py-1.5 bg-[#FAF7F5] hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded border border-slate-300 transition cursor-pointer text-center"
                    >
                      Research Areas
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDeptSyllabus(dept.id)}
                      className="flex-1 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#EC691F] text-[11px] font-bold rounded border border-orange-200 transition cursor-pointer text-center"
                      title="Download Part B Syllabus PDF"
                    >
                      Syllabus PDF
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="w-full py-1.5 bg-[#1E1D1D] hover:bg-[#EC691F] text-white text-[11px] font-bold rounded transition cursor-pointer uppercase tracking-wider text-center"
                  >
                    Apply for {dept.code}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. ELIGIBILITY CRITERIA                                   */}
      {/* ========================================================= */}
      <section id="eligibility" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Academic Qualifications & Regulations
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white">
                Ph.D. Eligibility Criteria & Minimum Marks
              </h2>
            </div>

            <div className="p-3 sm:p-3.5 space-y-2.5">

              <div className="space-y-1">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                  Statutory Eligibility Standards (UGC Guidelines)
                </h3>
                <div className="border border-slate-200 divide-y divide-slate-200 bg-white">
                  {ELIGIBILITY_CRITERIA.generalRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="py-2 px-3 flex items-start gap-2.5 text-xs hover:bg-slate-50/50 transition"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#EC691F] text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {req}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-0.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                  Required Scrutiny Documents Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-200 bg-[#FAF7F5] text-xs">
                  {ELIGIBILITY_CRITERIA.requiredDocumentsList.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 py-2 px-3 border-r border-b border-slate-200">
                      <span className="text-emerald-600 font-bold shrink-0 text-sm">✓</span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SELECTION PROCESS & PROPOSED EXAMINATION PATTERN        */}
      {/* ========================================================= */}
      <section id="selection-exam" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Comprehensive Selection Architecture
                </span>
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white">
                  Selection Process & Entrance Examination Pattern
                </h2>
              </div>

              <div className="bg-white/10 px-3.5 py-1.5 rounded border border-[#EC691F] text-right self-start md:self-auto">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Duration</span>
                <strong className="text-sm font-black text-[#EC691F]">
                  {ENTRANCE_EXAMINATION.totalDuration}
                </strong>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* 7-Step Simple Flowchart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EC691F]"></span>
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                      Ph.D. Selection Process Flow Chart
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">7 Sequential Steps</span>
                </div>

                <div className="bg-[#FAF7F5] border border-stone-200 p-2.5 sm:p-3.5 space-y-2">
                  {/* Row 1: Steps 1 to 4 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
                    {FLOWCHART_STEPS.slice(0, 4).map((item, idx) => (
                      <div key={item.step} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5">
                        <div className="flex-1 bg-white border border-stone-200 hover:border-[#EC691F] p-2.5 sm:p-3 shadow-xs transition flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center justify-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Stage {item.step}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs pt-1.5 leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                              {item.desc}
                            </p>
                          </div>
                          {item.isExemptible && (
                            <div className="mt-1.5 pt-1 border-t border-dashed border-amber-200">
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                                NET / GATE: Skip to Stage 5
                              </span>
                            </div>
                          )}
                        </div>
                        {idx < 3 && (
                          <div className="hidden lg:flex items-center justify-center text-[#EC691F] shrink-0" aria-hidden="true">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        )}
                        {/* Mobile Down Arrow between steps */}
                        <div className="lg:hidden flex justify-center py-0.5 text-[#EC691F]" aria-hidden="true">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Downward Row Transition Connector (Desktop) */}
                  <div className="hidden lg:flex justify-end pr-8 py-0.5" aria-hidden="true">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#EC691F]">
                      <span>Proceed to Proposal Defense & Interview</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* Row 2: Steps 5 to 7 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                    {FLOWCHART_STEPS.slice(4, 7).map((item, idx) => (
                      <div key={item.step} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                        <div
                          className={`flex-1 p-2.5 sm:p-3 shadow-xs transition flex flex-col justify-between h-full border ${
                            item.step === 7
                              ? 'bg-emerald-50/20 border-emerald-300 hover:border-emerald-500'
                              : 'bg-white border-stone-200 hover:border-[#EC691F]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-end">
                              <span
                                className={`text-[10px] font-bold uppercase ${
                                  item.step === 7 ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
                                }`}
                              >
                                {item.step === 7 ? 'Stage 7 · Final' : `Stage ${item.step}`}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs pt-1.5 leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                              {item.desc}
                            </p>
                          </div>
                          {item.step === 7 && (
                            <div className="mt-1.5 pt-1 border-t border-emerald-200">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300 inline-block">
                                ✓ Admission & Enrolment Cleared
                              </span>
                            </div>
                          )}
                        </div>
                        {idx < 2 && (
                          <div className="hidden lg:flex items-center justify-center text-[#EC691F] shrink-0" aria-hidden="true">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        )}
                        {/* Mobile Down Arrow for Steps 5 & 6 */}
                        {idx < 2 && (
                          <div className="lg:hidden flex justify-center py-0.5 text-[#EC691F]" aria-hidden="true">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footnote */}
                  <div className="pt-2 border-t border-stone-200 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                    <p>
                      <strong className="text-slate-900">Exemption Note:</strong> Candidates qualifying UGC-NET, CSIR-NET (JRF), GATE, SLET, SET, or GPAT are exempted from Stage 4 (Entrance Exam) and proceed directly to Stage 5.
                    </p>
                    <button
                      onClick={onOpenForm}
                      type="button"
                      className="text-[#EC691F] hover:text-[#d45612] font-bold text-xs inline-flex items-center gap-1"
                    >
                      <span>Start Application</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Proposed Pattern Table */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1D1D]">
                    Proposed Examination Pattern (Part A & Part B)
                  </h3>
                  <span className="text-xs text-[#A51C30] font-bold">
                    Total Marks: {ENTRANCE_EXAMINATION.totalMarks} Marks · Duration: {ENTRANCE_EXAMINATION.totalDuration}
                  </span>
                </div>

                {/* Mobile View: Clean Structured Cards (Zero Cutoff) */}
                <div className="sm:hidden border border-slate-200 divide-y divide-slate-200 bg-white">
                  {ENTRANCE_EXAMINATION.pattern.map((p, idx) => (
                    <div key={idx} className="p-3 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-[#1E1D1D] text-xs flex-1">
                          {p.component}
                        </h4>
                        <div className="text-right shrink-0">
                          <span className="font-black text-sm text-[#EC691F] block">{p.marks} Marks</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{p.weightage}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  ))}
                  <div className="p-3 bg-orange-50/70 flex items-center justify-between font-bold text-xs text-[#1E1D1D]">
                    <div>
                      <span className="uppercase block font-extrabold">Total Written Examination</span>
                      <span className="text-[11px] text-slate-600 font-normal">{ENTRANCE_EXAMINATION.totalDuration}</span>
                    </div>
                    <span className="text-base font-black text-[#EC691F]">{ENTRANCE_EXAMINATION.totalMarks} Marks</span>
                  </div>
                </div>

                {/* Desktop / Tablet Table View */}
                <div className="hidden sm:block overflow-x-auto border border-slate-200">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
                    <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3 sm:px-4">Section</th>
                        <th className="py-2.5 px-3 sm:px-4">Component & Assessment Focus</th>
                        <th className="py-2.5 px-3 sm:px-4 text-center">Weightage</th>
                        <th className="py-2.5 px-3 sm:px-4 text-right">Proposed Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ENTRANCE_EXAMINATION.pattern.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 sm:px-4 font-bold text-[#1E1D1D]">
                            {p.component}
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-xs text-slate-600 leading-relaxed">
                            {p.description}
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-center font-semibold text-slate-700">
                            {p.weightage}
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-right font-black text-base text-[#EC691F]">
                            {p.marks}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-orange-50/60 font-bold text-[#1E1D1D]">
                        <td className="py-2.5 px-3 sm:px-4 uppercase" colSpan={2}>
                          Total Written Examination
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-center text-xs">
                          {ENTRANCE_EXAMINATION.totalDuration}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-black text-lg text-[#EC691F]">
                          {ENTRANCE_EXAMINATION.totalMarks} Marks
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed">
                  <strong className="font-bold text-amber-900 block mb-0.5">Official Note:</strong>
                  <span>{ENTRANCE_EXAMINATION.disclaimer} {ENTRANCE_EXAMINATION.qualifyingCriteria}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. PART A – RESEARCH SYLLABUS                             */}
      {/* ========================================================= */}
      <section id="part-a-syllabus" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="border-b border-slate-200 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Part A: 25 Marks (Common for All Candidates)
              </span>
              <h2 className="text-base sm:text-2xl font-extrabold text-[#1E1D1D] tracking-tight">
                Part A – Research Aptitude and Methodology Syllabus
              </h2>
            </div>

            <button
              type="button"
              onClick={handleDownloadPartA}
              disabled={isDownloading}
              className="px-4 py-2.5 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 border border-[#d95a14]"
            >
              <span>Download Part A Syllabus PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-slate-200 text-xs">
            {ENTRANCE_EXAMINATION.partACoverage.map((item, idx) => (
              <div key={idx} className="py-2 px-3 bg-[#FAF7F5] border-r border-b border-slate-200 space-y-1">
                <span className="font-bold text-[#EC691F] block text-[11px]">Unit {idx + 1}:</span>
                <p className="text-slate-800 font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. PART B – DEPARTMENT-WISE SYLLABUS                      */}
      {/* ========================================================= */}
      <section id="part-b-syllabus" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="border-b border-slate-200 pb-2.5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Part B: 50 Marks (Discipline Specific)
              </span>
              <h2 className="text-base sm:text-2xl font-extrabold text-[#1E1D1D] tracking-tight">
                Part B – Department-Wise Ph.D. Entrance Syllabi
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto shrink-0">
              11 Department Syllabi Available
            </span>
          </div>

          {/* Department switcher */}
          <div className="bg-white p-3 border border-slate-200 shadow-2xs space-y-2">
            {/* Mobile View: Quick Dropdown & Horizontal Scroll Chips */}
            <div className="sm:hidden space-y-2">
              <label htmlFor="mobile-syllabus-dept-select" className="block text-[11px] font-bold text-slate-600">
                Select Department / Discipline Syllabus:
              </label>
              <select
                id="mobile-syllabus-dept-select"
                value={selectedSyllabusDept}
                onChange={(e) => setSelectedSyllabusDept(e.target.value)}
                className="w-full bg-[#FAF7F5] border border-slate-300 rounded px-3 py-2 text-xs font-bold text-[#1E1D1D] focus:outline-none focus:border-[#EC691F] cursor-pointer"
              >
                {Object.keys(DEPARTMENT_SYLLABI).map((key) => {
                  const d = DEPARTMENT_SYLLABI[key];
                  return (
                    <option key={key} value={key}>
                      {d.name} ({d.code})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Desktop / Tablet: Full Pill Grid */}
            <div className="hidden sm:flex flex-wrap gap-1.5">
              {Object.keys(DEPARTMENT_SYLLABI).map((key) => {
                const d = DEPARTMENT_SYLLABI[key];
                const isSelected = selectedSyllabusDept === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedSyllabusDept(key)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${isSelected
                      ? 'bg-[#EC691F] text-white shadow-xs'
                      : 'bg-[#FAF7F5] text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                  >
                    <span>{d.name}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                      }`}>
                      {d.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Department Syllabus Card */}
          {selectedSyllabusDept && DEPARTMENT_SYLLABI[selectedSyllabusDept] && (
            <div className="bg-white border-2 border-orange-200 p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A51C30] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {DEPARTMENT_SYLLABI[selectedSyllabusDept].category}
                    </span>
                    <span className="text-xs font-extrabold text-[#EC691F]">
                      {DEPARTMENT_SYLLABI[selectedSyllabusDept].code}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1D1D] mt-1">
                    {DEPARTMENT_SYLLABI[selectedSyllabusDept].name} — Part B Examination Syllabus
                  </h3>
                  <p className="text-xs text-slate-600">
                    Subject-Specific Knowledge Component (50 Marks)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDeptSyllabus(selectedSyllabusDept)}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-[#1E1D1D] hover:bg-[#EC691F] text-white text-xs font-bold rounded shadow-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>Download {DEPARTMENT_SYLLABI[selectedSyllabusDept].code} Syllabus PDF</span>
                </button>
              </div>

              <div className="p-3.5 bg-[#FAF7F5] border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-[#A51C30] block text-xs uppercase tracking-wider">
                  Core Discipline Examination Curriculum:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {DEPARTMENT_SYLLABI[selectedSyllabusDept].partB}
                </p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  Subject-specific syllabus carries 50 marks out of 75 total entrance marks.
                </span>
                <button
                  type="button"
                  onClick={onOpenForm}
                  className="font-bold text-[#EC691F] hover:underline"
                >
                  Apply for {DEPARTMENT_SYLLABI[selectedSyllabusDept].name} Ph.D. →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. RECOGNIZED ENTRANCE EXAMINATIONS & APPLICABLE EXEMPTIONS */}
      {/* ========================================================= */}
      <section id="exemptions" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                National / State Level Equivalencies
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white">
                Recognized Entrance Examinations & Exemption Guidelines
              </h2>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed bg-[#FAF7F5] p-3 border border-orange-200">
                {EXEMPTION_CRITERIA.header}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EXEMPTION_CRITERIA.recognizedExaminations.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-[#EC691F] transition text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#EC691F] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        Exemption Category
                      </span>
                      <span className="text-emerald-700 font-bold text-xs">✓ Eligible</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#1E1D1D] pt-0.5">
                      {ex.exam}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {ex.scope}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-950 text-xs rounded-none leading-relaxed flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0">!</span>
                <div>
                  <strong className="font-bold text-rose-800 block mb-0.5">
                    Mandatory Scrutiny & Interview Appearance:
                  </strong>
                  <p>{EXEMPTION_CRITERIA.importantNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. ONLINE APPLICATION & APPROVED PAYMENT PROCESS         */}
      {/* ========================================================= */}
      <section id="apply-online" className="bg-[#1E1D1D] text-white border-b border-[#EC691F] py-6 sm:py-9">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="bg-gradient-to-br from-[#1E1D1D] via-[#2A2929] to-[#1E1D1D] text-white rounded-none shadow-md p-4 sm:p-6 border border-[#EC691F]/40 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/20 pb-3">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Official Candidate Portal
                </span>
                <h2 className="text-base sm:text-2xl font-extrabold tracking-tight">
                  {ONLINE_APPLICATION_GUIDE.title}
                </h2>
                <p className="text-xs text-stone-300 mt-0.5">
                  {ONLINE_APPLICATION_GUIDE.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenForm}
                className="px-6 py-3 rounded-md bg-[#EC691F] hover:bg-[#d95a14] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0 border border-[#d95a14]"
                title="Launch the Ph.D. Online Application Form"
              >
                <span>Open Online Application Form →</span>
              </button>
            </div>

            {/* Approved Payment Process Box */}
            <div className="p-4 bg-white/10 border border-white/15 text-xs text-slate-200 space-y-2">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                Approved Online Payment Procedure:
              </h3>
              <p className="leading-relaxed">
                Candidates must remit the prescribed application fee through the university's official banking channels (Net Banking / NEFT / RTGS / UPI) using the account particulars in the application form. Record the UTR / transaction reference number in Section 12 and attach the payment transaction slip before final submission.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenForm}
                  className="px-4 py-2 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs cursor-pointer flex items-center gap-1.5 border border-[#d95a14]"
                >
                  <span>Proceed to Online Form</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenStatus}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded border border-white/20 transition cursor-pointer"
                >
                  <span>Track Existing Application</span>
                </button>
                {onOpenEdit && (
                  <button
                    type="button"
                    onClick={() => onOpenEdit()}
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-xs rounded border border-amber-400/40 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Edit Application via OTP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Fee Particulars Table */}
            <div className="space-y-2 pt-2 border-t border-white/15">
              <h3 className="text-xs font-bold text-[#EC691F] uppercase tracking-wider">
                Proposed Ph.D. Fee Particulars
              </h3>
              <div className="overflow-x-auto border border-white/15">
                <table className="w-full text-left text-xs min-w-[480px]">
                  <thead className="bg-white/10 text-white uppercase font-bold text-[11px] border-b border-white/15">
                    <tr>
                      <th className="py-2 px-3">Fee Component</th>
                      <th className="py-2 px-3">Full-Time Ph.D.</th>
                      <th className="py-2 px-3">Part-Time Ph.D.</th>
                      <th className="py-2 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {FEE_STRUCTURE.table.slice(0, 4).map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition">
                        <td className="py-2.5 px-3 font-medium text-white">{row.component}</td>
                        <td className="py-2.5 px-3 font-bold text-[#EC691F]">{row.fullTime}</td>
                        <td className="py-2.5 px-3 font-bold text-rose-300">{row.partTime}</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. WEBSITE DOWNLOADS AND OFFICIAL NOTIFICATIONS          */}
      {/* ========================================================= */}
      <section id="downloads" className="bg-[#FAF7F5] border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F] flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                  Official Institutional Repository
                </span>
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white">
                  Official Downloads & Academic Documents
                </h2>
              </div>
              <span className="text-xs text-slate-300">
                Downloadable PDF Documents
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[540px]">
                <thead className="bg-[#FAF7F5] text-[#1E1D1D] uppercase font-bold text-xs border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3 sm:px-4">Document Title</th>
                    <th className="py-2.5 px-3 sm:px-4">Scope & Academic Purpose</th>
                    <th className="py-2.5 px-3 sm:px-4">Category</th>
                    <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {WEBSITE_DOWNLOADS_LINKS.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 sm:px-4 font-bold text-[#1E1D1D]">
                        {link.title}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-slate-600 font-medium">
                        {link.purpose}
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {link.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadLinkAction(link)}
                          disabled={isDownloading}
                          className="px-3 py-1 rounded bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer border border-[#d95a14]"
                        >
                          <span>{link.actionType.includes('pdf') ? 'Download PDF' : 'View Section'}</span>
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
      {/* 12. CONTACT ADMISSIONS OFFICE SECTION                     */}
      {/* ========================================================= */}
      <section id="contact" className="bg-white border-b border-stone-200 py-6 sm:py-8">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#1E1D1D] text-white p-3.5 sm:p-4 border-b border-[#EC691F]">
              <span className="text-[#EC691F] text-xs font-bold uppercase tracking-wider block">
                Directorate of Research & Development
              </span>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white">
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
                      <label className="block text-slate-700 font-semibold mb-1">Subject / Discipline</label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded border border-slate-300 focus:border-[#EC691F] focus:outline-hidden"
                      >
                        <option value="Economics Ph.D. Enquiry">Economics Ph.D. Enquiry</option>
                        <option value="Engineering Ph.D. Enquiry">Engineering & Technology Enquiry</option>
                        <option value="Pharmacy Ph.D. Enquiry">Pharmacy & Pharmaceutical Sciences</option>
                        <option value="Management Ph.D. Enquiry">Management Studies Enquiry</option>
                        <option value="Sciences Ph.D. Enquiry">Sciences & Humanities Enquiry</option>
                        <option value="Eligibility Criteria">Eligibility Criteria Enquiry</option>
                        <option value="Entrance Exam Exemption">NET / GATE / SLET / SET Exemption Query</option>
                        <option value="Part-Time Ph.D.">Part-Time Ph.D. NOC Regulations</option>
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

      {/* Floating Back to Top Button */}
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
