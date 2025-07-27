import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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

const PIXABAY_API_KEY = "51506332-d6cb9f895d10ba3259be57ec5"; // Replace with your key

async function fetchImageForItem(_, index) {
  const item = editedItems[index];
  const dishName = item?.name;
  const description = item?.description;

  if (!dishName && !description) {
    setError("Dish name or description required to fetch image.");
    return;
  }

  const fullQuery = `${dishName ?? ""} ${description ?? ""} food`
    .replace(/\(.*?\)/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  try {
    setSavingItems(prev => ({ ...prev, [item._id]: "fetching" }));

    let query = encodeURIComponent(fullQuery);
    let url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&per_page=3&safesearch=true`;

    let res = await fetch(url);
    let data = await res.json();

    // Fallback: Try with just dish name if description-based search fails
    if ((!data.hits || data.hits.length === 0) && dishName) {
      query = encodeURIComponent(`${dishName} food`);
      url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&per_page=3&safesearch=true`;
      res = await fetch(url);
      data = await res.json();
    }

    if (data.hits && data.hits.length > 0) {
      const imageUrl = data.hits[0].largeImageURL;
      const imgBlob = await fetch(imageUrl).then(r => r.blob());
      const reader = new FileReader();
      reader.onloadend = () => {
        updateEditedItem(index, "image", reader.result); // base64
        setSavingItems(prev => ({ ...prev, [item._id]: undefined }));
      };
      reader.readAsDataURL(imgBlob);
    } else {
      setError(`No image found for "${dishName}"`);
      setSavingItems(prev => ({ ...prev, [item._id]: undefined }));
    }
  } catch (err) {
    setError("Failed to fetch image: " + err.message);
    setSavingItems(prev => ({ ...prev, [item._id]: undefined }));
  }
}
async function fetchAllImages() {
  for (let i = 0; i < editedItems.length; i++) {
    if (!editedItems[i].image || editedItems[i].image.startsWith('data:')) {
      await fetchImageForItem(null, i);
    }
  }
}





