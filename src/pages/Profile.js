import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile({ token, navigate, onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(data => setUser(data));
  }, [token]);

  if (!user) return <div style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>Loading...</div>;

  const initials = ((user.first_name?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() || "?";

  return (
    <div className="dashboard">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div className="avatar">{initials}</div>
        <div className="profile-info">
          <h3>{user.first_name} {user.last_name}</h3>
          <p>{user.email}</p>
          <span className={"badge " + user.role}>{user.role}</span>
        </div>
        <div className="credits-box">
          <div className="credits-num">{user.time_credits}</div>
          <div className="credits-lbl">Time Credits</div>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Account Status</div>
          <div className="stat-value" style={{ color: "#059669", fontSize: "1.1rem" }}>Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Role</div>
          <div className="stat-value" style={{ fontSize: "1.1rem" }}>{user.role}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button className="btn-sm" onClick={() => navigate("edit-profile")}>Edit Profile</button>
        <button className="btn-sm" style={{ borderColor: "#F5A623", color: "#F5A623" }} onClick={() => navigate("payment")}>Buy Credits</button>
        <button className="btn-sm btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
