import React from 'react';
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
    <div className="space-y-2">
      {/* SECTION 7 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                7
              </span>
              7. RESEARCH PUBLICATIONS
            </h2>
            <p className="text-[11px] text-slate-500">
              Journal / Conference publications (SCI, Scopus, UGC-CARE indexed)
            </p>
          </div>
          <button
            type="button"
            onClick={addPubRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {publications.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Publication #{idx + 1}
                </span>
                {publications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePubRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="form-label text-[11px]">Paper Title / Authors</label>
                  <input
                    type="text"
                    placeholder="Paper Title, Authors"
                    value={item.titleAuthor}
                    onChange={(e) => handlePubChange(idx, 'titleAuthor', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="form-label text-[11px]">Journal / Conference</label>
                  <input
                    type="text"
                    placeholder="e.g. IEEE Trans / Springer"
                    value={item.journalConference}
                    onChange={(e) => handlePubChange(idx, 'journalConference', e.target.value)}
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
                      onChange={(e) => handlePubChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-mono"
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px]">Indexing / Quartile</label>
                    <input
                      type="text"
                      placeholder="SCI / Scopus / Q1"
                      value={item.indexingQuartile}
                      onChange={(e) => handlePubChange(idx, 'indexingQuartile', e.target.value)}
                      className="form-input text-xs py-1.5 text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-[11px]">DOI / Article URL</label>
                  <input
                    type="text"
                    placeholder="10.1016/... or link"
                    value={item.doi}
                    onChange={(e) => handlePubChange(idx, 'doi', e.target.value)}
                    className="form-input text-xs py-1.5 font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-1.5 px-2 w-10 text-center">S.No.</th>
                <th className="py-1.5 px-2">Title / Author(s)</th>
                <th className="py-1.5 px-2 w-56">Journal / Conference</th>
                <th className="py-1.5 px-2 w-20 text-center">Year</th>
                <th className="py-1.5 px-2 w-36">Indexing / Quartile</th>
                <th className="py-1.5 px-2 w-36">DOI / URL</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {publications.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Paper Title, Authors"
                      value={item.titleAuthor}
                      onChange={(e) => handlePubChange(idx, 'titleAuthor', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. IEEE Trans / Springer"
                      value={item.journalConference}
                      onChange={(e) => handlePubChange(idx, 'journalConference', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handlePubChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1 text-center"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="SCI / Scopus / Q1 / Q2"
                      value={item.indexingQuartile}
                      onChange={(e) => handlePubChange(idx, 'indexingQuartile', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="10.1016/... or link"
                      value={item.doi}
                      onChange={(e) => handlePubChange(idx, 'doi', e.target.value)}
                      className="form-input text-xs py-1 font-mono"
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removePubRow(idx)}
                      disabled={publications.length <= 1}
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

      {/* SECTION 8 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                8
              </span>
              8. BOOKS / PATENTS / OTHER RESEARCH OUTPUTS
            </h2>
            <p className="text-[11px] text-slate-500">
              Authored books, edited books, published or granted patents, and copyright registrations
            </p>
          </div>
          <button
            type="button"
            onClick={addBpRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {booksPatents.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Output #{idx + 1}
                </span>
                {booksPatents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBpRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="form-label text-[11px]">Type</label>
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
                </div>

                <div>
                  <label className="form-label text-[11px]">Title / Details</label>
                  <input
                    type="text"
                    placeholder="Title of book chapter, patent title, etc."
                    value={item.titleDetails}
                    onChange={(e) => handleBpChange(idx, 'titleDetails', e.target.value)}
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
                      onChange={(e) => handleBpChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-mono"
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px]">ISBN / Patent No.</label>
                    <input
                      type="text"
                      placeholder="ISBN / Number"
                      value={item.isbnPatentNo}
                      onChange={(e) => handleBpChange(idx, 'isbnPatentNo', e.target.value)}
                      className="form-input text-xs py-1.5 font-mono"
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
                <th className="py-1.5 px-2 w-48">Type</th>
                <th className="py-1.5 px-2">Title / Details</th>
                <th className="py-1.5 px-2 w-20 text-center">Year</th>
                <th className="py-1.5 px-2 w-44">ISBN / Patent No.</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {booksPatents.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <select
                      value={item.type}
                      onChange={(e) => handleBpChange(idx, 'type', e.target.value)}
                      className="form-select text-xs py-1"
                    >
                      <option value="">-- Select Type --</option>
                      {OUTPUT_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Title of book chapter, patent title, etc."
                      value={item.titleDetails}
                      onChange={(e) => handleBpChange(idx, 'titleDetails', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleBpChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1 text-center"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="ISBN / Application Number"
                      value={item.isbnPatentNo}
                      onChange={(e) => handleBpChange(idx, 'isbnPatentNo', e.target.value)}
                      className="form-input text-xs py-1 font-mono"
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeBpRow(idx)}
                      disabled={booksPatents.length <= 1}
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

      {/* SECTION 9 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                9
              </span>
              9. PROFESSIONAL MEMBERSHIPS / FELLOWSHIPS / AWARDS
            </h2>
            <p className="text-[11px] text-slate-500">
              IEEE, ACM, CSI, IETE, ISTE, fellowship grants, best researcher awards, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={addMemRow}
            className="inline-flex items-center px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded border border-brand-200 transition"
          >
            + Add Row
          </button>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden space-y-3">
          {memberships.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  Membership / Award #{idx + 1}
                </span>
                {memberships.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMemRow(idx)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                  >
                    Delete Row
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="form-label text-[11px]">Award / Fellowship / Membership</label>
                  <input
                    type="text"
                    placeholder="e.g. Life Member ISTE / Best Paper"
                    value={item.awardMembership}
                    onChange={(e) => handleMemChange(idx, 'awardMembership', e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="form-label text-[11px]">Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. IEEE / Springer / CSIR"
                      value={item.organization}
                      onChange={(e) => handleMemChange(idx, 'organization', e.target.value)}
                      className="form-input text-xs py-1.5"
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px]">Year</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleMemChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1.5 text-center font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-[11px]">Details / Membership ID</label>
                  <input
                    type="text"
                    placeholder="Member ID / Description"
                    value={item.details}
                    onChange={(e) => handleMemChange(idx, 'details', e.target.value)}
                    className="form-input text-xs py-1.5"
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
                <th className="py-1.5 px-2 w-56">Award / Fellowship / Membership</th>
                <th className="py-1.5 px-2 w-48">Organization</th>
                <th className="py-1.5 px-2 w-20 text-center">Year</th>
                <th className="py-1.5 px-2">Details / Membership ID</th>
                <th className="py-1.5 px-1 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {memberships.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-1.5 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. Life Member ISTE / Best Paper"
                      value={item.awardMembership}
                      onChange={(e) => handleMemChange(idx, 'awardMembership', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="e.g. IEEE / Springer / CSIR"
                      value={item.organization}
                      onChange={(e) => handleMemChange(idx, 'organization', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={item.year}
                      onChange={(e) => handleMemChange(idx, 'year', e.target.value)}
                      className="form-input text-xs py-1 text-center"
                    />
                  </td>
                  <td className="py-1 px-1">
                    <input
                      type="text"
                      placeholder="Member ID / Description"
                      value={item.details}
                      onChange={(e) => handleMemChange(idx, 'details', e.target.value)}
                      className="form-input text-xs py-1"
                    />
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeMemRow(idx)}
                      disabled={memberships.length <= 1}
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
