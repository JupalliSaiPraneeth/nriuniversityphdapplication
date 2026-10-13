import React, { useRef } from 'react';
import {
  PROGRAMME_OPTIONS,
  ADMISSION_CATEGORIES,
  MODE_OF_ADMISSION,
  GENDER_OPTIONS,
  CATEGORY_OPTIONS,
} from '../../data/initialFormState';

export default function Step1PersonalAddress({ formData, setFormData, fileObjects, setFileObjects }) {
  const photoInputRef = useRef(null);
  const p = formData.personalDetails;
  const a = formData.addressDetails;

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev.addressDetails,
        [field]: value,
      };
      if (field === 'permanentAddress' && updated.sameAsPermanent) {
        updated.presentAddress = value;
      }
      return {
        ...prev,
        addressDetails: updated,
      };
    });
  };

  const handleSameAsPermanentToggle = (checked) => {
    setFormData((prev) => ({
      ...prev,
      addressDetails: {
        ...prev.addressDetails,
        sameAsPermanent: checked,
        presentAddress: checked ? prev.addressDetails.permanentAddress : prev.addressDetails.presentAddress,
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG or WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Image size exceeds 3MB limit.');
      return;
    }

    // Save file object for final storage upload
    setFileObjects((prev) => ({
      ...prev,
      photo: file,
    }));

    // Read Data URL for preview and PDF export
    const reader = new FileReader();
    reader.onload = () => {
      handlePersonalChange('photoDataUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    handlePersonalChange('photoDataUrl', '');
    setFileObjects((prev) => {
      const copy = { ...prev };
      delete copy.photo;
      return copy;
    });
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {/* SECTION 1 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                1
              </span>
              1. APPLICATION & PERSONAL DETAILS
            </h2>
            <p className="text-[11px] text-slate-500">
              Enter candidate details and research subject as per official records
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
              Application Identifier
            </span>
            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-mono font-semibold rounded border border-slate-200">
              {formData.applicationNumber || 'Generated upon submission'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Photograph Upload Area */}
          <div className="md:col-span-1 flex flex-col items-center p-2.5 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <span className="form-label form-label-required mb-1.5 text-center text-xs">
              Recent Passport Size Photo
            </span>

            <div className="w-32 h-40 bg-white border-2 border-slate-200 rounded-lg overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
              {p.photoDataUrl ? (
                <>
                  <img
                    src={p.photoDataUrl}
                    alt="Candidate Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex items-center justify-center text-xs font-bold shadow"
                    title="Remove photograph"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <div className="text-xs font-bold text-slate-500 mb-1">[PHOTO]</div>
                  <p className="text-[10px] font-medium leading-tight text-slate-600">
                    Affix Passport Size Photo
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">JPEG/PNG, Max 3MB</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload-input"
            />

            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="mt-2 inline-flex items-center px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-300 shadow-sm transition"
            >
              {p.photoDataUrl ? 'Change Photo' : 'Upload Photograph'}
            </button>
          </div>

          {/* Core Personal Fields */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="programme" className="form-label form-label-required">
                Ph.D. Programme / Subject
              </label>
              <select
                id="programme"
                value={p.programme}
                onChange={(e) => handlePersonalChange('programme', e.target.value)}
                className="form-select text-xs py-1.5"
                required
              >
                <option value="">-- Select Programme / Department --</option>
                {PROGRAMME_OPTIONS.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="specialization" className="form-label form-label-required">
                Specialization / Research Area
              </label>
              <input
                id="specialization"
                type="text"
                placeholder="e.g. Deep Learning, VLSI, IoT"
                value={p.specialization}
                onChange={(e) => handlePersonalChange('specialization', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="admissionCategory" className="form-label form-label-required">
                Admission Category
              </label>
              <select
                id="admissionCategory"
                value={p.admissionCategory}
                onChange={(e) => handlePersonalChange('admissionCategory', e.target.value)}
                className="form-select"
                required
              >
                {ADMISSION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="modeOfAdmission" className="form-label form-label-required">
                Mode of Admission
              </label>
              <select
                id="modeOfAdmission"
                value={p.modeOfAdmission}
                onChange={(e) => handlePersonalChange('modeOfAdmission', e.target.value)}
                className="form-select"
                required
              >
                {MODE_OF_ADMISSION.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="form-label form-label-required">
                Candidate's Full Name (as in SSC Certificate)
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name (Capital letters preferred)"
                value={p.fullName}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="guardianName" className="form-label form-label-required">
                Father's / Mother's / Guardian's Name
              </label>
              <input
                id="guardianName"
                type="text"
                placeholder="Guardian's Name"
                value={p.guardianName}
                onChange={(e) => handlePersonalChange('guardianName', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="form-label form-label-required">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={p.dateOfBirth}
                onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="form-label form-label-required">
                Gender
              </label>
              <select
                id="gender"
                value={p.gender}
                onChange={(e) => handlePersonalChange('gender', e.target.value)}
                className="form-select"
                required
              >
                <option value="">-- Select Gender --</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="form-label form-label-required">
                Category
              </label>
              <select
                id="category"
                value={p.category}
                onChange={(e) => handlePersonalChange('category', e.target.value)}
                className="form-select"
                required
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="email" className="form-label form-label-required">
                Email ID (Active & Valid)
              </label>
              <input
                id="email"
                type="email"
                placeholder="applicant@domain.com"
                value={p.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="form-label form-label-required">
                Mobile Number (10 digits)
              </label>
              <input
                id="mobileNumber"
                type="tel"
                placeholder="e.g. 9876543210"
                value={p.mobileNumber}
                onChange={(e) => handlePersonalChange('mobileNumber', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="emergencyContact" className="form-label form-label-required">
                Emergency Contact Number
              </label>
              <input
                id="emergencyContact"
                type="tel"
                placeholder="e.g. 9876501234 (Relative / Parent / Alternate)"
                value={p.emergencyContact}
                onChange={(e) => handlePersonalChange('emergencyContact', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-1.5 mb-2">
          <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
              2
            </span>
            2. ADDRESS DETAILS
          </h2>
          <p className="text-[11px] text-slate-500">
            Provide permanent and present correspondence addresses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="sm:col-span-2">
            <label htmlFor="permanentAddress" className="form-label form-label-required">
              Permanent Address
            </label>
            <textarea
              id="permanentAddress"
              rows={2}
              placeholder="Door No, Street, Landmark, Village / Town, Mandal"
              value={a.permanentAddress}
              onChange={(e) => handleAddressChange('permanentAddress', e.target.value)}
              className="form-textarea text-xs py-1.5"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-800 cursor-pointer mb-1">
              <input
                type="checkbox"
                checked={a.sameAsPermanent}
                onChange={(e) => handleSameAsPermanentToggle(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>Present / Correspondence Address is the same as Permanent Address</span>
            </label>
            <label htmlFor="presentAddress" className="form-label form-label-required">
              Present / Correspondence Address
            </label>
            <textarea
              id="presentAddress"
              rows={2}
              disabled={a.sameAsPermanent}
              placeholder="Present address for courier and interview communication"
              value={a.presentAddress}
              onChange={(e) => handleAddressChange('presentAddress', e.target.value)}
              className="form-textarea text-xs py-1.5"
              required
            />
          </div>

          <div>
            <label htmlFor="district" className="form-label form-label-required">
              District
            </label>
            <input
              id="district"
              type="text"
              placeholder="e.g. NTR / Krishna / Guntur"
              value={a.district}
              onChange={(e) => handleAddressChange('district', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="form-label form-label-required">
              State
            </label>
            <input
              id="state"
              type="text"
              placeholder="e.g. Andhra Pradesh"
              value={a.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="pinCode" className="form-label form-label-required">
              PIN Code
            </label>
            <input
              id="pinCode"
              type="text"
              maxLength={6}
              placeholder="6-digit PIN code"
              value={a.pinCode}
              onChange={(e) => handleAddressChange('pinCode', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
