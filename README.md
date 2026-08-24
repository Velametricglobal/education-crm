# Education CRM — Distance Education Consultancy Management System

![Distance Education Consultancy CRM](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200)

A modern, scalable, and responsive CRM & Lead Generation Web Application designed for **Distance Education Consultancies in India**. The platform seamlessly handles student enquiry capture, counsellor lead distribution, application tracking across 8 admission stages, fee ledger management, payment receipt generation, staff performance monitoring, student self-service portal, and a multi-brand website CMS.

---

## 🌟 Key Features & Capabilities

* **Lead Generation & Management**: Real-time enquiry capture, source tracking (Google, Meta, WhatsApp, Website), lead scoring, priority tagging, and automated counsellor assignment.
* **Academic Catalog Management**: Manage university partnerships (IGNOU, Subharti, LPU Online, NMIMS CDOE), degree programs (MBA, MCA, BCA, PGD), fee structures, and document requirements.
* **8-Stage Application Pipeline**: Complete workflow from `Lead Received` -> `Counselling` -> `Documents Pending` -> `University Verification` -> `Admission Confirmed` -> `Enrolled Student`.
* **Student Self-Service Portal**: Secure student dashboard where enrolled students can view their personal admission status, fee installment breakdown, pay due balances, and download payment receipts.
* **Fee & Financial Ledger**: Automatic installment generation, payment processing, transaction logging, payment receipt PDF generation, and overdue fee alerts.
* **Multi-Brand Education Setup**: Custom logo upload (PNG, JPG, SVG), custom logo dimension sliders (width & height), custom color palette picker, and 1-click education brand presets.
* **Staff Performance Leaderboard**: Real-time metrics tracking for counsellors and managers including conversion rates, admissions closed, response speeds, and total revenue collected.
* **No-Code Website CMS Builder**: Live drag-and-drop hero section builder, course grid editor, testimonial showcase, and custom lead form builder.
* **Role-Based Access Control (RBAC)**: Enforced permission boundaries for Super Admins, Admins/Managers, Counsellors, Accountants, and Students.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Canvas-Confetti
* **Backend Database**: Supabase PostgreSQL (50 Relational Tables)
* **Authentication**: Supabase Auth & Local RBAC Security Context
* **Storage Buckets**: Supabase Storage (`student-documents`, `student-pictures`, `website-media`)
* **Security**: PostgreSQL Row-Level Security (RLS) Tenant Isolation, Atomic SQL RPC Functions (`convert_lead_to_student`), Auto-sequence Triggers (`LEAD-`, `STU-`, `APP-`, `REC-`)

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Velametricglobal/education-crm.git
   cd education-crm
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Supabase project credentials:
   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   VITE_APP_TITLE=Distance Education Consultancy CRM
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Access the web application at `http://localhost:3000/`.

---

## 🗄️ Database Migrations & Supabase Setup

All SQL database migrations are stored under `supabase/migrations/`:

```text
supabase/migrations/
├── 001_extensions_and_org.sql      # PostgreSQL extensions & tenant organizations
├── 002_auth_and_rbac.sql           # Roles, permissions, profiles
├── 003_leads_and_activities.sql    # Leads, sources, statuses, activities, notes
├── 004_academic_catalog.sql        # Institutions & course programs
├── 005_students_and_applications.sql # Student master & 8-stage applications
├── 006_finance_and_receipts.sql    # Fee accounts, installments, payments, receipts
├── 007_work_and_communication.sql  # Tasks, followups, conversations, calls
├── 008_marketing_and_cms.sql       # Campaigns, CMS pages, testimonials, FAQs
├── 009_audit_functions_triggers.sql # Auto-sequence triggers & atomic SQL RPCs
├── 010_rls_security_views.sql      # RLS policies & analytical reporting views
└── 011_seed_data.sql               # Seed dataset for Indian distance education
```

---

## 📦 Production Build & Deployment

To compile the application for production deployment:

```bash
npm run build
```

The optimized static assets will be generated in the `dist/` directory.

### Deployment Guides Included
* **Vercel**: Pre-configured `vercel.json` with SPA routing rewrites.
* **Netlify**: Pre-configured `netlify.toml` with publish rules.
* **Docker / Nginx**: Includes production `Dockerfile` and `nginx.conf`.

---

## 🔒 Security & Data Protection

* **Protected Credentials**: No service-role keys or private API tokens are committed to source control.
* **Student Data Isolation**: Student role accounts are strictly restricted to their personal student portal with zero access to CRM administrative interfaces.

---

## 📄 License

Copyright © 2026 Velametric Global. All rights reserved.
