"use client";


import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, AuthResponse } from "@/types";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: AuthResponse, message?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data.data);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (data: AuthResponse, message?: string) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success(message || "Login successful!");
    
    // Use a small timeout to ensure state is updated before redirect
    setTimeout(() => {
      if (data.user.role === "STUDENT") {
        router.push("/dashboard/student");
      } else if (data.user.role === "TUTOR") {
        router.push("/dashboard/tutor");
      } else if (data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
