"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define user roles
export type UserRole = "Admin" | "Editor" | "Viewer";

// Define the user object structure
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  force_password_change: boolean;
  created_at: string;
  updated_at?: string;
}

// API configuration
import { apiBaseUrl } from '@/lib/config';
const API_BASE_URL = apiBaseUrl;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  forcePasswordChange: boolean;
  setForcePasswordChange: (value: boolean) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem("auth_token");
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setForcePasswordChange(userData.force_password_change || false);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("auth_token");
        setUser(null);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || "Login failed";
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Store the token
      localStorage.setItem("auth_token", data.access_token);

      // Get user data
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        setForcePasswordChange(data.force_password_change || false);

        // Redirect based on whether password change is required
        if (data.force_password_change) {
          router.push("/change-password");
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error("Failed to get user data");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await validateToken(token);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
    forcePasswordChange,
    setForcePasswordChange,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
