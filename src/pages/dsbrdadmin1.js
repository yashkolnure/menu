import React, { useState } from "react";
import axios from "axios";

const Dsbrdadmin1 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    logo: "",
    address: "",
    contact: "",
    proFeatures: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/restaurant/register", formData);
      setMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        logo: "",
        address: "",
        contact: "",
        proFeatures: false,
      });
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Register Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="logo"
          placeholder="Logo URL"
          value={formData.logo}
          onChange={handleChange}
        />
        <br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number (optional)"
          value={formData.contact}
          onChange={handleChange}
        />
        <br />

        <label>
          <input
            type="checkbox"
            name="proFeatures"
            checked={formData.proFeatures}
            onChange={handleChange}
          />
          Enable Pro Features
        </label>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Dsbrdadmin1;
