import React, { useRef } from 'react';
import { Upload, X, Camera, Check } from 'lucide-react';
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
      const updatedAddress = {
        ...prev.addressDetails,
        [field]: value,
      };
      if (field === 'permanentAddress' && updatedAddress.sameAsPermanent) {
        updatedAddress.presentAddress = value;
      }
      return {
        ...prev,
        addressDetails: updatedAddress,
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
    <div className="space-y-8">
      {/* SECTION 1 */}
      <div className="card-section">
        <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
                1
              </span>
              1. APPLICATION & PERSONAL DETAILS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter candidate details and research subject as per official records
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Application Identifier
            </span>
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-semibold rounded border border-slate-200">
              {formData.applicationNumber || 'Generated upon submission'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photograph Upload Area */}
          <div className="md:col-span-1 flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <span className="form-label form-label-required mb-3 text-center">
              Recent Passport Size Photo
            </span>

            <div className="w-36 h-44 bg-white border-2 border-slate-200 rounded-lg overflow-hidden flex flex-col items-center justify-center relative shadow-inner group">
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
                    className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow"
                    title="Remove photograph"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <Camera className="w-10 h-10 mx-auto mb-2 text-slate-300 group-hover:text-brand-500 transition-colors" />
                  <p className="text-[11px] font-medium leading-tight">
                    Affix Passport Size Photo
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">JPEG/PNG, Max 3MB</p>
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
              className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5 text-brand-600" />
              {p.photoDataUrl ? 'Change Photo' : 'Upload Photograph'}
            </button>
          </div>

          {/* Core Personal Fields */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="programme" className="form-label form-label-required">
                Ph.D. Programme / Subject
              </label>
              <select
                id="programme"
                value={p.programme}
                onChange={(e) => handlePersonalChange('programme', e.target.value)}
                className="form-select"
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
        <div className="border-b border-slate-200 pb-3 mb-6">
          <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-brand-800 text-white inline-flex items-center justify-center text-xs font-bold">
              2
            </span>
            2. ADDRESS DETAILS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide permanent and present correspondence addresses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="permanentAddress" className="form-label form-label-required">
              Permanent Address
            </label>
            <textarea
              id="permanentAddress"
              rows={3}
              placeholder="Door No, Street, Landmark, Village / Town, Mandal"
              value={a.permanentAddress}
              onChange={(e) => handleAddressChange('permanentAddress', e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-brand-800 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={a.sameAsPermanent}
                onChange={(e) => handleSameAsPermanentToggle(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>Present / Correspondence Address is the same as Permanent Address</span>
            </label>
            <label htmlFor="presentAddress" className="form-label form-label-required">
              Present / Correspondence Address
            </label>
            <textarea
              id="presentAddress"
              rows={3}
              disabled={a.sameAsPermanent}
              placeholder="Present address for courier and interview communication"
              value={a.presentAddress}
              onChange={(e) => handleAddressChange('presentAddress', e.target.value)}
              className="form-textarea"
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
