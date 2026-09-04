import React, { useState } from "react";
import {
  Droplet,
  Search,
  PlusCircle,
  ListFilter,
  Settings,
  Menu,
  X,
  PhoneCall,
  LogIn,
  UserPlus,
  LogOut,
  User,
  ShieldCheck
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Base navigation items available to all
  const navItems = [
    { id: "home", label: "Home", icon: Droplet },
    { id: "find-blood", label: "Find Blood", icon: Search },
    { id: "request-blood", label: "Request Blood", icon: PlusCircle },
    { id: "requests", label: "Active Requests", icon: ListFilter },
  ];

  // Role-specific navigation tabs
  if (currentUser) {
    navItems.push({ id: "user-dashboard", label: "My Dashboard", icon: User });
    navItems.push({ id: "management", label: "Management", icon: Settings });
  }

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoutClick = () => {
    onLogout();
    setMobileMenuOpen(false);
    setActiveTab("home");
  };

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        <div className="brand-logo" onClick={() => handleNavClick("home")}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e11d48, #9f1239)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff"
            }}
          >
            <Droplet size={20} fill="#ffffff" />
          </div>
          <div>
            <span style={{ color: "#0f172a", fontWeight: 800 }}>BLOODLINK</span>{" "}
            <span style={{ color: "#e11d48", fontWeight: 800 }}>LK</span>
          </div>
          <span className="brand-badge">Sri Lanka</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}

          {/* User Status / Auth Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "0.5rem", paddingLeft: "0.75rem", borderLeft: "1px solid var(--border-color)" }}>
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: currentUser.role === "ADMIN" ? "#fee2e2" : "#ecfdf5",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: currentUser.role === "ADMIN" ? "#991b1b" : "#065f46"
                  }}
                  title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                >
                  {currentUser.role === "ADMIN" ? <ShieldCheck size={14} /> : <User size={14} />}
                  <span>{currentUser.name.split(" ")[0]}</span>
                  <span style={{ opacity: 0.75 }}>({currentUser.role})</span>
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleLogoutClick}
                  title="Log out of account"
                  style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  className={`btn btn-outline btn-sm ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => handleNavClick("login")}
                >
                  <LogIn size={14} />
                  <span>Login</span>
                </button>
                <button
                  className={`btn btn-primary btn-sm ${activeTab === "register" ? "active" : ""}`}
                  onClick={() => handleNavClick("register")}
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          aria-label="Toggle mobile menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
        {/* Auth Info on Mobile */}
        {currentUser ? (
          <div style={{ padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "var(--radius-md)", marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>{currentUser.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Role: <strong style={{ color: currentUser.role === "ADMIN" ? "#e11d48" : "#10b981" }}>{currentUser.role}</strong> ({currentUser.email})
            </div>
          </div>
        ) : null}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-link ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        {/* Mobile Auth Actions */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {currentUser ? (
            <button className="mobile-nav-link" onClick={handleLogoutClick} style={{ color: "#e11d48" }}>
              <LogOut size={18} />
              Logout ({currentUser.name})
            </button>
          ) : (
            <>
              <button
                className={`mobile-nav-link ${activeTab === "login" ? "active" : ""}`}
                onClick={() => handleNavClick("login")}
              >
                <LogIn size={18} />
                Login
              </button>
              <button
                className={`mobile-nav-link ${activeTab === "register" ? "active" : ""}`}
                onClick={() => handleNavClick("register")}
              >
                <UserPlus size={18} />
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
