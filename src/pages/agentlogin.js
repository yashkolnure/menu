import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Agentlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("restaurantId", data.restaurant._id);
        navigate("/65mx.=");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 relative">
      {/* Logo Section */}
      <div className="flex justify-center mt-8">
        <img
          src="https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png"
          alt="Petoba Logo"
          className="w-40 h-auto"
        />
      </div>

      {/* Login Card */}
      <div className="flex flex-col justify-center items-center flex-grow">
        <div className="bg-white p-8 shadow-md rounded-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Restaurant Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

    </div>
  );
}

export default Agentlogin;
