import React, { useState, useEffect } from 'react';
import { getInitialFormData } from '../data/initialFormState';
import { dbService } from '../lib/supabase';
import Step1PersonalAddress from './steps/Step1PersonalAddress';
import Step2EducationExams from './steps/Step2EducationExams';
import Step3ExperienceExposure from './steps/Step3ExperienceExposure';
import Step4PublicationsOutputs from './steps/Step4PublicationsOutputs';
import Step5ConferencesReferences from './steps/Step5ConferencesReferences';
import Step6Documents from './steps/Step6Documents';
import Step7DeclarationReview from './steps/Step7DeclarationReview';

const FORM_STEPS = [
  { id: 0, title: 'Personal & Address', subtitle: 'Sec 1 & 2' },
  { id: 1, title: 'Academics & Exams', subtitle: 'Sec 3 & 4' },
  { id: 2, title: 'Experience & Area', subtitle: 'Sec 5 & 6' },
  { id: 3, title: 'Research & Outputs', subtitle: 'Sec 7, 8 & 9' },
  { id: 4, title: 'FDPs & References', subtitle: 'Sec 10 & 11' },
  { id: 5, title: 'Document Uploads', subtitle: 'Sec 12' },
  { id: 6, title: 'Declaration & Review', subtitle: 'Sec 13' },
];

