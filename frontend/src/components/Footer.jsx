import React from "react";
import { Droplet, Heart, ShieldCheck, MapPin, Phone } from "lucide-react";

export default function Footer({ setActiveTab }) {
  return (
    <footer className="footer-wrapper">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#e11d48",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff"
                }}
              >
                <Droplet size={16} fill="#ffffff" />
              </div>
              <h3 style={{ margin: 0, fontWeight: 800 }}>BloodLink LK</h3>
            </div>
            <p>
              Sri Lanka's dedicated community blood network. Connecting voluntary blood donors with patients,
              families, and hospitals during urgent surgeries, trauma cases, and routine medical treatments.
            </p>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", color: "#64748b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={15} color="#e11d48" />
                <span>National Blood Transfusion Service, Narahenpita, Colombo 05, Sri Lanka</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Phone size={15} color="#e11d48" />
                <span>Emergency Inquiries: 011-2696078 / Suwaseriya 1990</span>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Access</h4>
            <ul>
              <li><button onClick={() => setActiveTab("home")}>Home & Overview</button></li>
              <li><button onClick={() => setActiveTab("find-blood")}>Find Donors by District</button></li>
              <li><button onClick={() => setActiveTab("request-blood")}>Submit Blood Request</button></li>
              <li><button onClick={() => setActiveTab("requests")}>Active Blood Requests</button></li>
              <li><button onClick={() => setActiveTab("management")}>Coordinator Management</button></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Donor Guidelines</h4>
            <ul style={{ fontSize: "0.85rem", color: "#64748b" }}>
              <li>• Age: 18 - 60 years</li>
              <li>• Minimum Weight: 50 kg</li>
              <li>• Interval: 4 months between donations</li>
              <li>• Hemoglobin level: Above 12.5 g/dL</li>
              <li>• Free from chronic illnesses</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} BloodLink LK. Built for Mini Hackathon. Saving lives across Sri Lanka.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>Made with</span>
            <Heart size={14} color="#e11d48" fill="#e11d48" />
            <span>for Sri Lankan communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
