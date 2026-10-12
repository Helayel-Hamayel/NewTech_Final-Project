import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../components/common/Footer";
import LoginHeader from "../components/LoginPage/LoginHeader";
import loginBackground from "../assets/background/Login_Background (1).webp";
import "../styles/pages/LoginPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const message = error instanceof Error ? error.message : "Could not create the fine.";

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
              <p className="login-eyebrow">Municipal portal</p>
              <h1 id="register-heading">Create your account</h1>
              <p className="login-description">Register as a resident to access city services.</p>
            </header>

            <form className="login-form" onSubmit={handleSubmit}>
              <section className="login-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
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
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                />
              </section>

              <section className="login-field">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                />
              </section>

              <section className="login-field">
                <label htmlFor="register-confirm-password">Confirm password</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={loading}
                />
              </section>

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </button>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </section>
        </section>

        <Footer />
      </section>
    </main>
  );
}
