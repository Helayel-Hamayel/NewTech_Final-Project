import Footer from "../components/common/Footer";
import DemoAccess from "../components/LoginPage/DemoAccess";
import LoginForm from "../components/LoginPage/LoginForm";
import LoginHeader from "../components/LoginPage/LoginHeader";
import "../styles/pages/LoginPage.css";

export default function LoginPage() {
  return (
    <main>
      <div>
        <LoginHeader />

        <section aria-labelledby="login-heading">
          <div>
            <div>
              <p>Municipal Portal</p>
              <h1 id="login-heading">Sign in to your account</h1>
              <p>Access city services and operations securely.</p>
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
