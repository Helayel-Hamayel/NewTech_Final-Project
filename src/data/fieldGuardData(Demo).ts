type Priority = "LOW" | "MEDIUM" | "HIGH";
type Status = "ACCEPTED" | "REJECTED" | "PENDING";
type ReportStatus = "NEW" | "IN PROGRESS" | "REJECTED" | "RESOLVED";

type Issue = {
  _id: string;
  name: string;
  licensePlate: string;
  violationType: string;
  description: string;
  location: string;
  priority: Priority;
  status: Status;
  amount: number;
  photoEvidenceUrl: string;
  createdAt: string;
  resolvedAt: string | null;
};

type Report = {
  _id: string;

  residentName: string;
  residentPhone: string;
  residentId: string;

  title: string;
  description: string;

  category: string;

  location: string;

  licensePlate: string;

  priority: Priority;

  status: ReportStatus;

  photoUrl: string;

  createdAt: string;
};

type FieldGuard = {
  _id: string;
  name: string;
  role: string;
  issues: Issue[];
  reports: Report[];
};

export const fieldGuardData: FieldGuard = {
  _id: "68c81f912fd23b482e104a31",

  name: "Daniel Cohen",

  role: "FIELD_AGENT",

  issues: [
    {
      _id: "68c820412fd23b482e104a32",
      name: "Parking in a restricted area",
      licensePlate: "56-123-78",
      violationType: "Illegal Parking",
      description: "Vehicle was parked in a restricted municipal parking area.",
      location: "Main Street 24",
      priority: "HIGH",
      status: "ACCEPTED",
      resolvedAt: "2026-09-14T12:00:00.000Z",
      amount: 350,
      photoEvidenceUrl: "/images/illegal-parking.jpg",
      createdAt: "2026-09-14T10:30:00.000Z",
    },

    {
      _id: "68c821102fd23b482e104a33",
      name: "Blocked pedestrian pathway",
      licensePlate: "82-456-19",
      violationType: "Parking Obstruction",
      description: "Vehicle was reported as blocking part of a pedestrian pathway.",
      location: "City Center 8",
      priority: "MEDIUM",
      status: "REJECTED",
      resolvedAt: "2026-09-13T16:00:00.000Z",
      amount: 250,
      photoEvidenceUrl: "/images/parking-obstruction.jpg",
      createdAt: "2026-09-13T14:20:00.000Z",
    },
    {
      _id: "68c820412fd23b482e104a34",
      name: "Restricted parking review",
      licensePlate: "56-123-78",
      violationType: "Illegal Parking",
      description: "Vehicle was parked in a restricted municipal parking area.",
      location: "Main Street 24",
      priority: "HIGH",
      status: "PENDING",
      resolvedAt: null,
      amount: 350,
      photoEvidenceUrl: "/images/illegal-parking.jpg",
      createdAt: "2026-09-14T10:30:00.000Z",
    },
  ],
  reports: [
    {
      _id: "68c830912fd23b482e104a40",

      residentId: "68c900112fd23b482e104b10",
      residentName: "Adam Hassan",
      residentPhone: "050-000-0001",

      title: "Vehicle Blocking Sidewalk",

      description: "A vehicle has been parked across the sidewalk for several hours and is preventing pedestrians from passing safely.",

      category: "Parking Violation",

      location: "12 HaShalom Street",

      licensePlate: "34-781-22",

      priority: "HIGH",

      status: "IN PROGRESS",

      photoUrl: "/images/sidewalk-blocked.jpg",

      createdAt: "2026-09-15T08:45:00.000Z",
    },
    {
      _id: "68c81234fd23b482e104a40",

      residentId: "68c900112fd23b482e104b10",
      residentName: "Adam Hassan",
      residentPhone: "050-000-0001",

      title: "Vehicle Blocking Sidewalk",

      description: "A vehicle has been parked across the sidewalk for several hours and is preventing pedestrians from passing safely.",

      category: "Parking Violation",

      location: "12 HaShalom Street",

      licensePlate: "34-781-22",

      priority: "HIGH",

      status: "RESOLVED",

      photoUrl: "/images/sidewalk-blocked.jpg",

      createdAt: "2026-09-15T08:45:00.000Z",
    },
    {
      _id: "68c831712fd23b482e104a41",

      residentId: "68c901212fd23b482e104b11",
      residentName: "Maya Levi",
      residentPhone: "050-000-0002",

      title: "Illegal Parking Near Entrance",

      description: "A vehicle is parked in front of the residential building entrance and is partially blocking access.",

      category: "Illegal Parking",

      location: "7 Herzl Street",

      licensePlate: "91-455-63",

      priority: "MEDIUM",

      status: "NEW",

      photoUrl: "/images/blocked-entrance.jpg",

      createdAt: "2026-09-15T10:20:00.000Z",
    },
    {
      _id: "68c831712qew23b482e104a41",

      residentId: "68c901212fd23b4wq82e104b11",
      residentName: "Maya Levi",
      residentPhone: "050-000-0002",

      title: "Illegal Parking Near Entrance",

      description: "A vehicle is parked in front of my house entrance and i cant get out.",

      category: "Illegal Parking",

      location: "7 Herzl Street",

      licensePlate: "91-455-63",

      priority: "LOW",

      status: "IN PROGRESS",

      photoUrl: "/images/blocked-entrance.jpg",

      createdAt: "2026-09-13T10:20:00.000Z",
    },
  ],
};