async function batchUpdate(items, batchSize = 5) {
  let index = 0;
  while (index < items.length) {
    const batch = items.slice(index, index + batchSize);
    await Promise.all(
      batch.map(item =>
        axios.put(
          `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${item.restaurantId}/menu/${item._id}`,
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
      setMessage("");
      setError("");
      
      // First upload all images to WordPress
      const itemsWithImageUrls = await Promise.all(
        menuItems.map(async (item) => {
          if (item.image.startsWith('data:')) {
            try {
              const imageUrl = await uploadImageToWordPress(
                item.image,
                `${item.name.replace(/\s+/g, '-')}-${Date.now()}.jpg`
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
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/bulk`,
        itemsWithImageUrls,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage("Upload successful");
      setMenuItems([]);
      
      // Refresh the existing items
      const res = await axios.get(
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu`,
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
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${itemForm._id}`,
        updatedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null });
      setMessage("Updated successfully");
      
      // Refresh the menu
      const res = await axios.get(
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingItems(res.data);
      
    } catch (err) {
      setError("Update failed: " + (err.response?.data?.message || err.message));
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
                `${item.name.replace(/\s+/g, '-')}-${Date.now()}.jpg`
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
          `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${item._id}`,
          item,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      
      await batchUpdate(itemsToSave, 50); 
      setMessage("All items updated successfully.");
      setIsEditMode(false);
      
      // Refresh the menu
      const res = await axios.get(
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingItems(res.data);
      
    } catch (err) {
      setError("Failed to save changes: " + (err.response?.data?.message || err.message));
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
        {itemForm.image && (
          <div className="mt-2">
            <img 
              src={itemForm.image} 
              alt="Preview" 
              className="h-24 object-contain border rounded" 
            />
            <p className="text-xs text-gray-500 mt-1">
              {itemForm.image.startsWith('data:') ? "New image (will be uploaded to WordPress)" : "Existing image"}
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
                className="mb-3 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                onClick={fetchAllImages}
              >
                Fetch All Images
              </button>
              <div className="space-y-3 w-full">
                {editedItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="w-full flex flex-wrap items-center gap-3 p-3 border rounded shadow bg-white"
                    onPaste={(e) => handlePasteImage(e, index)}
                  >
                    {/* Image Preview */}
                    {item.image && (
                      <div className="flex flex-col">
                        <img
                          src={item.image}
                          alt="preview"
                          className="h-14 w-14 object-cover rounded border"
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          {item.image.startsWith('data:') ? "New image" : "Existing"}
                        </span>
                      </div>
                    )}

                    {/* Image Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, index)}
                      className="text-sm border rounded px-2 py-1"
                    />

                    {/* Dish Name */}
                    <div className="flex items-center gap-2">
                    <input
                      value={item.name}
                      onChange={(e) => updateEditedItem(index, "name", e.target.value)}
                      className="border p-2 rounded text-sm flex-1 min-w-[120px]"
                      placeholder="Name"
                    />
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => fetchAllImages(item.name, index)}
                      title="Fetch image from Pixabay"
                    >
                      Fetch Image
                    </button>
                  </div>

                    {/* Description */}
                    <input
                      value={item.description}
                      onChange={(e) => updateEditedItem(index, "description", e.target.value)}
                      className="border p-2 rounded text-sm flex-1 min-w-[150px]"
                      placeholder="Description"
                    />

                    {/* Price */}
                    <input
                      value={item.price}
                      onChange={(e) => /^[0-9]*$/.test(e.target.value) && updateEditedItem(index, "price", e.target.value)}
                      className="border p-2 rounded text-sm w-20 text-center"
                      placeholder="₹"
                    />

                    {/* Category */}
                    <div className="flex flex-col w-44">
                      <select
                        value={allCategories.includes(item.category) ? item.category : "__custom__"}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "__custom__") {
                            setCustomEditCategories(prev => ({ ...prev, [item._id]: true }));
                            updateEditedItem(index, "category", "");
                          } else {
                            setCustomEditCategories(prev => ({ ...prev, [item._id]: false }));
                            updateEditedItem(index, "category", val);
                          }
                        }}
                        className="border p-2 rounded text-sm"
                      >
                        <option value="">Select Category</option>
                        {allCategories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                        <option value="__custom__">➕ Custom</option>
                      </select>

                      {customEditCategories[item._id] && (
                        <input
                          type="text"
                          placeholder="Enter category"
                          value={item.category}
                          onChange={(e) => updateEditedItem(index, "category", e.target.value)}
                          className="mt-1 border p-1 rounded text-sm"
                        />
                      )}
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={async () => {
                          setSavingItems(prev => ({ ...prev, [item._id]: "saving" }));
                          try {
                            let imageUrl = item.image;
                            
                            // If it's a new image, upload to WordPress first
                            if (item.image.startsWith('data:')) {
                              imageUrl = await uploadImageToWordPress(
                                item.image,
                                `${item.name.replace(/\s+/g, '-')}-${Date.now()}.jpg`
                              );
                            }
                            
                            const updatedItem = { ...item, image: imageUrl };
                            
                            await axios.put(
                              `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/menu/${item._id}`,
                              updatedItem,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            
                            setSavingItems(prev => ({ ...prev, [item._id]: "saved" }));
                            setMessage(`Saved: ${item.name}`);
                            setTimeout(() => {
                                setSavingItems(prev => ({ ...prev, [item._id]: undefined }));
                            }, 1200);
                          } catch {
                            setSavingItems(prev => ({ ...prev, [item._id]: undefined }));
                            setError("Save failed");
                          }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
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
              <div key={index} className="mb-6">
                <h4 className="text-lg font-bold mb-2 text-blue-700 border-b pb-1">{group.category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {group.items.map((item, i) => (
                    <div key={i} className="p-4 border rounded bg-white shadow relative">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm">{item.description}</p>
                      <p className="text-green-700 font-semibold">₹{item.price}</p>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-24 w-full object-contain mt-2 rounded border" 
                        />
                      )}
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleEditItem(item)} 
                          className="text-xs px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <QRCodeTemplates restaurantId={restaurantId} />

    </div>
  );
}

export default BulkUploadmenu1;