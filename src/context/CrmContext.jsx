import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabaseService, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  initialSystemSettings,
  leadStatuses as defaultLeadStatuses,
  leadPriorities,
  sampleUniversities,
  sampleCourses,
  sampleLeads,
  sampleApplications,
  sampleStudents,
  samplePayments,
  sampleFollowups,
  sampleCampaigns,
  sampleAuditLogs
} from '../services/mockData';

const CrmContext = createContext(null);

export const CrmProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSystemSettings);
  const [leadStatuses, setLeadStatuses] = useState(defaultLeadStatuses);
  const [leads, setLeads] = useState(sampleLeads);
  const [universities, setUniversities] = useState(sampleUniversities);
  const [courses, setCourses] = useState(sampleCourses);
  const [applications, setApplications] = useState(sampleApplications);
  const [students, setStudents] = useState(sampleStudents);
  const [payments, setPayments] = useState(samplePayments);
  const [followups, setFollowups] = useState(sampleFollowups);
  const [campaigns, setCampaigns] = useState(sampleCampaigns);
  const [auditLogs, setAuditLogs] = useState(sampleAuditLogs);

  const [notifications, setNotifications] = useState([
    { id: "NTF-1", title: "New Lead Enquiry", message: "Vikram Malhotra enquiring for MBA from Website", time: "10m ago", read: false, type: "lead" },
    { id: "NTF-2", title: "Fee Overdue Alert", message: "Amitabh Sen (MCA) 2nd Year Fee of ₹24,000 is Overdue", time: "1h ago", read: false, type: "fee" },
    { id: "NTF-3", title: "Payment Received", message: "₹12,000 payment received from Rahul Mehra", time: "3h ago", read: true, type: "payment" }
  ]);

  // Load Supabase Database Records if Supabase Client is Configured
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured) return;
      try {
        const dbLeads = await supabaseService.fetchLeads(settings.organizationId || 'a0000000-0000-0000-0000-000000000001');
        if (dbLeads && dbLeads.length > 0) {
          setLeads(dbLeads.map(l => ({
            id: l.id,
            name: l.full_name,
            mobile: l.phone,
            whatsapp: l.whatsapp_number || l.phone,
            email: l.email || '',
            city: l.city || 'Delhi NCR',
            state: l.state || 'Delhi',
            qualification: l.highest_qualification || 'Graduation',
            preferredCourse: l.preferred_course?.name || 'MBA',
            preferredUniversity: l.preferred_institution?.name || 'LPU Online',
            counsellorName: l.assigned_user?.full_name || 'Amit Kumar',
            priority: l.priority || 'warm',
            status: l.status_id || 'new',
            lastContacted: l.last_contacted_at ? new Date(l.last_contacted_at).toLocaleDateString('en-IN') : 'Not yet',
            createdDate: l.created_at ? new Date(l.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
          })));
        }
      } catch (err) {
        console.warn("Supabase connection active, using fallback seed context:", err.message);
      }
    }
    loadSupabaseData();
  }, [settings.organizationId]);

  // Apply CSS root variable updates on theme changes
  useEffect(() => {
    document.documentElement.style.setProperty('--color-brand-600', settings.primaryColor);
    document.documentElement.style.setProperty('--color-brand-700', settings.primaryColor);
  }, [settings.primaryColor]);

  // Log action helper
  const addAuditLog = (action, details, user = "System Admin") => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user,
      action,
      details,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Notification helper
  const addNotification = (title, message, type = "info") => {
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title,
      message,
      time: "Just now",
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Check duplicate lead
  const checkDuplicate = (mobile, email) => {
    return leads.find(l => 
      (mobile && l.mobile.replace(/\D/g, '') === mobile.replace(/\D/g, '')) ||
      (email && l.email.toLowerCase() === email.toLowerCase())
    );
  };

  // Add New Lead (From website form or CRM)
  const addLead = async (leadData) => {
    const leadId = `LD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead = {
      id: leadId,
      name: leadData.name || "Anonymous Prospect",
      mobile: leadData.mobile || "",
      whatsapp: leadData.whatsapp || leadData.mobile || "",
      email: leadData.email || "",
      city: leadData.city || "Delhi NCR",
      state: leadData.state || "Delhi",
      dateOfBirth: leadData.dateOfBirth || "",
      qualification: leadData.qualification || "Graduation",
      passingYear: leadData.passingYear || "2024",
      preferredCourse: leadData.preferredCourse || "MBA",
      preferredUniversity: leadData.preferredUniversity || "LPU Online",
      preferredStudyMode: leadData.preferredStudyMode || "Online LMS",
      budget: leadData.budget || "₹50,000 - ₹70,000",
      source: leadData.source || "Website Form",
      campaign: leadData.campaign || "Website_Organic",
      counsellorId: leadData.counsellorId || "USR-103",
      counsellorName: leadData.counsellorName || "Amit Kumar",
      priority: leadData.priority || "hot",
      status: "new",
      tags: leadData.tags || ["New Enquiry"],
      lastContacted: "Not yet",
      nextFollowup: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
      notes: leadData.notes || "New enquiry captured via website lead form.",
      createdDate: new Date().toISOString().slice(0, 10),
      utmSource: leadData.utmSource || "direct",
      utmMedium: leadData.utmMedium || "web"
    };

    setLeads(prev => [newLead, ...prev]);

    // Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabaseService.createLead({
          organization_id: 'a0000000-0000-0000-0000-000000000001',
          first_name: newLead.name.split(' ')[0] || newLead.name,
          last_name: newLead.name.split(' ').slice(1).join(' ') || '',
          full_name: newLead.name,
          phone: newLead.mobile,
          whatsapp_number: newLead.whatsapp,
          email: newLead.email,
          city: newLead.city,
          state: newLead.state,
          highest_qualification: newLead.qualification,
          priority: newLead.priority,
          notes: newLead.notes
        });
      } catch (err) {
        console.warn("Supabase lead create warning:", err);
      }
    }

    // Automatically create initial follow-up task
    const followupId = `FLP-${Math.floor(300 + Math.random() * 900)}`;
    const newFollowup = {
      id: followupId,
      leadId: leadId,
      leadName: newLead.name,
      counsellorId: newLead.counsellorId,
      counsellorName: newLead.counsellorName,
      type: "Call",
      dueDate: newLead.nextFollowup,
      status: "Pending",
      priority: "High",
      notes: `Welcome call for ${newLead.preferredCourse} course interest.`
    };
    setFollowups(prev => [newFollowup, ...prev]);

    addAuditLog("Lead Created", `New lead ${newLead.name} (${leadId}) registered via ${newLead.source}`);
    addNotification("New Enquiry Received 🎉", `New lead ${newLead.name} for ${newLead.preferredCourse}`, "lead");

    return newLead;
  };

  // Update Lead Status
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          lastContacted: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
        };
      }
      return l;
    }));
    addAuditLog("Lead Status Updated", `Lead ${leadId} status changed to '${newStatus}'`);
  };

  // Update Lead Priority
  const updateLeadPriority = (leadId, newPriority) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, priority: newPriority } : l));
  };

  // Assign Counsellor
  const assignLead = (leadId, counsellorId, counsellorName) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, counsellorId, counsellorName } : l));
    addAuditLog("Lead Reassigned", `Lead ${leadId} assigned to ${counsellorName}`);
  };

  // Schedule Followup
  const scheduleFollowup = (data) => {
    const newFlp = {
      id: `FLP-${Math.floor(300 + Math.random() * 900)}`,
      leadId: data.leadId,
      leadName: data.leadName,
      counsellorId: data.counsellorId || "USR-103",
      counsellorName: data.counsellorName || "Amit Kumar",
      type: data.type || "Call",
      dueDate: data.dueDate,
      status: "Pending",
      priority: data.priority || "Medium",
      notes: data.notes || ""
    };
    setFollowups(prev => [newFlp, ...prev]);
    addAuditLog("Follow-up Scheduled", `Scheduled ${data.type} for ${data.leadName} on ${data.dueDate}`);
  };

  // Complete Followup
  const completeFollowup = (followupId) => {
    setFollowups(prev => prev.map(f => f.id === followupId ? { ...f, status: "Completed" } : f));
  };

  // Convert Lead to Application
  const convertLeadToApplication = (lead, course, university) => {
    const appId = `APP-2026-${Math.floor(5000 + Math.random() * 4000)}`;
    const newApp = {
      id: appId,
      applicationNo: `EDU-APP-${Math.floor(8000 + Math.random() * 1000)}`,
      leadId: lead.id,
      studentName: lead.name,
      mobile: lead.mobile,
      email: lead.email,
      courseId: course?.id || "CRS-201",
      courseName: course?.name || lead.preferredCourse,
      universityId: university?.id || "UNI-103",
      universityName: university?.name || lead.preferredUniversity,
      session: settings.currentSession,
      status: "Documents Pending",
      counsellorId: lead.counsellorId,
      counsellorName: lead.counsellorName,
      applicationDate: new Date().toISOString().slice(0, 10),
      documents: [
        { name: "Aadhaar Card", status: "Pending", fileUrl: "#" },
        { name: "Photograph", status: "Pending", fileUrl: "#" },
        { name: "10th Marksheet", status: "Pending", fileUrl: "#" },
        { name: "12th Marksheet", status: "Pending", fileUrl: "#" },
        { name: "Graduation Marksheet", status: "Pending", fileUrl: "#" }
      ],
      remarks: "Converted from enquiry lead. Application documents collection initiated."
    };

    setApplications(prev => [newApp, ...prev]);
    updateLeadStatus(lead.id, "application_started");
    addAuditLog("Lead Converted to Application", `Lead ${lead.name} (${lead.id}) converted to Application ${appId}`);
    addNotification("Application Initiated 📄", `Application started for ${lead.name} (${course?.name || lead.preferredCourse})`, "application");
    return newApp;
  };

  // Update Application Status
  const updateApplicationStatus = (appId, newStatus, remarks = "") => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus, remarks: remarks || a.remarks } : a));
    addAuditLog("Application Updated", `Application ${appId} status set to ${newStatus}`);
  };

  // Convert Application to Student Admission
  const convertApplicationToStudent = async (app, totalFee = 50000, initialPaid = 15000) => {
    const studentId = `STD-2026-${Math.floor(800 + Math.random() * 150)}`;
    const enrollmentNo = `${app.universityName.slice(0, 3).toUpperCase()}-${app.courseName.slice(0, 3).toUpperCase()}-2026-${Math.floor(4000 + Math.random() * 5000)}`;

    const newStudent = {
      id: studentId,
      studentId: `ED-${studentId.replace('STD-', '')}`,
      enrollmentNo: enrollmentNo,
      name: app.studentName,
      mobile: app.mobile,
      whatsapp: app.mobile,
      email: app.email,
      city: "India",
      state: "India",
      courseId: app.courseId,
      courseName: app.courseName,
      universityId: app.universityId,
      universityName: app.universityName,
      studyMode: "Distance / Online LMS",
      admissionDate: new Date().toISOString().slice(0, 10),
      counsellorId: app.counsellorId,
      counsellorName: app.counsellorName,
      feeStatus: initialPaid >= totalFee ? "Paid" : initialPaid > 0 ? "Partially Paid" : "Due",
      totalFee: Number(totalFee),
      paidFee: Number(initialPaid),
      remainingFee: Number(totalFee) - Number(initialPaid),
      nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      installments: [
        {
          id: "INS-1",
          title: "1st Installment / Admission Fee",
          amount: Number(initialPaid),
          dueDate: new Date().toISOString().slice(0, 10),
          status: "Paid",
          paidDate: new Date().toISOString().slice(0, 10),
          paymentMethod: "UPI",
          transactionId: `UPI/${Math.floor(100000 + Math.random() * 900000)}/PAY`
        },
        {
          id: "INS-2",
          title: "2nd Installment Balance",
          amount: Number(totalFee) - Number(initialPaid),
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          status: "Due",
          paidDate: null,
          paymentMethod: null,
          transactionId: null
        }
      ]
    };

    // Invoke Supabase Atomic Lead Conversion RPC if configured
    if (isSupabaseConfigured && app.leadId) {
      try {
        await supabaseService.convertLeadToStudent(app.leadId, 'a0000000-0000-0000-0000-000000000001');
      } catch (err) {
        console.warn("Supabase RPC convert lead warning:", err);
      }
    }

    setStudents(prev => [newStudent, ...prev]);
    updateApplicationStatus(app.id, "Admission Confirmed");
    updateLeadStatus(app.leadId, "converted");

    // Also record initial payment receipt if initialPaid > 0
    if (initialPaid > 0) {
      recordPayment({
        studentId: newStudent.id,
        studentName: newStudent.name,
        courseName: newStudent.courseName,
        universityName: newStudent.universityName,
        amount: initialPaid,
        paymentMethod: "UPI",
        transactionId: `UPI/${Math.floor(100000 + Math.random() * 900000)}/PAY`,
        receivedBy: "Finance Dept",
        remarks: "Admission Confirmation First Installment"
      });
    }

    // Celebration Confetti
    try {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } catch(e) {}

    addAuditLog("Admission Confirmed", `Student ${newStudent.name} enrolled in ${newStudent.courseName} (${enrollmentNo})`);
    addNotification("Admission Confirmed 🌟", `${newStudent.name} is now an enrolled student (${enrollmentNo})`, "admission");

    return newStudent;
  };

  // Record Payment & Generate Receipt
  const recordPayment = async (data) => {
    const receiptNo = `REC-2026-${Math.floor(4000 + Math.random() * 5000)}`;
    const student = students.find(s => s.id === data.studentId);

    let updatedRemaining = 0;
    if (student) {
      const newPaid = Number(student.paidFee) + Number(data.amount);
      updatedRemaining = Math.max(0, Number(student.totalFee) - newPaid);

      setStudents(prev => prev.map(s => {
        if (s.id === data.studentId) {
          const isFull = newPaid >= s.totalFee;
          return {
            ...s,
            paidFee: newPaid,
            remainingFee: updatedRemaining,
            feeStatus: isFull ? "Paid" : "Partially Paid",
            installments: s.installments.map((ins, idx) => {
              if (idx === 0 && ins.status !== "Paid") {
                return { ...ins, status: "Paid", paidDate: new Date().toISOString().slice(0, 10), paymentMethod: data.paymentMethod, transactionId: data.transactionId };
              }
              return ins;
            })
          };
        }
        return s;
      }));
    }

    const newPayment = {
      id: `PAY-${Math.floor(9000 + Math.random() * 1000)}`,
      receiptNo: receiptNo,
      studentId: data.studentId,
      studentName: data.studentName || student?.name || "Student",
      courseName: data.courseName || student?.courseName || "",
      universityName: data.universityName || student?.universityName || "",
      amount: Number(data.amount),
      paymentDate: data.paymentDate || new Date().toISOString().slice(0, 10),
      paymentMethod: data.paymentMethod || "UPI",
      transactionId: data.transactionId || `TXN-${Date.now().toString().slice(-6)}`,
      receivedBy: data.receivedBy || "Accounts Desk",
      remarks: data.remarks || "Fee payment cleared",
      remainingBalance: updatedRemaining
    };

    setPayments(prev => [newPayment, ...prev]);
    addAuditLog("Payment Recorded", `₹${data.amount} received from ${newPayment.studentName} (Receipt: ${receiptNo})`);
    addNotification("Payment Received 💰", `₹${data.amount} received from ${newPayment.studentName}`, "payment");

    return newPayment;
  };

  // Add / Edit Course
  const saveCourse = (courseData) => {
    if (courseData.id) {
      setCourses(prev => prev.map(c => c.id === courseData.id ? courseData : c));
      addAuditLog("Course Updated", `Updated course ${courseData.name}`);
    } else {
      const newCourse = {
        ...courseData,
        id: `CRS-${Math.floor(200 + Math.random() * 700)}`,
        status: "Active"
      };
      setCourses(prev => [newCourse, ...prev]);
      addAuditLog("Course Created", `Added new course ${newCourse.name}`);
    }
  };

  // Add / Edit University
  const saveUniversity = (uniData) => {
    if (uniData.id) {
      setUniversities(prev => prev.map(u => u.id === uniData.id ? uniData : u));
      addAuditLog("University Updated", `Updated university ${uniData.name}`);
    } else {
      const newUni = {
        ...uniData,
        id: `UNI-${Math.floor(100 + Math.random() * 900)}`,
        status: "Active"
      };
      setUniversities(prev => [newUni, ...prev]);
      addAuditLog("University Created", `Added university ${newUni.name}`);
    }
  };

  const updateSettings = (newSet) => {
    setSettings(prev => ({ ...prev, ...newSet }));
    addAuditLog("Settings Updated", "System configuration and branding updated");
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const registerStudent = (data) => {
    const studentId = `STD-2026-${Math.floor(800 + Math.random() * 150)}`;
    const enrollmentNo = `${(data.preferredUniversity || 'LPU').slice(0, 3).toUpperCase()}-${(data.preferredCourse || 'MBA').slice(0, 3).toUpperCase()}-2026-${Math.floor(4000 + Math.random() * 5000)}`;

    const newStudent = {
      id: studentId,
      studentId: `ED-${studentId.replace('STD-', '')}`,
      enrollmentNo: enrollmentNo,
      name: data.name,
      mobile: data.mobile,
      whatsapp: data.mobile,
      email: data.email,
      city: data.city || "Delhi NCR",
      state: data.state || "Delhi",
      courseId: "CRS-201",
      courseName: data.preferredCourse || "Master of Business Administration (MBA)",
      universityId: "UNI-103",
      universityName: data.preferredUniversity || "LPU Online",
      studyMode: "Distance / Online LMS",
      admissionDate: new Date().toISOString().slice(0, 10),
      counsellorId: "USR-103",
      counsellorName: "Amit Kumar",
      feeStatus: "Due",
      totalFee: 84000,
      paidFee: 0,
      remainingFee: 84000,
      nextDueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      installments: [
        {
          id: "INS-1",
          title: "1st Installment / Admission Fee",
          amount: 25000,
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
          status: "Due",
          paidDate: null,
          paymentMethod: null,
          transactionId: null
        },
        {
          id: "INS-2",
          title: "2nd Installment Balance",
          amount: 59000,
          dueDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
          status: "Due",
          paidDate: null,
          paymentMethod: null,
          transactionId: null
        }
      ]
    };

    setStudents(prev => [newStudent, ...prev]);

    // Also register lead record
    addLead({
      name: data.name,
      mobile: data.mobile,
      whatsapp: data.mobile,
      email: data.email,
      city: data.city || "Delhi NCR",
      qualification: data.qualification || "Graduation",
      preferredCourse: data.preferredCourse || "MBA Online",
      preferredUniversity: data.preferredUniversity || "LPU Online",
      source: "Student Self-Registration Portal",
      priority: "hot"
    });

    addAuditLog("Student Registered", `New student self-registered account ${data.name} (${enrollmentNo})`);
    addNotification("New Student Registration 🎓", `${data.name} created a student account (${data.preferredCourse})`, "admission");

    try {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } catch(e) {}

    return newStudent;
  };

  return (
    <CrmContext.Provider value={{
      settings,
      updateSettings,
      leadStatuses,
      setLeadStatuses,
      leadPriorities,
      leads,
      universities,
      courses,
      applications,
      students,
      payments,
      followups,
      campaigns,
      notifications,
      auditLogs,
      addLead,
      updateLeadStatus,
      updateLeadPriority,
      assignLead,
      scheduleFollowup,
      completeFollowup,
      convertLeadToApplication,
      updateApplicationStatus,
      convertApplicationToStudent,
      registerStudent,
      recordPayment,
      saveCourse,
      saveUniversity,
      checkDuplicate,
      markNotificationRead
    }}>
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => useContext(CrmContext);
