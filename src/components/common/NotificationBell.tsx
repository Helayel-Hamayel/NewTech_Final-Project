import { Inbox } from "@novu/react";
import { Bell } from "lucide-react";
import { useUser } from "../../contexts/useUser";
import { inboxDarkTheme } from "@novu/react/themes";
import { useTheme } from "../../contexts/useTheme";

import "../../styles/common/NotificationBell.css";

export default function NotificationBell() {
  const { user } = useUser();
  const { theme } = useTheme();

  const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;

  if (!user) return null;

  if (!applicationIdentifier || !user.subscriberHash) {
    return (
      <span className="novu-bell" role="img" aria-label="Notifications unavailable" title="Notifications are not configured">
        <Bell size={20} aria-hidden="true" />
      </span>
    );
  }

  return (
    <Inbox
      key={user.id}
      applicationIdentifier={applicationIdentifier}
      subscriber={user.id}
      subscriberHash={user.subscriberHash}
      appearance={{
        baseTheme: theme === "dark" ? inboxDarkTheme : undefined,
      }}
      renderBell={(counts) => (
        <span className="novu-bell">
          <Bell size={20} aria-hidden="true" />

          {counts.total > 0 && <span className="novu-bell-count">{counts.total > 99 ? "99+" : counts.total}</span>}

          <span className="novu-bell-label">Notifications: {counts.total} unread</span>
        </span>
      )}
    />
  );
}
