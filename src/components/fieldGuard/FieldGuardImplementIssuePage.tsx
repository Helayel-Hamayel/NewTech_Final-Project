import { useEffect, useState, type FormEvent } from "react";
import { Camera, Check, MapPin, Search, Ticket } from "lucide-react";
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

  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}${
    digits.length > 5 ? `-${digits.slice(5)}` : ""
  }`;
}

export default function FieldGuardImplementIssuePage() {
  const [lookup, setLookup] = useState("");
  const [plate, setPlate] = useState("");
  const [infractionName, setInfractionName] = useState(infractions[0].name);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [ticketIssued, setTicketIssued] = useState(false);
  const selectedInfraction =
    infractions.find((infraction) => infraction.name === infractionName) ??
    infractions[0];
  const isPlateValid = israeliPlatePattern.test(plate);

  useEffect(() => {
    if (!ticketIssued) return;

    const timeout = window.setTimeout(() => {
      setLookup("");
      setPlate("");
      setInfractionName(infractions[0].name);
      setPhotoCaptured(false);
      setTicketIssued(false);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [ticketIssued]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPlateValid || ticketIssued) return;
    setTicketIssued(true);
  }

  return (
    <section className="field-citation" aria-labelledby="citation-title">
      <header className="field-citation-heading">
        <div>
          <p className="field-citation-eyebrow">FIELD OPERATIONS</p>
          <h1 id="citation-title">Issue Parking Report</h1>
          <p>Record a municipal parking violation in Tel Aviv-Yafo.</p>
        </div>
        <span className="field-citation-ticket-mark" aria-hidden="true">
          <Ticket size={21} />
        </span>
      </header>

      <form className="field-citation-form" onSubmit={handleSubmit}>
        <div className="field-citation-lookup">
          <label htmlFor="citation-lookup">Vehicle / address lookup</label>
          <div className="field-citation-search">
            <Search size={18} aria-hidden="true" />
            <input
              id="citation-lookup"
              type="search"
              value={lookup}
              onChange={(event) => setLookup(event.target.value)}
              placeholder="Search license plate or street address"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="field-citation-plate">
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
            disabled={ticketIssued}
            maxLength={10}
          />
          <small className="field-citation-help">7- or 8-digit Israeli plate</small>
        </div>

        <div className="field-citation-infraction">
          <label htmlFor="citation-infraction">Infraction type</label>
          <select
            id="citation-infraction"
            value={infractionName}
            onChange={(event) => setInfractionName(event.target.value)}
            disabled={ticketIssued}
          >
            {infractions.map((infraction) => (
              <option key={infraction.name} value={infraction.name}>
                {infraction.name} · {currency.format(infraction.fine)}
              </option>
            ))}
          </select>
        </div>

        <section
          className="field-citation-fine"
          aria-live="polite"
          aria-label="Calculated fine"
        >
          <div>
            <p>CALCULATED FINE · TEL AVIV-YAFO</p>
            <strong>{currency.format(selectedInfraction.fine)}</strong>
          </div>
          <span>{infractionName}</span>
          <small>Indicative amount; the official notice determines the final fine.</small>
        </section>

        <button
          className={`field-citation-photo${photoCaptured ? " is-captured" : ""}`}
          type="button"
          onClick={() => setPhotoCaptured((captured) => !captured)}
          aria-pressed={photoCaptured}
          disabled={ticketIssued}
        >
          {photoCaptured ? (
            <Check size={20} aria-hidden="true" />
          ) : (
            <Camera size={20} aria-hidden="true" />
          )}
          <span>
            <strong>{photoCaptured ? "Photo Captured" : "Photo Evidence"}</strong>
            <small>
              {photoCaptured
                ? "Evidence attached to this citation"
                : "Tap to capture photo evidence"}
            </small>
          </span>
        </button>

        <button
          className={`field-citation-submit${ticketIssued ? " is-issued" : ""}`}
          type="submit"
          disabled={!isPlateValid || ticketIssued}
        >
          {ticketIssued ? (
            <>
              <Check size={19} aria-hidden="true" />
              Parking Report Issued!
            </>
          ) : (
            <>
              <Ticket size={19} aria-hidden="true" />
              Issue Parking Report
            </>
          )}
        </button>
      </form>

      <p className="field-citation-location">
        <MapPin size={15} aria-hidden="true" />
        Tel Aviv-Yafo · Zone 3 · Location recorded at issue time
      </p>
    </section>
  );
}
