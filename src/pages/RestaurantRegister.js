// src/components/SuperAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SuperAdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    logo: "",
    contact: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:5000/api/admin";

  // WordPress Image Upload Config
  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API}/restaurants`);
      setRestaurants(res.data);
    } catch (err) {
      alert("Failed to fetch restaurants");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API}/restaurants/${editingId}`, form);
      } else {
        await axios.post(`${API}/restaurants`, form);
      }
      setForm({ name: "", email: "", address: "", logo: "", contact: "", password: "" });
      setEditingId(null);
      fetchRestaurants();
      setMessage("✅ Saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save restaurant");
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setForm({
      name: restaurant.name,
      email: restaurant.email,
      address: restaurant.address,
      logo: restaurant.logo || "",
      contact: restaurant.contact || "",
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`${API}/restaurants/${id}`);
        fetchRestaurants();
      } catch (err) {
        alert("Failed to delete restaurant");
      }
    }
  };

  const uploadImageToWordPress = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("file", file);

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${WP_SITE_URL}/wp-json/wp/v2/media`,
        formDataImage,
        {
          headers: {
            Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        }
      );

      const imageUrl = response.data.source_url;
      setForm((prev) => ({ ...prev, logo: imageUrl }));
      setMessage("✅ Logo uploaded successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to upload image to WordPress.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Super Admin Dashboard</h1>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {editingId ? "Edit Restaurant" : "Add Restaurant"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} className="p-2 border rounded" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-2 border rounded" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-2 border rounded" />
          <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} className="p-2 border rounded" />
          <input name="password" type="password" placeholder={editingId ? "Change Password (optional)" : "Password"} value={form.password} onChange={handleChange} className="p-2 border rounded" />

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-600">Upload Logo</label>
            <input type="file" accept="image/*" onChange={(e) => uploadImageToWordPress(e.target.files[0])} className="w-full p-2 border rounded" />
            {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
            {form.logo && <img src={form.logo} alt="Uploaded" className="mt-2 rounded-md h-20 object-cover border" />}
          </div>
        </div>

        <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editingId ? "Update" : "Create"} Restaurant
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Registered Restaurants</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Logo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((rest) => (
            <tr key={rest._id}>
              <td className="p-2 border">
                {rest.logo ? <img src={rest.logo} alt="logo" className="h-8 w-8 object-cover rounded-full" /> : "-"}
              </td>
              <td className="p-2 border">{rest.name}</td>
              <td className="p-2 border">{rest.email}</td>
              <td className="p-2 border">{rest.address}</td>
              <td className="p-2 border">{rest.contact || "-"}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(rest)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(rest._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperAdminDashboard;
