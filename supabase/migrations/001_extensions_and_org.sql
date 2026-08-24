-- Migration 001: Extensions & Multi-Tenant Organizations Schema
-- Distance Education Consultancy CRM & Lead Generation Platform

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Create Multi-Tenant Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#003FB1',
    secondary_color VARCHAR(20) DEFAULT '#006A61',
    accent_color VARCHAR(20) DEFAULT '#059669',
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(10) DEFAULT 'INR',
    default_language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index for Slug & Status
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(status);

-- 3. Default Organization Record for Distance Consultancy
INSERT INTO public.organizations (
    id, name, legal_name, slug, logo_url, primary_color, secondary_color, accent_color,
    phone, whatsapp_number, email, website, address_line_1, city, state, pincode, country
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'EduConsult Distance Education CRM',
    'EduConsult India Private Limited',
    'educonsult-india',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150',
    '#003FB1',
    '#006A61',
    '#059669',
    '+919876543210',
    '+919876543210',
    'admissions@educonsult.in',
    'https://educonsult.in',
    'Connaught Place, Central Business District',
    'New Delhi',
    'Delhi',
    '110001',
    'India'
) ON CONFLICT (id) DO NOTHING;
