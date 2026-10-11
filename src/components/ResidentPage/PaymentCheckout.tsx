import { useState } from "react";
import type { SubmitEvent } from "react";
import { currency } from "../../helpers/formatting/currency";

type PaymentCheckoutProps = {
  amount: number;
  defaultPayments: number;
  onConfirm?: () => Promise<void>;
  onClose: () => void;
};

export default function PaymentCheckout({ amount, onConfirm, onClose }: PaymentCheckoutProps) {
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || !onConfirm) return;

    setSubmitting(true);
    setError("");

    try {
      await onConfirm();
      setComplete(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not record payment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="resident-dialog-backdrop" role="presentation">
      <section className="resident-dialog payment-dialog" role="dialog" aria-modal="true" aria-labelledby="payment-dialog-heading">
        <button className="resident-dialog-close" type="button" onClick={onClose} disabled={submitting}>
          Close
        </button>

        {complete ? (
          <section className="payment-complete" role="status">
            <h2 id="payment-dialog-heading">Payment recorded</h2>
            <p>The selected charges are now marked as paid.</p>

            <button className="resident-primary-btn" type="button" onClick={onClose}>
              Done
            </button>
          </section>
        ) : (
          <form className="demo-payment-form" onSubmit={handleSubmit}>
            <p className="section-label">Payment details</p>
            <h2 id="payment-dialog-heading">Pay selected charges</h2>

            <section className="payment-dialog-total">
              <span>Total</span>
              <strong>{currency.format(amount)}</strong>
            </section>

            <label className="payment-count-field">
              Cardholder name
              <input required type="text" disabled={submitting} />
            </label>

            <label className="payment-count-field">
              Card number
              <input required inputMode="numeric" placeholder="4242 4242 4242 4242" disabled={submitting} />
            </label>

            <section className="demo-payment-row">
              <label className="payment-count-field">
                Expiry
                <input required placeholder="MM / YY" disabled={submitting} />
              </label>

              <label className="payment-count-field">
                CVV
                <input required inputMode="numeric" placeholder="123" disabled={submitting} />
              </label>
            </section>

            {!onConfirm && <p role="status">Open Billing to pay your selected charges.</p>}

            {error && <p role="alert">{error}</p>}

            <section className="payment-dialog-actions">
              <button className="resident-secondary-btn" type="button" onClick={onClose} disabled={submitting}>
                Cancel
              </button>

              <button className="resident-primary-btn" type="submit" disabled={submitting || !onConfirm}>
                {submitting ? "Saving..." : "Pay"}
              </button>
            </section>
          </form>
        )}
      </section>
    </section>
  );
}
