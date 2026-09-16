import { CircleX, CircleCheck, CircleEllipsis, CirclePlus } from "lucide-react";

type FieldGuardStatusIconProps = { status: string };

export default function FieldGuardStatusIcon({ status }: FieldGuardStatusIconProps) {
  switch (status.toUpperCase()) {
    case "REJECTED":
      return <CircleX className="field-guard-icon" aria-hidden="true" />;
    case "ACCEPTED":
    case "RESOLVED":
      return <CircleCheck className="field-guard-icon" aria-hidden="true" />;
    case "PENDING":
    case "IN PROGRESS":
      return <CircleEllipsis className="field-guard-icon" aria-hidden="true" />;
    case "NEW":
      return <CirclePlus className="field-guard-icon" aria-hidden="true" />;
    default:
      return null;
  }
}
