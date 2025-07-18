import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Dsbrdadmin1 = ({ subadminId }) => {
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
      const filtered = res.data.filter(r => r.subadmin_id === subadminId);
      setRestaurants(filtered);
    } catch (err) {
      alert("Failed to fetch restaurants");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      if (subadminId) payload.subadmin_id = subadminId;

      if (editingId) {
        await axios.put(`${API}/restaurants/${editingId}`, payload);
      } else {
        await axios.post(`${API}/restaurants`, payload);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 max-w-6xl mx-auto">
      {message && <p className="text-green-600 text-center mb-2">{message}</p>}
      {error && <p className="text-red-600 text-center mb-2">{error}</p>}

      <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? "Edit Restaurant" : "Add Restaurant"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="p-3 border rounded-lg" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-3 border rounded-lg" />
          <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} className="p-3 border rounded-lg" />
          <input name="password" placeholder="Password" value={form.password} onChange={handleChange} className="p-3 border rounded-lg" type="password" />
          <input type="file" onChange={(e) => uploadImageToWordPress(e.target.files[0])} className="p-3 border rounded-lg" />
        </div>
        {form.logo && <img src={form.logo} alt="logo" className="h-16 mt-2 rounded" />}
        <button onClick={handleSubmit} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {editingId ? "Update" : "Create"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Registered Restaurants</h2>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
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
            {restaurants.map((r) => (
              <tr key={r._id}>
                <td className="p-2 border text-center">{r.logo ? <img src={r.logo} className="h-10 w-10 object-cover mx-auto rounded-full" /> : "-"}</td>
                <td className="p-2 border">{r.name}</td>
                <td className="p-2 border">{r.email}</td>
                <td className="p-2 border">{r.address}</td>
                <td className="p-2 border">{r.contact}</td>
                <td className="p-2 border space-x-2 text-center">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:underline">Delete</button>
                  <a href={`/menu/${r._id}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Menu</a>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr><td colSpan="6" className="text-center p-4 text-gray-500">No restaurants found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dsbrdadmin1;
