export default function LoginForm() {
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input id="username" name="username" type="text" placeholder="e.g. RES-00441" />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" placeholder="Enter your password" />

      <div>
        <label>
          <input type="checkbox" name="remember" />
          <span>Remember me</span>
        </label>
        <a href="#forgot-password">Forgot password?</a>
      </div>

      <button type="button">
        Sign In
      </button>
    </form>
  )
}
