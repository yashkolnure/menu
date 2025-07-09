import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BulkUploadmenu() {
  const [restaurant, setRestaurant] = useState({ name: "", logo: "", address: "", contact: "" });
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [jsonText, setJsonText] = useState("");
  const [jsonData, setJsonData] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!restaurantId || !token) return;

    fetch(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error("Error fetching restaurant details:", error));
  }, [restaurantId, token]);

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setJsonData(data);
        setJsonText(JSON.stringify(data, null, 2));
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setJsonText(e.target.value);
  };

  const handleUpload = async () => {
    try {
      const parsedData = JSON.parse(jsonText);

      if (!Array.isArray(parsedData)) {
        alert("JSON must be an array of objects.");
        return;
      }

      const enrichedData = parsedData.map(item => ({
        ...item,
        restaurantId: item.restaurantId || restaurantId
      }));

      await axios.post("https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/bulk", enrichedData);
      alert("Data uploaded successfully!");
      setJsonText("");
      setJsonData([]);
    } catch (err) {
      alert("Invalid JSON or Upload failed: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-gray-100 p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <div className="space-x-3">
          <button onClick={() => navigate("/admin")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Login</button>
          <button onClick={() => navigate("/register-restaurant")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Register Restaurant</button>
          <button onClick={() => navigate("/admin/dashboard")} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded">Dashboard</button>
          <button onClick={() => navigate(`/menu/${restaurantId}`)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">Menu Page</button>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Restaurant Details</h3>
        {restaurant.logo && <img src={restaurant.logo} alt="Restaurant Logo" className="w-20 h-20 mb-3" />}
        <p><strong>Name:</strong> {restaurant.name}</p>
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>Contact:</strong> {restaurant.contact}</p>
        <p><strong>ID:</strong> {restaurant.id || restaurantId}</p>
      </div>

      {/* Restaurant ID Field */}
      <div className="mb-4">
        <label className="font-medium block mb-1">Restaurant ID:</label>
        <input
          type="text"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          className="border p-2 rounded w-full bg-gray-100"
          readOnly
        />
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <label className="font-medium block mb-1">Upload JSON File:</label>
        <input type="file" accept=".json" onChange={handleFileChange} className="border p-2 rounded w-full" />
      </div>

      {/* Textarea Upload */}
      <div className="mb-4">
        <label className="font-medium block mb-1">Or Paste JSON Data:</label>
        <textarea
          value={jsonText}
          onChange={handleTextChange}
          rows={10}
          className="border p-3 rounded w-full font-mono text-sm"
          placeholder='[ { "name": "coffee", "price": 99, ... }, ... ]'
        ></textarea>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        Upload to Database
      </button>
    </div>
  );
}

export default BulkUploadmenu;
