import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { generateApplicationPDF } from '../lib/pdfGenerator';

export default function SuccessView({ submittedRecord, onStartNew }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if confetti not loaded
    }
  }, []);

  const handleCopyAppNumber = () => {
    if (submittedRecord?.application_number) {
      navigator.clipboard.writeText(submittedRecord.application_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    if (!submittedRecord) return;
    setIsGeneratingPdf(true);
    try {
      const photoDataUrl = submittedRecord.personal_details?.photoDataUrl || null;
      const doc = await generateApplicationPDF(submittedRecord, photoDataUrl);
      const appNum = submittedRecord.application_number || 'APPLICATION';
      doc.save(`NRIIT-PHD-${appNum}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = async () => {
    if (!submittedRecord) return;
    try {
      const photoDataUrl = submittedRecord.personal_details?.photoDataUrl || null;
      const doc = await generateApplicationPDF(submittedRecord, photoDataUrl);
      const blobUrl = doc.output('bloburl');
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Print preview failed:', err);
    }
  };

  const appNumber = submittedRecord?.application_number || 'NRIIT-PHD-SUBMITTED';
  const submittedDate = submittedRecord?.submitted_at
    ? new Date(submittedRecord.submitted_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-IN');

  const p = submittedRecord?.personal_details || {};

  return (
    <div className="max-w-3xl mx-auto py-3 px-4">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-md overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-brand-950 text-white p-4 text-center">
          <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-400 mb-1.5">
            SUBMISSION RECORDED
          </div>
          <h1 className="text-xl font-bold tracking-tight">Application Successfully Submitted</h1>
          <p className="text-brand-200 text-xs mt-0.5 max-w-md mx-auto">
            Your application for Ph.D. Admission at Dr RVR NRI Institute of Technology has been officially recorded.
          </p>
        </div>

        {/* Application details strip */}
        <div className="p-4 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Official Application Number
              </span>
              <span className="text-xl font-extrabold text-brand-950 font-mono tracking-tight block">
                {appNumber}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Submitted on: {submittedDate}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyAppNumber}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-300 shadow-sm transition"
            >
              {copied ? 'Copied to Clipboard' : 'Copy Application No.'}
            </button>
          </div>

          {/* Candidate Summary */}
          <div className="border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-2">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-1">
              Submission Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Candidate Name:</span>
                <span className="font-semibold text-slate-900">{p.fullName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ph.D. Programme:</span>
                <span className="font-semibold text-slate-900">{p.programme || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Specialization:</span>
                <span className="font-semibold text-slate-900">{p.specialization || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Admission Category:</span>
                <span className="font-semibold text-slate-900">{p.admissionCategory || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Registered Email:</span>
                <span className="font-semibold text-slate-900">{p.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Mobile:</span>
                <span className="font-semibold text-slate-900">{p.mobileNumber || '—'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: PDF and Print */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex-1 btn-primary py-2 text-xs flex items-center justify-center font-semibold"
            >
              {isGeneratingPdf ? 'Generating PDF...' : 'Download Completed Application PDF'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary py-2 text-xs flex items-center justify-center font-semibold"
            >
              Print Preview
            </button>
          </div>

          {/* Instructions & Next steps */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-3 text-xs text-blue-900 space-y-1">
            <p className="font-bold text-blue-950">
              What Happens Next:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
              <li>Keep your Application Number safe for all future correspondence.</li>
              <li>Your application will be reviewed by the Department Research Committee (DRC).</li>
              <li>Shortlisted candidates will be invited for research interview / presentation.</li>
              <li>For any admission queries, email the Dean R&D office at <a href="mailto:deanrnd@nriit.edu.in" className="text-brand-700 font-semibold underline">deanrnd@nriit.edu.in</a>.</li>
            </ul>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onStartNew}
              className="text-xs font-semibold text-slate-500 hover:text-brand-700 transition"
            >
              ← Submit another application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
