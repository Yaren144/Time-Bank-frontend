import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

export default function AdminPanel({ token, navigate }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/admin/users", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(data => setUsers(data));
  }, [token]);

  return (
    <div className="dashboard">
      <h2>Admin Panel</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{users.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Admin Users</div>
          <div className="stat-value">{users.filter(u => u.role === "admin").length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Regular Users</div>
          <div className="stat-value">{users.filter(u => u.role === "user").length}</div>
        </div>
      </div>
      <div className="admin-table-wrap">
        <h3>User Management</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Credits</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>
                <td><span className={"badge " + u.role}>{u.role}</span></td>
                <td><strong>{u.time_credits}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
