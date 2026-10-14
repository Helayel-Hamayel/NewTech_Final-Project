import { useEffect, useState, type ReactNode } from "react";
import { UserContext, type User } from "./userContextValue";
import { toast } from "sonner";

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load the user");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Could not restore the session:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    restoreUser();

    return () => controller.abort();
  }, []);

  function saveUser(loggedInUser: User) {
    setUser(loggedInUser);
  }

  async function signOut() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not sign out. Please try again.");
    }

    setUser(null);
    toast.success("You’ve been signed out. See you next time!");
  }
  const value = { user, saveUser, signOut };
  if (loading) {
    return (
      <main className="session-loader" role="status" aria-live="polite">
        <span className="session-loader-spinner" aria-hidden="true" />
        <strong>CivicHub</strong>
        <p>Loading your session...</p>
      </main>
    );
  }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export default UserProvider;
