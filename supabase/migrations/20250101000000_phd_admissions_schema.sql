-- ==============================================================================
-- Dr RVR NRI Institute of Technology - Ph.D. Admission System Database Schema
-- Run this entire script in Supabase: Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create Sequence for official Ph.D. Application Numbers (Format: NRIIT-PHD-YYYY-XXXX)
CREATE SEQUENCE IF NOT EXISTS phd_application_number_seq START WITH 1001 INCREMENT BY 1;

-- 2. Applications Table (Supports all 13 sections of the official NRIIT Ph.D. Application)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    applicant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    programme TEXT,
    specialization TEXT,
    admission_category TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    
    -- Structured 13 sections
    personal_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    address_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    educational_qualifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility_examinations JSONB NOT NULL DEFAULT '[]'::jsonb,
    professional_experience JSONB NOT NULL DEFAULT '[]'::jsonb,
    research_exposure TEXT DEFAULT '',
    research_publications JSONB NOT NULL DEFAULT '[]'::jsonb,
    books_patents_outputs JSONB NOT NULL DEFAULT '[]'::jsonb,
    memberships_awards JSONB NOT NULL DEFAULT '[]'::jsonb,
    conferences_workshops JSONB NOT NULL DEFAULT '[]'::jsonb,
    references_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    declaration JSONB NOT NULL DEFAULT '{}'::jsonb,
    document_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Administrative fields
    pdf_storage_path TEXT,
    reviewer_notes TEXT,
    reviewed_by TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ
);

-- Indexes for performance, fast search and scrutiny filtering
CREATE INDEX IF NOT EXISTS idx_applications_app_number ON public.applications (application_number);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (applicant_email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);

-- 3. Normalized Application Documents Table
CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    content_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_application_documents_app_id ON public.application_documents (application_id);

-- 4. Trigger Function: Automatically Generate Application Number (e.g. NRIIT-PHD-2025-1001)
CREATE OR REPLACE FUNCTION public.generate_phd_application_number()
RETURNS trigger AS $$
DECLARE
    current_year text;
    next_num text;
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' OR NEW.application_number LIKE 'DRAFT-%' THEN
        current_year := to_char(CURRENT_DATE, 'YYYY');
        next_num := lpad(nextval('phd_application_number_seq')::text, 4, '0');
        NEW.application_number := 'NRIIT-PHD-' || current_year || '-' || next_num;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_app_num ON public.applications;
CREATE TRIGGER trigger_generate_app_num
BEFORE INSERT ON public.applications
FOR EACH ROW
WHEN (NEW.status = 'submitted')
EXECUTE FUNCTION public.generate_phd_application_number();

-- 5. Trigger Function: Automatically Update updated_at Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_handle_updated_at ON public.applications;
CREATE TRIGGER trigger_handle_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 6. Storage Bucket for Candidate Certificates & Documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('phd-documents', 'phd-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- 7.1 Applications Table Policies
DROP POLICY IF EXISTS "Allow select applications" ON public.applications;
CREATE POLICY "Allow select applications" ON public.applications
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert applications" ON public.applications;
CREATE POLICY "Allow insert applications" ON public.applications
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update applications" ON public.applications;
CREATE POLICY "Allow update applications" ON public.applications
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete applications" ON public.applications;
CREATE POLICY "Allow delete applications" ON public.applications
FOR DELETE USING (true);

-- 7.2 Application Documents Table Policies
DROP POLICY IF EXISTS "Allow select documents" ON public.application_documents;
CREATE POLICY "Allow select documents" ON public.application_documents
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert documents" ON public.application_documents;
CREATE POLICY "Allow insert documents" ON public.application_documents
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete documents" ON public.application_documents;
CREATE POLICY "Allow delete documents" ON public.application_documents
FOR DELETE USING (true);

-- 7.3 Storage Bucket Policies (storage.objects)
DROP POLICY IF EXISTS "Allow upload to phd-documents" ON storage.objects;
CREATE POLICY "Allow upload to phd-documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'phd-documents');

DROP POLICY IF EXISTS "Allow select from phd-documents" ON storage.objects;
CREATE POLICY "Allow select from phd-documents" ON storage.objects
FOR SELECT USING (bucket_id = 'phd-documents');

DROP POLICY IF EXISTS "Allow update to phd-documents" ON storage.objects;
CREATE POLICY "Allow update to phd-documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'phd-documents');

DROP POLICY IF EXISTS "Allow delete from phd-documents" ON storage.objects;
CREATE POLICY "Allow delete from phd-documents" ON storage.objects
FOR DELETE USING (bucket_id = 'phd-documents');
