import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment";
import Services from "./pages/Services";
import MyServices from "./pages/MyServices";
import Transactions from "./pages/Transactions";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

// export default specify the main component in the file
export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname;
    if (path === "/payment-success") return "payment-success";
    if (path === "/payment-cancel") return "payment-cancel";
    return "home";
  };

  const [page, setPage] = useState(getInitialPage());
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = (p) => {
    setPage(p);
    window.history.pushState({}, "", "/");
  };

  const handleLogin = (tok, usr) => {
    setToken(tok);
    setUser(usr);
    setPage("profile");
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:3000/auth/logout", {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
    } catch (e) {}
    setToken(null);
    setUser(null);
    setPage("home");
  };

  const renderPage = () => {
    switch (page) {
      case "home":            return <Home navigate={navigate} />;
      case "login":           return <Login navigate={navigate} onLogin={handleLogin} />;
      case "register":        return <Register navigate={navigate} onLogin={handleLogin} />;
      case "profile":         return <Profile token={token} navigate={navigate} onLogout={handleLogout} />;
      case "edit-profile":    return <EditProfile token={token} navigate={navigate} />;
      case "admin":           return <AdminPanel token={token} navigate={navigate} />;
      case "payment":         return <Payment token={token} navigate={navigate} />;
      case "services":        return <Services token={token} navigate={navigate} />;
      case "my-services":     return <MyServices token={token} navigate={navigate} />;
      case "transactions":    return <Transactions token={token} navigate={navigate} />;
      case "payment-success": return <PaymentSuccess navigate={navigate} />;
      case "payment-cancel":  return <PaymentCancel navigate={navigate} />;
      default:                return <Home navigate={navigate} />;
    }
  };

  return (
    <div>
      <Navbar page={page} token={token} user={user} navigate={navigate} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}
