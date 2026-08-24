-- Migration 011: Complete Indian Distance Education Consultancy Seed Dataset

-- 1. Insert Default Lead Statuses
INSERT INTO public.lead_statuses (organization_id, name, code, color, sort_order, is_system) VALUES
('a0000000-0000-0000-0000-000000000001', 'New Enquiry', 'new', '#1A56DB', 1, true),
('a0000000-0000-0000-0000-000000000001', 'Contacted / Called', 'contacted', '#006A61', 2, true),
('a0000000-0000-0000-0000-000000000001', 'Counselling Scheduled', 'counselling', '#059669', 3, true),
('a0000000-0000-0000-0000-000000000001', 'Interested Prospect', 'interested', '#0D9488', 4, true),
('a0000000-0000-0000-0000-000000000001', 'Follow-up Required', 'follow_up', '#D97706', 5, true),
('a0000000-0000-0000-0000-000000000001', 'Application Started', 'application_started', '#2563EB', 6, true),
('a0000000-0000-0000-0000-000000000001', 'Documents Pending', 'documents_pending', '#B45309', 7, true),
('a0000000-0000-0000-0000-000000000001', 'Admission Confirmed', 'admission_confirmed', '#047857', 8, true),
('a0000000-0000-0000-0000-000000000001', 'Converted to Student', 'converted', '#059669', 9, true),
('a0000000-0000-0000-0000-000000000001', 'Not Interested', 'not_interested', '#6B7280', 10, true)
ON CONFLICT (organization_id, code) DO NOTHING;

-- 2. Insert Lead Sources
INSERT INTO public.lead_sources (organization_id, name, code, platform) VALUES
('a0000000-0000-0000-0000-000000000001', 'Website Enquiry Form', 'website', 'website'),
('a0000000-0000-0000-0000-000000000001', 'Google Search Ads', 'google_ads', 'google'),
('a0000000-0000-0000-0000-000000000001', 'Facebook Lead Gen', 'facebook', 'facebook'),
('a0000000-0000-0000-0000-000000000001', 'Direct WhatsApp Enquiry', 'whatsapp', 'whatsapp'),
('a0000000-0000-0000-0000-000000000001', 'Office Walk-in', 'walk_in', 'walk_in'),
('a0000000-0000-0000-0000-000000000001', 'Student Referral', 'referral', 'referral')
ON CONFLICT (organization_id, code) DO NOTHING;

-- 3. Insert Distance Universities (UGC-DEB Recognized)
INSERT INTO public.institutions (id, organization_id, name, slug, code, logo_url, short_description, city, state, recognition_text) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'IGNOU (Indira Gandhi National Open University)', 'ignou', 'IGNOU', 'https://images.unsplash.com/photo-1562774053-701939374585?w=150', 'Central Open University recognized by UGC-DEB & NAAC A++.', 'New Delhi', 'Delhi', 'UGC-DEB Approved, NAAC A++ Grade, AICTE Recognized'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Subharti University Distance Education (SVSU)', 'subharti', 'SVSU', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150', 'Premier State University offering UGC-DEB distance degree programs.', 'Meerut', 'Uttar Pradesh', 'UGC-DEB Approved, NAAC A Grade'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'LPU Online (Lovely Professional University)', 'lpu-online', 'LPU-ONLINE', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150', 'Top-ranked private university offering modern online MBA, MCA & BBA programs.', 'Phagwara', 'Punjab', 'UGC-DEB Approved, NAAC A++ Grade, NIRF Top 50'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'NMIMS Global Access (CDOE)', 'nmims', 'NMIMS', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150', 'India premier management university for online executive MBA & PG Diplomas.', 'Mumbai', 'Maharashtra', 'UGC-DEB Approved, NAAC A+ Grade, Autonomy Category I')
ON CONFLICT (organization_id, code) DO NOTHING;

