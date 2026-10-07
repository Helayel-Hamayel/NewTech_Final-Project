export type FieldGuardIssue = {
  _id: string;
  name: string;
  description: string;
  amount: number;
  violationType: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "ACCEPTED" | "PENDING" | "REJECTED";
  location: string;
  createdAt: string;
  resolvedAt?: string;
  vehicleRegistration?: string;
};

export type FieldGuardReport = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  residentName: string;
  residentPhone: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NEW" | "IN PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
};

export const fieldGuardData: {
  name: string;
  issues: FieldGuardIssue[];
  reports: FieldGuardReport[];
} = {
  name: "J. Mbeki",
  issues: [
    {
      _id: "issue-001",
      name: "Blocked access lane",
      description: "A vehicle is blocking the emergency access lane near the community center.",
      amount: 500,
      violationType: "Parking on the sidewalk",
      priority: "HIGH",
      status: "ACCEPTED",
      location: "14 Rothschild Boulevard",
      createdAt: "2026-09-15T08:30:00Z",
      resolvedAt: "2026-09-15T10:45:00Z",
    },
    {
      _id: "issue-002",
      name: "Obstructed footpath",
      description: "Building materials are narrowing the public footpath outside the library.",
      amount: 500,
      violationType: "Parking on the sidewalk",
      priority: "MEDIUM",
      status: "PENDING",
      location: "2 Ibn Gabirol Street",
      createdAt: "2026-09-16T11:15:00Z",
    },
    {
      _id: "issue-003",
      name: "Unauthorised loading",
      description: "A delivery vehicle is using the bus stop during restricted hours.",
      amount: 250,
      violationType: "Parking at a bus stop",
      priority: "LOW",
      status: "REJECTED",
      location: "8 Dizengoff Street",
      createdAt: "2026-09-16T14:20:00Z",
      resolvedAt: "2026-09-16T15:05:00Z",
    },
  ],
  reports: [
    {
      _id: "report-001",
      title: "Broken streetlight",
      description: "The streetlight has been out for two nights and the junction is difficult to see.",
      category: "Street lighting",
      location: "22 King George Street",
      residentName: "Jamie Patel",
      residentPhone: "050-555-2301",
      priority: "HIGH",
      status: "NEW",
      createdAt: "2026-09-16T18:10:00Z",
    },
    {
      _id: "report-002",
      title: "Overflowing litter bin",
      description: "The litter bin beside the playground is full and waste is collecting around it.",
      category: "Waste collection",
      location: "Meir Park",
      residentName: "Taylor Evans",
      residentPhone: "052-555-2302",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      createdAt: "2026-09-15T09:40:00Z",
    },
    {
      _id: "report-003",
      title: "Pothole near crossing",
      description: "A deep pothole has formed beside the pedestrian crossing.",
      category: "Road maintenance",
      location: "5 Allenby Street",
      residentName: "Morgan Lee",
      residentPhone: "054-555-2303",
      priority: "HIGH",
      status: "RESOLVED",
      createdAt: "2026-09-13T13:25:00Z",
    },
    {
      _id: "report-004",
      title: "Graffiti on public wall",
      description: "Fresh graffiti has appeared on the wall beside the public toilets.",
      category: "Public property",
      location: "Dizengoff Square",
      residentName: "Casey Brown",
      residentPhone: "058-555-2304",
      priority: "LOW",
      status: "REJECTED",
      createdAt: "2026-09-12T16:50:00Z",
    },
  ],
};