/**
 * Official Admissions & Academic Data for Dr. RVR NRIIT (Deemed to be University)
 * Ph.D. Admissions 2026–2027 Portal
 * 
 * Content faithfully structured to match the 15 official sections with
 * exact UI/UX design tokens inspired by https://rvrnriuniversity.edu.in/
 */

// 1. Home Page & University Info
export const UNIVERSITY_INFO = {
  name: 'Dr. RVR NRIIT (Deemed to be University)',
  fullName: 'Dr. RVR NRI INSTITUTE OF TECHNOLOGY',
  subText: '(An Institution deemed to be University u/s 3 of UGC Act, 1956)',
  tagline: 'Research • Innovation • Interdisciplinary Excellence',
  programmeTitle: 'Ph.D. Admissions 2026–2027',
  academicYear: '2026–2027',
  introParagraph:
    'Applications are invited from eligible candidates for admission to the Doctor of Philosophy (Ph.D.) programme for the academic year 2026–2027 in the disciplines offered by the University, subject to the availability of recognized research supervisors and approved research facilities.',
  address: 'Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, Eluru District, Andhra Pradesh – 521212',
  email: 'deanrnd@nriit.edu.in',
  officeEmail: 'info@rvrnriuniversity.edu.in',
  phone: '+91 9640 334422',
  admissionsHelpline: '+91 9247598461 / 62 / 63 / 64 / 65',
  helpdeskHours: 'Monday – Saturday: 9:30 AM – 5:00 PM IST',
  logoUrl: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/NRI-LOGO-FINAL.png',
  fallbackLogo: '/nrilogo.png',
};

// 2. Important Dates
export const IMPORTANT_DATES = [
  {
    activity: 'Commencement of online applications',
    date: '02 December 2026',
    status: 'Upcoming',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    activity: 'Last date for submission of applications',
    date: '25 December 2026',
    status: 'Deadline',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    activity: 'Ph.D. entrance examination',
    date: '02 January 2027',
    status: 'Proposed',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    activity: 'Declaration of entrance examination results',
    date: '10 January 2027',
    status: 'Proposed',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    activity: 'Interview and research proposal presentation',
    date: '12 January 2027',
    status: 'Proposed',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    activity: 'Final selection and admission formalities',
    date: 'To be notified',
    status: 'Pending University Approval',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
  },
];

export const IMPORTANT_DATES_DISCLAIMER =
  'The dates above are the proposed schedule discussed earlier. Publish them as confirmed dates only after formal approval by the University.';

// 3. Ph.D. Programme Options
export const PROGRAMME_OPTIONS = {
  intro:
    'The University will offer admissions under the following categories, subject to the approved regulations and availability of supervisors.',
  options: [
    {
      id: 'full-time',
      title: 'Full-Time Ph.D.',
      subtitle: 'Dedicated Campus Research & Fellowship Track',
      description:
        "Candidates pursue research on a full-time basis under the guidance of an approved research supervisor. They are expected to meet the University's requirements for coursework, research progress, seminars, publications where applicable, thesis submission and evaluation.",
      highlights: [
        'Full-time access to advanced research labs, computing clusters and central library',
        'Eligible for Institutional Doctoral Fellowships / UGC-CSIR-NET JRF contingency',
        'Continuous research progress monitoring, pre-Ph.D. coursework & colloquiums',
        'Mandatory research seminars and indexed peer-reviewed journal publications',
      ],
      badge: 'Full-Time Residency',
      accentColor: 'border-l-4 border-l-[#EC691F]',
    },
    {
      id: 'part-time',
      title: 'Part-Time Ph.D.',
      subtitle: 'Working Professionals, Industry & Faculty Track',
      description:
        'Candidates employed in educational institutions, research organizations, industry or other eligible establishments may apply, subject to the applicable eligibility conditions, employer permission where required, research facilities and supervisor availability.',
      highlights: [
        'Tailored for working faculty members, scientists and industry experts',
        'Mandatory No Objection Certificate (NOC) / Employer Permission required',
        'Flexible research scheduling while fulfilling rigorous university coursework',
        'Joint co-supervisors permitted from recognized industry/research organizations',
      ],
      badge: 'Professional Track',
      accentColor: 'border-l-4 border-l-[#A51C30]',
    },
  ],
};

// 4. Departments and Research Disciplines
export const RESEARCH_DISCIPLINES_INTRO =
  "Applications may be invited in the following broad areas, subject to the University's approved research programmes and recognized supervisors.";

