import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterFreePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    logo: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImageToWordPress = async (file) => {
    const imageData = new FormData();
    imageData.append("file", file);

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${WP_SITE_URL}/wp-json/wp/v2/media`,
        imageData,
        {
          headers: {
            "Authorization": "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        }
      );
      const imageUrl = res.data.source_url;
      setFormData((prev) => ({ ...prev, logo: imageUrl }));
      setMessage("✅ Logo uploaded successfully.");
    } catch (err) {
      setError("❌ Logo upload failed.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadImageToWordPress(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/restaurant/register",
        formData
      );

      const { token, restaurant } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("restaurantId", restaurant._id);

      setMessage("✅ Registered & Logged In!");
      setTimeout(() => navigate("/free"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">🎉 Register Your Cafe</h2>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Cafe Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Cafe Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />

          <div>
            <label className="block mb-1 text-sm text-gray-600">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
            {formData.logo && (
              <img src={formData.logo} alt="Logo" className="mt-2 h-20 rounded" />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded transition"
          >
            Register & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterFreePage;
