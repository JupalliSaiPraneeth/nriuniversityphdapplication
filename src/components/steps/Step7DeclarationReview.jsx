import React, { useState } from 'react';

export default function Step7DeclarationReview({ formData, setFormData, onJumpToStep }) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    address: true,
    education: true,
    experience: false,
    publications: false,
    documents: true,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const dec = formData.declaration;
  const p = formData.personalDetails;
  const a = formData.addressDetails;

  const handleDeclarationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-2">
      {/* SECTION 13: DECLARATION */}
      <div className="card-section border-brand-200 bg-brand-50/20">
        <div className="border-b border-slate-200 pb-1.5 mb-2">
          <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
              13
            </span>
            13. DECLARATION OF THE APPLICANT
          </h2>
          <p className="text-[11px] text-slate-500">
            Read carefully and accept the mandatory institutional declaration
          </p>
        </div>

        {/* Declaration statement */}
        <div className="p-3 bg-white rounded-lg border border-slate-200/90 shadow-sm mb-2">
          <p className="font-serif italic text-xs text-slate-800 leading-relaxed">
            "I declare that the information furnished above is true, complete and correct to the best of my knowledge and belief. I understand that any false or incorrect information may lead to rejection/cancellation of my application/admission as per University rules."
          </p>

          <div className="mt-2 pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dec.accepted}
                onChange={(e) => handleDeclarationChange('accepted', e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-700 focus:ring-brand-500 border-slate-300"
                required
              />
              <span className="text-xs font-semibold text-slate-900 leading-normal">
                I accept and agree to the above declaration. All submitted academic degrees and particulars are authentic and verifiable.
              </span>
            </label>
          </div>
        </div>

        {/* Place, Date, Signature */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label htmlFor="dec-place" className="form-label form-label-required">
              Place
            </label>
            <input
              id="dec-place"
              type="text"
              placeholder="e.g. Vijayawada"
              value={dec.place}
              onChange={(e) => handleDeclarationChange('place', e.target.value)}
              className="form-input text-xs py-1.5"
              required
            />
          </div>

          <div>
            <label htmlFor="dec-date" className="form-label form-label-required">
              Date
            </label>
            <input
              id="dec-date"
              type="date"
              value={dec.date}
              onChange={(e) => handleDeclarationChange('date', e.target.value)}
              className="form-input text-xs py-1.5"
              required
            />
          </div>

          <div>
            <label htmlFor="dec-signature" className="form-label form-label-required">
              Typed Digital Signature
            </label>
            <input
              id="dec-signature"
              type="text"
              placeholder="Type Full Name as Signature"
              value={dec.typedSignature}
              onChange={(e) => handleDeclarationChange('typedSignature', e.target.value)}
              className="form-input text-xs py-1.5 font-serif font-bold text-brand-900"
              required
            />
            <span className="text-[9px] text-slate-400 mt-0.5 block">
              Legally equivalent to physical signature under IT regulations
            </span>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE APPLICATION REVIEW ACCORDION */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950">
              Complete Application Review
            </h2>
            <p className="text-[11px] text-slate-500">
              Review all 13 sections before final irrevocable submission to the university
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-medium">
            Check entries before final submit
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Section 1 & 2 Review */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              onClick={() => toggleSection('personal')}
              className="px-3 py-2 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                <span>1. Personal & 2. Address Details</span>
                <span className="text-slate-400 font-normal">
                  ({p.fullName || 'No name'}, {p.programme || 'No programme'})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJumpToStep(0);
                  }}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold mr-1"
                >
                  Edit
                </button>
                <span className="text-[10px] text-slate-400">
                  {expandedSections.personal ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {expandedSections.personal && (
              <div className="p-3 bg-white text-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Candidate Name:</span>
                  <span className="font-semibold text-slate-900">{p.fullName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Ph.D. Programme:</span>
                  <span className="font-semibold text-slate-900">{p.programme || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Specialization:</span>
                  <span className="font-semibold text-slate-900">{p.specialization || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Admission Category:</span>
                  <span className="font-semibold text-slate-900">{p.admissionCategory || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email ID:</span>
                  <span className="font-semibold text-slate-900">{p.email || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Mobile:</span>
                  <span className="font-semibold text-slate-900">{p.mobileNumber || '—'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[11px]">Permanent Address:</span>
                  <span className="font-semibold text-slate-900">{a.permanentAddress || '—'}, {a.district}, {a.state} - {a.pinCode}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3 & 4 Review */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              onClick={() => toggleSection('education')}
              className="px-3 py-2 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                <span>3. Educational Qualifications & 4. Examinations</span>
                <span className="text-slate-400 font-normal">
                  ({formData.educationalQualifications.filter((e) => e.qualification).length} Qualifications)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJumpToStep(1);
                  }}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold mr-1"
                >
                  Edit
                </button>
                <span className="text-[10px] text-slate-400">
                  {expandedSections.education ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {expandedSections.education && (
              <div className="p-3 bg-white text-xs border-t border-slate-200">
                <div className="space-y-1.5">
                  {formData.educationalQualifications.filter((e) => e.qualification).map((item, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="font-medium text-slate-800">
                        {item.qualification} ({item.specialization || '—'}) - {item.institution}
                      </span>
                      <span className="font-semibold text-brand-800">
                        {item.year} | {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 12 Documents Review */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              onClick={() => toggleSection('documents')}
              className="px-3 py-2 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                <span>12. Documents Enclosed Checklist</span>
                <span className="text-emerald-700 font-medium">
                  ({Object.keys(formData.documentMetadata || {}).length} files attached)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJumpToStep(5);
                  }}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold mr-1"
                >
                  Edit
                </button>
                <span className="text-[10px] text-slate-400">
                  {expandedSections.documents ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {expandedSections.documents && (
              <div className="p-3 bg-white text-xs border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {Object.entries(formData.documentMetadata || {}).map(([key, info]) => (
                    <div key={key} className="text-slate-700 bg-slate-50 p-1.5 rounded truncate">
                      <span className="font-medium truncate">{info.fileName || key}</span>
                    </div>
                  ))}
                  {Object.keys(formData.documentMetadata || {}).length === 0 && (
                    <p className="text-amber-700 italic">No files attached yet. Please attach required documents in Step 6.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
