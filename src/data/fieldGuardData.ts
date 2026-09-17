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
  name: "Alex Morgan",
  issues: [
    {
      _id: "issue-001",
      name: "Blocked access lane",
      description: "A vehicle is blocking the emergency access lane near the community centre.",
      amount: 75,
      violationType: "Illegal Parking",
      priority: "HIGH",
      status: "ACCEPTED",
      location: "14 Civic Way",
      createdAt: "2026-09-15T08:30:00Z",
      resolvedAt: "2026-09-15T10:45:00Z",
    },
    {
      _id: "issue-002",
      name: "Obstructed footpath",
      description: "Building materials are narrowing the public footpath outside the library.",
      amount: 50,
      violationType: "Parking Obstruction",
      priority: "MEDIUM",
      status: "PENDING",
      location: "2 Market Street",
      createdAt: "2026-09-16T11:15:00Z",
    },
    {
      _id: "issue-003",
      name: "Unauthorised loading",
      description: "A delivery vehicle is using the bus stop during restricted hours.",
      amount: 60,
      violationType: "Illegal Parking",
      priority: "LOW",
      status: "REJECTED",
      location: "8 Station Road",
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
      location: "22 High Street",
      residentName: "Jamie Patel",
      residentPhone: "07123 456789",
      priority: "HIGH",
      status: "NEW",
      createdAt: "2026-09-16T18:10:00Z",
    },
    {
      _id: "report-002",
      title: "Overflowing litter bin",
      description: "The litter bin beside the playground is full and waste is collecting around it.",
      category: "Waste collection",
      location: "Greenfield Park",
      residentName: "Taylor Evans",
      residentPhone: "07234 567890",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      createdAt: "2026-09-15T09:40:00Z",
    },
    {
      _id: "report-003",
      title: "Pothole near crossing",
      description: "A deep pothole has formed beside the pedestrian crossing.",
      category: "Road maintenance",
      location: "5 Riverside Avenue",
      residentName: "Morgan Lee",
      residentPhone: "07345 678901",
      priority: "HIGH",
      status: "RESOLVED",
      createdAt: "2026-09-13T13:25:00Z",
    },
    {
      _id: "report-004",
      title: "Graffiti on public wall",
      description: "Fresh graffiti has appeared on the wall beside the public toilets.",
      category: "Public property",
      location: "Central Square",
      residentName: "Casey Brown",
      residentPhone: "07456 789012",
      priority: "LOW",
      status: "REJECTED",
      createdAt: "2026-09-12T16:50:00Z",
    },
  ],
};