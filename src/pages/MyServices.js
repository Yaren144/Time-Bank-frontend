import React, { useState, useEffect } from "react";
import "./Services.css";
import "./Form.css";

const API = "http://127.0.0.1:3000";

export default function MyServices({ token }) {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [form, setForm] = useState({ title: "", description: "", category: "", credits: "" });
  const [alert, setAlert] = useState(null);
  const [tab, setTab] = useState("services");

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadServices = async () => {
    const res = await fetch(API + "/services", { headers: { Authorization: "Bearer " + token } });
    const data = await res.json();
    setServices(data);
  };

  const loadRequests = async () => {
    const res = await fetch(API + "/my-requests", { headers: { Authorization: "Bearer " + token } });
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => { loadServices(); loadRequests(); }, []);

  const createService = async () => {
    const res = await fetch(API + "/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) { showAlert("Service created!", "success"); loadServices(); setForm({ title: "", description: "", category: "", credits: "" }); }
    else showAlert((data.errors || [data.error]).join(", "), "error");
  };

  const deleteService = async (id) => {
    await fetch(`${API}/services/${id}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    loadServices();
  };

  const updateRequest = async (id, action) => {
    const res = await fetch(`${API}/requests/${id}/${action}`, {
      method: "PATCH", headers: { Authorization: "Bearer " + token }
    });
    if (res.ok) { showAlert("Done!", "success"); loadRequests(); }
  };

  return (
    <div className="dashboard">
      <h2>My Services</h2>
      {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["services", "add", "requests"].map(t => (
          <button key={t} className="btn-sm" style={{ background: tab === t ? "#1E3A5F" : "white", color: tab === t ? "white" : "#2E86AB" }} onClick={() => setTab(t)}>
            {t === "services" ? "My Listings" : t === "add" ? "+ Add Service" : "Requests"}
          </button>
        ))}
      </div>

      {tab === "services" && (
        <div className="service-grid">
          {services.map(s => (
            <div className="service-card" key={s.id}>
              <div className="service-header">
                <span className="service-category">{s.category}</span>
                <span className="service-credits">{s.credits} credits</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <button className="btn-sm" style={{ borderColor: "#DC2626", color: "#DC2626", marginTop: 8 }} onClick={() => deleteService(s.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === "add" && (
        <div style={{ maxWidth: 420 }}>
          {["title", "description", "category", "credits"].map(field => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "credits" ? "number" : "text"}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                placeholder={field === "credits" ? "e.g. 2" : ""}
              />
            </div>
          ))}
          <button className="btn-primary" onClick={createService}>Create Service</button>
        </div>
      )}

      {tab === "requests" && (
        <div>
          <h3 style={{ color: "#1E3A5F", marginBottom: "1rem" }}>Received Requests</h3>
          {requests.received.length === 0 && <p style={{ color: "#6B7280" }}>No requests yet.</p>}
          {requests.received.map(r => (
            <div key={r.id} style={{ background: "white", borderRadius: 10, padding: "1rem", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p><strong>{r.service.title}</strong> — {r.service.credits} credits — <span style={{ color: "#2E86AB" }}>{r.status}</span></p>
              <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>{r.message}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {r.status === "pending" && <button className="btn-sm" onClick={() => updateRequest(r.id, "accept")}>Accept</button>}
                {r.status === "pending" && <button className="btn-sm" style={{ borderColor: "#DC2626", color: "#DC2626" }} onClick={() => updateRequest(r.id, "reject")}>Reject</button>}
                {r.status === "accepted" && <button className="btn-sm" style={{ borderColor: "#059669", color: "#059669" }} onClick={() => updateRequest(r.id, "complete")}>Complete</button>}
              </div>
            </div>
          ))}
          <h3 style={{ color: "#1E3A5F", margin: "1.5rem 0 1rem" }}>Sent Requests</h3>
          {requests.sent.length === 0 && <p style={{ color: "#6B7280" }}>No sent requests.</p>}
          {requests.sent.map(r => (
            <div key={r.id} style={{ background: "white", borderRadius: 10, padding: "1rem", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p><strong>{r.service.title}</strong> — {r.service.credits} credits — <span style={{ color: "#2E86AB" }}>{r.status}</span></p>
              {r.status === "pending" && <button className="btn-sm" style={{ borderColor: "#DC2626", color: "#DC2626", marginTop: 8 }} onClick={() => updateRequest(r.id, "cancel")}>Cancel</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
