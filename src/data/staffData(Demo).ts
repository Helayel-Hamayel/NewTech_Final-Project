type Staff = {
  _id: string;
  workName:string;
  name: string;
};

export const staffData: Staff = {
  _id:"weqrw34324fwere223ewf",
  workName: "D-003",
  name: "R. Kowalczyk",
};

export type StaffDispute = {
  _id: string;
  ticket: string;
  issueId: string;
  residentName: string;
  submittedAt: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export const staffDisputesData: StaffDispute[] = [
  {
    _id: "DSP-001",
    ticket: "PKT-4821",
    issueId: "68c820412fd23b482e104a34",
    residentName: "Maria Reyes",
    submittedAt: "2026-09-15T00:00:00.000Z",
    reason: "Vehicle was not hers",
    status: "PENDING",
  },
];

