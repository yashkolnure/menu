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
    membership_level: 3,
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState(""); // 🔹 search state
  const [currentPage, setCurrentPage] = useState(1); // 🔹 pagination state
  const formRef = useRef(null);

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
        subadmin_id: agencyId,
        membership_level: 3,
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
    const superAdminToken = localStorage.getItem("token"); // your superadmin JWT

    let endpoint = "";
    let headers = {};

    if (superAdminToken) {
      // ✅ Super Admin impersonation route
      endpoint = `/api/admin/superadmin-login-restaurant/${restaurantId}`;
      headers = { Authorization: `Bearer ${superAdminToken}` };
    } else {
      toast.error("You must be logged in.");
      return;
    }

    const res = await axios.post(endpoint, {}, { headers });

    const data = res.data;
    localStorage.setItem("token", data.token); // now impersonating as restaurant
    localStorage.setItem("restaurantId", data.restaurant._id);

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

  // 🔹 Search filter
  const filteredRestaurants = restaurants.filter((rest) =>
    rest.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Pagination logic
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);

  if (!agencyId)
    return (
      <p className="text-center text-red-600 mt-10">
        ⚠ You must be logged in as an agency.
      </p>
    );

  return (
    <div className="relative min-h-screen">
      <Toaster position="top-right" />

      <div className="relative p-6 md:p-10 font-sans max-w-6xl mx-auto">
        {/* Add + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => {
              if (restaurants.length >= (limits[agencyLevel] || 0)) {
                toast.error(`Your agency level allows only ${limits[agencyLevel]} restaurants`);
                return;
              }
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            <Plus size={20} /> Add Restaurant
          </button>

          {/* 🔹 Search input */}
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="p-3 border rounded-lg focus:ring focus:ring-blue-300 w-full md:w-64"
          />
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-2xl shadow relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Registered Restaurants ({filteredRestaurants.length})
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg">
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
                    <tr key={rest._id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
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
                  {paginatedRestaurants.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-3 text-center text-gray-500">
                        No restaurants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 🔹 Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
