import React from 'react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1E1D1D] text-white px-5 py-4 flex items-center justify-between border-b border-[#EC691F]">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">
                Candidate Privacy Policy & Data Notice
              </h3>
              <p className="text-[11px] text-slate-300">
                Dr. RVR NRIIT (Deemed to be University) — Ph.D. Admissions 2026–2027
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <span className="text-base font-bold leading-none">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-[#1E1D1D] uppercase tracking-wider text-xs mb-1">
              1. Information We Collect
            </h4>
            <p>
              When applying for the Doctor of Philosophy (Ph.D.) programme at Dr. RVR NRIIT (Deemed to be University), we collect necessary applicant credentials including full name, date of birth, contact details, Aadhaar/government identity numbers, academic transcripts (10th, Intermediate, UG, PG), qualifying test certificates (UGC-NET, CSIR-NET, GATE), employment records, employer NOC for part-time candidates, and proposed research proposals.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1E1D1D] uppercase tracking-wider text-xs mb-1">
              2. Purpose of Data Processing
            </h4>
            <p>
              All submitted data is processed exclusively by the Directorate of Research & Development (R&D) and Departmental Research Committees (DRC) for the purposes of verifying eligibility under UGC regulations, scrutinizing academic qualifications, organizing the Ph.D. entrance examination and interviews, allocating recognized research supervisors, and administering admissions.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1E1D1D] uppercase tracking-wider text-xs mb-1">
              3. Data Security & Storage
            </h4>
            <p>
              Candidate certificates and research proposals are stored in secure private storage repositories with Row-Level Security (RLS) enforcement. Only authorized admissions administrators, DRC evaluators, and the Dean R&D possess access credentials. We do not sell, rent, or share personal candidate data with third-party commercial marketing entities.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1E1D1D] uppercase tracking-wider text-xs mb-1">
              4. Payment & Gateway Information
            </h4>
            <p>
              Application fee transactions are securely processed through approved banking channels. The university portal never stores credit card, debit card, or net banking credentials on our local servers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1E1D1D] uppercase tracking-wider text-xs mb-1">
              5. Contact Directorate of R&D
            </h4>
            <p>
              For data privacy inquiries or to update submitted qualifications prior to the application deadline, contact the Directorate of Research & Development at <strong className="text-[#EC691F]">deanrnd@nriit.edu.in</strong> or telephone <strong className="text-[#1E1D1D]">+91 9640 334422</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            UGC Act 1956 Compliant
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#EC691F] hover:bg-[#d95a14] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
