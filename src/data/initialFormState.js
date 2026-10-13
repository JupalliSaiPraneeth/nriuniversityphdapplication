export const PROGRAMME_OPTIONS = [
  'Computer Science and Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Master of Business Administration (MBA)',
  'Mathematics',
  'Physics',
  'Chemistry',
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
