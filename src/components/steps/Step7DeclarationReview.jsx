import React from 'react';

export default function Step7DeclarationReview({ formData, setFormData }) {
  const dec = formData.declaration;

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
            DECLARATION OF THE APPLICANT
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

          <div className="mt-2.5 pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dec.accepted}
                onChange={(e) => handleDeclarationChange('accepted', e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded text-brand-700 focus:ring-brand-500 border-slate-300 shrink-0"
                required
              />
              <span className="text-xs font-semibold text-slate-900 leading-normal">
                I accept and agree to the above declaration. All submitted academic degrees and particulars are authentic and verifiable.
              </span>
            </label>
          </div>
        </div>

        {/* Place and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
        </div>
      </div>
    </div>
  );
}
