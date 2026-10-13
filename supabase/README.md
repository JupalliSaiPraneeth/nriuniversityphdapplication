# Supabase Database & Storage Setup Guide
## Dr RVR NRI Institute of Technology - Ph.D. Admission Portal

This project is built to integrate with Supabase PostgreSQL and Supabase Private Storage.

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public key** from `Settings` -> `API`.

### Step 2: Run SQL Migrations
1. Open the **SQL Editor** in your Supabase dashboard.
2. Copy and paste the contents of `supabase/migrations/20250101000000_phd_admissions_schema.sql`.
3. Click **Run** to execute the migration. This creates:
   - `applications` table with all 13 sections as structured JSONB / scalar columns.
   - `application_documents` table for normalized audit metadata.
   - `user_roles` table for Role-Based Access Control.
   - Atomic server-side application number generator (`generate_phd_application_number`).
   - Secure Row-Level Security (RLS) policies protecting candidate personal data.

### Step 3: Configure Private Storage Bucket
In the SQL Editor or under **Storage** -> **Buckets**:
1. Create a bucket named `phd-documents`.
2. Toggle **Public bucket** to **OFF** (Keep it private so identity documents like Aadhaar, marksheets, and receipts are never exposed publicly).
3. Set RLS policies for storage or use the provided migration.

### Step 4: Configure Admin User
To promote a user to administrator:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<YOUR_SUPABASE_AUTH_USER_UUID>', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Step 5: Environment Variables
Create or edit `.env` in the root of the project:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_STORAGE_BUCKET=phd-documents
VITE_ADMIN_ACCESS_CODE=NRIIT_PHD_ADMIN_2025
```

> **Note on Resilient Architecture**: When live Supabase credentials are not yet configured or when developing offline, the application automatically uses a persistent local storage driver that replicates the PostgreSQL schema, server functions, and RLS rules, allowing testing without blockers!
