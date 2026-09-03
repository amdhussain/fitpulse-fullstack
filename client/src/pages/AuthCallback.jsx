import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      setStatus(`Authentication failed: ${decodeURIComponent(error)}`);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        setStatus("Success! Redirecting...");
        setTimeout(() => navigate("/", { replace: true }), 500);
      } catch {
        setStatus("Failed to process authentication data.");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      }
    } else if (token) {
      localStorage.setItem("token", token);
      setStatus("Verifying session...");
      fetch(`${import.meta.env.API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.data) {
            localStorage.setItem("user", JSON.stringify(result.data));
            setUser(result.data);
            setStatus("Success! Redirecting...");
            setTimeout(() => navigate("/", { replace: true }), 500);
          } else {
            throw new Error("Invalid session");
          }
        })
        .catch(() => {
          setStatus("Failed to verify session.");
          setTimeout(() => navigate("/login", { replace: true }), 3000);
        });
    } else {
      setStatus("No authentication data received.");
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center space-y-4 p-8">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-white/60 text-sm">{status}</p>
      </div>
    </div>
  );
}
