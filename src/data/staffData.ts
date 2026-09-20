export type StaffDispute = {
  _id: string;
  ticket: string;
  residentName: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  issueId: string;
  reason: string;
};

export const staffData = {
  name: "R. Kowalczyk",
  workName: "D-003",
};

export const staffDisputesData: StaffDispute[] = [
  {
    _id: "dispute-001",
    ticket: "DSP-2026-001",
    residentName: "Maria Reyes",
    submittedAt: "2026-09-17T09:15:00Z",
    status: "PENDING",
    issueId: "issue-001",
    reason: "The vehicle was stopped briefly while assisting a passenger.",
  },
  {
    _id: "dispute-002",
    ticket: "DSP-2026-002",
    residentName: "Jordan Ellis",
    submittedAt: "2026-09-18T13:40:00Z",
    status: "PENDING",
    issueId: "issue-002",
    reason: "The obstruction had already been cleared when the citation was issued.",
  },
];