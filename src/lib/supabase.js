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
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `NRIIT-PHD-${year}-${randomSuffix}`;
}

// Check if error is due to missing schema table
function isTableMissingError(error) {
  if (!error) return false;
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('schema cache'))
  );
}

// Local Persistent Store (Simulates Supabase when live credentials or tables are not yet set)
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

  // Check if live Supabase table is created
  async checkSchemaStatus() {
    if (!isSupabaseConfigured() || !supabase) {
      return { configured: false, tableReady: false, message: 'Local DB Active' };
    }
    try {
      const { error } = await supabase.from('applications').select('id').limit(1);
      if (error && isTableMissingError(error)) {
        return {
          configured: true,
          tableReady: false,
          message: 'Connected to Supabase (SQL Migration Pending)',
        };
      }
      if (error) {
        return { configured: true, tableReady: false, message: error.message };
      }
      return { configured: true, tableReady: true, message: 'Supabase Live & Synchronized' };
    } catch (err) {
      return { configured: true, tableReady: false, message: err.message };
    }
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
      try {
        const { data, error } = await supabase
          .from('applications')
          .upsert(draftRecord, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          if (isTableMissingError(error)) {
            console.warn('[Supabase] applications table not found in Supabase. Auto-saving to local store.');
          } else {
            throw error;
          }
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) {
          console.warn('[Supabase] Draft save error:', err);
        }
      }
    }

    // Local fallback
    const apps = getLocalApps();
    const existingIndex = apps.findIndex((a) => a.id === draftRecord.id);
    if (existingIndex >= 0) {
      apps[existingIndex] = { ...apps[existingIndex], ...draftRecord };
    } else {
      apps.unshift(draftRecord);
    }
    saveLocalApps(apps);
    return draftRecord;
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
      try {
        const { data, error } = await supabase
          .from('applications')
          .upsert(applicationRecord, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          if (isTableMissingError(error)) {
            console.warn('[Supabase] applications table not found in Supabase. Saving to local store.');
          } else {
            throw error;
          }
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) {
          throw err;
        }
      }
    }

    // Local fallback
    const apps = getLocalApps();
    apps.unshift(applicationRecord);
    saveLocalApps(apps);
    return applicationRecord;
  },

  // Upload document to private storage
  async uploadDocument(applicationId, docType, file) {
    const extension = file.name ? file.name.split('.').pop() : 'bin';
    const filePath = `${applicationId}/${docType}_${Date.now()}.${extension}`;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.storage
          .from(storageBucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          // Record normalized metadata in application_documents table if table exists
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
            // Ignore if documents table is not yet migrated
          }

          return {
            docType,
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type,
            storagePath: data.path,
            uploadedAt: new Date().toISOString(),
          };
        }
      } catch (storageErr) {
        console.warn('[Supabase Storage] Storage upload warning:', storageErr);
      }
    }

    // Local fallback: read file to data URL
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
      try {
        const { data, error } = await supabase.storage
          .from(storageBucket)
          .createSignedUrl(storagePath, 3600); // 1 hour valid
        if (!error && data?.signedUrl) {
          return data.signedUrl;
        }
      } catch (err) {
        console.warn('Error creating signed URL:', err);
      }
    }

    return null;
  },

  // Get single application
  async getApplication(idOrNumber) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .or(`id.eq.${idOrNumber},application_number.eq.${idOrNumber}`)
          .single();
        if (!error && data) return data;
      } catch (err) {
        // Fall back to local
      }
    }
    const apps = getLocalApps();
    return apps.find((a) => a.id === idOrNumber || a.application_number === idOrNumber) || null;
  },

  // Get all applications with search and filters
  async getApplications(options = {}) {
    const { status, programme, admissionCategory, searchQuery } = options;

    if (isSupabaseConfigured()) {
      try {
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
        if (!error && data) {
          return data;
        }
        if (error && isTableMissingError(error)) {
          console.warn('[Supabase] applications table not found in Supabase. Reading from local store.');
        }
      } catch (err) {
        console.warn('[Supabase] fetch applications error:', err);
      }
    }

    // Local fallback
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
      try {
        const { data, error } = await supabase
          .from('applications')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        // Fall back to local
      }
    }

    const apps = getLocalApps();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx >= 0) {
      apps[idx] = { ...apps[idx], ...updatePayload };
      saveLocalApps(apps);
      return apps[idx];
    }
    throw new Error('Application not found');
  },

  // Delete application
  async deleteApplication(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        // Fall back to local
      }
    }

    const apps = getLocalApps();
    const updated = apps.filter((a) => a.id !== id && a.application_number !== id);
    saveLocalApps(updated);
    return true;
  },
};
