import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Phone,
  Calendar,
  Filter,
  Users,
  Award,
  Share2,
  Check,
  RefreshCw
} from "lucide-react";
import { BloodGroupBadge, StatusBadge } from "../components/Badges";
import { SRI_LANKAN_DISTRICTS, BLOOD_GROUPS } from "../data/mockData";

export default function FindBlood({ donors, onRefreshDonors }) {
  const [selectedGroup, setSelectedGroup] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefreshDonors) {
      setIsRefreshing(true);
      await onRefreshDonors();
      setIsRefreshing(false);
    }
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchGroup = selectedGroup === "ALL" || donor.BloodGroup === selectedGroup;
      const matchDistrict = selectedDistrict === "ALL" || donor.Location.toLowerCase() === selectedDistrict.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.Location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.ContactNumber.includes(searchQuery);

      return matchGroup && matchDistrict && matchQuery;
    });
  }, [donors, selectedGroup, selectedDistrict, searchQuery]);

  const handleCopyPhone = (donor) => {
    navigator.clipboard.writeText(donor.ContactNumber);
    setCopiedId(donor.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetFilters = () => {
    setSelectedGroup("ALL");
    setSelectedDistrict("ALL");
    setSearchQuery("");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Search size={28} color="#e11d48" />
          Find Available Blood Donors
        </h1>
        <p className="page-desc">
          Search willing voluntary blood donors across Sri Lanka by blood group and district for immediate hospital coordination.
        </p>
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

        {/* District Filter & Text Search */}
        <div className="filter-row">
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search donor name or contact..."
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
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="ALL">All 25 Districts</option>
              {SRI_LANKAN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist} District
                </option>
              ))}
            </select>
          </div>

          {(selectedGroup !== "ALL" || selectedDistrict !== "ALL" || searchQuery) && (
            <button className="btn btn-outline btn-sm" onClick={handleResetFilters}>
              <RefreshCw size={14} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>
          Showing <span style={{ color: "var(--text-main)", fontWeight: 700 }}>{filteredDonors.length}</span> donor availability {filteredDonors.length === 1 ? "record" : "records"}
        </div>
        <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 600 }}>
          ● Verified contact numbers
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="empty-state">
          <Users className="empty-state-icon" />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>No matching donors found</h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "450px", margin: "0 auto 1.5rem auto", fontSize: "0.95rem" }}>
            No donors matched the selected blood group <strong>({selectedGroup})</strong> or district <strong>({selectedDistrict})</strong>.
            Try adjusting your search criteria or submit a blood request directly.
          </p>
          <button className="btn btn-primary" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredDonors.map((donor) => {
            const isAvailable = donor.Status === "Available";
            return (
              <div
                key={donor.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                <div>
                  {/* Top row: Name & Blood Group */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{donor.name}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                        <MapPin size={14} color="#e11d48" />
                        <span>{donor.Location} District</span>
                      </div>
                    </div>
                    <BloodGroupBadge group={donor.BloodGroup} size="lg" />
                  </div>

                  {/* Donor Info List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.75rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", margin: "0.75rem 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={14} /> Available from:
                      </span>
                      <span style={{ fontWeight: 600 }}>{donor.AvailableDate}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Award size={14} /> Lifetime Donations:
                      </span>
                      <span style={{ fontWeight: 600, color: "#e11d48" }}>{donor.totalDonations || 1} times</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>Availability Status:</span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: isAvailable ? "#dcfce7" : "#f1f5f9",
                          color: isAvailable ? "#166534" : "#64748b"
                        }}
                      >
                        {donor.Status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <a
                    href={`tel:${donor.ContactNumber}`}
                    className="btn btn-primary"
                    style={{ flex: 1, textDecoration: "none", fontSize: "0.875rem" }}
                  >
                    <Phone size={15} />
                    Call {donor.ContactNumber}
                  </a>
                  <button
                    className="btn btn-outline"
                    title="Copy Phone Number"
                    onClick={() => handleCopyPhone(donor)}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    {copiedId === donor.id ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
