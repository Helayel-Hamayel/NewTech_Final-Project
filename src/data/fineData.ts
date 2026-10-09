export type FineFromBackend = {
  _id: string;
  fieldGuard: string;
  resident: string;
  licensePlate: string;
  violationType: string;
  amount: number;
  photoUrl: string;
  status: "UNPAID" | "PAID";
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};