import React, { useState } from "react";
import axios from "axios";

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    logo: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/restaurant/register", formData);
      setMessage(response.data.message);
      setFormData({ name: "", email: "", password: "", logo: "", address: "" }); 
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Register Your Restaurant</h2>
        
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          
          <input type="text" name="logo" placeholder="Logo URL" value={formData.logo} onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegister;
