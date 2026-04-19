import React, { useState, useEffect } from "react";
import "./Services.css";

const API = "http://127.0.0.1:3000";

export default function Services({ token, navigate }) {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadServices = async () => {
    let url = API + "/services?";
    if (search) url += `search=${search}&`;
    if (category) url += `category=${category}`;
    const res = await fetch(url);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => { loadServices(); }, [search, category]);

  const requestService = async (serviceId, credits) => {
    if (!token) { showAlert("Please login first.", "error"); return; }
    const res = await fetch(`${API}/services/${serviceId}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ message: "I would like this service" }),
    });
    const data = await res.json();
    if (res.ok) showAlert("Request sent! " + credits + " credits will be charged on completion.", "success");
    else showAlert(data.error || "Failed.", "error");
  };

  return (
    <div className="dashboard">
      <h2>Service Marketplace</h2>
      {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
      <div className="filters">
        <input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="education">Education</option>
          <option value="cooking">Cooking</option>
          <option value="tech">Tech</option>
          <option value="language">Language</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="service-grid">
        {services.length === 0 && <p style={{ color: "var(--muted)" }}>No services found.</p>}
        {services.map(s => (
          <div className="service-card" key={s.id}>
            <div className="service-header">
              <span className="service-category">{s.category}</span>
              <span className="service-credits">{s.credits} credits</span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <div className="service-footer">
              <span>by {s.owner.name}</span>
              {token && (
                <button className="btn-request" onClick={() => requestService(s.id, s.credits)}>
                  Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
