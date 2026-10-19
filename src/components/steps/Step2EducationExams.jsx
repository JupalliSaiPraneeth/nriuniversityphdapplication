import React from 'react';
import { EXAMINATION_OPTIONS, validateYear, validatePercentageOrCGPA } from '../../data/initialFormState';

export default function Step2EducationExams({ formData, setFormData }) {
  const education = formData.educationalQualifications;
  const exams = formData.eligibilityExaminations;

  // Education row operations
  const handleEduChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.educationalQualifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, educationalQualifications: updated };
    });
  };

  const addEduRow = () => {
    setFormData((prev) => ({
      ...prev,
      educationalQualifications: [
        ...prev.educationalQualifications,
        { qualification: '', specialization: '', institution: '', year: '', percentage: '' },
      ],
    }));
  };

  const removeEduRow = (index) => {
    if (education.length <= 1) {
      alert('At least one educational qualification row is required.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      educationalQualifications: prev.educationalQualifications.filter((_, i) => i !== index),
    }));
  };

  // Exam row operations
  const handleExamChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.eligibilityExaminations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, eligibilityExaminations: updated };
    });
  };

  const addExamRow = () => {
    setFormData((prev) => ({
      ...prev,
      eligibilityExaminations: [
        ...prev.eligibilityExaminations,
        { examination: '', subject: '', year: '', score: '', qualification: '' },
      ],
    }));
  };

  const removeExamRow = (index) => {
    if (exams.length <= 1) {
      alert('Keep at least one row (leave blank if no national examination appeared).');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      eligibilityExaminations: prev.eligibilityExaminations.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-2">
      {/* SECTION 3 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                3
              </span>
              EDUCATIONAL QUALIFICATIONS
            </h2>
            <p className="text-[11px] text-slate-500">
              Chronological academic history from 10th / SSC to Postgraduate Degree
            </p>
          </div>
          <button
            type="button"
            onClick={addEduRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {education.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Academic Record #{idx + 1}
                </span>
                {education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEduRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="form-label form-label-required text-[11px]">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. 10th / B.Tech / M.Tech"
                    value={item.qualification}
                    onChange={(e) => handleEduChange(idx, 'qualification', e.target.value)}
                    className="form-input text-xs py-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="form-label form-label-required text-[11px]">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Science / CSE / ECE"
                    value={item.specialization}
                    onChange={(e) => handleEduChange(idx, 'specialization', e.target.value)}
                    className="form-input text-xs py-1.5"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label form-label-required text-[11px]">University / Institution</label>
                  <input
                    type="text"
                    placeholder="Board / College / University Name"
                    value={item.institution}
                    onChange={(e) => handleEduChange(idx, 'institution', e.target.value)}
                    className="form-input text-xs py-1.5"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                  <div>
                    <label className="form-label form-label-required text-[11px]">Passing Year</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleEduChange(idx, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={`form-input text-xs py-1.5 text-center font-mono ${
                        item.year && !validateYear(item.year, { minYear: 1950, isRequired: true }).valid
                          ? '!border-red-500 !ring-red-200 focus:!border-red-500'
                          : ''
                      }`}
                      required
                    />
                    {item.year && !validateYear(item.year, { minYear: 1950, isRequired: true }).valid && (
                      <span className="text-[10px] text-red-600 block mt-0.5 leading-tight">
                        {validateYear(item.year, { minYear: 1950, isRequired: true }).error}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="form-label form-label-required text-[11px]">% / CGPA</label>
                    <input
                      type="text"
                      placeholder="e.g. 82.5% / 8.5"
                      value={item.percentage}
                      onChange={(e) => handleEduChange(idx, 'percentage', e.target.value)}
                      className={`form-input text-xs py-1.5 text-center font-medium ${
                        item.percentage && !validatePercentageOrCGPA(item.percentage, { isRequired: true }).valid
                          ? '!border-red-500 !ring-red-200 focus:!border-red-500'
                          : ''
                      }`}
                      required
                    />
                    {item.percentage && !validatePercentageOrCGPA(item.percentage, { isRequired: true }).valid && (
                      <span className="text-[10px] text-red-600 block mt-0.5 leading-tight">
                        {validatePercentageOrCGPA(item.percentage, { isRequired: true }).error}
                      </span>
                    )}
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
                <th className="py-1.5 px-2 w-40">Qualification *</th>
                <th className="py-1.5 px-2 w-40">Specialization *</th>
                <th className="py-1.5 px-2">University / Institution *</th>
                <th className="py-1.5 px-2 w-20 text-center">Year *</th>
                <th className="py-1.5 px-2 w-24 text-center">% / CGPA *</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {education.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. 10th / B.Tech / M.Tech"
                      value={item.qualification}
                      onChange={(e) => handleEduChange(idx, 'qualification', e.target.value)}
                      className="form-input text-xs py-1.5"
                      required
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. Science / CSE / ECE"
                      value={item.specialization}
                      onChange={(e) => handleEduChange(idx, 'specialization', e.target.value)}
                      className="form-input text-xs py-1.5"
                      required
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Board / College / University Name"
                      value={item.institution}
                      onChange={(e) => handleEduChange(idx, 'institution', e.target.value)}
                      className="form-input text-xs py-1.5"
                      required
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleEduChange(idx, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={`form-input text-xs py-1.5 text-center font-mono ${
                        item.year && !validateYear(item.year, { minYear: 1950, isRequired: true }).valid
                          ? '!border-red-500 !ring-red-200 focus:!border-red-500'
                          : ''
                      }`}
                      title={
                        item.year && !validateYear(item.year, { minYear: 1950, isRequired: true }).valid
                          ? validateYear(item.year, { minYear: 1950, isRequired: true }).error
                          : ''
                      }
                      required
                    />
                    {item.year && !validateYear(item.year, { minYear: 1950, isRequired: true }).valid && (
                      <span className="text-[9px] text-red-600 block mt-0.5 leading-tight">
                        {validateYear(item.year, { minYear: 1950, isRequired: true }).error}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. 82.5% / 8.5"
                      value={item.percentage}
                      onChange={(e) => handleEduChange(idx, 'percentage', e.target.value)}
                      className={`form-input text-xs py-1.5 text-center font-medium ${
                        item.percentage && !validatePercentageOrCGPA(item.percentage, { isRequired: true }).valid
                          ? '!border-red-500 !ring-red-200 focus:!border-red-500'
                          : ''
                      }`}
                      title={
                        item.percentage && !validatePercentageOrCGPA(item.percentage, { isRequired: true }).valid
                          ? validatePercentageOrCGPA(item.percentage, { isRequired: true }).error
                          : ''
                      }
                      required
                    />
                    {item.percentage && !validatePercentageOrCGPA(item.percentage, { isRequired: true }).valid && (
                      <span className="text-[9px] text-red-600 block mt-0.5 leading-tight">
                        {validatePercentageOrCGPA(item.percentage, { isRequired: true }).error}
                      </span>
                    )}
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeEduRow(idx)}
                      disabled={education.length <= 1}
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

      {/* SECTION 4 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-2 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[11px] sm:text-xs font-bold shrink-0">
                4
              </span>
              <span>QUALIFYING / ELIGIBILITY EXAMINATIONS</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Examples: UGC-NET, UGC-JRF, CSIR-NET/JRF, GATE, SLET/SET, JEST, GPAT, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={addExamRow}
            className="self-start sm:self-auto inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-lg mb-2.5 text-[11px] text-blue-900 leading-tight">
          If you have appeared or qualified in national or state examinations (such as GATE, UGC-NET, SLET, SET, GPAT), please mention the details below. Leave blank if not applicable.
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {exams.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Examination #{idx + 1}
                </span>
                {exams.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExamRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="form-label text-[11px]">Examination</label>
                  <input
                    type="text"
                    list={`exam-suggestions-mob-${idx}`}
                    placeholder="e.g. GATE / UGC-NET"
                    value={item.examination}
                    onChange={(e) => handleExamChange(idx, 'examination', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                  <datalist id={`exam-suggestions-mob-${idx}`}>
                    {EXAMINATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="form-label text-[11px]">Subject / Paper Code</label>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={item.subject}
                    onChange={(e) => handleExamChange(idx, 'subject', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                  <div>
                    <label className="form-label text-[11px]">Year</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleExamChange(idx, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={`form-input text-xs py-1.5 text-center font-mono ${
                        item.year && !validateYear(item.year, { minYear: 1970 }).valid
                          ? '!border-red-500 !ring-red-200 focus:!border-red-500'
                          : ''
                      }`}
                    />
                    {item.year && !validateYear(item.year, { minYear: 1970 }).valid && (
                      <span className="text-[10px] text-red-600 block mt-0.5 leading-tight">
                        {validateYear(item.year, { minYear: 1970 }).error}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="form-label text-[11px]">Score / Percentile</label>
                    <input
                      type="text"
                      placeholder="Marks / Rank"
                      value={item.score}
                      onChange={(e) => handleExamChange(idx, 'score', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label text-[11px]">Qualification Status</label>
                  <select
                    value={item.qualification}
                    onChange={(e) => handleExamChange(idx, 'qualification', e.target.value)}
                    className="form-select text-xs py-1.5"
                  >
                    <option value="">-- Status --</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Valid Score Card">Valid Score Card</option>
                    <option value="JRF Awarded">JRF Awarded</option>
                    <option value="Appeared / Awaited">Appeared / Awaited</option>
                  </select>
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
                <th className="py-1.5 px-2 w-48">Examination</th>
                <th className="py-1.5 px-2">Subject</th>
                <th className="py-1.5 px-2 w-20 text-center">Year</th>
                <th className="py-1.5 px-2 w-28 text-center">Score / Percentile</th>
                <th className="py-1.5 px-2 w-32">Qualification Status</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exams.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      list={`exam-suggestions-${idx}`}
                      placeholder="e.g. GATE / UGC-NET"
                      value={item.examination}
                      onChange={(e) => handleExamChange(idx, 'examination', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                    <datalist id={`exam-suggestions-${idx}`}>
                      {EXAMINATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} />
                      ))}
                    </datalist>
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Subject / Paper Code"
                      value={item.subject}
                      onChange={(e) => handleExamChange(idx, 'subject', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleExamChange(idx, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={`form-input text-xs py-1 text-center font-mono ${
                        item.year && !validateYear(item.year, { minYear: 1970 }).valid
                          ? '!border-red-500 !ring-red-200 focus:!border-red-500'
                          : ''
                      }`}
                      title={
                        item.year && !validateYear(item.year, { minYear: 1970 }).valid
                          ? validateYear(item.year, { minYear: 1970 }).error
                          : ''
                      }
                    />
                    {item.year && !validateYear(item.year, { minYear: 1970 }).valid && (
                      <span className="text-[9px] text-red-600 block mt-0.5 leading-tight">
                        {validateYear(item.year, { minYear: 1970 }).error}
                      </span>
                    )}
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Marks / Rank"
                      value={item.score}
                      onChange={(e) => handleExamChange(idx, 'score', e.target.value)}
                      className="form-input text-xs py-1 text-center"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <select
                      value={item.qualification}
                      onChange={(e) => handleExamChange(idx, 'qualification', e.target.value)}
                      className="form-select text-xs py-1"
                    >
                      <option value="">-- Status --</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Valid Score Card">Valid Score Card</option>
                      <option value="JRF Awarded">JRF Awarded</option>
                      <option value="Appeared / Awaited">Appeared / Awaited</option>
                    </select>
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeExamRow(idx)}
                      disabled={exams.length <= 1}
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
    </div>
  );
}
