/**
 * Official Admissions & Academic Data for Dr. RVR NRIIT (Deemed to be University)
 * Ph.D. Admissions 2026–2027 Portal
 * 
 * Strict alignment with UGC (Minimum Standards and Procedures for Award of Ph.D. Degree) Regulations
 * and official institutional design tokens matching https://rvrnriuniversity.edu.in/
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
    badgeColor: 'text-emerald-700',
    isConfirmed: true,
  },
  {
    activity: 'Last date for submission of applications',
    date: '25 December 2026',
    status: 'Deadline',
    badgeColor: 'text-rose-700',
    isConfirmed: true,
  },
  {
    activity: 'Ph.D. Entrance Examination (Proposed)',
    date: '02 January 2027',
    status: 'Proposed Schedule',
    badgeColor: 'text-blue-700',
    isConfirmed: false,
  },
  {
    activity: 'Declaration of Entrance Examination Results',
    date: '10 January 2027',
    status: 'Proposed Schedule',
    badgeColor: 'text-indigo-700',
    isConfirmed: false,
  },
  {
    activity: 'Research Proposal Presentation & DRC Interview',
    date: '12 January 2027',
    status: 'Proposed Schedule',
    badgeColor: 'text-amber-700',
    isConfirmed: false,
  },
  {
    activity: 'Final Merit List & Admission Formalities',
    date: 'To be notified',
    status: 'Pending University Ratification',
    badgeColor: 'text-slate-700',
    isConfirmed: false,
  },
];

export const IMPORTANT_DATES_DISCLAIMER =
  'Note: The application opening and deadline dates are tentatively scheduled. Examination and interview dates represent the proposed timeline and are subject to formal confirmation by the University. Applicants are advised to check the portal regularly for notifications.';

// 3. Ph.D. Programme Options
export const PROGRAMME_OPTIONS = {
  intro:
    'The University offers Ph.D. admissions under Full-Time and Part-Time modes in accordance with UGC guidelines and availability of approved research supervisors.',
  options: [
    {
      id: 'full-time',
      title: 'Full-Time Ph.D.',
      subtitle: 'Dedicated Campus Research & Fellowship Track',
      description:
        "Candidates pursue doctoral research on a full-time residential basis under the direct guidance of recognized research supervisors. Scholars have full access to university research centers, specialized laboratories, computing facilities, and digital library resources.",
      highlights: [
        'Full-time access to advanced research labs, computing clusters and central digital library',
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
        'Candidates employed in educational institutions, research organizations, government sectors, or industries may apply. Requires mandatory employer permission / No Objection Certificate (NOC) and fulfillment of coursework requirements.',
      highlights: [
        'Tailored for working faculty members, scientists, engineers and industry experts',
        'Mandatory No Objection Certificate (NOC) and Employer Relieving / Leave Undertaking',
        'Flexible research scheduling while fulfilling rigorous university coursework',
        'Joint co-supervisors permitted from recognized industry/research organizations',
      ],
      badge: 'Professional Track',
      accentColor: 'border-l-4 border-l-[#A51C30]',
    },
  ],
};

// 4. Departments and Research Disciplines (Including Economics)
export const RESEARCH_DISCIPLINES_INTRO =
  "Applications are invited across the following approved academic departments and research disciplines, subject to recognized supervisor availability and research infrastructure:";

export const RESEARCH_DISCIPLINES = [
  {
    id: 'cse',
    code: 'CSE',
    name: 'Computer Science and Engineering',
    category: 'Engineering & Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, Cloud Computing, Networks and Software Engineering.',
    researchAreas: [
      'Artificial Intelligence & Deep Learning',
      'Machine Learning & Data Mining',
      'Cybersecurity & Cryptography',
      'Computer Networks & Cloud Computing',
      'Natural Language Processing & Computer Vision',
      'Software Architecture & Distributed Systems',
    ],
    eligibility: "M.Tech / M.E. / M.S. in CSE / IT / AI / DS or relevant field with at least 55% marks (50% for SC/ST/OBC non-creamy layer/PwD/EWS) or equivalent grade.",
    hasSyllabus: true,
  },
  {
    id: 'ece',
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Electronics-Communication-Engineering.webp',
    description: 'Signal Processing, Wireless Communications, Embedded Systems, VLSI Design, and IoT Architectures.',
    researchAreas: [
      'Digital Signal & Image Processing',
      'Wireless Communications & 5G/6G Networks',
      'VLSI Design & Embedded Systems',
      'Antenna Design & Microwave Engineering',
      'Internet of Things (IoT) & Sensor Networks',
    ],
    eligibility: "M.Tech / M.E. in ECE / Communication / VLSI / Embedded Systems or allied branch with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'eee',
    code: 'EEE',
    name: 'Electrical and Electronics Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Electrical-Electronics-Engineering.webp',
    description: 'Power Systems, Renewable Energy conversion, Smart Grids, Power Electronics, and Electric Vehicle Drives.',
    researchAreas: [
      'Power Systems & Grid Modernization',
      'Renewable Energy (Solar/Wind) & Microgrids',
      'Power Electronics & Industrial Drives',
      'Electric Vehicle (EV) Technology & Battery Storage',
      'Modern Control Systems & Automation',
    ],
    eligibility: "M.Tech / M.E. in EEE / Power Systems / Power Electronics / Energy Systems or allied field with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'me',
    code: 'ME',
    name: 'Mechanical Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Mechanical-Engineering.webp',
    description: 'Thermal Engineering, Manufacturing, Machine Design, CAD/CAM/Robotics, and Materials Science.',
    researchAreas: [
      'Thermal & Fluid Engineering',
      'Advanced Manufacturing & Additive Technologies',
      'Machine Design, Mechanics & Vibrations',
      'Robotics, Automation & Mechatronics',
      'Composite Materials & Nanotechnology',
    ],
    eligibility: "M.Tech / M.E. in Mechanical / Production / Thermal / CAD/CAM or allied discipline with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'ce',
    code: 'CE',
    name: 'Civil Engineering',
    category: 'Engineering & Technology',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Civil-Engineering.webp',
    description: 'Structural Engineering, Geotechnical Engineering, Environmental Engineering, and Sustainable Construction.',
    researchAreas: [
      'Structural Engineering & Earthquake Dynamics',
      'Geotechnical & Foundation Engineering',
      'Environmental Engineering & Water Resources',
      'Transportation & Highway Engineering',
      'Sustainable Construction Materials & Management',
    ],
    eligibility: "M.Tech / M.E. in Civil / Structural / Geotechnical / Environmental Engineering with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'mba',
    code: 'MBA',
    name: 'Management Studies',
    category: 'Management & Commerce',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/Master-of-Business-Administration.webp',
    description: 'Finance, Marketing, Human Resources, Supply Chain, Operations, and Business Analytics.',
    researchAreas: [
      'Financial Management & Capital Markets',
      'Marketing Strategies & Consumer Analytics',
      'Human Resource Management & Organizational Behavior',
      'Operations & Supply Chain Optimization',
      'Business Analytics & Strategic Management',
    ],
    eligibility: "Master of Business Administration (MBA) / M.Com / PGDM (AICTE approved equivalent) with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'econ',
    code: 'ECON',
    name: 'Economics',
    category: 'Humanities & Social Sciences',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    description: 'Microeconomics, Macroeconomics, Econometrics, Developmental Economics, Public Finance, and Agricultural Economics.',
    researchAreas: [
      'Microeconomic Theory & Behavioral Economics',
      'Macroeconomic Policy, Inflation & Growth Models',
      'Econometric Modeling & Quantitative Economics',
      'Development Economics & Poverty Alleviation',
      'Public Finance, Taxation & Fiscal Federalism',
      'Agricultural Economics & Rural Development',
    ],
    eligibility: "Master's degree in Economics / Applied Economics / Econometrics / Development Economics with at least 55% marks (50% for SC/ST/OBC non-creamy layer/PwD/EWS) or equivalent grade from a recognized University.",
    hasSyllabus: true,
  },
  {
    id: 'math',
    code: 'MATH',
    name: 'Mathematics',
    category: 'Sciences & Humanities',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/B.Tech-Data-Science.webp',
    description: 'Applied Mathematics, Fluid Dynamics, Differential Equations, Optimization, and Computational Statistics.',
    researchAreas: [
      'Applied Mathematics & Mathematical Modeling',
      'Fluid Dynamics & Heat Transfer Analysis',
      'Differential Equations & Numerical Methods',
      'Optimization Techniques & Operations Research',
      'Probability, Statistics & Stochastic Processes',
    ],
    eligibility: "M.Sc. in Mathematics / Applied Mathematics / Statistics with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'phy',
    code: 'PHY',
    name: 'Physics',
    category: 'Sciences & Humanities',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/Digitally-advanced-NRI-University.webp',
    description: 'Condensed Matter Physics, Materials Science, Nanotechnology, and Computational Physics.',
    researchAreas: [
      'Condensed Matter & Solid State Physics',
      'Materials Science & Advanced Nanomaterials',
      'Renewable Energy Materials & Solar Cells',
      'Spectroscopy & Optoelectronic Devices',
      'Computational Physics & Simulation',
    ],
    eligibility: "M.Sc. in Physics / Applied Physics / Materials Science with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'chem',
    code: 'CHEM',
    name: 'Chemistry',
    category: 'Sciences & Humanities',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/M.Pharm-Pharmacology.webp',
    description: 'Organic Synthesis, Medicinal Chemistry, Analytical Chemistry, Catalysis, and Environmental Chemistry.',
    researchAreas: [
      'Organic Synthesis & Medicinal Chemistry',
      'Coordination Chemistry & Green Catalysis',
      'Analytical Chemistry & Spectroscopy',
      'Polymer Chemistry & Nanocomposites',
      'Environmental Chemistry & Water Remediation',
    ],
    eligibility: "M.Sc. in Chemistry / Organic / Inorganic / Physical / Analytical Chemistry with minimum 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
  {
    id: 'pharm',
    code: 'PHARM',
    name: 'Pharmacy',
    category: 'Pharmaceutical Sciences',
    image: 'https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/M.Pharm-Pharmaceutics.webp',
    description: 'Pharmaceutics, Drug Delivery Systems, Pharmacology, Pharmaceutical Chemistry, and Pharmacognosy.',
    researchAreas: [
      'Novel Drug Delivery Systems (NDDS) & Nanomedicine',
      'Pharmacology & Toxicology Studies',
      'Pharmaceutical Chemistry & Molecular Modeling',
      'Phytochemistry & Herbal Drug Standardization',
      'Clinical Pharmacy & Pharmacovigilance',
    ],
    eligibility: "M.Pharmacy degree in Pharmaceutics / Pharmacology / Pharmaceutical Chemistry / allied specialization recognized by PCI with at least 55% marks (50% for reserved categories).",
    hasSyllabus: true,
  },
];

// 5. Eligibility Criteria (Comprehensive UGC Guidelines)
export const ELIGIBILITY_CRITERIA = {
  header:
    "Candidates seeking admission to the Ph.D. programme must satisfy the eligibility criteria prescribed under University regulations in compliance with University Grants Commission (Minimum Standards and Procedures for Award of Ph.D. Degree) Regulations.",
  generalRequirements: [
    "Master's Degree: Candidates must possess a Master's degree or a professional degree declared equivalent to the Master's degree by the corresponding statutory regulatory body, with at least 55% marks in aggregate or its equivalent grade 'B' in the UGC 7-point scale.",
    'Category Relaxation: A relaxation of 5% marks (from 55% to 50%), or an equivalent relaxation of grade, is allowed for candidates belonging to SC/ST/OBC (non-creamy layer)/Differently-Abled/Economically Weaker Section (EWS) and other categories as per UGC norms.',
    'Four-Year Undergraduate Degree Provision: Candidates with a 4-year / 8-semester Bachelor’s degree programme with a minimum of 75% marks in aggregate or equivalent grade are eligible, subject to UGC notifications and university regulations.',
    'Part-Time Ph.D. Eligibility: Part-time candidates must be in regular employment with educational institutions, research organizations, government departments, or recognized industries, and must submit a mandatory No Objection Certificate (NOC) and service certificate from their employer.',
    'Interdisciplinary Research: Candidates applying for interdisciplinary research must satisfy the qualifications relevant to the proposed discipline and obtain approval from the Departmental Research Committee (DRC).',
  ],
  requiredDocumentsList: [
    'Recent passport-size photograph and digital signature',
    'SSC / Class 10 Certificate (Date of birth verification)',
    'Intermediate / 10+2 / Diploma Certificate',
    "Bachelor's Degree Certificate and consolidated/semester grade mark sheets",
    "Master's Degree Certificate and consolidated grade transcripts",
    'Valid Scorecard/Certificate of UGC-NET / CSIR-NET / GATE / SLET / SET / GPAT (if claiming exemption)',
    'Category / Community / EWS Certificate (issued by competent revenue authority, if applicable)',
    'No Objection Certificate (NOC) from employer (mandatory for all Part-Time applicants)',
    'Aadhaar Card / Government Identity Proof',
    'Brief Research Proposal / Statement of Purpose (indicative 500–1000 words)',
    'Application fee payment transaction receipt / UTR slip',
  ],
};

// 6. Admission Procedure (7 Steps)
export const ADMISSION_PROCEDURE = [
  {
    step: 1,
    title: 'Online Application & Profile Submission',
    description:
      "Candidates submit their online application through the university admissions portal, providing personal, educational, research background details, and discipline preferences.",
  },
  {
    step: 2,
    title: 'Application Fee Payment & Verification',
    description:
      'Candidates remit the prescribed application fee through the approved online payment gateway / net banking and enter transaction reference (UTR) in the application form.',
  },
  {
    step: 3,
    title: 'Scrutiny of Applications & Qualifications',
    description:
      'The Directorate of Research & Development and Departmental Research Committees (DRC) scrutinize academic credentials, minimum marks, eligibility, and document authenticity.',
  },
  {
    step: 4,
    title: 'University Ph.D. Selection Test (or Exemption)',
    description:
      'Eligible candidates appear for the University Entrance Examination comprising Part A (Research) and Part B (Department). Candidates qualifying UGC-NET, CSIR-NET (JRF), GATE, SLET, SET, or GPAT may be granted exemption as per approved rules.',
  },
  {
    step: 5,
    title: 'Research Proposal Presentation & Interview',
    description:
      'Qualified and exempted candidates present their research proposal and defend their research competence before the Departmental Research Committee (DRC).',
  },
  {
    step: 6,
    title: 'Merit List Declaration & Supervisor Allocation',
    description:
      'A consolidated merit list is prepared taking into account entrance performance (or qualifying national exam), interview evaluation, research feasibility, and recognized supervisor vacancies.',
  },
  {
    step: 7,
    title: 'Provisional Admission & Coursework Registration',
    description:
      'Provisionally selected candidates complete admission verification, pay prescribed fees, and register for mandatory doctoral coursework and research colloquiums.',
  },
];

// 7. Ph.D. Selection Test & Examination Architecture
export const ENTRANCE_EXAMINATION = {
  intro:
    'The University Ph.D. Entrance Examination is structured into two comprehensive sections assessing research acumen and department-specific mastery.',
  totalDuration: '120 Minutes (2.0 Hours)',
  durationNotes:
    'Total examination duration is 120 Minutes (2.0 Hours) conducted in a single test session for both Part A and Part B.',
  totalMarks: 75,
  markingNote:
    'Proposed 75 Marks architecture (25 Marks Part A + 50 Marks Part B). Final marks distribution, question formats (MCQs / descriptive), and qualifying thresholds are subject to formal confirmation by the University Academic Council.',
  qualifyingCriteria:
    'Qualifying marks are proposed as 50% in aggregate (45% for SC/ST/OBC non-creamy layer/Differently-Abled/EWS candidates), in accordance with UGC guidelines.',
  pattern: [
    {
      component: 'Part A – Research Aptitude and Methodology',
      marks: 25,
      weightage: '33.3%',
      description: 'Foundational research methodology, research design, statistical reasoning, ethics, and analytical ability (Common to all disciplines).',
    },
    {
      component: 'Part B – Subject-Specific Knowledge',
      marks: 50,
      weightage: '66.7%',
      description: 'Domain-specific curriculum covering core theoretical and applied topics of the selected department / discipline.',
    },
  ],
  partACoverage: [
    'Research fundamentals, philosophical approaches, and types of research',
    'Identification of research problem, literature review, and hypothesis formulation',
    'Research design, sampling techniques, measurement scales, and data collection',
    'Statistical analysis, hypothesis testing (parametric & non-parametric tests), correlation and regression',
    'Data interpretation, graphical visualization, and computational research tools (SPSS/R/Python)',
    'Research & Publication Ethics (RPE), UGC anti-plagiarism guidelines, Turnitin/Urkund',
    'Academic thesis structure, peer-reviewed journals, WoS/Scopus indexing, and standard citation formats (IEEE, APA)',
  ],
  partBCoverageText:
    "Part B assesses advanced subject knowledge tailored to the specific department or discipline applied for (e.g. Computer Science, Electronics, Mechanical, Management, Economics, Mathematics, Physics, Chemistry, Pharmacy). Detailed department syllabi are provided below with individual PDF download facilities.",
  disclaimer:
    'The 75-mark two-part pattern is the proposed working framework. The University Academic Council reserves the right to issue the final ratified examination pattern, duration, and question distribution.',
  candidateGuidelines: [
    'Candidates must download their official Hall Ticket from the admissions portal prior to the examination.',
    'Valid photo identity proof (Aadhaar Card, Voter ID, Passport, or PAN) must be produced at the examination center.',
    'Reporting time is 45 minutes prior to the scheduled examination commencement.',
    'Calculators or electronic communication devices are strictly prohibited unless explicitly permitted for numerical disciplines.',
    'Results and interview shortlists will be published on the official University website.',
  ],
};

// 8. Entrance Examination Exemptions (Including SLET, SET, GPAT)
export const EXEMPTION_CRITERIA = {
  header:
    "Candidates possessing recognized national-level examination qualifications may be considered for exemption from appearing in the written entrance test, subject to verification and approved University regulations:",
  recognizedExaminations: [
    {
      exam: 'UGC-NET / UGC-CSIR NET (including JRF)',
      scope: 'Candidates who have qualified UGC-NET or CSIR-NET (Junior Research Fellowship or Lectureship / Assistant Professor categories).',
      status: 'Recognized for Written Test Exemption',
    },
    {
      exam: 'GATE (Graduate Aptitude Test in Engineering)',
      scope: 'Candidates with a valid GATE score in engineering, technology, or science disciplines relevant to the Ph.D. domain.',
      status: 'Recognized for Written Test Exemption',
    },
    {
      exam: 'SLET / SET (State Level / State Eligibility Test)',
      scope: 'Candidates who have qualified SLET / SET (including APSET, TSSET, and other recognized State Eligibility Tests) in the relevant subject.',
      status: 'Recognized for Written Test Exemption',
    },
    {
      exam: 'GPAT (Graduate Pharmacy Aptitude Test)',
      scope: 'Candidates who have qualified GPAT with a valid scorecard for doctoral admissions in Pharmacy and Pharmaceutical Sciences.',
      status: 'Recognized for Written Test Exemption',
    },
    {
      exam: 'National Doctoral Fellowships (ICMR / ICAR / DST-INSPIRE / NBHM)',
      scope: 'Scholars awarded national fellowships through competitive national tests for pursuing full-time doctoral research.',
      status: 'Recognized for Written Test Exemption',
    },
  ],
  importantNote:
    'Mandatory Scrutiny & Interview Requirement: Exemption applies exclusively to the written entrance examination (Part A & Part B). All exempted candidates MUST appear for the Research Proposal Presentation and Personal Interview before the Departmental Research Committee (DRC). Exemption eligibility is subject to documentary verification of score validity, qualifying year, and subject relevance.',
};

// 9. Interview and Research Proposal Presentation
export const INTERVIEW_PRESENTATION = {
  header:
    'Shortlisted candidates (both written test qualified and exempted) must attend an interview and research presentation before the Departmental Research Committee (DRC).',
  assessmentPoints: [
    "Candidate's depth of subject knowledge and academic preparation in the chosen discipline.",
    'Relevance, clarity, and viability of the proposed research problem.',
    'Identification of research gaps through thorough review of literature.',
    'Feasibility of proposed research methodology, experimental design, and analytical tools.',
    'Availability of recognized research supervisors and required laboratory/computational infrastructure.',
    'Potential of the proposed research to contribute to new knowledge or technological innovation.',
  ],
  candidateInstructions:
    'Candidates must bring self-attested original certificates, verified document copies, a brief written research proposal (3–5 pages), and a concise slide presentation (10–12 slides) highlighting proposed research objectives and methodology.',
  scheduleNote:
    'The detailed interview schedule, DRC panel timings, and reporting instructions will be communicated via email and portal notifications.',
};

// 10. Ph.D. Fee Structure (Proposed & Configurable)
export const FEE_STRUCTURE = {
  note:
    'The proposed fee schedule for Ph.D. admissions 2026–2027 is outlined below, subject to final official circular from the University Finance Committee.',
  table: [
    {
      component: 'Admission Fee (One-Time)',
      fullTime: '₹10,000',
      partTime: '₹10,000',
      remarks: 'Payable at the time of provisional admission',
    },
    {
      component: 'Annual Programme / Tuition Fee',
      fullTime: '₹20,000',
      partTime: '₹15,000',
      remarks: 'Payable annually at the commencement of each academic year',
    },
    {
      component: 'Application Fee',
      fullTime: 'To be notified',
      partTime: 'To be notified',
      remarks: 'Online application processing fee as per official circular',
    },
    {
      component: 'Pre-Ph.D. Coursework & Examination Fee',
      fullTime: 'As notified',
      partTime: 'As notified',
      remarks: 'Per course registration / examination session',
    },
    {
      component: 'Thesis Evaluation & Viva-Voce Fee',
      fullTime: 'As notified',
      partTime: 'As notified',
      remarks: 'Payable prior to final thesis submission',
    },
    {
      component: 'Caution Deposit (Refundable)',
      fullTime: 'As notified',
      partTime: 'As notified',
      remarks: 'Subject to university rules upon completion',
    },
  ],
  footerNote:
    'Fees once paid are non-refundable except caution deposits under university rules. Exact application fee and payment instructions will be updated upon final administrative notification.',
};

// 11. Online Ph.D. Application Guide & Workflow
export const ONLINE_APPLICATION_GUIDE = {
  title: 'Ph.D. Online Application & Payment Procedure',
  summary:
    'Applicants must complete the verified 7-step online application form, upload mandatory self-attested documents, remit the fee, and obtain an application acknowledgement number.',
  steps: [
    {
      step: '1',
      title: 'Personal & Programme Details',
      desc: 'Select Full-Time / Part-Time mode, choose department/discipline, and enter candidate profile, category, and communication address.',
    },
    {
      step: '2',
      title: 'Academics & Qualifying Exams',
      desc: 'Enter detailed educational qualifications from SSC, Intermediate, UG to Master’s degree, including marks, percentages, board/university, and NET/GATE/SLET/SET/GPAT scores.',
    },
    {
      step: '3',
      title: 'Professional Experience & Publications',
      desc: 'Add teaching, industry, or research experience, along with research publications in indexed journals, books, or patents.',
    },
    {
      step: '4',
      title: 'Research Proposal & Referees',
      desc: 'Specify proposed research area, tentative topic, brief synopsis, and names of two academic/professional referees.',
    },
    {
      step: '5',
      title: 'Document Uploads',
      desc: 'Upload clear scanned PDFs or images of certificates, degree transcripts, identity proof, employer NOC (if part-time), and fee payment slip.',
    },
    {
      step: '6',
      title: 'Fee Payment Slip & Verification',
      desc: 'Upload the payment receipt / UTR transaction slip of the prescribed application fee paid via official university net banking / online gateway.',
    },
    {
      step: '7',
      title: 'Digital Declaration & Submission',
      desc: 'Accept the institutional legal declaration, enter place & date, and submit your application.',
    },
  ],
};

// 12. Website Downloads and Important Documents (Genuine Document Downloads Only)
export const WEBSITE_DOWNLOADS_LINKS = [
  {
    id: 'notification',
    title: 'Ph.D. Admission Notification 2026–2027',
    purpose: 'Official admission circular, intake details, and university guidelines',
    category: 'Notification',
    status: 'Official Summary (PDF)',
    actionType: 'regulations-pdf',
  },
  {
    id: 'syllabus-part-a',
    title: 'Entrance Examination Syllabus — Part A (Research Aptitude)',
    purpose: 'Complete 8-unit syllabus covering research fundamentals, statistics & publication ethics',
    category: 'Syllabus',
    status: 'Download Document (PDF)',
    actionType: 'part-a-pdf',
  },
  {
    id: 'syllabus-all-depts',
    title: 'Department-Wise Ph.D. Syllabi — Part B (All 11 Disciplines)',
    purpose: 'Subject-specific syllabi for CSE, ECE, EEE, ME, CE, MBA, ECON, Math, Physics, Chemistry & Pharmacy',
    category: 'Syllabus',
    status: 'Part B Syllabus Explorer',
    actionType: 'scroll-part-b',
  },
  {
    id: 'regulations',
    title: 'Ph.D. Academic Regulations & Guidelines',
    purpose: 'Rules governing doctoral coursework, supervisory committees, evaluation & thesis submission',
    category: 'Regulations',
    status: 'Official Regulations (PDF)',
    actionType: 'regulations-pdf',
  },
];

// 13. Streamlined Website Navigation Menu
export const SUGGESTED_MENU = [
  { label: 'Home', href: '#home' },
  {
    label: 'Programmes',
    href: '#programmes',
    children: [
      { label: 'Full-Time Ph.D.', href: '#programmes' },
      { label: 'Part-Time Ph.D.', href: '#programmes' },
    ],
  },
  { label: 'Departments', href: '#departments' },
  { label: 'Eligibility', href: '#eligibility' },
  { label: 'Selection & Exam', href: '#selection-exam' },
  { label: 'Part A Syllabus', href: '#part-a-syllabus' },
  { label: 'Part B Syllabus', href: '#part-b-syllabus' },
  { label: 'Exemptions', href: '#exemptions' },
  { label: 'Downloads', href: '#downloads' },
  { label: 'Contact', href: '#contact' },
  { label: 'Application Status', href: 'status' },
  { label: 'Pay Fee & Apply', href: '#apply-online', isCta: true },
];

// 14. Department Syllabi Details (Including Economics)
export const DEPARTMENT_SYLLABI = {
  cse: {
    name: 'Computer Science and Engineering',
    code: 'CSE',
    category: 'Engineering & Technology',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Algorithms, Architecture, Database Systems, Networks, AI/ML, Cybersecurity & Cloud (50 Marks)',
    hasSyllabus: true,
  },
  ece: {
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    category: 'Engineering & Technology',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Signals & Systems, Digital Signal Processing, Communications, Embedded Systems & VLSI (50 Marks)',
    hasSyllabus: true,
  },
  eee: {
    name: 'Electrical and Electronics Engineering',
    code: 'EEE',
    category: 'Engineering & Technology',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Electric Circuits, Electrical Machines, Power Systems, Control Systems, Power Electronics & Renewable Energy (50 Marks)',
    hasSyllabus: true,
  },
  me: {
    name: 'Mechanical Engineering',
    code: 'ME',
    category: 'Engineering & Technology',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Applied Mechanics, Machine Design, Fluid & Thermal Sciences, Manufacturing & Operations Research (50 Marks)',
    hasSyllabus: true,
  },
  ce: {
    name: 'Civil Engineering',
    code: 'CE',
    category: 'Engineering & Technology',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Structural Analysis & Design, Geotechnical Engineering, Water Resources, Environmental & Transportation (50 Marks)',
    hasSyllabus: true,
  },
  mba: {
    name: 'Management Studies',
    code: 'MBA',
    category: 'Management & Commerce',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Management Principles, OB, Marketing Management, Corporate Finance, HRM & Business Analytics (50 Marks)',
    hasSyllabus: true,
  },
  econ: {
    name: 'Economics',
    code: 'ECON',
    category: 'Humanities & Social Sciences',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Microeconomics, Macroeconomics, Econometrics & Statistics, Development Economics, Public Finance & Indian Economy (50 Marks)',
    hasSyllabus: true,
  },
  math: {
    name: 'Mathematics',
    code: 'MATH',
    category: 'Sciences & Humanities',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Real & Complex Analysis, Linear & Abstract Algebra, Differential Equations, Numerical Methods & Statistics (50 Marks)',
    hasSyllabus: true,
  },
  phy: {
    name: 'Physics',
    code: 'PHY',
    category: 'Sciences & Humanities',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Classical & Quantum Mechanics, Electrodynamics, Solid State Physics, Electronics & Nuclear Physics (50 Marks)',
    hasSyllabus: true,
  },
  chem: {
    name: 'Chemistry',
    code: 'CHEM',
    category: 'Sciences & Humanities',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Inorganic & Coordination Chemistry, Organic Synthesis & Mechanisms, Physical Chemistry & Spectroscopy (50 Marks)',
    hasSyllabus: true,
  },
  pharm: {
    name: 'Pharmacy',
    code: 'PHARM',
    category: 'Pharmaceutical Sciences',
    partA: 'Research Aptitude & Methodology (25 Marks)',
    partB: 'Pharmaceutics & NDDS, Pharmacology & Toxicology, Pharmaceutical Chemistry & Analysis, Pharmacognosy (50 Marks)',
    hasSyllabus: true,
  },
};

// Administrative Dashboard Specifications (Internal Reference)
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

// Implementation Checklist (Internal Governance)
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
