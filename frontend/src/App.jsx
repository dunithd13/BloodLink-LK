import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FindBlood from "./pages/FindBlood";
import RequestBlood from "./pages/RequestBlood";
import BloodRequests from "./pages/BloodRequests";
import Management from "./pages/Management";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import {
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
  INITIAL_REQUESTS,
  INITIAL_DONORS
} from "./data/mockData";
import { requestsApi, donorsApi } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [requests, setRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [_isLoadingData, setIsLoadingData] = useState(true);
  const [serverError, setServerError] = useState(null);

  // Load requests from backend
  const loadRequests = useCallback(async () => {
    try {
      const data = await requestsApi.getAll();
      setRequests(data);
      setServerError(null);
    } catch (err) {
      console.warn("Could not load requests from backend, using cached/sample fallback:", err);
      setRequests(INITIAL_REQUESTS);
      setServerError(err.message);
    }
  }, []);

  // Load donors from backend
  const loadDonors = useCallback(async () => {
    try {
      const data = await donorsApi.getAll();
      setDonors(data);
    } catch (err) {
      console.warn("Could not load donors from backend, using cached/sample fallback:", err);
      setDonors(INITIAL_DONORS);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      await Promise.all([loadRequests(), loadDonors()]);
      setIsLoadingData(false);
    };
    fetchData();
  }, [loadRequests, loadDonors]);

  // Save session on auth change
  useEffect(() => {
    saveStoredSession(currentUser);
  }, [currentUser]);

  // Request creation
  const handleAddRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    loadRequests();
  };

  // Status update
  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    await requestsApi.updateStatus(requestId, newStatus);
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, Status: newStatus, status: newStatus } : req
      )
    );
    loadRequests();
  };

  // Auth: Login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "ADMIN") {
      setActiveTab("management");
    } else {
      setActiveTab("user-dashboard");
    }
  };

  // Auth: Logout
  const handleLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setActiveTab("home");
  };

  // Auth: Registration
  const handleRegisterSuccess = (_newUser) => {
    loadDonors();
  };

  // Reset demo data - re-fetches live backend records
  const handleResetData = async () => {
    await Promise.all([loadRequests(), loadDonors()]);
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {serverError && (
          <div className="alert alert-warning" style={{ margin: "0 0 1.5rem 0", fontSize: "0.875rem" }}>
            <span>⚠️ Backend connection notice: {serverError} (Showing cached/fallback view)</span>
          </div>
        )}

        {activeTab === "home" && (
          <Home
            setActiveTab={setActiveTab}
            requests={requests}
            donors={donors}
          />
        )}

        {activeTab === "find-blood" && (
          <FindBlood
            donors={donors}
            onRefreshDonors={loadDonors}
          />
        )}

        {activeTab === "request-blood" && (
          <RequestBlood
            onAddRequest={handleAddRequest}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "requests" && (
          <BloodRequests
            requests={requests}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "management" && (
          <Management
            currentUser={currentUser}
            requests={requests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onResetData={handleResetData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "login" && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "register" && (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "user-dashboard" && (
          <UserDashboard
            currentUser={currentUser}
            requests={requests}
            donors={donors}
            onRefreshDonors={loadDonors}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
