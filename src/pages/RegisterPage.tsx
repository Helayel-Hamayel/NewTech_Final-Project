import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../components/common/Footer";
import LoginHeader from "../components/LoginPage/LoginHeader";
import loginBackground from "../assets/background/Login_Background (1).webp";
import "../styles/pages/LoginPage.css";

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  return { level: score, label: labels[score] };
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.message ?? "Could not create your account.");
      }

      toast.success("Account created. Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create your account.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-background" aria-hidden="true">
        <img className="login-background-image is-active" src={loginBackground} alt="" />
        <section className="login-background-overlay" />
      </section>

      <section className="login-shell">
        <LoginHeader />

        <section className="login-content" aria-labelledby="register-heading">
          <section className="login-panel">
            <header className="login-intro">
              <p className="login-eyebrow">Municipal portal / new resident</p>
              <h1 id="register-heading">Create your resident account</h1>
              <p className="login-description">Register to report issues, pay bills and track your city services.</p>
            </header>

            <form className="login-form" onSubmit={handleSubmit}>
              <section className="login-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Maria Reyes"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                />
              </section>

              <section className="login-field">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. maria.reyes@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                />
              </section>

              <section className="login-field">
                <label htmlFor="register-password">Password</label>
                <section className="auth-password">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </section>

                {password && (
                  <section className="auth-strength" data-level={strength.level}>
                    <span className="auth-strength-bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="auth-strength-label" role="status">
                      Password strength: {strength.label}
                    </span>
                  </section>
                )}
              </section>

              <section className="login-field">
                <label htmlFor="register-confirm-password">Confirm password</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={loading}
                  aria-invalid={passwordsMismatch}
                />
                {passwordsMismatch && <p className="auth-field-hint is-error">The passwords do not match.</p>}
                {passwordsMatch && (
                  <p className="auth-field-hint is-success">
                    <Check size={14} aria-hidden="true" /> Passwords match
                  </p>
                )}
              </section>

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </section>
        </section>

        <Footer />
      </section>
    </main>
  );
}
