import { apiUrl } from "../helpers/apiUrl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { UserContext, type User } from "./userContextValue";
import { toast } from "sonner";

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const restoreController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    restoreController.current = controller;

    async function restoreUser() {
      try {
        const response = await fetch(apiUrl("/auth/me"), {
          credentials: "include",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });

        if (controller.signal.aborted) return;

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load the user");
        }

        const data = await response.json();
        if (!controller.signal.aborted) {
          setUser(data.user);
        }
      } catch {
        if (!controller.signal.aborted) {
          setUser(null);
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
    restoreController.current?.abort();
    setUser(loggedInUser);
    setLoading(false);
  }

  async function signOut() {
    const response = await fetch(apiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not sign out. Please try again.");
    }

    setUser(null);
    toast.success("You’ve been signed out. See you next time!");
  }
  const value = { user, loading, saveUser, signOut };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export default UserProvider;
