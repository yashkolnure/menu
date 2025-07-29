// src/components/SuperAdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QRCodeSVG as QRCode } from "qrcode.react";

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
  const formRef = useRef(null);

  const API = "https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin";

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
  // Check for empty fields
  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.address.trim() ||
    !form.logo.trim() ||
    !form.contact.trim() ||
    (!editingId && !form.password.trim())
  ) {
    setError("All fields are mandatory.");
    setMessage("");
    return;
  }
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
    setError("");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to save restaurant");
    setMessage("");
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
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
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

  const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/admin", label: "Admin Login" },
    { path: "/admin/dashboard", label: "Admin Dashboard" },
    { path: "/register-restaurant", label: "Register Restaurant" },
    { path: "/restaurant-details", label: "Restaurant Details" },
    { path: "/login1", label: "Login 1" },
    { path: "/free", label: "User Menu Creator" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-md p-4 flex flex-wrap gap-2 justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Super Admin Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          {menuLinks.map((link) => (
            <a
              key={link.path}
              href={link.path.replace(":id", "demo")}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto">
        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? "Edit Restaurant" : "Add Restaurant"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="password" type="password" placeholder={editingId ? "Change Password (optional)" : "Password"} value={form.password} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />

            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-600">Upload Logo</label>
              <input type="file" accept="image/*" onChange={(e) => uploadImageToWordPress(e.target.files[0])} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
              {form.logo && <img src={form.logo} alt="Uploaded" className="mt-2 rounded-md h-20 object-cover border" />}
            </div>
          </div>

          <button onClick={handleSubmit} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto">
            {editingId ? "Update" : "Create"} Restaurant
          </button>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Registered Restaurants</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="p-3 border">Logo</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Contact</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {restaurants.map((rest) => (
                <tr key={rest._id} className="hover:bg-gray-50 transition-all">
                  <td className="p-3 border text-center">
                    {rest.logo ? <img src={rest.logo} alt="logo" className="h-10 w-10 object-cover rounded-full mx-auto" /> : "-"}
                  </td>
                  <td className="p-3 border">{rest.name}</td>
                  <td className="p-3 border">{rest.email}</td>
                  <td className="p-3 border">{rest.address}</td>
                  <td className="p-3 border">{rest.contact || "-"}</td>
                  <td className="p-3 border space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(rest)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rest._id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                    <a
                      href={`/menu/${rest._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                     Menu
                    </a>
                  </td>

                </tr>
              ))}
              {restaurants.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">No restaurants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
