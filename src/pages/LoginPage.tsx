import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import LoginForm from "../components/LoginPage/LoginForm";
import LoginHeader from "../components/LoginPage/LoginHeader";
import loginBackgroundOne from "../assets/background/Login_Background (1).webp";
import loginBackgroundTwo from "../assets/background/Login_Background (2).webp";
import loginBackgroundThree from "../assets/background/Login_Background (3).webp";
import "../styles/pages/LoginPage.css";

export default function LoginPage() {
  const [activeBackground, setActiveBackground] = useState(0);
  const backgrounds = [loginBackgroundOne, loginBackgroundTwo, loginBackgroundThree];

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveBackground((currentBackground) => (currentBackground + 1) % backgrounds.length);
    }, 8000);

    return () => window.clearInterval(rotation);
  }, [backgrounds.length]);

  return (
    <main className="login-page">
      <section className="login-background" aria-hidden="true">
        {backgrounds.map((background, index) => (
          <img
            className={`login-background-image${index === activeBackground ? " is-active" : ""}`}
            key={background}
            src={background}
            alt=""
          />
        ))}
        <section className="login-background-overlay" />
      </section>
      <section className="login-shell">
        <LoginHeader />

        <section className="login-content" aria-labelledby="login-heading">
          <section className="login-panel">
            <header className="login-intro">
              <p className="login-eyebrow">Municipal portal / secure access</p>
              <h1 id="login-heading">Sign in to your account</h1>
              <p className="login-description">Access city services and operations securely.</p>
            </header>

            <LoginForm />
            <aside className="registration-notice" aria-labelledby="registration-heading">
              <section className="registration-notice-mark" aria-hidden="true">
                i
              </section>

              <section>
                <h2 id="registration-heading">Need an account?</h2>
                <p>Create a resident account to access city services.</p>

                <Link className="auth-register-link" to="/register">
                  Register
                </Link>
              </section>
            </aside>
          </section>
        </section>

        <Footer />
      </section>
    </main>
  );
}
