import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { currency } from './formatters'
import type { DashboardProps } from './types'

export default function Dashboard({ unpaidFines, unpaidFineTotal, utilityType, utilityUsage, onUtilityTypeChange, onAppeal, onNavigate }: DashboardProps) {
  const totalBalance = 1250 + 86 + unpaidFineTotal

  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading">Dashboard</h2>
      <section aria-labelledby="balance-heading">
        <h3 id="balance-heading">Total balance due</h3>
        <p>{currency.format(totalBalance)}</p>
        <dl>
          <div><dt>Rent</dt><dd>{currency.format(1250)}</dd></div>
          <div><dt>Utilities</dt><dd>{currency.format(86)}</dd></div>
          <div><dt>Unpaid fines</dt><dd>{currency.format(unpaidFineTotal)}</dd></div>
        </dl>
        <button type="button">Pay All</button>
        <button type="button">Payment Plan</button>
      </section>
      <section aria-label="Account summary">
        <article><h3>Active Fines</h3><p>{unpaidFines.length}</p><button type="button" onClick={() => onNavigate('My Tickets')}>View in My Tickets</button></article>
        <article><h3>Open Requests</h3><p>2</p><button type="button" onClick={() => onNavigate('My Tickets')}>View in My Tickets</button></article>
        <article><h3>Account Status</h3><p>Active · Lease valid to Dec 2026</p></article>
      </section>
      <section aria-labelledby="utility-heading">
        <h3 id="utility-heading">Utility usage</h3>
        <button type="button" onClick={() => onUtilityTypeChange('Water')}>Water (m³)</button>
        <button type="button" onClick={() => onUtilityTypeChange('Electricity')}>Electricity (kWh)</button>
        <figure>
          <figcaption>{utilityType} usage, March–August 2026</figcaption>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilityUsage}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="usage" name={utilityType} /></BarChart>
          </ResponsiveContainer>
        </figure>
        <aside><h4>Current bill</h4><p>{currency.format(86)}</p><p>Due Sep 30, 2026</p></aside>
      </section>
      <section aria-labelledby="fines-heading">
        <h3 id="fines-heading">Active fines &amp; citations</h3>
        {unpaidFines.length === 0 ? <p>No unpaid citations.</p> : <ul>{unpaidFines.map((fine) => (
          <li key={fine.id}><article><p>{fine.photo}</p><h4>{fine.id}</h4><p>Status: {fine.status}</p><p>Violation: {fine.violation}</p><p>Location: {fine.location}</p><p>Date: {fine.date}</p><p>Fine amount: {currency.format(fine.amount)}</p><button type="button" onClick={() => onAppeal(fine.id)}>File Appeal</button></article></li>
        ))}</ul>}
      </section>
    </section>
  )
}