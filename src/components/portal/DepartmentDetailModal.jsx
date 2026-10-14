import React from 'react';

export default function DepartmentDetailModal({ department, isOpen, onClose, onApply }) {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1E1D1D] text-white px-5 py-4 flex items-start justify-between border-b border-[#EC691F]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#EC691F] bg-white/10 px-2 py-0.5 rounded inline-block mb-1">
              {department.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              {department.name} ({department.code})
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Doctor of Philosophy (Ph.D.) Programme 2026–2027
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <span className="text-base font-bold leading-none">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div>
            <h4 className="font-bold text-[#1E1D1D] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Department Overview
            </h4>
            <p className="text-slate-600 leading-relaxed bg-[#FAF7F5] p-3 rounded-lg border border-orange-100">
              {department.overview || `The Department of ${department.name} offers Doctor of Philosophy (Ph.D.) research opportunities under recognized research supervisors and state-of-the-art laboratory facilities at Dr. RVR NRIIT (Deemed to be University).`}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-brand-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              Approved Research Domains & Indicative Topics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {department.researchAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 transition-colors flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-1.5 shrink-0" />
                  <span className="font-medium text-slate-800">{area}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic mt-1.5">
              * Indicative research topics subject to supervisor expertise and university approval.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-brand-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Minimum Prescribed Eligibility
            </h4>
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 text-slate-800 leading-relaxed">
              {department.eligibility}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-800 block text-xs">
                Department Entrance Exam Syllabus
              </span>
              <span className="text-[11px] text-slate-500">
                Part B Core Discipline Syllabus (PDF format)
              </span>
            </div>
            <button
              type="button"
              onClick={() => alert(`Downloading official ${department.name} Ph.D. syllabus...`)}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 text-brand-900 shrink-0 self-start sm:self-auto"
            >
              Download Syllabus
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Back to Departments
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onApply(department.name);
            }}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            Apply for {department.code} Ph.D. →
          </button>
        </div>
      </div>
    </div>
  );
}
