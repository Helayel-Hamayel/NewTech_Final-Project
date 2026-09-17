import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ResidentIssue } from '../../data/residentPortal'

type ResidentIssuesProps = {
  issues: ResidentIssue[]
  onAddIssue: (issue: ResidentIssue) => void
  onCheckIssue: (issueId: string) => void
}

const categories = ['Parking', 'Road and sidewalk', 'Lighting', 'Waste and sanitation', 'Noise', 'Other']

type IssueForm = Omit<ResidentIssue, 'id' | 'reportedDate' | 'status' | 'photo'> & { photo: string }

const emptyForm: IssueForm = {
  phone: '',
  subject: '',
  category: 'Parking',
  description: '',
  photo: '',
  location: '',
}

export default function ResidentIssues({ issues, onAddIssue, onCheckIssue }: ResidentIssuesProps) {
  const [form, setForm] = useState<IssueForm>(emptyForm)

  function updateForm(field: keyof IssueForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onAddIssue({
      ...form,
      id: `ISS-${3002 + issues.length}`,
      photo: form.photo || 'No photo attached',
      reportedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Submitted',
    })
    setForm(emptyForm)
  }

  return (
    <section aria-labelledby="resident-issues-heading">
      <h3 id="resident-issues-heading">Resident-reported issues</h3>
      <p>Report a community issue for a Field Guard to inspect.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Phone number
          <input required type="tel" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="(555) 010-0000" />
        </label>
        <label>
          Subject or issue type
          <input required value={form.subject} onChange={(event) => updateForm('subject', event.target.value)} placeholder="Illegal parked car" />
        </label>
        <label>
          Category
          <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Description
          <textarea required value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="Describe the issue" />
        </label>
        <label>
          Photo
          <input type="file" accept="image/*" onChange={(event) => updateForm('photo', event.target.files?.[0]?.name ?? '')} />
        </label>
        <label>
          Location
          <input required value={form.location} onChange={(event) => updateForm('location', event.target.value)} placeholder="Street, building, or landmark" />
        </label>
        <button type="submit">Submit issue</button>
      </form>

      <h4>Submitted issues</h4>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <article>
              <h4>{issue.id}: {issue.subject}</h4>
              <p>Status: {issue.status}</p>
              <p>Category: {issue.category}</p>
              <p>Phone: {issue.phone}</p>
              <p>Description: {issue.description}</p>
              <p>Photo: {issue.photo}</p>
              <p>Location: {issue.location}</p>
              <p>Reported: {issue.reportedDate}</p>
              {issue.status !== 'Field Guard Checked' ? (
                <button type="button" onClick={() => onCheckIssue(issue.id)}>Field Guard checked</button>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}