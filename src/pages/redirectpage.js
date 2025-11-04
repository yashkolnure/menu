import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

function RedirectManagerPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [redirects, setRedirects] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch all redirects
  const fetchRedirects = async () => {
    try {
      const res = await fetch("/api/admin/redirects");
      const data = await res.json();
      setRedirects(data);
    } catch (err) {
      console.error("Error fetching redirects", err);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  // Add new redirect
  const handleAddRedirect = async () => {
    if (!from || !to) return alert("Both fields are required");

    try {
      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Redirect added successfully!");
        setFrom(""); 
        setTo("");
        fetchRedirects(); // refresh list
      } else {
        setMessage(data.error || "Failed to add redirect");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  // Delete redirect
  const handleDeleteRedirect = async (id) => {
    try {
      const res = await fetch(`/api/admin/redirects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRedirects();
      } else {
        alert("Failed to delete redirect");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <Helmet>
        <title>Petoba | Redirect Manager</title>
        <meta name="description" content="Manage page redirects for your restaurant app." />
      </Helmet>

      <div className="bg-white p-8 shadow rounded max-w-lg w-full mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">Redirect Manager</h2>
        <input
          type="text"
          placeholder="/old-page"
          className="w-full mb-3 p-2 border rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="text"
          placeholder="/new-page"
          className="w-full mb-3 p-2 border rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
          onClick={handleAddRedirect}
        >
          Add Redirect
        </button>
        {message && <p className="mt-3 text-center text-green-600">{message}</p>}
      </div>

      <div className="bg-white p-6 shadow rounded max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4">Existing Redirects</h3>
        {redirects.length === 0 && <p>No redirects added yet.</p>}
        {redirects.map((r) => (
          <div
            key={r._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>
              <span className="font-semibold">{r.from}</span> → {r.to}
            </span>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleDeleteRedirect(r._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RedirectManagerPage;
