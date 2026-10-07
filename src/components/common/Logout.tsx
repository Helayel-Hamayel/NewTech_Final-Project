import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/common/Logout.css";
export default function Logout() {
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logging out is not available");
      }

      navigate("/", { replace: true });
    } catch {
      alert("There was An error with Logging out, please try again Later");
    }
  }
  return (
    <>
      <button className="logout-button" type="button" onClick={handleLogout}>
        <LogOut size={23} />
        Log-out
      </button>
    </>
  );
}
