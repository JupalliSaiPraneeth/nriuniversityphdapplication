import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDocument } from 'pdf-lib';
import { dbService } from './supabase';
import { DOCUMENT_SPECS } from '../data/initialFormState';

// Helper to determine natural dimensions of an image
function getImageNaturalDimensions(src) {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Convert base64 data URL to Uint8Array for pdf-lib
function base64ToUint8Array(base64Str) {
  const pure = base64Str.includes(',') ? base64Str.split(',')[1] : base64Str;
  const binaryString = atob(pure);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert ArrayBuffer to Data URL
function arrayBufferToDataUrl(arrayBuffer, contentType = 'image/jpeg') {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return `data:${contentType};base64,${btoa(binary)}`;
}

// Fetch image via HTML Image element and canvas (handles CORS/browser decode)
async function fetchImageViaCanvas(url) {
  if (typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(dataUrl);
      } catch (err) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Resolve uploaded document content from dataUrl, storagePath, or localStorage
async function resolveDocumentContent(meta, docKey, applicationId) {
  if (!meta) return null;

  // 1. Direct dataUrl
  if (meta.dataUrl && typeof meta.dataUrl === 'string' && meta.dataUrl.length > 50) {
    return {
      dataUrl: meta.dataUrl,
      fileName: meta.fileName || `${docKey}`,
      contentType:
        meta.contentType ||
        (meta.dataUrl.startsWith('data:application/pdf') ? 'application/pdf' : 'image/jpeg'),
    };
  }

  // 2. Storage path
  const storagePath = meta.storagePath || meta.path;
  if (storagePath) {
    if (typeof storagePath === 'string' && storagePath.startsWith('local://')) {
      const docKeyStorage = storagePath.replace('local://', '');
      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem('nriit_phd_documents_v1');
          if (raw) {
            const docs = JSON.parse(raw);
            const found = docs[docKeyStorage];
            if (found?.dataUrl) {
              return {
                dataUrl: found.dataUrl,
                fileName: meta.fileName || found.fileName || docKey,
                contentType:
                  meta.contentType ||
                  found.contentType ||
                  (found.dataUrl.startsWith('data:application/pdf')
                    ? 'application/pdf'
                    : 'image/jpeg'),
              };
            }
          }
        } catch (e) {
          console.warn('Error reading local docs for PDF enclosure:', e);
        }
      }
    }

    try {
      const url = await dbService.getDocumentUrl(storagePath);
      if (url) {
        if (url.startsWith('data:')) {
          return {
            dataUrl: url,
            fileName: meta.fileName || docKey,
            contentType:
              meta.contentType ||
              (url.startsWith('data:application/pdf') ? 'application/pdf' : 'image/jpeg'),
          };
        }
        if (url.startsWith('http://') || url.startsWith('https://')) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              const ct = res.headers.get('content-type') || meta.contentType || '';
              const isPdf =
                ct.toLowerCase().includes('pdf') ||
                meta.fileName?.toLowerCase().endsWith('.pdf') ||
                docKey.toLowerCase().includes('pdf');
              const dataUrl = !isPdf ? arrayBufferToDataUrl(arrayBuffer, ct || 'image/jpeg') : null;
              return {
                arrayBuffer,
                dataUrl,
                fileName: meta.fileName || docKey,
                contentType:
                  ct || (isPdf ? 'application/pdf' : 'image/jpeg'),
              };
            }
          } catch (fetchErr) {
            console.warn(`Direct fetch failed for ${docKey}, attempting canvas fallback:`, fetchErr);
            // Canvas fallback for browser CORS
            const canvasDataUrl = await fetchImageViaCanvas(url);
            if (canvasDataUrl) {
              return {
                dataUrl: canvasDataUrl,
                fileName: meta.fileName || docKey,
                contentType: 'image/jpeg',
              };
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Could not resolve storagePath ${storagePath}:`, err);
    }
  }

  // 3. Fallback: search localStorage directly by ID and docKey
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('nriit_phd_documents_v1');
      if (raw) {
        const docs = JSON.parse(raw);
        const candidates = [`${applicationId}_${docKey}`, docKey];
        for (const k of candidates) {
          if (docs[k]?.dataUrl) {
            return {
              dataUrl: docs[k].dataUrl,
              fileName: meta.fileName || docs[k].fileName || docKey,
              contentType:
                meta.contentType ||
                docs[k].contentType ||
                (docs[k].dataUrl.startsWith('data:application/pdf')
                  ? 'application/pdf'
                  : 'image/jpeg'),
            };
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return null;
}

// Institutional Information
const INSTITUTION = {
  name: 'Dr RVR NRI INSTITUTE OF TECHNOLOGY',
  status: 'Deemed to be University | Pothavarappadu (V), Agiripalli (M)',
  location: 'Vijayawada Rural, Andhra Pradesh - 521212 | E: deanrnd@nriit.edu.in',
  titleLine1: 'BIODATA OF THE CANDIDATE',
  titleLine2: 'FOR Ph.D. ADMISSION',
};

// Cached Logo Data URL
let cachedLogoBase64 = null;

async function getNriLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  if (typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        cachedLogoBase64 = canvas.toDataURL('image/png');
        resolve(cachedLogoBase64);
      } catch (e) {
        console.warn('[PDF] Canvas toDataURL for logo failed:', e);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('[PDF] Failed to load logo from /nrilogo.png');
      resolve(null);
    };
    img.src = '/nrilogo.png';
  });
}

/**
 * Generate official Ph.D. Admission PDF matching official light-mode layout
 */
export async function generateApplicationPDF(application, photoDataUrl = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182

  const logoBase64 = await getNriLogoBase64();

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
  const docMeta = application.document_metadata || {};

  // Photo URL fallback if stored in personal or document metadata
  const effectivePhoto =
    photoDataUrl ||
    personal.photoDataUrl ||
    (docMeta.photo && docMeta.photo.storagePath ? docMeta.photo.storagePath : null);

  // Common Palette
  const THEME = {
    navyText: [7, 40, 73],
    darkText: [15, 23, 42],
    bodyText: [51, 65, 85],
    subText: [71, 85, 105],
    headerFill: [224, 242, 254], // Light Blue #e0f2fe
    borderColor: [203, 213, 225], // Light Slate #cbd5e1
  };

  // Track drawn page headers to prevent duplicate header draws
  const drawnPageHeaders = new Set();

  // Render Top Header on a page with enlarged institutional logo
  const drawPageHeader = (y = 8) => {
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
    if (drawnPageHeaders.has(pageNum)) {
      return y + 20;
    }
    drawnPageHeaders.add(pageNum);

    // Left: Institution Name & Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...THEME.navyText);
    doc.text(INSTITUTION.name, margin, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...THEME.subText);
    doc.text(INSTITUTION.status, margin, y + 8.5);
    doc.text(INSTITUTION.location, margin, y + 12);

    // Right: Logo - increased size (width 42mm, height 16.5mm)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', pageWidth - margin - 42, y, 42, 16.5);
      } catch (e) {
        // fallback emblem
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...THEME.navyText);
        doc.text('NRIIT', pageWidth - margin, y + 8, { align: 'right' });
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...THEME.navyText);
      doc.text('NRIIT', pageWidth - margin, y + 8, { align: 'right' });
    }

    // Divider line
    doc.setDrawColor(...THEME.borderColor);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 17.5, pageWidth - margin, y + 17.5);

    return y + 20;
  };

  // Helper for Section Titles (Flows smoothly with spacious bottom margins so content is never congested)
  const drawSectionTitle = (title, currentY, minSpace = 32) => {
    if (currentY > pageHeight - minSpace) {
      doc.addPage();
      currentY = drawPageHeader(8);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...THEME.navyText);
    doc.text(title, margin, currentY + 3.2);
    return currentY + 5;
  };

  const tableMargin = { top: 26, bottom: 24, left: margin, right: margin };

  // ==========================================
  // DOCUMENT BODY FLOW
  // ==========================================
  let currentY = drawPageHeader(8);

  // Form Title Banner (Centered) & Photo Box (Right)
  const titleCenterY = currentY + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...THEME.darkText);
  doc.text(INSTITUTION.titleLine1, 95, titleCenterY, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...THEME.subText);
  doc.text(INSTITUTION.titleLine2, 95, titleCenterY + 4.8, { align: 'center' });

  // Photo Box (Passport Size)
  const photoBoxW = 27;
  const photoBoxH = 32;
  const photoBoxX = pageWidth - margin - photoBoxW;
  const photoBoxY = currentY;

  let photoRendered = false;
  if (effectivePhoto && typeof effectivePhoto === 'string' && effectivePhoto.startsWith('data:image')) {
    try {
      const format = effectivePhoto.includes('png') ? 'PNG' : 'JPEG';
      doc.addImage(effectivePhoto, format, photoBoxX, photoBoxY, photoBoxW, photoBoxH);
      doc.setDrawColor(...THEME.borderColor);
      doc.setLineWidth(0.3);
      doc.rect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
      photoRendered = true;
    } catch (e) {
      console.warn('[PDF] Could not draw candidate photo:', e);
    }
  }

  if (!photoRendered) {
    doc.setDrawColor(...THEME.borderColor);
    doc.setLineWidth(0.3);
    doc.rect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Affix Recent\nPassport Size\nPhoto', photoBoxX + photoBoxW / 2, photoBoxY + 13, {
      align: 'center',
    });
  }

  currentY = Math.max(titleCenterY + 11, photoBoxY + photoBoxH + 2.5);

  // --- SECTION 1: APPLICATION & PERSONAL DETAILS ---
  currentY = drawSectionTitle('1. APPLICATION & PERSONAL DETAILS', currentY);

  const personalRows = [
    ['Application Number', appNumber],
    ['Ph.D. Programme / Subject', personal.programme || '—'],
    ['Specialization / Research Area', personal.specialization || '—'],
    ['Admission Category (Full-Time / Part-Time)', personal.admissionCategory || '—'],
    ['Mode of Admission', personal.modeOfAdmission || '—'],
    ['Full Name', personal.fullName || '—'],
    ["Father's / Mother's / Guardian's Name", personal.guardianName || '—'],
    ['Date of Birth', personal.dateOfBirth || '—'],
    ['Gender', personal.gender || '—'],
    ['Category', personal.category || '—'],
    ['Email ID', personal.email || '—'],
    ['Mobile Number', personal.mobileNumber || '—'],
    ['Emergency Contact Number', personal.emergencyContact || '—'],
  ];

  autoTable(doc, {
    startY: currentY,
    body: personalRows,
    theme: 'grid',
    styles: {
      fontSize: 7.2,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      textColor: THEME.darkText,
    },
    columnStyles: {
      0: { cellWidth: 64, fontStyle: 'bold', textColor: THEME.bodyText, fillColor: [255, 255, 255] },
      1: { cellWidth: contentWidth - 64, fontStyle: 'normal', textColor: THEME.darkText, fillColor: [255, 255, 255] },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 2: ADDRESS ---
  currentY = drawSectionTitle('2. ADDRESS', currentY);

  const districtStateStr = [address.district, address.state].filter(Boolean).join(', ') || '—';
  const addressRows = [
    ['Permanent Address', address.permanentAddress || '—'],
    ['Present / Correspondence Address', address.presentAddress || '—'],
    ['District / State', districtStateStr],
    ['PIN Code', address.pinCode || '—'],
  ];

  autoTable(doc, {
    startY: currentY,
    body: addressRows,
    theme: 'grid',
    styles: {
      fontSize: 7.2,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      textColor: THEME.darkText,
    },
    columnStyles: {
      0: { cellWidth: 64, fontStyle: 'bold', textColor: THEME.bodyText, fillColor: [255, 255, 255] },
      1: { cellWidth: contentWidth - 64, fontStyle: 'normal', textColor: THEME.darkText, fillColor: [255, 255, 255] },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 3: EDUCATIONAL QUALIFICATIONS ---
  currentY = drawSectionTitle('3. EDUCATIONAL QUALIFICATIONS', currentY);

  const defaultQuals = ['10th / SSC', 'Intermediate / 10+2', "Bachelor's Degree (UG)", "Master's Degree (PG)"];
  const eduRows = [];

  defaultQuals.forEach((qName, idx) => {
    const existing = education.find((e) =>
      e.qualification && e.qualification.toLowerCase().includes(qName.toLowerCase().slice(0, 4))
    ) || education[idx] || {};

    eduRows.push([
      idx + 1,
      qName,
      existing.specialization || '—',
      existing.institution || '—',
      existing.year || '—',
      existing.percentage || '—',
    ]);
  });

  if (education.length > defaultQuals.length) {
    for (let i = defaultQuals.length; i < education.length; i++) {
      const extra = education[i];
      eduRows.push([
        i + 1,
        extra.qualification || 'Other Degree',
        extra.specialization || '—',
        extra.institution || '—',
        extra.year || '—',
        extra.percentage || '—',
      ]);
    }
  }

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Qualification', 'Specialization', 'University / Institution', 'Year', '% / CGPA']],
    body: eduRows,
    theme: 'grid',
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7.2,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 34, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 58 },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 28, halign: 'center' },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 4: QUALIFYING / ELIGIBILITY EXAMINATIONS ---
  currentY = drawSectionTitle('4. QUALIFYING / ELIGIBILITY EXAMINATIONS', currentY);

  const examList = examinations.length > 0 ? examinations : [{}];
  const examRows = examList.map((item, index) => [
    index + 1,
    item.examination || '—',
    item.subject || '—',
    item.year || '—',
    item.score || '—',
    item.qualification || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Examination (NET/JRF/GATE/SLET/SET etc.)', 'Subject', 'Year', 'Score / Percentile', 'Qualification']],
    body: examRows,
    theme: 'grid',
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 60 },
      2: { cellWidth: 38 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 28, halign: 'center' },
      5: { cellWidth: 26, halign: 'center' },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 1.2;

  // Subnote as in official template
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Examples: UGC-NET, UGC-JRF, CSIR-NET/JRF, GATE, SLET/SET, JEST, GPAT, other National/State/University examinations.',
    margin,
    currentY + 2
  );
  currentY += 4.5;

  // --- SECTION 5: PROFESSIONAL / TEACHING EXPERIENCE ---
  currentY = drawSectionTitle('5. PROFESSIONAL / TEACHING EXPERIENCE', currentY);

  const expList = experience.length > 0 ? experience : [{}];
  const expRows = expList.map((item, index) => [
    index + 1,
    item.institution || '—',
    item.designation || '—',
    item.fromTo || '—',
    item.natureOfWork || '—',
    item.totalExperience || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Institution / Organization', 'Designation', 'From–To', 'Nature of Work', 'Total Experience']],
    body: expRows,
    theme: 'grid',
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 54 },
      2: { cellWidth: 32 },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 30 },
      5: { cellWidth: 26, halign: 'center' },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 6: RESEARCH EXPOSURE / AREA OF INTEREST (if any) ---
  const estimatedExposureHeight = (researchExposure && researchExposure.trim().length > 0)
    ? Math.max(14, doc.splitTextToSize(researchExposure.trim(), contentWidth - 4).length * 3.8 + 6)
    : 12;
  currentY = drawSectionTitle('6. RESEARCH EXPOSURE / AREA OF INTEREST (if any)', currentY, estimatedExposureHeight + 16);

  if (researchExposure && researchExposure.trim().length > 0) {
    const splitExp = doc.splitTextToSize(researchExposure.trim(), contentWidth - 4);
    const boxHeight = Math.max(10, splitExp.length * 3.6 + 3.5);

    doc.setDrawColor(...THEME.borderColor);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, boxHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...THEME.darkText);
    doc.text(splitExp, margin + 2, currentY + 3.5);

    currentY += boxHeight + 4;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(148, 163, 184);
    doc.text('— Nil / Not Specified —', margin + 2, currentY + 3.2);
    currentY += 6;
  }

  // --- SECTION 7: RESEARCH PUBLICATIONS ---
  currentY = drawSectionTitle('7. RESEARCH PUBLICATIONS', currentY);

  const pubList = publications.length > 0 ? publications : [{}];
  const pubRows = pubList.map((item, index) => [
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
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 54 },
      2: { cellWidth: 44 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 26, halign: 'center' },
      5: { cellWidth: 28 },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 8: BOOKS / PATENTS / OTHER RESEARCH OUTPUTS ---
  currentY = drawSectionTitle('8. BOOKS / PATENTS / OTHER RESEARCH OUTPUTS', currentY);

  const bpList = booksPatents.length > 0 ? booksPatents : [{}];
  const bpRows = bpList.map((item, index) => [
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
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 32 },
      2: { cellWidth: 78 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 40 },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 9: PROFESSIONAL MEMBERSHIPS / FELLOWSHIPS / AWARDS ---
  currentY = drawSectionTitle('9. PROFESSIONAL MEMBERSHIPS / FELLOWSHIPS / AWARDS', currentY);

  const memList = memberships.length > 0 ? memberships : [{}];
  const memRows = memList.map((item, index) => [
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
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 58 },
      2: { cellWidth: 46 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 46 },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 10: CONFERENCES / WORKSHOPS / FDPs (Organized/Attended - Optional) ---
  currentY = drawSectionTitle('10. CONFERENCES / WORKSHOPS / FDPs (Organized/Attended - Optional)', currentY);

  const confList = conferences.length > 0 ? conferences : [{}];
  const confRows = confList.map((item, index) => [
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
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 62 },
      2: { cellWidth: 50 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 38 },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 11: REFERENCES ---
  currentY = drawSectionTitle('11. REFERENCES', currentY);

  const refList = references.length > 0 ? references : [{}];
  const refRows = refList.map((item, index) => [
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
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: THEME.darkText,
      cellPadding: 1.2,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 58 },
      2: { cellWidth: 54 },
      3: { cellWidth: 58 },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 12: DOCUMENTS TO BE ENCLOSED ---
  currentY = drawSectionTitle('12. DOCUMENTS TO BE ENCLOSED', currentY, 46);

  const checklistItems = [
    { label: 'Passport Size Photograph', key: 'photo', uploaded: !!docMeta.photo || !!effectivePhoto },
    { label: '10th / SSC Certificate & Marks Memo', key: 'sscCertificate', uploaded: !!docMeta.sscCertificate },
    { label: 'Intermediate / 10+2 Certificate & Marks Memo', key: 'interCertificate', uploaded: !!docMeta.interCertificate },
    { label: "Bachelor's Degree Certificate (UG) & Consolidated Marks Memo", key: 'ugDegree', uploaded: !!docMeta.ugDegree },
    { label: "Master's Degree Certificate (PG) & Consolidated Marks Memo", key: 'pgDegree', uploaded: !!docMeta.pgDegree },
    { label: 'Service / Experience Certificates (Teaching & Industrial)', key: 'expCertificates', uploaded: !!docMeta.expCertificates },
    { label: 'GATE / NET / SLET / SET / JRF / GPAT Qualifying Scorecard', key: 'examCard', uploaded: !!docMeta.examCard },
    { label: 'Category / Community Certificate (if applicable)', key: 'categoryCertificate', uploaded: !!docMeta.categoryCertificate },
    { label: 'Aadhaar Card / Government Identity Proof', key: 'aadharCard', uploaded: !!docMeta.aadharCard },
    { label: 'Application Fee Payment Proof / Receipt', key: 'feeReceipt', uploaded: !!docMeta.feeReceipt },
  ];

  const docRows = checklistItems.map((item, index) => [
    index + 1,
    item.label,
    item.uploaded ? 'Enclosed / Attached' : 'Not Attached',
    docMeta[item.key]?.fileName || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No.', 'Document Description', 'Status', 'File Name']],
    body: docRows,
    theme: 'grid',
    headStyles: {
      fillColor: THEME.headerFill,
      textColor: THEME.darkText,
      fontSize: 7,
      fontStyle: 'bold',
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: THEME.darkText,
      cellPadding: 1.1,
      lineColor: THEME.borderColor,
      lineWidth: 0.2,
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 84 },
      2: { cellWidth: 38, halign: 'center' },
      3: { cellWidth: 48 },
    },
    margin: tableMargin,
    didDrawPage: () => {
      drawPageHeader(8);
    },
  });

  currentY = doc.lastAutoTable.finalY + 3;

  // --- SECTION 13: DECLARATION ---
  currentY = drawSectionTitle('13. DECLARATION', currentY, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...THEME.darkText);
  const declarationText =
    'I declare that the information furnished above is true, complete and correct to the best of my knowledge and belief. I understand that any false or incorrect information may lead to rejection/cancellation of my application/admission as per University rules.';
  const splitDec = doc.splitTextToSize(declarationText, contentWidth);
  doc.text(splitDec, margin, currentY + 3);
  currentY += splitDec.length * 3.5 + 4;

  if (currentY > pageHeight - 22) {
    doc.addPage();
    currentY = drawPageHeader(8) + 4;
  }

  // Place, Date, Signature in official row
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...THEME.darkText);

  doc.text(`Place: ${declaration.place || '—'}`, margin, currentY);
  doc.text(`Date: ${declaration.date || submittedAt}`, margin + 50, currentY);

  const sigName = declaration.typedSignature || personal.fullName || 'Digitally Verified';
  doc.text(`Signature of Candidate: ${sigName}`, pageWidth - margin, currentY, { align: 'right' });

  // ==========================================
  // SECTION 14: ENCLOSED UPLOADED DOCUMENTS
  // ==========================================
  const docMetaObj = application.document_metadata || application.documentMetadata || {};
  const applicationId = application.id || application.application_number || '';
  const applicantName = personal.fullName || application.applicant_name || 'Candidate';

  // Base document specs sequence
  const documentOrder = [
    { key: 'sscCertificate', label: '10th / SSC Certificate (Date of Birth Proof)' },
    { key: 'interCertificate', label: 'Intermediate / 10+2 / Diploma Certificate' },
    { key: 'ugDegree', label: "Bachelor's Degree & Consolidated Marksheets" },
    { key: 'pgDegree', label: "Master's Degree & Consolidated Marksheets" },
    { key: 'expCertificates', label: 'Experience Certificate(s)' },
    { key: 'examCard', label: 'GATE / NET / SLET / Score Card' },
    { key: 'categoryCertificate', label: 'Category / Community Certificate' },
    { key: 'aadharCard', label: 'Aadhaar Card (Identity Proof)' },
    { key: 'feeReceipt', label: 'Application Fee Payment Transaction Slip' },
    { key: 'photo', label: 'Recent Passport Size Photograph' },
  ];

  // Include any extra documents uploaded
  const extraKeys = Object.keys(docMetaObj).filter(
    (k) => !documentOrder.some((item) => item.key === k)
  );
  for (const k of extraKeys) {
    documentOrder.push({
      key: k,
      label: docMetaObj[k]?.fileName || k.replace(/([A-Z])/g, ' $1'),
    });
  }

  // Resolve all available uploaded document contents in parallel
  const resolvedDocsResults = await Promise.all(
    documentOrder.map(async (item) => {
      const meta = docMetaObj[item.key];
      if (!meta) return null;
      try {
        const data = await resolveDocumentContent(meta, item.key, applicationId);
        if (data) {
          return {
            ...item,
            ...data,
          };
        }
      } catch (docErr) {
        console.warn(`Could not resolve document ${item.key}:`, docErr);
      }
      return null;
    })
  );
  const resolvedDocs = resolvedDocsResults.filter(Boolean);

  const pdfDocsToMerge = [];

  if (resolvedDocs.length > 0) {
    // 1. Add Annexure Overview / Checklist Page
    doc.addPage();
    let annexY = drawPageHeader(8, 'ANNEXURE: ENCLOSED UPLOADED DOCUMENTS');

    doc.setFillColor(7, 40, 73);
    doc.rect(margin, annexY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('ANNEXURE · VERIFIED APPLICANT ENCLOSURES & UPLOADED CERTIFICATES', margin + 3, annexY + 4.8);

    annexY += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...THEME.darkText);
    doc.text(
      `The following ${resolvedDocs.length} original document attachment(s) have been submitted by the candidate with Application No: ${appNumber}. Each document is reproduced in this file as received:`,
      margin,
      annexY
    );
    annexY += 4;

    const annexTableRows = resolvedDocs.map((d, idx) => {
      const isPdf =
        d.contentType?.includes('pdf') ||
        d.fileName?.toLowerCase().endsWith('.pdf') ||
        (d.dataUrl && d.dataUrl.startsWith('data:application/pdf'));
      return [
        idx + 1,
        d.label,
        d.fileName || 'document',
        isPdf ? 'PDF Document' : 'Scanned Image (JPG/PNG)',
        'Attached & Verified',
      ];
    });

    autoTable(doc, {
      startY: annexY,
      head: [['#', 'Document Enclosure Description', 'Uploaded File Name', 'Format', 'Status']],
      body: annexTableRows,
      theme: 'grid',
      headStyles: {
        fillColor: THEME.headerFill,
        textColor: THEME.darkText,
        fontSize: 7,
        fontStyle: 'bold',
        lineColor: THEME.borderColor,
        lineWidth: 0.2,
      },
      bodyStyles: {
        fontSize: 6.8,
        textColor: THEME.darkText,
        cellPadding: 1.5,
        lineColor: THEME.borderColor,
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 70 },
        2: { cellWidth: 50 },
        3: { cellWidth: 26, halign: 'center' },
        4: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
      },
      margin: tableMargin,
    });

    // 2. Render each document
    for (const docItem of resolvedDocs) {
      const isPdf =
        docItem.contentType?.toLowerCase().includes('pdf') ||
        docItem.fileName?.toLowerCase().endsWith('.pdf') ||
        (docItem.dataUrl && docItem.dataUrl.startsWith('data:application/pdf'));

      const effectiveDataUrl =
        docItem.dataUrl ||
        (!isPdf && docItem.arrayBuffer
          ? arrayBufferToDataUrl(docItem.arrayBuffer, docItem.contentType || 'image/jpeg')
          : null);

      if (!isPdf && effectiveDataUrl) {
        // Render Image Document page in jsPDF
        doc.addPage();
        drawPageHeader(8, `ENCLOSURE: ${docItem.label}`);

        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, 20, contentWidth, 12, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(7, 40, 73);
        doc.text(`ENCLOSURE: ${docItem.label.toUpperCase()}`, margin + 3, 25);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(71, 85, 105);
        doc.text(
          `Candidate: ${applicantName} | Application No: ${appNumber} | File: ${docItem.fileName || 'enclosure.img'}`,
          margin + 3,
          29.5
        );

        const frameY = 34;
        const maxW = contentWidth; // 182 mm
        const maxH = pageHeight - frameY - 14; // ~249 mm

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, frameY, maxW, maxH, 'FD');

        try {
          const dims = await getImageNaturalDimensions(effectiveDataUrl);
          let drawW = maxW - 4;
          let drawH = maxH - 4;
          let drawX = margin + 2;
          let drawY = frameY + 2;

          if (dims && dims.width > 0 && dims.height > 0) {
            const imgAspect = dims.width / dims.height;
            const frameAspect = (maxW - 4) / (maxH - 4);

            if (imgAspect > frameAspect) {
              drawW = maxW - 4;
              drawH = drawW / imgAspect;
              drawX = margin + 2;
              drawY = frameY + 2 + ((maxH - 4) - drawH) / 2;
            } else {
              drawH = maxH - 4;
              drawW = drawH * imgAspect;
              drawX = margin + 2 + ((maxW - 4) - drawW) / 2;
              drawY = frameY + 2;
            }
          }

          let format = 'JPEG';
          if (effectiveDataUrl.startsWith('data:image/png')) {
            format = 'PNG';
          } else if (effectiveDataUrl.startsWith('data:image/webp')) {
            format = 'WEBP';
          }
          try {
            doc.addImage(effectiveDataUrl, format, drawX, drawY, drawW, drawH, undefined, 'FAST');
          } catch (formatErr) {
            doc.addImage(effectiveDataUrl, undefined, drawX, drawY, drawW, drawH, undefined, 'FAST');
          }
        } catch (imgErr) {
          console.warn('Could not add enclosure image to PDF:', imgErr);
        }
      } else if (isPdf) {
        // Collect for pdf-lib merging
        pdfDocsToMerge.push(docItem);

        // Add enclosure divider page
        doc.addPage();
        drawPageHeader(8, `ENCLOSURE: ${docItem.label}`);

        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, 20, contentWidth, 13, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(7, 40, 73);
        doc.text(`ENCLOSURE: ${docItem.label.toUpperCase()}`, margin + 3, 25.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(71, 85, 105);
        doc.text(
          `Candidate: ${applicantName} | Application No: ${appNumber} | Attached PDF: ${docItem.fileName || 'document.pdf'}`,
          margin + 3,
          30
        );

        // Callout box
        doc.setFillColor(254, 243, 199);
        doc.setDrawColor(245, 158, 11);
        doc.rect(margin, 38, contentWidth, 22, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(146, 64, 14);
        doc.text('ORIGINAL PDF DOCUMENT ENCLOSURE', margin + 4, 45);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(180, 83, 9);
        doc.text(
          'The candidate uploaded a multi-page PDF document for this enclosure requirement.',
          margin + 4,
          50.5
        );
        doc.text(
          'The complete original document page(s) follow immediately after this sheet.',
          margin + 4,
          55
        );
      }
    }
  }

  // ==========================================
  // RUNNING FOOTERS ON ALL PAGES
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...THEME.borderColor);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 10.5, pageWidth - margin, pageHeight - 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Application for Ph.D. Admission', margin, pageHeight - 6.5);
    doc.text(`Application No: ${appNumber}`, pageWidth / 2, pageHeight - 6.5, { align: 'center' });
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  }

  // Merge any PDF attachments using pdf-lib
  if (pdfDocsToMerge.length > 0) {
    try {
      const jsPdfArrayBuffer = doc.output('arraybuffer');
      const mergedPdf = await PDFDocument.load(jsPdfArrayBuffer);

      for (const pdfItem of pdfDocsToMerge) {
        let srcBytes = pdfItem.arrayBuffer;
        if (!srcBytes && pdfItem.dataUrl) {
          srcBytes = base64ToUint8Array(pdfItem.dataUrl);
        }

        if (srcBytes) {
          try {
            const attachedDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(attachedDoc, attachedDoc.getPageIndices());
            for (const p of copiedPages) {
              mergedPdf.addPage(p);
            }
          } catch (loadErr) {
            console.warn(`Could not load attached PDF ${pdfItem.label}:`, loadErr);
          }
        }
      }

      const finalPdfBytes = await mergedPdf.save();

      // Wrap doc.save and doc.output to return merged finalPdfBytes
      doc.save = function (fileName) {
        const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `NRIIT-PHD-${appNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      };

      const originalOutput = doc.output.bind(doc);
      doc.output = function (type, options) {
        if (type === 'blob') {
          return new Blob([finalPdfBytes], { type: 'application/pdf' });
        }
        if (type === 'bloburl') {
          const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
          return URL.createObjectURL(blob);
        }
        if (type === 'arraybuffer') {
          return finalPdfBytes.buffer;
        }
        if (type === 'dataurlnewwindow') {
          const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          return url;
        }
        return originalOutput(type, options);
      };
    } catch (mergeErr) {
      console.warn('Failed to merge PDF documents with pdf-lib, falling back to jsPDF:', mergeErr);
    }
  }

  return doc;
}

/**
 * Export tabular overview of applications as a formatted PDF report
 */
export async function exportApplicationsListPdf(applications, reportTitle = 'Ph.D. Admissions Applications Report') {
  if (!applications || applications.length === 0) {
    alert('No application records to export.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297
  const pageHeight = doc.internal.pageSize.getHeight(); // 210
  const margin = 14;

  const logoBase64 = await getNriLogoBase64();
  let currentY = 12;

  // Header
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', margin, currentY, 36, 14);
    } catch (e) {
      console.warn('[PDF] Failed to render header logo:', e);
    }
  }

  const headerLeftX = logoBase64 ? margin + 40 : margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(7, 40, 73);
  doc.text('Dr RVR NRI INSTITUTE OF TECHNOLOGY', headerLeftX, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('(Deemed to be University) · Directorate of Research & Development', headerLeftX, currentY + 9);
  doc.text('Pothavarappadu, Agiripalli, Vijayawada Rural, A.P. – 521212 | Ph.D. Admissions Scrutiny Portal', headerLeftX, currentY + 13.5);

  currentY += 19;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 5;

  // Title and metadata bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(7, 40, 73);
  doc.text(reportTitle.toUpperCase(), margin, currentY);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${dateStr} | Total Records: ${applications.length}`, pageWidth - margin, currentY, { align: 'right' });

  currentY += 4;

  // Build rows for autoTable
  const tableRows = applications.map((app, index) => {
    const p = app.personal_details || {};
    const name = p.fullName || app.applicant_name || '—';
    const email = p.email || app.applicant_email || '';
    const phone = p.mobileNumber || app.applicant_phone || '';
    const applicantInfo = [name, email, phone].filter(Boolean).join('\n');

    const prog = p.programme || app.programme || '—';
    const spec = p.specialization || app.specialization || '';
    const progInfo = spec ? `${prog}\n(${spec})` : prog;

    const category = p.admissionCategory || app.admission_category || '—';

    let dateText = '—';
    if (app.status === 'draft') {
      dateText = 'Draft (In-Progress)';
    } else if (app.submitted_at) {
      dateText = new Date(app.submitted_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    const statusMap = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    const statusText = statusMap[app.status] || app.status || '—';

    return [index + 1, applicantInfo, progInfo, category, dateText, statusText];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Applicant Name & Contact', 'Programme & Specialization', 'Category', 'Submission Date', 'Status']],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      textColor: [15, 23, 42],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [7, 40, 73],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 68 },
      2: { cellWidth: 72 },
      3: { cellWidth: 50 },
      4: { cellWidth: 35 },
      5: { cellWidth: 34, fontStyle: 'bold', halign: 'center' },
    },
    margin: { left: margin, right: margin, top: 14, bottom: 14 },
    didDrawPage: () => {
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      if (pageNum > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Dr RVR NRI Institute of Technology — Ph.D. Admissions Table Report', margin, 9);
        doc.line(margin, 11, pageWidth - margin, 11);
      }
    },
  });

  // Add footers on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Dr RVR NRIIT — Confidential Ph.D. Scrutiny Records', margin, pageHeight - 5.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5.5, { align: 'right' });
  }

  const filenameDate = new Date().toISOString().split('T')[0];
  const safeTitle = reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  doc.save(`${safeTitle}_${filenameDate}.pdf`);

  return doc;
}

