import { Building2 } from "lucide-react";

export default function LoginHeader() {
  return (
    <header className="login-header">
      <section className="login-brand">
        <span className="login-brand-mark" aria-hidden="true">
          <Building2 size={22} strokeWidth={2.1} />
        </span>
        <section className="login-brand-copy">
          <p>Tel Aviv-Yafo</p>
          <p>Municipality</p>
        </section>
      </section>

      <section className="login-system-status">
        <span className="login-status-dot" aria-hidden="true" />
        Systems online
      </section>
    </header>
  );
}
