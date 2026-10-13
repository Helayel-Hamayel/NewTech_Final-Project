import civicHubLogo from "../../assets/logo/CivicHub_Logo.png";

export default function LoginHeader() {
  return (
    <header className="login-header">
      <section className="login-brand">
        <img className="login-brand-mark" src={civicHubLogo} alt="" aria-hidden="true" />
        <section className="login-brand-copy">
          <p>CivicHub</p>
          <p>Tel Aviv-Yafo Municipality</p>
        </section>
      </section>

      <section className="login-system-status">
        <span className="login-status-dot" aria-hidden="true" />
        Systems online
      </section>
    </header>
  );
}
