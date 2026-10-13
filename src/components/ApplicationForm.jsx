import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Loader2,
  HelpCircle,
} from 'lucide-react';
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
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving' | 'saved'
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
    }, 1200);

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
      setDraftToast('Draft auto-saved to Admin Portal! You can resume anytime.');
      setTimeout(() => setDraftToast(null), 4000);
    } catch (err) {
      console.error('Failed to save draft:', err);
      setDraftToast('Saved locally in browser.');
      setTimeout(() => setDraftToast(null), 4000);
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
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    setValidationError('');
    // Save draft immediately on step progression
    dbService.saveDraft(formData).catch(console.warn);
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    // Save draft immediately on step regression
    dbService.saveDraft(formData).catch(console.warn);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleFinalSubmitClick = () => {
    const error = validateCurrentStep();
    if (error) {
      setValidationError(error);
      window.scrollTo({ top: 120, behavior: 'smooth' });
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
      // Clear draft from localStorage
      localStorage.removeItem('nriit_phd_applicant_draft');
      onSubmissionComplete(record);
    } catch (err) {
      console.error('Submission failed:', err);
      setValidationError(
        err.message || 'Submission failed. Please check network connection and try again.'
      );
      setIsSubmitting(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Toast message */}
      {draftToast && (
        <div className="fixed top-20 right-6 z-50 bg-brand-950 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-right-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* Title & Instructions Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-brand-700 uppercase">
              Official Application Form
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-950 tracking-tight mt-0.5">
              Biodata of the Candidate for Ph.D. Admission
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Dr RVR NRI Institute of Technology (Deemed to be University) · Directorate of R&D
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              {autoSaveStatus === 'saving' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold border border-brand-200 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                  Auto-saving to portal...
                </span>
              ) : lastSavedTime ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-xs shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-saved to Portal ({lastSavedTime})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 font-medium border border-slate-200 text-xs">
                  <Save className="w-3.5 h-3.5 text-slate-400" />
                  Auto-save Active
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-center shrink-0"
              title="Save draft to continue later"
            >
              {isSavingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-brand-600" />}
              Save Draft Now
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {FORM_STEPS.map((step, idx) => {
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
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }
                  }}
                  disabled={!isDone && !isCurrent}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-brand-950 text-white border-brand-950 shadow-sm'
                      : isDone
                      ? 'bg-brand-50/70 border-brand-200 text-brand-900 hover:bg-brand-100/70'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">
                      0{step.id + 1}
                    </span>
                    {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-bold truncate leading-tight">
                    {step.title}
                  </div>
                  <div className="text-[10px] opacity-75 truncate">{step.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg text-red-800 text-xs flex items-start gap-3 shadow-xs animate-in shake">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Required Information Missing:</span>
            <p>{validationError}</p>
          </div>
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
      <div className="mt-8 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-secondary w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Section
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="btn-secondary text-xs py-2.5"
          >
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </button>

          {currentStep < FORM_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary w-full sm:w-auto"
            >
              Save & Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmitClick}
              disabled={isSubmitting}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 w-full sm:w-auto px-6 py-2.5 text-sm font-bold shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application Final
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Final Submission Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Ph.D. Application Submission
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Once submitted, your application will be assigned a permanent Application Number and cannot be modified by the applicant as per University regulations.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 border border-slate-200 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate:</span>
                <span className="font-semibold">{formData.personalDetails.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Programme:</span>
                <span className="font-semibold">{formData.personalDetails.programme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admission Mode:</span>
                <span className="font-semibold">{formData.personalDetails.admissionCategory}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary flex-1 py-2.5 text-xs font-semibold"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                onClick={handleExecuteSubmission}
                className="btn-primary bg-brand-900 hover:bg-brand-950 flex-1 py-2.5 text-xs font-semibold"
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
