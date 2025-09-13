import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadMenuPage() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId") || "";
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setJsonData([]);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) return setError("❌ Please select a file first.");
    if (!restaurantId) return setError("❌ Restaurant ID not found.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("restaurantId", restaurantId);

    try {
      setLoading(true);
      setError("");
      setJsonData([]);
      setSuccess("");

      const res = await fetch("/api/admin/menu-extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("❌ Failed to process file.");

      const data = await res.json();
      setJsonData(data);
      setSuccess("✅ Menu extracted successfully!");
    } catch (err) {
      console.error("Menu Extract Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (category, index, field, value) => {
    const updatedData = jsonData.map((item, i) => {
      if (i === index) return { ...item, [field]: value };
      return item;
    });
    setJsonData(updatedData);
  };

  const groupedItems = jsonData.reduce((acc, item, index) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...item, _index: index });
    return acc;
  }, {});

  const handleSaveToDB = async () => {
    setError("");
    setSuccess("");

    if (!restaurantId || !token) {
      setError("❌ Missing restaurant ID or token. Please log in again.");
      return;
    }

    if (!jsonData || jsonData.length === 0) {
      setError("❌ No menu items to save.");
      return;
    }

    const enrichedData = jsonData.map((item) => ({
      ...item,
      restaurantId: item.restaurantId || restaurantId,
    }));

    try {
      setSaving(true);
      await axios.post("/api/admin/bulk", enrichedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Menu saved successfully! Redirecting to Dashboard...");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setError("❌ Save failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Helper to show file icon for PDF/Excel
  const renderFilePreview = () => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <div className="my-4 text-center">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="mx-auto max-h-64 rounded-xl shadow-md"
          />
        </div>
      );
    } else if (
      file.type === "application/pdf" ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const icon = file.type === "application/pdf" ? "📄 PDF" : "📊 Excel";
      return (
        <div className="my-4 text-center flex flex-col items-center">
          <span className="text-4xl">{icon}</span>
          <p className="mt-2 font-medium">{file.name}</p>
        </div>
      );
    } else {
      return (
        <p className="my-4 text-center text-gray-500">Unsupported file type</p>
      );
    }
  };

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Upload Menu File</h2>
      <p className="text-center text-gray-500 mb-6">
        Upload a restaurant menu file (Image, PDF, Excel), edit the extracted
        items, and save to the database.
      </p>

      <div className="bg-white shadow-lg rounded-xl p-2">
        {/* File Upload */}
        <div
          className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-gray-400 text-center">
            {file ? `Selected File: ${file.name}` : "Click or Drag & Drop a file"}
          </p>
        </div>

        {/* File Preview */}
        {renderFilePreview()}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 flex justify-center items-center"
        >
          {loading && <span className="loader mr-2"></span>}
          {loading ? "Processing..." : "Upload & Extract Menu"}
        </button>

        {/* Alerts */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Menu Table */}
        {jsonData.length > 0 && (
          <div className="mt-6 space-y-8">
            {Object.keys(groupedItems).map((category) => (
              <div key={category} className="bg-gray-50 p-0 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{category}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse min-w-[600px] md:min-w-full">
                    <thead className="bg-gray-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 border text-left">Name</th>
                        <th className="px-4 py-2 border text-left">Description</th>
                        <th className="px-4 py-2 border w-32 md:w-40 text-center">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedItems[category].map((item) => (
                        <tr key={item._index} className="hover:bg-gray-100 transition">
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleInputChange(category, item._index, "name", e.target.value)
                              }
                              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-orange-400"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleInputChange(
                                  category,
                                  item._index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-orange-400"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) =>
                                handleInputChange(category, item._index, "price", e.target.value)
                              }
                              className="w-full md:w-32 border rounded px-2 py-1 focus:ring-2 focus:ring-orange-400 text-center"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Save Button */}
            <button
              onClick={handleSaveToDB}
              disabled={saving}
              className={`w-full mt-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 flex justify-center items-center ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving && <span className="loader mr-2"></span>}
              {saving ? "Saving..." : "Save my Menu"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadMenuPage;
