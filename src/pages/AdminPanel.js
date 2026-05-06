import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

const API = "http://127.0.0.1:3000";

export default function AdminPanel({ token }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [alert, setAlert] = useState(null);

  const h = { Authorization: "Bearer " + token };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const load = async (endpoint, setter) => {
    const res = await fetch(API + endpoint, { headers: h });
    const data = await res.json();
    setter(data);
  };

  useEffect(() => {
    load("/admin/users", setUsers);
    load("/admin/services", setServices);
    load("/admin/transactions", setTransactions);
    load("/admin/balances", setBalances);
  }, []);

  const toggleUser = async (id) => {
    await fetch(`${API}/admin/users/${id}/toggle`, { method: "PATCH", headers: h });
    load("/admin/users", setUsers);
    showAlert("User updated", "success");
  };

  const toggleService = async (id) => {
    await fetch(`${API}/admin/services/${id}/toggle`, { method: "PATCH", headers: h });
    load("/admin/services", setServices);
    showAlert("Service updated", "success");
  };

  const deleteService = async (id) => {
    await fetch(`${API}/admin/services/${id}`, { method: "DELETE", headers: h });
    load("/admin/services", setServices);
    showAlert("Service deleted", "success");
  };

  const tabs = ["users", "services", "transactions", "balances"];

  return (
    <div className="dashboard">
      <h2>Admin Panel</h2>
      {alert && <div className={"alert " + alert.type} style={{ marginBottom: "1rem", padding: "10px 14px", borderRadius: "8px", background: alert.type === "success" ? "#D1FAE5" : "#FEE2E2", color: alert.type === "success" ? "#065F46" : "#991B1B" }}>{alert.msg}</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} className="btn-sm"
            style={{ background: tab === t ? "#1E3A5F" : "white", color: tab === t ? "white" : "#2E86AB", textTransform: "capitalize" }}
            onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="admin-table-wrap">
          <h3>User Management ({users.length} users)</h3>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Credits</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td><span className={"badge " + u.role}>{u.role}</span></td>
                  <td><strong>{u.time_credits}</strong></td>
                  <td><span style={{ color: u.active ? "#059669" : "#DC2626", fontWeight: 600 }}>{u.active ? "Active" : "Inactive"}</span></td>
                  <td><button className="btn-sm" style={{ fontSize: "0.78rem", padding: "4px 10px" }} onClick={() => toggleUser(u.id)}>{u.active ? "Deactivate" : "Activate"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "services" && (
        <div className="admin-table-wrap">
          <h3>Service Moderation ({services.length} services)</h3>
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Owner</th><th>Category</th><th>Credits</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.title}</td>
                  <td>{s.owner}</td>
                  <td>{s.category}</td>
                  <td>{s.credits}</td>
                  <td><span style={{ color: s.status === "active" ? "#059669" : "#DC2626", fontWeight: 600 }}>{s.status}</span></td>
                  <td style={{ display: "flex", gap: 4 }}>
                    <button className="btn-sm" style={{ fontSize: "0.78rem", padding: "4px 10px" }} onClick={() => toggleService(s.id)}>
                      {s.status === "active" ? "Hide" : "Show"}
                    </button>
                    <button className="btn-sm" style={{ fontSize: "0.78rem", padding: "4px 10px", borderColor: "#DC2626", color: "#DC2626" }} onClick={() => deleteService(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "transactions" && (
        <div className="admin-table-wrap">
          <h3>Transaction Monitor ({transactions.length} transactions)</h3>
          <table>
            <thead><tr><th>ID</th><th>From</th><th>To</th><th>Amount</th><th>Type</th><th>Date</th></tr></thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.sender}</td>
                  <td>{t.receiver}</td>
                  <td><strong>{t.amount} credits</strong></td>
                  <td>{t.type}</td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "balances" && (
        <div className="admin-table-wrap">
          <h3>Balance Monitor</h3>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Credits</th><th>Status</th></tr></thead>
            <tbody>
              {balances.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><strong style={{ color: u.time_credits > 0 ? "#059669" : "#DC2626" }}>{u.time_credits}</strong></td>
                  <td><span style={{ color: u.active ? "#059669" : "#DC2626", fontWeight: 600 }}>{u.active ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
