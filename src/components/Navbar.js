import React from "react";
import "./Navbar.css";

export default function Navbar({ page, token, user, navigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("home")}>? TIME BANK</div>
      <div className="nav-links">
        {!token ? (
          <>
            <button onClick={() => navigate("home")} className={page === "home" ? "active" : ""}>Home</button>
            <button onClick={() => navigate("login")} className={page === "login" ? "active" : ""}>Login</button>
            <button onClick={() => navigate("register")} className={page === "register" ? "active" : ""}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("profile")} className={page === "profile" ? "active" : ""}>Profile</button>
            {user?.role === "admin" && (
              <button onClick={() => navigate("admin")} className={page === "admin" ? "active" : ""}>Admin Panel</button>
            )}
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
