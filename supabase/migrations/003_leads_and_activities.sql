-- Migration 003: Leads, Statuses, Priorities, Tags, Activities & Notes

-- 1. Lead Sources Table
CREATE TABLE IF NOT EXISTS public.lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    platform VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, code)
);

-- 2. Lead Statuses Table
CREATE TABLE IF NOT EXISTS public.lead_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    color VARCHAR(30) DEFAULT '#1A56DB',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, code)
);

-- 3. Lead Priorities Table
CREATE TABLE IF NOT EXISTS public.lead_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL,
    color VARCHAR(30) DEFAULT '#059669',
    score INT DEFAULT 10,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(organization_id, code)
);

-- 4. Tags Table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(30) DEFAULT '#006A61',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, name)
);

-- 5. Main Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    lead_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_normalized VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    gender VARCHAR(20),
    date_of_birth DATE,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20),
    highest_qualification VARCHAR(100),
    qualification_details TEXT,
    passing_year INT,
    specialization VARCHAR(100),
    preferred_course_id UUID,
    preferred_institution_id UUID,
    preferred_mode VARCHAR(50) DEFAULT 'Distance / Online',
    budget NUMERIC(12, 2) DEFAULT 0.00,
    source_id UUID REFERENCES public.lead_sources(id) ON DELETE SET NULL,
    campaign_id UUID,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'warm' CHECK (priority IN ('cold', 'warm', 'hot')),
    status_id UUID REFERENCES public.lead_statuses(id) ON DELETE SET NULL,
    lead_score INT DEFAULT 50,
    last_contacted_at TIMESTAMPTZ,
    next_followup_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    lost_reason TEXT,
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, lead_number)
);

-- Indexes for Fast Leads Search & Filtering
CREATE INDEX IF NOT EXISTS idx_leads_org ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(organization_id, phone_normalized);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(organization_id, email);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(organization_id, assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(organization_id, status_id);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(organization_id, priority);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(organization_id, created_at DESC);

-- 6. Lead Tags Junction Table
CREATE TABLE IF NOT EXISTS public.lead_tags (
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY(lead_id, tag_id)
);

-- 7. Lead Activities Timeline Table
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.lead_activities(lead_id, created_at DESC);

-- 8. Lead Notes Table
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON public.lead_notes(lead_id, created_at DESC);
