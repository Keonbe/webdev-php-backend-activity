import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function Form() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If there's an editId in query string, prefill the form
    const params = new URLSearchParams(location.search);
    const editId = params.get("editId");
    if (editId) {
      // fetch users and find the one with id (small app)
      api
        .get("/get_users.php")
        .then((res) => {
          const list = res.data || res;
          const user = list.find((u) => String(u.id) === String(editId));
          if (user) {
            setEditingId(user.id);
            setFormData({ name: user.name, email: user.email });
          } else {
            setResponseMsg("User not found for editing");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [location.search]);

  const validate = () => {
    const e = {};
    if (!formData.name || !formData.name.trim()) e.name = "Name is required";
    if (!formData.email || !formData.email.trim())
      e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    if (!validate()) return;

    try {
      if (editingId) {
        const payload = { id: editingId, ...formData };
        const res = await api.post("/update.php", payload);
        setResponseMsg(res.data.message);
        // after update go to users list
        navigate("/users");
      } else {
        const res = await api.post("/submit.php", formData);
        setResponseMsg(res.data.message);
        // after create go to users list
        navigate("/users");
      }

      setFormData({ name: "", email: "" });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setResponseMsg("Error connecting to backend");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", email: "" });
    setErrors({});
    setResponseMsg("");
    navigate("/users");
  };

  return (
    <div className="card p-4">
      <h2>{editingId ? "Edit User" : "Add User"}</h2>

      {responseMsg && <div className="alert alert-info">{responseMsg}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editingId ? "Update" : "Submit"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default Form;
