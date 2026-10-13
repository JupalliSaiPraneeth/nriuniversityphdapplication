import React, { useRef } from 'react';
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
    <div className="space-y-2">
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                12
              </span>
              12. DOCUMENTS TO BE ENCLOSED
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

        {/* Upload grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {DOCUMENT_SPECS.map((spec) => {
            const hasFile = !!fileObjects[spec.key] || !!formData.documentMetadata[spec.key];
            const fileInfo = formData.documentMetadata[spec.key] || (fileObjects[spec.key] ? {
              fileName: fileObjects[spec.key].name,
              fileSize: fileObjects[spec.key].size,
            } : null);

            return (
              <div
                key={spec.key}
                className={`p-2.5 rounded-lg border transition-all ${
                  hasFile
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {spec.label}
                      {spec.required && <span className="text-red-500 font-bold ml-1">*</span>}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{spec.desc}</p>
                  </div>
                  {hasFile ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Attached
                    </span>
                  ) : (
                    spec.required ? (
                      <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded">
                        Required
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">
                        Optional
                      </span>
                    )
                  )}
                </div>

                {hasFile && fileInfo ? (
                  <div className="mt-1.5 flex items-center justify-between bg-white border border-emerald-200 rounded p-1.5">
                    <div className="truncate">
                      <p className="text-xs font-medium text-slate-800 truncate" title={fileInfo.fileName}>
                        {fileInfo.fileName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatFileSize(fileInfo.fileSize)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(spec.key)}
                      className="w-5 h-5 inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition text-sm font-bold shrink-0 ml-2"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="mt-1.5">
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
                      className="w-full inline-flex items-center justify-center px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-dashed border-slate-300 transition"
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
