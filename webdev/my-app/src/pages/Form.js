import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

function Form() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/get_users.php");
      setUsers(res.data || res);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const payload = { id: editingId, ...formData };
        const res = await api.post("/update.php", payload);
        setResponseMsg(res.data.message);
        setEditingId(null);
      } else {
        const res = await api.post("/submit.php", formData);
        setResponseMsg(res.data.message);
      }

      setFormData({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setResponseMsg("Error connecting to backend");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email });
    setResponseMsg("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await api.post("/delete.php", { id });
      setResponseMsg(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setResponseMsg("Error deleting user");
    }
  };

  return (
    <div>
      <h2>React → PHP Form (CRUD)</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <br />

        <button type="submit">{editingId ? "Update" : "Submit"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setFormData({ name: "", email: "" }); setResponseMsg(""); }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>

      <p>{responseMsg}</p>

      <hr />

      <h3>Users</h3>
      {users.length === 0 && <p>No users yet.</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id} style={{ marginBottom: 8 }}>
            <strong>{u.name}</strong> — {u.email}{" "}
            <button onClick={() => handleEdit(u)} style={{ marginLeft: 8 }}>Edit</button>
            <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Form;
