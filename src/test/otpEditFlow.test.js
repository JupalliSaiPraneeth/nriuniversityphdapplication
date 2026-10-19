import { describe, it, expect, beforeEach } from 'vitest';
import { otpService } from '../lib/otpService';
import { dbService } from '../lib/supabase';
import { getInitialFormData, mapRecordToFormData } from '../data/initialFormState';

describe('Edit Application via Email OTP Verification Flow', () => {
  const testEmail = `candidate_${Date.now()}@testnriit.edu.in`;
  let submittedApp;

  beforeEach(async () => {
    // Create and submit a mock application with testEmail
    const form = getInitialFormData();
    form.personalDetails.fullName = 'Dr. Test Candidate';
    form.personalDetails.email = testEmail;
    form.personalDetails.programme = 'Computer Science & Engineering';
    form.personalDetails.admissionCategory = 'Full-Time';
    form.declaration.accepted = true;
    form.declaration.place = 'Vijayawada';
    form.declaration.date = '2026-10-19';

    submittedApp = await dbService.submitApplication(form);
  });

  it('rejects OTP request for non-existent or invalid emails', async () => {
    const invalidFormat = await otpService.requestOTP('invalid-email');
    expect(invalidFormat.success).toBe(false);

    const nonExistent = await otpService.requestOTP('nobody@nowhere.com');
    expect(nonExistent.success).toBe(false);
    expect(nonExistent.error).toContain('No submitted Ph.D. application');
  });

  it('generates a 6-digit OTP for a valid registered email', async () => {
    const res = await otpService.requestOTP(testEmail);
    expect(res.success).toBe(true);
    expect(res.code).toBeDefined();
    expect(res.code).toHaveLength(6);
    expect(/^\d{6}$/.test(res.code)).toBe(true);
  });

  it('rejects incorrect OTP and accepts valid OTP', async () => {
    const otpRes = await otpService.requestOTP(testEmail);
    expect(otpRes.success).toBe(true);

    // Try incorrect code
    const failRes = await otpService.verifyOTP(testEmail, '000000');
    expect(failRes.success).toBe(false);
    expect(failRes.error).toContain('Incorrect verification code');

    // Try correct code
    const successRes = await otpService.verifyOTP(testEmail, otpRes.code);
    expect(successRes.success).toBe(true);
    expect(successRes.application).toBeDefined();
    expect(successRes.application.application_number).toBe(submittedApp.application_number);
  });

  it('correctly maps application record back to form state for editing', () => {
    const mapped = mapRecordToFormData(submittedApp);
    expect(mapped.id).toBe(submittedApp.id);
    expect(mapped.applicationNumber).toBe(submittedApp.application_number);
    expect(mapped.personalDetails.fullName).toBe('Dr. Test Candidate');
    expect(mapped.personalDetails.email).toBe(testEmail);
    expect(mapped.personalDetails.programme).toBe('Computer Science & Engineering');
  });

  it('preserves official application number upon resubmitting an edited application', async () => {
    const mapped = mapRecordToFormData(submittedApp);
    mapped.personalDetails.fullName = 'Dr. Test Candidate Updated';
    mapped.personalDetails.specialization = 'Deep Learning & Artificial Intelligence';

    const updatedApp = await dbService.submitApplication(mapped);
    expect(updatedApp.id).toBe(submittedApp.id);
    expect(updatedApp.application_number).toBe(submittedApp.application_number);
    expect(updatedApp.personal_details.fullName).toBe('Dr. Test Candidate Updated');
    expect(updatedApp.personal_details.specialization).toBe('Deep Learning & Artificial Intelligence');
  });

  it('allows exiting edit mode to start a fresh application for a new user with new application number', () => {
    // 1. Initial mapped data from existing application
    const editingData = mapRecordToFormData(submittedApp);
    expect(editingData.applicationNumber).toBe(submittedApp.application_number);
    expect(editingData.personalDetails.fullName).toBe('Dr. Test Candidate');

    // 2. Exiting edit mode produces fresh clean form data
    const freshFormData = getInitialFormData();
    expect(freshFormData.id).not.toBe(submittedApp.id);
    expect(freshFormData.applicationNumber).toBe('');
    expect(freshFormData.applicationNumber).not.toBe(submittedApp.application_number);
    expect(freshFormData.personalDetails.fullName).toBe('');
    expect(freshFormData.personalDetails.email).toBe('');
    expect(freshFormData.declaration.accepted).toBe(false);
  });
});
