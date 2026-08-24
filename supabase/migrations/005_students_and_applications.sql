-- Migration 005: Enrolled Students, 8-Stage Applications & Student Documents

-- 1. Enrolled Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_number VARCHAR(50) NOT NULL,
    converted_from_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_normalized VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    highest_qualification VARCHAR(100),
    qualification_details TEXT,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    emergency_contact VARCHAR(20),
    assigned_counsellor UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'active', 'fees_pending', 'on_hold', 'graduated', 'cancelled')),
    enrolled_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, student_number)
);

-- 2. 8-Stage University Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    application_number VARCHAR(50) NOT NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    assigned_counsellor UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admission_session VARCHAR(50) DEFAULT 'July 2026',
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'enquiry' CHECK (status IN (
        'enquiry', 'application_started', 'documents_pending', 'under_verification',
        'fee_pending', 'submitted', 'approved', 'rejected', 'cancelled'
    )),
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    remarks TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, application_number)
);

-- 3. Application Status History Table
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Verification Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    storage_bucket VARCHAR(100) DEFAULT 'student-documents',
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size INT,
    document_status VARCHAR(30) DEFAULT 'uploaded' CHECK (document_status IN (
        'missing', 'uploaded', 'under_review', 'approved', 'rejected'
    )),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_students_org ON public.students(organization_id);
CREATE INDEX IF NOT EXISTS idx_students_phone ON public.students(organization_id, phone_normalized);
CREATE INDEX IF NOT EXISTS idx_applications_org ON public.applications(organization_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_student ON public.documents(student_id);
