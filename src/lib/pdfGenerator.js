import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Institutional Details
const INSTITUTION_HEADER = {
  name: 'Dr RVR NRI INSTITUTE OF TECHNOLOGY',
  status: '(Deemed to be University)',
  location: 'Pothavarappadu, Agiripalli, Vijayawada Rural, Andhra Pradesh – 521212',
  email: 'deanrnd@nriit.edu.in',
  formTitle: 'BIODATA OF THE CANDIDATE FOR Ph.D. ADMISSION',
};

export async function generateApplicationPDF(application, photoDataUrl = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 14;

  const appNumber = application.application_number || 'N/A';
  const submittedAt = application.submitted_at
    ? new Date(application.submitted_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN');

  const personal = application.personal_details || {};
  const address = application.address_details || {};
  const education = application.educational_qualifications || [];
  const examinations = application.eligibility_examinations || [];
  const experience = application.professional_experience || [];
  const researchExposure = application.research_exposure || '';
  const publications = application.research_publications || [];
  const booksPatents = application.books_patents_outputs || [];
  const memberships = application.memberships_awards || [];
  const conferences = application.conferences_workshops || [];
  const references = application.references_data || [];
  const declaration = application.declaration || {};

  // Header Function
  const renderHeader = () => {
    doc.setFillColor(7, 40, 73); // NRI Navy #072849
    doc.rect(0, 0, pageWidth, 5, 'F');

    doc.setTextColor(7, 40, 73);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(INSTITUTION_HEADER.name, pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(80, 80, 80);
    doc.text(INSTITUTION_HEADER.status, pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;

    doc.setFontSize(8.5);
    doc.text(INSTITUTION_HEADER.location, pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
    doc.text(`Email: ${INSTITUTION_HEADER.email}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    // Form Title Banner
    doc.setFillColor(240, 247, 255);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 8, 1.5, 1.5, 'F');
    doc.setTextColor(1, 110, 201);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(INSTITUTION_HEADER.formTitle, pageWidth / 2, currentY + 5.5, { align: 'center' });
    currentY += 12;

    // Application details strip
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`Application No: ${appNumber}`, margin, currentY);
    doc.text(`Date of Submission: ${submittedAt}`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 5;
  };

  renderHeader();

  // Helper for Section Titles
  const addSectionTitle = (title) => {
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 16;
    }
    doc.setFillColor(7, 40, 73);
    doc.rect(margin, currentY, pageWidth - margin * 2, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(title, margin + 3, currentY + 4.2);
    currentY += 8;
  };

  // Helper for 2-column key-value grid
  const addKeyValueGrid = (pairs) => {
    const colWidth = (pageWidth - margin * 2) / 2;
    for (let i = 0; i < pairs.length; i += 2) {
      if (currentY > pageHeight - 15) {
        doc.addPage();
        currentY = 16;
      }
      const pair1 = pairs[i];
      const pair2 = pairs[i + 1];

      // Col 1
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(70, 70, 70);
      doc.text(pair1.label + ':', margin, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const val1 = pair1.value || '—';
      doc.text(String(val1), margin + 48, currentY);

      // Col 2 (if present)
      if (pair2) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(70, 70, 70);
        doc.text(pair2.label + ':', margin + colWidth, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        const val2 = pair2.value || '—';
        doc.text(String(val2), margin + colWidth + 48, currentY);
      }
      currentY += 5;
    }
    currentY += 2;
  };

  // --- SECTION 1: APPLICATION & PERSONAL DETAILS ---
  addSectionTitle('1. APPLICATION & PERSONAL DETAILS');

  // Candidate Photo placement if available
  const photoBoxWidth = 26;
  const photoBoxHeight = 32;
  const photoX = pageWidth - margin - photoBoxWidth;
  const photoY = currentY;

  let hasPhoto = false;
  if (photoDataUrl && photoDataUrl.startsWith('data:image')) {
    try {
      const format = photoDataUrl.includes('png') ? 'PNG' : 'JPEG';
      doc.addImage(photoDataUrl, format, photoX, photoY, photoBoxWidth, photoBoxHeight);
      doc.setDrawColor(200, 200, 200);
      doc.rect(photoX, photoY, photoBoxWidth, photoBoxHeight);
      hasPhoto = true;
    } catch (e) {
      console.warn('Failed to render photo in PDF:', e);
    }
  }

  if (!hasPhoto) {
    doc.setDrawColor(180, 180, 180);
    doc.rect(photoX, photoY, photoBoxWidth, photoBoxHeight);
    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text('Passport Size\nPhotograph', photoX + photoBoxWidth / 2, photoY + 14, { align: 'center' });
  }

  // Personal Fields
  const personalFields = [
    { label: 'Ph.D. Programme / Subject', value: personal.programme },
    { label: 'Specialization / Area', value: personal.specialization },
    { label: 'Admission Category', value: personal.admissionCategory },
    { label: 'Mode of Admission', value: personal.modeOfAdmission },
    { label: 'Full Name', value: personal.fullName },
    { label: "Father's / Guardian's Name", value: personal.guardianName },
    { label: 'Date of Birth', value: personal.dateOfBirth },
    { label: 'Gender', value: personal.gender },
    { label: 'Category', value: personal.category },
    { label: 'Email ID', value: personal.email },
    { label: 'Mobile Number', value: personal.mobileNumber },
    { label: 'Emergency Contact No', value: personal.emergencyContact },
  ];

  for (let i = 0; i < personalFields.length; i++) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(personalFields[i].label + ':', margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(personalFields[i].value || '—'), margin + 50, currentY);
    currentY += 4.8;
  }
  currentY += 3;

  // --- SECTION 2: ADDRESS ---
  addSectionTitle('2. ADDRESS');
  const addressPairs = [
    { label: 'Permanent Address', value: address.permanentAddress },
    { label: 'Correspondence Address', value: address.presentAddress },
    { label: 'District', value: address.district },
    { label: 'State', value: address.state },
    { label: 'PIN Code', value: address.pinCode },
  ];
  addKeyValueGrid(addressPairs);

  // --- SECTION 3: EDUCATIONAL QUALIFICATIONS ---
  addSectionTitle('3. EDUCATIONAL QUALIFICATIONS');
  const eduRows = (education.length > 0 ? education : [{}, {}, {}, {}]).map((item, index) => [
    index + 1,
    item.qualification || '—',
    item.specialization || '—',
    item.institution || '—',
    item.year || '—',
    item.percentage || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Qualification', 'Specialization', 'University / Institution', 'Year', '% / CGPA']],
    body: eduRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 4: QUALIFYING / ELIGIBILITY EXAMINATIONS ---
  addSectionTitle('4. QUALIFYING / ELIGIBILITY EXAMINATIONS');
  const examRows = (examinations.length > 0 ? examinations : [{}, {}, {}]).map((item, index) => [
    index + 1,
    item.examination || '—',
    item.subject || '—',
    item.year || '—',
    item.score || '—',
    item.qualification || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Examination', 'Subject', 'Year', 'Score / Percentile', 'Qualification']],
    body: examRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 5: PROFESSIONAL / TEACHING EXPERIENCE ---
  addSectionTitle('5. PROFESSIONAL / TEACHING EXPERIENCE');
  const expRows = (experience.length > 0 ? experience : [{}, {}, {}, {}, {}]).map((item, index) => [
    index + 1,
    item.institution || '—',
    item.designation || '—',
    item.fromTo || '—',
    item.natureOfWork || '—',
    item.totalExperience || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Institution / Organization', 'Designation', 'From–To', 'Nature of Work', 'Total Exp']],
    body: expRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 6: RESEARCH EXPOSURE / AREA OF INTEREST ---
  addSectionTitle('6. RESEARCH EXPOSURE / AREA OF INTEREST');
  if (currentY > pageHeight - 25) {
    doc.addPage();
    currentY = 16;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const exposureText = researchExposure || 'No specific research exposure mentioned.';
  const splitText = doc.splitTextToSize(exposureText, pageWidth - margin * 2);
  doc.text(splitText, margin, currentY);
  currentY += splitText.length * 4.2 + 4;

  // --- SECTION 7: RESEARCH PUBLICATIONS ---
  addSectionTitle('7. RESEARCH PUBLICATIONS');
  const pubRows = (publications.length > 0 ? publications : [{}, {}, {}, {}, {}, {}]).map((item, index) => [
    index + 1,
    item.titleAuthor || '—',
    item.journalConference || '—',
    item.year || '—',
    item.indexingQuartile || '—',
    item.doi || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Title / Author(s)', 'Journal / Conference', 'Year', 'Indexing / Quartile', 'DOI']],
    body: pubRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 8: BOOKS / PATENTS / OTHER RESEARCH OUTPUTS ---
  addSectionTitle('8. BOOKS / PATENTS / OTHER RESEARCH OUTPUTS');
  const bpRows = (booksPatents.length > 0 ? booksPatents : [{}, {}, {}, {}]).map((item, index) => [
    index + 1,
    item.type || '—',
    item.titleDetails || '—',
    item.year || '—',
    item.isbnPatentNo || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Type', 'Title / Details', 'Year', 'ISBN / Patent No.']],
    body: bpRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 9: PROFESSIONAL MEMBERSHIPS / FELLOWSHIPS / AWARDS ---
  addSectionTitle('9. PROFESSIONAL MEMBERSHIPS / FELLOWSHIPS / AWARDS');
  const memRows = (memberships.length > 0 ? memberships : [{}, {}, {}, {}]).map((item, index) => [
    index + 1,
    item.awardMembership || '—',
    item.organization || '—',
    item.year || '—',
    item.details || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Award / Fellowship / Membership', 'Organization', 'Year', 'Details']],
    body: memRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 10: CONFERENCES / WORKSHOPS / FDPS (OPTIONAL) ---
  addSectionTitle('10. CONFERENCES / WORKSHOPS / FDPS (Organized/Attended)');
  const confRows = (conferences.length > 0 ? conferences : [{}, {}, {}, {}, {}]).map((item, index) => [
    index + 1,
    item.programme || '—',
    item.organizer || '—',
    item.year || '—',
    item.roleParticipation || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Programme', 'Organizer', 'Year', 'Role / Participation']],
    body: confRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 11: REFERENCES ---
  addSectionTitle('11. REFERENCES');
  const refRows = (references.length > 0 ? references : [{}, {}]).map((item, index) => [
    index + 1,
    item.nameDesignation || '—',
    item.institution || '—',
    item.contactEmail || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Name & Designation', 'Institution', 'Contact / Email']],
    body: refRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 5;

  // --- SECTION 12: DOCUMENTS ENCLOSED CHECKLIST ---
  addSectionTitle('12. DOCUMENTS ENCLOSED (CHECKLIST)');
  const docMeta = application.document_metadata || {};
  const docList = [
    { name: '1. Photograph', key: 'photo', uploaded: !!docMeta.photo || hasPhoto },
    { name: '2. 10th / SSC Certificate', key: 'sscCertificate', uploaded: !!docMeta.sscCertificate },
    { name: '3. Intermediate / 12th Certificate', key: 'interCertificate', uploaded: !!docMeta.interCertificate },
    { name: "4. Bachelor's Degree & Marksheets", key: 'ugDegree', uploaded: !!docMeta.ugDegree },
    { name: "5. Master's Degree & Marksheets", key: 'pgDegree', uploaded: !!docMeta.pgDegree },
    { name: '6. All Experience Certificate (if applicable)', key: 'expCertificates', uploaded: !!docMeta.expCertificates },
    { name: '7. GATE/SLET/SET/NET/JRF/GPAT Qualifying Card', key: 'examCard', uploaded: !!docMeta.examCard },
    { name: '8. Category Certificate (if applicable)', key: 'categoryCertificate', uploaded: !!docMeta.categoryCertificate },
    { name: '9. Aadhar Card', key: 'aadharCard', uploaded: !!docMeta.aadharCard },
    { name: '10. Application Fee Payment Slip', key: 'feeReceipt', uploaded: !!docMeta.feeReceipt },
  ];

  const docRows = docList.map((d) => [
    d.name,
    d.uploaded ? 'Enclosed / Uploaded' : 'Not Attached',
    docMeta[d.key]?.fileName || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Document Name', 'Status', 'File Name']],
    body: docRows,
    theme: 'grid',
    headStyles: { fillColor: [7, 40, 73], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = doc.lastAutoTable.finalY + 6;

  // --- SECTION 13: DECLARATION ---
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 16;
  }
  addSectionTitle('13. DECLARATION');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const declarationStatement =
    '"I declare that the information furnished above is true, complete and correct to the best of my knowledge and belief. I understand that any false or incorrect information may lead to rejection/cancellation of my application/admission as per University rules."';
  const splitDec = doc.splitTextToSize(declarationStatement, pageWidth - margin * 2);
  doc.text(splitDec, margin, currentY);
  currentY += splitDec.length * 4.2 + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);

  doc.text(`Place: ${declaration.place || '—'}`, margin, currentY);
  doc.text(`Date: ${declaration.date || submittedAt}`, margin + 55, currentY);

  const sigText = declaration.typedSignature || personal.fullName || 'Digitally Verified';
  doc.text(`Candidate Signature: ${sigText}`, pageWidth - margin, currentY, { align: 'right' });
  currentY += 10;

  // Page Numbers Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Dr RVR NRI Institute of Technology | Application: ${appNumber}`,
      margin,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  return doc;
}
