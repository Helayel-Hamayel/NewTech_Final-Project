export type UtilityType = 'Water' | 'Electricity'

export type Fine = {
  id: string
  status: 'Unpaid' | 'Appealed'
  violation: string
  location: string
  date: string
  amount: number
  photo: string
}

export type MaintenanceTicketStage = 'Reported' | 'Dispatched' | 'In Progress' | 'Resolved'

export type MaintenanceTicket = {
  id: string
  type: string
  location: string
  reportedDate: string
  stage: MaintenanceTicketStage
}

export type ResidentIssueStatus =
  | "Submitted"
  | "Field Guard Review"
  | "Field Guard Checked";

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
  address: "14 Maple Street, Unit 2B, Millbrook NY 12545",
  zone: "Zone 3",
  district: "Central District",
  leaseStatus: "Active Lease",
  propertyType: "Residential Apartment",
  bedrooms: 2,
  bathrooms: 1,
  floor: "2nd floor",
  leaseStart: "Jan 1, 2026",
  leaseEnd: "Dec 31, 2026",
  monthlyRent: 1250,
  deposit: 1250,
  leaseType: "Fixed-term lease",
  utilityAccounts: [
    { name: "Water", account: "UTIL-WTR-2041" },
    { name: "Electricity", account: "UTIL-ELEC-7718" },
  ],
  emergencyContacts: [
    { name: "Property management office", phone: "(555) 010-2041" },
    { name: "After-hours maintenance", phone: "(555) 010-9911" },
  ],
};

export const utilityUsage: Record<
  UtilityType,
  Array<{ month: string; usage: number }>
> = {
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
    status: "Unpaid",
    violation: "Illegal dumping",
    location: "Oak Blvd near #88",
    date: "Sep 4, 2026",
    amount: 150,
    photo: "Citation photo",
  },
  {
    id: "CIT-1018",
    status: "Unpaid",
    violation: "Parking violation",
    location: "14 Maple Street",
    date: "Aug 28, 2026",
    amount: 75,
    photo: "Citation photo",
  },
  {
    id: "CIT-0997",
    status: "Appealed",
    violation: "Missed waste collection",
    location: "Riverside Drive",
    date: "Aug 12, 2026",
    amount: 50,
    photo: "Citation photo",
  },
];

export const seededInvoices: Invoice[] = [
  {
    id: "INV-2026-05",
    period: "May 2026",
    rent: 1250,
    water: 32,
    electricity: 84,
    fines: 0,
    total: 1366,
    status: "Paid",
  },
  {
    id: "INV-2026-06",
    period: "Jun 2026",
    rent: 1250,
    water: 38,
    electricity: 92,
    fines: 0,
    total: 1380,
    status: "Paid",
  },
  {
    id: "INV-2026-07",
    period: "Jul 2026",
    rent: 1250,
    water: 41,
    electricity: 96,
    fines: 50,
    total: 1437,
    status: "Paid",
  },
  {
    id: "INV-2026-08",
    period: "Aug 2026",
    rent: 1250,
    water: 45,
    electricity: 101,
    fines: 75,
    total: 1471,
    status: "Due",
  },
];

export const seededMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: "TKT-2201",
    type: "Pothole",
    location: "Oak Blvd near #88",
    reportedDate: "Sep 1, 2026",
    stage: "In Progress",
  },
  {
    id: "TKT-2189",
    type: "Broken Streetlight",
    location: "Riverside Dr & Park Ave",
    reportedDate: "Aug 26, 2026",
    stage: "Resolved",
  },
  {
    id: "TKT-2174",
    type: "Blocked Storm Drain",
    location: "14 Maple St front",
    reportedDate: "Aug 19, 2026",
    stage: "Dispatched",
  },
];

export const seededResidentIssues: ResidentIssue[] = [
  {
    id: "ISS-3001",
    phone: "(555) 010-4412",
    subject: "Illegal parked car in resident area",
    category: "Parking",
    description:
      "A vehicle is blocking the reserved resident parking spaces near the east entrance.",
    photo: "Parking issue photo",
    location: "14 Maple Street, east entrance",
    reportedDate: "Sep 17, 2026",
    status: "Field Guard Review",
  },
];
