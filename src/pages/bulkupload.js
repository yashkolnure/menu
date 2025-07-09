// BulkMenuUploader.jsx
import React, { useState } from "react";
import axios from "axios";

const BulkMenuUploader = () => {
  const [jsonData, setJsonData] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData); // ensure valid array
      const response = await axios.post("http://localhost:5000/api/menu-items/bulk", {
        items: parsedData,
      });
      setStatus(`✅ ${response.data.message} (${response.data.insertedCount} inserted)`);
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bulk Menu Item Uploader</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-64 p-3 border rounded resize-none"
          placeholder='Paste JSON array of menu items here...'
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Upload Menu Items
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default BulkMenuUploader;

