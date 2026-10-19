import React, { useRef, useState } from 'react';
import { DOCUMENT_SPECS } from '../../data/initialFormState';

export default function Step6Documents({
  formData,
  setFormData,
  fileObjects,
  setFileObjects,
}) {
  const fileInputRefs = useRef({});
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileSelect = (docKey, file) => {
    if (!file) return;

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`File size exceeds 5MB limit. Please compress or choose a smaller file.`);
      return;
    }

    // Set in fileObjects state for final backend submission
    setFileObjects((prev) => ({
      ...prev,
      [docKey]: file,
    }));

    // Update documentMetadata in formData
    setFormData((prev) => ({
      ...prev,
      documentMetadata: {
        ...prev.documentMetadata,
        [docKey]: {
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          uploadedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const handleRemoveFile = (docKey) => {
    setFileObjects((prev) => {
      const copy = { ...prev };
      delete copy[docKey];
      return copy;
    });

    setFormData((prev) => {
      const copy = { ...(prev.documentMetadata || {}) };
      delete copy[docKey];
      return {
        ...prev,
        documentMetadata: copy,
      };
    });

    if (fileInputRefs.current[docKey]) {
      fileInputRefs.current[docKey].value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                12
              </span>
              DOCUMENTS TO BE ENCLOSED
            </h2>
            <p className="text-[11px] text-slate-500">
              Upload clear self-attested copies of certificates (PDF, JPG, PNG up to 5MB each)
            </p>
          </div>
          <div className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[11px] font-medium">
            Encrypted Storage
          </div>
        </div>

        {/* Institutional notice */}
        <div className="bg-amber-50/70 border border-amber-200 rounded p-2 text-[11px] text-amber-900 mb-2 leading-relaxed">
          <span className="font-semibold">Instructions for Enclosures: </span>
          Please attach scanned copies of self-attested certificates. Mandatory enclosures are indicated with an asterisk (*). Optional enclosures (experience, qualifying exam card, category certificate) should be enclosed if claimed in earlier sections.
        </div>

        {/* Upload grid - 2 columns, 5 pairs of 2 = 10 items perfectly balanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {DOCUMENT_SPECS.map((spec) => {
            const hasFile = !!fileObjects[spec.key] || !!formData.documentMetadata[spec.key];
            const fileInfo = formData.documentMetadata[spec.key] || (fileObjects[spec.key] ? {
              fileName: fileObjects[spec.key].name,
              fileSize: fileObjects[spec.key].size,
            } : null);

            return (
              <div
                key={spec.key}
                className={`p-3 rounded-xl sm:rounded-lg border transition-all flex flex-col justify-between ${
                  spec.key === 'feeReceipt' ? 'bg-brand-50/15' : ''
                } ${
                  hasFile
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {spec.label}
                        {spec.required && <span className="text-red-500 font-bold ml-1">*</span>}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{spec.desc}</p>
                    </div>
                    {hasFile ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full shrink-0">
                        Attached
                      </span>
                    ) : (
                      spec.required ? (
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded shrink-0">
                          Required
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded shrink-0">
                          Optional
                        </span>
                      )
                    )}
                  </div>

                  {/* Aadhaar Identity Guidelines to balance card height */}
                  {spec.key === 'aadharCard' && (
                    <div className="my-2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-600">
                      <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1 mb-0.5">
                        <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        Aadhaar Identity Proof Guidelines
                      </div>
                      <p className="leading-relaxed">
                        Upload a clear self-attested front & back copy of your 12-digit Aadhaar Card with legible name and photograph.
                      </p>
                    </div>
                  )}

                  {/* Bank Account Details for Fee Payment */}
                  {spec.key === 'feeReceipt' && (
                    <div className="my-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
                      <div className="bg-slate-100/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
                        <span className="flex items-center gap-1 text-brand-950">
                          <svg className="w-3.5 h-3.5 text-brand-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Fee Payment Bank Details (NEFT / RTGS / IMPS)
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <tbody className="divide-y divide-slate-100 text-[11px]">
                            <tr>
                              <td className="px-2.5 py-1 text-slate-500 font-medium whitespace-nowrap w-24">Bank</td>
                              <td className="px-2.5 py-1 text-slate-900 font-semibold">Bank of Baroda, Benz Circle Branch</td>
                            </tr>
                            <tr>
                              <td className="px-2.5 py-1 text-slate-500 font-medium whitespace-nowrap">Account Name</td>
                              <td className="px-2.5 py-1 text-slate-900 font-semibold">Principal, NRI Institute of Technology</td>
                            </tr>
                            <tr>
                              <td className="px-2.5 py-1 text-slate-500 font-medium whitespace-nowrap">Account No.</td>
                              <td className="px-2.5 py-1">
                                <div className="inline-flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-brand-950 text-xs tracking-wider select-all">
                                    26360100033044
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy('26360100033044', 'acct')}
                                    className="px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded border border-brand-200 transition"
                                  >
                                    {copiedKey === 'acct' ? 'Copied!' : 'Copy'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-2.5 py-1 text-slate-500 font-medium whitespace-nowrap">IFSC</td>
                              <td className="px-2.5 py-1">
                                <div className="inline-flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-brand-950 text-xs tracking-wider select-all">
                                    BARB0BENVIJ
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy('BARB0BENVIJ', 'ifsc')}
                                    className="px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded border border-brand-200 transition"
                                  >
                                    {copiedKey === 'ifsc' ? 'Copied!' : 'Copy'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-2.5 py-1 text-slate-500 font-medium whitespace-nowrap">Account Type</td>
                              <td className="px-2.5 py-1 text-slate-900 font-semibold">Savings</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {hasFile && fileInfo ? (
                  <div className="mt-2 flex items-center justify-between bg-white border border-emerald-200 rounded-lg p-2">
                    <div className="truncate flex-1 min-w-0 mr-2">
                      <p className="text-xs font-medium text-slate-800 truncate" title={fileInfo.fileName}>
                        {fileInfo.fileName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formatFileSize(fileInfo.fileSize)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(spec.key)}
                      className="w-7 h-7 sm:w-6 sm:h-6 inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition text-base font-bold shrink-0"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[spec.key] = el)}
                      accept={spec.accept}
                      onChange={(e) => handleFileSelect(spec.key, e.target.files?.[0])}
                      className="hidden"
                      id={`file-input-${spec.key}`}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[spec.key]?.click()}
                      className="w-full inline-flex items-center justify-center px-3 py-2 sm:py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg sm:rounded border border-dashed border-slate-300 transition"
                    >
                      Choose File (PDF/Image)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