export default function ApplicationForm({ onSubmissionComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(getInitialFormData);
  const [fileObjects, setFileObjects] = useState({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftToast, setDraftToast] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Restore draft from localStorage on initial load and assign draft number
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('nriit_phd_applicant_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        const restoredAppNumber = parsed.applicationNumber || `DRAFT-${Math.floor(100000 + Math.random() * 900000)}`;
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          applicationNumber: restoredAppNumber,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          applicationNumber: prev.applicationNumber || `DRAFT-${Math.floor(100000 + Math.random() * 900000)}`,
        }));
      }
    } catch (e) {
      console.warn('Could not restore draft:', e);
    }
  }, []);

  // Automatic real-time background draft saving to database & storage
  useEffect(() => {
    const hasAnyContent = Boolean(
      formData.personalDetails?.fullName?.trim() ||
      formData.personalDetails?.email?.trim() ||
      formData.personalDetails?.mobileNumber?.trim() ||
      formData.personalDetails?.programme ||
      formData.personalDetails?.specialization?.trim() ||
      formData.addressDetails?.permanentAddress?.trim() ||
      formData.educationalQualifications?.some((q) => q.qualification?.trim())
    );

    if (!hasAnyContent) return;

    setAutoSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem('nriit_phd_applicant_draft', JSON.stringify(formData));
        await dbService.saveDraft(formData);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);
        setAutoSaveStatus('saved');
      } catch (err) {
        console.warn('Background auto-save warning:', err);
        setAutoSaveStatus('saved');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Save draft helper (manual trigger)
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setValidationError('');
    try {
      localStorage.setItem('nriit_phd_applicant_draft', JSON.stringify(formData));
      await dbService.saveDraft(formData);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(timeStr);
      setAutoSaveStatus('saved');
      setDraftToast('Draft saved successfully to Admin Portal.');
      setTimeout(() => setDraftToast(null), 3000);
    } catch (err) {
      console.error('Failed to save draft:', err);
      setDraftToast('Saved locally in browser.');
      setTimeout(() => setDraftToast(null), 3000);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Step Validation rules
  const validateCurrentStep = () => {
    setValidationError('');
    const p = formData.personalDetails;
    const a = formData.addressDetails;

    if (currentStep === 0) {
      if (!p.programme) return 'Please select your Ph.D. Programme / Subject.';
      if (!p.specialization?.trim()) return 'Please enter your Specialization / Research Area.';
      if (!p.fullName?.trim()) return "Please enter the candidate's full name.";
      if (!p.guardianName?.trim()) return "Please enter father's / mother's / guardian's name.";
      if (!p.dateOfBirth) return 'Please provide date of birth.';
      if (!p.gender) return 'Please select gender.';
      if (!p.email?.trim() || !/^\S+@\S+\.\S+$/.test(p.email)) return 'Please provide a valid email ID.';
      if (!p.mobileNumber?.trim() || p.mobileNumber.replace(/\D/g, '').length < 10)
        return 'Please enter a valid 10-digit mobile number.';
      if (!p.emergencyContact?.trim()) return 'Please provide an emergency contact number.';
      if (!a.permanentAddress?.trim()) return 'Please enter permanent address.';
      if (!a.district?.trim()) return 'Please specify district.';
      if (!a.state?.trim()) return 'Please specify state.';
      if (!a.pinCode?.trim() || a.pinCode.replace(/\D/g, '').length < 6)
        return 'Please enter a valid 6-digit PIN code.';
    }

    if (currentStep === 1) {
      const edu = formData.educationalQualifications;
      const validRows = edu.filter((r) => r.qualification && r.qualification.trim());
      if (validRows.length === 0) {
        return 'Please provide at least one educational qualification (UG / PG degree).';
      }
      for (const row of validRows) {
        if (!row.institution?.trim()) {
          return `Please provide University / Institution for ${row.qualification}.`;
        }
        if (!row.percentage?.trim()) {
          return `Please provide % / CGPA for ${row.qualification}.`;
        }
      }
    }

    if (currentStep === 4) {
      const refs = formData.references;
      if (!refs[0]?.nameDesignation?.trim() || !refs[0]?.institution?.trim() || !refs[0]?.contactEmail?.trim()) {
        return 'Please provide details for at least Referee 1 in Section 11.';
      }
    }

    if (currentStep === 5) {
      const requiredDocs = ['sscCertificate', 'interCertificate', 'ugDegree', 'pgDegree', 'aadharCard', 'feeReceipt'];
      for (const docKey of requiredDocs) {
        if (!fileObjects[docKey] && !formData.documentMetadata[docKey]) {
          return 'Please upload all mandatory documents (marked with red asterisk *) before proceeding.';
        }
      }
    }

    if (currentStep === 6) {
      if (!formData.declaration.accepted) {
        return 'You must agree and check the mandatory declaration before submitting.';
      }
      if (!formData.declaration.place?.trim()) {
        return 'Please enter declaration place.';
      }
      if (!formData.declaration.typedSignature?.trim()) {
        return 'Please provide candidate typed digital signature.';
      }
    }

    return null;
  };

  const handleNextStep = () => {
    const error = validateCurrentStep();
    if (error) {
      setValidationError(error);
      window.scrollTo({ top: 80, behavior: 'smooth' });
      return;
    }
    setValidationError('');
    dbService.saveDraft(formData).catch(console.warn);
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    dbService.saveDraft(formData).catch(console.warn);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  const handleFinalSubmitClick = () => {
    const error = validateCurrentStep();
    if (error) {
      setValidationError(error);
      window.scrollTo({ top: 80, behavior: 'smooth' });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteSubmission = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setValidationError('');

    try {
      const record = await dbService.submitApplication(formData, fileObjects);
      localStorage.removeItem('nriit_phd_applicant_draft');
      onSubmissionComplete(record);
    } catch (err) {
      console.error('Submission failed:', err);
      setValidationError(
        err.message || 'Submission failed. Please check network connection and try again.'
      );
      setIsSubmitting(false);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5">
      {/* Toast message */}
      {draftToast && (
        <div className="fixed top-16 right-4 z-50 bg-brand-950 text-white px-3 py-2 rounded shadow-md text-xs">
          <span>{draftToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-3.5 mb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-brand-700 uppercase">
              Official Application Form
            </span>
            <h1 className="text-base sm:text-lg font-bold text-brand-950 tracking-tight">
              Biodata of the Candidate for Ph.D. Admission
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">
              {autoSaveStatus === 'saving'
                ? 'Saving draft...'
                : lastSavedTime
                ? `Saved as Draft (${lastSavedTime})`
                : 'Auto-save Active'}
            </span>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="btn-secondary text-xs px-2.5 py-1"
            >
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1">
            {FORM_STEPS.map((step) => {
              const isCurrent = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isDone || isCurrent) {
                      setValidationError('');
                      setCurrentStep(step.id);
                      window.scrollTo({ top: 80, behavior: 'smooth' });
                    }
                  }}
                  disabled={!isDone && !isCurrent}
                  className={`text-left p-1.5 sm:p-2 rounded border transition-all ${
                    isCurrent
                      ? 'bg-brand-950 text-white border-brand-950 font-bold'
                      : isDone
                      ? 'bg-brand-50 border-brand-200 text-brand-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="text-[10px] font-mono leading-none mb-0.5">
                    0{step.id + 1} {isDone ? '✓' : ''}
                  </div>
                  <div className="text-xs truncate leading-tight">
                    {step.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div className="mb-2.5 p-2.5 bg-red-50 border-l-4 border-red-600 rounded-r text-red-800 text-xs">
          <strong>Missing required field:</strong> {validationError}
        </div>
      )}

      {/* Form Steps Rendering */}
      <div>
        {currentStep === 0 && (
          <Step1PersonalAddress
            formData={formData}
            setFormData={setFormData}
            fileObjects={fileObjects}
            setFileObjects={setFileObjects}
          />
        )}
        {currentStep === 1 && (
          <Step2EducationExams formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 2 && (
          <Step3ExperienceExposure formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 3 && (
          <Step4PublicationsOutputs formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 4 && (
          <Step5ConferencesReferences formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 5 && (
          <Step6Documents
            formData={formData}
            setFormData={setFormData}
            fileObjects={fileObjects}
            setFileObjects={setFileObjects}
          />
        )}
        {currentStep === 6 && (
          <Step7DeclarationReview
            formData={formData}
            setFormData={setFormData}
            onJumpToStep={(target) => setCurrentStep(target)}
          />
        )}
      </div>

      {/* Navigation Controls Bar */}
      <div className="mt-2.5 bg-white p-3 rounded-lg border border-slate-200/90 shadow-sm flex items-center justify-between gap-2">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Previous Section
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="btn-secondary text-xs px-2.5 py-1.5"
          >
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </button>

          {currentStep < FORM_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary text-xs px-4 py-1.5"
            >
              Save & Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmitClick}
              disabled={isSubmitting}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 text-xs px-5 py-1.5 font-bold"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application Final'}
            </button>
          )}
        </div>
      </div>

      {/* Final Submission Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-3">
            <h3 className="text-base font-bold text-slate-900 text-center">
              Confirm Final Ph.D. Application Submission
            </h3>
            <p className="text-xs text-slate-500 text-center leading-normal">
              Once submitted, your application will receive a permanent Application Number and cannot be modified by the applicant as per University regulations.
            </p>

            <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1 border border-slate-200 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate:</span>
                <span className="font-semibold">{formData.personalDetails.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Programme:</span>
                <span className="font-semibold">{formData.personalDetails.programme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold">{formData.personalDetails.admissionCategory}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary flex-1 py-1.5 text-xs font-semibold"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                onClick={handleExecuteSubmission}
                className="btn-primary bg-brand-900 hover:bg-brand-950 flex-1 py-1.5 text-xs font-semibold"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
