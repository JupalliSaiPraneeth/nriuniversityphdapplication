export const PROGRAMME_OPTIONS = [
  'CSE & Allied',
  'ECE',
  'EEE',
  'Civil',
  'Mechanical',
  'Pharm.D',
  'Pharm.D (Post Baccalaureate)',
  'Physics',
  'Chemistry',
  'Maths',
  'English',
  'Management',
  'Economics',
  'Allied Health & Paramedical Sciences',
  'Biotechnology / Medical Biotechnology',
  'Agriculture',
];

export const ADMISSION_CATEGORIES = [
  'Full-Time',
  'Part-Time (Internal / Faculty)',
  'Part-Time (External / Industry / Sponsored)',
];

export const MODE_OF_ADMISSION = [
  'Regular / Entrance Examination',
  'Direct Interview (GATE / NET / JRF Qualified)',
  'Sponsored Candidate',
  'NRI / International',
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Transgender', 'Prefer not to say'];

export const CATEGORY_OPTIONS = ['General / OC', 'OBC', 'SC', 'ST', 'EWS', 'Differently Abled (PwD)'];

export const EXAMINATION_OPTIONS = [
  'UGC-NET',
  'UGC-JRF',
  'CSIR-NET',
  'CSIR-JRF',
  'GATE',
  'SLET',
  'SET (APSET/TSSET)',
  'JEST',
  'GPAT',
  'Other State/National Exam',
];

export const OUTPUT_TYPE_OPTIONS = [
  'Book (Authored/Edited)',
  'Book Chapter',
  'Patent Granted',
  'Patent Published',
  'Copyright / Software',
  'Other Research Output',
];

export const DOCUMENT_SPECS = [
  { key: 'photo', label: '1. Recent Passport Size Photograph', required: true, accept: 'image/jpeg,image/png,image/webp', desc: 'Recent photograph with clear face view (JPEG, PNG, max 3MB)' },
  { key: 'sscCertificate', label: '2. 10th / SSC Certificate (Date of Birth Proof)', required: true, accept: '.pdf,image/*', desc: 'SSC / Matriculation marklist or certificate' },
  { key: 'interCertificate', label: '3. Intermediate / 10+2 / Diploma Certificate', required: true, accept: '.pdf,image/*', desc: 'Class 12 / Higher Secondary certificate' },
  { key: 'ugDegree', label: "4. Bachelor's Degree & Consolidated Marksheets", required: true, accept: '.pdf,image/*', desc: 'B.Tech / B.E. / B.Sc provisional/original degree and transcripts' },
  { key: 'pgDegree', label: "5. Master's Degree & Consolidated Marksheets", required: true, accept: '.pdf,image/*', desc: 'M.Tech / M.E. / M.Sc / MCA / MBA provisional/degree and transcripts' },
  { key: 'expCertificates', label: '6. All Experience Certificate(s) (if applicable)', required: false, accept: '.pdf,image/*', desc: 'Service certificates from past or present employers' },
  { key: 'examCard', label: '7. GATE / SLET / SET / NET / JRF / GPAT Score Card', required: false, accept: '.pdf,image/*', desc: 'Valid score/qualification certificate if applicable' },
  { key: 'categoryCertificate', label: '8. Category Certificate (SC/ST/OBC/EWS - if applicable)', required: false, accept: '.pdf,image/*', desc: 'Caste / Community / Income certificate issued by competent authority' },
  { key: 'aadharCard', label: '9. Aadhaar Card (Identity Proof)', required: true, accept: '.pdf,image/*', desc: 'Government-issued Aadhaar identity card' },
  { key: 'feeReceipt', label: '10. Application Fee Payment - Transaction Slip', required: true, accept: '.pdf,image/*', desc: 'Payment receipt / UTR transaction slip of admission application fee' },
];

export const createInitialEducationRows = () => [
  { qualification: '10th / SSC', specialization: 'General', institution: '', year: '', percentage: '' },
  { qualification: 'Intermediate / 10+2', specialization: 'MPC / Science', institution: '', year: '', percentage: '' },
  { qualification: "Bachelor's Degree (UG)", specialization: '', institution: '', year: '', percentage: '' },
  { qualification: "Master's Degree (PG)", specialization: '', institution: '', year: '', percentage: '' },
];

export const createInitialExamRows = () => [
  { examination: 'GATE', subject: '', year: '', score: '', qualification: '' },
  { examination: 'UGC-NET / CSIR-NET', subject: '', year: '', score: '', qualification: '' },
  { examination: '', subject: '', year: '', score: '', qualification: '' },
];

export const createInitialExperienceRows = () => [
  { institution: '', designation: '', fromTo: '', natureOfWork: '', totalExperience: '' },
  { institution: '', designation: '', fromTo: '', natureOfWork: '', totalExperience: '' },
  { institution: '', designation: '', fromTo: '', natureOfWork: '', totalExperience: '' },
  { institution: '', designation: '', fromTo: '', natureOfWork: '', totalExperience: '' },
  { institution: '', designation: '', fromTo: '', natureOfWork: '', totalExperience: '' },
];

export const createInitialPublicationRows = () => [
  { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
  { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
  { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
  { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
  { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
  { titleAuthor: '', journalConference: '', year: '', indexingQuartile: '', doi: '' },
];

export const createInitialBooksPatentsRows = () => [
  { type: 'Book Chapter', titleDetails: '', year: '', isbnPatentNo: '' },
  { type: 'Patent Published', titleDetails: '', year: '', isbnPatentNo: '' },
  { type: '', titleDetails: '', year: '', isbnPatentNo: '' },
  { type: '', titleDetails: '', year: '', isbnPatentNo: '' },
];

export const createInitialMembershipsRows = () => [
  { awardMembership: '', organization: '', year: '', details: '' },
  { awardMembership: '', organization: '', year: '', details: '' },
  { awardMembership: '', organization: '', year: '', details: '' },
  { awardMembership: '', organization: '', year: '', details: '' },
];

export const createInitialConferencesRows = () => [
  { programme: '', organizer: '', year: '', roleParticipation: '' },
  { programme: '', organizer: '', year: '', roleParticipation: '' },
  { programme: '', organizer: '', year: '', roleParticipation: '' },
  { programme: '', organizer: '', year: '', roleParticipation: '' },
  { programme: '', organizer: '', year: '', roleParticipation: '' },
];

export const createInitialReferenceRows = () => [
  { nameDesignation: '', institution: '', contactEmail: '' },
  { nameDesignation: '', institution: '', contactEmail: '' },
];

export const getInitialFormData = () => ({
  id: crypto.randomUUID ? crypto.randomUUID() : `app_${Date.now()}`,
  applicationNumber: '',
  personalDetails: {
    programme: '',
    specialization: '',
    admissionCategory: 'Full-Time',
    modeOfAdmission: '',
    fullName: '',
    guardianName: '',
    dateOfBirth: '',
    gender: '',
    category: 'General / OC',
    email: '',
    mobileNumber: '',
    emergencyContact: '',
    photoDataUrl: '',
  },
  addressDetails: {
    permanentAddress: '',
    presentAddress: '',
    sameAsPermanent: false,
    district: '',
    state: 'Andhra Pradesh',
    pinCode: '',
  },
  educationalQualifications: createInitialEducationRows(),
  eligibilityExaminations: createInitialExamRows(),
  professionalExperience: createInitialExperienceRows(),
  researchExposure: '',
  researchPublications: createInitialPublicationRows(),
  booksPatentsOutputs: createInitialBooksPatentsRows(),
  membershipsAwards: createInitialMembershipsRows(),
  conferencesWorkshops: createInitialConferencesRows(),
  references: createInitialReferenceRows(),
  documentMetadata: {},
  declaration: {
    accepted: false,
    place: 'Vijayawada',
    date: new Date().toISOString().slice(0, 10),
    typedSignature: '',
  },
});

/**
 * Checks if the user has actively filled at least one field in the application form.
 * Ignores default values (like 'Full-Time', 'Andhra Pradesh', pre-populated qualification labels, etc.)
 * Supports both nested frontend formData and flattened/database application records.
 */
export const hasUserFilledAnyField = (data) => {
  if (!data || typeof data !== 'object') return false;

  const pd = data.personalDetails || data.personal_details || {};
  const ad = data.addressDetails || data.address_details || {};
  const edu = data.educationalQualifications || data.educational_qualifications || [];
  const exams = data.eligibilityExaminations || data.eligibility_examinations || [];
  const exp = data.professionalExperience || data.professional_experience || [];
  const pubs = data.researchPublications || data.research_publications || [];
  const books = data.booksPatentsOutputs || data.books_patents_outputs || [];
  const awards = data.membershipsAwards || data.memberships_awards || [];
  const confs = data.conferencesWorkshops || data.conferences_workshops || [];
  const refs = data.references || data.references_data || [];
  const dec = data.declaration || {};
  const docs = data.documentMetadata || data.document_metadata || {};

  // Top level fields if present on db record
  if (data.programme && String(data.programme).trim()) return true;
  if (data.specialization && String(data.specialization).trim()) return true;
  if (
    data.applicant_name &&
    String(data.applicant_name).trim() &&
    String(data.applicant_name).trim().toLowerCase() !== 'draft applicant'
  ) {
    return true;
  }
  if (data.applicant_email && String(data.applicant_email).trim()) return true;
  if (data.applicant_phone && String(data.applicant_phone).trim()) return true;

  // Personal details
  if (pd.programme && String(pd.programme).trim()) return true;
  if (pd.specialization && String(pd.specialization).trim()) return true;
  if (
    pd.fullName &&
    String(pd.fullName).trim() &&
    String(pd.fullName).trim().toLowerCase() !== 'draft applicant'
  ) {
    return true;
  }
  if (pd.guardianName && String(pd.guardianName).trim()) return true;
  if (pd.dateOfBirth && String(pd.dateOfBirth).trim()) return true;
  if (pd.gender && String(pd.gender).trim()) return true;
  if (pd.email && String(pd.email).trim()) return true;
  if (pd.mobileNumber && String(pd.mobileNumber).trim()) return true;
  if (pd.emergencyContact && String(pd.emergencyContact).trim()) return true;
  if (pd.photoDataUrl && String(pd.photoDataUrl).trim()) return true;
  if (pd.category && pd.category !== 'General / OC') return true;
  if (pd.admissionCategory && pd.admissionCategory !== 'Full-Time') return true;

  // Address details
  if (ad.permanentAddress && String(ad.permanentAddress).trim()) return true;
  if (ad.presentAddress && String(ad.presentAddress).trim()) return true;
  if (ad.district && String(ad.district).trim()) return true;
  if (ad.pinCode && String(ad.pinCode).trim()) return true;
  if (ad.state && String(ad.state).trim() && ad.state !== 'Andhra Pradesh') return true;

  // Education: check if institution, year, percentage or user-specified specialization are filled
  if (Array.isArray(edu)) {
    const hasEdu = edu.some((q, idx) => {
      if (q.institution && String(q.institution).trim()) return true;
      if (q.year && String(q.year).trim()) return true;
      if (q.percentage && String(q.percentage).trim()) return true;
      // UG / PG rows specialization
      if (idx >= 2 && q.specialization && String(q.specialization).trim()) return true;
      // Custom rows added by candidate
      if (idx > 3 && (q.qualification?.trim() || q.specialization?.trim())) return true;
      return false;
    });
    if (hasEdu) return true;
  }

  // Examinations
  if (Array.isArray(exams)) {
    const hasExam = exams.some((ex, idx) => {
      if (ex.subject && String(ex.subject).trim()) return true;
      if (ex.year && String(ex.year).trim()) return true;
      if (ex.score && String(ex.score).trim()) return true;
      if (ex.qualification && String(ex.qualification).trim()) return true;
      if (idx > 1 && ex.examination && String(ex.examination).trim()) return true;
      return false;
    });
    if (hasExam) return true;
  }

  // Experience
  if (Array.isArray(exp)) {
    const hasExp = exp.some(
      (e) =>
        (e.institution && String(e.institution).trim()) ||
        (e.designation && String(e.designation).trim()) ||
        (e.fromTo && String(e.fromTo).trim()) ||
        (e.natureOfWork && String(e.natureOfWork).trim()) ||
        (e.totalExperience && String(e.totalExperience).trim())
    );
    if (hasExp) return true;
  }

  // Research exposure
  const researchExposure = data.researchExposure || data.research_exposure;
  if (researchExposure && String(researchExposure).trim()) return true;

  // Publications
  if (Array.isArray(pubs)) {
    const hasPub = pubs.some(
      (p) =>
        (p.titleAuthor && String(p.titleAuthor).trim()) ||
        (p.journalConference && String(p.journalConference).trim()) ||
        (p.year && String(p.year).trim()) ||
        (p.indexingQuartile && String(p.indexingQuartile).trim()) ||
        (p.doi && String(p.doi).trim())
    );
    if (hasPub) return true;
  }

  // Books / Patents
  if (Array.isArray(books)) {
    const hasBook = books.some(
      (b) =>
        (b.titleDetails && String(b.titleDetails).trim()) ||
        (b.year && String(b.year).trim()) ||
        (b.isbnPatentNo && String(b.isbnPatentNo).trim())
    );
    if (hasBook) return true;
  }

  // Memberships
  if (Array.isArray(awards)) {
    const hasAward = awards.some(
      (a) =>
        (a.awardMembership && String(a.awardMembership).trim()) ||
        (a.organization && String(a.organization).trim()) ||
        (a.year && String(a.year).trim()) ||
        (a.details && String(a.details).trim())
    );
    if (hasAward) return true;
  }

  // Conferences
  if (Array.isArray(confs)) {
    const hasConf = confs.some(
      (c) =>
        (c.programme && String(c.programme).trim()) ||
        (c.organizer && String(c.organizer).trim()) ||
        (c.year && String(c.year).trim()) ||
        (c.roleParticipation && String(c.roleParticipation).trim())
    );
    if (hasConf) return true;
  }

  // References
  if (Array.isArray(refs)) {
    const hasRef = refs.some(
      (r) =>
        (r.nameDesignation && String(r.nameDesignation).trim()) ||
        (r.institution && String(r.institution).trim()) ||
        (r.contactEmail && String(r.contactEmail).trim())
    );
    if (hasRef) return true;
  }

  // Documents uploaded
  if (docs && typeof docs === 'object' && Object.keys(docs).length > 0) return true;

  // Declaration
  if (dec.typedSignature && String(dec.typedSignature).trim()) return true;
  if (dec.accepted === true) return true;

  return false;
};

export const validateDOB = (dobString) => {
  if (!dobString || !String(dobString).trim()) {
    return { valid: false, error: 'Please provide date of birth.' };
  }
  const parts = String(dobString).trim().split('-');
  if (parts.length !== 3) {
    return { valid: false, error: 'Please enter a valid date of birth.' };
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dob = new Date(year, month, day);
  if (isNaN(dob.getTime()) || dob.getFullYear() !== year || dob.getMonth() !== month || dob.getDate() !== day) {
    return { valid: false, error: 'Please enter a valid calendar date.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dob >= today) {
    return { valid: false, error: 'Date of birth cannot be today or in the future.' };
  }

  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - month;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }

  if (age < 20) {
    return {
      valid: false,
      age,
      error: `Candidate must be at least 20 years of age for Ph.D. admission (current age: ${age} years).`,
    };
  }

  if (age > 100) {
    return { valid: false, error: 'Please enter a valid date of birth.' };
  }

  return { valid: true, age };
};

export const validateYear = (
  yearStr,
  { minYear = 1950, maxYear = new Date().getFullYear(), isRequired = false, label = 'Year' } = {}
) => {
  if (!yearStr || !String(yearStr).trim()) {
    return isRequired ? { valid: false, error: `${label} is required.` } : { valid: true };
  }
  const clean = String(yearStr).trim();
  if (!/^\d{4}$/.test(clean)) {
    return { valid: false, error: `${label} must be a 4-digit number (e.g. 2022).` };
  }
  const y = parseInt(clean, 10);
  if (y > maxYear) {
    return { valid: false, error: `${label} cannot be in the future (max: ${maxYear}).` };
  }
  if (y < minYear) {
    return { valid: false, error: `${label} cannot be earlier than ${minYear}.` };
  }
  return { valid: true, year: y };
};

export const validateFromTo = (fromToStr, { isRequired = false } = {}) => {
  if (!fromToStr || !String(fromToStr).trim()) {
    return isRequired ? { valid: false, error: 'Duration (From–To) is required.' } : { valid: true };
  }
  const s = String(fromToStr).trim();
  const parts = s.split(/[\–\—\-]|\bto\b/i).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) {
    return { valid: false, error: 'Format must be: MM/YYYY – MM/YYYY or MM/YYYY – Present' };
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const parsePart = (str) => {
    if (/^(present|till\s*date|now|current|continuing)$/i.test(str)) {
      return { isPresent: true, year: currentYear, month: currentMonth };
    }
    const mmYyyy = str.match(/^(\d{1,2})[\/\-\.](\d{4})$/);
    if (mmYyyy) {
      const month = parseInt(mmYyyy[1], 10);
      const year = parseInt(mmYyyy[2], 10);
      if (month < 1 || month > 12) return { error: `Invalid month '${mmYyyy[1]}'` };
      return { year, month };
    }
    const yyyy = str.match(/^(\d{4})$/);
    if (yyyy) {
      return { year: parseInt(yyyy[1], 10), month: 1 };
    }
    return { error: `Invalid date '${str}'. Use MM/YYYY or YYYY.` };
  };

  const start = parsePart(parts[0]);
  if (start.error) return { valid: false, error: start.error };

  const end = parsePart(parts[1]);
  if (end.error) return { valid: false, error: end.error };

  if (start.year > currentYear) {
    return { valid: false, error: `Start year cannot be in the future (${start.year}).` };
  }
  if (!end.isPresent && end.year > currentYear) {
    return { valid: false, error: `End year cannot be in the future (${end.year}).` };
  }
  if (start.year < 1960) {
    return { valid: false, error: 'Start year cannot be earlier than 1960.' };
  }

  const startVal = start.year * 12 + start.month;
  const endVal = end.year * 12 + end.month;
  if (startVal > endVal) {
    return { valid: false, error: 'Start date cannot be later than end date.' };
  }

  return { valid: true };
};

export const validatePercentageOrCGPA = (
  val,
  { isRequired = false, label = '% / CGPA' } = {}
) => {
  if (!val || !String(val).trim()) {
    return isRequired ? { valid: false, error: `${label} is required.` } : { valid: true };
  }
  const clean = String(val).trim();

  // Check ratio / fraction format (e.g. 8.5/10, 750/1000, 3.8/4)
  const ratioMatch = clean.match(/^(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    const num = parseFloat(ratioMatch[1]);
    const den = parseFloat(ratioMatch[2]);
    if (isNaN(num) || isNaN(den) || den <= 0) {
      return { valid: false, error: `${label} contains an invalid scale.` };
    }
    if (num > den) {
      return { valid: false, error: `${label} cannot exceed maximum scale (${num} > ${den}).` };
    }
    if (num < 0) {
      return { valid: false, error: `${label} cannot be negative.` };
    }
    const equiv = (num / den) * 100;
    if (equiv < 30) {
      return { valid: false, error: `${label} (${num}/${den} = ${equiv.toFixed(1)}%) is below minimum eligible score.` };
    }
    return { valid: true, value: num, scale: den, percentage: equiv };
  }

  // Remove trailing %, cgpa, gpa, marks, grade
  const sanitized = clean
    .replace(/%/g, '')
    .replace(/\b(cgpa|gpa|marks|grade)\b/gi, '')
    .trim();

  if (!/^\d+(\.\d+)?$/.test(sanitized)) {
    return { valid: false, error: `${label} must be a valid number (e.g. 82.5% or 8.5 CGPA).` };
  }

  const num = parseFloat(sanitized);
  if (isNaN(num) || num < 0) {
    return { valid: false, error: `${label} cannot be negative.` };
  }
  if (num > 100) {
    return { valid: false, error: `${label} cannot exceed 100%.` };
  }
  if (num < 3.0) {
    return { valid: false, error: `${label} is too low. For CGPA enter ≥ 3.0; for percentage enter ≥ 35%.` };
  }
  if (num > 10.0 && num < 30.0) {
    return { valid: false, error: `${label} must be either a CGPA (up to 10.0) or percentage (30%–100%).` };
  }

  return { valid: true, value: num };
};

/**
 * Maps a database or stored application record back into form state for editing.
 */
export const mapRecordToFormData = (record) => {
  if (!record) return getInitialFormData();
  const init = getInitialFormData();

  const pd = record.personalDetails || record.personal_details || {};
  const ad = record.addressDetails || record.address_details || {};

  return {
    ...init,
    id: record.id || init.id,
    applicationNumber: record.application_number || record.applicationNumber || '',
    createdAt: record.created_at || record.createdAt,
    submittedAt: record.submitted_at || record.submittedAt,
    status: record.status || 'submitted',
    personalDetails: {
      ...init.personalDetails,
      ...pd,
      fullName: pd.fullName || record.applicant_name || init.personalDetails.fullName,
      email: pd.email || record.applicant_email || init.personalDetails.email,
      mobileNumber: pd.mobileNumber || record.applicant_phone || init.personalDetails.mobileNumber,
      programme: pd.programme || record.programme || init.personalDetails.programme,
      specialization: pd.specialization || record.specialization || init.personalDetails.specialization,
      admissionCategory: pd.admissionCategory || record.admission_category || init.personalDetails.admissionCategory,
    },
    addressDetails: {
      ...init.addressDetails,
      ...ad,
    },
    educationalQualifications:
      (record.educational_qualifications && record.educational_qualifications.length > 0)
        ? record.educational_qualifications
        : (record.educationalQualifications && record.educationalQualifications.length > 0)
        ? record.educationalQualifications
        : init.educationalQualifications,
    eligibilityExaminations:
      (record.eligibility_examinations && record.eligibility_examinations.length > 0)
        ? record.eligibility_examinations
        : (record.eligibilityExaminations && record.eligibilityExaminations.length > 0)
        ? record.eligibilityExaminations
        : init.eligibilityExaminations,
    professionalExperience:
      (record.professional_experience && record.professional_experience.length > 0)
        ? record.professional_experience
        : (record.professionalExperience && record.professionalExperience.length > 0)
        ? record.professionalExperience
        : init.professionalExperience,
    researchExposure: record.research_exposure || record.researchExposure || '',
    researchPublications:
      (record.research_publications && record.research_publications.length > 0)
        ? record.research_publications
        : (record.researchPublications && record.researchPublications.length > 0)
        ? record.researchPublications
        : init.researchPublications,
    booksPatentsOutputs:
      (record.books_patents_outputs && record.booksPatentsOutputs?.length > 0)
        ? record.books_patents_outputs
        : (record.booksPatentsOutputs && record.booksPatentsOutputs.length > 0)
        ? record.booksPatentsOutputs
        : init.booksPatentsOutputs,
    membershipsAwards:
      (record.memberships_awards && record.memberships_awards.length > 0)
        ? record.memberships_awards
        : (record.membershipsAwards && record.membershipsAwards.length > 0)
        ? record.membershipsAwards
        : init.membershipsAwards,
    conferencesWorkshops:
      (record.conferences_workshops && record.conferences_workshops.length > 0)
        ? record.conferences_workshops
        : (record.conferencesWorkshops && record.conferencesWorkshops.length > 0)
        ? record.conferencesWorkshops
        : init.conferencesWorkshops,
    references:
      (record.references_data && record.references_data.length > 0)
        ? record.references_data
        : (record.references && record.references.length > 0)
        ? record.references
        : init.references,
    documentMetadata: record.document_metadata || record.documentMetadata || {},
    declaration: {
      ...init.declaration,
      ...(record.declaration || {}),
      accepted: true,
    },
  };
};

