import React, { useState, useEffect } from "react";
import "./Services.css";

const API = "http://127.0.0.1:3000";

function Stars({ rating }) {
  if (!rating) return <span style={{ fontSize: "0.78rem", color: "#6B7280" }}>No reviews yet</span>;
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#F5A623" : "#D1D5DB", fontSize: "0.95rem" }}>★</span>
      ))}
      <span style={{ fontSize: "0.78rem", color: "#6B7280", marginLeft: 4 }}>{Number(rating).toFixed(1)}</span>
    </span>
  );
}

function Modal({ service, reviews, token, onClose, onRequest, favorites, onToggleFav }) {
  const serviceReviews = reviews.filter(r => r.service_id === service.id);
  const avg = serviceReviews.length ? serviceReviews.reduce((a,b) => a+b.rating,0) / serviceReviews.length : null;
  const isFav = favorites.includes(service.owner.id);

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:"white", borderRadius:16, padding:"2rem", maxWidth:500, width:"90%", maxHeight:"80vh", overflowY:"auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
          <h3 style={{ color:"#1E3A5F", margin:0 }}>{service.title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer", color:"#6B7280" }}>x</button>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:"0.8rem" }}>
          <span className="service-category">{service.category}</span>
          <span className="service-credits">{service.credits} credits</span>
        </div>
        <p style={{ color:"#6B7280", marginBottom:"0.8rem" }}>{service.description}</p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
          <span style={{ fontSize:"0.88rem", color:"#6B7280" }}>by {service.owner.name}</span>
          {token && (
            <button onClick={() => onToggleFav(service.owner.id)}
              style={{ background:"none", border:"1px solid #F5A623", borderRadius:8, padding:"4px 12px", cursor:"pointer", color:"#F5A623", fontSize:"0.82rem", fontWeight:600 }}>
              {isFav ? "✘ Unfavorite" : "❤︎ Favorite Provider"}
            </button>
          )}
        </div>
        {token && (
          <button className="btn-request" style={{ width:"100%", marginBottom:"1.5rem" }} onClick={() => { onRequest(service.id, service.credits); onClose(); }}>
            Request This Service
          </button>
        )}
        <div style={{ borderTop:"1px solid #F3F4F6", paddingTop:"1rem" }}>
          <h4 style={{ color:"#1E3A5F", marginBottom:"0.8rem" }}>
            Reviews <Stars rating={avg} />
          </h4>
          {serviceReviews.length === 0 && <p style={{ color:"#6B7280", fontSize:"0.88rem" }}>No reviews yet.</p>}
          {serviceReviews.map(r => (
            <div key={r.id} style={{ background:"#F9FAFB", borderRadius:8, padding:"0.8rem", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600, fontSize:"0.88rem" }}>{r.reviewer}</span>
                <Stars rating={r.rating} />
              </div>
              {r.comment && <p style={{ color:"#6B7280", fontSize:"0.85rem", margin:"4px 0 0" }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services({ token, navigate }) {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [alert, setAlert] = useState(null);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const showAlert = (msg, type) => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 4000); };

  const loadServices = async () => {
    let url = API + "/services?";
    if (search) url += `search=${search}&`;
    if (category) url += `category=${category}`;
    const res = await fetch(url);
    setServices(await res.json());
  };

  const loadReviews = async () => {
    const res = await fetch(API + "/reviews");
    if (res.ok) setReviews(await res.json());
  };

  const loadFavorites = async () => {
    if (!token) return;
    const res = await fetch(API + "/profile", { headers: { Authorization: "Bearer " + token } });
    const data = await res.json();
    setFavorites(data.favorite_provider_ids || []);
  };

  useEffect(() => { loadServices(); loadReviews(); loadFavorites(); }, [search, category]);

  const getAvgRating = (serviceId) => {
    const sr = reviews.filter(r => r.service_id === serviceId);
    if (!sr.length) return null;
    return sr.reduce((a,b) => a + b.rating, 0) / sr.length;
  };

  const requestService = async (serviceId, credits) => {
    if (!token) { showAlert("Please login first.", "error"); return; }
    const res = await fetch(`${API}/services/${serviceId}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ message: "I would like this service" }),
    });
    const data = await res.json();
    if (res.ok) showAlert("Request sent! " + credits + " credits on completion.", "success");
    else showAlert(data.error || "Failed.", "error");
  };

  const toggleFavorite = async (providerId) => {
    const newFavs = favorites.includes(providerId)
      ? favorites.filter(id => id !== providerId)
      : [...favorites, providerId];
    setFavorites(newFavs);
    await fetch(API + "/profile/favorites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ favorite_provider_ids: newFavs }),
    });
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
        {services.length === 0 && <p style={{ color:"#6B7280" }}>No services found.</p>}
        {services.map(s => (
          <div className="service-card" key={s.id} style={{ cursor:"pointer" }} onClick={() => setSelected(s)}>
            <div className="service-header">
              <span className="service-category">{s.category}</span>
              <span className="service-credits">{s.credits} credits</span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <div style={{ margin:"6px 0" }}><Stars rating={getAvgRating(s.id)} /></div>
            <div className="service-footer">
              <span>by {s.owner.name}</span>
              {favorites.includes(s.owner.id) && <span style={{ color:"#F5A623", fontSize:"0.8rem" }}>❤︎ Favorite</span>}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <Modal service={selected} reviews={reviews} token={token}
          onClose={() => setSelected(null)} onRequest={requestService}
          favorites={favorites} onToggleFav={toggleFavorite} />
      )}
    </div>
  );
}
