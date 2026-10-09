import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "RESIDENT" | "FIELD_GUARD" | "STAFF";
  isDemo?: boolean;
};

export type UserContextType = {
  user: User | null;
  saveUser: (user: User) => void;
  signOut: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | null>(null);
