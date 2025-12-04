import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/get_users.php");
      setUsers(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (u) => {
    // Navigate to form page with query param to initiate edit
    navigate(`/?editId=${u.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await api.post("/delete.php", { id });
      setMessage(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("Error deleting user");
    }
  };

  return (
    <div>
      <h2>Users</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {users.length === 0 ? (
        <p>No users yet.</p>
      ) : (
        <div className="list-group">
          {users.map((u) => (
            <div
              key={u.id}
              className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{u.name}</strong>
                <div className="text-muted">{u.email}</div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(u)}>
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(u.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
