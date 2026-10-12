export type FineFromBackend = {
  _id: string;
  fieldGuard: string;
  resident: string;
  licensePlate: string;
  violationType: string;
  amount: number;
  photoUrl: string;
  status: "UNPAID" | "PAID" | "CANCELLED";
  appealStatus: "PENDING" | "ACCEPTED" | "REJECTED" | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StaffFineFromBackend = {
  _id: string;
  resident: {
    _id: string;
    name: string;
    email: string;
  } | null;
  licensePlate: string;
  violationType: string;
  amount: number;
  status: "UNPAID" | "PAID" | "CANCELLED";
  createdAt: string;
};
