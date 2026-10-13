import React from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { EXAMINATION_OPTIONS } from '../../data/initialFormState';

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
    <div className="space-y-8">
      {/* SECTION 3 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                3
              </span>
              3. EDUCATIONAL QUALIFICATIONS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological academic history from 10th / SSC to Postgraduate Degree
            </p>
          </div>
          <button
            type="button"
            onClick={addEduRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Qualification Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3 w-40">Qualification *</th>
                <th className="py-2.5 px-3 w-40">Specialization *</th>
                <th className="py-2.5 px-3">University / Institution *</th>
                <th className="py-2.5 px-3 w-24">Year *</th>
                <th className="py-2.5 px-3 w-28">% / CGPA *</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
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
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                      required
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. 82.5% / 8.5"
                      value={item.percentage}
                      onChange={(e) => handleEduChange(idx, 'percentage', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-medium"
                      required
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeEduRow(idx)}
                      disabled={education.length <= 1}
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

      {/* SECTION 4 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                4
              </span>
              4. QUALIFYING / ELIGIBILITY EXAMINATIONS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Examples: UGC-NET, UGC-JRF, CSIR-NET/JRF, GATE, SLET/SET, JEST, GPAT, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={addExamRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Examination Row
          </button>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-lg mb-4 text-xs text-blue-900 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
          <span>
            If you have appeared or qualified in national or state examinations (such as GATE, UGC-NET, SLET, SET, GPAT), please mention the details below. Leave blank if not applicable.
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3 w-48">Examination</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 w-24">Year</th>
                <th className="py-2.5 px-3 w-32">Score / Percentile</th>
                <th className="py-2.5 px-3 w-36">Qualification Status</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exams.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      list={`exam-suggestions-${idx}`}
                      placeholder="e.g. GATE / UGC-NET"
                      value={item.examination}
                      onChange={(e) => handleExamChange(idx, 'examination', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                    <datalist id={`exam-suggestions-${idx}`}>
                      {EXAMINATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} />
                      ))}
                    </datalist>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Subject / Paper Code"
                      value={item.subject}
                      onChange={(e) => handleExamChange(idx, 'subject', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleExamChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Marks / Rank"
                      value={item.score}
                      onChange={(e) => handleExamChange(idx, 'score', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
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
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeExamRow(idx)}
                      disabled={exams.length <= 1}
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
    </div>
  );
}
