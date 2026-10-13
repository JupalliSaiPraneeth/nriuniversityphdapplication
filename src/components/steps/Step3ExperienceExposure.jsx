import React from 'react';

export default function Step3ExperienceExposure({ formData, setFormData }) {
  const experience = formData.professionalExperience;

  const handleExpChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.professionalExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, professionalExperience: updated };
    });
  };

  const addExpRow = () => {
    setFormData((prev) => ({
      ...prev,
      professionalExperience: [
        ...prev.professionalExperience,
        { institution: '', designation: '', fromTo: '', natureOfWork: '', totalExperience: '' },
      ],
    }));
  };

  const removeExpRow = (index) => {
    if (experience.length <= 1) {
      alert('Keep at least one experience row (leave blank if fresher).');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      professionalExperience: prev.professionalExperience.filter((_, i) => i !== index),
    }));
  };

  const handleExposureChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      researchExposure: value,
    }));
  };

  return (
    <div className="space-y-2">
      {/* SECTION 5 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                5
              </span>
              5. PROFESSIONAL / TEACHING EXPERIENCE
            </h2>
            <p className="text-[11px] text-slate-500">
              List teaching, industry, or research experience in chronological order
            </p>
          </div>
          <button
            type="button"
            onClick={addExpRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {experience.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Experience Entry #{idx + 1}
                </span>
                {experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExpRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="form-label text-[11px]">Institution / Organization</label>
                  <input
                    type="text"
                    placeholder="Organization / College Name"
                    value={item.institution}
                    onChange={(e) => handleExpChange(idx, 'institution', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="form-label text-[11px]">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Assistant Professor / Software Eng"
                    value={item.designation}
                    onChange={(e) => handleExpChange(idx, 'designation', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="form-label text-[11px]">Nature of Work</label>
                  <input
                    type="text"
                    placeholder="Teaching / R&D / Industry"
                    value={item.natureOfWork}
                    onChange={(e) => handleExpChange(idx, 'natureOfWork', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                  <div>
                    <label className="form-label text-[11px]">From – To</label>
                    <input
                      type="text"
                      placeholder="MM/YYYY – MM/YYYY"
                      value={item.fromTo}
                      onChange={(e) => handleExpChange(idx, 'fromTo', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px]">Total Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Yrs 4 Mos"
                      value={item.totalExperience}
                      onChange={(e) => handleExpChange(idx, 'totalExperience', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[750px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-1.5 px-2 w-10 text-center">S.No.</th>
                <th className="py-1.5 px-2">Institution / Organization</th>
                <th className="py-1.5 px-2 w-44">Designation</th>
                <th className="py-1.5 px-2 w-36 text-center">From–To</th>
                <th className="py-1.5 px-2 w-44">Nature of Work</th>
                <th className="py-1.5 px-2 w-28 text-center">Total Experience</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {experience.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={item.institution}
                      onChange={(e) => handleExpChange(idx, 'institution', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. Assistant Professor / Software Eng"
                      value={item.designation}
                      onChange={(e) => handleExpChange(idx, 'designation', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="MM/YYYY – MM/YYYY"
                      value={item.fromTo}
                      onChange={(e) => handleExpChange(idx, 'fromTo', e.target.value)}
                      className="form-input text-xs py-1 text-center"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Teaching / R&D / Industry"
                      value={item.natureOfWork}
                      onChange={(e) => handleExpChange(idx, 'natureOfWork', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. 3 Yrs 4 Mos"
                      value={item.totalExperience}
                      onChange={(e) => handleExpChange(idx, 'totalExperience', e.target.value)}
                      className="form-input text-xs py-1 text-center font-medium"
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeExpRow(idx)}
                      disabled={experience.length <= 1}
                      className="w-5 h-5 inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition text-sm font-bold disabled:opacity-20 disabled:pointer-events-none"
                      title="Remove row"
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

      {/* SECTION 6 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2">
          <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
              6
            </span>
            6. RESEARCH EXPOSURE / AREA OF INTEREST (IF ANY)
          </h2>
          <p className="text-[11px] text-slate-500">
            Describe your research exposure, motivation, prospective problem domain, or previous projects
          </p>
        </div>

        <div>
          <label htmlFor="researchExposure" className="form-label mb-1 text-xs">
            Detailed Statement of Research Exposure / Proposed Area of Interest
          </label>
          <textarea
            id="researchExposure"
            rows={4}
            placeholder="Outline your prospective research topic, technical exposure, laboratory tools/simulators used (e.g., MATLAB, NS3, PyTorch, ANSYS), key research questions you aim to pursue at NRIIT..."
            value={formData.researchExposure}
            onChange={(e) => handleExposureChange(e.target.value)}
            className="form-textarea text-xs leading-relaxed"
          />
          <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
            <span>Minimum 50 words recommended for clear review by DRC</span>
            <span>{formData.researchExposure ? formData.researchExposure.trim().split(/\s+/).filter(Boolean).length : 0} words</span>
          </div>
        </div>
      </div>
    </div>
  );
}
