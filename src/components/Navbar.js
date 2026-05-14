import React from "react";
import "./Navbar.css";
import  {
  ShoppingBasketIcon
} from "lucide-react";

export default function Navbar({ page, token, user, navigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("home")}><ShoppingBasketIcon style={{ transform: "translateY(5px)" }} size={25} /> TIME BANK</div>
      <div className="nav-links">
        {!token ? (
          <>
            <button onClick={() => navigate("home")} className={page === "home" ? "active" : ""}>Home</button>
            <button onClick={() => navigate("services")} className={page === "services" ? "active" : ""}>Services</button>
            <button onClick={() => navigate("login")} className={page === "login" ? "active" : ""}>Login</button>
            <button onClick={() => navigate("register")} className={page === "register" ? "active" : ""}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("services")} className={page === "services" ? "active" : ""}>Services</button>
            <button onClick={() => navigate("my-services")} className={page === "my-services" ? "active" : ""}>My Services</button>
            <button onClick={() => navigate("transactions")} className={page === "transactions" ? "active" : ""}>Transactions</button>
            <button onClick={() => navigate("profile")} className={page === "profile" ? "active" : ""}>Profile</button>
            {user?.role === "admin" && (
              <button onClick={() => navigate("admin")} className={page === "admin" ? "active" : ""}>Admin</button>
            )}
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
