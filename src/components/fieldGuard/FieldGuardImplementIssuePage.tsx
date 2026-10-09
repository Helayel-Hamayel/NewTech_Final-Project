import { useRef, useState, type SubmitEvent } from "react";
import { Camera, Check, Ticket } from "lucide-react";
import "../../styles/pages/FieldGuard/FieldGuardImplementIssuePage.css";

const infractions = [
  { name: "Accessible parking without a permit", fine: 1000 },
  { name: "Blue-and-white parking without payment", fine: 100 },
  { name: "Parking on the sidewalk", fine: 500 },
  { name: "Parking at a bus stop", fine: 250 },
  { name: "Double parking / obstructing traffic", fine: 250 },
  { name: "Stopping on a red-and-white curb", fine: 250 },
  { name: "Parking during prohibited hours", fine: 100 },
];

const currency = new Intl.NumberFormat("en-IL", {
  style: "currency",
  currency: "ILS",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

const israeliPlatePattern = /^(?:\d{2}-\d{3}-\d{2}|\d{3}-\d{2}-\d{3})$/;

function formatIsraeliPlate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length === 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }

  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}${digits.length > 5 ? `-${digits.slice(5)}` : ""}`;
}

export default function FieldGuardImplementIssuePage() {
  const [plate, setPlate] = useState("");
  const [infractionName, setInfractionName] = useState(infractions[0].name);
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [ticketIssued, setTicketIssued] = useState(false);
  const selectedInfraction = infractions.find((infraction) => infraction.name === infractionName) ?? infractions[0];
  const isPlateValid = israeliPlatePattern.test(plate);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPlateValid || submitting || ticketIssued) return;

    setSubmitting(true);
    setError("");

    try {
      if (photo && photo.size > 5 * 1024 * 1024) {
        throw new Error("The photo must be 5 MB or smaller.");
      }

      const formData = new FormData();

      formData.append("licensePlate", plate);
      formData.append("violationType", selectedInfraction.name);

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("http://localhost:4000/fines", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not create the fine.");
      }

      setTicketIssued(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create the fine.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    if (submitting) return;

    setPlate("");
    setInfractionName(infractions[0].name);
    setPhoto(null);
    setTicketIssued(false);
    setError("");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  return (
    <section className="field-citation" aria-labelledby="citation-title">
      <header className="field-citation-heading">
        <section>
          <p className="field-citation-eyebrow">FIELD OPERATIONS</p>
          <h1 id="citation-title">Issue Parking Citation</h1>
          <p>Create a demo citation for Tel Aviv-Yafo.</p>
        </section>
        <span className="field-citation-ticket-mark" aria-hidden="true">
          <Ticket size={21} />
        </span>
      </header>

      <form className="field-citation-form" onSubmit={handleSubmit}>
        <section className="field-citation-plate">
          <label htmlFor="citation-plate">Vehicle registration number</label>
          <input
            id="citation-plate"
            name="plate"
            type="text"
            value={plate}
            onChange={(event) => setPlate(formatIsraeliPlate(event.target.value))}
            placeholder="123-45-678"
            inputMode="numeric"
            autoComplete="off"
            required
            pattern="(?:[0-9]{2}-[0-9]{3}-[0-9]{2}|[0-9]{3}-[0-9]{2}-[0-9]{3})"
            title="Enter a 7- or 8-digit Israeli vehicle number."
            disabled={submitting || ticketIssued}
            maxLength={10}
          />
          <small className="field-citation-help">7- or 8-digit Israeli plate</small>
        </section>

        <section className="field-citation-infraction">
          <label htmlFor="citation-infraction">Infraction type</label>
          <select
            id="citation-infraction"
            value={infractionName}
            onChange={(event) => setInfractionName(event.target.value)}
            disabled={submitting || ticketIssued}>
            {infractions.map((infraction) => (
              <option key={infraction.name} value={infraction.name}>
                {infraction.name} · {currency.format(infraction.fine)}
              </option>
            ))}
          </select>
        </section>

        <section className="field-citation-fine" aria-live="polite" aria-label="Calculated fine">
          <section>
            <p>CALCULATED FINE · TEL AVIV-YAFO</p>
            <strong>{currency.format(selectedInfraction.fine)}</strong>
          </section>
          <span>{infractionName}</span>
          <small>Indicative amount; the official notice determines the final fine.</small>
        </section>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          disabled={submitting || ticketIssued}
          onChange={(event) => {
            setPhoto(event.target.files?.[0] ?? null);
          }}
        />

        <button
          className={`field-citation-photo${photo ? " is-captured" : ""}`}
          type="button"
          onClick={() => photoInputRef.current?.click()}
          disabled={submitting || ticketIssued}>
          {photo ? <Check size={20} aria-hidden="true" /> : <Camera size={20} aria-hidden="true" />}

          <span>
            <strong>{photo ? "Photo selected" : "Photo Evidence"}</strong>
            <small>{photo ? photo.name : "Choose a JPEG, PNG, or WebP image"}</small>
          </span>
        </button>

        <section className="field-citation-actions">
          <button className="field-citation-reset" type="button" onClick={resetForm} disabled={submitting}>
            Reset
          </button>

          <button
            className={`field-citation-submit${ticketIssued ? " is-issued" : ""}`}
            type="submit"
            disabled={!isPlateValid || submitting || ticketIssued}>
            {ticketIssued ? (
              <>
                <Check size={19} aria-hidden="true" />
                Fine created
              </>
            ) : (
              <>
                <Ticket size={19} aria-hidden="true" />
                {submitting ? "Saving..." : "Create fine"}
              </>
            )}
          </button>
        </section>
        {error && <p role="alert">{error}</p>}

        {ticketIssued && <p role="status">Fine saved successfully. Press Reset to create another.</p>}
      </form>
    </section>
  );
}
