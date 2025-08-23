import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from 'qrcode.react';


function BulkUploadmenu() {
  const [restaurant, setRestaurant] = useState({ name: "", logo: "", address: "", contact: "" });
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [jsonText, setJsonText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!restaurantId || !token) {
      setError("Missing restaurant ID or token. Please log in.");
      return;
    }

    fetch(`/api/admin/${restaurantId}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch restaurant details");
        return response.json();
      })
      .then((data) => setRestaurant(data))
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
        setError("Failed to load restaurant details.");
      });
  }, [restaurantId, token]);

  

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setJsonText(JSON.stringify(data, null, 2));
        setError("");
      } catch (err) {
        setError("❌ Invalid JSON file.");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setJsonText(e.target.value);
  };

  const handleUpload = async () => {
    setMessage("");
    setError("");

    if (!restaurantId || !token) {
      setError("❌ Missing restaurant ID or token.");
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (err) {
      setError("❌ Invalid JSON format.");
      return;
    }

    if (!Array.isArray(parsedData)) {
      setError("❌ JSON must be an array of objects.");
      return;
    }

    const enrichedData = parsedData.map(item => ({
      ...item,
      restaurantId: item.restaurantId || restaurantId
    }));

    try {
      setUploading(true);
      await axios.post(
        "/api/admin/bulk",
        enrichedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Data uploaded successfully!");
      setJsonText("");
    } catch (err) {
      console.error("Upload error:", err);
      setError("❌ Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

const promptText = `
You are a professional data extractor and formatter.

I will provide you with an image of a restaurant menu. Your task is to help me extract all the menu items and convert them into valid JSON format for uploading into a database.

Here are the instructions:
1. Each menu item should be represented as a JSON object with the following fields:
- name: The name of the menu item (string)
- category: The category of the item (e.g., NON VEG STARTERS, PURE VEG, BREADS, RICE, VEG STARTERS) (string)
- description: A short descriptive line about the item (you can create it if needed) (string)
- price: The item price in numbers (use the FULL price if multiple sizes are shown; if possible, list multiple sizes as separate objects)
- image: Use "data:image/webp;base64,..." as a placeholder (string)
- restaurantId: Use "${restaurantId}" as the placeholder value (string)

2. Do not skip any items from the menu. Even if an item has multiple sizes (Full/Half/Quarter), create separate JSON objects for each variant.

3. The final output must be:
- Pure valid JSON (no explanation, no extra text)
- An array of objects inside [ ... ]
- Maintain consistency in fields for all objects.

I will now provide the menu card image. Please extract all items and return the complete JSON.
`;

return (
  <div className="p-4 max-w-5xl mx-auto">

    {/* Header */}
    <div className="flex justify-between items-center mb-8 bg-gray-100 p-4 rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      <div className="space-x-3">
        <button onClick={() => navigate("/admin")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Login</button>
        <button onClick={() => navigate("/register-restaurant")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Register Restaurant</button>
        <button onClick={() => navigate("/admin/dashboard")} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded">Dashboard</button>
        <button onClick={() => navigate(`/menu/${restaurantId}`)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">Menu Page</button>
      </div>
    </div>

    {/* Alerts */}
    {message && <p className="text-green-600 mb-4">{message}</p>}
    {error && <p className="text-red-600 mb-4">{error}</p>}

    {/* Prompt Section */}
    <div className="mb-6 border p-4 rounded bg-yellow-50 shadow">
      <p className="mb-3 text-gray-600 text-sm">
        Copy the prompt below and paste it along with your menu image or PDF into
        <a href="https://chat.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">DeepSeek AI</a>
        &nbsp;to generate the menu in JSON format.
      </p>

      <div className="relative">
        <textarea
          value={promptText}
          readOnly
          rows={12}
          className="border p-3 rounded w-full font-mono text-sm bg-gray-100"
        />
        <div className="mt-2 text-right">
          <button
            onClick={() => {
              navigator.clipboard.writeText(promptText);
              alert("Prompt copied to clipboard!");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-5 py-2 rounded"
          >
            Copy Prompt
          </button>
        </div>
      </div>
    </div>

    {/* Restaurant Details */}
    <div className="mb-6 border p-4 rounded bg-gray-50">
      <h3 className="text-xl font-semibold mb-2">Restaurant Details</h3>
      {restaurant.logo && <img src={restaurant.logo} alt="Logo" className="w-20 h-20 mb-3 rounded shadow" />}
      <p><strong>Name:</strong> {restaurant.name || "N/A"}</p>
      <p><strong>Address:</strong> {restaurant.address || "N/A"}</p>
      <p><strong>Contact:</strong> {restaurant.contact || "N/A"}</p>
      <p><strong>ID:</strong> {restaurantId}</p>
    </div>

    {/* Restaurant ID */}
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
        placeholder='[ { "name": "Coffee", "price": 99 }, ... ]'
      />
    </div>

    {/* Upload Button */}
    {/* Upload Button */}
<button
  onClick={handleUpload}
  disabled={uploading}
  className={`px-6 py-2 rounded shadow text-white ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
>
  {uploading ? "Uploading..." : "Upload to Database"}
</button>

{/* New Button to /freefree1 */}
<button
  onClick={() => window.location.href = "/freefree1"}
  className="ml-4 px-6 py-2 rounded shadow text-white bg-green-500 hover:bg-green-600"
>
  ADD IMAGES
</button>

  <div className="mt-10 border p-4 rounded bg-gray-50 text-center">
  <h3 className="text-xl font-semibold mb-8 text-gray-700">Restaurant Menu QR Codes</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
    {[
      {
        id: 'template1',
        img: 'https://website.avenirya.com/wp-content/uploads/2025/07/to-See-the-Full-Menu-2.png',
      },
      {
        id: 'template2',
        img: 'https://website.avenirya.com/wp-content/uploads/2025/07/Beige-Minimalist-Discount-QR-Code-Business-Square-Sticker-600-x-900-px.png',
      },
      {
        id: 'template3',
        img: 'https://website.avenirya.com/wp-content/uploads/2025/07/Orange-and-Yellow-Modern-Simple-Scan-for-Menu-Rectangle-Sticker.png',
      },
    ].map((template, index) => (
      <div key={template.id} className="border p-3 rounded shadow bg-white">
        <div
          id={template.id}
          className="relative inline-block w-64 h-auto rounded overflow-hidden shadow"
        >
          <img
            src={template.img}
            alt={`QR Template ${index + 1}`}
            className="w-full h-auto object-cover"
            crossOrigin="anonymous"
          />

          <div
            className="absolute top-1/2 left-1/2"
            style={{
              transform: 'translate(-50%, -50%)',
              width: '50%', // 50% of template width
            }}
          >
            <QRCodeCanvas
              value={`https://app.avenirya.com/menu/${restaurantId}`}
              size={200}
              bgColor="transparent"
              fgColor="#000000"
              level="H"
              includeMargin={false}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            const qrElement = document.getElementById(template.id);
           html2canvas(qrElement, { useCORS: true, scale: 3 }).then(canvas => {
            const link = document.createElement("a");
            link.download = `menu_qr_${restaurantId}_${template.id}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            });
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow mt-4"
        >
          Download QR
        </button>
      </div>
    ))}
  </div>

  <p className="mt-6 text-sm text-gray-500">
    Link: <a href={`https://app.avenirya.com/menu/${restaurantId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
      https://app.avenirya.com/menu/{restaurantId}
    </a>
  </p>
</div>


  </div>
);
}

export default BulkUploadmenu;
