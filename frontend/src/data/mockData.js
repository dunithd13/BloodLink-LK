// BloodLink LK - Mock Data & Local Storage Store

export const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle"
];

export const MAJOR_HOSPITALS = [
  "National Hospital of Sri Lanka (Colombo 08)",
  "Lady Ridgeway Hospital for Children (Borella)",
  "Colombo South Teaching Hospital (Kalubowila)",
  "Colombo North Teaching Hospital (Ragama)",
  "Castle Street Hospital for Women (Colombo 08)",
  "National Hospital Kandy",
  "Teaching Hospital Karapitiya (Galle)",
  "Teaching Hospital Jaffna",
  "Teaching Hospital Anuradhapura",
  "Teaching Hospital Batticaloa",
  "Teaching Hospital Kurunegala",
  "District General Hospital Negombo",
  "Provincial General Hospital Badulla",
  "Teaching Hospital Ratnapura",
  "Teaching Hospital Peradeniya"
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Initial Users: Fixed Administrator and sample registered user
// Passwords stored strictly as SHA-256 hashes (never plain text)
// Admin: admin@bloodlink.lk / Admin@BloodLink2026!
// Demo User: kasun@gmail.com / Donor@1234!
export const INITIAL_USERS = [
  {
    id: "USR-ADMIN-001",
    name: "System Administrator",
    email: "admin@bloodlink.lk",
    passwordHash: "5cc1e7d163e7586eb0298cb958fde508da301d7ae9c193520c88cf68ef1a3c6a",
    location: "Colombo",
    contactNumber: "0771234567",
    bloodGroup: "O+",
    role: "ADMIN",
    createdAt: "2026-09-01 00:00"
  },
  {
    id: "USR-002",
    name: "Kasun Jayawardena",
    email: "kasun@gmail.com",
    passwordHash: "e91b3438833a1d8bdc3d0603415ca83a561fa00c84e71ae3fe09119c52c0a459",
    location: "Colombo",
    contactNumber: "0771234567",
    bloodGroup: "O+",
    role: "USER",
    createdAt: "2026-09-02 10:00"
  }
];

export const INITIAL_DONORS = [
  {
    id: "DON-001",
    name: "Kasun Jayawardena",
    email: "kasun.j@gmail.com",
    BloodGroup: "O+",
    Location: "Colombo",
    ContactNumber: "0771234567",
    AvailableDate: "2026-09-10",
    Status: "Available",
    lastDonation: "2026-04-12",
    totalDonations: 6
  },
  {
    id: "DON-002",
    name: "Dinithi Perera",
    email: "dinithi.p@outlook.com",
    BloodGroup: "A+",
    Location: "Gampaha",
    ContactNumber: "0718765432",
    AvailableDate: "2026-09-08",
    Status: "Available",
    lastDonation: "2026-03-20",
    totalDonations: 4
  },
  {
    id: "DON-003",
    name: "Rishan Silva",
    email: "rishan.silva@yahoo.com",
    BloodGroup: "B+",
    Location: "Kandy",
    ContactNumber: "0765544332",
    AvailableDate: "2026-09-15",
    Status: "Available",
    lastDonation: "2026-02-14",
    totalDonations: 9
  },
  {
    id: "DON-004",
    name: "Mohamed Faheem",
    email: "faheem.m@gmail.com",
    BloodGroup: "AB+",
    Location: "Colombo",
    ContactNumber: "0759988776",
    AvailableDate: "2026-09-12",
    Status: "Available",
    lastDonation: "2026-05-18",
    totalDonations: 3
  },
  {
    id: "DON-005",
    name: "Thilini Wickramasinghe",
    email: "thilini.w@gmail.com",
    BloodGroup: "O-",
    Location: "Galle",
    ContactNumber: "0702233445",
    AvailableDate: "2026-09-06",
    Status: "Available",
    lastDonation: "2026-01-10",
    totalDonations: 11
  },
  {
    id: "DON-006",
    name: "Kavindu Senanayake",
    email: "kavindu.s@gmail.com",
    BloodGroup: "A-",
    Location: "Kurunegala",
    ContactNumber: "0783344556",
    AvailableDate: "2026-09-20",
    Status: "Recently Donated",
    lastDonation: "2026-08-15",
    totalDonations: 5
  },
  {
    id: "DON-007",
    name: "Priyanka Ratnayake",
    email: "priyanka.r@gmail.com",
    BloodGroup: "B-",
    Location: "Kandy",
    ContactNumber: "0721122334",
    AvailableDate: "2026-09-18",
    Status: "Available",
    lastDonation: "2026-04-05",
    totalDonations: 2
  },
  {
    id: "DON-008",
    name: "Sivanesan Thangarajah",
    email: "sivanesan.t@gmail.com",
    BloodGroup: "AB-",
    Location: "Jaffna",
    ContactNumber: "0774433221",
    AvailableDate: "2026-09-14",
    Status: "Available",
    lastDonation: "2026-03-01",
    totalDonations: 8
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "REQ-001",
    RequestNumber: "REQ-LK-101",
    name: "Nimal Karunaratne",
    email: "nimal.karuna@gmail.com",
    BloodGroup: "O-",
    UnitsRequired: 3,
    Location: "Colombo",
    Hospital: "National Hospital of Sri Lanka (Colombo 08)",
    Urgency: "Critical",
    ContactNumber: "0776543210",
    RequiredDate: "2026-09-05",
    Description: "Emergency bypass surgery scheduled for tomorrow morning. Rare O-negative blood units urgently needed.",
    Status: "Pending",
    CreatedAt: "2026-09-04 08:30"
  },
  {
    id: "REQ-002",
    RequestNumber: "REQ-LK-102",
    name: "Sanduni Alwis",
    email: "sanduni.a@gmail.com",
    BloodGroup: "B+",
    UnitsRequired: 2,
    Location: "Galle",
    Hospital: "Teaching Hospital Karapitiya (Galle)",
    Urgency: "Urgent",
    ContactNumber: "0712345678",
    RequiredDate: "2026-09-06",
    Description: "Patient undergoing platelet transfusion for acute dengue fever complications. Donors please step forward.",
    Status: "In Progress",
    CreatedAt: "2026-09-03 14:15"
  },
  {
    id: "REQ-003",
    RequestNumber: "REQ-LK-103",
    name: "Lakshan Bandara",
    email: "lakshan.b@gmail.com",
    BloodGroup: "A+",
    UnitsRequired: 4,
    Location: "Kandy",
    Hospital: "National Hospital Kandy",
    Urgency: "Routine",
    ContactNumber: "0768901234",
    RequiredDate: "2026-09-12",
    Description: "Elective orthopedic hip replacement surgery planned next week. Pre-arranged units required.",
    Status: "Pending",
    CreatedAt: "2026-09-02 11:00"
  },
  {
    id: "REQ-004",
    RequestNumber: "REQ-LK-104",
    name: "Fathima Rizwana",
    email: "rizwana.f@gmail.com",
    BloodGroup: "AB+",
    UnitsRequired: 2,
    Location: "Colombo",
    Hospital: "Castle Street Hospital for Women (Colombo 08)",
    Urgency: "Urgent",
    ContactNumber: "0751239876",
    RequiredDate: "2026-09-07",
    Description: "Maternity ward emergency transfusion needed for postpartum care.",
    Status: "Fulfilled",
    CreatedAt: "2026-09-01 09:40"
  },
  {
    id: "REQ-005",
    RequestNumber: "REQ-LK-105",
    name: "Mahesh Gunasekara",
    email: "mahesh.guna@gmail.com",
    BloodGroup: "A-",
    UnitsRequired: 1,
    Location: "Gampaha",
    Hospital: "District General Hospital Negombo",
    Urgency: "Critical",
    ContactNumber: "0709876543",
    RequiredDate: "2026-09-05",
    Description: "Severe trauma from road traffic accident. Immediate blood transfusion required in ICU.",
    Status: "In Progress",
    CreatedAt: "2026-09-04 06:10"
  }
];

const STORAGE_KEYS = {
  DONORS: "bloodlink_lk_donors",
  REQUESTS: "bloodlink_lk_requests",
  USERS: "bloodlink_lk_users",
  CURRENT_USER: "bloodlink_lk_current_user"
};

// Users management
export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users to localStorage", e);
  }
};

// Session / Active User
export const getStoredSession = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveStoredSession = (user) => {
  try {
    // Strip sensitive fields like passwordHash before storing session
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return;
    }
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      contactNumber: user.contactNumber,
      bloodGroup: user.bloodGroup
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
  } catch (e) {
    console.error("Error saving session to localStorage", e);
  }
};

export const clearStoredSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (e) {
    console.error("Error clearing session", e);
  }
};

// Donors management
export const getStoredDonors = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DONORS);
    return data ? JSON.parse(data) : INITIAL_DONORS;
  } catch {
    return INITIAL_DONORS;
  }
};

export const saveStoredDonors = (donors) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  } catch (e) {
    console.error("Error saving donors to localStorage", e);
  }
};

// Requests management
export const getStoredRequests = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return data ? JSON.parse(data) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
};

export const saveStoredRequests = (requests) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error("Error saving requests to localStorage", e);
  }
};

export const resetToSampleData = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (e) {
    console.error("Error resetting data", e);
  }
};
