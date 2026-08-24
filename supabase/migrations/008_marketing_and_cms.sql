-- Migration 008: Marketing Campaigns, UTM Attribution, Student Progress & No-Code Website CMS

-- 1. Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) DEFAULT 'google' CHECK (platform IN (
        'google', 'facebook', 'instagram', 'linkedin', 'whatsapp', 'youtube', 'walk_in', 'other'
    )),
    campaign_code VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget NUMERIC(12, 2) DEFAULT 0.00,
    landing_page_url TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, campaign_code)
);

-- 2. Student Progress Milestones Table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    milestone_name VARCHAR(150) NOT NULL,
    milestone_type VARCHAR(50) DEFAULT 'academic',
    target_date DATE,
    completed_date DATE,
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'delayed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Website Pages CMS Table
CREATE TABLE IF NOT EXISTS public.website_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    page_type VARCHAR(50) DEFAULT 'custom',
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, slug)
);

-- 4. Website Sections Table (JSONB Builder Schema)
CREATE TABLE IF NOT EXISTS public.website_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    page_id UUID NOT NULL REFERENCES public.website_pages(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    style JSONB DEFAULT '{}'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Website Homepage Config Table
CREATE TABLE IF NOT EXISTS public.website_homepage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID UNIQUE NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.website_pages(id) ON DELETE CASCADE,
    draft_version JSONB DEFAULT '{}'::jsonb,
    published_version JSONB DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Page Revisions History Table
CREATE TABLE IF NOT EXISTS public.website_page_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    page_id UUID NOT NULL REFERENCES public.website_pages(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Hero Slider Table
CREATE TABLE IF NOT EXISTS public.website_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.website_pages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    button_text VARCHAR(100),
    button_url TEXT,
    overlay_settings JSONB DEFAULT '{}'::jsonb,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    course VARCHAR(150) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    photo_url TEXT,
    testimonial TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    category VARCHAR(100) DEFAULT 'Admissions',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 10. Website Settings Table
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID UNIQUE NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    site_title VARCHAR(255) DEFAULT 'EduConsult Distance Education',
    tagline VARCHAR(255) DEFAULT 'UGC-DEB Approved Online & Distance Degree Courses',
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#003FB1',
    secondary_color VARCHAR(20) DEFAULT '#006A61',
    accent_color VARCHAR(20) DEFAULT '#059669',
    font_family VARCHAR(50) DEFAULT 'Inter',
    header_settings JSONB DEFAULT '{}'::jsonb,
    footer_settings JSONB DEFAULT '{}'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    contact_information JSONB DEFAULT '{}'::jsonb,
    seo_settings JSONB DEFAULT '{}'::jsonb,
    analytics_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 11. Lead Forms Table
CREATE TABLE IF NOT EXISTS public.lead_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    fields JSONB NOT NULL,
    destination_status_id UUID REFERENCES public.lead_statuses(id) ON DELETE SET NULL,
    assignment_rule JSONB DEFAULT '{}'::jsonb,
    success_message TEXT DEFAULT 'Thank you! Our senior counsellor will contact you shortly.',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, slug)
);

-- 12. Form Submissions Table
CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    form_id UUID REFERENCES public.lead_forms(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    data JSONB NOT NULL,
    source VARCHAR(100) DEFAULT 'website',
    landing_page TEXT,
    submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 13. Media Assets Metadata Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    bucket VARCHAR(100) DEFAULT 'website-media',
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size INT,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_website_pages_org ON public.website_pages(organization_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_org ON public.form_submissions(organization_id, submitted_at DESC);
