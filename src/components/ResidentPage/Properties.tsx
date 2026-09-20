import { residentProperty } from '../../data/residentPortal'
import { currency } from './formatters'

export default function Properties() {
  return (
    <section aria-labelledby="properties-heading">
      <h2 id="properties-heading">Properties</h2>
      <article>
        <p>{residentProperty.coverPhoto}</p>
        <h3>{residentProperty.address}</h3>
        <p>{residentProperty.zone} - {residentProperty.district}</p>
        <p><span>{residentProperty.propertyType}</span> <span>{residentProperty.leaseStatus}</span></p>
        <h4>Property stats</h4>
        <dl><div><dt>Bedrooms</dt><dd>{residentProperty.bedrooms}</dd></div><div><dt>Bathrooms</dt><dd>{residentProperty.bathrooms}</dd></div><div><dt>Floor</dt><dd>{residentProperty.floor}</dd></div><div><dt>Zone</dt><dd>{residentProperty.zone}</dd></div></dl>
        <h4>Lease details</h4>
        <dl><div><dt>Start date</dt><dd>{residentProperty.leaseStart}</dd></div><div><dt>End date</dt><dd>{residentProperty.leaseEnd}</dd></div><div><dt>Monthly rent</dt><dd>{currency.format(residentProperty.monthlyRent)}</dd></div><div><dt>Deposit</dt><dd>{currency.format(residentProperty.deposit)}</dd></div><div><dt>Lease type</dt><dd>{residentProperty.leaseType}</dd></div></dl>
        <h4>Utility accounts</h4>
        <ul>{residentProperty.utilityAccounts.map((utility) => <li key={utility.name}>{utility.name}: {utility.account}</li>)}</ul>
        <h4>Emergency contacts</h4>
        <ul>{residentProperty.emergencyContacts.map((contact) => <li key={contact.name}>{contact.name}: {contact.phone}</li>)}</ul>
      </article>
    </section>
  )
}