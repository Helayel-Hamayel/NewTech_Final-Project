import type { Fine, Invoice, ResidentServiceRequest, UtilityType } from "../../data/residentPortal";

export type PortalTab = "Dashboard" | "Billing" | "My Services" | "Properties";

export type DashboardProps = {
  recentFines: Fine[];
  finesLoading: boolean;
  finesError: string;
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
  serviceRequests: ResidentServiceRequest[];
  fines: Fine[];
  finesLoading: boolean;
  finesError: string;
  onOpenAppeal: (fine: Fine) => void;
  selectedAppealFine: Fine | null;
  appealStatement: string;
  onAppealStatementChange: (value: string) => void;
  onSubmitAppeal: (formData: FormData) => Promise<void>;
  appealSubmitting: boolean;
  appealError: string;
  onCloseAppeal: () => void;
  onAddServiceRequest: (request: ResidentServiceRequest) => void;
};
