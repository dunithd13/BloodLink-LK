import React, { useState } from "react";
import {
  Settings,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Save,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Lock,
  ArrowRight
} from "lucide-react";
import { BloodGroupBadge, UrgencyBadge, StatusBadge } from "../components/Badges";

export default function Management({ currentUser, requests, onUpdateRequestStatus, onResetData, setActiveTab }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentUpdate, setRecentUpdate] = useState(null);

  // Role-Based Access Guard - logged in coordinators / users can manage requests
  const isAuthorized = Boolean(currentUser);

  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: "540px", margin: "3rem auto" }}>
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#fee2e2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem auto"
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#991b1b", marginBottom: "0.5rem" }}>
            Access Restricted: Authentication Required
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            The Request Status Management console requires you to be logged into your BloodLink LK account.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
            <button className="btn btn-primary" onClick={() => setActiveTab("login")}>
              <Lock size={15} />
              Log In
            </button>
            <button className="btn btn-outline" onClick={() => setActiveTab("home")}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Management Counts
  const activeCount = requests.filter((r) => r.Status === "Active" || r.Status === "Pending").length;
  const matchedCount = requests.filter((r) => r.Status === "Matched" || r.Status === "In Progress").length;
  const fulfilledCount = requests.filter((r) => r.Status === "Fulfilled").length;
  const cancelledCount = requests.filter((r) => r.Status === "Cancelled").length;

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await onUpdateRequestStatus(requestId, newStatus);
      const req = requests.find((r) => r.id === requestId);
      setRecentUpdate({
        title: `${req ? req.RequestNumber : "Request"} updated to "${newStatus}"`,
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setRecentUpdate(null), 3500);
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.message || "Failed to update status on server.");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchStatus = filterStatus === "ALL" || r.Status === filterStatus;
    const matchSearch =
      !searchQuery.trim() ||
      r.RequestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.Hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.Location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge" style={{ background: "#fee2e2", color: "#991b1b", fontWeight: 700 }}>
              ● ADMIN PRIVILEGES ACTIVE
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Logged in as: <strong>{currentUser.name}</strong> ({currentUser.email})
            </span>
          </div>
          <h1 className="page-title">
            <Settings size={28} color="#e11d48" />
            Hospital & Coordinator Management Screen
          </h1>
          <p className="page-desc">
            Update request lifecycles (Pending → In Progress → Fulfilled) to coordinate live transfusions across Sri Lankan hospitals.
          </p>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => {
            if (window.confirm("Reset all requests, users, and donors to default Sri Lankan demo data?")) {
              onResetData();
            }
          }}
          title="Reset to fresh demo state"
        >
          <RefreshCw size={14} />
          Reset Demo Data
        </button>
      </div>

      {/* Real-time feedback toast */}
      {recentUpdate && (
        <div className="alert alert-success" style={{ animation: "fadeIn 0.2s ease" }}>
          <CheckCircle2 size={18} color="#059669" />
          <div>
            <strong>Status Updated:</strong> {recentUpdate.title} at {recentUpdate.time}
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE / PENDING</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#b45309" }}>{activeCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Awaiting donor match</div>
        </div>

        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid #0284c7" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>MATCHED / IN PROGRESS</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0369a1" }}>{matchedCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Donor matched / coordinated</div>
        </div>

        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>FULFILLED</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#065f46" }}>{fulfilledCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Transfusion completed</div>
        </div>

        <div className="card" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid #64748b" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL REQUESTS</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>{requests.length}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{cancelledCount} Cancelled</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-bar" style={{ padding: "1rem 1.25rem" }}>
        <div className="filter-row">
          <div style={{ flex: "1 1 240px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by ref #, hospital, patient, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "2.25rem" }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses ({requests.length})</option>
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="In Progress">In Progress ({inProgressCount})</option>
              <option value="Fulfilled">Fulfilled ({fulfilledCount})</option>
              <option value="Cancelled">Cancelled ({cancelledCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Management Table */}
      <div className="card" style={{ padding: "0.5rem 0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Reference / Patient</th>
                <th style={{ padding: "0.85rem 1rem" }}>Blood & Units</th>
                <th style={{ padding: "0.85rem 1rem" }}>Hospital & District</th>
                <th style={{ padding: "0.85rem 1rem" }}>Urgency</th>
                <th style={{ padding: "0.85rem 1rem" }}>Current Status</th>
                <th style={{ padding: "0.85rem 1rem", minWidth: "170px" }}>Update Workflow Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                    No requests found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      transition: "background-color 0.15s"
                    }}
                  >
                    {/* Patient & Ref */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ fontWeight: 700, fontFamily: "monospace", color: "#0f172a", fontSize: "0.85rem" }}>
                        {req.RequestNumber}
                      </div>
                      <div style={{ fontWeight: 600, color: "#334155" }}>{req.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tel: {req.ContactNumber}</div>
                    </td>

                    {/* Blood & Units */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <BloodGroupBadge group={req.BloodGroup} />
                        <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{req.UnitsRequired} Units</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Due: {req.RequiredDate}
                      </div>
                    </td>

                    {/* Hospital & District */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{req.Hospital}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{req.Location} District</div>
                    </td>

                    {/* Urgency */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <UrgencyBadge urgency={req.Urgency} />
                    </td>

                    {/* Current Status */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <StatusBadge status={req.Status} />
                    </td>

                    {/* Quick Update Selector */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <select
                        className="form-select"
                        value={req.Status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        style={{
                          fontSize: "0.85rem",
                          padding: "0.4rem 0.65rem",
                          fontWeight: 600,
                          backgroundColor:
                            req.Status === "Fulfilled"
                              ? "#ecfdf5"
                              : req.Status === "In Progress"
                              ? "#e0f2fe"
                              : req.Status === "Pending"
                              ? "#fffbeb"
                              : "#f1f5f9"
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Matched">Matched</option>
                        <option value="Fulfilled">Fulfilled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
