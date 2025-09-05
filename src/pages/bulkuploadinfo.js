import React, { useState } from "react";
import { Copy, Upload, CheckCircle, FileJson, ClipboardCheck, Info } from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

function BulkUploadInfo() {
  const [jsonInput, setJsonInput] = useState("");
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Friendly Prompt
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

  // ✅ Sample JSON
  const sampleJson = `[
  {
    "name": "Chicken Biryani",
    "category": "Main Course",
    "description": "Delicious aromatic rice with chicken",
    "price": 250,
    "image": "data:image/webp;base64,...",
    "restaurantId": "${restaurantId}"
  },
  {
    "name": "Paneer Tikka",
    "category": "Starters",
    "description": "Grilled paneer cubes with spices",
    "price": 180,
    "image": "data:image/webp;base64,...",
    "restaurantId": "${restaurantId}"
  }
]`;

// ✅ Upload Function
const handleUpload = async () => {
  setMessage("");
  setError("");

  if (!restaurantId || !token) {
    setError("❌ Missing restaurant ID or token. Please log in again.");
    return;
  }

  let parsedData;
  try {
    parsedData = JSON.parse(jsonInput);
  } catch (err) {
    setError("❌ The text you pasted is not valid JSON.");
    return;
  }

  if (!Array.isArray(parsedData)) {
    setError("❌ JSON must be an array of menu items.");
    return;
  }

  const enrichedData = parsedData.map((item) => ({
    ...item,
    restaurantId: item.restaurantId || restaurantId,
  }));

  try {
    setUploading(true);
    await axios.post(
      "/api/admin/bulk",
      enrichedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setMessage("✅ Menu uploaded successfully! Redirecting to Dashboard...");
    setJsonInput("");

    // ⏳ Redirect after 3 sec
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

  } catch (err) {
    console.error("Upload error:", err);
    setError("❌ Upload failed: " + (err.response?.data?.message || err.message));
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="min-h-screen  py-12 px-6">
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
       <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
        
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-3">
          Bulk Upload Your Menu 🍽️
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Quickly upload your full restaurant menu using AI. No coding needed.
          <br />
          <span className="font-semibold text-purple-600">Restaurant ID:</span>{" "}
          <span className="font-mono">{restaurantId || "N/A"}</span>
        </p>

        {/* STEP 1 */}
       {/* STEP 1 */}
<div className="bg-white shadow-md rounded-xl p-6 mb-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
    <span className="bg-blue-500 text-white px-3 py-1 rounded-full">1</span>
    Copy the Prompt
  </h2>
  <p className="text-gray-600 mb-3">
    Click the button to copy. Then go to{" "}
    <a
      href="https://www.perplexity.ai/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      Perplexity AI
    </a>{" "}
    (or ChatGPT / DeepSeek), paste the prompt, and upload your Menu Image, PDF, or Excel.
  </p>

  {/* Prompt Box */}
  <textarea
    readOnly
    value={promptText}
    rows={8}
    className="w-full border p-3 rounded font-mono text-sm bg-gray-50"
  />

  {/* Copy Button BELOW */}
  <div className="flex mt-4">
    <button
      onClick={() => {
        navigator.clipboard.writeText(promptText);
        alert("✅ Prompt copied!");
      }}
      className="mt-4 px-6 py-3 rounded-lg shadow text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      <Copy className="w-4 h-4" />
      Copy Prompt
    </button>
  </div>
</div>

        {/* STEP 2 */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full">2</span>
            Get Your Menu in JSON
          </h2>
          <p className="text-gray-600 mb-3">
            The AI will return your menu in a structured format. It should look something like this:
          </p>
          <pre className="bg-gray-900 text-green-400 text-sm rounded p-4 overflow-x-auto">
            {sampleJson}
          </pre>
        </div>

        {/* STEP 3 */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full">3</span>
            Paste & Upload
          </h2>
          <p className="text-gray-600 mb-3">
            Copy the JSON from AI and paste it below. Then click{" "}
            <span className="font-semibold text-purple-600">Upload</span> to save it to your menu.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={10}
            placeholder="Paste your JSON here..."
            className="w-full border p-3 rounded font-mono text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-4 px-6 py-3 rounded-lg shadow text-white font-semibold ${
              uploading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload to Menu"}
          </button>
        </div>

        {/* STATUS */}
        {message && (
          <p className="text-green-600 font-medium flex items-center gap-2 mt-4">
            <CheckCircle className="w-5 h-5" /> {message}
          </p>
        )}
        {error && <p className="text-red-600 font-medium mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default BulkUploadInfo;
