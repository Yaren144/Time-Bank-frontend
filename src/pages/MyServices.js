import React, { useState, useEffect } from "react";
import "./Services.css";
import "./Form.css";
import "./MyServices.css";

const API = "http://127.0.0.1:3000";

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#F5A623" : "#D1D5DB", fontSize: "1.1rem" }}>?</span>
      ))}
    </span>
  );
}

function ReviewForm({ requestId, token, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(null);

  const submit = async () => {
    if (!rating) { setAlert("Please select a rating."); return; }
    const res = await fetch(API + "/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ service_request_id: requestId, rating, comment }),
    });
    const data = await res.json();
    if (res.ok) onDone();
    else setAlert((data.errors || [data.error]).join(", "));
  };

  return (
    <div style={{ marginTop: 8, padding: "10px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
      {alert && <p style={{ color: "#DC2626", fontSize: "0.82rem", marginBottom: 6 }}>{alert}</p>}
      <div style={{ marginBottom: 6 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ cursor: "pointer", fontSize: "1.4rem", color: i <= (hover || rating) ? "#F5A623" : "#D1D5DB" }}
            onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}>?</span>
        ))}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Leave a comment..." rows={2}
        style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: "0.85rem", resize: "none" }} />
      <button className="btn-sm" style={{ marginTop: 6, background: "#1E3A5F", color: "white" }} onClick={submit}>Submit Review</button>
    </div>
  );
}

export default function MyServices({ token }) {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [form, setForm] = useState({ title: "", description: "", category: "", credits: "" });
  const [alert, setAlert] = useState(null);
  const [tab, setTab] = useState("services");
  const [reviewingId, setReviewingId] = useState(null);

  const showAlert = (msg, type) => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 4000); };

  const loadServices = async () => {
    const res = await fetch(API + "/services", { headers: { Authorization: "Bearer " + token } });
    setServices(await res.json());
  };

  const loadRequests = async () => {
    const res = await fetch(API + "/my-requests", { headers: { Authorization: "Bearer " + token } });
    setRequests(await res.json());
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
    const res = await fetch(`${API}/requests/${id}/${action}`, { method: "PATCH", headers: { Authorization: "Bearer " + token } });
    if (res.ok) { showAlert("Done!", "success"); loadRequests(); }
  };

  const RequestCard = ({ r, type }) => (
    <div className={`request-card ${type}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontWeight: 600, color: "#1E3A5F", margin: 0 }}>{r.service.title}</p>
          <p style={{ fontSize: "0.82rem", color: "#6B7280", margin: "2px 0" }}>{r.service.credits} credits</p>
          {r.message && <p style={{ fontSize: "0.82rem", color: "#6B7280", margin: 0 }}>{r.message}</p>}
        </div>
        <span className={`status-badge status-${r.status}`}>{r.status}</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {type === "received" && r.status === "pending" && <>
          <button className="btn-sm" onClick={() => updateRequest(r.id, "accept")}>Accept</button>
          <button className="btn-sm" style={{ borderColor: "#DC2626", color: "#DC2626" }} onClick={() => updateRequest(r.id, "reject")}>Reject</button>
        </>}
        {type === "received" && r.status === "accepted" && (
          <button className="btn-sm" style={{ borderColor: "#059669", color: "#059669" }} onClick={() => updateRequest(r.id, "complete")}>Complete</button>
        )}
        {type === "sent" && ["pending","accepted"].includes(r.status) && (
          <button className="btn-sm" style={{ borderColor: "#DC2626", color: "#DC2626" }} onClick={() => updateRequest(r.id, "cancel")}>Cancel</button>
        )}
        {type === "sent" && r.status === "completed" && reviewingId !== r.id && (
          <button className="btn-sm" style={{ borderColor: "#F5A623", color: "#F5A623" }} onClick={() => setReviewingId(r.id)}>Leave Review</button>
        )}
      </div>
      {reviewingId === r.id && (
        <ReviewForm requestId={r.id} token={token} onDone={() => { setReviewingId(null); showAlert("Review submitted!", "success"); }} />
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <h2>My Services</h2>
      {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["services","add","requests"].map(t => (
          <button key={t} className="btn-sm"
            style={{ background: tab === t ? "#1E3A5F" : "white", color: tab === t ? "white" : "#2E86AB" }}
            onClick={() => setTab(t)}>
            {t === "services" ? "My Listings" : t === "add" ? "+ Add Service" : "Requests"}
          </button>
        ))}
      </div>

      {tab === "services" && (
        <div className="service-grid">
          {services.length === 0 && <p style={{ color: "#6B7280" }}>No services yet.</p>}
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
          {["title","description","category","credits"].map(field => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type={field === "credits" ? "number" : "text"} value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                placeholder={field === "credits" ? "e.g. 2" : ""} />
            </div>
          ))}
          <button className="btn-primary" onClick={createService}>Create Service</button>
        </div>
      )}

      {tab === "requests" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <h3 className="requests-title received-title">?? Services I Provide</h3>
            {requests.received.length === 0 && <p style={{ color: "#6B7280", fontSize: "0.88rem" }}>No incoming requests.</p>}
            {requests.received.map(r => <RequestCard key={r.id} r={r} type="received" />)}
          </div>
          <div>
            <h3 className="requests-title sent-title">?? Services I Requested</h3>
            {requests.sent.length === 0 && <p style={{ color: "#6B7280", fontSize: "0.88rem" }}>No sent requests.</p>}
            {requests.sent.map(r => <RequestCard key={r.id} r={r} type="sent" />)}
          </div>
        </div>
      )}
    </div>
  );
}
