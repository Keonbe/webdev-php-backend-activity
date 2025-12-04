import React, { useState } from "react";
import api from "../api/axiosConfig";

function Form() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/submit.php", formData);
      setResponseMsg(res.data.message);
    } catch (err) {
      setResponseMsg("Error connecting to backend");
    }
  };

  return (
    <div>
      <h2>React → PHP Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        /><br/><br/>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /><br/><br/>

        <button type="submit">Submit</button>
      </form>

      <p>{responseMsg}</p>
    </div>
  );
}

export default Form;
