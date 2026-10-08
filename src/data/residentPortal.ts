export type UtilityType = "Water" | "Electricity";

export type Fine = {
  id: string;
  residentId: string;
  status: "Unpaid" | "Appealed" | "Waived";
  violation: string;
  location: string;
  date: string;
  amount: number;
  photo: string;
};

export type MaintenanceTicketStage = "Reported" | "Dispatched" | "In Progress" | "Resolved";

export type ResidentIssueStatus = "Submitted" | "Field Guard Review" | "Field Guard Checked";

export type MaintenanceTicket = {
  id: string;
  type: string;
  location: string;
  reportedDate: string;
  stage: MaintenanceTicketStage;
};

export type ResidentServiceRequest = Omit<MaintenanceTicket, "stage"> & {
  stage: MaintenanceTicketStage | ResidentIssueStatus | "Rejected";
  description: string;
  phone: string;
  preferredDate: string;
  attachment: string;
  rejectionReason?: string;
  resolvedAt?: string | null;
};

export type ResidentIssue = {
  id: string;
  phone: string;
  subject: string;
  category: string;
  description: string;
  photo: string;
  location: string;
  reportedDate: string;
  status: ResidentIssueStatus;
};

export type InvoiceStatus = "Paid" | "Due";

export type Invoice = {
  id: string;
  period: string;
  rent: number;
  water: number;
  electricity: number;
  fines: number;
  total: number;
  status: InvoiceStatus;
};

export type ResidentProperty = {
  coverPhoto: string;
  address: string;
  zone: string;
  district: string;
  leaseStatus: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  deposit: number;
  leaseType: string;
  utilityAccounts: Array<{ name: string; account: string }>;
  emergencyContacts: Array<{ name: string; phone: string }>;
};

export const resident = {
  name: "Maria Reyes",
  id: "RES-00441",
};

export const residentProperty: ResidentProperty = {
  coverPhoto: "Property cover photo",
  address: "14 Rothschild Boulevard, Apt 2B, Tel Aviv-Yafo",
  zone: "Zone 3",
  district: "Central Tel Aviv",
  leaseStatus: "Active Lease",
  propertyType: "Residential Apartment",
  bedrooms: 2,
  bathrooms: 1,
  floor: "2nd floor",
  leaseStart: "1 Jan 2026",
  leaseEnd: "31 Dec 2026",
  monthlyRent: 5800,
  deposit: 5800,
  leaseType: "Fixed-term lease",
  utilityAccounts: [
    { name: "Water", account: "UTIL-WTR-2041" },
    { name: "Electricity", account: "UTIL-ELEC-7718" },
  ],
  emergencyContacts: [
    { name: "Municipal service center", phone: "03-555-2041" },
    { name: "After-hours maintenance", phone: "03-555-9911" },
  ],
};

export const utilityUsage: Record<UtilityType, Array<{ month: string; usage: number }>> = {
  Water: [
    { month: "Mar 2026", usage: 18 },
    { month: "Apr 2026", usage: 21 },
    { month: "May 2026", usage: 17 },
    { month: "Jun 2026", usage: 24 },
    { month: "Jul 2026", usage: 22 },
    { month: "Aug 2026", usage: 19 },
  ],
  Electricity: [
    { month: "Mar 2026", usage: 310 },
    { month: "Apr 2026", usage: 288 },
    { month: "May 2026", usage: 325 },
    { month: "Jun 2026", usage: 341 },
    { month: "Jul 2026", usage: 367 },
    { month: "Aug 2026", usage: 352 },
  ],
};

export const seededFines: Fine[] = [
  {
    id: "CIT-1042",
    residentId: "RES-00441",
    status: "Unpaid",
    violation: "Parking on the sidewalk",
    location: "Rothschild Boulevard",
    date: "4 Sep 2026",
    amount: 500,
    photo: "Citation photo",
  },
  {
    id: "CIT-1018",
    residentId: "RES-00388",
    status: "Unpaid",
    violation: "Blue-and-white parking without payment",
    location: "Ibn Gabirol Street",
    date: "28 Aug 2026",
    amount: 100,
    photo: "Citation photo",
  },
  {
    id: "CIT-1043",
    residentId: "RES-00441",
    status: "Unpaid",
    violation: "Blue-and-white parking without payment",
    location: "Rothschild Boulevard",
    date: "19 Sep 2026",
    amount: 100,
    photo: "Citation photo",
  },
  {
    id: "CIT-0997",
    residentId: "RES-00441",
    status: "Appealed",
    violation: "Stopping on a red-and-white curb",
    location: "Levinsky Street",
    date: "12 Aug 2026",
    amount: 250,
    photo: "Citation photo",
  },
];

export const seededInvoices: Invoice[] = [
  {
    id: "INV-2026-05",
    period: "May 2026",
    rent: 5800,
    water: 130,
    electricity: 250,
    fines: 0,
    total: 6180,
    status: "Paid",
  },
  {
    id: "INV-2026-06",
    period: "Jun 2026",
    rent: 5800,
    water: 140,
    electricity: 280,
    fines: 0,
    total: 6220,
    status: "Paid",
  },
  {
    id: "INV-2026-07",
    period: "Jul 2026",
    rent: 5800,
    water: 145,
    electricity: 295,
    fines: 250,
    total: 6490,
    status: "Paid",
  },
  {
    id: "INV-2026-08",
    period: "Aug 2026",
    rent: 5800,
    water: 150,
    electricity: 320,
    fines: 600,
    total: 6870,
    status: "Due",
  },
];

export const seededMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: "TKT-2201",
    type: "Pothole",
    location: "Ibn Gabirol Street, near 88",
    reportedDate: "1 Sep 2026",
    stage: "In Progress",
  },
  {
    id: "TKT-2189",
    type: "Broken Streetlight",
    location: "Dizengoff Street and King George Street",
    reportedDate: "26 Aug 2026",
    stage: "Resolved",
  },
  {
    id: "TKT-2174",
    type: "Blocked Storm Drain",
    location: "Rothschild Boulevard, entrance 14",
    reportedDate: "19 Aug 2026",
    stage: "Dispatched",
  },
];

export const seededResidentIssues: ResidentIssue[] = [
  {
    id: "ISS-3001",
    phone: "050-555-4412",
    subject: "Illegal parked car in resident area",
    category: "Parking",
    description: "A vehicle is blocking the residential parking spaces near the east entrance.",
    photo: "Parking issue photo",
    location: "14 Rothschild Boulevard, east entrance",
    reportedDate: "17 Sep 2026",
    status: "Field Guard Review",
  },
];
