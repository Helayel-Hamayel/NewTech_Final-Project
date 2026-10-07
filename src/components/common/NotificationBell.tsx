import { Inbox } from "@novu/react";
import { Bell } from "lucide-react";

type NotificationBellProps = {
  subscriberId: string;
  subscriberHash: string;
};

export default function NotificationBell({ subscriberId, subscriberHash }: NotificationBellProps) {
  return (
    <Inbox
      applicationIdentifier={import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER}
      subscriber={subscriberId}
      subscriberHash={subscriberHash}
      renderBell={(unreadCount) => (
        <span className="notification-bell">
          <Bell size={18} aria-hidden="true" />

          {unreadCount.total > 0 && <span>{unreadCount.total}</span>}
        </span>
      )}
    />
  );
}
