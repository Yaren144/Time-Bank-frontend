import React, { useState, useEffect } from "react";

const API = "http://127.0.0.1:3000";

export default function Transactions({ token }) {
  const [data, setData] = useState({ sent: [], received: [] });

  useEffect(() => {
    fetch(API + "/transactions", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  const Row = ({ t, type }) => (
    <div style={{ background: "white", borderRadius: 10, padding: "1rem", marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <p style={{ fontWeight: 600, color: "#1E3A5F", margin: 0 }}>{t.description}</p>
        <p style={{ fontSize: "0.82rem", color: "#6B7280", margin: 0 }}>{new Date(t.created_at).toLocaleDateString()}</p>
      </div>
      <span style={{ fontWeight: 700, fontSize: "1.1rem", color: type === "sent" ? "#DC2626" : "#059669" }}>
        {type === "sent" ? "-" : "+"}{t.amount} credits
      </span>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>Transaction History</h2>
      <h3 style={{ color: "#1E3A5F", marginBottom: "1rem" }}>Received</h3>
      {data.received.length === 0 && <p style={{ color: "#6B7280" }}>No received transactions.</p>}
      {data.received.map(t => <Row key={t.id} t={t} type="received" />)}
      <h3 style={{ color: "#1E3A5F", margin: "1.5rem 0 1rem" }}>Sent</h3>
      {data.sent.length === 0 && <p style={{ color: "#6B7280" }}>No sent transactions.</p>}
      {data.sent.map(t => <Row key={t.id} t={t} type="sent" />)}
    </div>
  );
}
