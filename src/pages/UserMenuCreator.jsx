import React, { useState, useEffect } from "react";
import axios from "axios";

function UserMenuCreator() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customInputs, setCustomInputs] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [addingCategory, setAddingCategory] = useState("");

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const apiBase = "https://menubackend-git-main-yashkolnures-projects.vercel.app";

  useEffect(() => {
    if (!restaurantId || !token) {
      setError("Login required.");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/admin/${restaurantId}/menu`, { headers });
        setMenuItems(res.data);

        const uniqueCategories = [...new Set(res.data.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu.");
      }
    };

    fetchData();
  }, []);

  const groupedItems = menuItems.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleInputChange = (index, field, value) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const handleDelete = async (itemId, index) => {
    try {
      setDeletingIndex(index);
      if (itemId) {
        await axios.delete(`${apiBase}/api/admin/${restaurantId}/menu/${itemId}`, { headers });
      }
      const updated = [...menuItems];
      updated.splice(index, 1);
      setMenuItems(updated);
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleAddItem = async (category) => {
    try {
      setAddingCategory(category);
      setMenuItems([
        ...menuItems,
        {
          name: "",
          category,
          description: "",
          price: 0,
          image: "data:image/webp;base64,...",
          restaurantId,
        },
      ]);
    } finally {
      setAddingCategory("");
    }
  };

  const handleCategoryChange = (index, value) => {
    if (value === "custom") {
      setCustomInputs({ ...customInputs, [index]: "" });
    } else {
      handleInputChange(index, "category", value);
      const updated = { ...customInputs };
      delete updated[index];
      setCustomInputs(updated);
    }
  };

  const handleCustomCategoryInput = (index, value) => {
    handleInputChange(index, "category", value);
    setCustomInputs({ ...customInputs, [index]: value });

    if (!categories.includes(value)) {
      setCategories([...categories, value]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Edit Your Menu</h1>

      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-8 border p-4 rounded shadow bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{category}</h2>
            <button
              onClick={() => handleAddItem(category)}
              className={`px-3 py-1 rounded text-white ${
                addingCategory === category ? "bg-gray-400 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={addingCategory === category}
            >
              {addingCategory === category ? "Adding..." : "+ Add Item"}
            </button>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const globalIndex = menuItems.findIndex((m) => m === item);
                return (
                  <tr key={item._id || idx}>
                    <td className="p-2 border">
                      <input
                        className="w-full border p-1 rounded"
                        value={item.name}
                        onChange={(e) => handleInputChange(globalIndex, "name", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        className="w-full border p-1 rounded"
                        value={categories.includes(item.category) ? item.category : "custom"}
                        onChange={(e) => handleCategoryChange(globalIndex, e.target.value)}
                      >
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                        <option value="custom">➕ Custom...</option>
                      </select>
                      {customInputs[globalIndex] !== undefined && (
                        <input
                          type="text"
                          className="mt-1 w-full border p-1 rounded"
                          placeholder="Enter custom category"
                          value={item.category}
                          onChange={(e) => handleCustomCategoryInput(globalIndex, e.target.value)}
                        />
                      )}
                    </td>
                    <td className="p-2 border">
                      <input
                        className="w-full border p-1 rounded"
                        value={item.description}
                        onChange={(e) => handleInputChange(globalIndex, "description", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        className="w-full border p-1 rounded"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleInputChange(globalIndex, "price", e.target.value)}
                      />
                    </td>
                    <td className="p-2 border text-center space-x-2">
                      <button
                        onClick={async () => {
                          try {
                            setSavingIndex(globalIndex);
                            const updatedItem = menuItems[globalIndex];
                            if (updatedItem._id) {
                              await axios.put(`${apiBase}/api/admin/${restaurantId}/menu/${updatedItem._id}`, updatedItem, { headers });
                            } else {
                              await axios.post(`${apiBase}/api/admin/${restaurantId}/menu`, updatedItem, { headers });
                            }
                            setMessage("Item saved successfully");
                          } catch (err) {
                            console.error(err);
                            setError("Error saving item");
                          } finally {
                            setSavingIndex(null);
                          }
                        }}
                        className={`px-3 py-1 rounded text-white ${
                          savingIndex === globalIndex ? "bg-gray-400 cursor-wait" : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={savingIndex === globalIndex}
                      >
                        {savingIndex === globalIndex ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, globalIndex)}
                        className={`px-3 py-1 rounded text-white ${
                          deletingIndex === globalIndex ? "bg-gray-400 cursor-wait" : "bg-red-500 hover:bg-red-600"
                        }`}
                        disabled={deletingIndex === globalIndex}
                      >
                        {deletingIndex === globalIndex ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default UserMenuCreator;
