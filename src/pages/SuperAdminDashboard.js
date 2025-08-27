import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Edit,
  Trash,
  LogIn,
  BookOpen,
  Loader2,
  Upload,
  Plus,
  Search,
} from "lucide-react";
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
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // 🔑 Page lock state
  const [unlocked, setUnlocked] = useState(
    localStorage.getItem("superAdminUnlocked") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");

  // 🔍 Search + pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 75;

  const agencyLevel = parseInt(localStorage.getItem("agencyLevel") || "1", 10);
  const limits = {
    1: 10,
    2: 25,
    3: 50,
  };

  const API = "/api/admin";
  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  const agencyId = localStorage.getItem("agencyId");

  useEffect(() => {
    if (agencyId) {
      setForm((prev) => ({ ...prev, subadmin_id: agencyId }));
      fetchRestaurantsByAgency(agencyId);
    }
  }, [agencyId]);

  const fetchRestaurantsByAgency = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/restaurants`);
      setRestaurants(res.data);
    } catch (err) {
      toast.error("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      toast.error(err.response?.data?.message || "Failed to login as restaurant");
    }
  };

  const uploadImageToWordPress = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    setUploading(true);

    try {
      const response = await axios.post(
        `${WP_SITE_URL}/wp-json/wp/v2/media`,
        formDataImage,
        {
          headers: {
            Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        }
      );

      const imageUrl = response.data.source_url;
      setForm((prev) => ({ ...prev, logo: imageUrl }));
      toast.success("Logo uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image to WordPress");
    } finally {
      setUploading(false);
    }
  };

  // 🔍 Filtering restaurants
  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contact?.toString().includes(searchQuery)
  );

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔑 Password lock screen
  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">
            🔒 Enter Password
          </h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 border rounded-lg mb-4"
          />
          <button
            onClick={() => {
              if (passwordInput === "Yash$5828") {
                setUnlocked(true);
                localStorage.setItem("superAdminUnlocked", "true");
                toast.success("Access granted!");
              } else {
                toast.error("Wrong password!");
              }
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Unlock
          </button>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  if (!agencyId)
    return (
      <p className="text-center text-red-600 mt-10">
        ⚠ You must be logged in as an agency.
      </p>
    );

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

      <Toaster position="top-right" />

      <div className="relative p-6 md:p-10 font-sans max-w-6xl mx-auto">
        {/* Add button */}
        <button
          onClick={() => {
            if (restaurants.length >= (limits[agencyLevel] || 0)) {
              toast.error(
                `Your agency level allows only ${limits[agencyLevel]} restaurants`
              );
              return;
            }
            setFormOpen(true);
          }}
          className="mb-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <Plus size={20} /> Add Restaurant
        </button>

        {/* 🔍 Search */}
        <div className="mb-6 flex items-center gap-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg flex-1"
          />
        </div>

        {/* Popup form */}
        {formOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* ... SAME FORM CODE AS BEFORE ... */}
          </div>
        )}

        {/* Table */}
        <div className="bg-white p-6 rounded-2xl shadow relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Registered Restaurants ({restaurants.length})
          </h2>
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
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {paginatedRestaurants.map((rest, idx) => (
                    <tr
                      key={rest._id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-3 border text-center">
                        {rest.logo ? (
                          <img
                            src={rest.logo}
                            alt="logo"
                            className="h-10 w-10 object-cover rounded-full mx-auto"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3 border">{rest.name}</td>
                      <td className="p-3 border">{rest.contact || "-"}</td>
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
                  {filteredRestaurants.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-3 text-center text-gray-500"
                      >
                        No restaurants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 📄 Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
