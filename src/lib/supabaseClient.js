import { createClient } from '@supabase/supabase-js';

// Secure Environment Variables (No hardcoded fallback keys)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('dummy') &&
  supabaseUrl.startsWith('https://')
);

// Instantiate client securely if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Supabase Relational, Auth & Storage Service Wrapper for Distance Education CRM
 */
export const supabaseService = {
  // Real Supabase Email Authentication
  async signInWithEmail(email, password) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signUpWithEmail(email, password, userMetadata = {}) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });
    if (error) throw error;
    return data;
  },

  async signOutUser() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Leads
  async fetchLeads(orgId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('leads')
      .select('*, preferred_course:courses(name), preferred_institution:institutions(name), assigned_user:profiles(full_name)')
      .eq('organization_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createLead(leadData) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateLead(leadId, updates) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Atomic Lead to Student Conversion
  async convertLeadToStudent(leadId, performedByUserId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.rpc('convert_lead_to_student', {
      p_lead_id: leadId,
      p_performed_by: performedByUserId,
    });
    if (error) throw error;
    return data;
  },

  // Students & Applications
  async fetchStudents(orgId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('students')
      .select('*, fee_account:student_fee_accounts(*)')
      .eq('organization_id', orgId)
      .is('deleted_at', null)
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async fetchApplications(orgId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('applications')
      .select('*, student:students(full_name, phone), course:courses(name), institution:institutions(name)')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Payments & Receipts
  async recordPayment(paymentData) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Profiles & User Management
  async createStaffProfile(profileData) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        organization_id: profileData.orgId || 'a0000000-0000-0000-0000-000000000001',
        full_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        designation: profileData.designation,
        employee_code: profileData.empCode,
        is_active: true
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Storage Bucket Upload Helpers
  async uploadStudentDocument(file, studentId = 'general') {
    if (!isSupabaseConfigured || !supabase) return null;
    const fileName = `${studentId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const { data, error } = await supabase.storage
      .from('student-documents')
      .upload(fileName, file);

    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('student-documents').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  },

  async uploadStudentPicture(file, studentId = 'avatar') {
    if (!isSupabaseConfigured || !supabase) return null;
    const fileName = `${studentId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const { data, error } = await supabase.storage
      .from('student-pictures')
      .upload(fileName, file);

    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('student-pictures').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  },

  async uploadMediaAsset(file, bucket = 'website-media') {
    if (!isSupabaseConfigured || !supabase) return null;
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  },

  // Analytics Views
  async fetchLeadFunnel(orgId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('v_lead_funnel')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  },

  async fetchStaffPerformance(orgId) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('v_staff_performance')
      .select('*')
      .eq('organization_id', orgId);
    if (error) throw error;
    return data;
  }
};
