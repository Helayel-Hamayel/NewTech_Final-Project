export type AppealFromBackend = {
  _id: string;
  resident: {
    _id: string;
    name: string;
  } | null;
  fine: {
    _id: string;
    licensePlate: string;
    violationType: string;
    amount: number;
    photoUrl: string;
    status: "UNPAID" | "PAID" | "CANCELLED";
    createdAt: string;
    resolvedAt: string | null;
  } | null;
  reason: string;
  description: string;
  email: string;
  photoUrl: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  resolvedAt: string | null;
};
