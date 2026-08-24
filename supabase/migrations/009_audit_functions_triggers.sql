-- Migration 009: Audit Logs, Auto-Number Generators, Triggers & Atomic Lead Conversion Function

-- 1. Enterprise Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_date ON public.audit_logs(organization_id, created_at DESC);

-- 2. Organization Settings Table
CREATE TABLE IF NOT EXISTS public.organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, setting_key)
);

-- 3. Automatic Timestamp Update Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at Triggers
CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_fee_accounts_updated BEFORE UPDATE ON public.student_fee_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Safe Database Sequence Number Generators
CREATE OR REPLACE FUNCTION public.generate_sequence_number(
    p_org_id UUID,
    p_prefix VARCHAR,
    p_table VARCHAR,
    p_column VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_year VARCHAR(4);
    v_count INT;
    v_result VARCHAR(50);
    v_sql TEXT;
BEGIN
    v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    v_sql := FORMAT('SELECT COUNT(*) + 1 FROM public.%I WHERE organization_id = %L AND %I LIKE %L',
                    p_table, p_org_id, p_column, p_prefix || '-' || v_year || '-%');
    EXECUTE v_sql INTO v_count;
    v_result := p_prefix || '-' || v_year || '-' || LPAD(v_count::TEXT, 6, '0');
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 5. Auto-Generate Lead Number Trigger
CREATE OR REPLACE FUNCTION public.trg_auto_lead_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.lead_number IS NULL OR NEW.lead_number = '' THEN
        NEW.lead_number := public.generate_sequence_number(NEW.organization_id, 'LEAD', 'leads', 'lead_number');
    END IF;
    -- Normalize phone number
    IF NEW.phone IS NOT NULL THEN
        NEW.phone_normalized := REGEXP_REPLACE(NEW.phone, '\D', '', 'g');
        IF LENGTH(NEW.phone_normalized) = 10 THEN
            NEW.phone_normalized := '91' || NEW.phone_normalized;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_auto_num BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.trg_auto_lead_number();

-- 6. Financial Ledger Calculation Trigger
CREATE OR REPLACE FUNCTION public.recalculate_fee_account_balances()
RETURNS TRIGGER AS $$
DECLARE
    v_fee_account_id UUID;
    v_total_paid NUMERIC(12, 2);
    v_final_amount NUMERIC(12, 2);
    v_new_outstanding NUMERIC(12, 2);
    v_new_status VARCHAR(30);
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_fee_account_id := OLD.fee_account_id;
    ELSE
        v_fee_account_id := NEW.fee_account_id;
    END IF;

    -- Calculate total successful payments for this fee account
    SELECT COALESCE(SUM(amount), 0.00)
    INTO v_total_paid
    FROM public.payments
    WHERE fee_account_id = v_fee_account_id
      AND payment_status = 'successful';

    -- Fetch original final amount
    SELECT final_amount INTO v_final_amount
    FROM public.student_fee_accounts
    WHERE id = v_fee_account_id;

    v_new_outstanding := GREATEST(0.00, v_final_amount - v_total_paid);

    IF v_new_outstanding = 0.00 THEN
        v_new_status := 'paid';
    ELSIF v_total_paid > 0.00 THEN
        v_new_status := 'partially_paid';
    ELSE
        v_new_status := 'unpaid';
    END IF;

    -- Update fee account record
    UPDATE public.student_fee_accounts
    SET paid_amount = v_total_paid,
        outstanding_amount = v_new_outstanding,
        status = v_new_status,
        updated_at = TIMEZONE('utc', NOW())
    WHERE id = v_fee_account_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payments_fee_sync
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.recalculate_fee_account_balances();

-- 7. Atomic Lead-to-Student Conversion SQL Function
CREATE OR REPLACE FUNCTION public.convert_lead_to_student(
    p_lead_id UUID,
    p_performed_by UUID
) RETURNS JSONB AS $$
DECLARE
    v_lead RECORD;
    v_student_id UUID;
    v_student_number VARCHAR(50);
    v_application_id UUID;
    v_application_number VARCHAR(50);
    v_converted_status_id UUID;
BEGIN
    -- Fetch lead record
    SELECT * INTO v_lead FROM public.leads WHERE id = p_lead_id AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lead record with ID % not found.', p_lead_id;
    END IF;

    IF v_lead.converted_at IS NOT NULL THEN
        RAISE EXCEPTION 'Lead % has already been converted into a student.', v_lead.lead_number;
    END IF;

    -- Generate Student & Application Numbers
    v_student_number := public.generate_sequence_number(v_lead.organization_id, 'STU', 'students', 'student_number');
    v_application_number := public.generate_sequence_number(v_lead.organization_id, 'APP', 'applications', 'application_number');

    -- Insert Student Record
    INSERT INTO public.students (
        organization_id, student_number, converted_from_lead_id, first_name, last_name,
        full_name, phone, phone_normalized, whatsapp_number, email, gender, date_of_birth,
        city, state, pincode, country, highest_qualification, qualification_details,
        assigned_counsellor, status, enrolled_at, created_by, updated_by
    ) VALUES (
        v_lead.organization_id, v_student_number, v_lead.id, v_lead.first_name, v_lead.last_name,
        v_lead.full_name, v_lead.phone, v_lead.phone_normalized, v_lead.whatsapp_number, v_lead.email,
        v_lead.gender, v_lead.date_of_birth, v_lead.city, v_lead.state, v_lead.pincode, v_lead.country,
        v_lead.highest_qualification, v_lead.qualification_details, v_lead.assigned_to,
        'enrolled', TIMEZONE('utc', NOW()), p_performed_by, p_performed_by
    ) RETURNING id INTO v_student_id;

    -- Insert Application Record if preferred course exists
    IF v_lead.preferred_course_id IS NOT NULL AND v_lead.preferred_institution_id IS NOT NULL THEN
        INSERT INTO public.applications (
            organization_id, application_number, student_id, lead_id, course_id,
            institution_id, assigned_counsellor, status, created_by, updated_by
        ) VALUES (
            v_lead.organization_id, v_application_number, v_student_id, v_lead.id,
            v_lead.preferred_course_id, v_lead.preferred_institution_id, v_lead.assigned_to,
            'application_started', p_performed_by, p_performed_by
        ) RETURNING id INTO v_application_id;

        -- Create Status History Entry
        INSERT INTO public.application_status_history (
            organization_id, application_id, old_status, new_status, changed_by, remarks
        ) VALUES (
            v_lead.organization_id, v_application_id, NULL, 'application_started', p_performed_by,
            'Application auto-created via Lead Conversion'
        );
    END IF;

    -- Mark Lead as Converted
    SELECT id INTO v_converted_status_id FROM public.lead_statuses
    WHERE organization_id = v_lead.organization_id AND code = 'converted' LIMIT 1;

    UPDATE public.leads
    SET converted_at = TIMEZONE('utc', NOW()),
        status_id = COALESCE(v_converted_status_id, status_id),
        updated_by = p_performed_by,
        updated_at = TIMEZONE('utc', NOW())
    WHERE id = p_lead_id;

    -- Log Activity Timeline
    INSERT INTO public.lead_activities (
        organization_id, lead_id, activity_type, title, description, metadata, created_by
    ) VALUES (
        v_lead.organization_id, p_lead_id, 'converted', 'Converted to Enrolled Student',
        FORMAT('Lead successfully converted to Student %s and Application %s', v_student_number, COALESCE(v_application_number, 'N/A')),
        JSONB_BUILD_OBJECT('student_id', v_student_id, 'student_number', v_student_number, 'application_id', v_application_id),
        p_performed_by
    );

    RETURN JSONB_BUILD_OBJECT(
        'success', true,
        'student_id', v_student_id,
        'student_number', v_student_number,
        'application_id', v_application_id,
        'application_number', v_application_number
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
