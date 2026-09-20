import { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import DemoAccess from "../components/LoginPage/DemoAccess";
import LoginForm from "../components/LoginPage/LoginForm";
import LoginHeader from "../components/LoginPage/LoginHeader";
import loginBackgroundOne from "../assets/background/Login_Background (1).jpg";
import loginBackgroundTwo from "../assets/background/Login_Background (2).jpg";
import loginBackgroundThree from "../assets/background/Login_Background (3).jpg";
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
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
