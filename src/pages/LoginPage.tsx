import { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import DemoAccess from "../components/LoginPage/DemoAccess";
import LoginForm from "../components/LoginPage/LoginForm";
import LoginHeader from "../components/LoginPage/LoginHeader";
import loginBackgroundOne from "../assets/background/Login_Background (1).webp";
import loginBackgroundTwo from "../assets/background/Login_Background (2).webp";
import loginBackgroundThree from "../assets/background/Login_Background (3).webp";
import "../styles/pages/LoginPage.css";

export default function LoginPage() {
  const [activeBackground, setActiveBackground] = useState(0);
  const backgrounds = [
    loginBackgroundOne,
    loginBackgroundTwo,
    loginBackgroundThree,
  ];

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveBackground(
        (currentBackground) => (currentBackground + 1) % backgrounds.length,
      );
    }, 8000);

    return () => window.clearInterval(rotation);
  }, [backgrounds.length]);

  return (
    <main className="login-page">
      <div className="login-background" aria-hidden="true">
        {backgrounds.map((background, index) => (
          <img
            className={`login-background-image${index === activeBackground ? " is-active" : ""}`}
            key={background}
            src={background}
            alt=""
          />
        ))}
        <div className="login-background-overlay" />
      </div>
      <div className="login-shell">
        <LoginHeader />

        <section className="login-content" aria-labelledby="login-heading">
          <div className="login-panel">
            <div className="login-intro">
              <p className="login-eyebrow">Municipal portal / secure access</p>
              <h1 id="login-heading">Sign in to your account</h1>
              <p className="login-description">
                Access city services and operations securely.
              </p>
            </div>

            <LoginForm />
            <DemoAccess />
            <aside
              className="registration-notice"
              aria-labelledby="registration-heading"
            >
              <div className="registration-notice-mark" aria-hidden="true">
                i
              </div>
              <div>
                <h2 id="registration-heading">Need an account?</h2>
                <p>
                  New residents must register in person at the Municipal
                  Operations office. Bring valid identification and proof of
                  residency. Staff will verify your details and issue temporary
                  credentials for your first sign-in.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
