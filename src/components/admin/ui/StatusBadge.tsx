import { BookingStatus } from "@/types";
import { STATUS_BADGES, STATUS_TEXTS } from "@/constants/admin";

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[status]}`}
    >
      {STATUS_TEXTS[status]}
    </span>
  );
}
