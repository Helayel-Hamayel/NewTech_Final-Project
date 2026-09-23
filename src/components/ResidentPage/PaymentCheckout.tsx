import { useState } from "react";
import type { FormEvent } from "react";
import { currency } from "../../helpers/formatting/currency";

type PaymentCheckoutProps = {
  amount: number;
  defaultPayments: number;
  onClose: () => void;
};

export default function PaymentCheckout({
  amount,
  defaultPayments,
  onClose,
}: PaymentCheckoutProps) {
  const [checkoutPayments, setCheckoutPayments] = useState(defaultPayments);
  const [checkoutStep, setCheckoutStep] = useState<"schedule" | "payment">(
    "schedule",
  );
  const [demoPaymentComplete, setDemoPaymentComplete] = useState(false);

  function handleDemoPaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDemoPaymentComplete(true);
  }

  return (
    <div className="resident-dialog-backdrop" role="presentation">
      <div
        className="resident-dialog payment-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-dialog-heading"
      >
        <button
          className="resident-dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Close secure checkout"
        >
          Close
        </button>
        {checkoutStep === "schedule" ? (
          <>
            <p className="section-label">Payment setup</p>
            <h2 id="payment-dialog-heading">Choose your payment schedule</h2>
            <p className="payment-dialog-copy">
              Review your balance and choose whether to pay it once or split it
              into installments.
            </p>
            <div className="payment-dialog-total">
              <span>Total balance</span>
              <strong>{currency.format(amount)}</strong>
            </div>
            <label className="payment-count-field">
              Number of payments
              <input
                type="number"
                min="1"
                max="12"
                value={checkoutPayments}
                onChange={(event) =>
                  setCheckoutPayments(
                    Math.min(12, Math.max(1, Number(event.target.value) || 1)),
                  )
                }
              />
            </label>
            <p className="payment-installment-preview">
              {checkoutPayments === 1
                ? "Pay the full balance today."
                : `${currency.format(amount / checkoutPayments)} per payment, before any provider fees.`}
            </p>
            <div className="payment-dialog-actions">
              <button
                className="resident-secondary-btn"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="resident-primary-btn"
                type="button"
                onClick={() => setCheckoutStep("payment")}
              >
                Continue to checkout
              </button>
            </div>
          </>
        ) : demoPaymentComplete ? (
          <div className="payment-complete" role="status">
            <strong>Demo payment complete</strong>
            <p>
              No real payment was processed. Secure checkout integration is a
              work in progress.
            </p>
            <button className="resident-primary-btn" type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="demo-payment-form" onSubmit={handleDemoPaymentSubmit}>
            <p className="section-label">Demo secure checkout</p>
            <h2 id="payment-dialog-heading">Enter payment details</h2>
            <p className="payment-dialog-copy">
              This is a functional demo. Real secure payment processing is a
              work in progress.
            </p>
            <div className="payment-dialog-total">
              <span>
                {checkoutPayments} payment{checkoutPayments === 1 ? "" : "s"}
              </span>
              <strong>{currency.format(amount / checkoutPayments)}</strong>
            </div>
            <label className="payment-count-field">
              Cardholder name
              <input required type="text" placeholder="Maria Reyes" />
            </label>
            <label className="payment-count-field">
              Card number
              <input
                required
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
              />
            </label>
            <div className="demo-payment-row">
              <label className="payment-count-field">
                Expiry
                <input required placeholder="MM / YY" />
              </label>
              <label className="payment-count-field">
                CVV
                <input required inputMode="numeric" placeholder="123" />
              </label>
            </div>
            <div className="payment-dialog-actions">
              <button
                className="resident-secondary-btn"
                type="button"
                onClick={() => setCheckoutStep("schedule")}
              >
                Back
              </button>
              <button className="resident-primary-btn" type="submit">
                Complete demo payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
