import { Inbox } from "@novu/react";
import { Bell } from "lucide-react";
import { useUser } from "../../contexts/useUser";
import { inboxDarkTheme } from "@novu/react/themes";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/useTheme";

import "../../styles/common/NotificationBell.css";

export default function NotificationBell() {
  const { user } = useUser();
  const { pathname } = useLocation();
  const { theme } = useTheme();

  const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;
  const isAlwaysLightBell = pathname.startsWith("/resident") || pathname.startsWith("/field-guard");
  const bellColor = isAlwaysLightBell || theme === "dark" ? "#f8fafc" : "#334155";

  const bellClassName = `novu-bell${isAlwaysLightBell ? " is-light-bell" : ""}`;

  if (!user) return null;

  if (!applicationIdentifier || !user.subscriberHash) {
    return (
      <span className={bellClassName} role="img" aria-label="Notifications unavailable" title="Notifications are not configured">
        <Bell size={20} style={{ color: bellColor, stroke: bellColor }} aria-hidden="true" />
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
        <span className={bellClassName}>
          <Bell size={20} style={{ color: bellColor, stroke: bellColor }} aria-hidden="true" />

          {counts.total > 0 && <span className="novu-bell-count">{counts.total > 99 ? "99+" : counts.total}</span>}

          <span className="novu-bell-label">Notifications: {counts.total} unread</span>
        </span>
      )}
    />
  );
}
