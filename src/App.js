import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment";

export default function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = (p) => setPage(p);

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
      case "home":         return <Home navigate={navigate} />;
      case "login":        return <Login navigate={navigate} onLogin={handleLogin} />;
      case "register":     return <Register navigate={navigate} onLogin={handleLogin} />;
      case "profile":      return <Profile token={token} navigate={navigate} onLogout={handleLogout} />;
      case "edit-profile": return <EditProfile token={token} navigate={navigate} />;
      case "admin":        return <AdminPanel token={token} navigate={navigate} />;
      case "payment":      return <Payment token={token} navigate={navigate} />;
      default:             return <Home navigate={navigate} />;
    }
  };

  return (
    <div>
      <Navbar page={page} token={token} user={user} navigate={navigate} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}
