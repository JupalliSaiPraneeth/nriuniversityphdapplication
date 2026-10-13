import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'phd-documents';

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-ref') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 20 &&
    !supabaseAnonKey.includes('your-anon-public-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Unique Application Number Generator (Format: NRIIT-PHD-YYYY-XXXX)
export function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const timeSlice = Date.now().toString().slice(-4);
  return `NRIIT-PHD-${year}-${randomSuffix}`;
}

// Local Persistent Store (Simulates Supabase when live credentials are not set)
const LOCAL_STORAGE_KEY = 'nriit_phd_applications_v1';
const LOCAL_DOCS_KEY = 'nriit_phd_documents_v1';

let memoryApps = [];
let memoryDocs = {};

function getLocalApps() {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : memoryApps;
    } catch (e) {
      return memoryApps;
    }
  }
  return memoryApps;
}

function saveLocalApps(apps) {
  memoryApps = apps;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      // ignore
    }
  }
}

function getLocalDocs() {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_DOCS_KEY);
      return raw ? JSON.parse(raw) : memoryDocs;
    } catch (e) {
      return memoryDocs;
    }
  }
  return memoryDocs;
}

function saveLocalDocs(docs) {
  memoryDocs = docs;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docs));
    } catch (e) {
      // ignore
    }
  }
}