-- 4. Insert UGC-DEB Distance Degree Courses
INSERT INTO public.courses (id, organization_id, institution_id, name, slug, code, category, degree_level, duration, fee_amount, application_fee, eligibility) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Master of Business Administration (MBA Online)', 'mba-online', 'MBA-ONLINE', 'Management', 'PG', 2, 84000.00, 1000.00, 'Graduation degree with minimum 50% marks from a recognized university.'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Bachelor of Computer Applications (BCA Distance)', 'bca-distance', 'BCA-DIST', 'IT & Computer Science', 'UG', 3, 54000.00, 500.00, '10+2 Higher Secondary pass with Mathematics or CS.'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Master of Computer Applications (MCA Online)', 'mca-online', 'MCA-ONLINE', 'IT & Computer Science', 'PG', 2, 72000.00, 1000.00, 'BCA/B.Sc CS or Graduation with Math at 10+2 level.'),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Executive PG Diploma in Finance & Banking', 'pgd-finance', 'PGD-FIN', 'Finance', 'Diploma', 1, 45000.00, 750.00, 'Bachelor degree in any stream.')
ON CONFLICT (organization_id, code) DO NOTHING;

-- 5. Insert Sample Distance Education Leads
INSERT INTO public.leads (
    id, organization_id, lead_number, first_name, last_name, full_name, phone, phone_normalized,
    whatsapp_number, email, city, state, highest_qualification, preferred_course_id, preferred_institution_id,
    priority, lead_score, created_at
) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'LEAD-2026-000001', 'Vikram', 'Malhotra', 'Vikram Malhotra', '+919876543210', '919876543210', '+919876543210', 'vikram.m@gmail.com', 'Delhi', 'Delhi', 'B.Tech CSE', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'hot', 95, NOW() - INTERVAL '2 hours'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'LEAD-2026-000002', 'Priya', 'Sharma', 'Priya Sharma', '+919812345678', '919812345678', '+919812345678', 'priya.sharma@yahoo.com', 'Noida', 'Uttar Pradesh', 'B.Com', 'c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'warm', 75, NOW() - INTERVAL '1 day'),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'LEAD-2026-000003', 'Rahul', 'Verma', 'Rahul Verma', '+919711223344', '919711223344', '+919711223344', 'rahul.v@gmail.com', 'Gurugram', 'Haryana', '12th Pass', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'hot', 90, NOW() - INTERVAL '3 hours')
ON CONFLICT (organization_id, lead_number) DO NOTHING;

-- 6. Insert Sample Enrolled Student
INSERT INTO public.students (
    id, organization_id, student_number, first_name, last_name, full_name, phone, phone_normalized,
    whatsapp_number, email, city, state, highest_qualification, status, enrolled_at
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'STU-2026-000001',
    'Ananya',
    'Gupta',
    'Ananya Gupta',
    '+919988776655',
    '919988776655',
    '+919988776655',
    'ananya.g@gmail.com',
    'Jaipur',
    'Rajasthan',
    'BCA',
    'enrolled',
    NOW() - INTERVAL '10 days'
) ON CONFLICT (organization_id, student_number) DO NOTHING;

-- 7. Insert Sample Application for Student
INSERT INTO public.applications (
    id, organization_id, application_number, student_id, course_id, institution_id, status, admission_session
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'APP-2026-000001',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'submitted',
    'July 2026'
) ON CONFLICT (organization_id, application_number) DO NOTHING;

-- 8. Insert Fee Account & Payment
INSERT INTO public.student_fee_accounts (
    id, organization_id, student_id, application_id, original_amount, discount_amount, final_amount, paid_amount, outstanding_amount, status
) VALUES (
    'fa000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    72000.00,
    5000.00,
    67000.00,
    25000.00,
    42000.00,
    'partially_paid'
) ON CONFLICT (organization_id, student_id, application_id) DO NOTHING;

-- Insert Payment & Receipt
INSERT INTO public.payments (
    id, organization_id, fee_account_id, student_id, application_id, amount, payment_date, payment_method, transaction_id, payment_status
) VALUES (
    'p0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'fa000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    25000.00,
    CURRENT_DATE - INTERVAL '5 days',
    'upi',
    'UPI/2026/89127491',
    'successful'
) ON CONFLICT DO NOTHING;

INSERT INTO public.receipts (
    id, organization_id, receipt_number, payment_id, student_id, amount, issue_date
) VALUES (
    'r0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'REC-2026-000001',
    'p0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    25000.00,
    CURRENT_DATE - INTERVAL '5 days'
) ON CONFLICT (organization_id, receipt_number) DO NOTHING;
