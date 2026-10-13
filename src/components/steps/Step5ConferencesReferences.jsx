import React from 'react';

export default function Step5ConferencesReferences({ formData, setFormData }) {
  const conferences = formData.conferencesWorkshops;
  const references = formData.references;

  // Conference row handlers
  const handleConfChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.conferencesWorkshops];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, conferencesWorkshops: updated };
    });
  };

  const addConfRow = () => {
    setFormData((prev) => ({
      ...prev,
      conferencesWorkshops: [
        ...prev.conferencesWorkshops,
        { programme: '', organizer: '', year: '', roleParticipation: '' },
      ],
    }));
  };

  const removeConfRow = (idx) => {
    if (conferences.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      conferencesWorkshops: prev.conferencesWorkshops.filter((_, i) => i !== idx),
    }));
  };

  // References row handlers
  const handleRefChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.references];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, references: updated };
    });
  };

  const addRefRow = () => {
    setFormData((prev) => ({
      ...prev,
      references: [
        ...prev.references,
        { nameDesignation: '', institution: '', contactEmail: '' },
      ],
    }));
  };

  const removeRefRow = (idx) => {
    if (references.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-2">
      {/* SECTION 10 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                10
              </span>
              10. CONFERENCES / WORKSHOPS / FDPs (Organized / Attended - Optional)
            </h2>
            <p className="text-[11px] text-slate-500">
              Faculty Development Programmes, national/international workshops and symposia
            </p>
          </div>
          <button
            type="button"
            onClick={addConfRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {conferences.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Programme #{idx + 1}
                </span>
                {conferences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConfRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="form-label text-[11px]">Programme Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-Day FDP on Generative AI"
                    value={item.programme}
                    onChange={(e) => handleConfChange(idx, 'programme', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="form-label text-[11px]">Organizer / Host Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Madras / NRIIT"
                    value={item.organizer}
                    onChange={(e) => handleConfChange(idx, 'organizer', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="form-label text-[11px]">Year</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleConfChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-mono"
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px]">Role / Participation</label>
                    <input
                      type="text"
                      placeholder="Attended / Coordinator"
                      value={item.roleParticipation}
                      onChange={(e) => handleConfChange(idx, 'roleParticipation', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-1.5 px-2 w-10 text-center">S.No.</th>
                <th className="py-1.5 px-2">Programme Title</th>
                <th className="py-1.5 px-2 w-56">Organizer / Host Institution</th>
                <th className="py-1.5 px-2 w-20 text-center">Year</th>
                <th className="py-1.5 px-2 w-48">Role / Participation</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {conferences.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. 5-Day FDP on Generative AI"
                      value={item.programme}
                      onChange={(e) => handleConfChange(idx, 'programme', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. IIT Madras / NRIIT"
                      value={item.organizer}
                      onChange={(e) => handleConfChange(idx, 'organizer', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleConfChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1 text-center"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Attended / Coordinator / Speaker"
                      value={item.roleParticipation}
                      onChange={(e) => handleConfChange(idx, 'roleParticipation', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeConfRow(idx)}
                      disabled={conferences.length <= 1}
                      className="w-5 h-5 inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition text-sm font-bold disabled:opacity-20 disabled:pointer-events-none"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 11 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                11
              </span>
              11. REFERENCES
            </h2>
            <p className="text-[11px] text-slate-500">
              Names and contact details of two academic or professional referees who know your work
            </p>
          </div>
          <button
            type="button"
            onClick={addRefRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {references.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Referee #{idx + 1} {idx < 2 && <span className="text-red-500 font-bold">*</span>}
                </span>
                {references.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRefRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="form-label text-[11px]">Name & Designation {idx < 2 && '*'}</label>
                  <input
                    type="text"
                    placeholder="Dr. ... / Professor & HOD"
                    value={item.nameDesignation}
                    onChange={(e) => handleRefChange(idx, 'nameDesignation', e.target.value)}
                    className="form-input text-xs py-1.5"
                    required={idx < 2}
                  />
                </div>

                <div>
                  <label className="form-label text-[11px]">Institution / Organization {idx < 2 && '*'}</label>
                  <input
                    type="text"
                    placeholder="University / Organization Name"
                    value={item.institution}
                    onChange={(e) => handleRefChange(idx, 'institution', e.target.value)}
                    className="form-input text-xs py-1.5"
                    required={idx < 2}
                  />
                </div>

                <div>
                  <label className="form-label text-[11px]">Contact (Email / Mobile) {idx < 2 && '*'}</label>
                  <input
                    type="text"
                    placeholder="Email and/or Phone Number"
                    value={item.contactEmail}
                    onChange={(e) => handleRefChange(idx, 'contactEmail', e.target.value)}
                    className="form-input text-xs py-1.5"
                    required={idx < 2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-1.5 px-2 w-10 text-center">S.No.</th>
                <th className="py-1.5 px-2 w-64">Name & Designation *</th>
                <th className="py-1.5 px-2">Institution / Organization *</th>
                <th className="py-1.5 px-2 w-64">Contact (Phone / Official Email) *</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {references.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Dr. ... / Professor & HOD"
                      value={item.nameDesignation}
                      onChange={(e) => handleRefChange(idx, 'nameDesignation', e.target.value)}
                      className="form-input text-xs py-1"
                      required={idx < 2}
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="University / Organization Name"
                      value={item.institution}
                      onChange={(e) => handleRefChange(idx, 'institution', e.target.value)}
                      className="form-input text-xs py-1"
                      required={idx < 2}
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Email and/or Phone Number"
                      value={item.contactEmail}
                      onChange={(e) => handleRefChange(idx, 'contactEmail', e.target.value)}
                      className="form-input text-xs py-1"
                      required={idx < 2}
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeRefRow(idx)}
                      disabled={references.length <= 1}
                      className="w-5 h-5 inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition text-sm font-bold disabled:opacity-20 disabled:pointer-events-none"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
