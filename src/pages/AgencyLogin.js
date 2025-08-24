import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AgencyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Clear old localStorage to avoid conflicts
    localStorage.removeItem("agency");
    localStorage.removeItem("agencyId");
    localStorage.removeItem("agencyLevel");
    localStorage.removeItem("agencyToken");

    try {
      const res = await axios.post(
        "/api/admin/agency-login",
        { email, password }
      );

      // Store agency object
      localStorage.setItem("agency", JSON.stringify(res.data.agency));
      localStorage.setItem("agencyId", res.data.agency.id);
      localStorage.setItem("agencyLevel", res.data.agency.agencyLevel);
      localStorage.setItem("agencyToken", res.data.token);

      navigate("/agency-dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white py-16 min-h-screen">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-blue-300 to-green-300 rounded-full filter blur-3xl opacity-30"></div>

      <h2 className="text-4xl font-bold text-center mb-4">Agency Login</h2>
      <p className="text-center text-gray-600 mb-12">
        Manage your clients, view reports, and handle agency operations in one
        dashboard.
      </p>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg">
        {message && (
          <div className="mb-4 bg-red-100 text-red-700 py-2 px-4 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your agency email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In to Your Dashboard"}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/membership"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register now
          </Link>
        </p>
      </div>

      {/* WhatsApp Help Floating Button */}
      <a
        href="https://wa.me/917499835687?text=Hello%2C%20I%20need%20help%20with%20Agency%20login."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <img
          src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
          alt="WhatsApp"
          className="w-5 h-5"
        />
        Help
      </a>
    </div>
  );
};

export default AgencyLogin;
