import React from "react";
import {
  Droplet,
  HeartHandshake,
  Search,
  PlusCircle,
  Clock,
  ShieldCheck,
  Hospital,
  Users,
  AlertTriangle,
  ArrowRight,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { BloodGroupBadge } from "../components/Badges";

export default function Home({ setActiveTab, requests, donors }) {
  const pendingCount = requests.filter(r => r.Status === "Pending" || r.Status === "In Progress").length;
  const criticalCount = requests.filter(r => r.Urgency === "Critical" && r.Status !== "Fulfilled").length;
  const availableDonorsCount = donors.filter(d => d.Status === "Available").length;

  const compatibilityData = [
    { group: "O-", canGiveTo: "Everyone (Universal Red Cell Donor)", canReceiveFrom: "O-" },
    { group: "O+", canGiveTo: "O+, A+, B+, AB+", canReceiveFrom: "O+, O-" },
    { group: "A-", canGiveTo: "A-, A+, AB-, AB+", canReceiveFrom: "A-, O-" },
    { group: "A+", canGiveTo: "A+, AB+", canReceiveFrom: "A+, A-, O+, O-" },
    { group: "B-", canGiveTo: "B-, B+, AB-, AB+", canReceiveFrom: "B-, O-" },
    { group: "B+", canGiveTo: "B+, AB+", canReceiveFrom: "B+, B-, O+, O-" },
    { group: "AB-", canGiveTo: "AB-, AB+", canReceiveFrom: "AB-, A-, B-, O-" },
    { group: "AB+", canGiveTo: "AB+ Only", canReceiveFrom: "Everyone (Universal Recipient)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 60%, #ffe4e6 100%)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
          border: "1px solid #fecdd3",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "750px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ffffff",
              padding: "0.3rem 0.8rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#e11d48",
              border: "1px solid #fecdd3",
              marginBottom: "1rem"
            }}
          >
            <Droplet size={15} fill="#e11d48" />
            <span>Sri Lanka's Community Blood Lifeline</span>
          </div>

          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#0f172a",
              marginBottom: "1rem"
            }}
          >
            Every Second Counts When Saving A Life In Sri Lanka.
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#475569",
              lineHeight: 1.6,
              marginBottom: "1.75rem"
            }}
          >
            BloodLink LK connects patients, emergency care units, and voluntary blood donors across all 25 districts.
            No more frantic social media searches—find donors and request blood with verified real-time tracking.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <button
              className="btn btn-danger btn-lg"
              onClick={() => setActiveTab("request-blood")}
            >
              <PlusCircle size={20} />
              Request Blood Urgently
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => setActiveTab("find-blood")}
            >
              <Search size={20} />
              Find Donors Near You
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => setActiveTab("requests")}
            >
              Active Requests ({pendingCount})
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics Counters */}
      <div className="grid-4">
        <div className="card" style={{ borderLeft: "4px solid #e11d48" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE BLOOD REQUESTS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
                {pendingCount}
              </div>
            </div>
            <div style={{ background: "#ffe4e6", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <Clock size={24} color="#e11d48" />
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#e11d48", fontWeight: 600, marginTop: "0.5rem" }}>
            {criticalCount} Critical Cases Pending
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>AVAILABLE DONORS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
                {availableDonorsCount}
              </div>
            </div>
            <div style={{ background: "#d1fae5", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <Users size={24} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600, marginTop: "0.5rem" }}>
            Ready to donate across Sri Lanka
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #0284c7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ISLAND-WIDE COVERAGE</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
                25 / 25
              </div>
            </div>
            <div style={{ background: "#e0f2fe", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <MapPin size={24} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600, marginTop: "0.5rem" }}>
            Districts & Teaching Hospitals
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>UNITS COORDINATED</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
                142+
              </div>
            </div>
            <div style={{ background: "#fef3c7", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <HeartHandshake size={24} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#d97706", fontWeight: 600, marginTop: "0.5rem" }}>
            Lives saved and counting
          </div>
        </div>
      </div>

      {/* Sri Lankan Problem & Solution Section */}
      <div className="grid-2">
        <div className="card" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ background: "#fee2e2", padding: "0.5rem", borderRadius: "var(--radius-md)" }}>
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <h2 style={{ fontSize: "1.25rem", color: "#991b1b", margin: 0 }}>The Sri Lankan Challenge</h2>
          </div>
          <p style={{ color: "#7f1d1d", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            In Sri Lanka, during sudden emergency surgeries, road accidents, or severe dengue outbreaks, patient families often scramble to find specific blood groups (especially rare negative groups like <strong>O-</strong>, <strong>A-</strong>, and <strong>B-</strong>).
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: "#991b1b" }}>
            <li>• Requests are scattered across unorganized WhatsApp chats and Facebook groups.</li>
            <li>• No real-time indication of whether a patient's request has already been fulfilled.</li>
            <li>• Regional hospital transfer delays between Colombo and provincial medical centers.</li>
          </ul>
        </div>

        <div className="card" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ background: "#dcfce7", padding: "0.5rem", borderRadius: "var(--radius-md)" }}>
              <ShieldCheck size={22} color="#16a34a" />
            </div>
            <h2 style={{ fontSize: "1.25rem", color: "#166534", margin: 0 }}>The BloodLink LK Solution</h2>
          </div>
          <p style={{ color: "#14532d", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            BloodLink LK acts as a unified digital bridge connecting certified regional hospitals, requesters, and willing donors with pinpoint accuracy.
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: "#166534" }}>
            <li>• Instant search by Blood Group and Sri Lankan District (Colombo, Kandy, Galle, etc.).</li>
            <li>• Direct validation of contact numbers to prevent fake or expired calls.</li>
            <li>• Transparent status tracking (Pending → In Progress → Fulfilled) preventing donor fatigue.</li>
          </ul>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>How BloodLink LK Works</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Simple 3-step workflow built for speed in critical situations
          </p>
        </div>

        <div className="grid-3">
          <div className="card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "#ffe4e6",
                color: "#e11d48",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                fontWeight: 800,
                fontSize: "1.25rem"
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Submit Blood Requirement</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Enter the patient's blood group, required units, hospital, urgency level, and contact details through our validated form.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "#e0f2fe",
                color: "#0284c7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                fontWeight: 800,
                fontSize: "1.25rem"
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Locate Matching Donors</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Search registered donors by district or broadcast the request on the public active requests board for immediate donor response.
            </p>
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "#d1fae5",
                color: "#059669",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                fontWeight: 800,
                fontSize: "1.25rem"
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Track & Fulfill</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Coordinators or requesters update the request status to 'In Progress' or 'Fulfilled' once donation is arranged at the hospital.
            </p>
          </div>
        </div>
      </div>

      {/* Blood Compatibility Guide */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Sri Lanka Blood Compatibility Reference</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Quick reference for emergency medical compatibility
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab("find-blood")}>
            Find Matching Donors <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Blood Group</th>
                <th style={{ padding: "0.75rem 1rem" }}>Can Donate To</th>
                <th style={{ padding: "0.75rem 1rem" }}>Can Receive From</th>
              </tr>
            </thead>
            <tbody>
              {compatibilityData.map((row) => (
                <tr key={row.group} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <BloodGroupBadge group={row.group} />
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>{row.canGiveTo}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--text-muted)" }}>{row.canReceiveFrom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
