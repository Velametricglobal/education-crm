-- Migration 004: Institutions, Courses, Course-Institution Relations & Requirements

-- 1. Distance Education Institutions Table
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    logo_url TEXT,
    cover_image_url TEXT,
    short_description TEXT,
    description TEXT,
    website TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    address TEXT,
    recognition_text TEXT,
    accreditation_text TEXT,
    admission_information TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, code)
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    category VARCHAR(100) DEFAULT 'Management',
    degree_level VARCHAR(50) CHECK (degree_level IN ('UG', 'PG', 'Diploma', 'Certificate', 'PhD')),
    duration INT DEFAULT 2,
    duration_unit VARCHAR(20) DEFAULT 'Years',
    study_mode VARCHAR(50) DEFAULT 'Online / Distance',
    eligibility TEXT,
    description TEXT,
    short_description TEXT,
    fee_amount NUMERIC(12, 2) DEFAULT 0.00,
    application_fee NUMERIC(12, 2) DEFAULT 0.00,
    admission_start DATE,
    admission_end DATE,
    brochure_url TEXT,
    thumbnail_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
    sort_order INT DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, code)
);

-- 3. Institution-Course Junction Table (Multi-University Course Offerings)
CREATE TABLE IF NOT EXISTS public.institution_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    fee_amount NUMERIC(12, 2) NOT NULL,
    application_fee NUMERIC(12, 2) DEFAULT 0.00,
    duration INT,
    admission_start DATE,
    admission_end DATE,
    eligibility_override TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(institution_id, course_id)
);

-- 4. Course Document Requirements Table
CREATE TABLE IF NOT EXISTS public.course_document_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_org ON public.courses(organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(organization_id, category);
CREATE INDEX IF NOT EXISTS idx_institutions_org ON public.institutions(organization_id);
