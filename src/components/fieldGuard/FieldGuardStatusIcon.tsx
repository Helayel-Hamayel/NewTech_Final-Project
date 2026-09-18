import { CircleX, CircleCheck, CircleEllipsis, CirclePlus } from "lucide-react";

type FieldGuardStatusIconProps = { status: string };

export default function FieldGuardStatusIcon({ status }: FieldGuardStatusIconProps) {
  switch (status.toUpperCase()) {
    case "REJECTED":
      return <CircleX aria-hidden="true" />;
    case "ACCEPTED":
    case "RESOLVED":
      return <CircleCheck aria-hidden="true" />;
    case "PENDING":
    case "IN PROGRESS":
      return <CircleEllipsis aria-hidden="true" />;
    case "NEW":
      return <CirclePlus aria-hidden="true" />;
    default:
      return null;
  }
}
