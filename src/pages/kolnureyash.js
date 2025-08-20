import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Kolnuree = () => {
  const navigate = useNavigate();

  // 🔐 Password protection
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessInput, setAccessInput] = useState("");

  const correctPassword = "Yash$5828";

  const [formData, setFormData] = useState({
    agencyName: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
    retypePassword: "",
    agencyLevel: "1", // default = Start-Up
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const checkEmailExists = async () => {
    if (!formData.email) return;
    try {
      const res = await axios.get(
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/agency/check-email?email=${formData.email}`
      );
      if (res.data.exists) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = {};

    // Validations
    if (!formData.agencyName.trim()) newErrors.agencyName = "Agency Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact No is required.";
    if (!/^[0-9]{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Enter a valid 10-digit number.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== formData.retypePassword)
      newErrors.retypePassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      await axios.post(
        "https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/register-agency",
        {
          agencyName: formData.agencyName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          address: formData.address,
          password: formData.password,
          agencyLevel: formData.agencyLevel,
        }
      );

      setMessage("✅ Registered successfully!");
      setTimeout(() => navigate("/agency-login"), 1000);
    } catch (err) {
      console.error(err);
      setErrors({ general: "❌ Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Password Check Screen
  if (!accessGranted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Protected Page</h2>
          <input
            type="password"
            placeholder="Enter Access Password"
            value={accessInput}
            onChange={(e) => setAccessInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={() =>
              setAccessGranted(accessInput === correctPassword ? true : false)
            }
            className="mt-4 w-full py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
          >
            Unlock
          </button>
          {accessInput && accessInput !== correctPassword && (
            <p className="text-red-500 text-sm mt-2 text-center">
              ❌ Wrong password
            </p>
          )}
        </div>
      </div>
    );
  }

  // 🔓 Main Registration Form
  return (
    <div className="relative bg-white py-16">
      <h2 className="text-4xl font-bold text-center mb-4">Register Your Agency</h2>
      <p className="text-center text-gray-600 mb-12">
        Sign up to manage menus, clients, and dashboards — get your agency started.
      </p>

      <div className="relative z-10 w-full max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-lg">
        {errors.general && <p className="text-red-600 text-center">{errors.general}</p>}
        {message && <p className="text-green-600 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="agencyName"
            placeholder="Agency Name"
            value={formData.agencyName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.agencyName && <p className="text-red-500 text-sm mt-1">{errors.agencyName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={checkEmailExists}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

          <input
            type="number"
            name="contactNumber"
            placeholder="Contact No"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          <input
            type="password"
            name="retypePassword"
            placeholder="Retype Password"
            value={formData.retypePassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          {errors.retypePassword && (
            <p className="text-red-500 text-sm mt-1">{errors.retypePassword}</p>
          )}

          {/* Dropdown for Agency Level */}
          <select
            name="agencyLevel"
            value={formData.agencyLevel}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          >
            <option value="1">Start-Up</option>
            <option value="2">Business</option>
            <option value="3">Agency</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Agency"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Kolnuree
