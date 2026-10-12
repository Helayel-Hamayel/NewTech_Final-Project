import "../../styles/common/LoadingState.css";

type LoadingStateProps = {
  title: string;
  description?: string;
  variant?: "card" | "inline";
};

export default function LoadingState({ title, description = "This will only take a moment.", variant = "card" }: LoadingStateProps) {
  return (
    <section className={`loading-state loading-state--${variant}`} role="status" aria-live="polite">
      <span className="loading-state-spinner" aria-hidden="true" />
      <strong>{title}</strong>
      <span>{description}</span>
    </section>
  );
}
