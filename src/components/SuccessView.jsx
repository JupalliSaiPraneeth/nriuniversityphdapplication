import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Printer, Copy, Check, Calendar, Mail, FileText, ArrowLeft } from 'lucide-react';
import { generateApplicationPDF } from '../lib/pdfGenerator';

export default function SuccessView({ submittedRecord, onStartNew }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white p-8 text-center relative">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 inline-flex items-center justify-center mb-4 shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Application Successfully Submitted</h1>
          <p className="text-brand-200 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Your application for Ph.D. Admission at Dr RVR NRI Institute of Technology has been officially recorded.
          </p>
        </div>

        {/* Application details strip */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Official Application Number
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-950 font-mono tracking-tight mt-0.5 block">
                {appNumber}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Submitted on: {submittedDate}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyAppNumber}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Application No.</span>
                </>
              )}
            </button>
          </div>

          {/* Candidate Summary */}
          <div className="border border-slate-200 rounded-xl p-5 text-xs text-slate-700 space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2 border-b border-slate-100 pb-2">
              Submission Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Candidate Name:</span>
                <span className="font-semibold text-slate-900">{p.fullName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ph.D. Programme:</span>
                <span className="font-semibold text-slate-900">{p.programme || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Specialization:</span>
                <span className="font-semibold text-slate-900">{p.specialization || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Admission Category:</span>
                <span className="font-semibold text-slate-900">{p.admissionCategory || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Registered Email:</span>
                <span className="font-semibold text-slate-900">{p.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mobile:</span>
                <span className="font-semibold text-slate-900">{p.mobileNumber || '—'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: PDF and Print */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download Completed Application PDF'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Preview
            </button>
          </div>

          {/* Instructions & Next steps */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-blue-950">
              <Mail className="w-4 h-4 text-brand-700" />
              What Happens Next:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>Keep your Application Number safe for all future correspondence.</li>
              <li>Your application will be reviewed by the Department Research Committee (DRC).</li>
              <li>Shortlisted candidates will be invited for research interview / presentation.</li>
              <li>For any admission queries, email the Dean R&D office at <a href="mailto:deanrnd@nriit.edu.in" className="text-brand-700 font-semibold underline">deanrnd@nriit.edu.in</a>.</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onStartNew}
              className="text-xs font-semibold text-slate-500 hover:text-brand-700 inline-flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Submit another application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
