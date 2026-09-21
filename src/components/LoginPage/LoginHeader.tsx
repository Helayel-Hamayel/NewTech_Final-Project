import { Building2 } from "lucide-react";

export default function LoginHeader() {
  return (
    <header className="login-header">
      <div className="login-brand">
        <span className="login-brand-mark" aria-hidden="true">
          <Building2 size={22} strokeWidth={2.1} />
        </span>
        <div className="login-brand-copy">
          <p>City of</p>
          <p>Millbrook</p>
        </div>
      </div>

      <div className="login-system-status">
        <span className="login-status-dot" aria-hidden="true" />
        Systems online
      </div>
    </header>
  );
}
