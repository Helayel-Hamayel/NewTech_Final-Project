import { useEffect, useState, type ReactNode } from "react";
import { UserContext, type User } from "./userContextValue";

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreUser() {
      try {
        const response = await fetch("http://localhost:4000/auth/me", {
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
    if (user) {
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok && response.status !== 401) {
        throw new Error("Could not sign out. Please try again.");
      }
    }

    setUser(null);
  }
  const value = { user, saveUser, signOut };
  if (loading) {
    return <p>Loading your session...</p>;
  }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export default UserProvider;
