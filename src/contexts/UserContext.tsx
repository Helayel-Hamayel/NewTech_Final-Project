import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "RESIDENT" | "FIELD_GUARD" | "STAFF";
};
type UserContextType = {
  user: User | null;
  saveUser: (user: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | null>(null);
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

  function clearUser() {
    setUser(null);
  }
  const value = { user, saveUser, clearUser };
  if (loading) {
    return <p>Loading your session...</p>;
  }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
export default UserProvider;
