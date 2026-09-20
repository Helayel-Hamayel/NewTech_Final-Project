import { currency } from './formatters'
import type { BillingProps } from './types'

export default function Billing({ invoices, onDownloadInvoice }: BillingProps) {
  const currentBalanceDue = invoices.filter((invoice) => invoice.status === 'Due').reduce((total, invoice) => total + invoice.total, 0)
  const lastPayment = invoices.filter((invoice) => invoice.status === 'Paid').at(-1)
  const yearToDatePaid = invoices.filter((invoice) => invoice.status === 'Paid').reduce((total, invoice) => total + invoice.total, 0)

  return (
    <section aria-labelledby="billing-heading">
      <h2 id="billing-heading">Billing</h2>
      <div>
        <article><h3>Current Balance Due</h3><p>{currency.format(currentBalanceDue)}</p></article>
        <article><h3>Last Payment</h3><p>{currency.format(lastPayment?.total ?? 0)}</p></article>
        <article><h3>Year-to-Date Paid</h3><p>{currency.format(yearToDatePaid)}</p></article>
      </div>
      <table>
        <thead><tr><th>Invoice</th><th>Period</th><th>Rent</th><th>Water</th><th>Electricity</th><th>Fines</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.id}</td><td>{invoice.period}</td><td>{currency.format(invoice.rent)}</td><td>{currency.format(invoice.water)}</td><td>{currency.format(invoice.electricity)}</td><td>{currency.format(invoice.fines)}</td><td>{currency.format(invoice.total)}</td><td>{invoice.status}</td>
            <td>{invoice.status === 'Paid' ? <button type="button" onClick={() => onDownloadInvoice(invoice)}>PDF</button> : <button type="button">Pay Now</button>}</td>
          </tr>
        ))}</tbody>
      </table>
    </section>
  )
}