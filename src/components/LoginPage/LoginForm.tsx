import { apiUrl } from "../../helpers/apiUrl";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/useUser";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowRequest, setSlowRequest] = useState(false);
  const loginController = useRef<AbortController | null>(null);

  useEffect(() => () => loginController.current?.abort(), []);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setSlowRequest(true), 5000);
    return () => window.clearTimeout(timer);
  }, [loading]);

  const navigate = useNavigate();
  const { saveUser } = useUser();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginController.current) return;

    const controller = new AbortController();
    const timeout = AbortSignal.timeout(20000);
    loginController.current = controller;
    setError("");
    setSlowRequest(false);
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: AbortSignal.any([controller.signal, timeout]),
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });
      if (!res.ok) {
        const message =
          res.status === 401
            ? "The email or password is incorrect."
            : res.status === 429
              ? "Too many login attempts. Please wait before trying again."
              : res.status >= 500
                ? "The login server is unavailable or taking too long to respond. Please try again shortly."
                : "Unable to log in. Please check your details and try again.";

        setError(message);
        toast.error(message);
        return;
      }

      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Invalid login response");
      }

      const data = await res.json();
      if (!data?.user || typeof data.user.name !== "string") {
        throw new Error("Invalid login response");
      }

      let destination: string;
      if (data.user.role === "FIELD_GUARD") {
        destination = "/field-guard";
      } else if (data.user.role === "STAFF") {
        destination = "/staff";
      } else if (data.user.role === "RESIDENT") {
        destination = "/resident";
      } else {
        setError("Your account has an unsupported role.");
        return;
      }

      saveUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(destination, { replace: true });
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = timeout.aborted
        ? "The login server took too long to respond. Please try again shortly."
        : error instanceof SyntaxError ||
            (error instanceof Error &&
              error.message === "Invalid login response")
          ? "The login server returned an unexpected response. Please try again shortly."
          : "Unable to reach the login server. Check your connection and try again.";
      setError(message);
      toast.error(message);
    } finally {
      loginController.current = null;
      if (!controller.signal.aborted) {
        setLoading(false);
        setSlowRequest(false);
      }
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit} aria-busy={loading}>
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
        <input
          id="remember-me"
          name="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Keep me logged in
      </label>

      <button className="login-submit" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in securely"}
        <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {loading && slowRequest && (
        <p role="status" className="login-status">
          The login server is taking longer than expected. This attempt stops
          after 20 seconds if it cannot connect.
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            color: "#ef4444",
            fontSize: "14px",
            margin: "0 0 12px",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </form>
  );
}