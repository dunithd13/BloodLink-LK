import React, { useState } from "react";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  Droplet,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Sparkles,
  HeartHandshake
} from "lucide-react";
import { SRI_LANKAN_DISTRICTS, BLOOD_GROUPS } from "../data/mockData";
import { validateStrongPassword, validateEmail, validateSriLankanPhone } from "../utils/auth";
import { authApi } from "../services/api";

export default function Register({ users, onRegisterSuccess, setActiveTab }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Donor", // "Donor" or "Requester"
    location: "",
    contactNumber: "",
    bloodGroup: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const errs = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters long.";
    }

    // 2. Email validation
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      errs.email = emailResult.message;
    }

    // 3. Password validation
    const passwordResult = validateStrongPassword(formData.password);
    if (!passwordResult.isValid) {
      errs.password = passwordResult.message;
    }

    // 4. Confirm Password validation
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    // 5. Contact number validation
    const phoneResult = validateSriLankanPhone(formData.contactNumber);
    if (!phoneResult.isValid) {
      errs.contactNumber = phoneResult.message;
    }

    // 6. Location & Blood Group (Required for Donor, recommended for Requester)
    if (formData.role === "Donor" && !formData.location) {
      errs.location = "Please select your district (required for donors).";
    }

    if (formData.role === "Donor" && !formData.bloodGroup) {
      errs.bloodGroup = "Please select your blood group (required for donors).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Connect to backend Auth API (BCrypt hashing performed on server)
      const res = await authApi.register({
        fullName: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        contactNumber: formData.contactNumber.trim(),
        role: formData.role,
        bloodGroup: formData.role === "Donor" ? formData.bloodGroup : (formData.bloodGroup || null),
        location: formData.role === "Donor" ? formData.location : (formData.location || null),
        description: formData.role === "Donor" ? `Voluntary donor located in ${formData.location}` : null
      });

      const newUser = {
        id: res.userId,
        userId: res.userId,
        name: res.fullName,
        fullName: res.fullName,
        email: res.email,
        location: formData.location,
        contactNumber: res.contactNumber,
        bloodGroup: formData.bloodGroup,
        role: res.role,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
      };

      onRegisterSuccess(newUser);
      setSuccessMessage(`Account registered successfully as a ${res.role}! Redirecting to login...`);

      // Redirect to Login page after brief display
      setTimeout(() => {
        setActiveTab("login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ form: err.message || "Failed to create account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: "Nuwan Jayasuriya",
      email: `nuwan.${randomSuffix}@gmail.com`,
      password: "Password@2026!",
      confirmPassword: "Password@2026!",
      role: "Donor",
      location: "Colombo",
      contactNumber: "0779988112",
      bloodGroup: "O+"
    });
    setErrors({});
  };

  return (
    <div style={{ maxWidth: "620px", margin: "1.5rem auto" }}>
      {/* Page Header */}
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
          <UserPlus size={26} />
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
          Create Your Account
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Join BloodLink LK as a voluntary blood donor or community member
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: "1.25rem" }}>
          <CheckCircle2 size={18} />
          <div>{successMessage}</div>
        </div>
      )}

      {/* Form Error Banner */}
      {errors.form && (
        <div className="alert alert-danger" style={{ marginBottom: "1.25rem" }}>
          <AlertCircle size={18} />
          <div>{errors.form}</div>
        </div>
      )}

      {/* Quick Demo Helper */}
      <div
        style={{
          background: "#fff1f2",
          border: "1px dashed #fda4af",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem"
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "#9f1239", fontWeight: 500 }}>
          💡 Testing registration? Prefill valid mock user data:
        </span>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleFillDemo}
          style={{ borderColor: "#fda4af", color: "#e11d48" }}
        >
          <Sparkles size={14} />
          Fill Demo User
        </button>
      </div>

      {/* Registration Card */}
      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Account Role Selection */}
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label className="form-label">
              <HeartHandshake size={14} /> Register Account As <span className="req">*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.35rem" }}>
              <label
                style={{
                  border: formData.role === "Donor" ? "2px solid #e11d48" : "1px solid var(--border-color)",
                  background: formData.role === "Donor" ? "#fff1f2" : "#ffffff",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="Donor"
                  checked={formData.role === "Donor"}
                  onChange={handleChange}
                />
                <div>
                  <div style={{ fontWeight: 700, color: formData.role === "Donor" ? "#e11d48" : "#0f172a" }}>
                    Blood Donor
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Ready to donate blood to patients
                  </div>
                </div>
              </label>

              <label
                style={{
                  border: formData.role === "Requester" ? "2px solid #0284c7" : "1px solid var(--border-color)",
                  background: formData.role === "Requester" ? "#f0f9ff" : "#ffffff",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="Requester"
                  checked={formData.role === "Requester"}
                  onChange={handleChange}
                />
                <div>
                  <div style={{ fontWeight: 700, color: formData.role === "Requester" ? "#0284c7" : "#0f172a" }}>
                    Requester / Patient
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Seeking blood for hospital care
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              <User size={14} /> Full Name <span className="req">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-input ${errors.name ? "is-invalid" : ""}`}
              placeholder="e.g. Kasun Jayawardena"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback">
                <AlertCircle size={13} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <Mail size={14} /> Email Address <span className="req">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? "is-invalid" : ""}`}
              placeholder="e.g. name@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <div className="invalid-feedback">
                <AlertCircle size={13} />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password & Confirm Password in Grid */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <Lock size={14} /> Password <span className="req">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? "is-invalid" : ""}`}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && (
                <div className="invalid-feedback">
                  <AlertCircle size={13} />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                <Lock size={14} /> Confirm Password <span className="req">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? "is-invalid" : ""}`}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  <AlertCircle size={13} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Password requirement instruction hint */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "0.5rem 0.75rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              fontSize: "0.775rem",
              color: "var(--text-muted)"
            }}
          >
            <Info size={14} color="#0284c7" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>Password requirements:</strong> Minimum 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. !@#$%^&*).
            </span>
          </div>

          {/* Location & Contact in Grid */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                <MapPin size={14} /> Location / District <span className="req">*</span>
              </label>
              <select
                id="location"
                name="location"
                className={`form-select ${errors.location ? "is-invalid" : ""}`}
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">-- Select District --</option>
                {SRI_LANKAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist} District
                  </option>
                ))}
              </select>
              {errors.location && (
                <div className="invalid-feedback">
                  <AlertCircle size={13} />
                  {errors.location}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactNumber">
                <Phone size={14} /> Sri Lankan Contact Number <span className="req">*</span>
              </label>
              <input
                id="contactNumber"
                type="tel"
                name="contactNumber"
                className={`form-input ${errors.contactNumber ? "is-invalid" : ""}`}
                placeholder="07XXXXXXXX or +947XXXXXXXX"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber ? (
                <div className="invalid-feedback">
                  <AlertCircle size={13} />
                  {errors.contactNumber}
                </div>
              ) : (
                <span className="form-hint">E.g. 0771234567 or +94712345678</span>
              )}
            </div>
          </div>

          {/* Blood Group */}
          <div className="form-group" style={{ marginBottom: "1.75rem" }}>
            <label className="form-label" htmlFor="bloodGroup">
              <Droplet size={14} /> Blood Group <span className="req">*</span>
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              className={`form-select ${errors.bloodGroup ? "is-invalid" : ""}`}
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">-- Select Your Blood Group --</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  🩸 {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && (
              <div className="invalid-feedback">
                <AlertCircle size={13} />
                {errors.bloodGroup}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginBottom: "1.25rem" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
            <ArrowRight size={18} />
          </button>

          {/* Navigation to Login */}
          <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setActiveTab("login")}
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
              Login Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
