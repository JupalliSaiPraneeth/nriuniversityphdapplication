import { describe, it, expect, vi } from 'vitest';
import {
  RESEARCH_DISCIPLINES,
  DEPARTMENT_SYLLABI,
  ENTRANCE_EXAMINATION,
  EXEMPTION_CRITERIA,
  ELIGIBILITY_CRITERIA,
  SUGGESTED_MENU,
} from '../data/portalData';
import { PROGRAMME_OPTIONS, getInitialFormData, hasUserFilledAnyField, validateDOB, validateYear, validateFromTo, validatePercentageOrCGPA } from '../data/initialFormState';
import { dbService } from '../lib/supabase';
import {
  generatePartAResearchSyllabusPDF,
  generateDepartmentSyllabusPDF,
  generateRegulationsSummaryPDF,
} from '../lib/syllabusPdfGenerator';
import { generateApplicationPDF } from '../lib/pdfGenerator';

describe('Ph.D. Portal Redesign & Data Integrity Verification', () => {
  it('1. should include Economics and 11 disciplines in approved research departments', () => {
    expect(RESEARCH_DISCIPLINES.length).toBe(11);
    const econ = RESEARCH_DISCIPLINES.find((d) => d.id === 'econ' || d.code === 'ECON');
    expect(econ).toBeDefined();
    expect(econ.name).toBe('Economics');
    expect(econ.category).toBe('Humanities & Social Sciences');
    expect(econ.researchAreas).toContain('Microeconomic Theory & Behavioral Economics');
    expect(econ.researchAreas).toContain('Macroeconomic Policy, Inflation & Growth Models');
    expect(econ.researchAreas).toContain('Econometric Modeling & Quantitative Economics');
    expect(econ.eligibility).toContain('Economics');
  });

  it('2. should include the updated Ph.D. Programme / Subject options in form PROGRAMME_OPTIONS', () => {
    expect(PROGRAMME_OPTIONS).toContain('CSE & Allied');
    expect(PROGRAMME_OPTIONS).toContain('ECE');
    expect(PROGRAMME_OPTIONS).toContain('Pharm.D');
    expect(PROGRAMME_OPTIONS).toContain('Pharm.D (Post Baccalaureate)');
    expect(PROGRAMME_OPTIONS).toContain('Management');
    expect(PROGRAMME_OPTIONS).toContain('Economics');
    expect(PROGRAMME_OPTIONS).toContain('Allied Health & Paramedical Sciences');
    expect(PROGRAMME_OPTIONS).toContain('Biotechnology / Medical Biotechnology');
    expect(PROGRAMME_OPTIONS).toContain('Agriculture');
    expect(PROGRAMME_OPTIONS.length).toBe(16);
  });

  it('3. should have Department Syllabi configured for all disciplines including Economics', () => {
    expect(DEPARTMENT_SYLLABI.econ).toBeDefined();
    expect(DEPARTMENT_SYLLABI.econ.name).toBe('Economics');
    expect(DEPARTMENT_SYLLABI.econ.code).toBe('ECON');
    expect(DEPARTMENT_SYLLABI.econ.partA).toContain('25 Marks');
    expect(DEPARTMENT_SYLLABI.econ.partB).toContain('50 Marks');
    expect(DEPARTMENT_SYLLABI.cse).toBeDefined();
    expect(DEPARTMENT_SYLLABI.ece).toBeDefined();
    expect(DEPARTMENT_SYLLABI.pharm).toBeDefined();
  });

  it('4. should clearly specify entrance examination duration and 75 marks breakdown', () => {
    expect(ENTRANCE_EXAMINATION.totalDuration).toBe('120 Minutes (2.0 Hours)');
    expect(ENTRANCE_EXAMINATION.totalMarks).toBe(75);
    expect(ENTRANCE_EXAMINATION.pattern.length).toBe(2);

    const partA = ENTRANCE_EXAMINATION.pattern.find((p) => p.component.includes('Part A'));
    const partB = ENTRANCE_EXAMINATION.pattern.find((p) => p.component.includes('Part B'));
    expect(partA.marks).toBe(25);
    expect(partB.marks).toBe(50);
    expect(partA.marks + partB.marks).toBe(75);
    expect(ENTRANCE_EXAMINATION.partACoverage.length).toBeGreaterThan(5);
  });

  it('5. should explicitly list SLET, SET, GPAT, GATE, and NET in exemption criteria', () => {
    const recognizedExams = EXEMPTION_CRITERIA.recognizedExaminations.map((e) => e.exam);
    const examText = recognizedExams.join(' ');
    expect(examText).toContain('SLET');
    expect(examText).toContain('SET');
    expect(examText).toContain('GPAT');
    expect(examText).toContain('GATE');
    expect(examText).toContain('UGC-NET');
    expect(EXEMPTION_CRITERIA.importantNote).toContain('Interview');
  });

  it('6. should specify general and department-specific eligibility criteria under UGC norms', () => {
    expect(ELIGIBILITY_CRITERIA.generalRequirements.length).toBeGreaterThanOrEqual(4);
    const generalText = ELIGIBILITY_CRITERIA.generalRequirements.join(' ');
    expect(generalText).toContain('55%');
    expect(generalText).toContain('50%');
    expect(generalText).toContain('Part-Time');
    expect(generalText).toContain('No Objection Certificate');
  });

  it('7. should remove outdated admin-requirements from website navigation menu and provide streamlined anchors', () => {
    const hrefs = SUGGESTED_MENU.map((m) => m.href);
    expect(hrefs).not.toContain('#admin-requirements');
    expect(hrefs).toContain('#departments');
    expect(hrefs).toContain('#eligibility');
    expect(hrefs).toContain('#selection-exam');
    expect(hrefs).toContain('#part-a-syllabus');
    expect(hrefs).toContain('#part-b-syllabus');
    expect(hrefs).toContain('#apply-online');
  });

  it('8. should successfully generate Part A, Part B Economics, and Regulations PDFs without errors', async () => {
    // Mock doc.save to avoid browser environment downloading during test
    const jsPdfModule = await import('jspdf');
    const originalSave = jsPdfModule.default.prototype.save;
    jsPdfModule.default.prototype.save = vi.fn();

    try {
      await expect(generatePartAResearchSyllabusPDF()).resolves.not.toThrow();

      const econDept = RESEARCH_DISCIPLINES.find((d) => d.id === 'econ');
      await expect(generateDepartmentSyllabusPDF(econDept)).resolves.not.toThrow();

      await expect(generateRegulationsSummaryPDF()).resolves.not.toThrow();
    } finally {
      jsPdfModule.default.prototype.save = originalSave;
    }
  });

  it('9. should consider an application form as a draft ONLY if at least one field is filled', () => {
    // Brand new / untouched initial form state must NOT be considered a draft
    const emptyForm = getInitialFormData();
    expect(hasUserFilledAnyField(emptyForm)).toBe(false);

    // Filling full name -> becomes draft
    const formWithName = getInitialFormData();
    formWithName.personalDetails.fullName = 'Sita Ram';
    expect(hasUserFilledAnyField(formWithName)).toBe(true);

    // Selecting a programme -> becomes draft
    const formWithProgramme = getInitialFormData();
    formWithProgramme.personalDetails.programme = 'Economics';
    expect(hasUserFilledAnyField(formWithProgramme)).toBe(true);

    // Filling educational institution -> becomes draft
    const formWithEdu = getInitialFormData();
    formWithEdu.educationalQualifications[0].institution = 'Delhi University';
    expect(hasUserFilledAnyField(formWithEdu)).toBe(true);

    // Filling permanent address -> becomes draft
    const formWithAddress = getInitialFormData();
    formWithAddress.addressDetails.permanentAddress = 'Plot 45, NRI Layout';
    expect(hasUserFilledAnyField(formWithAddress)).toBe(true);

    // Filling GATE score -> becomes draft
    const formWithExam = getInitialFormData();
    formWithExam.eligibilityExaminations[0].score = '98 percentile';
    expect(hasUserFilledAnyField(formWithExam)).toBe(true);

    // Uploading a document -> becomes draft
    const formWithDoc = getInitialFormData();
    formWithDoc.documentMetadata = { photo: { fileName: 'passport.jpg', uploadedAt: new Date().toISOString() } };
    expect(hasUserFilledAnyField(formWithDoc)).toBe(true);
  });

  it('10. should NOT save empty forms as drafts, and only show non-empty drafts in admin portal queries', async () => {
    // 1. Attempting to save completely blank form returns null and does not register in db
    const emptyForm = getInitialFormData();
    const blankDraftResult = await dbService.saveDraft(emptyForm);
    expect(blankDraftResult).toBeNull();

    // 2. Saving a form with at least one field filled succeeds
    const filledDraftForm = getInitialFormData();
    filledDraftForm.personalDetails.fullName = 'Praneeth Draft Candidate';
    filledDraftForm.personalDetails.email = 'praneeth.draft@example.com';
    filledDraftForm.personalDetails.programme = 'Economics';

    const savedDraft = await dbService.saveDraft(filledDraftForm);
    expect(savedDraft).toBeDefined();
    expect(savedDraft.applicant_name).toBe('Praneeth Draft Candidate');
    expect(savedDraft.status).toBe('draft');

    // 3. Admin applications query should list the filled draft, but never empty drafts
    const adminApps = await dbService.getApplications();
    const foundDraft = adminApps.find((a) => a.id === filledDraftForm.id);
    expect(foundDraft).toBeDefined();
    expect(foundDraft.applicant_name).toBe('Praneeth Draft Candidate');

    // Any drafts in the list MUST satisfy hasUserFilledAnyField
    const allDraftsInAdmin = adminApps.filter((a) => a.status === 'draft');
    expect(allDraftsInAdmin.length).toBeGreaterThan(0);
    for (const draft of allDraftsInAdmin) {
      expect(hasUserFilledAnyField(draft)).toBe(true);
    }
  });

  it('11. should append uploaded documents into the generated application PDF for admin downloads', async () => {
    // 1. Application without enclosures
    const basicApp = {
      id: 'test-app-001',
      application_number: 'NRIIT-PHD-2026-99999',
      applicant_name: 'Aditi Sharma',
      status: 'submitted',
      personal_details: { fullName: 'Aditi Sharma', email: 'aditi@example.com' },
      document_metadata: {},
    };
    const basicDoc = await generateApplicationPDF(basicApp);
    const basicPageCount = basicDoc.internal.getNumberOfPages();
    expect(basicPageCount).toBeGreaterThan(0);

    // 2. Application with uploaded documents (e.g. SSC certificate, Aadhaar card, Fee receipt)
    // Small valid 1x1 transparent PNG dataUrl
    const samplePngDataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const appWithDocs = {
      id: 'test-app-002',
      application_number: 'NRIIT-PHD-2026-88888',
      applicant_name: 'Rahul Verma',
      status: 'submitted',
      personal_details: { fullName: 'Rahul Verma', email: 'rahul@example.com' },
      document_metadata: {
        sscCertificate: {
          fileName: 'ssc_marks_memo.png',
          dataUrl: samplePngDataUrl,
          contentType: 'image/png',
        },
        aadharCard: {
          fileName: 'aadhar_card.png',
          dataUrl: samplePngDataUrl,
          contentType: 'image/png',
        },
        feeReceipt: {
          fileName: 'fee_receipt.png',
          dataUrl: samplePngDataUrl,
          contentType: 'image/png',
        },
      },
    };

    const docWithDocs = await generateApplicationPDF(appWithDocs);
    const docWithDocsPageCount = docWithDocs.internal.getNumberOfPages();

    // The PDF with enclosures should contain Annexure overview page + 3 document pages
    expect(docWithDocsPageCount).toBeGreaterThanOrEqual(basicPageCount + 4);

    // Verify blob and arraybuffer output
    const blob = docWithDocs.output('blob');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);

    const arrayBuffer = docWithDocs.output('arraybuffer');
    expect(arrayBuffer.byteLength).toBeGreaterThan(1000);
  });

  it('12. should validate Date of Birth: reject empty, future dates, and applicants under 20', () => {
    // Empty / missing
    expect(validateDOB('').valid).toBe(false);
    expect(validateDOB(null).valid).toBe(false);

    // Future dates
    expect(validateDOB('2099-12-31').valid).toBe(false);
    expect(validateDOB('2099-12-31').error).toContain('cannot be today or in the future');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    expect(validateDOB(tomorrowStr).valid).toBe(false);
    expect(validateDOB(tomorrowStr).error).toContain('cannot be today or in the future');

    // Recent date (e.g. user screenshot 2026-10-13 where candidate is 0 years old)
    expect(validateDOB('2026-10-13').valid).toBe(false);
    expect(validateDOB('2026-10-13').error).toContain('at least 20 years of age');

    // Under minimum Ph.D. age (e.g. 15 years old)
    const recentYear = new Date().getFullYear() - 15;
    expect(validateDOB(`${recentYear}-01-01`).valid).toBe(false);
    expect(validateDOB(`${recentYear}-01-01`).error).toContain('at least 20 years of age');

    // Valid applicant (e.g. 1998-05-15)
    const validResult = validateDOB('1998-05-15');
    expect(validResult.valid).toBe(true);
    expect(validResult.age).toBeGreaterThanOrEqual(25);
  });

  it('13. should validate Year and From-To duration in table columns', () => {
    // Year validation
    expect(validateYear('', { isRequired: true }).valid).toBe(false);
    expect(validateYear('20', { isRequired: true }).valid).toBe(false);
    expect(validateYear('abc', { isRequired: true }).valid).toBe(false);
    expect(validateYear('2099', { isRequired: true }).valid).toBe(false);
    expect(validateYear('1940', { isRequired: true, minYear: 1950 }).valid).toBe(false);
    expect(validateYear('2022', { isRequired: true }).valid).toBe(true);

    // From-To experience validation
    expect(validateFromTo('', { isRequired: true }).valid).toBe(false);
    expect(validateFromTo('2020').valid).toBe(false);
    expect(validateFromTo('06/2018 - 05/2022').valid).toBe(true);
    expect(validateFromTo('08/2021 – Present').valid).toBe(true);
    expect(validateFromTo('2019 - 2023').valid).toBe(true);
    expect(validateFromTo('06/2024 - 05/2020').valid).toBe(false); // start > end
    expect(validateFromTo('06/2024 - 05/2020').error).toContain('cannot be later');
    expect(validateFromTo('06/2099 - Present').valid).toBe(false); // start in future
    expect(validateFromTo('14/2020 - 05/2022').valid).toBe(false); // invalid month
  });

  it('14. should validate % / CGPA column with percentages, CGPA, and ratio scales', () => {
    // Valid percentage formats
    expect(validatePercentageOrCGPA('82.5%').valid).toBe(true);
    expect(validatePercentageOrCGPA('75').valid).toBe(true);
    expect(validatePercentageOrCGPA('100%').valid).toBe(true);
    expect(validatePercentageOrCGPA('65.4%').valid).toBe(true);

    // Valid CGPA formats
    expect(validatePercentageOrCGPA('8.5').valid).toBe(true);
    expect(validatePercentageOrCGPA('9.2 / 10').valid).toBe(true);
    expect(validatePercentageOrCGPA('8.5/10').valid).toBe(true);
    expect(validatePercentageOrCGPA('8.5 CGPA').valid).toBe(true);
    expect(validatePercentageOrCGPA('3.8/4').valid).toBe(true);
    expect(validatePercentageOrCGPA('750/1000').valid).toBe(true);

    // Invalid formats
    expect(validatePercentageOrCGPA('', { isRequired: true }).valid).toBe(false);
    expect(validatePercentageOrCGPA('105%').valid).toBe(false);
    expect(validatePercentageOrCGPA('150').valid).toBe(false);
    expect(validatePercentageOrCGPA('-5%').valid).toBe(false);
    expect(validatePercentageOrCGPA('abc').valid).toBe(false);
    expect(validatePercentageOrCGPA('11/10').valid).toBe(false);
    expect(validatePercentageOrCGPA('15').valid).toBe(false); // between 10 and 30
    expect(validatePercentageOrCGPA('1.5').valid).toBe(false); // below 3.0
  });
});

