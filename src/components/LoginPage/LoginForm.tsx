import { ArrowRight } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/useUser";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { saveUser } = useUser();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });
      if (!res.ok) {
        const message = res.status === 401 ? "The email or password is incorrect." : "Unable to log in. Please try again.";

        setError(message);
        toast.error(message);
        return;
      }

      const data = await res.json();
      saveUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "FIELD_GUARD") {
        navigate("/field-guard", { replace: true });
      } else if (data.user.role === "STAFF") {
        navigate("/staff", { replace: true });
      } else if (data.user.role === "RESIDENT") {
        navigate("/resident", { replace: true });
      } else {
        setError("Your account has an unsupported role.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Unable to reach the server. Please try again.");
      toast.error("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <section className="login-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="e.g. maria.reyes@example.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </section>

      <section className="login-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </section>

      <label className="login-remember" htmlFor="remember-me">
        <input id="remember-me" name="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
        Keep me logged in
      </label>

      <button className="login-submit" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in securely"}
        <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {error && (
        <p role="alert" style={{ color: "#ef4444", fontSize: "14px", margin: "0 0 12px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </form>
  );
}
