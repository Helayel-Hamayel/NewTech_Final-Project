import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "RESIDENT" | "FIELD_GUARD" | "STAFF";
  subscriberHash: string;
};

export type UserContextType = {
  user: User | null;
  loading: boolean;
  saveUser: (user: User) => void;
  signOut: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | null>(null);