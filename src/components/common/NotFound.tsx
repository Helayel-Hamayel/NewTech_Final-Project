import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main>
      <div>
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for is not available.</p>
        <Link to="/login">Return to sign in</Link>
      </div>
    </main>
  )
}