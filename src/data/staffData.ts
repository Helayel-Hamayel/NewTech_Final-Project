export type ReportFromBackend = {
  _id: string;
  resident: {
    _id: string;
    name: string;
  } | null;
  assignedFieldGuard: string | null;
  assignedTeam?: "FIELD_GUARD" | "MAINTENANCE" | null;
  category: string;
  description: string;
  location: string;
  phone: string;
  photoUrl: string;
  status: "NEW" | "DISPATCHED" | "IN PROGRESS" | "RESOLVED" | "REJECTED";
  rejectionReason?: string;
  resolvedAt?: string | null;
  createdAt: string;
};

export type StaffDispute = {
  _id: string;
  ticket: string;
  fineId: string;
  residentName: string;
  submittedAt: string;
  status: "PENDING" | "WAIVED" | "REJECTED";
  violation: string;
  fieldEvidence: string;
  residentEvidence: string;
  amount: number;
  reason: string;
};

export type StaffTab = "requests" | "disputes" | "billing" | "maintenance";

export type StaffServiceRequestStatus = "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
export type StaffServiceRequestDestination = "Field Guard" | "Maintenance Team";

export type StaffServiceRequest = {
  id: string;
  residentName: string;
  type: string;
  description: string;
  location: string;
  reported: string;
  phone: string;
  attachment: string;
  status: StaffServiceRequestStatus;
  assignedTo?: StaffServiceRequestDestination;
  rejectionReason?: string;
  resolvedAt?: string | null;
};

export const seededStaffServiceRequests: StaffServiceRequest[] = [
  {
    id: "ISS-3001",
    residentName: "Maria Reyes",
    type: "Parking",
    description: "A vehicle is blocking the residential parking spaces near the east entrance.",
    location: "14 Rothschild Boulevard, east entrance",
    reported: "7 Oct 2026",
    phone: "050-555-4412",
    attachment: "Parking issue photo",
    status: "Pending",
  },
  {
    id: "REQ-4002",
    residentName: "James Okonkwo",
    type: "Road and sidewalk",
    description: "A pothole is creating a hazard for pedestrians and cyclists.",
    location: "Ibn Gabirol Street, near 88",
    reported: "6 Oct 2026",
    phone: "052-555-1882",
    attachment: "No attachment",
    status: "Pending",
  },
  {
    id: "REQ-3998",
    residentName: "Aisha Mensah",
    type: "Lighting",
    description: "The streetlight outside the building has stopped working.",
    location: "21 Allenby Street",
    reported: "5 Oct 2026",
    phone: "054-555-9281",
    attachment: "No attachment",
    status: "Assigned",
    assignedTo: "Maintenance Team",
  },
];

export type BillingAccount = {
  property: string;
  account: string;
  resident: string;
  water: number;
  electricity: number;
  rent: number;
  fines: number;
  balance: number;
  lastPaid: string;
  status: "Current" | "Overdue" | "Paid";
};

export type StaffMaintenanceTicket = {
  id: string;
  issue: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "Unassigned" | "Dispatched" | "In Progress" | "Completed";
  reported: string;
  team?: string;
  eta?: string;
  completedAt?: string;
};

export const staffData = {
  name: "R. Kowalczyk",
  workName: "D-003",
};

