import type { MaintenanceTicket } from '../../data/residentPortal'
import { currency } from './formatters'
import ResidentIssues from './ResidentIssues'
import type { MyTicketsProps } from './types'

export default function MyTickets({ tickets, fines, issues, onOpenAppeal, selectedAppealFine, appealStatement, onAppealStatementChange, onSubmitAppeal, onCloseAppeal, onAddIssue, onCheckIssue }: MyTicketsProps) {
  const ticketStages: MaintenanceTicket['stage'][] = ['Reported', 'Dispatched', 'In Progress', 'Resolved']

  return (
    <section aria-labelledby="tickets-heading">
      <h2 id="tickets-heading">My Tickets</h2>
      <ResidentIssues issues={issues} onAddIssue={onAddIssue} onCheckIssue={onCheckIssue} />
      <section aria-labelledby="maintenance-heading">
        <div><h3 id="maintenance-heading">Maintenance Requests</h3><button type="button">+ New Request</button></div>
        {tickets.map((ticket) => {
          const currentStageIndex = ticketStages.indexOf(ticket.stage)
          return <article key={ticket.id}><div><p>{ticket.id}</p><span>{ticket.stage}</span></div><p>{ticket.type}</p><p>{ticket.location}</p><p>Reported: {ticket.reportedDate}</p><div aria-label="Maintenance progress">{ticketStages.map((stage, index) => <div key={`${ticket.id}-${stage}`}><span>{index <= currentStageIndex ? '●' : '○'}</span><span>{stage}</span>{index < ticketStages.length - 1 ? <span>→</span> : null}</div>)}</div></article>
        })}
      </section>
      <section aria-labelledby="citations-heading">
        <h3 id="citations-heading">Fines &amp; Citations</h3>
        <ul>{fines.map((fine) => <li key={fine.id}><article><p>{fine.photo}</p><h4>{fine.id}</h4><p>Status: {fine.status}</p><p>Violation: {fine.violation}</p><p>Location: {fine.location}</p><p>Date: {fine.date}</p><p>Fine amount: {currency.format(fine.amount)}</p>{fine.status === 'Unpaid' ? <button type="button" onClick={() => onOpenAppeal(fine)}>File Appeal</button> : null}</article></li>)}</ul>
      </section>
      {selectedAppealFine ? <div role="dialog" aria-modal="true" aria-labelledby="appeal-heading"><div><button type="button" onClick={onCloseAppeal}>Close</button><div><div><p>{selectedAppealFine.photo}</p><p>{selectedAppealFine.id}</p><p>{selectedAppealFine.date}</p><p>{selectedAppealFine.violation}</p><p>{currency.format(selectedAppealFine.amount)}</p></div><div><h3 id="appeal-heading">Submit Appeal</h3><textarea value={appealStatement} onChange={(event) => onAppealStatementChange(event.target.value)} placeholder="Write your statement here" /><label><input type="checkbox" />Upload photo or document</label><button type="button" onClick={onSubmitAppeal}>Submit Appeal</button></div></div></div></div> : null}
    </section>
  )
}