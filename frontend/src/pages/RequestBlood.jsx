import React, { useState } from "react";
import {
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Droplet,
  FileText,
  User,
  Mail,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { SRI_LANKAN_DISTRICTS, MAJOR_HOSPITALS, BLOOD_GROUPS } from "../data/mockData";
import { requestsApi } from "../services/api";

export default function RequestBlood({ onAddRequest, setActiveTab }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    BloodGroup: "",
    UnitsRequired: 1,
    Location: "",
    Hospital: "",
    Urgency: "High", // "Normal", "High", "Emergency"
    ContactNumber: "",
    RequiredDate: "",
    Description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // Sri Lankan phone number regex: accepts 07XXXXXXXX or +947XXXXXXXX (or 011/0XX landlines)
  const sriLankanPhoneRegex = /^(?:(?:\+94|0094|0)?7[0-9]{8}|(?:\+94|0094|0)[1-9][0-9]{8})$/;

  const validate = () => {
    const errs = {};

    // Requester Name
    if (!formData.name.trim()) {
      errs.name = "Requester or patient name is required.";
    }

    // Blood Group
    if (!formData.BloodGroup) {
      errs.BloodGroup = "Please select a valid blood group.";
    }

    // Units Required
    const units = Number(formData.UnitsRequired);
    if (!units || isNaN(units) || units <= 0) {
      errs.UnitsRequired = "Units required must be a positive number (minimum 1 unit).";
    } else if (units > 20) {
      errs.UnitsRequired = "Maximum allowable units per single request is 20.";
    }

    // Location (District)
    if (!formData.Location) {
      errs.Location = "District / location is required.";
    }

    // Hospital
    if (!formData.Hospital.trim()) {
      errs.Hospital = "Hospital or healthcare facility name is required.";
    }

    // Contact Number (Sri Lankan format)
    const cleanedPhone = formData.ContactNumber.replace(/[\s-]/g, "");
    if (!cleanedPhone) {
      errs.ContactNumber = "Contact number is required.";
    } else if (!sriLankanPhoneRegex.test(cleanedPhone)) {
      errs.ContactNumber = "Must be a valid Sri Lankan phone number (e.g. 0771234567 or +94712345678).";
    }

    // Required Date
    if (!formData.RequiredDate) {
      errs.RequiredDate = "Required date cannot be empty.";
    } else {
      const selectedTime = new Date(formData.RequiredDate + "T23:59:59Z").getTime();
      if (selectedTime <= Date.now()) {
        errs.RequiredDate = "Required deadline date must be in the future.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const isEmergency = formData.Urgency === "Emergency" || formData.Urgency === "Critical";
      const normalizedUrgency = isEmergency ? "Emergency" : (formData.Urgency === "Routine" ? "Normal" : "High");

      // Set deadline to the end of the required date in UTC
      const deadlineIso = new Date(formData.RequiredDate + "T23:59:59Z").toISOString();

      // Bundle hospital and units into description for complete context
      const formattedDescription = [
        `Hospital: ${formData.Hospital.trim()}`,
        `Units: ${formData.UnitsRequired} Unit(s)`,
        formData.Description.trim()
      ].filter(Boolean).join(". ");

      const payload = {
        requesterName: formData.name.trim(),
        contactNumber: formData.ContactNumber.trim(),
        bloodGroup: formData.BloodGroup,
        location: formData.Location,
        deadline: deadlineIso,
        urgency: normalizedUrgency,
        description: formattedDescription,
        isEmergency: isEmergency
      };

      let created;
      if (isEmergency) {
        created = await requestsApi.createEmergency(payload);
      } else {
        created = await requestsApi.create(payload);
      }

      onAddRequest(created);
      setSubmittedRequest(created);

      // Reset form
      setFormData({
        name: "",
        email: "",
        BloodGroup: "",
        UnitsRequired: 1,
        Location: "",
        Hospital: "",
        Urgency: "High",
        ContactNumber: "",
        RequiredDate: "",
        Description: ""
      });
    } catch (err) {
      console.error("Failed to submit blood request:", err);
      setErrors({ form: err.message || "Failed to submit request to backend. Please check server connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillSample = () => {
    // Tomorrow's date
    const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];
    setFormData({
      name: "Chathura Wickramasinghe",
      email: "chathura.w@gmail.com",
      BloodGroup: "O-",
      UnitsRequired: 2,
      Location: "Colombo",
      Hospital: "National Hospital of Sri Lanka (Colombo 08)",
      Urgency: "Emergency",
      ContactNumber: "0778901234",
      RequiredDate: tomorrow,
      Description: "Patient in emergency ICU ward following a coronary bypass surgery."
    });
    setErrors({});
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: "center" }}>
        <h1 className="page-title" style={{ justifyContent: "center" }}>
          <PlusCircle size={30} color="#e11d48" />
          Request Blood Urgently
        </h1>
        <p className="page-desc" style={{ maxWidth: "600px", margin: "0 auto" }}>
          Submit an emergency or scheduled blood requirement. Your request will be instantly visible to voluntary donors and coordinators across Sri Lanka.
        </p>
      </div>

      {/* Success Notification */}
      {submittedRequest && (
        <div className="alert alert-success" style={{ display: "block" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.35rem" }}>
            <CheckCircle2 size={22} color="#059669" />
            <span>Blood Request Submitted Successfully!</span>
          </div>
          <p style={{ fontSize: "0.925rem", marginBottom: "0.75rem" }}>
            Your request has been published with Reference Code:{" "}
            <strong style={{ textDecoration: "underline" }}>{submittedRequest.RequestNumber}</strong> for{" "}
            <strong>{submittedRequest.UnitsRequired} Units</strong> of <strong>{submittedRequest.BloodGroup}</strong> blood at{" "}
            <strong>{submittedRequest.Hospital}</strong>.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("requests")}>
              View in Active Requests <ArrowRight size={14} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab("management")}>
              Manage Request Status
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSubmittedRequest(null)}
              style={{ marginLeft: "auto" }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Demo helper banner */}
      <div
        style={{
          background: "#fff1f2",
          border: "1px dashed #fda4af",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "#9f1239", fontWeight: 500 }}>
          💡 Testing or demonstrating this flow? Click here to prefill valid Sri Lankan sample data:
        </span>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleFillSample}
          style={{ borderColor: "#fda4af", color: "#e11d48" }}
        >
          <Sparkles size={14} />
          Fill Demo Data
        </button>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Section: Patient & Requester Details */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-color)" }}>
              1. Requester & Patient Information
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  <User size={14} /> Patient / Contact Person Name <span className="req">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? "is-invalid" : ""}`}
                  placeholder="e.g. Kasun Fernando"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback"><AlertCircle size={13} />{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <Mail size={14} /> Email Address (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="e.g. contact@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="form-hint">Used for automated coordinator updates</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ContactNumber">
                <Phone size={14} /> Sri Lankan Contact Number <span className="req">*</span>
              </label>
              <input
                id="ContactNumber"
                type="tel"
                name="ContactNumber"
                className={`form-input ${errors.ContactNumber ? "is-invalid" : ""}`}
                placeholder="07XXXXXXXX or +94 7X XXX XXXX"
                value={formData.ContactNumber}
                onChange={handleChange}
              />
              {errors.ContactNumber ? (
                <div className="invalid-feedback"><AlertCircle size={13} />{errors.ContactNumber}</div>
              ) : (
                <span className="form-hint">Format: 0771234567, 0712345678 or +94771234567</span>
              )}
            </div>
          </div>

          {/* Section: Medical Requirement */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-color)" }}>
              2. Blood Requirement Details
            </h3>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="BloodGroup">
                  <Droplet size={14} /> Blood Group <span className="req">*</span>
                </label>
                <select
                  id="BloodGroup"
                  name="BloodGroup"
                  className={`form-select ${errors.BloodGroup ? "is-invalid" : ""}`}
                  value={formData.BloodGroup}
                  onChange={handleChange}
                >
                  <option value="">-- Select Blood Group --</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                {errors.BloodGroup && <div className="invalid-feedback"><AlertCircle size={13} />{errors.BloodGroup}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="UnitsRequired">
                  Units Required (Pints) <span className="req">*</span>
                </label>
                <input
                  id="UnitsRequired"
                  type="number"
                  name="UnitsRequired"
                  min="1"
                  max="20"
                  className={`form-input ${errors.UnitsRequired ? "is-invalid" : ""}`}
                  value={formData.UnitsRequired}
                  onChange={handleChange}
                />
                {errors.UnitsRequired && <div className="invalid-feedback"><AlertCircle size={13} />{errors.UnitsRequired}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="Urgency">
                  Urgency Level <span className="req">*</span>
                </label>
                <select
                  id="Urgency"
                  name="Urgency"
                  className="form-select"
                  value={formData.Urgency}
                  onChange={handleChange}
                >
                  <option value="Emergency">🔴 Emergency (Immediate / Critical)</option>
                  <option value="High">🟠 High (Within 24-48 hours)</option>
                  <option value="Normal">🔵 Normal (Scheduled Procedure)</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="Location">
                  District Location <span className="req">*</span>
                </label>
                <select
                  id="Location"
                  name="Location"
                  className={`form-select ${errors.Location ? "is-invalid" : ""}`}
                  value={formData.Location}
                  onChange={handleChange}
                >
                  <option value="">-- Select Sri Lankan District --</option>
                  {SRI_LANKAN_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                {errors.Location && <div className="invalid-feedback"><AlertCircle size={13} />{errors.Location}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="RequiredDate">
                  <Calendar size={14} /> Required Date <span className="req">*</span>
                </label>
                <input
                  id="RequiredDate"
                  type="date"
                  name="RequiredDate"
                  className={`form-input ${errors.RequiredDate ? "is-invalid" : ""}`}
                  value={formData.RequiredDate}
                  onChange={handleChange}
                />
                {errors.RequiredDate && <div className="invalid-feedback"><AlertCircle size={13} />{errors.RequiredDate}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="Hospital">
                <Building2 size={14} /> Hospital / Healthcare Facility <span className="req">*</span>
              </label>
              <input
                id="Hospital"
                type="text"
                name="Hospital"
                list="hospital-suggestions"
                className={`form-input ${errors.Hospital ? "is-invalid" : ""}`}
                placeholder="e.g. Teaching Hospital Karapitiya or National Hospital Colombo"
                value={formData.Hospital}
                onChange={handleChange}
              />
              <datalist id="hospital-suggestions">
                {MAJOR_HOSPITALS.map((hosp) => (
                  <option key={hosp} value={hosp} />
                ))}
              </datalist>
              {errors.Hospital ? (
                <div className="invalid-feedback"><AlertCircle size={13} />{errors.Hospital}</div>
              ) : (
                <span className="form-hint">Type or select from major Sri Lankan teaching hospitals</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="Description">
                <FileText size={14} /> Clinical Notes / Reason (Optional)
              </label>
              <textarea
                id="Description"
                name="Description"
                rows="3"
                className={`form-textarea ${errors.Description ? "is-invalid" : ""}`}
                placeholder="Describe patient diagnosis, ward number, or surgical requirement (minimum 10 characters if provided)..."
                value={formData.Description}
                onChange={handleChange}
              />
              {errors.Description && <div className="invalid-feedback"><AlertCircle size={13} />{errors.Description}</div>}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  BloodGroup: "",
                  UnitsRequired: 1,
                  Location: "",
                  Hospital: "",
                  Urgency: "Urgent",
                  ContactNumber: "",
                  RequiredDate: "",
                  Description: ""
                });
                setErrors({});
              }}
            >
              Clear Form
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              <PlusCircle size={18} />
              {isSubmitting ? "Submitting..." : "Submit Blood Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
