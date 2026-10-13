import React from 'react';
import { Plus, Trash2, Briefcase, Lightbulb } from 'lucide-react';

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
    <div className="space-y-8">
      {/* SECTION 5 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                5
              </span>
              5. PROFESSIONAL / TEACHING EXPERIENCE
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              List teaching, industry, or research experience in chronological order
            </p>
          </div>
          <button
            type="button"
            onClick={addExpRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Experience Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[750px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3">Institution / Organization</th>
                <th className="py-2.5 px-3 w-44">Designation</th>
                <th className="py-2.5 px-3 w-40">From–To</th>
                <th className="py-2.5 px-3 w-48">Nature of Work</th>
                <th className="py-2.5 px-3 w-32">Total Experience</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {experience.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={item.institution}
                      onChange={(e) => handleExpChange(idx, 'institution', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. Assistant Professor / Software Eng"
                      value={item.designation}
                      onChange={(e) => handleExpChange(idx, 'designation', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="MM/YYYY – MM/YYYY"
                      value={item.fromTo}
                      onChange={(e) => handleExpChange(idx, 'fromTo', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Teaching / R&D / Industry"
                      value={item.natureOfWork}
                      onChange={(e) => handleExpChange(idx, 'natureOfWork', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. 3 Yrs 4 Mos"
                      value={item.totalExperience}
                      onChange={(e) => handleExpChange(idx, 'totalExperience', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-medium"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeExpRow(idx)}
                      disabled={experience.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition disabled:opacity-30 disabled:pointer-events-none"
                      title="Remove row"
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

      {/* SECTION 6 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6">
          <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
              6
            </span>
            6. RESEARCH EXPOSURE / AREA OF INTEREST (IF ANY)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe your research exposure, motivation, prospective problem domain, or previous projects
          </p>
        </div>

        <div>
          <label htmlFor="researchExposure" className="form-label mb-2">
            Detailed Statement of Research Exposure / Proposed Area of Interest
          </label>
          <textarea
            id="researchExposure"
            rows={6}
            placeholder="Outline your prospective research topic, technical exposure, laboratory tools/simulators used (e.g., MATLAB, NS3, PyTorch, ANSYS), key research questions you aim to pursue at NRIIT..."
            value={formData.researchExposure}
            onChange={(e) => handleExposureChange(e.target.value)}
            className="form-textarea font-sans leading-relaxed text-sm"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
            <span>Minimum 50 words recommended for clear review by the Department Research Committee</span>
            <span>{formData.researchExposure ? formData.researchExposure.trim().split(/\s+/).filter(Boolean).length : 0} words</span>
          </div>
        </div>
      </div>
    </div>
  );
}
