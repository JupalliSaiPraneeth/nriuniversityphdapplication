import { describe, it, expect, beforeEach } from 'vitest';
import { generateApplicationNumber, dbService } from '../lib/supabase';

describe('Database and Security Service', () => {
  beforeEach(() => {
    // Clear mock localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should generate secure and correctly formatted application numbers', () => {
    const currentYear = new Date().getFullYear();
    const appNum = generateApplicationNumber();

    expect(appNum).toMatch(new RegExp(`^NRIIT-PHD-${currentYear}-\\d{4}$`));

    // Verify randomness/uniqueness across multiple generations
    const set = new Set();
    for (let i = 0; i < 50; i++) {
      set.add(generateApplicationNumber());
    }
    // High probability of distinct numbers
    expect(set.size).toBeGreaterThan(45);
  });

  it('should submit an application, assign an application number and retrieve it', async () => {
    const mockFormData = {
      personalDetails: {
        fullName: 'Dr. Test Candidate',
        email: 'test.candidate@example.com',
        mobileNumber: '9876543210',
        programme: 'Computer Science and Engineering (CSE)',
        specialization: 'Artificial Intelligence',
        admissionCategory: 'Full-Time',
      },
      addressDetails: {
        permanentAddress: '12-34 NRI Road',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        pinCode: '521212',
      },
      educationalQualifications: [
        { qualification: 'B.Tech', institution: 'NRIIT', year: '2020', percentage: '85%' },
        { qualification: 'M.Tech', institution: 'JNTUK', year: '2022', percentage: '88%' },
      ],
      declaration: {
        accepted: true,
        place: 'Vijayawada',
        typedSignature: 'Dr. Test Candidate',
      },
    };

    const record = await dbService.submitApplication(mockFormData);
    expect(record).toBeDefined();
    expect(record.application_number).toMatch(/^NRIIT-PHD-/);
    expect(record.status).toBe('submitted');
    expect(record.applicant_name).toBe('Dr. Test Candidate');

    // Retrieve the application
    const retrieved = await dbService.getApplication(record.id);
    expect(retrieved).toBeDefined();
    expect(retrieved.application_number).toBe(record.application_number);
  });

  it('should allow administrators to update application status and reviewer notes', async () => {
    const mockFormData = {
      personalDetails: {
        fullName: 'Review Candidate',
        email: 'review@example.com',
      },
    };

    const record = await dbService.submitApplication(mockFormData);
    expect(record.status).toBe('submitted');

    // Update to approved
    const updated = await dbService.updateApplicationStatus(
      record.id,
      'approved',
      'Recommended by DRC for interview',
      'admin-id-123'
    );

    expect(updated.status).toBe('approved');
    expect(updated.reviewer_notes).toBe('Recommended by DRC for interview');
  });

  it('should allow administrators to permanently delete an application', async () => {
    const mockFormData = {
      personalDetails: {
        fullName: 'To Be Deleted Candidate',
        email: 'delete.me@example.com',
      },
    };

    const record = await dbService.submitApplication(mockFormData);
    expect(record).toBeDefined();

    const retrievedBefore = await dbService.getApplication(record.id);
    expect(retrievedBefore).toBeDefined();

    // Execute delete
    const result = await dbService.deleteApplication(record.id);
    expect(result).toBe(true);

    // Verify it is gone
    const retrievedAfter = await dbService.getApplication(record.id);
    expect(retrievedAfter).toBeNull();
  });
});
