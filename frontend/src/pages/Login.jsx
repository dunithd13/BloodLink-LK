import React, { useState } from "react";
import { LogIn, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { validateEmail } from "../utils/auth";
import { authApi } from "../services/api";

export default function Login({ users, onLoginSuccess, setActiveTab }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = formData.email.trim();
    const rawPassword = formData.password;

    // 1. Validate empty fields
    if (!trimmedEmail && !rawPassword) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!rawPassword) {
      setErrorMessage("Please enter your password.");
      return;
    }

    // 2. Validate email format
    const emailValidation = validateEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Connect to backend Auth API (verifies password via BCrypt on server)
      const res = await authApi.login({
        email: trimmedEmail,
        password: rawPassword
      });

      const authenticatedUser = {
        id: res.userId,
        userId: res.userId,
        name: res.fullName,
        fullName: res.fullName,
        email: res.email,
        role: res.role,
        contactNumber: res.contactNumber
      };

      setIsLoading(false);
      onLoginSuccess(authenticatedUser);
    } catch (err) {
      console.error("Authentication error:", err);
      setErrorMessage(err.message || "Invalid email or password.");
      setIsLoading(false);
    }
  };

  const handleFillDemo = (role) => {
    if (role === "admin") {
      setFormData({
        email: "admin@bloodlink.lk",
        password: "Admin@BloodLink2026!"
      });
    } else {
      setFormData({
        email: "kasun@gmail.com",
        password: "Donor@1234!"
      });
    }
    setErrorMessage("");
  };

  return (
    <div style={{ maxWidth: "480px", margin: "2rem auto" }}>
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#ffe4e6",
            color: "#e11d48",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}
        >
          <LogIn size={26} />
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
          Welcome Back
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Log in to your BloodLink LK account as a User or Administrator
        </p>
      </div>

      {/* Demo Credentials Quick Fill Box */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px dashed var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Sparkles size={14} color="#e11d48" />
          <span>Demo Evaluation Shortcuts:</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleFillDemo("admin")}
            style={{ fontSize: "0.775rem", padding: "0.35rem 0.65rem" }}
          >
            <ShieldCheck size={13} color="#e11d48" /> Fill Demo Admin
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleFillDemo("user")}
            style={{ fontSize: "0.775rem", padding: "0.35rem 0.65rem" }}
          >
            <UserCheck size={13} color="#059669" /> Fill Demo User
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="card">
        {errorMessage && (
          <div className="alert alert-danger" style={{ marginBottom: "1.25rem" }}>
            <AlertCircle size={18} />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <Mail size={14} /> Email Address <span className="req">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. admin@bloodlink.lk or user@gmail.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" htmlFor="password">
              <Lock size={14} /> Password <span className="req">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginBottom: "1.25rem" }}
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login"}
            <ArrowRight size={18} />
          </button>

          {/* Navigation to Register */}
          <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline"
              }}
            >
              Register Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
