import React from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

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
    <div className="space-y-8">
      {/* SECTION 10 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                10
              </span>
              10. CONFERENCES / WORKSHOPS / FDPs (Organized / Attended - Optional)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Faculty Development Programmes, national/international workshops and symposia
            </p>
          </div>
          <button
            type="button"
            onClick={addConfRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Programme Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3">Programme Title</th>
                <th className="py-2.5 px-3 w-56">Organizer / Host Institution</th>
                <th className="py-2.5 px-3 w-24 text-center">Year</th>
                <th className="py-2.5 px-3 w-48">Role / Participation</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {conferences.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. 5-Day FDP on Generative AI"
                      value={item.programme}
                      onChange={(e) => handleConfChange(idx, 'programme', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. IIT Madras / NRIIT"
                      value={item.organizer}
                      onChange={(e) => handleConfChange(idx, 'organizer', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleConfChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Attended / Coordinator / Speaker"
                      value={item.roleParticipation}
                      onChange={(e) => handleConfChange(idx, 'roleParticipation', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeConfRow(idx)}
                      disabled={conferences.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                11
              </span>
              11. REFERENCES
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Names and contact details of two academic or professional referees who know your work
            </p>
          </div>
          <button
            type="button"
            onClick={addRefRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Reference Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3 w-64">Name & Designation *</th>
                <th className="py-2.5 px-3">Institution / Organization *</th>
                <th className="py-2.5 px-3 w-64">Contact (Phone / Official Email) *</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {references.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Dr. ... / Professor & HOD"
                      value={item.nameDesignation}
                      onChange={(e) => handleRefChange(idx, 'nameDesignation', e.target.value)}
                      className="form-input text-xs py-1.5"
                      required={idx < 2}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="University / Organization Name"
                      value={item.institution}
                      onChange={(e) => handleRefChange(idx, 'institution', e.target.value)}
                      className="form-input text-xs py-1.5"
                      required={idx < 2}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Email and/or Phone Number"
                      value={item.contactEmail}
                      onChange={(e) => handleRefChange(idx, 'contactEmail', e.target.value)}
                      className="form-input text-xs py-1.5"
                      required={idx < 2}
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRefRow(idx)}
                      disabled={references.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Trash2 className="w-4 h-4" />
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
