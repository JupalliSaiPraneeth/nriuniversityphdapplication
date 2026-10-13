/**
 * CSV Exporter with RFC 4180 escaping and Spreadsheet Formula Injection Defense
 */

// Sanitizes a cell to prevent Excel / LibreOffice CSV injection (=, +, -, @, \t, \r)
export function sanitizeCellValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);

  // Check if starts with risky characters
  const trimmed = str.trimStart();
  if (
    str.startsWith('\t') ||
    str.startsWith('\r') ||
    trimmed.startsWith('=') ||
    trimmed.startsWith('+') ||
    trimmed.startsWith('-') ||
    trimmed.startsWith('@')
  ) {
    // Prefix with single quote to force plain text display in spreadsheets
    str = "'" + str;
  }

  // RFC 4180 Escaping: If string contains comma, quote, or newline, wrap in quotes and double internal quotes
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

// Convert an array of row arrays into UTF-8 CSV with Byte Order Mark (BOM)
export function buildCsvContent(headers, rows) {
  const headerLine = headers.map(sanitizeCellValue).join(',');
  const rowLines = rows.map((row) => row.map(sanitizeCellValue).join(','));
  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
}

// Helper to trigger browser download of CSV
export function downloadCsvFile(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export single application with detailed breakdown
export function exportSingleApplicationCsv(app) {
  const p = app.personal_details || {};
  const a = app.address_details || {};
  const dec = app.declaration || {};

  const headers = [
    'Field Category',
    'Field Name',
    'Submitted Value'
  ];

  const rows = [
    ['Header', 'Application Number', app.application_number || 'N/A'],
    ['Header', 'Status', app.status || 'submitted'],
    ['Header', 'Submitted At', app.submitted_at || 'N/A'],
    ['Personal', 'Candidate Full Name', p.fullName || ''],
    ['Personal', 'Ph.D. Programme / Subject', p.programme || ''],
    ['Personal', 'Specialization / Research Area', p.specialization || ''],
    ['Personal', 'Admission Category', p.admissionCategory || ''],
    ['Personal', 'Mode of Admission', p.modeOfAdmission || ''],
    ['Personal', "Father's / Guardian's Name", p.guardianName || ''],
    ['Personal', 'Date of Birth', p.dateOfBirth || ''],
    ['Personal', 'Gender', p.gender || ''],
    ['Personal', 'Category', p.category || ''],
    ['Personal', 'Email ID', p.email || ''],
    ['Personal', 'Mobile Number', p.mobileNumber || ''],
    ['Personal', 'Emergency Contact Number', p.emergencyContact || ''],
    ['Address', 'Permanent Address', a.permanentAddress || ''],
    ['Address', 'Present / Correspondence Address', a.presentAddress || ''],
    ['Address', 'District', a.district || ''],
    ['Address', 'State', a.state || ''],
    ['Address', 'PIN Code', a.pinCode || ''],
    ['Research', 'Research Exposure / Area of Interest', app.research_exposure || ''],
    ['Review', 'Reviewer Notes', app.reviewer_notes || ''],
    ['Declaration', 'Place', dec.place || ''],
    ['Declaration', 'Date', dec.date || ''],
    ['Declaration', 'Signature', dec.typedSignature || ''],
  ];

  // Repeatable education rows
  (app.educational_qualifications || []).forEach((item, idx) => {
    rows.push([
      `Education (Row ${idx + 1})`,
      `${item.qualification || 'Qualification'} - ${item.specialization || 'Spec'}`,
      `Inst: ${item.institution || '—'}, Year: ${item.year || '—'}, CGPA/%: ${item.percentage || '—'}`
    ]);
  });

  // Repeatable examinations
  (app.eligibility_examinations || []).forEach((item, idx) => {
    rows.push([
      `Eligibility Exam (Row ${idx + 1})`,
      `${item.examination || 'Exam'} - ${item.subject || 'Subject'}`,
      `Year: ${item.year || '—'}, Score: ${item.score || '—'}, Status: ${item.qualification || '—'}`
    ]);
  });

  // Repeatable experience
  (app.professional_experience || []).forEach((item, idx) => {
    rows.push([
      `Experience (Row ${idx + 1})`,
      `${item.institution || 'Inst'} - ${item.designation || 'Role'}`,
      `Period: ${item.fromTo || '—'}, Nature: ${item.natureOfWork || '—'}, Total: ${item.totalExperience || '—'}`
    ]);
  });

  // Publications
  (app.research_publications || []).forEach((item, idx) => {
    rows.push([
      `Publication (Row ${idx + 1})`,
      item.titleAuthor || 'Title',
      `Journal: ${item.journalConference || '—'}, Year: ${item.year || '—'}, Index: ${item.indexingQuartile || '—'}, DOI: ${item.doi || '—'}`
    ]);
  });

  // Books / Patents
  (app.books_patents_outputs || []).forEach((item, idx) => {
    rows.push([
      `Book/Patent (Row ${idx + 1})`,
      `${item.type || 'Output'}: ${item.titleDetails || '—'}`,
      `Year: ${item.year || '—'}, ISBN/Patent: ${item.isbnPatentNo || '—'}`
    ]);
  });

  // References
  (app.references_data || []).forEach((item, idx) => {
    rows.push([
      `Reference (Row ${idx + 1})`,
      item.nameDesignation || '—',
      `Inst: ${item.institution || '—'}, Contact: ${item.contactEmail || '—'}`
    ]);
  });

  const csvContent = buildCsvContent(headers, rows);
  const cleanAppNum = (app.application_number || 'APPLICATION').replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadCsvFile(csvContent, `phd_application_${cleanAppNum}.csv`);
}

// Bulk applications export (matrix format suitable for analysis and spreadsheets)
export function exportApplicationsListCsv(applications, filenamePrefix = 'phd_applications_export') {
  const headers = [
    'Application Number',
    'Status',
    'Submission Date',
    'Candidate Name',
    'Programme / Subject',
    'Specialization',
    'Admission Category',
    'Mode of Admission',
    "Father / Guardian Name",
    'Date of Birth',
    'Gender',
    'Category',
    'Email ID',
    'Mobile Number',
    'Emergency Contact',
    'Permanent Address',
    'Correspondence Address',
    'District',
    'State',
    'PIN Code',
    'Highest Qualification',
    'Education Summary',
    'Eligible Exams (NET/GATE/etc)',
    'Experience Summary',
    'Total Publications Count',
    'Books & Patents Count',
    'Awards & Fellowships Count',
    'Research Exposure',
    'Declaration Place',
    'Declaration Date',
    'Candidate Signature',
    'Reviewer Notes',
  ];

  const rows = applications.map((app) => {
    const p = app.personal_details || {};
    const a = app.address_details || {};
    const dec = app.declaration || {};
    const edu = app.educational_qualifications || [];
    const exams = app.eligibility_examinations || [];
    const exp = app.professional_experience || [];
    const pubs = app.research_publications || [];
    const bp = app.books_patents_outputs || [];
    const awards = app.memberships_awards || [];

    const highestEdu = edu.find((e) => e.qualification && e.qualification.trim())?.qualification || '—';
    const eduSummary = edu.filter((e) => e.qualification).map((e) => `${e.qualification}: ${e.institution} (${e.percentage || 'N/A'})`).join(' | ');
    const examsSummary = exams.filter((e) => e.examination).map((e) => `${e.examination}: ${e.score || 'Qualified'}`).join(' | ');
    const expSummary = exp.filter((e) => e.institution).map((e) => `${e.designation} at ${e.institution} (${e.totalExperience || 'N/A'})`).join(' | ');

    return [
      app.application_number || '',
      app.status || 'submitted',
      app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IN') : '',
      p.fullName || app.applicant_name || '',
      p.programme || app.programme || '',
      p.specialization || app.specialization || '',
      p.admissionCategory || app.admission_category || '',
      p.modeOfAdmission || '',
      p.guardianName || '',
      p.dateOfBirth || '',
      p.gender || '',
      p.category || '',
      p.email || app.applicant_email || '',
      p.mobileNumber || app.applicant_phone || '',
      p.emergencyContact || '',
      a.permanentAddress || '',
      a.presentAddress || '',
      a.district || '',
      a.state || '',
      a.pinCode || '',
      highestEdu,
      eduSummary,
      examsSummary,
      expSummary,
      pubs.filter((pub) => pub.titleAuthor).length,
      bp.filter((b) => b.titleDetails).length,
      awards.filter((aw) => aw.awardMembership).length,
      app.research_exposure || '',
      dec.place || '',
      dec.date || '',
      dec.typedSignature || '',
      app.reviewer_notes || '',
    ];
  });

  const csvContent = buildCsvContent(headers, rows);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCsvFile(csvContent, `${filenamePrefix}_${dateStr}.csv`);
}
