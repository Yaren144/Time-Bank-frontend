import React, { useState, useEffect } from "react";
import "./Form.css";

export default function Payment({ token, navigate }) {
  const [form, setForm] = useState({ email: "", card_number: "", amount: "" });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setForm(f => ({ ...f, email: payload.email }));
    }
  }, [token]);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async () => {
    if (!form.card_number || !form.amount) {
      showAlert("Card number and amount are required.", "error"); return;
    }
    try {
      const res = await fetch("http://127.0.0.1:3001/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseInt(form.amount) }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert("Payment approved! Credits added: " + data.time_credits, "success");
        setTimeout(() => navigate("profile"), 2000);
      } else {
        showAlert(data.error || "Payment failed.", "error");
      }
    } catch (e) {
      showAlert("Could not connect to payment server.", "error");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Buy Time Credits</h2>
        <p>Purchase credits using your card</p>
        {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            readOnly
            style={{ background: "#F9FAFB", color: "#6B7280", cursor: "not-allowed" }}
          />
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={form.card_number}
            onChange={e => setForm({ ...form, card_number: e.target.value })}
            placeholder="1234567890123456"
            maxLength={19}
          />
        </div>
        <div className="form-group">
          <label>Amount (Credits)</label>
          <input
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="10"
            min={1}
          />
        </div>
        <button className="btn-primary" onClick={handleSubmit}>Purchase Credits</button>
        <div className="form-link">
          <span onClick={() => navigate("profile")}>‹ Back to Profile</span>
        </div>
      </div>
    </div>
  );
}
