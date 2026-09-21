export type DemoAccount = {
  role: "resident" | "staff" | "field-guard";
  name: string;
  details: string;
  path: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    role: "resident",
    name: "Resident Portal",
    details: "Maria Reyes · RES-00441",
    path: "/resident",
  },
  {
    role: "staff",
    name: "Municipality Staff",
    details: "R. Kowalczyk · Dispatch #D-003",
    path: "/staff",
  },
  {
    role: "field-guard",
    name: "Field Guard",
    details: "J. Mbeki · Officer #G-114",
    path: "/field-guard",
  },
];
