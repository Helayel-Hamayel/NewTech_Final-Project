import type { User } from "../contexts/userContextValue";

export type DemoAccount = {
  role: "resident" | "staff" | "field-guard";
  name: string;
  details: string;
  path: string;
  user: User;
};

export const demoAccounts: DemoAccount[] = [
  {
    role: "resident",
    name: "Resident Portal",
    details: "Maria Reyes · RES-00441",
    path: "/resident",
    user: {
      id: "RES-00441",
      name: "Maria Reyes",
      email: "maria.reyes@example.com",
      role: "RESIDENT",
      isDemo: true,
    },
  },
  {
    role: "staff",
    name: "Municipality Staff",
    details: "R. Kowalczyk · Dispatch #D-003",
    path: "/staff",
    user: {
      id: "D-003",
      name: "R. Kowalczyk",
      email: "staff.demo@example.com",
      role: "STAFF",
      isDemo: true,
    },
  },
  {
    role: "field-guard",
    name: "Field Guard",
    details: "J. Mbeki · Officer #G-114",
    path: "/field-guard",
    user: {
      id: "G-114",
      name: "J. Mbeki",
      email: "field.guard.demo@example.com",
      role: "FIELD_GUARD",
      isDemo: true,
    },
  },
];
