import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const PAGE_PASSWORD = "Yash$5828";  // Access password

const RestaurantRegister = () => {
  const navigate = useNavigate();

  const [accessPassword, setAccessPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    logo: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    if (accessPassword === PAGE_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("❌ Incorrect Password. Try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            "Authorization": "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        }
      );

      const imageUrl = response.data.source_url;
      setFormData(prev => ({ ...prev, logo: imageUrl }));
      setMessage("✅ Logo uploaded successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to upload image to WordPress.");
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
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
       "/api/admin/restaurant/register",
        formData
      );

      setMessage(response.data.message || "✅ Registered Successfully!");
      setFormData({ name: "", email: "", password: "", logo: "", address: "" });

      // 👉 Redirect after successful registration
      setTimeout(() => {
        navigate("/login1");
      }, 1500); // 1.5 second delay to let user see the success message

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Something went wrong.");
    }
  };

  // 🔐 Password Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-700">🔐 Enter Password</h2>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <input
              type="password"
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              placeholder="Access Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ✅ Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <Helmet>
        <title>Petoba | Digital QR Menu & Ordering</title>
        <meta
          name="description"
          content="Petoba lets restaurants create digital QR menus. Customers scan, order, and enjoy a contactless dining experience."
        />

        <link
          rel="icon"
          href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png"
          type="image/png"
        />
        <meta
          property="og:image"
          content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png"
        />
        <meta property="og:title" content="Petoba - Digital QR Menu" />
        <meta property="og:description" content="Turn your restaurant’s menu into a digital QR code menu." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yash.avenirya.com" />
      </Helmet>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Register Your Restaurant</h2>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {uploading && <p className="text-blue-500 mt-2">Uploading logo...</p>}
            {formData.logo && (
              <img src={formData.logo} alt="Logo Preview" className="mt-2 rounded-md h-20 object-cover" />
            )}
          </div>

          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegister;
