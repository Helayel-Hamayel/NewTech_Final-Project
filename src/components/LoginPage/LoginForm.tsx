import { ArrowRight } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "The password or email is incorrect" : "Unable to log in. Please try again.");
        return;
      }

      const data = await res.json();

      if (data.user.role === "FIELD_GUARD") {
        navigate("/field-guard", { replace: true });
      } else if (data.user.role === "STAFF") {
        navigate("/staff", { replace: true });
      } else if (data.user.role === "RESIDENT") {
        navigate("/resident", { replace: true });
      } else {
        setError("Your account has an unsupported role.");
      }
    } catch (err) {
      setError("An error happened wit the server");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="e.g. MOE@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>

      <div className="login-field">
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
      </div>

      <div className="login-form-options">
        <label className="login-remember">
          <input type="checkbox" name="remember" />
          <span>Remember me</span>
        </label>
        <a href="#forgot-password">Forgot password</a>
      </div>

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
