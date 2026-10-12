import { Link, useNavigate } from 'react-router-dom'
import '../../styles/common/NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="not-found">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <span className="not-found-code" aria-hidden="true">404</span>
        <h1 id="not-found-title">Page not found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <button type="button" className="not-found-btn not-found-btn--secondary" onClick={() => navigate(-1)}>
            Go back
          </button>
          <Link className="not-found-btn" to="/login">Return to sign in</Link>
        </div>
      </section>
    </main>
  )
}