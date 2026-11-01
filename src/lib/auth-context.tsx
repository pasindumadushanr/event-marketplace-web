"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import api from "./api";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleName?: string;
  profileImage?: string;
  phone?: string;
  authProvider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Basic initialization: parse JWT payload to get user info if we don't fetch full user
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const expired = (event: Event) => {
      setUser(null);
      toast.error(
        "Your session ended. Please sign in again. Your saved business details are safe.",
      );
      const role = (event as CustomEvent).detail?.role;
      router.push(
        ["ADMIN", "SUPER_ADMIN"].includes(role)
          ? "/admin/login"
          : role === "VENDOR"
            ? "/vendor/login"
            : "/login",
      );
    };
    window.addEventListener("nakathata:session-expired", expired);
    return () =>
      window.removeEventListener("nakathata:session-expired", expired);
  }, [router]);

  const login = useCallback(
    (accessToken: string, refreshToken: string, userData: any) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Intelligent Routing based on Role
      if (
        userData.roleName === "SUPER_ADMIN" ||
        userData.roleName === "ADMIN"
      ) {
        router.push("/admin");
      } else if (userData.roleName === "VENDOR") {
        router.push("/vendor");
      } else {
        router.push("/account"); // default fallback if dashboard doesn't exist for customer
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (token)
      void api
        .post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .catch(() => {});
    const wasAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.roleName || "");
    const wasVendor =
      user?.roleName === "VENDOR" || (user as any)?.role?.name === "VENDOR";
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    if (wasAdmin) {
      router.push("/admin/login");
    } else if (wasVendor) {
      router.push("/vendor/login");
    } else {
      router.push("/login");
    }
  }, [router, user]);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
