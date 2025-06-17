import { ReactNode } from "react";

export type AppUser = {
  id: string;
  email: string;
  username: string;
  role: "super_admin" | "cafe_owner" | "public";
  cafeId?: string;
};

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
