import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Kolnure = () => {
  const navigate = useNavigate();

  // 🔐 Password protection
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessInput, setAccessInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    logo: "",
    password: "",
    retypePassword: "",
    membership_level: 1,
  });
  

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const uploadImageToWordPress = async (file) => {
    const imageData = new FormData();
    imageData.append("file", file);

    setUploading(true);
    setMessage("");
    setErrors({});

    try {
      const res = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, imageData, {
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      });
      const imageUrl = res.data.source_url;
      setFormData((prev) => ({ ...prev, logo: imageUrl }));
      setMessage("✅ Logo uploaded successfully.");
    } catch (err) {
      setErrors({ logo: "❌ Logo upload failed." });
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
    setMessage("");
    const newErrors = {};

    // Validation
    if (!formData.name.trim()) newErrors.name = "Restaurant name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.logo.trim()) newErrors.logo = "Logo is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== formData.retypePassword)
      newErrors.retypePassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // ✅ Check if email exists
      const checkRes = await axios.get(
        `/api/admin/restaurants/check-email?email=${formData.email}`
      );

      if (checkRes.data.exists) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }

      // ✅ Register directly (no Razorpay)
      await axios.post(
        "/api/admin/restaurants",
        formData
      );

      setMessage("✅ Registered successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "❌ Registration failed." });
    }
  };

  // 🔐 Access check
  if (!accessGranted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
          <h2 className="text-lg font-bold mb-4">Enter Access Password</h2>
          <input
            type="password"
            value={accessInput}
            onChange={(e) => setAccessInput(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            className="w-full py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              if (accessInput === "Yash$5828") {
                setAccessGranted(true);
              } else {
                alert("❌ Wrong Password");
              }
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white py-16">
      <h2 className="text-4xl font-bold text-center mb-4">Personal Register</h2>
      <p className="text-center text-gray-600 mb-12">
        Private registration page (password protected).
      </p>

      <div className="relative z-10 w-full max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-lg">
        {errors.general && <p className="text-red-600 text-center">{errors.general}</p>}
        {message && <p className="text-green-600 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Restaurant / Cafe Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Owner Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Contact */}
          <div>
            <input
              type="number"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              name="address"
              placeholder="Restaurant Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Retype Password */}
          <div>
            <input
              type="password"
              name="retypePassword"
              placeholder="Retype Password"
              value={formData.retypePassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.retypePassword && (
              <p className="text-red-500 text-sm mt-1">{errors.retypePassword}</p>
            )}
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border rounded-lg"
            />
            {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
            {formData.logo && <img src={formData.logo} alt="Logo" className="mt-2 h-20 rounded" />}
            {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
          </div>

          {/* Membership Level Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Select Membership Level</label>
            <select
              name="membership_level"
              value={formData.membership_level}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value={1}>Free</option>
              <option value={2}>Premium</option>
              <option value={3}>Pro</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Register
          </button>

          <p className="text-gray-600 text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Kolnure;
