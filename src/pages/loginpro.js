import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Loginpro() {
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
        navigate("/proedit");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 relative">

      {/* Login Card */}
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
  {/* Header with Logo */}
  <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-center">
    <img
      src="https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png"
      alt="Petoba Logo"
      className="h-12 object-contain"
    />
  </header>

  {/* Login Card */}
  <div className="flex flex-col justify-center items-center flex-grow">
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-sm w-full mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Restaurant Admin Login
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
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




    
    </div>
  );
}

export default Loginpro;
