import { describe, it, expect, vi } from 'vitest';
import {
  RESEARCH_DISCIPLINES,
  DEPARTMENT_SYLLABI,
  ENTRANCE_EXAMINATION,
  EXEMPTION_CRITERIA,
  ELIGIBILITY_CRITERIA,
  SUGGESTED_MENU,
} from '../data/portalData';
import { PROGRAMME_OPTIONS, getInitialFormData, hasUserFilledAnyField } from '../data/initialFormState';
import { dbService } from '../lib/supabase';
import {
  generatePartAResearchSyllabusPDF,
  generateDepartmentSyllabusPDF,
  generateRegulationsSummaryPDF,
} from '../lib/syllabusPdfGenerator';

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

  it('2. should include Economics and Pharmacy in form PROGRAMME_OPTIONS for applicant registration', () => {
    expect(PROGRAMME_OPTIONS).toContain('Economics');
    expect(PROGRAMME_OPTIONS).toContain('Pharmacy');
    expect(PROGRAMME_OPTIONS).toContain('Computer Science and Engineering (CSE)');
    expect(PROGRAMME_OPTIONS).toContain('Master of Business Administration (MBA)');
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
});
