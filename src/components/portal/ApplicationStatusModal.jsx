import React, { useState } from 'react';
import { dbService } from '../../lib/supabase';
import { generateApplicationPDF } from '../../lib/pdfGenerator';

export default function ApplicationStatusModal({ isOpen, onClose, onOpenForm, onOpenEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setSearching(true);
    setErrorMsg('');
    setResult(null);
    setSearched(true);

    try {
      // 1. Try local storage draft / recent submission
      const localDraft = localStorage.getItem('phd_application_draft');
      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          const p = parsed.personal_details || parsed.personal || {};
          if (
            (parsed.applicationNumber && parsed.applicationNumber.toLowerCase() === query.toLowerCase()) ||
            (parsed.application_number && parsed.application_number.toLowerCase() === query.toLowerCase()) ||
            (p.email && p.email.toLowerCase() === query.toLowerCase())
          ) {
            setResult({
              ...parsed,
              application_number: parsed.applicationNumber || parsed.application_number || 'DRAFT-IN-PROGRESS',
              status: parsed.status || 'draft',
              personal_details: p,
              programme: parsed.programme || p.programme,
              submitted_at: parsed.submitted_at || null,
            });
            setSearching(false);
            return;
          }
        } catch (err) {
          console.warn('Error reading local draft:', err);
        }
      }

      // 2. Query Supabase database
      const apps = await dbService.fetchApplications();
      const found = apps.find((app) => {
        const appNo = (app.application_number || '').toLowerCase();
        const email = (app.personal_details?.email || app.applicant_email || '').toLowerCase();
        const cleanQuery = query.toLowerCase();
        return appNo === cleanQuery || email === cleanQuery;
      });

      if (found) {
        setResult(found);
      } else {
        setErrorMsg('No application record found matching this Application Number or Email ID. Please verify your details.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setErrorMsg('Failed to fetch application status. Please check your network or try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    try {
      setDownloadingPdf(true);
      const doc = await generateApplicationPDF(result);
      doc.save(`phd_application_${result.application_number || 'form'}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Unable to generate PDF right now. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const p = result?.personal_details || {};
  const status = result?.status || 'submitted';

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">Provisionally Approved</span>;
      case 'under_review':
        return <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">Under Scrutiny by R&D Cell</span>;
      case 'rejected':
        return <span className="font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">Not Eligible / Rejected</span>;
      case 'draft':
        return <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">Draft (In-Progress)</span>;
      case 'submitted':
      default:
        return <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">Application Submitted</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-brand-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-brand-900">
          <div>
            <h3 className="text-sm sm:text-base font-bold">Track Ph.D. Application Status</h3>
            <p className="text-[11px] text-slate-300">Dr. RVR NRIIT Admissions 2026–2027</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-brand-900 transition"
          >
            <span className="text-base font-bold leading-none">✕</span>
          </button>
        </div>

        {/* Search input body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Enter Application Number or Registered Email ID:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. NRIIT-PHD-2026-0001 or email@domain.com"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={searching || !searchTerm.trim()}
                className="btn-primary text-xs px-4 py-2 shrink-0 disabled:opacity-50"
              >
                {searching ? 'Checking...' : 'Check Status'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Note: You can use your temporary Draft ID (e.g. DRAFT-XXXXXX) or your registered Email.
            </p>
          </form>

          {/* Search Result */}
          {result && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Application ID
                  </span>
                  <span className="font-mono font-bold text-sm text-brand-950">
                    {result.application_number}
                  </span>
                </div>
                <div>{getStatusBadge(status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Candidate Name:</span>
                  <span className="font-semibold text-slate-800">
                    {p.fullName || result.applicant_name || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Registered Email:</span>
                  <span className="font-semibold text-slate-800">
                    {p.email || result.applicant_email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Programme:</span>
                  <span className="font-semibold text-slate-800">
                    {p.programme || result.programme || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Admission Category:</span>
                  <span className="font-semibold text-slate-800">
                    {p.admissionCategory || result.admission_category || 'Full-Time Ph.D.'}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="border-t border-slate-200 pt-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Admissions Scrutiny Progress
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                    1. Registered
                  </div>
                  <div className={`p-2 rounded border font-semibold ${
                    status === 'submitted' || status === 'under_review' || status === 'approved'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    2. Scrutiny
                  </div>
                  <div className={`p-2 rounded border font-semibold ${
                    status === 'approved'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    3. Entrance / DRC
                  </div>
                  <div className={`p-2 rounded border font-semibold ${
                    status === 'approved'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    4. Selection
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 text-brand-900"
                >
                  {downloadingPdf ? 'Generating PDF...' : 'Download Application PDF'}
                </button>

                <div className="flex items-center gap-2">
                  {status !== 'draft' && onOpenEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        const email = result?.personal_details?.email || result?.applicant_email || '';
                        onClose();
                        onOpenEdit(email);
                      }}
                      className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
                    >
                      <span>Edit Application (OTP)</span>
                    </button>
                  )}

                  {status === 'draft' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenForm();
                      }}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      Continue Application →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {searched && !result && errorMsg && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs flex items-start gap-2">
              <div>
                <p className="font-semibold">{errorMsg}</p>
                <p className="mt-1 text-slate-600">
                  Haven't applied yet? Click below to start your official application.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenForm();
                  }}
                  className="mt-2 text-brand-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Fill Ph.D. Application Form →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Admissions Helpdesk: deanrnd@nriit.edu.in</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
