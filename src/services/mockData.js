// Central Mock Database and Initial Data State for Distance Education CRM

export const initialSystemSettings = {
  agencyName: "EduVeda Distance Learning Consultancy",
  tagline: "India's Premier Recognized Distance & Online University Guidance Platform",
  taglineHindi: "भारत का प्रमुख मान्यता प्राप्त दूरस्थ और ऑनलाइन विश्वविद्यालय मार्गदर्शन केंद्र",
  logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150",
  logoWidth: 140,
  logoHeight: 40,
  faviconUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=32",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "admissions@eduveda.in",
  address: "Plot 42, Knowledge Park III, Greater Noida, Delhi NCR - 201306",
  gstin: "07AAAAA0000A1Z5",
  primaryColor: "#003FB1",
  secondaryColor: "#006A61",
  accentColor: "#059669",
  currentSession: "July 2026 / Jan 2027",
  language: "en", // 'en' | 'hi'
  autoAssignStrategy: "round-robin", // 'round-robin' | 'load-balance'
};

export const userRoles = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_MANAGER: "Admin / Manager",
  COUNSELLOR: "Counsellor / Sales Executive",
  ACCOUNTANT: "Accountant",
  STUDENT: "Student"
};

export const sampleUsers = [
  { id: "USR-101", name: "Anand Sharma", email: "anand@eduveda.in", role: userRoles.SUPER_ADMIN, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", phone: "+91 98100 11223" },
  { id: "USR-102", name: "Priya Verma", email: "priya@eduveda.in", role: userRoles.ADMIN_MANAGER, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", phone: "+91 98100 22334" },
  { id: "USR-103", name: "Amit Kumar", email: "amit@eduveda.in", role: userRoles.COUNSELLOR, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", phone: "+91 98100 33445" },
  { id: "USR-104", name: "Neha Singh", email: "neha@eduveda.in", role: userRoles.COUNSELLOR, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", phone: "+91 98100 44556" },
  { id: "USR-105", name: "Rajesh Gupta", email: "rajesh@eduveda.in", role: userRoles.COUNSELLOR, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", phone: "+91 98100 55667" },
  { id: "USR-106", name: "Sunita Patel", email: "sunita@eduveda.in", role: userRoles.COUNSELLOR, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", phone: "+91 98100 66778" },
  { id: "USR-107", name: "Ramesh Tiwari", email: "finance@eduveda.in", role: userRoles.ACCOUNTANT, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", phone: "+91 98100 77889" },
  { id: "USR-108", name: "Rahul Mehra (Student)", email: "rahul.mehra@gmail.com", role: userRoles.STUDENT, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", phone: "+91 98711 99001", studentId: "STD-2026-801" }
];

export const leadStatuses = [
  { id: "new", name: "New", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "contacted", name: "Contacted", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { id: "not_reachable", name: "Not Reachable", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { id: "counselling_pending", name: "Counselling Pending", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "interested", name: "Interested", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "followup_required", name: "Follow-up Required", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "application_started", name: "Application Started", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  { id: "documents_pending", name: "Documents Pending", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "payment_pending", name: "Payment Pending", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "admission_confirmed", name: "Admission Confirmed", color: "bg-teal-100 text-teal-800 border-teal-300" },
  { id: "converted", name: "Converted", color: "bg-green-100 text-green-800 border-green-300" },
  { id: "not_interested", name: "Not Interested", color: "bg-stone-100 text-stone-800 border-stone-300" },
  { id: "lost", name: "Lost", color: "bg-red-100 text-red-800 border-red-300" },
  { id: "duplicate", name: "Duplicate", color: "bg-slate-100 text-slate-600 border-slate-300" }
];

export const leadPriorities = [
  { id: "hot", name: "Hot 🔥", badge: "bg-red-500 text-white" },
  { id: "warm", name: "Warm ☀️", badge: "bg-amber-500 text-white" },
  { id: "cold", name: "Cold ❄️", badge: "bg-blue-500 text-white" }
];

export const sampleUniversities = [
  {
    id: "UNI-101",
    name: "IGNOU (Indira Gandhi National Open University)",
    shortName: "IGNOU",
    logo: "🏛️",
    accreditation: "UGC-DEB Approved | NAAC A++ Grade (Central University)",
    website: "https://ignou.ac.in",
    description: "The world's largest open university offering Govt-recognized distance undergraduate & postgraduate degrees across India.",
    location: "New Delhi",
    status: "Active",
    popularCoursesCount: 14
  },
  {
    id: "UNI-102",
    name: "Subharti University (DDE)",
    shortName: "Subharti",
    logo: "🏫",
    accreditation: "UGC-DEB Approved | NAAC A Grade",
    website: "https://subhartidde.com",
    description: "Renowned distance learning institution providing flexible exam centers and affordable semester fee options.",
    location: "Meerut, Uttar Pradesh",
    status: "Active",
    popularCoursesCount: 10
  },
  {
    id: "UNI-103",
    name: "LPU Online (Lovely Professional University)",
    shortName: "LPU Online",
    logo: "🎓",
    accreditation: "UGC Entitled | NAAC A++ Grade | NIRF Top Rank",
    website: "https://lpuonline.com",
    description: "Top-tier private university offering interactive LMS, recorded video lectures, live weekend masterclasses, and placement assistance.",
    location: "Phagwara, Punjab",
    status: "Active",
    popularCoursesCount: 12
  },
  {
    id: "UNI-104",
    name: "NMIMS CDOE",
    shortName: "NMIMS",
    logo: "💼",
    accreditation: "UGC-DEB Approved | NAAC A+ Grade B-School",
    website: "https://online.nmims.edu",
    description: "Premier executive management institute offering online MBA with dual specialization for working professionals.",
    location: "Mumbai, Maharashtra",
    status: "Active",
    popularCoursesCount: 8
  },
  {
    id: "UNI-105",
    name: "Jain University Online",
    shortName: "Jain Online",
    logo: "🌟",
    accreditation: "UGC Entitled | NAAC A++ Grade",
    website: "https://onlinejain.com",
    description: "Offers global electives, AI-driven learning portals, and 50+ specialized online MBA/MCA courses.",
    location: "Bengaluru, Karnataka",
    status: "Active",
    popularCoursesCount: 9
  }
];

export const sampleCourses = [
  {
    id: "CRS-201",
    name: "Master of Business Administration (MBA)",
    category: "Postgraduate",
    degreeType: "Master's Degree",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation with 50% marks (45% for reserved category)",
    universityId: "UNI-103", // LPU
    universityName: "LPU Online",
    studyMode: "Distance / Online LMS",
    totalFee: 65000,
    yearlyFee: 32500,
    admissionDates: "July 2026 Batch - Closing 15th Sep",
    prospectusUrl: "#",
    status: "Active",
    documentsRequired: ["10th Marksheet", "12th Marksheet", "Graduation Marksheet", "Aadhaar Card", "Passport Size Photo", "Signature"],
    description: "Comprehensive management degree with specializations in HR, Finance, Marketing, Data Analytics & International Business."
  },
  {
    id: "CRS-202",
    name: "Master of Computer Applications (MCA)",
    category: "Postgraduate",
    degreeType: "Master's Degree",
    duration: "2 Years",
    eligibility: "BCA/B.Sc CS or Graduation with Math at 10+2 level",
    universityId: "UNI-101", // IGNOU
    universityName: "IGNOU",
    studyMode: "Distance Learning",
    totalFee: 48000,
    yearlyFee: 24000,
    admissionDates: "July 2026 Batch Open",
    prospectusUrl: "#",
    status: "Active",
    documentsRequired: ["10th Marksheet", "12th Marksheet", "Graduation Degree", "Aadhaar Card", "Photo"],
    description: "Industry-aligned software engineering, cloud computing, and full-stack development curriculum."
  },
  {
    id: "CRS-203",
    name: "Bachelor of Business Administration (BBA)",
    category: "Undergraduate",
    degreeType: "Bachelor's Degree",
    duration: "3 Years",
    eligibility: "12th Pass from recognized board (Any Stream)",
    universityId: "UNI-102", // Subharti
    universityName: "Subharti University",
    studyMode: "Distance Mode",
    totalFee: 36000,
    yearlyFee: 12000,
    admissionDates: "Admissions Open",
    prospectusUrl: "#",
    status: "Active",
    documentsRequired: ["10th Certificate", "12th Marksheet", "Aadhaar Card", "Photo"],
    description: "Foundation program in corporate management, marketing strategies, and accounting principles."
  },
  {
    id: "CRS-204",
    name: "Bachelor of Computer Applications (BCA)",
    category: "Undergraduate",
    degreeType: "Bachelor's Degree",
    duration: "3 Years",
    eligibility: "12th Pass with Mathematics or Computer Science",
    universityId: "UNI-105", // Jain
    universityName: "Jain University Online",
    studyMode: "Online LMS",
    totalFee: 54000,
    yearlyFee: 18000,
    admissionDates: "Batches starting soon",
    prospectusUrl: "#",
    status: "Active",
    documentsRequired: ["10th Marksheet", "12th Marksheet", "Aadhaar Card", "Photo"],
    description: "Modern computer science fundamentals covering Python, Web Technologies, Database Systems & AI."
  },
  {
    id: "CRS-205",
    name: "Bachelor of Arts (BA General)",
    category: "Undergraduate",
    degreeType: "Bachelor's Degree",
    duration: "3 Years",
    eligibility: "12th Pass in any stream",
    universityId: "UNI-101", // IGNOU
    universityName: "IGNOU",
    studyMode: "Distance Learning",
    totalFee: 15000,
    yearlyFee: 5000,
    admissionDates: "July Session Ongoing",
    prospectusUrl: "#",
    status: "Active",
    documentsRequired: ["10th Marksheet", "12th Marksheet", "Aadhaar", "Photo"],
    description: "Flexible liberal arts degree ideal for UPSC / Govt job aspirants."
  }
];

export const sampleLeads = [
  {
    id: "LD-2026-1001",
    name: "Vikram Malhotra",
    mobile: "+91 98765 12345",
    whatsapp: "+91 98765 12345",
    email: "vikram.m@gmail.com",
    city: "New Delhi",
    state: "Delhi",
    dateOfBirth: "1998-05-14",
    qualification: "B.Com",
    passingYear: "2021",
    preferredCourse: "Master of Business Administration (MBA)",
    preferredUniversity: "LPU Online",
    preferredStudyMode: "Online LMS",
    budget: "₹50,000 - ₹70,000",
    source: "Website Form",
    campaign: "Meta_MBA_July2026",
    counsellorId: "USR-103",
    counsellorName: "Amit Kumar",
    priority: "hot",
    status: "interested",
    tags: ["High Budget", "Working Professional", "Immediate Admission"],
    lastContacted: "2026-08-23 14:30",
    nextFollowup: "2026-08-25 11:00",
    notes: "Wants weekend online classes. Currently working in HDFC Bank. Send LPU syllabus PDF.",
    createdDate: "2026-08-20",
    utmSource: "facebook",
    utmMedium: "cpc"
  },
  {
    id: "LD-2026-1002",
    name: "Pooja Sharma",
    mobile: "+91 98112 34567",
    whatsapp: "+91 98112 34567",
    email: "pooja.sharma99@yahoo.com",
    city: "Patna",
    state: "Bihar",
    dateOfBirth: "2000-09-21",
    qualification: "B.Sc CS",
    passingYear: "2023",
    preferredCourse: "Master of Computer Applications (MCA)",
    preferredUniversity: "IGNOU",
    preferredStudyMode: "Distance Learning",
    budget: "Under ₹50,000",
    source: "Google Ads",
    campaign: "Google_MCA_Search",
    counsellorId: "USR-104",
    counsellorName: "Neha Singh",
    priority: "warm",
    status: "documents_pending",
    tags: ["IGNOU Specific", "Govt Job Aspirant"],
    lastContacted: "2026-08-24 10:15",
    nextFollowup: "2026-08-25 15:00",
    notes: "Graduation marksheet uploaded partially. Needs to send 12th certificate for eligibility check.",
    createdDate: "2026-08-21",
    utmSource: "google",
    utmMedium: "search"
  },
  {
    id: "LD-2026-1003",
    name: "Rohan Verma",
    mobile: "+91 99588 77665",
    whatsapp: "+91 99588 77665",
    email: "rohan.v@outlook.com",
    city: "Jaipur",
    state: "Rajasthan",
    dateOfBirth: "2002-11-05",
    qualification: "12th Pass (Commerce)",
    passingYear: "2024",
    preferredCourse: "Bachelor of Business Administration (BBA)",
    preferredUniversity: "Subharti University",
    preferredStudyMode: "Distance Mode",
    budget: "₹30,000 - ₹40,000",
    source: "WhatsApp Direct",
    campaign: "Organic_WhatsApp",
    counsellorId: "USR-105",
    counsellorName: "Rajesh Gupta",
    priority: "hot",
    status: "payment_pending",
    tags: ["1st Year Admission", "Father Paying"],
    lastContacted: "2026-08-24 12:00",
    nextFollowup: "2026-08-24 17:00",
    notes: "Form filled completely. Token amount ₹5,000 promised via PhonePe today by 5 PM.",
    createdDate: "2026-08-22",
    utmSource: "whatsapp",
    utmMedium: "chat"
  },
  {
    id: "LD-2026-1004",
    name: "Sneha Reddi",
    mobile: "+91 97011 22334",
    whatsapp: "+91 97011 22334",
    email: "sneha.reddi@gmail.com",
    city: "Hyderabad",
    state: "Telangana",
    dateOfBirth: "1997-03-12",
    qualification: "B.Tech",
    passingYear: "2019",
    preferredCourse: "Master of Business Administration (MBA)",
    preferredUniversity: "NMIMS CDOE",
    preferredStudyMode: "Online LMS",
    budget: "Above ₹80,000",
    source: "Referral",
    campaign: "Alumni_Referral",
    counsellorId: "USR-103",
    counsellorName: "Amit Kumar",
    priority: "hot",
    status: "application_started",
    tags: ["Corporate Executive", "Executive MBA"],
    lastContacted: "2026-08-23 16:45",
    nextFollowup: "2026-08-26 10:30",
    notes: "Referred by Ramesh (Batch 2024). Interested in Finance specialization.",
    createdDate: "2026-08-18",
    utmSource: "referral",
    utmMedium: "direct"
  },
  {
    id: "LD-2026-1005",
    name: "Deepak Yadav",
    mobile: "+91 94150 99887",
    whatsapp: "+91 94150 99887",
    email: "deepak.yadav@gmail.com",
    city: "Lucknow",
    state: "Uttar Pradesh",
    dateOfBirth: "2001-01-25",
    qualification: "12th Pass (Arts)",
    passingYear: "2023",
    preferredCourse: "Bachelor of Arts (BA General)",
    preferredUniversity: "IGNOU",
    preferredStudyMode: "Distance Learning",
    budget: "Under ₹20,000",
    source: "Walk-in Enquiry",
    campaign: "Branch_Walkin",
    counsellorId: "USR-106",
    counsellorName: "Sunita Patel",
    priority: "warm",
    status: "followup_required",
    tags: ["Walk-in", "UPSC Prep"],
    lastContacted: "2026-08-22 11:30",
    nextFollowup: "2026-08-24 16:30",
    notes: "Visited office with elder brother. Requested prospectus details for IGNOU study centers in Lucknow.",
    createdDate: "2026-08-22",
    utmSource: "offline",
    utmMedium: "walkin"
  },
  {
    id: "LD-2026-1006",
    name: "Anjali Deshmukh",
    mobile: "+91 98220 44556",
    whatsapp: "+91 98220 44556",
    email: "anjali.d@gmail.com",
    city: "Pune",
    state: "Maharashtra",
    dateOfBirth: "1999-07-18",
    qualification: "B.Sc",
    passingYear: "2022",
    preferredCourse: "Master of Computer Applications (MCA)",
    preferredUniversity: "Jain University Online",
    preferredStudyMode: "Online LMS",
    budget: "₹50,000 - ₹60,000",
    source: "Instagram Campaign",
    campaign: "Insta_Reels_Tech",
    counsellorId: "USR-104",
    counsellorName: "Neha Singh",
    priority: "cold",
    status: "not_reachable",
    tags: ["Instagram", "Unreachable 2x"],
    lastContacted: "2026-08-23 09:30",
    nextFollowup: "2026-08-25 12:00",
    notes: "Called twice on Sunday. Phone rang out. Sent WhatsApp brochure link.",
    createdDate: "2026-08-23",
    utmSource: "instagram",
    utmMedium: "social"
  }
];

export const sampleApplications = [
  {
    id: "APP-2026-5001",
    applicationNo: "EDU-APP-8841",
    leadId: "LD-2026-1004",
    studentName: "Sneha Reddi",
    mobile: "+91 97011 22334",
    email: "sneha.reddi@gmail.com",
    courseId: "CRS-201",
    courseName: "Master of Business Administration (MBA)",
    universityId: "UNI-104",
    universityName: "NMIMS CDOE",
    session: "July 2026",
    status: "Verification Pending", // 'Draft' | 'Documents Pending' | 'Verification Pending' | 'Fee Pending' | 'Submitted to University' | 'Admission Confirmed'
    counsellorId: "USR-103",
    counsellorName: "Amit Kumar",
    applicationDate: "2026-08-20",
    documents: [
      { name: "Aadhaar Card", status: "Verified", fileUrl: "#" },
      { name: "Photograph", status: "Verified", fileUrl: "#" },
      { name: "10th Marksheet", status: "Verified", fileUrl: "#" },
      { name: "12th Marksheet", status: "Verified", fileUrl: "#" },
      { name: "Graduation Marksheet", status: "Pending Review", fileUrl: "#" }
    ],
    remarks: "Documents uploaded on portal. Awaiting final eligibility verification from NMIMS team."
  },
  {
    id: "APP-2026-5002",
    applicationNo: "EDU-APP-8842",
    leadId: "LD-2026-1003",
    studentName: "Rohan Verma",
    mobile: "+91 99588 77665",
    email: "rohan.v@outlook.com",
    courseId: "CRS-203",
    courseName: "Bachelor of Business Administration (BBA)",
    universityId: "UNI-102",
    universityName: "Subharti University",
    session: "July 2026",
    status: "Fee Pending",
    counsellorId: "USR-105",
    counsellorName: "Rajesh Gupta",
    applicationDate: "2026-08-22",
    documents: [
      { name: "Aadhaar Card", status: "Verified", fileUrl: "#" },
      { name: "10th Certificate", status: "Verified", fileUrl: "#" },
      { name: "12th Marksheet", status: "Verified", fileUrl: "#" }
    ],
    remarks: "All documents clear. Token fee payment awaited."
  }
];

export const sampleStudents = [
  {
    id: "STD-2026-801",
    studentId: "ED-2026-801",
    enrollmentNo: "SUB-BBA-2026-4412",
    name: "Rahul Mehra",
    mobile: "+91 98711 99001",
    whatsapp: "+91 98711 99001",
    email: "rahul.mehra@gmail.com",
    city: "Delhi",
    state: "Delhi",
    courseId: "CRS-203",
    courseName: "Bachelor of Business Administration (BBA)",
    universityId: "UNI-102",
    universityName: "Subharti University",
    studyMode: "Distance Mode",
    admissionDate: "2026-07-15",
    counsellorId: "USR-103",
    counsellorName: "Amit Kumar",
    feeStatus: "Partially Paid", // 'Paid' | 'Partially Paid' | 'Due' | 'Overdue'
    totalFee: 36000,
    paidFee: 24000,
    remainingFee: 12000,
    nextDueDate: "2026-10-15",
    installments: [
      { id: "INS-1", title: "1st Installment (Year 1)", amount: 12000, dueDate: "2026-07-15", status: "Paid", paidDate: "2026-07-15", paymentMethod: "UPI", transactionId: "UPI/678912/PAY" },
      { id: "INS-2", title: "2nd Installment (Year 2)", amount: 12000, dueDate: "2026-08-15", status: "Paid", paidDate: "2026-08-14", paymentMethod: "Bank Transfer", transactionId: "NEFT/881923/SBIN" },
      { id: "INS-3", title: "3rd Installment (Year 3)", amount: 12000, dueDate: "2026-10-15", status: "Due", paidDate: null, paymentMethod: null, transactionId: null }
    ]
  },
  {
    id: "STD-2026-802",
    studentId: "ED-2026-802",
    enrollmentNo: "LPU-MBA-2026-9011",
    name: "Neha Agarwal",
    mobile: "+91 98990 11223",
    whatsapp: "+91 98990 11223",
    email: "neha.agarwal@gmail.com",
    city: "Noida",
    state: "Uttar Pradesh",
    courseId: "CRS-201",
    courseName: "Master of Business Administration (MBA)",
    universityId: "UNI-103",
    universityName: "LPU Online",
    studyMode: "Online LMS",
    admissionDate: "2026-06-10",
    counsellorId: "USR-104",
    counsellorName: "Neha Singh",
    feeStatus: "Paid",
    totalFee: 65000,
    paidFee: 65000,
    remainingFee: 0,
    nextDueDate: "N/A",
    installments: [
      { id: "INS-101", title: "Full Course Payment (LPS Scholarship applied)", amount: 65000, dueDate: "2026-06-10", status: "Paid", paidDate: "2026-06-10", paymentMethod: "Credit Card", transactionId: "HDFC/991023/PAY" }
    ]
  },
  {
    id: "STD-2026-803",
    studentId: "ED-2026-803",
    enrollmentNo: "IGN-MCA-2026-1102",
    name: "Amitabh Sen",
    mobile: "+91 98300 55443",
    whatsapp: "+91 98300 55443",
    email: "amitabh.sen@gmail.com",
    city: "Kolkata",
    state: "West Bengal",
    courseId: "CRS-202",
    courseName: "Master of Computer Applications (MCA)",
    universityId: "UNI-101",
    universityName: "IGNOU",
    studyMode: "Distance Learning",
    admissionDate: "2026-07-01",
    counsellorId: "USR-105",
    counsellorName: "Rajesh Gupta",
    feeStatus: "Overdue",
    totalFee: 48000,
    paidFee: 24000,
    remainingFee: 24000,
    nextDueDate: "2026-08-10",
    installments: [
      { id: "INS-201", title: "1st Year Fee", amount: 24000, dueDate: "2026-07-01", status: "Paid", paidDate: "2026-07-01", paymentMethod: "UPI", transactionId: "UPI/332101/PAY" },
      { id: "INS-202", title: "2nd Year Fee", amount: 24000, dueDate: "2026-08-10", status: "Overdue", paidDate: null, paymentMethod: null, transactionId: null }
    ]
  }
];

export const samplePayments = [
  {
    id: "PAY-9001",
    receiptNo: "REC-2026-4401",
    studentId: "STD-2026-801",
    studentName: "Rahul Mehra",
    courseName: "Bachelor of Business Administration (BBA)",
    universityName: "Subharti University",
    amount: 12000,
    paymentDate: "2026-08-14",
    paymentMethod: "Bank Transfer",
    transactionId: "NEFT/881923/SBIN",
    receivedBy: "Ramesh Tiwari (Finance)",
    remarks: "2nd Installment Received via SBI NEFT",
    remainingBalance: 12000
  },
  {
    id: "PAY-9002",
    receiptNo: "REC-2026-4402",
    studentId: "STD-2026-802",
    studentName: "Neha Agarwal",
    courseName: "Master of Business Administration (MBA)",
    universityName: "LPU Online",
    amount: 65000,
    paymentDate: "2026-06-10",
    paymentMethod: "Credit Card",
    transactionId: "HDFC/991023/PAY",
    receivedBy: "System Gateway",
    remarks: "Full course payment cleared with HDFC Credit Card",
    remainingBalance: 0
  }
];

export const sampleFollowups = [
  {
    id: "FLP-301",
    leadId: "LD-2026-1003",
    leadName: "Rohan Verma",
    counsellorId: "USR-105",
    counsellorName: "Rajesh Gupta",
    type: "Call", // 'Call' | 'WhatsApp' | 'Meeting' | 'Document Reminder' | 'Fee Reminder'
    dueDate: "2026-08-24 17:00",
    status: "Pending", // 'Pending' | 'Completed' | 'Overdue' | 'Cancelled'
    priority: "High",
    notes: "Confirm token payment of ₹5,000 for Subharti BBA form."
  },
  {
    id: "FLP-302",
    leadId: "LD-2026-1005",
    leadName: "Deepak Yadav",
    counsellorId: "USR-106",
    counsellorName: "Sunita Patel",
    type: "WhatsApp",
    dueDate: "2026-08-24 16:30",
    status: "Overdue",
    priority: "Medium",
    notes: "Send IGNOU Study Center address list for Lucknow on WhatsApp."
  },
  {
    id: "FLP-303",
    leadId: "LD-2026-1001",
    leadName: "Vikram Malhotra",
    counsellorId: "USR-103",
    counsellorName: "Amit Kumar",
    type: "Meeting",
    dueDate: "2026-08-25 11:00",
    status: "Pending",
    priority: "High",
    notes: "Google Meet session to demonstrate LPU online LMS platform."
  }
];

export const sampleCampaigns = [
  {
    id: "CMP-401",
    name: "Meta_MBA_July2026",
    platform: "Facebook / Instagram",
    budget: 45000,
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    leadsGenerated: 142,
    applications: 18,
    admissions: 12,
    revenue: 780000,
    roi: "1633%",
    status: "Active"
  },
  {
    id: "CMP-402",
    name: "Google_MCA_Search",
    platform: "Google Search Ads",
    budget: 30000,
    startDate: "2026-08-05",
    endDate: "2026-08-28",
    leadsGenerated: 89,
    applications: 14,
    admissions: 8,
    revenue: 384000,
    roi: "1180%",
    status: "Active"
  }
];

export const initialCmsState = {
  hero: {
    slides: [
      {
        id: "slide-1",
        headline: "Start Your UGC-Recognized Degree From Anywhere in India",
        headlineHindi: "भारत में कहीं से भी अपनी यूजीसी-मान्यता प्राप्त डिग्री शुरू करें",
        subheadline: "100% Online & Distance Programs from IGNOU, Subharti, LPU Online, NMIMS & Jain University.",
        ctaText: "Talk to a Counsellor",
        ctaUrl: "#enquiry-form",
        bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
        badge: "🎓 Admissions Open for July 2026 Session"
      },
      {
        id: "slide-2",
        headline: "Choose the Right University for Your Career Growth",
        headlineHindi: "अपने करियर के विकास के लिए सही विश्वविद्यालय चुनें",
        subheadline: "Get expert 1-on-1 admission guidance, fee installment plans, and zero-interest options.",
        ctaText: "Explore 50+ Courses",
        ctaUrl: "#courses-grid",
        bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
        badge: "⭐ 10,000+ Students Successfully Enrolled"
      }
    ]
  },
  stats: {
    yearsExperience: "12+",
    studentsGuided: "15,000+",
    partnerUniversities: "25+",
    admissionSuccessRate: "99.4%"
  },
  about: {
    title: "India's Most Trusted Distance Education Consultancy",
    content: "EduVeda bridges the gap between ambitious students and India's top UGC & DEB recognized open universities. We simplify university selection, application documentation, entrance exemptions, and installment fee payments under one roof.",
    features: [
      "100% Free Career Counselling",
      "Official University Authorized Information",
      "Flexible Easy EMI & Installment Options",
      "End-to-End Exam & Assignment Assistance"
    ]
  },
  testimonials: [
    {
      id: "TST-1",
      studentName: "Rahul Mehra",
      course: "BBA - Subharti University",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      review: "EduVeda counsellors guided me through the entire Subharti distance process. Got my enrollment number without any hassle while working!"
    },
    {
      id: "TST-2",
      studentName: "Neha Agarwal",
      course: "MBA - LPU Online",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      review: "The LMS access and weekend video classes of LPU Online are top-notch. Thanks to Amit Sir at EduVeda for explaining all options clearly."
    }
  ],
  faqs: [
    {
      id: "FAQ-1",
      category: "General",
      question: "Are distance degrees valid for Government Jobs & UPSC exams in India?",
      answer: "Yes! As per UGC & Supreme Court of India guidelines, distance degrees awarded by UGC-DEB recognized universities are 100% valid and equal to regular degrees for all Central/State Govt jobs, UPSC, SSC, Bank exams, and Higher Education."
    },
    {
      id: "FAQ-2",
      category: "Admissions",
      question: "Can I pay course fees in easy monthly installments?",
      answer: "Absolutely. We offer customized 2 to 4 installment schedules as well as zero-cost EMI options for top online universities."
    },
    {
      id: "FAQ-3",
      category: "Exams",
      question: "How are examinations conducted for distance courses?",
      answer: "Depending on your university, exams are either held at designated offline exam centers near your city or conducted online with AI remote proctoring from your home."
    }
  ]
};

export const sampleAuditLogs = [
  { id: "LOG-701", user: "Rahul Sharma (Website)", action: "Lead Created", details: "Enquiry submitted via Homepage form (ID: LD-2026-1001)", timestamp: "2026-08-20 14:00" },
  { id: "LOG-702", user: "Priya Verma (Manager)", action: "Lead Assigned", details: "Assigned LD-2026-1001 to Amit Kumar", timestamp: "2026-08-20 14:05" },
  { id: "LOG-703", user: "Ramesh Tiwari (Accountant)", action: "Payment Recorded", details: "₹12,000 received for Rahul Mehra (Rec # REC-2026-4401)", timestamp: "2026-08-14 11:20" }
];
