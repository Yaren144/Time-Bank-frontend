import React from "react";
import "./Home.css";

import {
  HandHelping,
  Coins,
  ShieldCheck,
  ShoppingBagIcon
} from "lucide-react";

export default function Home({ navigate }) {
  return (
    <div>
      <div className="hero">
        <h1>Welcome to Time Bank</h1>
        <p>Exchange services with others using time credits. Offer your skills, earn credits, and use them to get help when you need it.</p>
        <button className="hero-btn" onClick={() => navigate("register")}>Get Started</button>
      </div>
      <div className="card-grid">
        <div className="card">
          <div className="icon" style={{ background: "#EBF5FB" }}> <HandHelping size={34} /></div>
          <h3>Offer Services</h3>
          <p>Share your skills with the community and earn time credits for every hour you help.</p>
        </div>
        <div className="card">
          <div className="icon" style={{ background: "#EAFAF1" }}> <Coins size={34} /></div>
          <h3>Earn Credits</h3>
          <p>Every hour of service earns you one time credit to spend on services you need.</p>
        </div>
        <div className="card">
          <div className="icon" style={{ background: "#FEF9E7" }}> <ShieldCheck size={34} /></div>
          <h3>Secure & Trusted</h3>
          <p>JWT-based authentication keeps your account and transactions safe at all times.</p>
        </div>
      </div>
    </div>
  );
}
