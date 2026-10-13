import React, { useRef } from 'react';
import { Upload, FileCheck, X, FileText, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { DOCUMENT_SPECS } from '../../data/initialFormState';

export default function Step6Documents({
  formData,
  setFormData,
  fileObjects,
  setFileObjects,
}) {
  const fileInputRefs = useRef({});

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
    <div className="space-y-6">
      <div className="card-section">
        <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                12
              </span>
              12. DOCUMENTS TO BE ENCLOSED
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload clear self-attested copies of certificates (PDF, JPG, PNG up to 5MB each)
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-slate-600 text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>Encrypted Private Storage</span>
          </div>
        </div>

        {/* Institutional notice */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 mb-6 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Instructions for Enclosures:</p>
            <p>
              Please attach scanned copies of self-attested certificates. Mandatory enclosures are indicated with an asterisk (*). Optional enclosures (experience, qualifying exam card, category certificate) should be enclosed if claimed in earlier sections.
            </p>
          </div>
        </div>

        {/* Upload grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOCUMENT_SPECS.map((spec) => {
            const hasFile = !!fileObjects[spec.key] || !!formData.documentMetadata[spec.key];
            const fileInfo = formData.documentMetadata[spec.key] || (fileObjects[spec.key] ? {
              fileName: fileObjects[spec.key].name,
              fileSize: fileObjects[spec.key].size,
            } : null);

            return (
              <div
                key={spec.key}
                className={`p-4 rounded-xl border transition-all ${
                  hasFile
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {spec.label}
                      {spec.required && <span className="text-red-500 font-bold ml-1">*</span>}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{spec.desc}</p>
                  </div>
                  {hasFile ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Attached
                    </span>
                  ) : (
                    spec.required ? (
                      <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded">
                        Required
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">
                        Optional
                      </span>
                    )
                  )}
                </div>

                {hasFile && fileInfo ? (
                  <div className="mt-3 flex items-center justify-between bg-white border border-emerald-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-medium text-slate-800 truncate" title={fileInfo.fileName}>
                          {fileInfo.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatFileSize(fileInfo.fileSize)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(spec.key)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition shrink-0 ml-2"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
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
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-dashed border-slate-300 transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-600" />
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
