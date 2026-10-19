import React, { useState, useEffect } from 'react';
import { getInitialFormData, mapRecordToFormData, hasUserFilledAnyField, validateDOB, validateYear, validateFromTo, validatePercentageOrCGPA } from '../data/initialFormState';
import { dbService } from '../lib/supabase';
import Step1PersonalAddress from './steps/Step1PersonalAddress';
import Step2EducationExams from './steps/Step2EducationExams';
import Step3ExperienceExposure from './steps/Step3ExperienceExposure';
import Step4PublicationsOutputs from './steps/Step4PublicationsOutputs';
import Step5ConferencesReferences from './steps/Step5ConferencesReferences';
import Step6Documents from './steps/Step6Documents';
import Step7DeclarationReview from './steps/Step7DeclarationReview';

const FORM_STEPS = [
  {
    id: 0,
    milestone: 'Milestone 1',
    stepNumber: '1',
    title: 'Personal & Address',
    subtitle: 'Sec 1 & 2',
    desc: 'Profile & contact',
  },
  {
    id: 1,
    milestone: 'Milestone 2',
    stepNumber: '2',
    title: 'Academics & Experience',
    subtitle: 'Sec 3, 4, 5 & 6',
    desc: 'Degrees & service',
  },
  {
    id: 2,
    milestone: 'Milestone 3',
    stepNumber: '3',
    title: 'Research & References',
    subtitle: 'Sec 7 to 11',
    desc: 'Papers & referees',
  },
  {
    id: 3,
    milestone: 'Milestone 4',
    stepNumber: '4',
    title: 'Document Uploads',
    subtitle: 'Sec 12',
    desc: 'Certificates & files',
  },
  {
    id: 4,
    milestone: 'Milestone 5',
    stepNumber: '5',
    title: 'Declaration',
    subtitle: 'Sec 13',
    desc: 'Declaration & submit',
  },
];


