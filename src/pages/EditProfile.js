import React, { useState, useEffect } from "react";
import "./Form.css";

export default function EditProfile({ token, navigate }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(data => setForm({ first_name: data.first_name, last_name: data.last_name, email: data.email }));
  }, [token]);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert("Profile updated successfully!", "success");
        setTimeout(() => navigate("profile"), 1200);
      } else {
        showAlert((data.errors || [data.error]).join(", "), "error");
      }
    } catch (e) {
      showAlert("Could not connect to server.", "error");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Edit Profile</h2>
        <p>Update your account information</p>
        {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
        {["first_name", "last_name", "email"].map(field => (
          <div className="form-group" key={field}>
            <label>{field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</label>
            <input
              type={field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}
        <button className="btn-primary" onClick={handleSubmit}>Save Changes</button>
        <div className="form-link"><span onClick={() => navigate("profile")}>‹ Back to Profile</span></div>
      </div>
    </div>
  );
}
