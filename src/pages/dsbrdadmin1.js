import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Dsbrdadmin1 = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    logo: "",
    contact: "",
    password: "",
    subadmin_id: "1", // Fixed subadmin_id
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

  const subadminId = "1"; // Fixed

  useEffect(() => {
    setForm((prev) => ({ ...prev, subadmin_id: subadminId }));
    fetchRestaurantsBySubadmin(subadminId);
  }, []);

  const fetchRestaurantsBySubadmin = async (subadmin_id) => {
    try {
      const res = await axios.get(`${API}/restaurant/all?subadmin_id=${subadmin_id}`);
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch restaurants for subadmin");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API}/restaurants/${editingId}`, form);
      } else {
        await axios.post(`${API}/restaurant/register`, form);
      }

      setForm({
        name: "",
        email: "",
        address: "",
        logo: "",
        contact: "",
        password: "",
        subadmin_id: "1",
      });
      setEditingId(null);
      setMessage("✅ Saved successfully!");
      fetchRestaurantsBySubadmin(subadminId);
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
      subadmin_id: restaurant.subadmin_id || "1",
    });

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`${API}/restaurants/${id}`);
        fetchRestaurantsBySubadmin(subadminId);
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-10 font-sans max-w-6xl mx-auto">
        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? "Edit Restaurant" : "Add Restaurant"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} className="p-3 border rounded-lg" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg" />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-3 border rounded-lg" />
            <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} className="p-3 border rounded-lg" />
            <input name="password" type="password" placeholder={editingId ? "Change Password (optional)" : "Password"} value={form.password} onChange={handleChange} className="p-3 border rounded-lg" />

            {/* Hidden subadmin_id field */}
            <input type="hidden" name="subadmin_id" value={form.subadmin_id} />

            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-600">Upload Logo</label>
              <input type="file" accept="image/*" onChange={(e) => uploadImageToWordPress(e.target.files[0])} className="w-full p-3 border rounded-lg" />
              {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
              {form.logo && <img src={form.logo} alt="Uploaded" className="mt-2 rounded-md h-20 object-cover border" />}
            </div>
          </div>

          <button onClick={handleSubmit} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                  <td className="p-3 border text-center space-x-2">
                    <button onClick={() => handleEdit(rest)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(rest._id)} className="text-red-600 hover:underline">Delete</button>
                    <a href={`/menu/${rest._id}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Menu</a>
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

export default Dsbrdadmin1;
