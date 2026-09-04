import React from "react";
import { AlertTriangle, Clock, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export function BloodGroupBadge({ group, size = "md" }) {
  const isLarge = size === "lg";
  return (
    <span
      className="badge badge-blood"
      style={{
        fontSize: isLarge ? "1.1rem" : "0.85rem",
        padding: isLarge ? "0.35rem 0.75rem" : "0.2rem 0.55rem"
      }}
    >
      🩸 {group}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const lower = (urgency || "").toLowerCase();
  if (lower === "critical" || lower === "emergency") {
    return (
      <span className="badge badge-critical">
        <AlertCircle size={13} />
        {lower === "emergency" ? "Emergency (Critical)" : "Critical (Immediate)"}
      </span>
    );
  }
  if (lower === "urgent" || lower === "high") {
    return (
      <span className="badge badge-urgent">
        <AlertTriangle size={13} />
        {lower === "high" ? "High Urgency" : "Urgent (24-48h)"}
      </span>
    );
  }
  return (
    <span className="badge badge-routine">
      <Clock size={13} />
      {lower === "normal" ? "Normal" : "Routine"}
    </span>
  );
}

export function StatusBadge({ status }) {
  const lower = (status || "").toLowerCase();
  if (lower === "fulfilled") {
    return (
      <span className="badge badge-fulfilled">
        <CheckCircle2 size={13} />
        Fulfilled
      </span>
    );
  }
  if (lower === "in progress" || lower === "matched") {
    return (
      <span className="badge badge-progress">
        <Clock size={13} />
        {lower === "matched" ? "Matched" : "In Progress"}
      </span>
    );
  }
  if (lower === "cancelled") {
    return (
      <span className="badge badge-cancelled">
        Cancelled
      </span>
    );
  }
  return (
    <span className="badge badge-pending">
      <HelpCircle size={13} />
      {lower === "active" ? "Active" : "Pending"}
    </span>
  );
}
