import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import SharedLayout from '../components/common/SharedLayout'
import {
  type Fine,
  type Invoice,
  type MaintenanceTicket,
  resident,
  seededFines,
  seededInvoices,
  seededMaintenanceTickets,
  utilityUsage,
  type UtilityType,
} from '../data/residentPortal'

type PortalTab = 'Dashboard' | 'Billing' | 'My Tickets' | 'Properties'

const tabs: PortalTab[] = ['Dashboard', 'Billing', 'My Tickets', 'Properties']

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function ResidentPortalPage() {
  const [activeTab, setActiveTab] = useState<PortalTab>('Dashboard')
  const [utilityType, setUtilityType] = useState<UtilityType>('Water')
  const [fines, setFines] = useState(seededFines)
  const [selectedAppealFine, setSelectedAppealFine] = useState<Fine | null>(null)
  const [appealStatement, setAppealStatement] = useState('')

  const unpaidFines = fines.filter((fine) => fine.status === 'Unpaid')
  const unpaidFineTotal = unpaidFines.reduce((total, fine) => total + fine.amount, 0)

  function handleTabChange(tab: PortalTab) {
    setActiveTab(tab)
  }

  function handleAppeal(fineId: string) {
    setFines((currentFines) =>
      currentFines.map((fine) =>
        fine.id === fineId ? { ...fine, status: 'Appealed' } : fine,
      ),
    )
  }

  function handleOpenAppeal(fine: Fine) {
    setSelectedAppealFine(fine)
    setAppealStatement('')
  }

  function handleSubmitAppeal() {
    if (!selectedAppealFine) {
      return
    }

    handleAppeal(selectedAppealFine.id)
    setSelectedAppealFine(null)
    setAppealStatement('')
  }

  function handleDownloadInvoice(invoice: Invoice) {
    const content = [
      `Invoice: ${invoice.id}`,
      `Period: ${invoice.period}`,
      `Rent: ${currency.format(invoice.rent)}`,
      `Water: ${currency.format(invoice.water)}`,
      `Electricity: ${currency.format(invoice.electricity)}`,
      `Fines: ${currency.format(invoice.fines)}`,
      `Total: ${currency.format(invoice.total)}`,
      `Status: ${invoice.status}`,
    ].join('\n')

    const stream = `BT /F1 12 Tf 72 720 Td (${content.replace(/[\\()]/g, '\\$&')}) Tj ET`
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ]

    let pdf = '%PDF-1.4\n'
    const offsets: number[] = [0]

    objects.forEach((objectContent, index) => {
      offsets.push(pdf.length)
      pdf += `${index + 1} 0 obj\n${objectContent}\nendobj\n`
    })

    const xrefStart = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    offsets.slice(1).forEach((offset) => {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
    })
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

    const blob = new Blob([pdf], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <SharedLayout>
      <header>
        <h1>Resident Portal</h1>
        <p>
          {resident.name} · {resident.id}
        </p>
        <button type="button">Sign Out</button>
      </header>

      <nav aria-label="Resident portal navigation">
        <ul>
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                type="button"
                aria-current={activeTab === tab ? 'page' : undefined}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeTab === 'Dashboard' ? (
        <Dashboard
          unpaidFines={unpaidFines}
          unpaidFineTotal={unpaidFineTotal}
          utilityType={utilityType}
          utilityUsage={utilityUsage[utilityType]}
          onUtilityTypeChange={setUtilityType}
          onAppeal={handleAppeal}
          onNavigate={handleTabChange}
        />
      ) : activeTab === 'Billing' ? (
        <Billing invoices={seededInvoices} onDownloadInvoice={handleDownloadInvoice} />
      ) : activeTab === 'My Tickets' ? (
        <MyTickets
          tickets={seededMaintenanceTickets}
          fines={fines}
          onOpenAppeal={handleOpenAppeal}
          selectedAppealFine={selectedAppealFine}
          appealStatement={appealStatement}
          onAppealStatementChange={setAppealStatement}
          onSubmitAppeal={handleSubmitAppeal}
          onCloseAppeal={() => setSelectedAppealFine(null)}
        />
      ) : (
        <section>
          <h2>{activeTab}</h2>
          <p>This section is under construction.</p>
        </section>
      )}
    </SharedLayout>
  )
}

