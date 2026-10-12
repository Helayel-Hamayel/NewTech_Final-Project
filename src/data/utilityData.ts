export const MONTHLY_RENT = 5800;

export type UtilityMonth = {
  month: string;
  status: "PAID" | "UNPAID";
  electricityAmount: number;
  waterAmount: number;
  electricityUsage: number;
  waterUsage: number;
};

export type UtilityAccountFromBackend = {
  resident: string;
  months: UtilityMonth[];
};

export type StaffUtilityAccount = {
  _id: string;
  resident: {
    _id: string;
    name: string;
    email: string;
  } | null;
  months: UtilityMonth[];
};