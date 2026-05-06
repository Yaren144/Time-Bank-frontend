import React from "react";
import "./Form.css";

export default function PaymentCancel({ navigate }) {
  return (
    <div className="form-page">
      <div className="form-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>?</div>
        <h2 style={{ color: "#DC2626" }}>Payment Cancelled</h2>
        <p>Your payment was not completed. No credits were added.</p>
        <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => navigate("payment")}>
          Try Again
        </button>
      </div>
    </div>
  );
}
