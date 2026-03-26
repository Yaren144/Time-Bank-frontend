import React, { useState } from "react";
import "./Form.css";

export default function Login({ navigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async () => {
    if (!email || !password) { showAlert("Email and password required.", "error"); return; }
    try {
      const res = await fetch("http://127.0.0.1:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token, data.user);
      } else {
        showAlert(data.error || "Login failed.", "error");
      }
    } catch (e) {
      showAlert("Could not connect to server.", "error");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your Time Bank account</p>
        {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>Sign In</button>
        <div className="form-link">
          Don't have an account? <span onClick={() => navigate("register")}>Register</span>
        </div>
      </div>
    </div>
  );
}
