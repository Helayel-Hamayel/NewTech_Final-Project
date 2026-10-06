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

export type StaffTab = "disputes" | "billing" | "maintenance";

export type BillingAccount = {
  property: string;
  account: string;
  resident: string;
  water: number;
  electricity: number;
  rent: number;
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
    violation: "Illegal Sidewalk Parking",
    fieldEvidence: "Officer photo available",
    residentEvidence: "No attachment",
    amount: 150,
    reason: "Vehicle was not hers",
  },
  {
    _id: "dispute-4802",
    ticket: "PKT-4802",
    fineId: "CIT-1018",
    residentName: "James Okonkwo",
    submittedAt: "2026-09-18T13:40:00Z",
    status: "PENDING",
    violation: "Expired Meter",
    fieldEvidence: "Meter record available",
    residentEvidence: "No attachment",
    amount: 75,
    reason: "Meter malfunction",
  },
  {
    _id: "dispute-4773",
    ticket: "PKT-4773",
    fineId: "CIT-1043",
    residentName: "Maria Reyes",
    submittedAt: "2026-09-19T10:20:00Z",
    status: "PENDING",
    violation: "Expired Meter",
    fieldEvidence: "Officer photo available",
    residentEvidence: "Receipt attached",
    amount: 75,
    reason: "Meter was broken, receipt attached",
  },
];

export const billingAccounts: BillingAccount[] = [
  {
    property: "14 Maple St, Unit 2B",
    account: "RES-00441",
    resident: "Maria Reyes",
    water: 42.5,
    electricity: 55,
    rent: 750,
    balance: 847.5,
    lastPaid: "Sep 1, 2026",
    status: "Current",
  },
  {
    property: "88 Oak Blvd, #12",
    account: "RES-00388",
    resident: "James Okonkwo",
    water: 112,
    electricity: 100,
    rent: 1100,
    balance: 1312,
    lastPaid: "Jul 15, 2026",
    status: "Overdue",
  },
  {
    property: "5 Riverside Dr, A1",
    account: "RES-00312",
    resident: "Priya Singh",
    water: 0,
    electricity: 0,
    rent: 0,
    balance: 0,
    lastPaid: "Oct 1, 2026",
    status: "Paid",
  },
  {
    property: "21 Cedar Lane",
    account: "RES-00299",
    resident: "Carlos Vega",
    water: 35,
    electricity: 65,
    rent: 320,
    balance: 420,
    lastPaid: "Sep 5, 2026",
    status: "Current",
  },
  {
    property: "7 Commerce Ave, #3C",
    account: "RES-00281",
    resident: "Aisha Mensah",
    water: 90,
    electricity: 100,
    rent: 1700,
    balance: 1890,
    lastPaid: "Jun 28, 2026",
    status: "Overdue",
  },
];

export const seededStaffTickets: StaffMaintenanceTicket[] = [
  {
    id: "TKT-2209",
    issue: "Pothole",
    location: "Birch Ave & 12th St",
    priority: "High",
    status: "Unassigned",
    reported: "30 min ago",
  },
  {
    id: "TKT-2208",
    issue: "Broken Bench",
    location: "Central Park, S4",
    priority: "Low",
    status: "Unassigned",
    reported: "2h ago",
  },
  {
    id: "TKT-2205",
    issue: "Flood Drain",
    location: "Oak Blvd, #44",
    priority: "High",
    status: "Dispatched",
    reported: "Today",
    team: "Team Alpha",
    eta: "15m",
  },
  {
    id: "TKT-2201",
    issue: "Pothole",
    location: "Oak Blvd #88",
    priority: "High",
    status: "In Progress",
    reported: "Today",
    team: "Team Alpha",
  },
  {
    id: "TKT-2199",
    issue: "Water Leak",
    location: "Willow Lane #7",
    priority: "High",
    status: "In Progress",
    reported: "Today",
    team: "Utility Crew 3",
  },
  {
    id: "TKT-2196",
    issue: "Streetlight",
    location: "Riverside Dr",
    priority: "Medium",
    status: "Completed",
    reported: "Today",
    completedAt: "09:15 AM",
  },
  {
    id: "TKT-2194",
    issue: "Fallen Tree",
    location: "Cedar Lane",
    priority: "Medium",
    status: "Completed",
    reported: "Yesterday",
    completedAt: "Yesterday",
  },
];