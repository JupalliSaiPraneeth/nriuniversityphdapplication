import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { OUTPUT_TYPE_OPTIONS } from '../../data/initialFormState';

export default function Step4PublicationsOutputs({ formData, setFormData }) {
  const publications = formData.researchPublications;
  const booksPatents = formData.booksPatentsOutputs;
  const memberships = formData.membershipsAwards;

  // Publications Handlers
  const handlePubChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.researchPublications];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, researchPublications: updated };
    });
  };

  const addPubRow = () => {
    setFormData((prev) => ({
      ...prev,
      researchPublications: [
        ...prev.researchPublications,
        { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
      ],
    }));
  };

  const removePubRow = (idx) => {
    if (publications.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      researchPublications: prev.researchPublications.filter((_, i) => i !== idx),
    }));
  };

  // Books / Patents Handlers
  const handleBpChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.booksPatentsOutputs];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, booksPatentsOutputs: updated };
    });
  };

  const addBpRow = () => {
    setFormData((prev) => ({
      ...prev,
      booksPatentsOutputs: [
        ...prev.booksPatentsOutputs,
        { type: '', titleDetails: '', year: '', isbnPatentNo: '' },
      ],
    }));
  };

  const removeBpRow = (idx) => {
    if (booksPatents.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      booksPatentsOutputs: prev.booksPatentsOutputs.filter((_, i) => i !== idx),
    }));
  };

  // Memberships / Awards Handlers
  const handleMemChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.membershipsAwards];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, membershipsAwards: updated };
    });
  };

  const addMemRow = () => {
    setFormData((prev) => ({
      ...prev,
      membershipsAwards: [
        ...prev.membershipsAwards,
        { awardMembership: '', organization: '', year: '', details: '' },
      ],
    }));
  };

  const removeMemRow = (idx) => {
    if (memberships.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      membershipsAwards: prev.membershipsAwards.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-8">
      {/* SECTION 7 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                7
              </span>
              7. RESEARCH PUBLICATIONS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Journal / Conference publications (SCI, Scopus, UGC-CARE indexed)
            </p>
          </div>
          <button
            type="button"
            onClick={addPubRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Publication Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3">Title / Author(s)</th>
                <th className="py-2.5 px-3 w-56">Journal / Conference</th>
                <th className="py-2.5 px-3 w-20 text-center">Year</th>
                <th className="py-2.5 px-3 w-40">Indexing / Quartile</th>
                <th className="py-2.5 px-3 w-40">DOI / URL</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {publications.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Paper Title, Authors"
                      value={item.titleAuthor}
                      onChange={(e) => handlePubChange(idx, 'titleAuthor', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. IEEE Trans / Springer"
                      value={item.journalConference}
                      onChange={(e) => handlePubChange(idx, 'journalConference', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handlePubChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="SCI / Scopus / Q1 / Q2"
                      value={item.indexingQuartile}
                      onChange={(e) => handlePubChange(idx, 'indexingQuartile', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="10.1016/... or link"
                      value={item.doi}
                      onChange={(e) => handlePubChange(idx, 'doi', e.target.value)}
                      className="form-input text-xs py-1.5 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removePubRow(idx)}
                      disabled={publications.length <= 1}
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

      {/* SECTION 8 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                8
              </span>
              8. BOOKS / PATENTS / OTHER RESEARCH OUTPUTS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authored books, edited books, published or granted patents, and copyright registrations
            </p>
          </div>
          <button
            type="button"
            onClick={addBpRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Output Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3 w-48">Type</th>
                <th className="py-2.5 px-3">Title / Details</th>
                <th className="py-2.5 px-3 w-24 text-center">Year</th>
                <th className="py-2.5 px-3 w-48">ISBN / Patent No.</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {booksPatents.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <select
                      value={item.type}
                      onChange={(e) => handleBpChange(idx, 'type', e.target.value)}
                      className="form-select text-xs py-1.5"
                    >
                      <option value="">-- Select Type --</option>
                      {OUTPUT_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Title of book chapter, patent title, etc."
                      value={item.titleDetails}
                      onChange={(e) => handleBpChange(idx, 'titleDetails', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleBpChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="ISBN / Application Number"
                      value={item.isbnPatentNo}
                      onChange={(e) => handleBpChange(idx, 'isbnPatentNo', e.target.value)}
                      className="form-input text-xs py-1.5 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeBpRow(idx)}
                      disabled={booksPatents.length <= 1}
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

      {/* SECTION 9 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                9
              </span>
              9. PROFESSIONAL MEMBERSHIPS / FELLOWSHIPS / AWARDS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              IEEE, ACM, CSI, IETE, ISTE, fellowship grants, best researcher awards, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={addMemRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-md border border-brand-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Award/Membership Row
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">S.No.</th>
                <th className="py-2.5 px-3 w-56">Award / Fellowship / Membership</th>
                <th className="py-2.5 px-3 w-48">Organization</th>
                <th className="py-2.5 px-3 w-24 text-center">Year</th>
                <th className="py-2.5 px-3">Details / Membership ID</th>
                <th className="py-2.5 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {memberships.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. Life Member ISTE / Best Paper"
                      value={item.awardMembership}
                      onChange={(e) => handleMemChange(idx, 'awardMembership', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="e.g. IEEE / Springer / CSIR"
                      value={item.organization}
                      onChange={(e) => handleMemChange(idx, 'organization', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleMemChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Member ID / Description"
                      value={item.details}
                      onChange={(e) => handleMemChange(idx, 'details', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeMemRow(idx)}
                      disabled={memberships.length <= 1}
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
