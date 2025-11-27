import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Edit, Trash, LogIn, BookOpen, Loader2, Upload, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const SuperAdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    logo: "",
    contact: "",
    password: "",
    subadmin_id: "",
    membership_level: "",
    currency: "INR",
    homeImage: "",
    active: true,
    billing: true, // 🆕 Added billing to form state
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // State for dropdowns
  const [showDropdown, setShowDropdown] = useState(null); // For QR Menu
  const [showBillingDropdown, setShowBillingDropdown] = useState(null); // 🆕 For Billing

  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef(null);
  const agencyLevel = parseInt(localStorage.getItem("agencyLevel") || "1", 10);
  const limits = {
    1: 10,
    2: 25,
    3: 10000,
  };

  const API = "/api/admin";
  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  ];

  const [uploadingHome, setUploadingHome] = useState(false);

  const uploadHomeImageToWordPress = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    setUploadingHome(true);

    try {
      const response = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, formDataImage, {
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      });

      const imageUrl = response.data.source_url;
      setForm((prev) => ({ ...prev, homeImage: imageUrl }));
      toast.success("Home image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload home image to WordPress");
    } finally {
      setUploadingHome(false);
    }
  };

  const agencyId = localStorage.getItem("agencyId");

  useEffect(() => {
    if (agencyId) {
      setForm((prev) => ({ ...prev, subadmin_id: agencyId }));
      fetchRestaurantsByAgency(agencyId);
    }
  }, [agencyId]);

  const fetchRestaurantsByAgency = async () => {
    try {
      const res = await axios.get(`${API}/restaurants`);
      setRestaurants(res.data);
    } catch (err) {
      alert("Failed to fetch restaurants");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const payload = { ...form, membership_level: 3 };
      if (!payload.password) delete payload.password;

      if (editingId) {
        await axios.put(`${API}/restaurants/${editingId}`, payload);
        toast.success("Restaurant updated successfully!");
      } else {
        await axios.post(`${API}/restaurant/register`, payload);
        toast.success("Restaurant created successfully!");
      }

      setForm({
        name: "",
        email: "",
        address: "",
        logo: "",
        contact: "",
        password: "",
        currency: "INR",
        subadmin_id: agencyId,
        membership_level: "",
      });
      setEditingId(null);
      setFormOpen(false);
      fetchRestaurantsByAgency(agencyId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save restaurant");
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setForm({
      name: restaurant.name,
      email: restaurant.email,
      address: restaurant.address,
      logo: restaurant.logo || "",
      contact: restaurant.contact || "",
      password: "",
      subadmin_id: restaurant.subadmin_id || agencyId,
      homeImage: restaurant.homeImage || "",
      active: typeof restaurant.active === "boolean" ? restaurant.active : true,
      billing: typeof restaurant.billing === "boolean" ? restaurant.billing : true, // 🆕 Handle billing edit
      currency: restaurant.currency || "INR",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`${API}/restaurants/${id}`);
        toast.success("Restaurant deleted successfully");
        fetchRestaurantsByAgency(agencyId);
      } catch (err) {
        toast.error("Failed to delete restaurant");
      }
    }
  };

  const handleRestaurantLogin = async (restaurantId) => {
    try {
      const agencyToken = localStorage.getItem("agencyToken");
      if (!agencyToken) {
        toast.error("This Page is Not For You....!");
        return;
      }

      const res = await axios.post(
        `${API}/agency-login-restaurant/${restaurantId}`,
        {},
        { headers: { Authorization: `Bearer ${agencyToken}` } }
      );

      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("restaurantId", data.restaurant._id);
      localStorage.setItem("impersonatedBy", "agency");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to login as restaurant");
    }
  };

  const uploadImageToWordPress = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    setUploading(true);

    try {
      const response = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, formDataImage, {
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      });

      const imageUrl = response.data.source_url;
      setForm((prev) => ({ ...prev, logo: imageUrl }));
      toast.success("Logo uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image to WordPress");
    } finally {
      setUploading(false);
    }
  };

  if (!agencyId)
    return (
      <p className="text-center text-red-600 mt-10">
        ⚠ You must be logged in as an agency.
      </p>
    );

  return (
    <div className="relative min-h-screen">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

      <Toaster position="top-right" />

      <div className="relative p-6 md:p-10 font-sans max-w-6xl mx-auto">
        <button
          onClick={() => {
            if (restaurants.length >= (limits[agencyLevel] || 0)) {
              toast.error(`Your agency level allows only ${limits[agencyLevel]} restaurants`);
              return;
            }
            setFormOpen(true);
          }}
          className="mb-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <Plus size={20} /> Add Restaurant
        </button>

        {formOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow relative">
              <button
                onClick={() => setFormOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {editingId ? "Edit Restaurant" : "Add Restaurant"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input type="number" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input name="password" type="password" placeholder={editingId ? "Change Password (optional)" : "Password"} value={form.password} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                
                <div className="md:col-span-2 mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Upload Home Image
                  </label>
                  <div className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadHomeImageToWordPress(e.target.files[0])}
                      className="hidden"
                      id="homeImageUpload"
                    />
                    <label htmlFor="homeImageUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                      <Upload size={24} />
                      <span>Click or drag to upload</span>
                    </label>
                  </div>
                  {uploadingHome && <p className="text-blue-500 mt-2 flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Uploading...</p>}
                  {form.homeImage && <img src={form.homeImage} alt="Home" className="mt-3 rounded-md h-20 object-cover border" />}
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Upload Logo
                  </label>
                  <div className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                    <input type="file" accept="image/*" onChange={(e) => uploadImageToWordPress(e.target.files[0])} className="hidden" id="logoUpload" />
                    <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                      <Upload size={24} />
                      <span>Click or drag to upload</span>
                    </label>
                  </div>
                  {uploading && <p className="text-blue-500 mt-2 flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Uploading...</p>}
                  {form.logo && <img src={form.logo} alt="Uploaded" className="mt-3 rounded-md h-20 object-cover border" />}
                </div>
              </div>
              <div>
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-600">
                  Select Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:ring focus:ring-blue-300 w-full"
                >
                  {currencies.map((cur) => (
                    <option key={cur.code} value={cur.code}>
                      {cur.symbol} {cur.name} ({cur.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={uploading || loading}
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : editingId ? "Update" : "Create"} Restaurant
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registered Restaurants ({restaurants.length})</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg ">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-3 border">Logo</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Contact</th>
                    <th className="p-3 border">QR Status</th>
                    <th className="p-3 border">Billing Status</th> {/* 🆕 New Header */}
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {restaurants.map((rest, idx) => (
                    <tr key={rest._id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border text-center">
                        {rest.logo ? <img src={rest.logo} alt="logo" className="h-10 w-10 object-cover rounded-full mx-auto" /> : "-"}
                      </td>
                      <td className="p-3 border">{rest.name}</td>
                      <td className="p-3 border">{rest.contact || "-"}</td>
                      
                      {/* === ORGINAL QR STATUS COLUMN === */}
                      <td className="p-3 border text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={async () => {
                              if (rest.active) {
                                const confirmMsg = `Are you sure you want to deactivate "${rest.name}"?`;
                                if (!window.confirm(confirmMsg)) return;

                                try {
                                  await axios.put(`${API}/restaurants/${rest._id}`, {
                                    active: false,
                                    expiresAt: null,
                                  });
                                  toast.success(`Restaurant deactivated!`);
                                  fetchRestaurantsByAgency(agencyId);
                                } catch {
                                  toast.error("Failed to deactivate");
                                }
                              } else {
                                setShowDropdown((prev) => (prev === rest._id ? null : rest._id));
                              }
                            }}
                            className={`px-3 py-1 rounded-full font-semibold text-xs ${
                              rest.active
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
                            }`}
                          >
                            {rest.active ? "Active" : "Inactive"}
                          </button>

                          {showDropdown === rest._id && !rest.active && (
                            <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-md text-sm z-50">
                              <p className="px-3 py-2 text-gray-700 font-semibold border-b">Select Duration</p>
                              {[
                                { label: "7 Days", value: "7d" },
                                { label: "1 Month", value: "1m" },
                                { label: "2 Months", value: "2m" },
                                { label: "6 Months", value: "6m" },
                                { label: "1 Year", value: "1y" },
                                { label: "Lifetime", value: "5y" },
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={async () => {
                                    setShowDropdown(null);
                                    const now = new Date();
                                    if (opt.value === "7d") now.setDate(now.getDate() + 7);
                                    else if (opt.value === "1m") now.setMonth(now.getMonth() + 1);
                                    else if (opt.value === "2m") now.setMonth(now.getMonth() + 2);
                                    else if (opt.value === "6m") now.setMonth(now.getMonth() + 6);
                                    else if (opt.value === "1y") now.setFullYear(now.getFullYear() + 1);
                                    else if (opt.value === "5y") now.setFullYear(now.getFullYear() + 5);

                                    const expiresAt = now;
                                    try {
                                      await axios.put(`${API}/restaurants/${rest._id}`, {
                                        active: true,
                                        expiresAt,
                                      });
                                      toast.success(`"${rest.name}" activated for ${opt.label}!`);
                                      fetchRestaurantsByAgency(agencyId);
                                    } catch {
                                      toast.error("Failed to activate");
                                    }
                                  }}
                                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {rest.expiresAt && (() => {
                          const now = new Date();
                          const expiry = new Date(rest.expiresAt);
                          const diffMs = expiry - now;
                          if (diffMs <= 0) return <span className="text-xs text-gray-500"><br />Expired</span>;
                          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          const diffMonths = Math.floor(diffDays / 30);
                          const diffYears = Math.floor(diffDays / 365);
                          let timeLeft = diffYears >= 1 ? `${diffYears}y left` : diffMonths >= 1 ? `${diffMonths}m left` : `${diffDays}d left`;
                          return <span className="text-xs text-gray-500"><br />{timeLeft}</span>;
                        })()}
                      </td>

                      {/* === 🆕 NEW BILLING STATUS COLUMN === */}
                      <td className="p-3 border text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={async () => {
                              if (rest.billing) {
                                const confirmMsg = `Are you sure you want to deactivate Billing for "${rest.name}"?`;
                                if (!window.confirm(confirmMsg)) return;

                                try {
                                  // 🆕 Updates billing and billingExpiresAt
                                  await axios.put(`${API}/restaurants/${rest._id}`, {
                                    billing: false,
                                    billingExpiresAt: null,
                                  });
                                  toast.success(`Billing deactivated!`);
                                  fetchRestaurantsByAgency(agencyId);
                                } catch {
                                  toast.error("Failed to deactivate billing");
                                }
                              } else {
                                // 🆕 Uses showBillingDropdown
                                setShowBillingDropdown((prev) => (prev === rest._id ? null : rest._id));
                              }
                            }}
                            className={`px-3 py-1 rounded-full font-semibold text-xs ${
                              rest.billing
                                ? "bg-purple-100 text-purple-700 border border-purple-300" // Different color for distinction
                                : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
                            }`}
                          >
                            {rest.billing ? "Active" : "Inactive"}
                          </button>

                          {/* 🆕 Billing Dropdown */}
                          {showBillingDropdown === rest._id && !rest.billing && (
                            <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-md text-sm z-50">
                              <p className="px-3 py-2 text-gray-700 font-semibold border-b">Select Plan</p>
                              {[
                                { label: "7 Days", value: "7d" },
                                { label: "1 Month", value: "1m" },
                                { label: "2 Months", value: "2m" },
                                { label: "6 Months", value: "6m" },
                                { label: "1 Year", value: "1y" },
                                { label: "Lifetime", value: "5y" },
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={async () => {
                                    setShowBillingDropdown(null);
                                    const now = new Date();
                                    if (opt.value === "7d") now.setDate(now.getDate() + 7);
                                    else if (opt.value === "1m") now.setMonth(now.getMonth() + 1);
                                    else if (opt.value === "2m") now.setMonth(now.getMonth() + 2);
                                    else if (opt.value === "6m") now.setMonth(now.getMonth() + 6);
                                    else if (opt.value === "1y") now.setFullYear(now.getFullYear() + 1);
                                    else if (opt.value === "5y") now.setFullYear(now.getFullYear() + 5);

                                    const billingExpiresAt = now;
                                    try {
                                      // 🆕 Updates billing and billingExpiresAt
                                      await axios.put(`${API}/restaurants/${rest._id}`, {
                                        billing: true,
                                        billingExpiresAt,
                                      });
                                      toast.success(`Billing activated for ${opt.label}!`);
                                      fetchRestaurantsByAgency(agencyId);
                                    } catch {
                                      toast.error("Failed to activate billing");
                                    }
                                  }}
                                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* 🆕 Billing Expiry Counter */}
                        {rest.billingExpiresAt && (() => {
                          const now = new Date();
                          const expiry = new Date(rest.billingExpiresAt);
                          const diffMs = expiry - now;
                          if (diffMs <= 0) return <span className="text-xs text-gray-500"><br />Expired</span>;
                          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          const diffMonths = Math.floor(diffDays / 30);
                          const diffYears = Math.floor(diffDays / 365);
                          let timeLeft = diffYears >= 1 ? `${diffYears}y left` : diffMonths >= 1 ? `${diffMonths}m left` : `${diffDays}d left`;
                          return <span className="text-xs text-gray-500"><br />{timeLeft}</span>;
                        })()}
                      </td>

                      <td className="p-3 border text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(rest)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(rest._id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800"
                          >
                            <Trash size={18} /> Delete
                          </button>

                          <a
                            href={`/menu/${rest._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                          >
                            <BookOpen size={18} /> Menu
                          </a>

                          <button
                            onClick={() => handleRestaurantLogin(rest._id)}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800"
                          >
                            <LogIn size={18} /> Login
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {restaurants.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-3 text-center text-gray-500">
                        No restaurants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;