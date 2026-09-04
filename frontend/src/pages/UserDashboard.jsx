import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  PlusCircle,
  Search,
  ListFilter,
  CheckCircle2,
  XCircle,
  Heart,
  Calendar,
  Shield,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { BloodGroupBadge } from "../components/Badges";
import { donorsApi } from "../services/api";

export default function UserDashboard({ currentUser, requests, donors = [], onRefreshDonors, setActiveTab }) {
  const [isUpdatingDonor, setIsUpdatingDonor] = useState(false);

  if (!currentUser) {
    return (
      <div className="card empty-state" style={{ maxWidth: "500px", margin: "3rem auto" }}>
        <User className="empty-state-icon" />
        <h3>Session Expired</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Please log in to view your user dashboard.
        </p>
        <button className="btn btn-primary" onClick={() => setActiveTab("login")}>
          Go to Login
        </button>
      </div>
    );
  }

  const isDonor = currentUser.role === "Donor" || currentUser.role === "USER";
  const userDonorProfile = donors.find(
    (d) => d.userId === currentUser.id || d.userId === currentUser.userId || d.ContactNumber === currentUser.contactNumber
  );

  const handleToggleAvailability = async () => {
    if (!userDonorProfile) return;
    setIsUpdatingDonor(true);
    try {
      await donorsApi.updateAvailability(userDonorProfile.id, !userDonorProfile.isAvailable);
      if (onRefreshDonors) {
        await onRefreshDonors();
      }
    } catch (err) {
      console.error("Failed to update availability:", err);
      alert(err.message || "Failed to update availability on backend.");
    } finally {
      setIsUpdatingDonor(false);
    }
  };

  // Filter requests submitted by or matching the user's email / contact
  const userRequests = requests.filter(
    (r) =>
      r.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
      r.ContactNumber === currentUser.contactNumber ||
      r.requesterName?.toLowerCase() === currentUser.name?.toLowerCase()
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 70%, #ffe4e6 100%)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          border: "1px solid #fecdd3",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span
              className="badge"
              style={{
                background: isDonor ? "#dcfce7" : "#e0f2fe",
                color: isDonor ? "#166534" : "#0369a1",
                fontWeight: 700
              }}
            >
              ● Active Member
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Role: <strong style={{ color: "#0f172a" }}>{currentUser.role}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem 0" }}>
            Ayubowan, {currentUser.name}!
          </h1>
          <p style={{ color: "#475569", fontSize: "0.95rem", margin: 0 }}>
            {isDonor
              ? "Welcome to your BloodLink LK member dashboard. You are registered as an active community blood donor."
              : "Welcome to your BloodLink LK member dashboard. You can create and track blood requests for hospital care."}
          </p>
        </div>

        {currentUser.bloodGroup ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>YOUR BLOOD GROUP</div>
              <div style={{ marginTop: "0.25rem" }}>
                <BloodGroupBadge group={currentUser.bloodGroup} size="lg" />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Profile & Info Cards */}
      <div className="grid-3">
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <User size={18} color="#e11d48" />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>Member Profile</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Full Name:</span>
              <strong style={{ color: "#0f172a" }}>{currentUser.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Email:</span>
              <span style={{ fontWeight: 500 }}>{currentUser.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Contact:</span>
              <span style={{ fontWeight: 600 }}>{currentUser.contactNumber}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.2rem" }}>
              <span style={{ color: "var(--text-muted)" }}>District:</span>
              <strong style={{ color: "#0f172a" }}>{currentUser.location || "Sri Lanka"}</strong>
            </div>
          </div>
        </div>

        {/* Donor Readiness Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Heart size={18} color="#10b981" />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
              {isDonor ? "Donor Availability" : "Requester Status"}
            </h3>
          </div>
          {isDonor ? (
            <div>
              <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                Your donor availability status in the <strong>{currentUser.location || "Sri Lanka"}</strong> region:
              </p>
              <div
                style={{
                  background: userDonorProfile?.isAvailable !== false ? "#ecfdf5" : "#fef2f2",
                  border: userDonorProfile?.isAvailable !== false ? "1px solid #a7f3d0" : "1px solid #fecaca",
                  borderRadius: "var(--radius-md)",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.825rem",
                  color: userDonorProfile?.isAvailable !== false ? "#065f46" : "#991b1b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {userDonorProfile?.isAvailable !== false ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{userDonorProfile?.isAvailable !== false ? "Listed as Available" : "Temporarily Unavailable"}</span>
                </div>
                {userDonorProfile && (
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={isUpdatingDonor}
                    onClick={handleToggleAvailability}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    {isUpdatingDonor ? "Saving..." : userDonorProfile.isAvailable ? "Set Inactive" : "Set Active"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                You are registered as a <strong>Requester</strong>. You can post emergency and scheduled blood requirements directly.
              </p>
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "var(--radius-md)",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.825rem",
                  color: "#1e40af",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <CheckCircle2 size={16} />
                <span>Authorized to publish hospital blood requests</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Shield size={18} color="#0284c7" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>Quick Actions</h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Need blood for a family member or surgery? Submit an urgent requirement immediately:
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button className="btn btn-danger btn-sm" onClick={() => setActiveTab("request-blood")}>
              <PlusCircle size={15} /> Submit Blood Request
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab("find-blood")}>
              <Search size={15} /> Find Matching Donors
            </button>
          </div>
        </div>
      </div>

      {/* User's Requests Section */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
              Your Submitted Blood Requests ({userRequests.length})
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Track real-time hospital fulfillment status of requests created by your account
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab("requests")}>
            <ListFilter size={14} /> View All Active Requests
          </button>
        </div>

        {userRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem", background: "#f8fafc", borderRadius: "var(--radius-md)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
              You have not submitted any blood requirements yet.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("request-blood")}>
              <PlusCircle size={14} /> Create Your First Blood Request
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {userRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}>
                      {req.RequestNumber}
                    </span>
                    <strong style={{ fontSize: "0.95rem" }}>{req.Hospital}</strong>
                  </div>
                  <div style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                    {req.UnitsRequired} Units of <strong>{req.BloodGroup}</strong> Needed by {req.RequiredDate}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    className="badge"
                    style={{
                      background:
                        req.Status === "Fulfilled"
                          ? "#d1fae5"
                          : req.Status === "In Progress"
                          ? "#e0f2fe"
                          : "#fef3c7",
                      color:
                        req.Status === "Fulfilled"
                          ? "#065f46"
                          : req.Status === "In Progress"
                          ? "#0369a1"
                          : "#b45309"
                    }}
                  >
                    Status: {req.Status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