type BillingProps = {
  invoices: Invoice[]
  onDownloadInvoice: (invoice: Invoice) => void
}

function Billing({ invoices, onDownloadInvoice }: BillingProps) {
  const currentBalanceDue = invoices
    .filter((invoice) => invoice.status === 'Due')
    .reduce((total, invoice) => total + invoice.total, 0)

  const lastPayment = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .at(-1)

  const yearToDatePaid = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .reduce((total, invoice) => total + invoice.total, 0)

  return (
    <section aria-labelledby="billing-heading">
      <h2 id="billing-heading">Billing</h2>

      <div>
        <article>
          <h3>Current Balance Due</h3>
          <p>{currency.format(currentBalanceDue)}</p>
        </article>
        <article>
          <h3>Last Payment</h3>
          <p>{lastPayment ? currency.format(lastPayment.total) : currency.format(0)}</p>
        </article>
        <article>
          <h3>Year-to-Date Paid</h3>
          <p>{currency.format(yearToDatePaid)}</p>
        </article>
      </div>

      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Period</th>
            <th>Rent</th>
            <th>Water</th>
            <th>Electricity</th>
            <th>Fines</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.period}</td>
              <td>{currency.format(invoice.rent)}</td>
              <td>{currency.format(invoice.water)}</td>
              <td>{currency.format(invoice.electricity)}</td>
              <td>{currency.format(invoice.fines)}</td>
              <td>{currency.format(invoice.total)}</td>
              <td>{invoice.status}</td>
              <td>
                {invoice.status === 'Paid' ? (
                  <button type="button" onClick={() => onDownloadInvoice(invoice)}>
                    PDF
                  </button>
                ) : (
                  <button type="button">Pay Now</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

type DashboardProps = {
  unpaidFines: Fine[]
  unpaidFineTotal: number
  utilityType: UtilityType
  utilityUsage: Array<{ month: string; usage: number }>
  onUtilityTypeChange: (utilityType: UtilityType) => void
  onAppeal: (fineId: string) => void
  onNavigate: (tab: PortalTab) => void
}

type MyTicketsProps = {
  tickets: MaintenanceTicket[]
  fines: Fine[]
  onOpenAppeal: (fine: Fine) => void
  selectedAppealFine: Fine | null
  appealStatement: string
  onAppealStatementChange: (value: string) => void
  onSubmitAppeal: () => void
  onCloseAppeal: () => void
}

function MyTickets({
  tickets,
  fines,
  onOpenAppeal,
  selectedAppealFine,
  appealStatement,
  onAppealStatementChange,
  onSubmitAppeal,
  onCloseAppeal,
}: MyTicketsProps) {
  const ticketStages: MaintenanceTicket['stage'][] = [
    'Reported',
    'Dispatched',
    'In Progress',
    'Resolved',
  ]

  return (
    <section aria-labelledby="tickets-heading">
      <h2 id="tickets-heading">My Tickets</h2>

      <section aria-labelledby="maintenance-heading">
        <div>
          <h3 id="maintenance-heading">Maintenance Requests</h3>
          <button type="button">+ New Request</button>
        </div>

        {tickets.map((ticket) => {
          const currentStageIndex = ticketStages.indexOf(ticket.stage)

          return (
            <article key={ticket.id}>
              <div>
                <p>{ticket.id}</p>
                <span>{ticket.stage}</span>
              </div>
              <p>{ticket.type}</p>
              <p>{ticket.location}</p>
              <p>Reported: {ticket.reportedDate}</p>

              <div aria-label="Maintenance progress">
                {ticketStages.map((stage, index) => {
                  const isComplete = index <= currentStageIndex

                  return (
                    <div key={`${ticket.id}-${stage}`}>
                      <span>{isComplete ? '●' : '○'}</span>
                      <span>{stage}</span>
                      {index < ticketStages.length - 1 ? <span>→</span> : null}
                    </div>
                  )
                })}
              </div>
            </article>
          )
        })}
      </section>

      <section aria-labelledby="citations-heading">
        <h3 id="citations-heading">Fines &amp; Citations</h3>
        <ul>
          {fines.map((fine) => (
            <li key={fine.id}>
              <article>
                <p>{fine.photo}</p>
                <h4>{fine.id}</h4>
                <p>Status: {fine.status}</p>
                <p>Violation: {fine.violation}</p>
                <p>Location: {fine.location}</p>
                <p>Date: {fine.date}</p>
                <p>Fine amount: {currency.format(fine.amount)}</p>
                {fine.status === 'Unpaid' ? (
                  <button type="button" onClick={() => onOpenAppeal(fine)}>
                    File Appeal
                  </button>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </section>

      {selectedAppealFine ? (
        <div role="dialog" aria-modal="true" aria-labelledby="appeal-heading">
          <div>
            <button type="button" onClick={onCloseAppeal}>Close</button>
            <div>
              <div>
                <p>{selectedAppealFine.photo}</p>
                <p>{selectedAppealFine.id}</p>
                <p>{selectedAppealFine.date}</p>
                <p>{selectedAppealFine.violation}</p>
                <p>{currency.format(selectedAppealFine.amount)}</p>
              </div>
              <div>
                <h3 id="appeal-heading">Submit Appeal</h3>
                <textarea
                  value={appealStatement}
                  onChange={(event) => onAppealStatementChange(event.target.value)}
                  placeholder="Write your statement here"
                />
                <label>
                  <input type="checkbox" />
                  Upload photo or document
                </label>
                <button type="button" onClick={onSubmitAppeal}>Submit Appeal</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function Dashboard({
  unpaidFines,
  unpaidFineTotal,
  utilityType,
  utilityUsage,
  onUtilityTypeChange,
  onAppeal,
  onNavigate,
}: DashboardProps) {
  const totalBalance = 1250 + 86 + unpaidFineTotal

  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading">Dashboard</h2>

      <section aria-labelledby="balance-heading">
        <h3 id="balance-heading">Total balance due</h3>
        <p>{currency.format(totalBalance)}</p>
        <dl>
          <div>
            <dt>Rent</dt>
            <dd>{currency.format(1250)}</dd>
          </div>
          <div>
            <dt>Utilities</dt>
            <dd>{currency.format(86)}</dd>
          </div>
          <div>
            <dt>Unpaid fines</dt>
            <dd>{currency.format(unpaidFineTotal)}</dd>
          </div>
        </dl>
        <button type="button">Pay All</button>
        <button type="button">Payment Plan</button>
      </section>

      <section aria-label="Account summary">
        <article>
          <h3>Active Fines</h3>
          <p>{unpaidFines.length}</p>
          <button type="button" onClick={() => onNavigate('My Tickets')}>
            View in My Tickets
          </button>
        </article>
        <article>
          <h3>Open Requests</h3>
          <p>2</p>
          <button type="button" onClick={() => onNavigate('My Tickets')}>
            View in My Tickets
          </button>
        </article>
        <article>
          <h3>Account Status</h3>
          <p>Active · Lease valid to Dec 2026</p>
        </article>
      </section>

      <section aria-labelledby="utility-heading">
        <h3 id="utility-heading">Utility usage</h3>
        <button type="button" onClick={() => onUtilityTypeChange('Water')}>
          Water (m³)
        </button>
        <button type="button" onClick={() => onUtilityTypeChange('Electricity')}>
          Electricity (kWh)
        </button>
        <figure>
          <figcaption>{utilityType} usage, March–August 2026</figcaption>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilityUsage}>
              <CartesianGrid />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" name={utilityType} />
            </BarChart>
          </ResponsiveContainer>
        </figure>
        <aside>
          <h4>Current bill</h4>
          <p>{currency.format(86)}</p>
          <p>Due Sep 30, 2026</p>
        </aside>
      </section>

      <section aria-labelledby="fines-heading">
        <h3 id="fines-heading">Active fines &amp; citations</h3>
        {unpaidFines.length === 0 ? (
          <p>No unpaid citations.</p>
        ) : (
          <ul>
            {unpaidFines.map((fine) => (
              <li key={fine.id}>
                <article>
                  <p>{fine.photo}</p>
                  <h4>{fine.id}</h4>
                  <p>Status: {fine.status}</p>
                  <p>Violation: {fine.violation}</p>
                  <p>Location: {fine.location}</p>
                  <p>Date: {fine.date}</p>
                  <p>Fine amount: {currency.format(fine.amount)}</p>
                  <button type="button" onClick={() => onAppeal(fine.id)}>
                    File Appeal
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
