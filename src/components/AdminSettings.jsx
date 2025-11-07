import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
import {
  FaStore,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaLock,
  FaMoneyBillAlt,
  // FaAlignJustify, // This icon wasn't used, can be removed
} from "react-icons/fa";

// --- Copied from your reference ---
// ✅ WordPress Upload Credentials (Ideally, move these to a config file)
const WP_USERNAME = "yashkolnure58@gmail.com";
const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
const WP_SITE_URL = "https://website.avenirya.com";

// ✅ Currencies List
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
// --- End of copied section ---

const AdminSettingsModal = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Updated state to match your new fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    password: "",
    confirmPassword: "", // ◀️ Added confirmPassword
    logo: "",
    homeImage: "",
    currency: "INR",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // ✅ New state for loading and saving
  const [loading, setLoading] = useState(false); // For fetching data
  const [saving, setSaving] = useState(false); // For saving data
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHome, setUploadingHome] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");

  // ✅ Updated to fetch main restaurant data
  useEffect(() => {
    if (isOpen && restaurantId) {
      setLoading(true);
      setMessage("Loading data...");
      // Using the endpoint from your reference's PUT request
      fetch(`/api/admin/${restaurantId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch restaurant data");
        })
        .then((data) => {
          if (data) {
            // Set all data EXCEPT password fields
            setFormData({
              name: data.name || "",
              email: data.email || "",
              address: data.address || "",
              contact: data.contact || "",
              logo: data.logo || "",
              homeImage: data.homeImage || "",
              currency: data.currency || "INR",
              password: "", // ◀️ Always keep password field empty on load
              confirmPassword: "", // ◀️ Always keep confirmPassword empty on load
            });
            setMessage("");
          }
        })
        .catch((err) => {
          setMessage(`❌ ${err.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, restaurantId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ WordPress Upload Logic
  const uploadImageToWordPress = async (file, fieldName) => {
    const formDataImage = new FormData();
    formDataImage.append("file", file);

    if (fieldName === "logo") setUploadingLogo(true);
    if (fieldName === "homeImage") setUploadingHome(true);

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
      setFormData((prev) => ({ ...prev, [fieldName]: imageUrl }));
      toast.success(
        `${fieldName === "logo" ? "Logo" : "Home Image"} uploaded!`
      );
    } catch (err) {
      console.error(err);
      toast.error(
        `Failed to upload ${fieldName === "logo" ? "logo" : "home image"}`
      );
    } finally {
      if (fieldName === "logo") setUploadingLogo(false);
      if (fieldName === "homeImage") setUploadingHome(false);
    }
  };

  // ✅ Updated Save logic
  const handleSave = async () => {
    if (!restaurantId) {
      setMessage("❌ No restaurant ID found");
      return;
    }

    // ◀️ Start Password Validation
    if (formData.password && formData.password.trim() !== "") {
      if (formData.password !== formData.confirmPassword) {
        setMessage("❌ Passwords do not match. Please re-type.");
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
        return; // Stop the save
      }
    }
    // ◀️ End Password Validation

    setSaving(true);
    setMessage("⏳ Saving...");

    // Create payload, only include password if it's been changed
    const payload = { ...formData };
    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }
    // Always remove confirmPassword from the data sent to backend
    delete payload.confirmPassword;

    try {
      const res = await fetch(
        `/api/admin/restaurants/${restaurantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Saved successfully!");
        // Update form state with new data AND clear password fields
        setFormData({
          ...formData, // Keep existing fields
          ...result, // Overwrite with new data from server
          password: "", // ◀️ Reset password
          confirmPassword: "", // ◀️ Reset confirmPassword
        });
      } else {
        setMessage(`❌ Failed: ${result.message || "Unknown error"}`);
      }
    } catch (e) {
      setMessage("❌ Network error.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // Helper component for file uploads
  const FileUploadInput = ({ label, fieldName, imageUrl, uploader, loading }) => (
    <div className="md:col-span-1">
      <label className="block mb-2 text-sm font-medium text-gray-600">
        {label}
      </label>
      <div className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploader(e.target.files[0], fieldName)}
          className="hidden"
          id={`${fieldName}Upload`}
        />
        <label
          htmlFor={`${fieldName}Upload`}
          className="cursor-pointer flex flex-col items-center gap-2 text-gray-500"
        >
          <Upload size={24} />
          <span>Click or drag to upload</span>
        </label>
      </div>
      {loading && (
        <p className="text-blue-500 mt-2 flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} /> Uploading...
        </p>
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={fieldName}
          className="mt-3 rounded-md h-20 object-cover border"
        />
      )}
    </div>
  );

  // Helper for text inputs
  const TextInput = ({ name, placeholder, icon, type = "text" }) => (
    <div>
      <div className="flex items-center border rounded-lg p-3 bg-gray-50">
        {icon}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name] || ""}
          onChange={handleChange}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div>
      <Toaster position="top-right" />
      {/* Open Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-5 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow hover:opacity-90"
      >
        Manage Profile
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">🏪 Restaurant Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            {message && (
              <div className="mb-4 text-center text-sm font-medium text-gray-700">
                {message}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              // ✅ New Form JSX
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    name="name"
                    placeholder="Restaurant Name"
                    icon={<FaStore className="text-gray-600 text-lg mr-3" />}
                  />
                  <TextInput
                    name="email"
                    placeholder="Email"
                    type="email"
                    icon={<FaEnvelope className="text-blue-600 text-lg mr-3" />}
                  />
                  <TextInput
                    name="address"
                    placeholder="Address"
                    icon={
                      <FaMapMarkerAlt className="text-red-600 text-lg mr-3" />
                    }
                  />
                  <TextInput
                    name="contact"
                    placeholder="WhatsApp Number (With Country code )"
                    type="tel"
                    icon={<FaPhone className="text-green-600 text-lg mr-3" />}
                  />

                  {/* ◀️ Updated Password Section */}
                  <TextInput
                    name="password"
                    placeholder="Change Password (optional)"
                    type="password"
                    icon={<FaLock className="text-gray-600 text-lg mr-3" />}
                  />
                  <TextInput
                    name="confirmPassword"
                    placeholder="Retype Password"
                    type="password"
                    icon={<FaLock className="text-gray-600 text-lg mr-3" />}
                  />
                  
                  {/* Currency Dropdown */}
                  <div>
                    <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                      <FaMoneyBillAlt className="text-green-700 text-lg mr-3" />
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none"
                      >
                        {currencies.map((cur) => (
                          <option key={cur.code} value={cur.code}>
                            {cur.symbol} {cur.name} ({cur.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                    <div></div >
                  {/* File Uploads */}
                  <FileUploadInput
                    label="Upload Logo"
                    fieldName="logo"
                    imageUrl={formData.logo}
                    uploader={uploadImageToWordPress}
                    loading={uploadingLogo}
                  />
                  <FileUploadInput
                    label="Logo Background Image"
                    fieldName="homeImage"
                    imageUrl={formData.homeImage}
                    uploader={uploadImageToWordPress}
                    loading={uploadingHome}
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || loading || uploadingLogo || uploadingHome}
              className={`mt-6 w-full py-3 rounded-lg text-white font-medium ${
                saving || loading || uploadingLogo || uploadingHome
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "💾 Save Info"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsModal;