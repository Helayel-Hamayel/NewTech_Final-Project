import type {
  Fine,
  Invoice,
  MaintenanceTicket,
  ResidentIssue,
  ResidentServiceRequest,
  UtilityType,
} from "../../data/residentPortal";

export type PortalTab = "Dashboard" | "Billing" | "My Services" | "Properties";

export type DashboardProps = {
  unpaidFines: Fine[];
  unpaidFineTotal: number;
  utilityType: UtilityType;
  utilityUsage: Array<{ month: string; usage: number }>;
  onUtilityTypeChange: (utilityType: UtilityType) => void;
  onOpenAppeal: (fine: Fine) => void;
  onNavigate: (tab: PortalTab) => void;
};

export type BillingProps = {
  invoices: Invoice[];
  onDownloadInvoice: (invoice: Invoice) => void;
};

export type MyTicketsProps = {
  tickets: MaintenanceTicket[];
  serviceRequests: ResidentServiceRequest[];
  fines: Fine[];
  issues: ResidentIssue[];
  onOpenAppeal: (fine: Fine) => void;
  selectedAppealFine: Fine | null;
  appealStatement: string;
  onAppealStatementChange: (value: string) => void;
  onSubmitAppeal: () => void;
  onCloseAppeal: () => void;
  onAddIssue: (issue: ResidentIssue) => void;
  onAddServiceRequest: (request: ResidentServiceRequest) => void;
};
