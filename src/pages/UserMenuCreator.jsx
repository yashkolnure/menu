import React, { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

function UserMenuCreator() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customInputs, setCustomInputs] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const apiBase = "https://menubackend-git-main-yashkolnures-projects.vercel.app";

  useEffect(() => {
    if (!restaurantId || !token) {
      setError("Login required.");
      setLoading(false);
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
      } finally {
        setLoading(false);
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

  const handleAddItem = async (item, expand = false) => {
  try {
    setMessage("");
    setError("");
    // POST to backend
    const res = await axios.post(
      `${apiBase}/api/admin/${restaurantId}/menu`,
      item,
      { headers }
    );
    const savedItem = res.data;
    const updatedItems = [...menuItems, savedItem];
    setMenuItems(updatedItems);
    if (!categories.includes(savedItem.category)) {
      setCategories([...categories, savedItem.category]);
    }
    if (expand) {
      setTimeout(() => {
        setExpandedItems((prev) => ({
          ...prev,
          [savedItem._id || `temp-${Date.now()}`]: true,
        }));
      }, 100);
    }
    setMessage("Dish added successfully!");
  } catch (err) {
    setError("Failed to add dish.");
    console.error(err);
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

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNewCategoryAdd = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    handleAddItem({
      name: "",
      description: "",
      price: 0,
      category: name,
      image: "data:image/webp;base64,...",
      restaurantId
    }, true);
    setNewCategoryName("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        ⏳ Loading menu, please wait...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📋 Edit Your Menu</h1>

      <div className="mb-4 p-3 text-sm bg-blue-50 rounded text-blue-800 border border-blue-200">
        💡 Tip: Click on a dish name to expand and edit its details. You can add new categories and menu items easily below.
      </div>

      {/* Global Add Dish Form */}
      <div className="mb-6 p-4 border rounded-md bg-green-50">
        <h3 className="font-semibold mb-2 text-green-700">🍽️ Add New Dish</h3>

        <button
          className="w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded text-lg font-semibold"
          onClick={() => setExpandedItems(prev => ({ ...prev, addDish: !prev.addDish }))}
        >
          {expandedItems.addDish ? "🔽 Hide Dish Form" : "➕ Add New Dish"}
        </button>

        {expandedItems.addDish && (
          <div className="mt-4 space-y-3">
            <input
              className="w-full border p-2 rounded"
              placeholder="Dish Name"
              value={customInputs.name || ""}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={customInputs.description || ""}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, description: e.target.value }))}
            />
            <input
              className="w-full border p-2 rounded"
              type="number"
              placeholder="Price"
              value={customInputs.price || ""}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, price: e.target.value }))}
            />
            <select
              className="w-full border p-2 rounded"
              value={customInputs.category || ""}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
              <option value="custom">➕ Custom...</option>
            </select>
            {customInputs.category === "custom" && (
              <input
                className="mt-2 w-full border p-2 rounded"
                placeholder="Enter custom category"
                value={customInputs.customCategory || ""}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, customCategory: e.target.value }))}
              />
            )}
            <button
              className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded"
              onClick={() => {
                const name = customInputs.name?.trim();
                const price = parseFloat(customInputs.price);
                const category = customInputs.category === "custom" ? customInputs.customCategory : customInputs.category;
                const description = customInputs.description?.trim() || "";

                if (!name || !category || isNaN(price)) {
                  alert("Please fill all fields correctly.");
                  return;
                }

                handleAddItem({
                  name,
                  description,
                  price,
                  category,
                  image: "data:image/webp;base64,...",
                  restaurantId,
                }, true);

                setCustomInputs({});
                setExpandedItems(prev => ({ ...prev, addDish: false }));
              }}
            >
              ✅ Save Dish
            </button>
          </div>
        )}
      </div>

      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{category}</h2>

          </div>

          <div className="space-y-4">
            {items.map((item, idx) => {
              const globalIndex = menuItems.findIndex((m) => m === item);
              const itemId = item._id || `${item.name}-${globalIndex}`;
              const isExpanded = expandedItems[itemId];

              return (
                <div key={itemId} className="border rounded-md shadow p-3 bg-white">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpanded(itemId)}
                    title="Click to expand and edit"
                  >
                    <h3 className="text-lg font-semibold">{item.name || "Unnamed Dish"}</h3>
                    <span className="text-sm text-blue-500">{isExpanded ? "Hide" : "Edit"}</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      <input
                        className="w-full border p-2 rounded"
                        value={item.name}
                        placeholder="Dish Name"
                        onChange={(e) => handleInputChange(globalIndex, "name", e.target.value)}
                      />
                      <select
                        className="w-full border p-2 rounded"
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
                          className="mt-2 w-full border p-2 rounded"
                          placeholder="Enter custom category"
                          value={item.category}
                          onChange={(e) => handleCustomCategoryInput(globalIndex, e.target.value)}
                        />
                      )}
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleInputChange(globalIndex, "description", e.target.value)}
                      />
                      <input
                        className="w-full border p-2 rounded"
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleInputChange(globalIndex, "price", e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
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
                          className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                        >
                          {savingIndex === globalIndex ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, globalIndex)}
                          className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600"
                        >
                          {deletingIndex === globalIndex ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
{/* QR Code Template Section */}
<div className="mt-12 border-t pt-10">
  <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
    📱 Restaurant QR Code Stickers
  </h3>

  {/* Free Simple QR */}
  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center mb-10">
    <div className="p-4 border rounded-lg bg-gray-50">
      <QRCodeCanvas
        value={`https://app.avenirya.com/menu/${restaurantId}`}
        size={180}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={false}
      />
    </div>
    <button
      onClick={() => {
        const qrElement = document.querySelector("#freeQR");
        html2canvas(qrElement, { useCORS: true, scale: 3 }).then((canvas) => {
          const link = document.createElement("a");
          link.download = `simple_qr_${restaurantId}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        });
      }}
      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow transition-all duration-200"
    >
      ⬇️ Download Free QR
    </button>
  </div>

  {/* Premium QR Templates */}
  <h4 className="text-lg font-semibold text-center text-gray-700 mb-4">
    Premium QR Code Stickers (Download Locked)
  </h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[
      {
        id: "template1",
        img: "https://website.avenirya.com/wp-content/uploads/2025/07/to-See-the-Full-Menu-2.png",
      },
      {
        id: "template2",
        img: "https://website.avenirya.com/wp-content/uploads/2025/07/Beige-Minimalist-Discount-QR-Code-Business-Square-Sticker-600-x-900-px.png",
      },
      {
        id: "template3",
        img: "https://website.avenirya.com/wp-content/uploads/2025/07/Orange-and-Yellow-Modern-Simple-Scan-for-Menu-Rectangle-Sticker.png",
      },
    ].map((template, index) => (
      <div
        key={template.id}
        className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative"
      >
        <div
          className="relative w-full max-w-xs rounded-md overflow-hidden border border-gray-200 opacity-60"
        >
          <img
            src={template.img}
            alt={`QR Template ${index + 1}`}
            className="w-full h-auto object-contain"
            crossOrigin="anonymous"
          />
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              transform: "translate(-50%, -50%)",
              width: "45%",
            }}
          >
            <QRCodeCanvas
              value={`https://app.avenirya.com/menu/${restaurantId}`}
              size={180}
              bgColor="transparent"
              fgColor="#000000"
              level="H"
              includeMargin={false}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Locked Download Button */}
        <button
          disabled
          className="mt-4 bg-gray-400 text-white px-5 py-2 rounded-full shadow cursor-not-allowed"
        >
          🔒 Premium Only
        </button>
      </div>
    ))}
  </div>

  {/* Live Menu Link */}
  <p className="mt-10 text-center text-sm text-gray-500">
    Link to your live menu:&nbsp;
    <a
      href={`https://app.avenirya.com/menu/${restaurantId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      https://app.avenirya.com/menu/{restaurantId}
    </a>
  </p>
</div>


     
{/* Footer / Promo Section */}
<div className="mt-12 border-t pt-6 text-center text-sm text-gray-600">
  <p className="font-semibold text-gray-800">Powered by <span className="text-blue-600">Petoba</span> by Avenirya Solutions OPC Pvt Ltd</p>
  
  <div className="mt-6 p-4 max-w-xl mx-auto bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm">
    <h3 className="text-lg font-bold text-yellow-800 mb-2">📦 Too busy to upload your menu?</h3>
    <p className="text-sm text-gray-800 mb-4">Let our team handle it for you. We’ll add your full menu in just <span className="font-semibold text-green-700">₹249</span>, including a WhatsApp sticky menu setup.</p>
    
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const name = e.target.restaurantName.value.trim();
        if (name) {
          window.open(`https://wa.me/917499835687?text=Hello%2C%20I%20want%20Petoba%20team%20to%20upload%20my%20menu%20for%20Rs249.%20Restaurant%20Name%3A%20${encodeURIComponent(name)}`, "_blank");
        } else {
          alert("Please enter your restaurant name.");
        }
      }}
      className="flex flex-col sm:flex-row gap-2 items-center justify-center"
    >
      <input
        type="text"
        name="restaurantName"
        placeholder="Your Restaurant Name"
        className="border p-2 rounded w-full sm:w-auto"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        📲 Contact on WhatsApp
      </button>
    </form>

    <p className="text-xs text-gray-500 mt-2">We will reply within a few hours with next steps.</p>
  </div>
</div>
<a
  href="https://wa.me/917499835687?text=Hello%2C%20I%20want%20help%20with%20Petoba%20menu%20upload."
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
>
  <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp" className="w-5 h-5" />
  Chat with Us
</a>



    </div>
  );
}

export default UserMenuCreator;
