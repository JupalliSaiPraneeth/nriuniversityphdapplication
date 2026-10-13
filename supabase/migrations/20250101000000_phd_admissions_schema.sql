-- ==============================================================================
-- Dr RVR NRI Institute of Technology - Ph.D. Admission System Database Schema
-- Migration: 20250101000000_phd_admissions_schema.sql
-- ==============================================================================

-- 1. Create custom types and sequences
CREATE SEQUENCE IF NOT EXISTS phd_application_number_seq START WITH 1001 INCREMENT BY 1;

-- 2. Applications Table
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
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ
);

-- Indexes for performance and quick searching
CREATE INDEX IF NOT EXISTS idx_applications_app_number ON public.applications (application_number);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (applicant_email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_user ON public.applications (applicant_user_id);

-- 3. Normalized Document Records Table
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

-- 4. User Roles Table for RBAC
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'reviewer', 'applicant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Helper Function: Check if current user is administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'reviewer')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger Function: Generate Safe Human-Readable Application Number Server-Side
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
EXECUTE FUNCTION public.generate_phd_application_number();

-- 7. Trigger Function: Automatically Update updated_at Timestamp
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

-- 8. Row Level Security (RLS) Configuration
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Applications Policies:
-- 8.1 Anyone (including guests or authenticated applicants) can submit a new application
CREATE POLICY "Applicants can insert new application"
ON public.applications
FOR INSERT
WITH CHECK (true);

-- 8.2 Applicants can read their own draft/submitted application
CREATE POLICY "Applicants can read own applications"
ON public.applications
FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND applicant_user_id = auth.uid()) OR
    public.is_admin()
);

-- 8.3 Applicants can ONLY modify DRAFT applications; submitted applications are locked!
CREATE POLICY "Applicants can update draft applications only"
ON public.applications
FOR UPDATE
USING (
    (auth.uid() IS NOT NULL AND applicant_user_id = auth.uid() AND status = 'draft') OR
    public.is_admin()
)
WITH CHECK (
    (auth.uid() IS NOT NULL AND applicant_user_id = auth.uid() AND status = 'draft') OR
    public.is_admin()
);

-- 8.4 Admins have full access
CREATE POLICY "Admins have full access to applications"
ON public.applications
FOR ALL
USING (public.is_admin());

-- Documents Policies:
CREATE POLICY "Anyone can insert documents during application submission"
ON public.application_documents
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users and admins can view documents for authorized applications"
ON public.application_documents
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.applications a
        WHERE a.id = application_documents.application_id
        AND (a.applicant_user_id = auth.uid() OR public.is_admin())
    )
);

-- User roles policies
CREATE POLICY "Admins can view user roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin() OR auth.uid() = user_id);

-- 9. Storage Setup Instructions
-- Run this in Supabase SQL editor to create the private storage bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('phd-documents', 'phd-documents', false)
-- ON CONFLICT (id) DO NOTHING;
