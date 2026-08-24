-- Migration 002: Supabase Auth Profiles & Database-Driven RBAC Engine

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, code)
);

-- 2. Permissions Catalog Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Role Permissions Mapping Table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY(role_id, permission_id)
);

-- 4. User Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    employee_code VARCHAR(50),
    designation VARCHAR(100),
    department VARCHAR(100) DEFAULT 'Admissions',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for Fast Lookup
CREATE INDEX IF NOT EXISTS idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_org ON public.roles(organization_id);

-- 5. Populate Permissions Catalogue
INSERT INTO public.permissions (module, action, code, description) VALUES
('leads', 'view', 'leads.view', 'View assigned or organization leads'),
('leads', 'create', 'leads.create', 'Create new distance education enquiries'),
('leads', 'edit', 'leads.edit', 'Edit lead details, preferences, and status'),
('leads', 'delete', 'leads.delete', 'Soft-delete or purge lead records'),
('leads', 'assign', 'leads.assign', 'Reassign lead to another counsellor'),
('students', 'view', 'students.view', 'View enrolled student records'),
('students', 'create', 'students.create', 'Enroll lead as student'),
('students', 'edit', 'students.edit', 'Edit student academic & personal details'),
('applications', 'view', 'applications.view', 'View university 8-stage applications'),
('applications', 'create', 'applications.create', 'Start new university application'),
('applications', 'edit', 'applications.edit', 'Update application stage & verification'),
('fees', 'view', 'fees.view', 'View student fee accounts & installments'),
('payments', 'create', 'payments.create', 'Record fee collection payment'),
('payments', 'edit', 'payments.edit', 'Modify or adjust payment details'),
('payments', 'delete', 'payments.delete', 'Void/refund payment transactions'),
('reports', 'view', 'reports.view', 'View executive analytics & staff performance'),
('website', 'view', 'website.view', 'View visual website CMS pages'),
('website', 'edit', 'website.edit', 'Edit no-code homepage builder sections'),
('website', 'publish', 'website.publish', 'Publish changes to live consultancy website'),
('staff', 'view', 'staff.view', 'View counsellor directory'),
('staff', 'performance', 'staff.performance', 'View staff conversion leaderboard'),
('system', 'security', 'system.security', 'Manage RBAC permissions & audit logs')
ON CONFLICT (code) DO NOTHING;

-- 6. Insert System Default Roles for Default Organization
INSERT INTO public.roles (id, organization_id, name, code, description, is_system_role) VALUES
('r0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Super Admin', 'super_admin', 'Full system control across organizations', true),
('r0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Admin', 'admin', 'Full operational control within organization', true),
('r0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Manager', 'manager', 'Team lead supervising counsellors & performance', true),
('r0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Counsellor', 'counsellor', 'Admission executive managing leads & calls', true),
('r0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Accountant', 'accountant', 'Finance executive managing fees & payment receipts', true),
('r0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Support Staff', 'support_staff', 'Reception & document verification executive', true),
('r0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Student', 'student', 'Enrolled distance student self-service user', true)
ON CONFLICT (organization_id, code) DO NOTHING;

-- Map All Permissions to Super Admin & Admin Roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000001', id FROM public.permissions ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000002', id FROM public.permissions ON CONFLICT DO NOTHING;
