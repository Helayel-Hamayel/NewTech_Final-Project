import { ArrowRight } from "lucide-react";

export default function LoginForm() {
  return (
    <form className="login-form">
      <div className="login-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="e.g. RES-00441"
        />
      </div>

      <div className="login-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <div className="login-form-options">
        <label className="login-remember">
          <input type="checkbox" name="remember" />
          <span>Remember me</span>
        </label>
        <a href="#forgot-password">Forgot password</a>
      </div>

      <button className="login-submit" type="button">
        Sign in securely{" "}
        <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </form>
  );
}
