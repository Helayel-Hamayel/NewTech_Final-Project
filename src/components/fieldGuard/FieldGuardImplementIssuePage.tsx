import { Tag, FileText, Coins, MapPin, Flag } from "lucide-react";
import { useState } from "react";

export default function FieldGuardImplementIssuePage() {
  const [priority, setPriority] = useState("");
  return (
    <section className="create-issue-page">
      <div className="create-issue-card" aria-labelledby="create-issue-title">
        <h1 id="create-issue-title">Create an issue</h1>

        <div className="create-issue-field">
          <label htmlFor="issue-name" className="field-guard-icon-text"><Tag className="field-guard-icon" aria-hidden="true" />Issue name</label>
          <input id="issue-name" name="name" type="text" placeholder="Enter an issue name" />
        </div>

        <div className="create-issue-field">
          <label htmlFor="issue-description" className="field-guard-icon-text"><FileText className="field-guard-icon" aria-hidden="true" />Problem description</label>
          <textarea id="issue-description" name="description" rows={5} placeholder="Describe the problem" />
        </div>

        <div className="create-issue-field">
          <label htmlFor="issue-amount" className="field-guard-icon-text"><Coins className="field-guard-icon" aria-hidden="true" />Cost</label>
          <input id="issue-amount" name="amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>

        <div className="create-issue-row">
          <div className="create-issue-field">
            <label htmlFor="issue-violation" className="field-guard-icon-text"><Tag className="field-guard-icon" aria-hidden="true" />Category / violation</label>
            <select id="issue-violation" name="violationType" defaultValue="">
              <option value="" disabled>Select a violation</option>
              <option value="Illegal Parking">Illegal Parking</option>
              <option value="Parking Obstruction">Parking Obstruction</option>
            </select>
          </div>

          <div className="create-issue-field">
            <span id="issue-priority-label" className="field-guard-icon-text"><Flag className="field-guard-icon" aria-hidden="true" />Priority</span>
            <div className="choice-row" role="group" aria-labelledby="issue-priority-label">
              {["LOW", "MEDIUM", "HIGH"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`choice-box ${priority === value ? "selected" : ""}`}
                  onClick={() => setPriority(value)}
                  aria-pressed={priority === value}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="create-issue-field">
          <label htmlFor="issue-location" className="field-guard-icon-text"><MapPin className="field-guard-icon" aria-hidden="true" />Location</label>
          <input id="issue-location" name="location" type="text" placeholder="Enter the location" />
        </div>

        <div className="create-issue-field">
          <label htmlFor="issue-photo" className="field-guard-icon-text">
            <FileText className="field-guard-icon" aria-hidden="true" />
            Photo / file
          </label>
          <input id="issue-photo" name="photoEvidence" type="file" />
        </div>

        <div className="create-issue-actions">
          <button type="button" className="create-issue-reset">Reset</button>
          <button type="button" className="create-issue-submit">Submit issue</button>
        </div>
      </div>
    </section>
  );
}
