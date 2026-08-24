-- Migration 006: Fee Structures, Student Ledgers, Installments, Payments & Printable Receipts

-- 1. Fee Structures Master Table
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    total_fee NUMERIC(12, 2) NOT NULL,
    application_fee NUMERIC(12, 2) DEFAULT 0.00,
    discount_allowed NUMERIC(12, 2) DEFAULT 0.00,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Student Fee Accounts Ledger Table
CREATE TABLE IF NOT EXISTS public.student_fee_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    fee_structure_id UUID REFERENCES public.fee_structures(id) ON DELETE SET NULL,
    original_amount NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    final_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0.00,
    outstanding_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'unpaid' CHECK (status IN (
        'unpaid', 'partially_paid', 'paid', 'overdue', 'waived'
    )),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, student_id, application_id)
);

-- 3. Installments Schedule Table
CREATE TABLE IF NOT EXISTS public.installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    fee_account_id UUID NOT NULL REFERENCES public.student_fee_accounts(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0.00,
    outstanding_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN (
        'upcoming', 'due', 'partially_paid', 'paid', 'overdue', 'waived'
    )),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(fee_account_id, installment_number)
);

-- 4. Payments Transaction Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    receipt_id UUID,
    fee_account_id UUID NOT NULL REFERENCES public.student_fee_accounts(id) ON DELETE CASCADE,
    installment_id UUID REFERENCES public.installments(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'upi' CHECK (payment_method IN (
        'cash', 'upi', 'bank_transfer', 'card', 'payment_gateway', 'cheque', 'other'
    )),
    transaction_id VARCHAR(100),
    gateway_reference VARCHAR(100),
    payment_status VARCHAR(30) DEFAULT 'successful' CHECK (payment_status IN (
        'pending', 'successful', 'failed', 'refunded', 'cancelled'
    )),
    received_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Official Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL,
    payment_id UUID UNIQUE REFERENCES public.payments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    pdf_storage_path TEXT,
    generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(organization_id, receipt_number)
);

-- Foreign Key Backlink to Payments Table
ALTER TABLE public.payments ADD CONSTRAINT fk_payments_receipt FOREIGN KEY (receipt_id) REFERENCES public.receipts(id) ON DELETE SET NULL;

-- 6. Payment Audit & Refund Events Table
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'created', 'confirmed', 'failed', 'refunded', 'partially_refunded', 'cancelled'
    )),
    amount NUMERIC(12, 2) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fee_accounts_student ON public.student_fee_accounts(student_id);
CREATE INDEX IF NOT EXISTS idx_installments_account ON public.installments(fee_account_id);
CREATE INDEX IF NOT EXISTS idx_payments_org ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(organization_id, payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_number ON public.receipts(organization_id, receipt_number);
