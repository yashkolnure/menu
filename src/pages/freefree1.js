import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import QRCodeTemplates from "../components/QRCodeTemplates";

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
        const res = await axios.get(`/api/admin/${restaurantId}/details`, {
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
        const res = await axios.get(`/api/admin/${restaurantId}/menu`, {
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

// Define limits
const membershipLimits = {
  1: 30,
  2: 100,
  3: Infinity
};


async function batchUpdate(items, batchSize = 5) {
  let index = 0;
  while (index < items.length) {
    const batch = items.slice(index, index + batchSize);
    await Promise.all(
      batch.map(item =>
        axios.put(
          `/api/admin/${item.restaurantId}/menu/${item._id}`,
          item,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
      )
    );
    index += batchSize;
  }
};

  async function uploadImageToWordPress(base64Image, filename) {
    try {
      // Remove the data URL prefix if present
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', blob, filename || `menu-item-${Date.now()}.jpg`);

      // WordPress credentials
      const username = "yashkolnure58@gmail.com";
      const appPassword = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
      const authHeader = `Basic ${btoa(`${username}:${appPassword}`)}`;

      const response = await fetch("https://website.avenirya.com/wp-json/wp/v2/media", {
        method: "POST",
        headers: {
          "Authorization": authHeader
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image to WordPress");
      }

      const data = await response.json();
      return data.source_url;
    } catch (error) {
      console.error("WordPress upload error:", error);
      throw error;
    }
  }

const addItemToList = () => {
  if (!itemForm.name || !itemForm.category || !itemForm.price) {
    setError("All fields are required.");
    return;
  }

  // Get current plan's limit
  const limit = membershipLimits[restaurant.membership_level] || 0;
  const totalItems = existingItems.length + menuItems.length;

  // Check if limit reached
  if (totalItems >= limit && limit !== Infinity) {
    setError(`You have reached the limit of ${limit} items for your membership plan.`);
    return;
  }

  // Add item
  const newItem = { ...itemForm, price: parseFloat(itemForm.price), restaurantId };
  setMenuItems((prev) => [...prev, newItem]);
  setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null });
  setCustomCategory("");
};


  const handleUpload = async () => {
    if (!menuItems.length) return;
    
    try {
      setUploading(true);
      setMessage("");
      setError("");
      
      // First upload all images to WordPress
      const itemsWithImageUrls = await Promise.all(
        menuItems.map(async (item) => {
          if (item.image.startsWith('data:')) {
            try {
              const imageUrl = await uploadImageToWordPress(
                item.image,
                `${item.name.replace(/\s+/g, '-')}_${item.category.replace(/\s+/g, '-')}.jpg`
              );
              return { ...item, image: imageUrl };
            } catch (error) {
              console.error(`Failed to upload image for ${item.name}:`, error);
              return { ...item, image: '' }; // Fallback to no image
            }
          }
          return item; // If it's already a URL, keep it
        })
      );
      
      // Then send to your backend
      await axios.post(
        `/api/admin/bulk`,
        itemsWithImageUrls,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage("Upload successful");
      setMenuItems([]);
      
      // Refresh the existing items
      const res = await axios.get(
        `/api/admin/${restaurantId}/menu`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingItems(res.data);
      
    } catch (err) {
      setError("Upload failed: " + (err.response?.data?.message || err.message));
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
  
 // Memory cache for media items
let mediaCache = null;

// Clean and normalize dish/media names
function cleanName(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')       // Remove (anything)
    .replace(/[^a-z\s-]/g, '')     // Remove digits/special characters
    .replace(/-/g, ' ')            // Dashes to space
    .replace(/\s+/g, ' ')          // Collapse spaces
    .trim();
}

// Levenshtein similarity
function levenshteinSimilarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLen = Math.max(a.length, b.length);
  return 1 - distance / maxLen;
}

// Fetch all media items once (bulk first, fallback to pagination)
async function fetchAllMediaItems() {
  const allItems = [];

  try {
    const bulkRes = await fetch(`https://website.avenirya.com/wp-json/wp/v2/media?per_page=10000`);
    if (!bulkRes.ok) throw new Error("Bulk fetch failed");
    return await bulkRes.json();
  } catch (e) {
    console.warn("Bulk fetch failed, falling back to pagination...");
  }

  let page = 1;
  const perPage = 100;
  const maxPages = 100;

  while (page <= maxPages) {
    const res = await fetch(`https://website.avenirya.com/wp-json/wp/v2/media?per_page=${perPage}&page=${page}`);
    if (!res.ok) break;

    const data = await res.json();
    allItems.push(...data);

    if (data.length < perPage) break;
    page++;
  }

  return allItems;
}

// Fetch and attach best match image using cached media
async function fetchImageForItemCached(index) {
  const item = editedItems[index];
  const rawName = item?.name;

  if (!rawName) {
    setError("Dish name required to fetch image.");
    return;
  }

  const cleanedDishName = cleanName(rawName);
  setSavingItems((prev) => ({ ...prev, [item._id]: "fetching" }));

  try {
    if (!mediaCache || mediaCache.length === 0) {
      setError("Media cache is empty.");
      return;
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const media of mediaCache) {
      if (!media.title?.rendered) continue;

      const mediaTitle = cleanName(media.title.rendered);
      const sim = levenshteinSimilarity(cleanedDishName, mediaTitle);

      if (sim > bestScore) {
        bestScore = sim;
        bestMatch = media;
      }
    }

    if (bestMatch && bestScore >= 0.3) {
      const imageUrl = bestMatch.source_url;
      const imgBlob = await fetch(imageUrl).then((r) => r.blob());

      const reader = new FileReader();
      reader.onloadend = () => {
        updateEditedItem(index, "image", reader.result);
        setSavingItems((prev) => ({ ...prev, [item._id]: undefined }));
      };
      reader.readAsDataURL(imgBlob);
    } else {
      setError(`No image matched for "${rawName}"`);
      setSavingItems((prev) => ({ ...prev, [item._id]: undefined }));
    }
  } catch (err) {
    setError("Failed to fetch image: " + err.message);
    setSavingItems((prev) => ({ ...prev, [item._id]: undefined }));
  }
}

// Helper: run async tasks in batches
async function runInBatches(tasks, batchSize = 5) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const res = await Promise.allSettled(batch.map(fn => fn()));
    results.push(...res);
  }
  return results;
}

// Main: fetch images for all dishes using memory cache
async function fetchAllImages() {
  if (!mediaCache) {
    mediaCache = await fetchAllMediaItems();
  }

  const tasks = editedItems.map((item, index) => {
    const img = item.image;
    if (!img || img.startsWith("data:")) {
      return () => fetchImageForItemCached(index);
    }
    return null;
  }).filter(Boolean);

  await runInBatches(tasks, 5); // adjust concurrency limit if needed
}


  const handleUpdate = async () => {
    try {
      setMessage("");
      setError("");
      
      let imageUrl = itemForm.image;
      
      // If it's a new base64 image, upload to WordPress first
      if (itemForm.image.startsWith('data:')) {
        imageUrl = await uploadImageToWordPress(
          itemForm.image,
          `${itemForm.name.replace(/\s+/g, '-')}-${Date.now()}.jpg`
        );
      }
      
      const updatedItem = { ...itemForm, image: imageUrl };
      
      await axios.put(
        `/api/admin/${restaurantId}/menu/${itemForm._id}`,
        updatedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null });
      setMessage("Updated successfully");
      
      // Refresh the menu
      const res = await axios.get(
        `/api/admin/${restaurantId}/menu`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingItems(res.data);
      
    } catch (err) {
      setError("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/${restaurantId}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingItems(existingItems.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
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
      setMessage("");
      setError("");
      
      // First process all images
      const itemsToSave = await Promise.all(
        editedItems.map(async (item) => {
          if (item.image.startsWith('data:')) {
            try {
              const imageUrl = await uploadImageToWordPress(
                item.image,
                `${item.name.replace(/\s+/g, '-')}_${item.category.replace(/\s+/g, '-')}.jpg`
              );
              return { ...item, image: imageUrl };
            } catch (error) {
              console.error(`Failed to upload image for ${item.name}:`, error);
              return item; // Keep original (will fail to save if it was a new image)
            }
          }
          return item; // If it's already a URL, keep it
        })
      );
      
      // Then save all items
      const requests = itemsToSave.map(item =>
        axios.put(
          `/api/admin/${restaurantId}/menu/${item._id}`,
          item,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      
      await batchUpdate(itemsToSave, 50); 
      setMessage("All items updated successfully.");
      setIsEditMode(false);
      
      // Refresh the menu
      const res = await axios.get(
        `/api/admin/${restaurantId}/menu`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingItems(res.data);
      
    } catch (err) {
      setError("Failed to save changes: " + (err.response?.data?.message || err.message));
    }
  };

  const handleMenuClick = () => {
    window.open(`https://app.avenirya.com/menu/${restaurantId}`, "_blank");
  };


  const allCategories = [...new Set([...existingItems.map((i) => i.category), ...menuItems.map((i) => i.category)])];
  const groupedItems = allCategories.map(cat => ({
    category: cat,
    items: existingItems.filter(item => item.category === cat)
  }));

  return (
    <div className="p-4 max-w-6xl mx-auto">
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
            )}<div className="relative">
  {restaurant.membership_level === 1 ? (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        className="border p-2 rounded cursor-not-allowed opacity-50 flex-1"
        onClick={(e) => {
          e.preventDefault();
          alert("Please upgrade your plan to upload images.");
        }}
      />

      {/* Get Premium button with tooltip */}
      <div className="relative flex flex-col items-center">
        <span
          className="w-20 h-6 flex items-center justify-center rounded-full bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-md border border-blue-300"
          onClick={() => window.location.href = "https://app.avenirya.com/upgrade"}
        >
          Get Premium
        </span>
        {/* Tooltip */}
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 text-xs text-white bg-gray-900 rounded-lg py-2 px-3 opacity-0 hover:opacity-100 transition-opacity duration-200 shadow-lg pointer-events-none">
          Pro Feature: Image upload is available only for paid members.
        </span>
      </div>
    </div>
  ) : (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="border p-2 rounded"
    />
  )}
</div>

        </div>
        {itemForm.image && (
          <div className="mt-2">
            <img 
              src={itemForm.image} 
              alt="Preview" 
              className="h-24 object-contain border rounded" 
            />
            <p className="text-xs text-gray-500 mt-1">
              {itemForm.image.startsWith('data:') ? "" : "Existing image"}
            </p>
          </div>
        )}
        {itemForm._id ? (
          <button onClick={handleUpdate} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Update Item
          </button>
        ) : (
          <button onClick={addItemToList} className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Item
          </button>
        )}
      </div>

      {message && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {menuItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Items To Upload</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {menuItems.map((item, idx) => (
              <div key={idx} className="border p-3 rounded shadow bg-white">
                <h4 className="font-semibold">{item.name}</h4>
                <p>{item.description}</p>
                <p className="text-green-600">₹{item.price}</p>
                {item.image && (
                  <img 
                    src={item.image} 
                    className="mt-2 h-24 object-contain border rounded" 
                    alt="preview" 
                  />
                )}
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={handleUpload} 
            disabled={uploading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
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
           <button
  type="button"
  className="mb-3 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2"
  onClick={() => {
    if (restaurant.membership_level === 1 || restaurant.membership_level === 2) {
      alert("Please upgrade your plan to use this feature.");
    } else {
      fetchAllImages();
    }
  }}
>
  Fetch All Images
  <span
    className="relative group ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-white text-blue-700 font-bold text-xs cursor-pointer shadow-md border border-blue-300"
  >
    i
    <span className="absolute bottom-full mb-2 w-56 text-xs text-white bg-gray-900 rounded-lg py-2 px-3 opacity-0 
    group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10
    left-1/2 transform -translate-x-1/2
    max-w-[90vw] 
    sm:left-auto sm:right-0">
  <strong>Pro Feature:</strong> This will automatically get all the images for all dishes you added.
</span>

  </span>
</button>

              <div className="space-y-3 w-full">
  {editedItems.map((item, index) => (
    <div
      key={item._id}
      className="w-full flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 p-3 border rounded shadow bg-white"
      onPaste={(e) => handlePasteImage(e, index)}
    >
     {/* Image Preview and Upload - hide for membership level 1 */}
{restaurant.membership_level > 1 && item.image && (
  <div className="flex flex-col items-center sm:items-start">
    <img
      src={item.image}
      alt="preview"
      className="h-14 w-14 object-cover rounded border"
    />
    <span className="text-xs text-gray-500 mt-1 text-center sm:text-left">
      {item.image.startsWith("data:") ? "New image" : "Existing"}
    </span>
  </div>
)}

{restaurant.membership_level > 1 && (
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImageFileChange(e, index)}
    className="text-sm border rounded px-2 py-1 w-full sm:w-auto"
  />
)}

      {/* Dish Name */}
      <input
        value={item.name}
        onChange={(e) => updateEditedItem(index, "name", e.target.value)}
        className="border p-2 rounded text-sm flex-1 w-full sm:w-auto min-w-[120px]"
        placeholder="Name"
      />

      {/* Description */}
      <input
        value={item.description}
        onChange={(e) => updateEditedItem(index, "description", e.target.value)}
        className="border p-2 rounded text-sm flex-1 w-full sm:w-auto min-w-[150px]"
        placeholder="Description"
      />

      {/* Price */}
      <input
        value={item.price}
        onChange={(e) =>
          /^[0-9]*$/.test(e.target.value) &&
          updateEditedItem(index, "price", e.target.value)
        }
        className="border p-2 rounded text-sm w-full sm:w-20 text-center"
        placeholder="₹"
      />

      {/* Category */}
      <div className="flex flex-col w-full sm:w-44">
        <select
          value={allCategories.includes(item.category) ? item.category : "__custom__"}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__custom__") {
              setCustomEditCategories((prev) => ({ ...prev, [item._id]: true }));
              updateEditedItem(index, "category", "");
            } else {
              setCustomEditCategories((prev) => ({ ...prev, [item._id]: false }));
              updateEditedItem(index, "category", val);
            }
          }}
          className="border p-2 rounded text-sm w-full"
        >
          <option value="">Select Category</option>
          {allCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__custom__">➕ Custom</option>
        </select>

        {customEditCategories[item._id] && (
          <input
            type="text"
            placeholder="Enter category"
            value={item.category}
            onChange={(e) => updateEditedItem(index, "category", e.target.value)}
            className="mt-1 border p-1 rounded text-sm w-full"
          />
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={async () => {
          setSavingItems((prev) => ({ ...prev, [item._id]: "saving" }));
          try {
            let imageUrl = item.image;

            if (item.image.startsWith("data:")) {
              imageUrl = await uploadImageToWordPress(
                item.image,
                `${item.name.replace(/\s+/g, "-")}_${item.category.replace(
                  /\s+/g,
                  "-"
                )}.jpg`
              );
            }

            const updatedItem = { ...item, image: imageUrl };

            await axios.put(
              `/api/admin/${restaurantId}/menu/${item._id}`,
              updatedItem,
              { headers: { Authorization: `Bearer ${token}` } }
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
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm mt-2 sm:mt-0"
        disabled={savingItems[item._id] === "saving"}
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


              <div className="flex gap-4 mt-4">
                <button 
                  onClick={saveAllEditedItems} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save All Changes
                </button>
                <button 
                  onClick={() => setIsEditMode(false)} 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            groupedItems.sort((a, b) => a.category.localeCompare(b.category)).map((group, index) => (
             <div key={index} className="mb-8">
<h4 className="text-xl font-bold mb-4 text-blue-700 border-b pb-1">{group.category}</h4>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {group.items.map((item, i) => (
    <div
      key={i}
      className="p-4 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200 flex gap-4"
    >
      {/* Left: Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 object-cover rounded border flex-shrink-0"
        />
      )}

      {/* Right: Info */}
      <div className="flex-1 flex flex-col">
        {/* Name */}
        <h4 className="font-semibold text-lg">{item.name}</h4>

        {/* Description */}
        <p className="text-sm text-gray-600 flex-1">{item.description}</p>

        {/* Price */}
        <p className="text-green-700 font-semibold mt-1">₹{item.price}</p>

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleEditItem(item)}
            className="flex-1 text-xs px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="flex-1 text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

</div>

            ))
          )}
          <button
        onClick={handleMenuClick}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-colors duration-200 z-50"
      >
        {/* Menu Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        My Menu
      </button>
        </div>
      )}
  <QRCodeTemplates
  restaurantId={restaurantId}
  membership_level={restaurant.membership_level}
/>

    </div>
  );
}

export default BulkUploadmenu1;