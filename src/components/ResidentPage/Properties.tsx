import { residentProperty } from "../../data/residentPortal";
import { currency } from "../../helpers/formatting/currency";
import { Building2, Droplets, Phone, ShieldCheck } from "lucide-react";

export default function Properties() {
  return (
    <section className="resident-view" aria-labelledby="properties-heading">
      <header className="resident-page-intro">
        <p className="section-label">Your home</p>
        <h1 id="properties-heading">Property details</h1>
        <p>
          Everything you need to know about your home, lease, and service
          accounts.
        </p>
      </header>
      <article className="property-hero">
        <div className="property-hero-art">
          <Building2 size={42} aria-hidden="true" />
          <span>{residentProperty.coverPhoto}</span>
        </div>
        <div className="property-hero-copy">
          <div className="property-title-row">
            <div>
              <p className="section-label">Primary residence</p>
              <h2>{residentProperty.address}</h2>
              <p>
                {residentProperty.zone} · {residentProperty.district}
              </p>
            </div>
            <span className="status-badge status-badge--paid">
              <ShieldCheck size={14} aria-hidden="true" />
              {residentProperty.leaseStatus}
            </span>
          </div>
          <div className="property-tags">
            <span>{residentProperty.propertyType}</span>
            <span>{residentProperty.leaseType}</span>
          </div>
        </div>
      </article>
      <section className="resident-card property-section property-glance">
        <div className="resident-card-header">
          <div>
            <p className="section-label">At a glance</p>
            <h2>Property stats</h2>
          </div>
        </div>
        <dl className="property-stats">
          <div>
            <dt>Bedrooms</dt>
            <dd>{residentProperty.bedrooms}</dd>
          </div>
          <div>
            <dt>Bathrooms</dt>
            <dd>{residentProperty.bathrooms}</dd>
          </div>
          <div>
            <dt>Floor</dt>
            <dd>{residentProperty.floor}</dd>
          </div>
          <div>
            <dt>Zone</dt>
            <dd>{residentProperty.zone}</dd>
          </div>
        </dl>
      </section>
      <div className="property-grid">
        <section className="resident-card property-section">
          <div className="resident-card-header">
            <div>
              <p className="section-label">Agreement</p>
              <h2>Lease details</h2>
            </div>
          </div>
          <dl className="property-details">
            <div>
              <dt>Start date</dt>
              <dd>{residentProperty.leaseStart}</dd>
            </div>
            <div>
              <dt>End date</dt>
              <dd>{residentProperty.leaseEnd}</dd>
            </div>
            <div>
              <dt>Monthly rent</dt>
              <dd>{currency.format(residentProperty.monthlyRent)}</dd>
            </div>
            <div>
              <dt>Deposit</dt>
              <dd>{currency.format(residentProperty.deposit)}</dd>
            </div>
          </dl>
        </section>
        <section className="resident-card property-section">
          <div className="resident-card-header">
            <div>
              <p className="section-label">Connected services</p>
              <h2>Utility accounts</h2>
            </div>
            <Droplets size={20} aria-hidden="true" />
          </div>
          <ul className="property-contact-list">
            {residentProperty.utilityAccounts.map((utility) => (
              <li
                className={`property-contact-list-item property-contact-list-item--${utility.name.toLowerCase()}`}
                key={utility.name}
              >
                <span>{utility.name}</span>
                <strong>{utility.account}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="property-support-row">
        <section className="resident-card property-section property-section--support">
          <div className="resident-card-header">
            <div>
              <p className="section-label">Need help?</p>
              <h2>Emergency contacts</h2>
            </div>
            <Phone size={20} aria-hidden="true" />
          </div>
          <ul className="property-contact-list">
            {residentProperty.emergencyContacts.map((contact) => (
              <li key={contact.name}>
                <span>{contact.name}</span>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}