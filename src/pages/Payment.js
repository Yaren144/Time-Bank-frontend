import React, { useState, useEffect } from "react";
import "./Form.css";

export default function Payment({ token, navigate }) {
  const [form, setForm] = useState({ email: "", amount: "" });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setForm(f => ({ ...f, email: payload.email }));
    }
  }, [token]);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async () => {
    if (!form.amount || form.amount < 1) {
      showAlert("Enter a valid amount.", "error"); return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3001/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, amount: parseInt(form.amount) }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.checkout_url;
      } else {
        showAlert(data.error || "Payment failed.", "error");
        setLoading(false);
      }
    } catch (e) {
      showAlert("Could not connect to payment server.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Buy Time Credits</h2>
        <p>You will be redirected to Stripe to complete your payment</p>
        {alert && <div className={"alert " + alert.type}>{alert.msg}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={form.email} readOnly
            style={{ background: "#F9FAFB", color: "#6B7280", cursor: "not-allowed" }} />
        </div>
        <div className="form-group">
          <label>Amount (Credits = EUR)</label>
          <input type="number" value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 10" min={1} />
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Redirecting to Stripe..." : "Pay with Stripe"}
        </button>
        <div className="form-link">
          <span onClick={() => navigate("profile")}>‹ Back to Profile</span>
        </div>
      </div>
    </div>
  );
}
