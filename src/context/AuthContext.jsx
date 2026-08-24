import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleUsers as initialSampleUsers, userRoles } from '../services/mockData';
import { supabaseService, isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usersList, setUsersList] = useState(initialSampleUsers);
  const [currentUser, setCurrentUser] = useState(initialSampleUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Listen to active Supabase Auth session changes if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userEmail = session.user.email;
        const matched = usersList.find(u => u.email.toLowerCase() === userEmail?.toLowerCase());
        if (matched) {
          setCurrentUser(matched);
          setIsAuthenticated(true);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [usersList]);

  // Real Email & Password Login (Supabase Auth + Local Fallback)
  const login = async (email, password) => {
    let authUser = null;

    if (isSupabaseConfigured) {
      try {
        const res = await supabaseService.signInWithEmail(email, password);
        authUser = res?.user;
      } catch (err) {
        console.warn("Supabase Auth Email sign in notice (using local fallback):", err.message);
      }
    }

    const foundUser = usersList.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    ) || (authUser ? {
      id: authUser.id,
      name: authUser.user_metadata?.name || email.split('@')[0],
      email: authUser.email,
      role: authUser.user_metadata?.role || userRoles.STUDENT,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    } : usersList[0]);

    setCurrentUser(foundUser);
    setIsAuthenticated(true);
    return foundUser;
  };

  const loginAsUser = (userObject) => {
    setCurrentUser(userObject);
    setIsAuthenticated(true);
    return userObject;
  };

  // Student self-registration user creator with Supabase Email Auth
  const registerStudentUser = async (name, email, phone, password = 'Password@123') => {
    if (isSupabaseConfigured) {
      try {
        await supabaseService.signUpWithEmail(email, password, { name, role: userRoles.STUDENT, phone });
      } catch (err) {
        console.warn("Supabase Auth signup notice:", err.message);
      }
    }

    const newStudentUser = {
      id: `USR-STU-${Math.floor(100 + Math.random() * 900)}`,
      name: name,
      email: email.toLowerCase().trim(),
      role: userRoles.STUDENT,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      phone: phone
    };

    setUsersList(prev => [newStudentUser, ...prev]);
    setCurrentUser(newStudentUser);
    setIsAuthenticated(true);
    return newStudentUser;
  };

  // Admin function to create staff users with custom credentials and roles
  const createStaffUser = async (userData) => {
    if (isSupabaseConfigured) {
      try {
        await supabaseService.signUpWithEmail(userData.email, userData.password || 'Password@123', {
          name: userData.name,
          role: userData.role || userRoles.COUNSELLOR,
          designation: userData.designation
        });
        await supabaseService.createStaffProfile({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          designation: userData.designation,
          empCode: userData.empCode
        });
      } catch (err) {
        console.warn("Supabase staff profile sync notice:", err.message);
      }
    }

    const newUser = {
      id: `USR-${Math.floor(200 + Math.random() * 800)}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password || 'Password@123',
      role: userData.role || userRoles.COUNSELLOR,
      empCode: userData.empCode || `EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      designation: userData.designation || 'Education Admissions Counsellor',
      phone: userData.phone || '+91 9876543210',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setUsersList(prev => [newUser, ...prev]);
    return newUser;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabaseService.signOutUser();
      } catch (err) {}
    }
    setIsAuthenticated(false);
  };

  const switchRole = (userId) => {
    const target = usersList.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
    }
  };

  const hasPermission = (permissionKey) => {
    if (!currentUser || !isAuthenticated) return false;
    const role = currentUser.role;

    if (role === userRoles.SUPER_ADMIN) return true;

    if (role === userRoles.ADMIN_MANAGER) {
      return !['system_security', 'full_database_wipe'].includes(permissionKey);
    }

    if (role === userRoles.COUNSELLOR) {
      return ['view_leads', 'add_lead', 'edit_own_lead', 'call_whatsapp', 'schedule_followup', 'create_application', 'view_courses', 'view_universities'].includes(permissionKey);
    }

    if (role === userRoles.ACCOUNTANT) {
      return ['view_students', 'manage_fees', 'record_payment', 'generate_receipt', 'financial_reports', 'fee_reminders'].includes(permissionKey);
    }

    if (role === userRoles.STUDENT) {
      return ['view_student_portal', 'pay_fee', 'download_receipt', 'view_application'].includes(permissionKey);
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      usersList,
      login,
      loginAsUser,
      registerStudentUser,
      createStaffUser,
      logout,
      switchRole,
      hasPermission,
      userRoles,
      sampleUsers: usersList
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