// Unified Database Service
export const dbService = {
  isConfigured() {
    return isSupabaseConfigured();
  },

  // Save draft
  async saveDraft(formData) {
    const appNumber = formData.applicationNumber || `DRAFT-${Date.now().toString().slice(-6)}`;
    const draftRecord = {
      id: formData.id || crypto.randomUUID(),
      application_number: appNumber,
      applicant_name: formData.personalDetails?.fullName || 'Draft Applicant',
      applicant_email: formData.personalDetails?.email || '',
      applicant_phone: formData.personalDetails?.mobileNumber || '',
      programme: formData.personalDetails?.programme || '',
      specialization: formData.personalDetails?.specialization || '',
      admission_category: formData.personalDetails?.admissionCategory || '',
      status: 'draft',
      personal_details: formData.personalDetails || {},
      address_details: formData.addressDetails || {},
      educational_qualifications: formData.educationalQualifications || [],
      eligibility_examinations: formData.eligibilityExaminations || [],
      professional_experience: formData.professionalExperience || [],
      research_exposure: formData.researchExposure || '',
      research_publications: formData.researchPublications || [],
      books_patents_outputs: formData.booksPatentsOutputs || [],
      memberships_awards: formData.membershipsAwards || [],
      conferences_workshops: formData.conferencesWorkshops || [],
      references_data: formData.references || [],
      declaration: formData.declaration || {},
      document_metadata: formData.documentMetadata || {},
      updated_at: new Date().toISOString(),
      created_at: formData.createdAt || new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('applications')
        .upsert(draftRecord, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const apps = getLocalApps();
      const existingIndex = apps.findIndex((a) => a.id === draftRecord.id);
      if (existingIndex >= 0) {
        apps[existingIndex] = { ...apps[existingIndex], ...draftRecord };
      } else {
        apps.unshift(draftRecord);
      }
      saveLocalApps(apps);
      return draftRecord;
    }
  },

  // Final Submit
  async submitApplication(formData, fileObjects = {}) {
    const newAppNumber = generateApplicationNumber();
    const submissionId = formData.id || crypto.randomUUID();
    const now = new Date().toISOString();

    // Process uploaded documents
    const uploadedDocsMeta = {};
    for (const [docKey, file] of Object.entries(fileObjects)) {
      if (file && (file instanceof File || file instanceof Blob)) {
        try {
          const docMeta = await this.uploadDocument(submissionId, docKey, file);
          uploadedDocsMeta[docKey] = docMeta;
        } catch (err) {
          console.warn(`Failed to upload document ${docKey}:`, err);
        }
      }
    }

    const mergedDocMeta = {
      ...(formData.documentMetadata || {}),
      ...uploadedDocsMeta,
    };

    const applicationRecord = {
      id: submissionId,
      application_number: newAppNumber,
      applicant_name: formData.personalDetails?.fullName || '',
      applicant_email: formData.personalDetails?.email || '',
      applicant_phone: formData.personalDetails?.mobileNumber || '',
      programme: formData.personalDetails?.programme || '',
      specialization: formData.personalDetails?.specialization || '',
      admission_category: formData.personalDetails?.admissionCategory || '',
      status: 'submitted',
      personal_details: formData.personalDetails || {},
      address_details: formData.addressDetails || {},
      educational_qualifications: formData.educationalQualifications || [],
      eligibility_examinations: formData.eligibilityExaminations || [],
      professional_experience: formData.professionalExperience || [],
      research_exposure: formData.researchExposure || '',
      research_publications: formData.researchPublications || [],
      books_patents_outputs: formData.booksPatentsOutputs || [],
      memberships_awards: formData.membershipsAwards || [],
      conferences_workshops: formData.conferencesWorkshops || [],
      references_data: formData.references || [],
      declaration: {
        ...(formData.declaration || {}),
        submittedAt: now,
      },
      document_metadata: mergedDocMeta,
      submitted_at: now,
      created_at: formData.createdAt || now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationRecord])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const apps = getLocalApps();
      apps.unshift(applicationRecord);
      saveLocalApps(apps);
      return applicationRecord;
    }
  },

  // Upload document to private storage
  async uploadDocument(applicationId, docType, file) {
    const extension = file.name ? file.name.split('.').pop() : 'bin';
    const filePath = `${applicationId}/${docType}_${Date.now()}.${extension}`;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`Storage error uploading ${docType}:`, error);
        throw error;
      }

      // Record normalized metadata in application_documents table
      try {
        await supabase.from('application_documents').insert([
          {
            application_id: applicationId,
            document_type: docType,
            storage_path: data.path,
            file_name: file.name,
            file_size: file.size,
            content_type: file.type,
          },
        ]);
      } catch (docErr) {
        console.warn('Could not insert application_document record:', docErr);
      }

      return {
        docType,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        storagePath: data.path,
        uploadedAt: new Date().toISOString(),
      };
    } else {
      // Local fallback: read file to data URL or object URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const docs = getLocalDocs();
          const docKey = `${applicationId}_${docType}`;
          docs[docKey] = {
            dataUrl: reader.result,
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type,
          };
          saveLocalDocs(docs);

          resolve({
            docType,
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type,
            storagePath: `local://${docKey}`,
            uploadedAt: new Date().toISOString(),
          });
        };
        reader.onerror = () => {
          resolve({
            docType,
            fileName: file.name || 'document',
            fileSize: file.size || 0,
            storagePath: `local://fallback`,
            uploadedAt: new Date().toISOString(),
          });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // Get Signed URL for private document
  async getDocumentUrl(storagePath) {
    if (!storagePath) return null;

    if (storagePath.startsWith('local://')) {
      const docKey = storagePath.replace('local://', '');
      const docs = getLocalDocs();
      return docs[docKey]?.dataUrl || null;
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.storage
        .from(storageBucket)
        .createSignedUrl(storagePath, 3600); // 1 hour valid
      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }
      return data.signedUrl;
    }

    return null;
  },

  // Get single application
  async getApplication(idOrNumber) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .or(`id.eq.${idOrNumber},application_number.eq.${idOrNumber}`)
        .single();
      if (error) throw error;
      return data;
    } else {
      const apps = getLocalApps();
      return apps.find((a) => a.id === idOrNumber || a.application_number === idOrNumber) || null;
    }
  },

  // Get all applications with search and filters
  async getApplications(options = {}) {
    const { status, programme, admissionCategory, searchQuery } = options;

    if (isSupabaseConfigured()) {
      let query = supabase.from('applications').select('*').order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (programme && programme !== 'all') {
        query = query.eq('programme', programme);
      }
      if (admissionCategory && admissionCategory !== 'all') {
        query = query.eq('admission_category', admissionCategory);
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim();
        query = query.or(
          `application_number.ilike.%${q}%,applicant_name.ilike.%${q}%,applicant_email.ilike.%${q}%,applicant_phone.ilike.%${q}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } else {
      let apps = getLocalApps();

      if (status && status !== 'all') {
        apps = apps.filter((a) => a.status === status);
      }
      if (programme && programme !== 'all') {
        apps = apps.filter((a) => a.programme === programme);
      }
      if (admissionCategory && admissionCategory !== 'all') {
        apps = apps.filter((a) => a.admission_category === admissionCategory);
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        apps = apps.filter(
          (a) =>
            (a.application_number && a.application_number.toLowerCase().includes(q)) ||
            (a.applicant_name && a.applicant_name.toLowerCase().includes(q)) ||
            (a.applicant_email && a.applicant_email.toLowerCase().includes(q)) ||
            (a.applicant_phone && a.applicant_phone.toLowerCase().includes(q)) ||
            (a.specialization && a.specialization.toLowerCase().includes(q))
        );
      }

      return apps;
    }
  },

  // Update status and reviewer notes
  async updateApplicationStatus(id, newStatus, reviewerNotes, reviewerId = null) {
    const updatePayload = {
      status: newStatus,
      reviewer_notes: reviewerNotes,
      reviewed_by: reviewerId,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('applications')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const apps = getLocalApps();
      const idx = apps.findIndex((a) => a.id === id);
      if (idx >= 0) {
        apps[idx] = { ...apps[idx], ...updatePayload };
        saveLocalApps(apps);
        return apps[idx];
      }
      throw new Error('Application not found');
    }
  },
};