export const staffDisputesData: StaffDispute[] = [
  {
    _id: "dispute-4821",
    ticket: "PKT-4821",
    fineId: "CIT-1042",
    residentName: "Maria Reyes",
    submittedAt: "2026-09-17T09:15:00Z",
    status: "PENDING",
    violation: "Parking on the sidewalk",
    fieldEvidence: "Officer photo available",
    residentEvidence: "No attachment",
    amount: 500,
    reason: "Vehicle was not hers",
  },
  {
    _id: "dispute-4802",
    ticket: "PKT-4802",
    fineId: "CIT-1018",
    residentName: "James Okonkwo",
    submittedAt: "2026-09-18T13:40:00Z",
    status: "PENDING",
    violation: "Blue-and-white parking without payment",
    fieldEvidence: "Parking payment record available",
    residentEvidence: "No attachment",
    amount: 100,
    reason: "Parking app showed a successful payment",
  },
  {
    _id: "dispute-4773",
    ticket: "PKT-4773",
    fineId: "CIT-1043",
    residentName: "Maria Reyes",
    submittedAt: "2026-09-19T10:20:00Z",
    status: "PENDING",
    violation: "Blue-and-white parking without payment",
    fieldEvidence: "Officer photo available",
    residentEvidence: "Receipt attached",
    amount: 100,
    reason: "Payment receipt attached",
  },
];

export const billingAccounts: BillingAccount[] = [
  {
    property: "14 Rothschild Boulevard, Apt 2B",
    account: "RES-00441",
    resident: "Maria Reyes",
    water: 150,
    electricity: 320,
    rent: 5800,
    fines: 600,
    balance: 6870,
    lastPaid: "1 Sep 2026",
    status: "Overdue",
  },
  {
    property: "88 Ibn Gabirol Street, Apt 12",
    account: "RES-00388",
    resident: "James Okonkwo",
    water: 240,
    electricity: 390,
    rent: 6500,
    fines: 100,
    balance: 7230,
    lastPaid: "15 Jul 2026",
    status: "Overdue",
  },
  {
    property: "5 Dizengoff Street, Apt A1",
    account: "RES-00312",
    resident: "Priya Singh",
    water: 0,
    electricity: 0,
    rent: 0,
    fines: 0,
    balance: 0,
    lastPaid: "1 Oct 2026",
    status: "Paid",
  },
  {
    property: "21 Allenby Street",
    account: "RES-00299",
    resident: "Carlos Vega",
    water: 110,
    electricity: 230,
    rent: 4800,
    fines: 0,
    balance: 5140,
    lastPaid: "5 Sep 2026",
    status: "Current",
  },
  {
    property: "7 Ben Yehuda Street, Apt 3C",
    account: "RES-00281",
    resident: "Aisha Mensah",
    water: 280,
    electricity: 410,
    rent: 7200,
    fines: 0,
    balance: 7890,
    lastPaid: "28 Jun 2026",
    status: "Overdue",
  },
];

export const seededStaffTickets: StaffMaintenanceTicket[] = [
  {
    id: "TKT-2209",
    issue: "Pothole",
    location: "Rothschild Boulevard and Allenby Street",
    priority: "High",
    status: "Unassigned",
    reported: "30 min ago",
  },
  {
    id: "TKT-2208",
    issue: "Broken Bench",
    location: "Meir Park, north entrance",
    priority: "Low",
    status: "Unassigned",
    reported: "2h ago",
  },
  {
    id: "TKT-2205",
    issue: "Flood Drain",
    location: "Dizengoff Street, near 44",
    priority: "High",
    status: "Dispatched",
    reported: "Today",
    team: "Team Alpha",
    eta: "15m",
  },
  {
    id: "TKT-2201",
    issue: "Pothole",
    location: "Ibn Gabirol Street, near 88",
    priority: "High",
    status: "In Progress",
    reported: "Today",
    team: "Team Alpha",
  },
  {
    id: "TKT-2199",
    issue: "Water Leak",
    location: "HaYarkon Street, near 7",
    priority: "High",
    status: "In Progress",
    reported: "Today",
    team: "Utility Crew 3",
  },
  {
    id: "TKT-2196",
    issue: "Streetlight",
    location: "Bograshov Street",
    priority: "Medium",
    status: "Completed",
    reported: "Today",
    completedAt: "09:15 AM",
  },
  {
    id: "TKT-2194",
    issue: "Fallen Tree",
    location: "Levinsky Street",
    priority: "Medium",
    status: "Completed",
    reported: "Yesterday",
    completedAt: "Yesterday",
  },
];
