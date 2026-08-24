import React, { createContext, useContext, useState } from 'react';
import { sampleUsers as initialSampleUsers, userRoles } from '../services/mockData';
import { supabaseService, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usersList, setUsersList] = useState(initialSampleUsers);
  const [currentUser, setCurrentUser] = useState(initialSampleUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Secure login checking user list by email
  const login = (email, password) => {
    const foundUser = usersList.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim()) || usersList[0];
    setCurrentUser(foundUser);
    setIsAuthenticated(true);
    return foundUser;
  };

  const loginAsUser = (userObject) => {
    setCurrentUser(userObject);
    setIsAuthenticated(true);
    return userObject;
  };

  // Student self-registration user creator
  const registerStudentUser = (name, email, phone) => {
    const newStudentUser = {
      id: `USR-STU-${Math.floor(100 + Math.random() * 900)}`,
      name: name,
      email: email,
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

    if (isSupabaseConfigured) {
      try {
        await supabaseService.createStaffProfile({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          designation: userData.designation,
          empCode: userData.empCode
        });
      } catch (err) {
        console.warn("Supabase staff profile sync warning:", err);
      }
    }

    return newUser;
  };

  const logout = () => {
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
