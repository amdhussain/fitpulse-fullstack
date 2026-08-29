import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const API_URL = import.meta.env.API_URL;

function clearAuthStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/v1/health`, { method: "GET" }).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (stored && token) {
        setUser(JSON.parse(stored));
      }
    } catch {
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Login failed");
        }

        const { user: userData, token } = result.data;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
        return userData;
      } catch (err) {
        if (err.name === "AbortError") {
          throw new Error("Request timed out. The server may be starting up. Please try again.");
        }
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          throw new Error("Cannot reach the server. It may be waking up — please try again in a moment.");
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    []
  );

  const register = useCallback(
    async ({ firstName, lastName, email, password, passwordConfirm }) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password, passwordConfirm }),
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Registration failed");
        }

        const { user: userData, token } = result.data;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
        return userData;
      } catch (err) {
        if (err.name === "AbortError") {
          throw new Error("Request timed out. Please check your connection and try again.");
        }
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          throw new Error("Cannot reach the server. It may be waking up — please try again in a moment.");
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    const token = localStorage.getItem("token");
    setUser(null);
    clearAuthStorage();
    navigate("/login", { replace: true });

    if (token) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Server-side session cleanup is best-effort
      }
    }
  }, [navigate]);

  const updateUser = useCallback(
    (updatedData) => {
      const newUserData = { ...user, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    },
    [user]
  );

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const isMember = user?.role?.toUpperCase() === "MEMBER";
  const isTrainer = user?.role?.toUpperCase() === "TRAINER";

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isMember,
    isTrainer,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
