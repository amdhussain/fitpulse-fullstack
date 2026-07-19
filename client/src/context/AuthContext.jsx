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
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
    },
    []
  );

  const register = useCallback(
    async ({ firstName, lastName, email, password, passwordConfirm }) => {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, passwordConfirm }),
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
    },
    []
  );

  const logout = useCallback(async () => {
    setUser(null);
    clearAuthStorage();
    navigate("/login", { replace: true });

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Server-side session cleanup is best-effort
    }
  }, [navigate]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
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
