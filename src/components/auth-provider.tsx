"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define user roles
export type UserRole = "Admin" | "Editor" | "Viewer";

// Define the user object structure
export interface User {
  username: string;
  email: string;
  role: UserRole;
}

// Mock user database
const users: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin",
    user: { username: "Admin", email: "admin@dynamix.co", role: "Admin" },
  },
  editor: {
    password: "editor",
    user: { username: "Editor", email: "editor@dynamix.co", role: "Editor" },
  },
  viewer: {
    password: "viewer",
    user: { username: "Viewer", email: "viewer@dynamix.co", role: "Viewer" },
  },
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<void> => {
    const userData = users[username.toLowerCase()];
    if (userData && userData.password === pass) {
      localStorage.setItem("user", JSON.stringify(userData.user));
      setUser(userData.user);
      router.push("/dashboard");
    } else {
      throw new Error("Invalid username or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const value = { isAuthenticated: !!user, user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
