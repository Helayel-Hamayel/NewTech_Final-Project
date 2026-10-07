import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../contexts/useUser";
import "../../styles/common/Logout.css";
export default function Logout() {
  const navigate = useNavigate();
  const { signOut } = useUser();
  async function handleLogout() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Could not sign out. Please try again.");
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
