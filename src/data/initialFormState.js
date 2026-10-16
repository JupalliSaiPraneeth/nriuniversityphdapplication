export const PROGRAMME_OPTIONS = [
  'Computer Science and Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Master of Business Administration (MBA)',
  'Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Pharmacy',
  'English',
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
    modeOfAdmission: 'Regular / Entrance Examination',
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
  if (pd.modeOfAdmission && pd.modeOfAdmission !== 'Regular / Entrance Examination') return true;

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

