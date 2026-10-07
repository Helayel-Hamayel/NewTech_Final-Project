import { useEffect, useState, type FormEvent } from "react";
import { Camera, Check, MapPin, Search, Ticket } from "lucide-react";
import "../../styles/pages/FieldGuard/FieldGuardImplementIssuePage.css";

const states = ["NY", "NJ", "CT", "PA", "CA", "TX", "FL", "IL"];

const infractions = [
  { name: "Disabled Spot — No Permit", fine: 250 },
  { name: "Expired Meter", fine: 75 },
  { name: "Illegal Sidewalk Parking", fine: 150 },
  { name: "Fire Hydrant Zone", fine: 200 },
  { name: "Illegal Dumping", fine: 500 },
  { name: "Double Parking", fine: 100 },
  { name: "No Stopping Zone", fine: 125 },
  { name: "Block Driveway", fine: 175 },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function FieldGuardImplementIssuePage() {
  const [lookup, setLookup] = useState("");
  const [state, setState] = useState("NY");
  const [plate, setPlate] = useState("");
  const [infractionName, setInfractionName] = useState(infractions[0].name);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [ticketIssued, setTicketIssued] = useState(false);
  const selectedInfraction =
    infractions.find((infraction) => infraction.name === infractionName) ??
    infractions[0];

  useEffect(() => {
    if (!ticketIssued) return;

    const timeout = window.setTimeout(() => {
      setLookup("");
      setState("NY");
      setPlate("");
      setInfractionName(infractions[0].name);
      setPhotoCaptured(false);
      setTicketIssued(false);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [ticketIssued]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!plate.trim() || ticketIssued) return;
    setTicketIssued(true);
  }

  return (
    <section className="field-citation" aria-labelledby="citation-title">
      <header className="field-citation-heading">
        <div>
          <p className="field-citation-eyebrow">FIELD OPERATIONS</p>
          <h1 id="citation-title">Issue Citation</h1>
          <p>Record a parking or property infraction.</p>
        </div>
        <span className="field-citation-ticket-mark" aria-hidden="true">
          <Ticket size={21} />
        </span>
      </header>

      <form className="field-citation-form" onSubmit={handleSubmit}>
        <div className="field-citation-lookup">
          <label htmlFor="citation-lookup">Plate / property lookup</label>
          <div className="field-citation-search">
            <Search size={18} aria-hidden="true" />
            <input
              id="citation-lookup"
              type="search"
              value={lookup}
              onChange={(event) => setLookup(event.target.value)}
              placeholder="Search plate or property"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="field-citation-fields">
          <div className="field-citation-state">
            <label htmlFor="citation-state">State</label>
            <select
              id="citation-state"
              value={state}
              onChange={(event) => setState(event.target.value)}
              disabled={ticketIssued}
            >
              {states.map((stateCode) => (
                <option key={stateCode} value={stateCode}>
                  {stateCode}
                </option>
              ))}
            </select>
          </div>
          <div className="field-citation-plate">
            <label htmlFor="citation-plate">License plate</label>
            <input
              id="citation-plate"
              name="plate"
              type="text"
              value={plate}
              onChange={(event) =>
                setPlate(event.target.value.toLocaleUpperCase())
              }
              placeholder="ENTER PLATE"
              autoComplete="off"
              required
              disabled={ticketIssued}
              maxLength={10}
            />
          </div>
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
            <p>CALCULATED FINE</p>
            <strong>{currency.format(selectedInfraction.fine)}</strong>
          </div>
          <span>{infractionName}</span>
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
          disabled={!plate.trim() || ticketIssued}
        >
          {ticketIssued ? (
            <>
              <Check size={19} aria-hidden="true" />
              Digital Ticket Issued!
            </>
          ) : (
            <>
              <Ticket size={19} aria-hidden="true" />
              Issue Ticket
            </>
          )}
        </button>
      </form>

      <p className="field-citation-location">
        <MapPin size={15} aria-hidden="true" />
        Zone 3 · Location recorded at issue time
      </p>
    </section>
  );
}
