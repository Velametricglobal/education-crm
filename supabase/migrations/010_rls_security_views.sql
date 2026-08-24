-- Migration 010: Row Level Security (RLS) Policies, Storage Rules & Dashboard Views

-- 1. Enable RLS on All Application Tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fee_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_page_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

-- 2. Helper Security Functions for Organization & User Authorization
CREATE OR REPLACE FUNCTION public.get_current_user_org_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_user_role_code()
RETURNS VARCHAR AS $$
    SELECT r.code FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Define Standard Tenant Isolation RLS Policies

-- Leads Policy: Staff can view organization leads; Counsellors view assigned or created leads
CREATE POLICY rls_leads_tenant_isolation ON public.leads
FOR ALL USING (
    organization_id = public.get_current_user_org_id() AND (
        public.get_current_user_role_code() IN ('super_admin', 'admin', 'manager', 'accountant', 'support_staff')
        OR assigned_to = auth.uid()
        OR created_by = auth.uid()
    )
);

-- Students Policy
CREATE POLICY rls_students_tenant_isolation ON public.students
FOR ALL USING (
    organization_id = public.get_current_user_org_id() AND (
        public.get_current_user_role_code() IN ('super_admin', 'admin', 'manager', 'accountant', 'support_staff')
        OR assigned_counsellor = auth.uid()
        OR id = auth.uid() -- Student Self Access
    )
);

-- Applications Policy
CREATE POLICY rls_applications_tenant_isolation ON public.applications
FOR ALL USING (
    organization_id = public.get_current_user_org_id() AND (
        public.get_current_user_role_code() IN ('super_admin', 'admin', 'manager', 'accountant', 'support_staff')
        OR assigned_counsellor = auth.uid()
        OR student_id = auth.uid()
    )
);

-- Fee Accounts & Payments Policy (Accountant & Admin Access)
CREATE POLICY rls_fee_accounts_tenant_isolation ON public.student_fee_accounts
FOR ALL USING (
    organization_id = public.get_current_user_org_id() AND (
        public.get_current_user_role_code() IN ('super_admin', 'admin', 'manager', 'accountant')
        OR student_id = auth.uid()
    )
);

CREATE POLICY rls_payments_tenant_isolation ON public.payments
FOR ALL USING (
    organization_id = public.get_current_user_org_id() AND (
        public.get_current_user_role_code() IN ('super_admin', 'admin', 'manager', 'accountant')
        OR student_id = auth.uid()
    )
);

-- Generic Public/Read-Only Policies for Catalog & CMS Content
CREATE POLICY rls_courses_public_read ON public.courses FOR SELECT USING (status = 'active' OR organization_id = public.get_current_user_org_id());
CREATE POLICY rls_institutions_public_read ON public.institutions FOR SELECT USING (status = 'active' OR organization_id = public.get_current_user_org_id());
CREATE POLICY rls_website_pages_public_read ON public.website_pages FOR SELECT USING (status = 'published' OR organization_id = public.get_current_user_org_id());
CREATE POLICY rls_website_slides_public_read ON public.website_slides FOR SELECT USING (is_active = true OR organization_id = public.get_current_user_org_id());

-- 4. Analytical Dashboard Views

-- View 1: Lead Conversion Funnel Summary
CREATE OR REPLACE VIEW public.v_lead_funnel AS
SELECT
    l.organization_id,
    ls.name AS status_name,
    ls.code AS status_code,
    ls.color AS status_color,
    COUNT(l.id) AS lead_count,
    ROUND(COUNT(l.id) * 100.0 / NULLIF(SUM(COUNT(l.id)) OVER (PARTITION BY l.organization_id), 0), 2) AS percentage
FROM public.leads l
JOIN public.lead_statuses ls ON l.status_id = ls.id
WHERE l.deleted_at IS NULL
GROUP BY l.organization_id, ls.name, ls.code, ls.color, ls.sort_order
ORDER BY ls.sort_order ASC;

-- View 2: Staff Performance Leaderboard
CREATE OR REPLACE VIEW public.v_staff_performance AS
SELECT
    p.organization_id,
    p.id AS staff_id,
    p.full_name AS staff_name,
    p.avatar_url,
    p.designation,
    COUNT(DISTINCT l.id) AS total_leads_assigned,
    COUNT(DISTINCT CASE WHEN l.converted_at IS NOT NULL THEN l.id END) AS admissions_count,
    COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'completed') AS followups_completed,
    COUNT(DISTINCT c.id) AS total_calls_logged,
    COALESCE(SUM(pay.amount), 0.00) AS total_revenue_generated,
    ROUND(COUNT(DISTINCT CASE WHEN l.converted_at IS NOT NULL THEN l.id END) * 100.0 / NULLIF(COUNT(DISTINCT l.id), 0), 2) AS conversion_rate
FROM public.profiles p
LEFT JOIN public.leads l ON p.id = l.assigned_to AND l.deleted_at IS NULL
LEFT JOIN public.followups f ON p.id = f.assigned_to
LEFT JOIN public.calls c ON p.id = c.staff_id
LEFT JOIN public.payments pay ON p.id = pay.received_by AND pay.payment_status = 'successful'
WHERE p.status = 'active'
GROUP BY p.organization_id, p.id, p.full_name, p.avatar_url, p.designation;

-- View 3: Fee Collection & Dues Summary
CREATE OR REPLACE VIEW public.v_fee_summary AS
SELECT
    sfa.organization_id,
    s.id AS student_id,
    s.student_number,
    s.full_name AS student_name,
    s.phone,
    c.name AS course_name,
    inst.name AS institution_name,
    sfa.final_amount AS total_fee,
    sfa.paid_amount,
    sfa.outstanding_amount,
    sfa.status AS fee_status,
    MIN(inst_sched.due_date) FILTER (WHERE inst_sched.status IN ('upcoming', 'due', 'overdue')) AS next_due_date
FROM public.student_fee_accounts sfa
JOIN public.students s ON sfa.student_id = s.id
JOIN public.applications app ON sfa.application_id = app.id
JOIN public.courses c ON app.course_id = c.id
JOIN public.institutions inst ON app.institution_id = inst.id
LEFT JOIN public.installments inst_sched ON sfa.id = inst_sched.fee_account_id
GROUP BY sfa.organization_id, s.id, s.student_number, s.full_name, s.phone, c.name, inst.name, sfa.final_amount, sfa.paid_amount, sfa.outstanding_amount, sfa.status;

-- View 4: Daily Payment Collections
CREATE OR REPLACE VIEW public.v_daily_collections AS
SELECT
    pay.organization_id,
    pay.payment_date,
    COUNT(pay.id) AS transaction_count,
    SUM(pay.amount) AS total_collected
FROM public.payments pay
WHERE pay.payment_status = 'successful'
GROUP BY pay.organization_id, pay.payment_date
ORDER BY pay.payment_date DESC;
