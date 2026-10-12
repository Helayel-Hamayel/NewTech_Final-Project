import { residentProperty } from "../../data/residentPortal";
import { currency } from "../../helpers/formatting/currency";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarCheck,
  CalendarDays,
  Droplets,
  Layers,
  MapPin,
  Phone,
  PiggyBank,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

const stats = [
  { label: "Bedrooms", value: residentProperty.bedrooms, icon: BedDouble },
  { label: "Bathrooms", value: residentProperty.bathrooms, icon: Bath },
  { label: "Floor", value: residentProperty.floor, icon: Layers },
  { label: "Zone", value: residentProperty.zone, icon: MapPin },
];

const leaseDetails = [
  { label: "Start date", value: residentProperty.leaseStart, icon: CalendarDays },
  { label: "End date", value: residentProperty.leaseEnd, icon: CalendarCheck },
  { label: "Monthly rent", value: currency.format(residentProperty.monthlyRent), icon: Wallet },
  { label: "Deposit", value: currency.format(residentProperty.deposit), icon: PiggyBank },
];

export default function Properties() {
  return (
    <section className="resident-view" aria-labelledby="properties-heading">
      <header className="resident-page-intro">
        <section>
          <p className="section-label">Your home</p>
          <h1 id="properties-heading">Property details</h1>
          <p>Everything you need to know about your home, lease, and service accounts.</p>
        </section>
      </header>

      <article className="property-hero">
        <section className="property-hero-art">
          <Building2 size={42} aria-hidden="true" />
          <span>{residentProperty.coverPhoto}</span>
        </section>
        <section className="property-hero-copy">
          <section className="property-title-row">
            <section>
              <p className="section-label">Primary residence</p>
              <h2>{residentProperty.address}</h2>
              <p>
                {residentProperty.zone} · {residentProperty.district}
              </p>
            </section>
            <span className="status-badge status-badge--paid">
              <ShieldCheck size={14} aria-hidden="true" />
              {residentProperty.leaseStatus}
            </span>
          </section>
          <section className="property-tags">
            <span>{residentProperty.propertyType}</span>
            <span>{residentProperty.leaseType}</span>
          </section>
        </section>
        <dl className="property-stat-strip">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <Icon size={18} aria-hidden="true" />
              <dd>{value}</dd>
              <dt>{label}</dt>
            </div>
          ))}
        </dl>
      </article>

      <section className="property-grid">
        <section className="resident-card property-section">
          <section className="resident-card-header">
            <section>
              <p className="section-label">Agreement</p>
              <h2>Lease details</h2>
            </section>
          </section>
          <dl className="property-lease-list">
            {leaseDetails.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <span className="property-row-icon" aria-hidden="true">
                  <Icon size={16} />
                </span>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="resident-card property-section">
          <section className="resident-card-header">
            <section>
              <p className="section-label">Connected services</p>
              <h2>Utility accounts</h2>
            </section>
          </section>
          <ul className="property-account-list">
            {residentProperty.utilityAccounts.map((utility) => {
              const isWater = utility.name.toLowerCase() === "water";
              return (
                <li className={`property-account property-account--${utility.name.toLowerCase()}`} key={utility.name}>
                  <span className="property-account-icon" aria-hidden="true">
                    {isWater ? <Droplets size={18} /> : <Zap size={18} />}
                  </span>
                  <section>
                    <span>{utility.name}</span>
                    <strong>{utility.account}</strong>
                  </section>
                </li>
              );
            })}
          </ul>
        </section>
      </section>

      <section className="resident-card property-section property-section--support">
        <section className="resident-card-header">
          <section>
            <p className="section-label">Need help?</p>
            <h2>Emergency contacts</h2>
          </section>
        </section>
        <ul className="property-emergency-list">
          {residentProperty.emergencyContacts.map((contact) => (
            <li key={contact.name}>
              <span className="property-row-icon" aria-hidden="true">
                <Phone size={16} />
              </span>
              <span>{contact.name}</span>
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
