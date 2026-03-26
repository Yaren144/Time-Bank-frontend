import React, { useState } from "react";
import "./Form.css";

export default function Register({ navigate, onLogin }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      showAlert("All fields are required.", "error"); return;
    }
    try {
      const res = await fetch("http://127.0.0.1:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token, data.user);
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
        <h2>Create Account</h2>
        <p>Join Time Bank and start exchanging services</p>
        {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
        {["first_name","last_name","email","password"].map(field => (
          <div className="form-group" key={field}>
            <label>{field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</label>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              placeholder={field === "password" ? "Minimum 6 characters" : ""}
            />
          </div>
        ))}
        <button className="btn-primary" onClick={handleSubmit}>Create Account</button>
        <div className="form-link">
          Already have an account? <span onClick={() => navigate("login")}>Sign In</span>
        </div>
      </div>
    </div>
  );
}
