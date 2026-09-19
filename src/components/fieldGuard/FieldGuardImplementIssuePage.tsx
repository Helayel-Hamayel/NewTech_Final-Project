import { Tag, FileText, Coins, MapPin, Flag } from "lucide-react";
import { useState } from "react";

export default function FieldGuardImplementIssuePage() {
  const [priority, setPriority] = useState("");
  return (
    <section>
      <div aria-labelledby="create-issue-title">
        <h1 id="create-issue-title">Create an issue</h1>

        <div>
          <label htmlFor="issue-name"><Tag aria-hidden="true" />Issue name</label>
          <input id="issue-name" name="name" type="text" placeholder="Enter an issue name" />
        </div>

        <div>
          <label htmlFor="issue-description"><FileText aria-hidden="true" />Problem description</label>
          <textarea id="issue-description" name="description" rows={5} placeholder="Describe the problem" />
        </div>

        <div>
          <label htmlFor="issue-amount"><Coins aria-hidden="true" />Cost</label>
          <input id="issue-amount" name="amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>

        <div>
          <div>
            <label htmlFor="issue-violation"><Tag aria-hidden="true" />Category / violation</label>
            <select id="issue-violation" name="violationType" defaultValue="">
              <option value="" disabled>Select a violation</option>
              <option value="Illegal Parking">Illegal Parking</option>
              <option value="Parking Obstruction">Parking Obstruction</option>
            </select>
          </div>

          <div>
            <span id="issue-priority-label"><Flag aria-hidden="true" />Priority</span>
            <div role="group" aria-labelledby="issue-priority-label">
              {["LOW", "MEDIUM", "HIGH"].map((value) => (
                <button
                  key={value}
                  type="button"

                  onClick={() => setPriority(value)}
                  aria-pressed={priority === value}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="issue-location"><MapPin aria-hidden="true" />Location</label>
          <input id="issue-location" name="location" type="text" placeholder="Enter the location" />
        </div>

        <div>
          <label htmlFor="issue-photo">
            <FileText aria-hidden="true" />
            Photo / file
          </label>
          <input id="issue-photo" name="photoEvidence" type="file" />
        </div>

        <div>
          <button type="button">Reset</button>
          <button type="button">Submit issue</button>
        </div>
      </div>
    </section>
  );
}