export default function ApplicationForm({
  onSubmissionComplete,
  onBackToPortal,
  onExitEditMode,
  initialData = null,
  isEditMode = false,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    if (initialData) return mapRecordToFormData(initialData);
    return getInitialFormData();
  });
  const [fileObjects, setFileObjects] = useState({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftToast, setDraftToast] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Sync formData whenever initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(mapRecordToFormData(initialData));
    }
  }, [initialData]);

  // Restore draft from localStorage on initial load only if NOT in edit mode
  useEffect(() => {
    if (initialData || isEditMode) return;
    try {
      const savedDraft = localStorage.getItem('nriit_phd_applicant_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (hasUserFilledAnyField(parsed)) {
          const restoredAppNumber = parsed.applicationNumber || `DRAFT-${Math.floor(100000 + Math.random() * 900000)}`;
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            applicationNumber: restoredAppNumber,
          }));
        } else {
          localStorage.removeItem('nriit_phd_applicant_draft');
        }
      }
    } catch (e) {
      console.warn('Could not restore draft:', e);
    }
  }, []);

  // Automatic real-time background draft saving to database & storage
  useEffect(() => {
    const hasAnyContent = hasUserFilledAnyField(formData);

    if (!hasAnyContent) {
      setAutoSaveStatus('idle');
      return;
    }

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

    if (!hasUserFilledAnyField(formData)) {
      setDraftToast('Please fill at least one field before saving as draft.');
      setTimeout(() => setDraftToast(null), 3000);
      setIsSavingDraft(false);
      return;
    }

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

  // Step Validation rules for 5 steps
  const validateCurrentStep = () => {
    setValidationError('');
    const p = formData.personalDetails;
    const a = formData.addressDetails;

    // STEP 0: Personal & Address (Sec 1 & 2)
    if (currentStep === 0) {
      if (!p.fullName?.trim()) return "Please enter the candidate's full name.";
      if (!p.guardianName?.trim()) return "Please enter father's / mother's / guardian's name.";
      const dobResult = validateDOB(p.dateOfBirth);
      if (!dobResult.valid) return dobResult.error;
      if (!p.gender) return 'Please select gender.';
      if (!p.programme) return 'Please select your Ph.D. Programme / Subject.';
      if (!p.specialization?.trim()) return 'Please enter your Specialization / Research Area.';
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

    // STEP 1: Academics & Experience (Sec 3, 4, 5 & 6)
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
        if (!row.year?.trim()) {
          return `Please provide Passing Year for ${row.qualification}.`;
        }
        const yrVal = validateYear(row.year, { isRequired: true, label: `Passing Year for ${row.qualification}` });
        if (!yrVal.valid) {
          return yrVal.error;
        }
        if (!row.percentage?.trim()) {
          return `Please provide % / CGPA for ${row.qualification}.`;
        }
        const pctVal = validatePercentageOrCGPA(row.percentage, {
          isRequired: true,
          label: `% / CGPA for ${row.qualification}`,
        });
        if (!pctVal.valid) {
          return pctVal.error;
        }
      }

      // Check examination year if entered
      const exams = formData.eligibilityExaminations || [];
      for (let i = 0; i < exams.length; i++) {
        const ex = exams[i];
        if (ex.year && ex.year.trim()) {
          const exYrVal = validateYear(ex.year, { minYear: 1970, label: `Exam Year for row ${i + 1} (${ex.examination || 'Examination'})` });
          if (!exYrVal.valid) {
            return exYrVal.error;
          }
        }
      }

      // Check experience From-To if entered
      const exp = formData.professionalExperience || [];
      for (let i = 0; i < exp.length; i++) {
        const item = exp[i];
        if (item.fromTo && item.fromTo.trim()) {
          const ftVal = validateFromTo(item.fromTo);
          if (!ftVal.valid) {
            return `Experience row ${i + 1} (${item.institution || 'Experience'}): ${ftVal.error}`;
          }
        }
      }
    }

    // STEP 2: Research & References (Sec 7 to 11)
    if (currentStep === 2) {
      // Validate publications year if entered
      const pubs = formData.researchPublications || [];
      for (let i = 0; i < pubs.length; i++) {
        const p = pubs[i];
        if (p.year && p.year.trim()) {
          const yRes = validateYear(p.year, { minYear: 1970, label: `Publication Year (row ${i + 1})` });
          if (!yRes.valid) return yRes.error;
        }
      }

      // Validate books/patents year if entered
      const bp = formData.booksPatentsOutputs || [];
      for (let i = 0; i < bp.length; i++) {
        const b = bp[i];
        if (b.year && b.year.trim()) {
          const yRes = validateYear(b.year, { minYear: 1970, label: `Book/Patent Year (row ${i + 1})` });
          if (!yRes.valid) return yRes.error;
        }
      }

      // Validate memberships/awards year if entered
      const mems = formData.membershipsAwards || [];
      for (let i = 0; i < mems.length; i++) {
        const m = mems[i];
        if (m.year && m.year.trim()) {
          const yRes = validateYear(m.year, { minYear: 1970, label: `Award/Membership Year (row ${i + 1})` });
          if (!yRes.valid) return yRes.error;
        }
      }

      // Validate conferences year if entered
      const confs = formData.conferencesWorkshops || [];
      for (let i = 0; i < confs.length; i++) {
        const c = confs[i];
        if (c.year && c.year.trim()) {
          const yRes = validateYear(c.year, { minYear: 1970, label: `Conference Year (row ${i + 1})` });
          if (!yRes.valid) return yRes.error;
        }
      }

      const refs = formData.references;
      if (!refs[0]?.nameDesignation?.trim() || !refs[0]?.institution?.trim() || !refs[0]?.contactEmail?.trim()) {
        return 'Please provide details for at least Referee 1 in Section 11.';
      }
    }

    // STEP 3: Document Uploads (Sec 12)
    if (currentStep === 3) {
      const requiredDocs = ['sscCertificate', 'interCertificate', 'ugDegree', 'pgDegree', 'aadharCard', 'feeReceipt'];
      for (const docKey of requiredDocs) {
        if (!fileObjects[docKey] && !formData.documentMetadata[docKey]) {
          return 'Please upload all mandatory documents (marked with red asterisk *) before proceeding.';
        }
      }
    }

    // STEP 4: Declaration (Sec 13)
    if (currentStep === 4) {
      if (!formData.declaration.accepted) {
        return 'You must agree and check the mandatory declaration before submitting.';
      }
      if (!formData.declaration.place?.trim()) {
        return 'Please enter declaration place.';
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

  const executeExitEditToNew = () => {
    localStorage.removeItem('nriit_phd_applicant_draft');
    setFileObjects({});
    setValidationError('');
    setCurrentStep(0);
    setFormData(getInitialFormData());
    setDraftToast('Exited edit mode. Ready to fill and submit a new candidate application.');
    setTimeout(() => setDraftToast(null), 4000);
    if (onExitEditMode) {
      onExitEditMode();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-2.5 sm:px-4 md:px-6 py-2 sm:py-3">
      {/* Toast message */}
      {draftToast && (
        <div className="fixed top-14 sm:top-16 right-3 sm:right-6 z-50 bg-brand-950 text-white px-3 py-2 rounded-lg shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <span>{draftToast}</span>
        </div>
      )}

      {/* Return to University Portal button */}
      {onBackToPortal && (
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToPortal}
            className="text-xs font-semibold text-brand-800 hover:text-brand-950 hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Back to University Website
          </button>
          <span className="text-[11px] text-slate-500 font-medium">
            Ph.D. Admissions 2026–2027
          </span>
        </div>
      )}

      {/* Edit Mode Active Banner */}
      {isEditMode && (
        <div className="mb-2.5 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
          <div className="space-y-1.5">
            {/* Header row with inline Edit badge, title, and status pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded">
                Edit
              </span>
              <span className="text-xs font-extrabold text-amber-950">
                Editing Submitted Application
              </span>
              <span className="font-mono text-xs font-extrabold text-brand-900 bg-white/90 px-2 py-0.5 rounded border border-amber-200">
                {formData.applicationNumber}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                ✓ OTP Verified
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 pt-0.5 md:pt-0">
            <button
              type="button"
              onClick={() => setShowExitConfirmModal(true)}
              className="w-full md:w-auto px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-900 border border-rose-300 hover:border-rose-400 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Exit edit mode and start a new application for another candidate"
            >
              <span className="text-rose-600 font-extrabold text-sm leading-none">✕</span>
              <span>Exit & Submit New Application</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl sm:rounded-lg border border-slate-200/90 shadow-sm p-3 sm:p-4 mb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-brand-700 uppercase">
              Official Application Form
            </span>
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-brand-950 tracking-tight">
              Biodata of the Candidate for Ph.D. Admission
            </h1>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
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
              className="btn-secondary text-xs px-2.5 py-1 shrink-0"
            >
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* Application Roadmap Design */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100">
          {/* Desktop & Tablet Roadmap Pathway (>= md) */}
          <div className="hidden md:block bg-gradient-to-b from-slate-50/70 via-slate-50/40 to-white rounded-xl border border-slate-200/90 px-3 py-3 lg:px-4 shadow-sm">
            <div className="relative">
              {/* Background Roadmap Line */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-1 bg-slate-200 rounded-full z-0" />
              {/* Active Roadmap Progress Line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 left-[10%] h-1 bg-gradient-to-r from-brand-800 via-brand-600 to-emerald-600 rounded-full z-0 transition-all duration-500"
                style={{
                  width: `${(currentStep / (FORM_STEPS.length - 1)) * 80}%`,
                }}
              />

              {/* 5 Connected Milestone Nodes */}
              <div className="grid grid-cols-5 gap-2 relative z-10">
                {FORM_STEPS.map((step) => {
                  const isCurrent = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  const isClickable = isDone || isCurrent;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      title={`${step.milestone}: ${step.title} (${step.subtitle})`}
                      onClick={() => {
                        if (isClickable) {
                          setValidationError('');
                          setCurrentStep(step.id);
                          window.scrollTo({ top: 80, behavior: 'smooth' });
                        }
                      }}
                      disabled={!isClickable}
                      className={`group flex items-center justify-center focus:outline-none transition-all ${!isClickable ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                    >
                      {/* Milestone Node */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-300 ${isDone
                            ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50 hover:bg-emerald-700'
                            : isCurrent
                              ? 'bg-brand-950 text-white shadow-md ring-4 ring-brand-100 scale-110'
                              : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                          }`}
                      >
                        {isDone ? '✓' : step.stepNumber}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Roadmap Pathway (< md) */}
          <div className="md:hidden bg-gradient-to-b from-slate-50/80 to-white rounded-xl border border-slate-200/90 p-2.5 shadow-sm">
            {/* Connected Route on Mobile */}
            <div className="relative py-1 px-2">
              {/* Background Route Line */}
              <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-1 bg-slate-200 rounded-full z-0" />
              {/* Filled Progress Line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 left-6 h-1 bg-gradient-to-r from-brand-800 via-brand-600 to-emerald-600 rounded-full z-0 transition-all duration-500"
                style={{
                  width: `${(currentStep / (FORM_STEPS.length - 1)) * 100}%`,
                  maxWidth: 'calc(100% - 48px)',
                }}
              />

              {/* 5 Milestone Circles */}
              <div className="flex items-center justify-between relative z-10">
                {FORM_STEPS.map((step) => {
                  const isCurrent = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  const isClickable = isDone || isCurrent;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      title={`${step.milestone}: ${step.title} (${step.subtitle})`}
                      onClick={() => {
                        if (isClickable) {
                          setValidationError('');
                          setCurrentStep(step.id);
                          window.scrollTo({ top: 80, behavior: 'smooth' });
                        }
                      }}
                      disabled={!isClickable}
                      className={`flex flex-col items-center focus:outline-none transition-all ${!isClickable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-100 shadow-sm'
                            : isCurrent
                              ? 'bg-brand-950 text-white ring-4 ring-brand-100 scale-110 shadow-md'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                      >
                        {isDone ? (
                          <span className="text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold">{step.stepNumber}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div className="mb-2.5 p-2.5 bg-red-50 border-l-4 border-red-600 rounded-r text-red-800 text-xs flex items-start gap-1.5">
          <span className="font-bold shrink-0">
            {validationError.toLowerCase().includes('violates') ||
              validationError.toLowerCase().includes('failed') ||
              validationError.toLowerCase().includes('error')
              ? 'Submission Notice:'
              : 'Missing Required Field:'}
          </span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Form Steps Rendering (13 Sections across 5 Steps) */}
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
          <div className="space-y-3">
            <Step2EducationExams formData={formData} setFormData={setFormData} />
            <Step3ExperienceExposure formData={formData} setFormData={setFormData} />
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-3">
            <Step4PublicationsOutputs formData={formData} setFormData={setFormData} />
            <Step5ConferencesReferences formData={formData} setFormData={setFormData} />
          </div>
        )}
        {currentStep === 3 && (
          <Step6Documents
            formData={formData}
            setFormData={setFormData}
            fileObjects={fileObjects}
            setFileObjects={setFileObjects}
          />
        )}
        {currentStep === 4 && (
          <Step7DeclarationReview
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>

      {/* Navigation Controls Bar */}
      <div className="mt-3 bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-lg border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-secondary text-xs px-2.5 sm:px-3 py-1.5"
            >
              <span className="hidden sm:inline">← Previous Section</span>
              <span className="sm:hidden">← Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="btn-secondary text-xs px-2.5 sm:px-3 py-1.5"
          >
            {isSavingDraft ? 'Saving...' : (
              <>
                <span className="hidden sm:inline">Save Draft</span>
                <span className="sm:hidden">Draft</span>
              </>
            )}
          </button>

          {currentStep < FORM_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary text-xs px-3 sm:px-4 py-1.5 font-semibold"
            >
              <span className="hidden sm:inline">Save & Continue →</span>
              <span className="sm:hidden">Next →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmitClick}
              disabled={isSubmitting}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 text-xs px-3.5 sm:px-5 py-1.5 font-bold shadow-sm"
            >
              {isSubmitting ? (
                isEditMode ? 'Updating Application...' : 'Submitting Application...'
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {isEditMode ? 'Save & Update Application ✓' : 'Submit Application Final ✓'}
                  </span>
                  <span className="sm:hidden">
                    {isEditMode ? 'Update ✓' : 'Final Submit ✓'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Final Submission Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-3">
            <h3 className="text-base font-bold text-slate-900 text-center">
              {isEditMode ? 'Confirm Application Update' : 'Confirm Final Ph.D. Application Submission'}
            </h3>
            <p className="text-xs text-slate-500 text-center leading-normal">
              {isEditMode
                ? 'Your revised application details will be saved under your existing official Application Number.'
                : 'Once submitted, your application will receive a permanent Application Number and cannot be modified without OTP verification.'}
            </p>

            <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1 border border-slate-200 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Application No:</span>
                <span className="font-semibold font-mono text-brand-900">{formData.applicationNumber || 'Generated upon submission'}</span>
              </div>
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
                {isEditMode ? 'Yes, Save Updates' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Exit Edit Mode Confirmation Modal (Grid Layout) */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 grid grid-cols-1 gap-3.5">
            {/* Grid Row 1: Header with Warning Icon */}
            <div className="grid grid-cols-[auto_1fr] gap-3 items-center pb-2.5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold shrink-0">
                !
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ph.D. Application Portal Notice
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Candidate Edit Session
                </p>
              </div>
            </div>

            {/* Grid Row 2: Prompt Question */}
            <div className="text-sm font-semibold text-slate-800 leading-snug">
              Exit edit mode and start a new application for another candidate?
            </div>

            {/* Grid Row 3: Warning Message Box */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium grid grid-cols-[auto_1fr] gap-2 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
              <span>Any unsaved changes on this application will be discarded.</span>
            </div>

            {/* Grid Row 4: Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] rounded-lg border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  executeExitEditToNew();
                }}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-[#EC691F] hover:bg-[#d95a14] active:scale-[0.98] rounded-lg shadow-xs transition cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
