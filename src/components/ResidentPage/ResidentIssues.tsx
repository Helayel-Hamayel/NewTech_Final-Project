import { useState } from "react";
import type { SubmitEvent } from "react";
import type { ResidentIssue } from "../../data/residentPortal";

type ResidentIssuesProps = {
  issues: ResidentIssue[];
  onAddIssue: (issue: ResidentIssue) => void;
};

const categories = [
  "Parking",
  "Road and sidewalk",
  "Lighting",
  "Waste and sanitation",
  "Noise",
  "Other",
];

type IssueForm = Omit<
  ResidentIssue,
  "id" | "reportedDate" | "status" | "photo" | "subject"
> & { photo: string };

const emptyForm: IssueForm = {
  phone: "",
  category: "Parking",
  description: "",
  photo: "",
  location: "",
};

export default function ResidentIssues({
  issues,
  onAddIssue,
}: ResidentIssuesProps) {
  const [form, setForm] = useState<IssueForm>(emptyForm);

  function updateForm(field: keyof IssueForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddIssue({
      ...form,
      subject: form.category,
      id: `ISS-${3002 + issues.length}`,
      photo: form.photo || "No photo attached",
      reportedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Submitted",
    });
    setForm(emptyForm);
  }

  return (
    <section
      className="resident-card issues-panel"
      aria-labelledby="resident-issues-heading"
    >
      <div className="resident-card-header">
        <div>
          <p className="section-label">Community care</p>
          <h2 id="resident-issues-heading">Report an issue</h2>
          <p>Send a local concern to a Field Guard for inspection.</p>
        </div>
        <span className="issues-accent" aria-hidden="true">
          ●
        </span>
      </div>

      <form className="issue-form" onSubmit={handleSubmit}>
        <label>
          Subject or issue type
          <select
            value={form.category}
            onChange={(event) => updateForm("category", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            required
            value={form.description}
            onChange={(event) => updateForm("description", event.target.value)}
            placeholder="Describe the issue"
          />
        </label>
        <label>
          Location
          <input
            required
            value={form.location}
            onChange={(event) => updateForm("location", event.target.value)}
            placeholder="Street, building, or landmark"
          />
        </label>
        <label>
          Phone number
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(event) => updateForm("phone", event.target.value)}
            placeholder="(555) 010-0000"
          />
        </label>
        <label>
          Photo or document
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) =>
              updateForm("photo", event.target.files?.[0]?.name ?? "")
            }
          />
        </label>
        <button className="resident-primary-btn" type="submit">
          Submit issue
        </button>
      </form>

      <h3 className="issues-subheading">Submitted issues</h3>
      <ul className="submitted-issues-list">
        {issues.map((issue) => (
          <li key={issue.id}>
            <article className="submitted-issue-card">
              <div className="submitted-issue-header">
                <div>
                  <span className="ticket-id">{issue.id}</span>
                  <h4>{issue.subject}</h4>
                </div>
                <span className="status-badge status-badge--info">
                  {issue.status}
                </span>
              </div>
              <p className="resident-muted">
                {issue.category} · {issue.location} · Reported{" "}
                {issue.reportedDate}
              </p>
              <p>{issue.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
