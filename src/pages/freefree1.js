import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BulkUploadmenu1() {
  const [restaurant, setRestaurant] = useState({ name: "", logo: "", address: "", contact: "" });
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [menuItems, setMenuItems] = useState([]);
  const [existingItems, setExistingItems] = useState([]);
  const [itemForm, setItemForm] = useState({ name: "", category: "", description: "", price: "", image: "", _id: null });
  const [customCategory, setCustomCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [savingItems, setSavingItems] = useState({});
  const imagePasteRef = useRef(null);
  const [customEditCategories, setCustomEditCategories] = useState({});

  useEffect(() => {
    if (!restaurantId || !token) return;

    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(res.data);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch restaurant.");
      }
    };

    const fetchMenu = async () => {
      try {
        const res = await axios.get(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingItems(res.data);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch menu.");
      }
    };

    fetchRestaurant();
    fetchMenu();
  }, [restaurantId, token]);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            setItemForm((prev) => ({ ...prev, image: event.target.result }));
          };
          reader.readAsDataURL(file);
        }
      }
    };
    const ref = imagePasteRef.current;
    if (ref) ref.addEventListener("paste", handlePaste);
    return () => {
      if (ref) ref.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    if (groupedItems.length && !selectedCategory) {
      setSelectedCategory(groupedItems[0].category);
    }
  }, [existingItems]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && !/^[0-9]*$/.test(value)) return;
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setItemForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addItemToList = () => {
    if (!itemForm.name || !itemForm.category || !itemForm.price || !itemForm.image || !itemForm.description) {
      setError("All fields are required.");
      return;
    }
    const newItem = { ...itemForm, price: parseFloat(itemForm.price), restaurantId };
    setMenuItems((prev) => [...prev, newItem]);
    setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null });
    setCustomCategory("");
  };

  const handleUpload = async () => {
    if (!menuItems.length) return;
    try {
      setUploading(true);
      await axios.post(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/bulk`, menuItems, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Upload successful");
      setMenuItems([]);
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditItem = (item) => {
    setItemForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      _id: item._id,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${itemForm._id}`, itemForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null });
      setMessage("Updated successfully");
      const res = await axios.get(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingItems(res.data);
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingItems(existingItems.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };
const updateEditedItemById = (id, field, value) => {
  const updated = editedItems.map((item) =>
    item._id === id ? { ...item, [field]: value } : item
  );
  setEditedItems(updated);
};
  const updateEditedItem = (index, field, value) => {
    const updated = [...editedItems];
    updated[index][field] = value;
    setEditedItems(updated);
  };

  const handlePasteImage = (e, index) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          updateEditedItem(index, "image", event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateEditedItem(index, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveAllEditedItems = async () => {
    try {
      const requests = editedItems.map(item =>
        axios.put(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${item._id}`, item, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      await Promise.all(requests);
      setMessage("All items updated successfully.");
      setIsEditMode(false);
      const res = await axios.get(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingItems(res.data);
    } catch (err) {
      setError("Failed to save changes");
    }
  };

  const allCategories = [...new Set([...existingItems.map((i) => i.category), ...menuItems.map((i) => i.category)])];
  const groupedItems = allCategories.map(cat => ({
    category: cat,
    items: existingItems.filter(item => item.category === cat)
  }));

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {restaurant.name}</h2>
      <div className="border p-4 mb-6 rounded bg-white shadow" ref={imagePasteRef}>
        <h3 className="font-semibold text-lg mb-3">Add / Edit Dish</h3>
        <p className="text-sm text-gray-500 mb-2">Paste an image (Ctrl+V) or upload below</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input name="name" value={itemForm.name} onChange={handleItemChange} placeholder="Dish Name" className="border p-2 rounded" />
          <input name="price" value={itemForm.price} onChange={handleItemChange} placeholder="Price" className="border p-2 rounded" />
          <input name="description" value={itemForm.description} onChange={handleItemChange} placeholder="Description" className="border p-2 rounded" />
          <select
            value={itemForm.category || ""}
            onChange={(e) => {
                const val = e.target.value;
                setCustomCategory(val === "__custom__" ? val : "");
                setItemForm({ ...itemForm, category: val === "__custom__" ? "" : val });
            }}
            className="border p-2 rounded"
            >
            <option value="">Select Category</option>
            {allCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            <option value="__custom__">➕ Add Custom Category</option>
            </select>
            {customCategory === "__custom__" && (
            <input
                type="text"
                placeholder="Enter category"
                value={itemForm.category}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                className="border p-2 rounded"
            />
            )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded" />
        </div>
        {itemForm.image && <img src={itemForm.image} alt="Preview" className="mt-2 h-24" />}
        {itemForm._id ? (
          <button onClick={handleUpdate} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Update Item</button>
        ) : (
          <button onClick={addItemToList} className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
        )}
      </div>

      {menuItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Items To Upload</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {menuItems.map((item, idx) => (
              <div key={idx} className="border p-3 rounded shadow bg-white">
                <h4 className="font-semibold">{item.name}</h4>
                <p>{item.description}</p>
                <p className="text-green-600">₹{item.price}</p>
                {item.image && <img src={item.image} className="mt-2 h-24" alt="preview" />}
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            ))}
          </div>
          <button onClick={handleUpload} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            {uploading ? "Uploading..." : "Upload All"}
          </button>
        </div>
      )}

      {existingItems.length > 0 && (
        <div className="mb-10">
          {!isEditMode && (
            <button
              onClick={() => {
                setIsEditMode(true);
                setEditedItems([...existingItems]);
              }}
              className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Edit Menu
            </button>
          )}

          {isEditMode ? (
            <>
              <h3 className="text-xl font-semibold mb-4">Edit Menu Items</h3>
              {[...new Set(editedItems.map(item => item.category))].sort((a, b) => a.localeCompare(b)).map((cat) => (
  <div key={cat} className="mb-6">
    <h4 className="text-lg font-bold mb-2 text-blue-700 border-b pb-1">{cat || "Uncategorized"}</h4>
    <div className="space-y-3 w-full">
      {editedItems.filter(item => item.category === cat).map((item) => (
        <div
          key={item._id}
          className="w-full flex items-center gap-3 p-3 border rounded shadow bg-white overflow-x-auto"
          onPaste={(e) => {
            const items = e.clipboardData.items;
            for (const clipboardItem of items) {
              if (clipboardItem.type.indexOf("image") !== -1) {
                const file = clipboardItem.getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                  updateEditedItemById(item._id, "image", event.target.result);
                };
                reader.readAsDataURL(file);
              }
            }
          }}
        >
          {item.image && (
            <img
              src={item.image}
              alt="preview"
              className="h-14 w-14 object-cover rounded border shrink-0"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                updateEditedItemById(item._id, "image", reader.result);
              };
              reader.readAsDataURL(file);
            }}
            className="text-sm border rounded px-2 py-1 shrink-0"
            style={{ maxWidth: "200px" }}
          />

          <input
            value={item.name}
            onChange={(e) => updateEditedItemById(item._id, "name", e.target.value)}
            className="border p-2 rounded text-sm flex-1 min-w-[120px]"
            placeholder="Name"
          />

          <input
            value={item.description}
            onChange={(e) => updateEditedItemById(item._id, "description", e.target.value)}
            className="border p-2 rounded text-sm flex-1 min-w-[150px]"
            placeholder="Description"
          />

          <input
            value={item.price}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                updateEditedItemById(item._id, "price", e.target.value);
              }
            }}
            className="border p-2 rounded text-sm w-20 text-center"
            placeholder="₹"
          />

          <div className="flex flex-col w-44">
            <select
              value={allCategories.includes(item.category) ? item.category : "__custom__"}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "__custom__") {
                  setCustomEditCategories((prev) => ({ ...prev, [item._id]: true }));
                  updateEditedItemById(item._id, "category", "");
                } else {
                  setCustomEditCategories((prev) => ({ ...prev, [item._id]: false }));
                  updateEditedItemById(item._id, "category", val);
                }
              }}
              className="border p-2 rounded text-sm"
            >
              <option value="">Select Category</option>
              {allCategories.map((catOption, i) => (
                <option key={i} value={catOption}>{catOption}</option>
              ))}
              <option value="__custom__">➕ Custom</option>
            </select>

            {customEditCategories[item._id] && (
              <input
                type="text"
                placeholder="Enter category"
                value={item.category}
                onChange={(e) => updateEditedItemById(item._id, "category", e.target.value)}
                className="mt-1 border p-1 rounded text-sm"
              />
            )}
          </div>

          <button
            onClick={async () => {
              setSavingItems((prev) => ({ ...prev, [item._id]: "saving" }));
              try {
                await axios.put(
                  `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${item._id}`,
                  item,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                setSavingItems((prev) => ({ ...prev, [item._id]: "saved" }));
                setMessage(`Saved: ${item.name}`);
                setTimeout(() => {
                  setSavingItems((prev) => ({ ...prev, [item._id]: undefined }));
                }, 1200);
              } catch {
                setSavingItems((prev) => ({ ...prev, [item._id]: undefined }));
                setError("Save failed");
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm shrink-0"
          >
            {savingItems[item._id] === "saving"
              ? "Saving..."
              : savingItems[item._id] === "saved"
              ? "Saved"
              : "Save"}
          </button>
        </div>
      ))}
    </div>
  </div>
))}



              <button onClick={saveAllEditedItems} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Save All Changes
              </button>
            </>
          ) : (
            groupedItems.sort((a, b) => a.category.localeCompare(b.category)).map((group, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-bold mb-2 text-blue-700 border-b pb-1">{group.category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {group.items.map((item, i) => (
                    <div key={i} className="p-4 border rounded bg-white shadow relative">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm">{item.description}</p>
                      <p className="text-green-700 font-semibold">₹{item.price}</p>
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-24 w-full object-cover mt-2 rounded" />
                      )}
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditItem(item)} className="text-xs px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default BulkUploadmenu1;