export const RESEARCH_DISCIPLINES = [
  {
    id: 'cse',
    code: 'CSE',
    name: 'Computer Science and Engineering',
    category: 'Engineering & Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, Networks and Software Engineering.',
    researchAreas: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Science',
      'Cybersecurity',
      'Networks and Software Engineering',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'ece',
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Electronics-Communication-Engineering.webp',
    description: 'Signal Processing, Communication Systems, Embedded Systems and VLSI.',
    researchAreas: [
      'Signal Processing',
      'Communication Systems',
      'Embedded Systems and VLSI',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'eee',
    code: 'EEE',
    name: 'Electrical and Electronics Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Electrical-Electronics-Engineering.webp',
    description: 'Power Systems, Renewable Energy and Control Systems.',
    researchAreas: [
      'Power Systems',
      'Renewable Energy',
      'Control Systems',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'me',
    code: 'ME',
    name: 'Mechanical Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Mechanical-Engineering.webp',
    description: 'Manufacturing, Thermal Engineering, Design and Industrial Automation.',
    researchAreas: [
      'Manufacturing',
      'Thermal Engineering',
      'Design and Industrial Automation',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'ce',
    code: 'CE',
    name: 'Civil Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Civil-Engineering.webp',
    description: 'Structural Engineering, Environmental Engineering and Construction Management.',
    researchAreas: [
      'Structural Engineering',
      'Environmental Engineering',
      'Construction Management',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'mba',
    code: 'MBA',
    name: 'Management Studies',
    category: 'Management & Commerce',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/Master-of-Business-Administration.webp',
    description: 'Finance, Marketing, Human Resources, Operations and Business Analytics.',
    researchAreas: [
      'Finance',
      'Marketing',
      'Human Resources',
      'Operations and Business Analytics',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'math',
    code: 'MATH',
    name: 'Mathematics',
    category: 'Sciences & Humanities',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Data-Science.webp',
    description: 'Applied Mathematics, Optimization, Statistics and Computational Mathematics.',
    researchAreas: [
      'Applied Mathematics',
      'Optimization',
      'Statistics',
      'Computational Mathematics',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'phy',
    code: 'PHY',
    name: 'Physics',
    category: 'Sciences & Humanities',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/Digitally-advanced-NRI-University.webp',
    description: 'Applied Physics, Materials and Computational Physics.',
    researchAreas: [
      'Applied Physics',
      'Materials',
      'Computational Physics',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'chem',
    code: 'CHEM',
    name: 'Chemistry',
    category: 'Sciences & Humanities',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/M.Pharm-Pharmacology.webp',
    description: 'Analytical Chemistry, Materials Chemistry and Environmental Chemistry.',
    researchAreas: [
      'Analytical Chemistry',
      'Materials Chemistry',
      'Environmental Chemistry',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
  {
    id: 'pharm',
    code: 'PHARM',
    name: 'Pharmacy',
    category: 'Pharmaceutical Sciences',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/M.Pharm-Pharmaceutics.webp',
    description: 'Pharmaceutical Sciences, Pharmaceutics and Pharmacology.',
    researchAreas: [
      'Pharmaceutical Sciences',
      'Pharmaceutics',
      'Pharmacology',
    ],
    eligibility: "Relevant Master's degree meeting prescribed minimum marks or equivalent grade.",
  },
];

// 5. Eligibility for Admission
export const ELIGIBILITY_CRITERIA = {
  header:
    "Candidates seeking admission to the Ph.D. programme must satisfy the applicable eligibility requirements under the University's approved Ph.D. regulations and prevailing UGC regulations.",
  points: [
    "A relevant Master's degree or equivalent qualification from a recognized institution, meeting the prescribed minimum marks or equivalent grade.",
    'Candidates belonging to categories eligible for relaxation may receive the relaxation prescribed under the applicable regulations.',
    'Candidates applying for interdisciplinary research must have qualifications relevant to the proposed research area and meet the University\'s requirements.',
    'Any provision for direct admission after a four-year undergraduate degree must be applied only where permitted by the applicable UGC regulations and adopted University rules.',
    'Part-time applicants must meet the applicable eligibility requirements and submit employer permission or a No Objection Certificate wherever required.',
  ],
};

// 6. Admission Procedure (7 Steps)
export const ADMISSION_PROCEDURE = [
  {
    step: 1,
    title: 'Online registration',
    description:
      "Candidates register through the University's Ph.D. admissions portal and enter their personal, educational and research-related details.",
  },
  {
    step: 2,
    title: 'Application fee payment',
    description:
      'Candidates pay the prescribed application fee through the approved online payment gateway and retain the transaction receipt.',
  },
  {
    step: 3,
    title: 'Application scrutiny',
    description:
      'The admissions office verifies the application, educational qualifications, supporting documents and eligibility.',
  },
  {
    step: 4,
    title: 'Entrance examination or applicable exemption',
    description:
      'Eligible candidates appear for the University entrance examination unless they qualify for an exemption under the applicable regulations.',
  },
  {
    step: 5,
    title: 'Interview and research presentation',
    description:
      'Shortlisted candidates attend an interview before the designated selection committee and present their proposed research topic, objectives and methodology.',
  },
  {
    step: 6,
    title: 'Merit list and provisional selection',
    description:
      'Candidates are selected according to the applicable selection criteria, merit, supervisor availability and approved research capacity.',
  },
  {
    step: 7,
    title: 'Admission and registration',
    description:
      'Selected candidates complete admission formalities, pay the prescribed admission and programme fees, and undertake coursework and registration requirements.',
  },
];

// 7. Ph.D. Entrance Examination
export const ENTRANCE_EXAMINATION = {
  intro: 'The entrance examination is proposed to consist of two parts.',
  pattern: [
    {
      component: 'Part A – Research Aptitude and Methodology',
      marks: 25,
      description: 'Research Methodology and Research Aptitude assessment.',
    },
    {
      component: 'Part B – Subject-Specific Knowledge',
      marks: 50,
      description: 'Discipline-relevant subject examination based on department syllabus.',
    },
  ],
  totalMarks: 75,
  partACoverage: [
    'Research fundamentals, types and approaches',
    'Identification of research problems and formulation of hypotheses',
    'Research design, sampling techniques and data collection',
    'Statistical analysis and interpretation of results',
    'Literature review and research gap identification',
    'Research ethics, plagiarism and publication ethics',
    'Academic writing, citations and referencing',
    'Basics of research tools and data analysis',
  ],
  partBCoverageText:
    "This section assesses the candidate's knowledge of the discipline relevant to the proposed Ph.D. research area. The syllabus will differ by department and must be made available as a downloadable PDF on the respective department page.",
  disclaimer:
    'The above is the working examination pattern discussed earlier, not a statement of a mandatory UGC-prescribed paper structure. The University must formally approve the question format, duration, qualifying criteria, marking scheme and selection weightage before publishing them.',
  instructions: [
    'Examination date, reporting time and venue or online examination instructions.',
    'Hall-ticket download facility.',
    'Candidate identity verification requirements.',
    'Examination duration, question format and negative-marking policy, if applicable.',
    'Qualifying marks and result publication procedure.',
    'Contact details for examination-related queries.',
  ],
};

// 8. Entrance Examination Exemptions
export const EXEMPTION_CRITERIA = {
  header:
    "Candidates holding eligible national-level examination qualifications may be considered for exemption from the University entrance test in accordance with the applicable UGC regulations and the University's approved rules.",
  qualifications: [
    'UGC-NET, including JRF or other eligible NET categories.',
    'CSIR-NET.',
    'GATE.',
    'Other recognized national-level examinations, where applicable to the discipline.',
    "Any other examination or category explicitly permitted under the University's approved regulations.",
  ],
  importantNote:
    'Exemption should not be presented as automatic for every NET or GATE qualification. The applicable category, validity, subject relevance, documentary evidence and interview requirements must be verified. Candidates qualifying under an exempted category should follow the prescribed interview and selection process.',
};

// 9. Interview and Research Proposal Presentation
export const INTERVIEW_PRESENTATION = {
  header:
    'Shortlisted candidates will be invited to attend an interview before the designated University committee.',
  assessmentPoints: [
    "The candidate's academic background and subject knowledge.",
    'Understanding of the proposed research problem.',
    'Identification of the research gap and significance of the study.',
    'Familiarity with relevant literature.',
    'Proposed research objectives, methodology and feasibility.',
    'Analytical skills and ability to undertake independent research.',
    'Availability of appropriate supervision and research facilities.',
  ],
  candidateInstructions:
    'Candidates should bring their original certificates or verified documents as instructed, along with a brief research proposal and any supporting presentation requested by the University.',
  scheduleNote:
    'The website should publish the interview schedule, reporting instructions, evaluation criteria and final selection procedure after approval.',
};

// 10. Ph.D. Fee Structure
export const FEE_STRUCTURE = {
  note:
    'The following fee particulars were discussed earlier and can be presented on the website, subject to confirmation against the University\'s final approved fee notification.',
  table: [
    {
      component: 'Admission fee',
      fullTime: '₹10,000',
      partTime: '₹10,000',
    },
    {
      component: 'Annual programme fee',
      fullTime: '₹20,000',
      partTime: '₹15,000',
    },
    {
      component: 'Application fee',
      fullTime: 'To be approved',
      partTime: 'To be approved',
    },
    {
      component: 'Coursework / examination fee',
      fullTime: 'As notified',
      partTime: 'As notified',
    },
    {
      component: 'Thesis submission / evaluation fee',
      fullTime: 'As notified',
      partTime: 'As notified',
    },
    {
      component: 'Other applicable charges',
      fullTime: 'As notified',
      partTime: 'As notified',
    },
  ],
  footerNote:
    'The admission fee and annual fees shown above are the previously discussed amounts. The University should confirm whether the admission fee is one-time, when annual fees become payable, and whether any additional charges apply.',
};

// 11. Online Ph.D. Application Form Specifications
export const ONLINE_FORM_DETAILS = {
  title: 'Ph.D. Admission Application — 2026–2027',
  notice:
    'Illustrative form preview. This form does not submit data to the University or process payments.',
  sections: [
    {
      section: 'A. Programme Details',
      fields: ['Admission category (Full-Time / Part-Time)', 'Department / discipline (Select discipline)'],
    },
    {
      section: 'B. Candidate Details',
      fields: ['Full Name, Father/Guardian Name, Date of Birth, Gender, Category, Mobile, Email, Aadhaar, Permanent & Correspondence Address'],
    },
    {
      section: 'C. Educational Qualifications',
      fields: ['Post-Graduation (Master’s), Under-Graduation (Bachelor’s), Intermediate / 10+2, SSC / 10th with marks, percentage, board/university and year'],
    },
    {
      section: 'D. Research Information',
      fields: ['Proposed Research Area, Topic Title, Brief Synopsis / Abstract, Exemption Category (NET/JRF/GATE) if applicable, Experience & Publications'],
    },
  ],
  declarationPayment:
    "The production portal should include a declaration of the accuracy of submitted information, consent to the University's admission terms, document uploads, application fee payment, transaction verification and application acknowledgement.",
  requiredUploads: [
    'Recent photograph and signature, if required.',
    'Government-approved identity proof.',
    "Bachelor's and Master's degree certificates.",
    'Semester-wise or consolidated mark sheets.',
    'NET/JRF/GATE or other qualifying examination certificates, where applicable.',
    'Category certificate, where applicable.',
    "Employer's NOC or permission letter for part-time candidates, where required.",
    'Research proposal or statement of purpose, if required.',
    'Other documents specified in the admission notification.',
  ],
  paymentWorkflow: [
    'Candidate completes the application form.',
    'The portal validates mandatory fields.',
    'The candidate pays the approved application fee through the payment gateway.',
    'The portal verifies the payment response.',
    'A unique application number and acknowledgement are generated.',
    'The candidate downloads the submitted application and payment receipt.',
    'The admissions office can view applications, payment status, eligibility and document verification status through an administrative dashboard.',
  ],
};

// 12. Website Downloads and Important Links
export const WEBSITE_DOWNLOADS_LINKS = [
  {
    title: 'Ph.D. Admission Notification 2026–2027',
    purpose: 'Official admission announcement',
    type: 'Notification',
    downloadId: 'notification',
  },
  {
    title: 'Ph.D. Regulations',
    purpose: 'Approved regulations governing admission, coursework, supervision and thesis submission',
    type: 'Regulations',
    downloadId: 'regulations',
  },
  {
    title: 'Detailed Eligibility Guidelines',
    purpose: 'Qualification, marks and relaxation criteria',
    type: 'Guidelines',
    downloadId: 'eligibility',
  },
  {
    title: 'Department-wise Ph.D. Syllabi',
    purpose: 'Part A and Part B syllabus PDFs',
    type: 'Syllabus',
    downloadId: 'syllabus',
  },
  {
    title: 'Ph.D. Fee Structure',
    purpose: 'Approved application, admission and annual fees',
    type: 'Finance',
    downloadId: 'fee-structure',
  },
  {
    title: 'Entrance Examination Guidelines',
    purpose: 'Pattern, duration, marks and instructions',
    type: 'Examination',
    downloadId: 'entrance-guidelines',
  },
  {
    title: 'Application User Guide',
    purpose: 'Instructions for completing the online form',
    type: 'Guide',
    downloadId: 'user-guide',
  },
  {
    title: 'Research Proposal Guidelines',
    purpose: 'Format and preparation requirements',
    type: 'Guidelines',
    downloadId: 'proposal-guidelines',
  },
  {
    title: 'Recognized Research Supervisors',
    purpose: 'Approved supervisors and research areas',
    type: 'Academic',
    downloadId: 'supervisors',
  },
  {
    title: 'Important Dates',
    purpose: 'Application, examination, result and interview schedule',
    type: 'Schedule',
    downloadId: 'dates',
  },
  {
    title: 'Contact the Ph.D. Admissions Office',
    purpose: 'Official email, telephone and helpdesk information',
    type: 'Contact',
    downloadId: 'contact',
  },
];

// 13. Suggested Website Menu
export const SUGGESTED_MENU = [
  { label: 'Home', href: '#home' },
  {
    label: 'Ph.D. Programmes',
    href: '#programmes',
    children: [
      { label: 'Full-Time Ph.D.', href: '#programmes' },
      { label: 'Part-Time Ph.D.', href: '#programmes' },
    ],
  },
  { label: 'Departments & Research Areas', href: '#departments' },
  { label: 'Eligibility Criteria', href: '#eligibility' },
  { label: 'Admission Procedure', href: '#procedure' },
  { label: 'Entrance Examination', href: '#entrance-exam' },
  { label: 'Syllabus Downloads', href: '#syllabus' },
  { label: 'NET / JRF / GATE Exemptions', href: '#exemptions' },
  { label: 'Interview & Selection', href: '#interview' },
  { label: 'Fee Structure', href: '#fee-structure' },
  { label: 'Ph.D. Regulations', href: '#downloads' },
  { label: 'Pay Fee & Apply Online', href: '#apply-online', isCta: true },
  { label: 'Application Status', href: 'status' },
  { label: 'Downloads', href: '#downloads' },
  { label: 'Contact Admissions Office', href: '#contact' },
];

// 14. Administrative Dashboard Requirements
export const ADMIN_DASHBOARD_SPECS = [
  'View and filter applications by discipline and admission category.',
  'Verify application fee payments and issue acknowledgements.',
  'Check uploaded documents and mark eligibility status.',
  'Generate candidate lists for entrance examinations and interviews.',
  'Record examination marks, exemption status and interview results.',
  'Generate merit lists and provisional selection letters.',
  'Export applicant data to Excel.',
  'Send email notifications for application acknowledgement, hall tickets, results and interview schedules.',
  'Maintain role-based access, audit logs and secure handling of candidate information.',
];

// 15. Final Implementation Checklist
export const IMPLEMENTATION_CHECKLIST = [
  'Final list of Ph.D. disciplines and recognized research supervisors.',
  'Eligibility criteria and qualifying marks for each discipline.',
  'Entrance examination pattern, duration and qualifying criteria.',
  'Rules for NET/JRF/GATE and other examination exemptions.',
  'Interview evaluation and merit-list preparation rules.',
  'Final application fee, admission fee and annual fee notification.',
  'Approved Ph.D. regulations PDF and department-wise syllabus PDFs.',
  'Payment gateway, email/SMS service and application acknowledgement.',
  'Online application privacy notice and secure document storage.',
  'Official admission notification and final schedule.',
];

// Department Syllabi Details
export const DEPARTMENT_SYLLABI = {
  cse: {
    name: 'Computer Science and Engineering',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'AI, Machine Learning, Data Science, Cybersecurity, Networks & Software Engineering (50 Marks)',
  },
  ece: {
    name: 'Electronics and Communication Engineering',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Signal Processing, Communication Systems, Embedded Systems and VLSI (50 Marks)',
  },
  eee: {
    name: 'Electrical and Electronics Engineering',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Power Systems, Renewable Energy and Control Systems (50 Marks)',
  },
  me: {
    name: 'Mechanical Engineering',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Manufacturing, Thermal Engineering, Design and Industrial Automation (50 Marks)',
  },
  ce: {
    name: 'Civil Engineering',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Structural Engineering, Environmental Engineering and Construction Management (50 Marks)',
  },
  mba: {
    name: 'Management Studies',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Finance, Marketing, Human Resources, Operations and Business Analytics (50 Marks)',
  },
  math: {
    name: 'Mathematics',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Applied Mathematics, Optimization, Statistics and Computational Mathematics (50 Marks)',
  },
  phy: {
    name: 'Physics',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Applied Physics, Materials and Computational Physics (50 Marks)',
  },
  chem: {
    name: 'Chemistry',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Analytical Chemistry, Materials Chemistry and Environmental Chemistry (50 Marks)',
  },
  pharm: {
    name: 'Pharmacy',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Pharmaceutical Sciences, Pharmaceutics and Pharmacology (50 Marks)',
  },
};
