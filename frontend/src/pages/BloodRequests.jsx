import React, { useState, useMemo } from "react";
import {
  ListFilter,
  Search,
  MapPin,
  Hospital,
  Phone,
  Calendar,
  Clock,
  Heart,
  Share2,
  Check,
  Filter,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { BloodGroupBadge, UrgencyBadge, StatusBadge } from "../components/Badges";
import { SRI_LANKAN_DISTRICTS, BLOOD_GROUPS } from "../data/mockData";
import { requestsApi } from "../services/api";

export default function BloodRequests({ requests, setActiveTab }) {
  const [selectedUrgency, setSelectedUrgency] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedGroup, setSelectedGroup] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Compatible donors modal state
  const [activeModalRequest, setActiveModalRequest] = useState(null);
  const [compatibleData, setCompatibleData] = useState(null);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [isAllLocations, setIsAllLocations] = useState(false);

  const handleViewCompatibleDonors = async (req) => {
    setActiveModalRequest(req);
    setIsAllLocations(false);
    setLoadingDonors(true);
    try {
      const data = await requestsApi.getCompatibleDonors(req.id);
      setCompatibleData(data);
    } catch (err) {
      console.error("Failed to fetch compatible donors:", err);
      setCompatibleData({ request: req, compatibleBloodGroups: [], donors: [] });
    } finally {
      setLoadingDonors(false);
    }
  };

  const handleToggleAllLocations = async (req) => {
    const nextAllLocations = !isAllLocations;
    setIsAllLocations(nextAllLocations);
    setLoadingDonors(true);
    try {
      const data = nextAllLocations
        ? await requestsApi.getCompatibleDonorsAllLocations(req.id)
        : await requestsApi.getCompatibleDonors(req.id);
      setCompatibleData(data);
    } catch (err) {
      console.error("Failed to fetch compatible donors:", err);
    } finally {
      setLoadingDonors(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchUrgency = selectedUrgency === "ALL" || req.Urgency === selectedUrgency;
      const matchStatus = selectedStatus === "ALL" || req.Status === selectedStatus;
      const matchGroup = selectedGroup === "ALL" || req.BloodGroup === selectedGroup;
      const matchDistrict = selectedDistrict === "ALL" || req.Location.toLowerCase() === selectedDistrict.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        req.RequestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.Hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.Location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchUrgency && matchStatus && matchGroup && matchDistrict && matchQuery;
    });
  }, [requests, selectedUrgency, selectedStatus, selectedGroup, selectedDistrict, searchQuery]);

  const handleCopy = (req) => {
    const text = `URGENT BLOOD REQUEST: ${req.BloodGroup} (${req.UnitsRequired} Units) needed at ${req.Hospital}, ${req.Location}. Contact: ${req.ContactNumber} (${req.name}). Ref: ${req.RequestNumber}`;
    navigator.clipboard.writeText(text);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetFilters = () => {
    setSelectedUrgency("ALL");
    setSelectedStatus("ALL");
    setSelectedGroup("ALL");
    setSelectedDistrict("ALL");
    setSearchQuery("");
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">
            <ListFilter size={28} color="#e11d48" />
            Active Blood Requests
          </h1>
          <p className="page-desc">
            Live emergency and routine blood requirements from Sri Lankan hospitals. Donors can reach out directly to save lives.
          </p>
        </div>
        <button className="btn btn-danger" onClick={() => setActiveTab("request-blood")}>
          <PlusCircle size={18} />
          New Blood Request
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Blood Group Chips */}
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
            Filter by Blood Group:
          </label>
          <div className="blood-chip-group">
            <button
              className={`blood-chip ${selectedGroup === "ALL" ? "active" : ""}`}
              onClick={() => setSelectedGroup("ALL")}
            >
              All Blood Groups
            </button>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                className={`blood-chip ${selectedGroup === bg ? "active" : ""}`}
                onClick={() => setSelectedGroup(bg)}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns & Text Search */}
        <div className="filter-row">
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search hospital, patient, or ref code..."
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

          <div style={{ flex: "1 1 140px" }}>
            <select
              className="form-select"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="ALL">All Urgency Levels</option>
              <option value="Critical">🔴 Critical Only</option>
              <option value="Urgent">🟠 Urgent Only</option>
              <option value="Routine">🔵 Routine Only</option>
            </select>
          </div>

          <div style={{ flex: "1 1 140px" }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Fulfilled">Fulfilled</option>
            </select>
          </div>

          <div style={{ flex: "1 1 140px" }}>
            <select
              className="form-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="ALL">All Districts</option>
              {SRI_LANKAN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {(selectedUrgency !== "ALL" || selectedStatus !== "ALL" || selectedGroup !== "ALL" || selectedDistrict !== "ALL" || searchQuery) && (
            <button className="btn btn-outline btn-sm" onClick={handleResetFilters}>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>
          Showing <span style={{ color: "var(--text-main)", fontWeight: 700 }}>{filteredRequests.length}</span> blood {filteredRequests.length === 1 ? "request" : "requests"}
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <AlertCircle className="empty-state-icon" />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>No matching blood requests</h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "450px", margin: "0 auto 1.5rem auto", fontSize: "0.95rem" }}>
            No blood requests matched your search criteria. Try removing or adjusting filters.
          </p>
          <button className="btn btn-primary" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: req.Urgency === "Critical" ? "4px solid #ef4444" : req.Urgency === "Urgent" ? "4px solid #f59e0b" : "4px solid #0284c7"
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontFamily: "monospace", fontWeight: 700, color: "var(--text-muted)", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)" }}>
                      {req.RequestNumber}
                    </span>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "0.4rem", color: "#0f172a" }}>
                      {req.Hospital}
                    </h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                    <BloodGroupBadge group={req.BloodGroup} size="lg" />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e11d48" }}>
                      {req.UnitsRequired} {req.UnitsRequired === 1 ? "Unit" : "Units"} Required
                    </span>
                  </div>
                </div>

                {/* Urgency and Status Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
                  <UrgencyBadge urgency={req.Urgency} />
                  <StatusBadge status={req.Status} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginLeft: "auto" }}>
                    Posted: {req.CreatedAt}
                  </span>
                </div>

                {/* Patient & Location Details */}
                <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Patient / Contact:</span>
                    <span style={{ fontWeight: 600 }}>{req.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>District:</span>
                    <span style={{ fontWeight: 600 }}>{req.Location} District</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Needed By:</span>
                    <span style={{ fontWeight: 600, color: "#b91c1c" }}>{req.RequiredDate}</span>
                  </div>
                </div>

                {/* Clinical Notes / Description */}
                {req.Description && (
                  <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "1.25rem", fontStyle: "italic" }}>
                    "{req.Description}"
                  </p>
                )}
              </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <a
                      href={`tel:${req.ContactNumber}`}
                      className="btn btn-primary"
                      style={{ flex: 1, textDecoration: "none", fontSize: "0.875rem", justifyContent: "center" }}
                    >
                      <Phone size={15} />
                      Call: {req.ContactNumber}
                    </a>
                    <button
                      className="btn btn-outline"
                      title="Copy Request Share Text"
                      onClick={() => handleCopy(req)}
                      style={{ padding: "0.5rem 0.75rem" }}
                    >
                      {copiedId === req.id ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
                    </button>
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%", justifyContent: "center", color: "#e11d48", borderColor: "#fecdd3", background: "#fff1f2" }}
                    onClick={() => handleViewCompatibleDonors(req)}
                  >
                    <Heart size={14} /> View Compatible Donors ({req.BloodGroup})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compatible Donors Modal */}
      {activeModalRequest && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={() => setActiveModalRequest(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Compatible Donors for {activeModalRequest.BloodGroup}
                </h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Request Ref: <strong>{activeModalRequest.RequestNumber}</strong> • Location: <strong>{activeModalRequest.Location}</strong>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setActiveModalRequest(null)}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                ✕
              </button>
            </div>

            {loadingDonors ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>Loading matching donors from backend...</p>
              </div>
            ) : compatibleData ? (
              <div>
                {/* Compatible blood types badge row */}
                <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.35rem" }}>
                    MEDICALLY COMPATIBLE DONOR GROUPS:
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {compatibleData.compatibleBloodGroups?.map((g) => (
                      <span key={g} className="badge badge-blood">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Available Donors Found: <span style={{ color: "#e11d48" }}>{compatibleData.donors?.length || 0}</span>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleToggleAllLocations(activeModalRequest)}
                  >
                    {isAllLocations ? "Show Local Only" : "Expand to All Locations"}
                  </button>
                </div>

                {compatibleData.donors?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "var(--radius-md)" }}>
                    <p style={{ color: "var(--text-muted)", margin: "0 0 1rem 0" }}>
                      No available donors found {isAllLocations ? "island-wide" : `in ${activeModalRequest.Location}`}.
                    </p>
                    {!isAllLocations && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleToggleAllLocations(activeModalRequest)}
                      >
                        Search All 25 Districts
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {compatibleData.donors?.map((d) => (
                      <div
                        key={d.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-md)",
                          padding: "0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <strong style={{ fontSize: "0.95rem" }}>{d.name}</strong>
                            <BloodGroupBadge group={d.BloodGroup} />
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                            📍 {d.Location} District • Tel: <strong>{d.ContactNumber}</strong>
                          </div>
                        </div>

                        <a
                          href={`tel:${d.ContactNumber}`}
                          className="btn btn-primary btn-sm"
                          style={{ textDecoration: "none" }}
                        >
                          <Phone size={13} /> Call
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
