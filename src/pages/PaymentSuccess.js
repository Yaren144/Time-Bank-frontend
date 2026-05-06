import React, { useEffect } from "react";
import "./Form.css";

export default function PaymentSuccess({ navigate }) {
  useEffect(() => {
    setTimeout(() => navigate("home"), 3000);
  }, []);

  return (
    <div className="form-page">
      <div className="form-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>?</div>
        <h2 style={{ color: "#059669" }}>Payment Successful!</h2>
        <p>Your time credits have been added to your account.</p>
        <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "1rem" }}>
          Redirecting to profile in 3 seconds...
        </p>
        <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => navigate("home")}>
          Go to Profile
        </button>
      </div>
    </div>
  );
}
