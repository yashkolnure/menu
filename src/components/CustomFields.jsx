import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebook, FaGlobe, FaPhone, FaPen, FaGoogle  } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const CustomFieldsModal = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    instagram: "",
    facebook: "",
    website: "",
    contact: "",
    googleReview: "",
    customLine: "",
    
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const restaurantId = localStorage.getItem("restaurantId");

  // ✅ Load data from backend when modal opens
  useEffect(() => {
    if (isOpen && restaurantId) {
      fetch(`/api/admin/custom-fields?restaurantId=${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setFormData(data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (
      formData.instagram &&
      !/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+$/.test(formData.instagram)
    ) {
      newErrors.instagram = "Enter a valid Instagram link (https://instagram.com/username)";
    }


    if (formData.website && !/^https?:\/\/[^\s]+$/.test(formData.website)) {
      newErrors.website = "Enter a valid website URL (https://...)";
    }

    if (formData.contact && !/^[0-9]{7,15}$/.test(formData.contact)) {
      newErrors.contact = "Enter a valid phone number (7–15 digits)";
    }

    if (formData.customLine.length > 100) {
      newErrors.customLine = "Custom line must be under 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!restaurantId) {
      setMessage("❌ No restaurant ID found in localStorage");
      return;
    }

    setSaving(true);
    setMessage("⏳ Saving...");

    try {
      const res = await fetch("/api/admin/custom-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId, ...formData }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Saved successfully! Your info will now show on the menu card.");
        setFormData(result);
      } else {
        setMessage("❌ Failed: " + result.message);
      }
    } catch (e) {
      setMessage("❌ Network error.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <div>
      {/* Open Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-5 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow hover:opacity-90"
      >
        ⚙️ Manage Restaurant Info
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">🏪 Restaurant Contact Info</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            {message && (
              <div className="mb-4 text-center text-sm font-medium text-gray-700">{message}</div>
            )}

            {/* Form */}
            <div className="space-y-5">
              {[
                {
                  name: "instagram",
                  label: "Instagram ID / Link",
                  icon: <FaInstagram className="text-pink-500 text-lg mr-3" />,
                },
                {
                  name: "facebook",
                  label: "Facebook Profile Link",
                  icon: <FaFacebook className="text-blue-600 text-lg mr-3" />,
                },
                {
                  name: "website",
                  label: "Website Link",
                  icon: <FaGlobe className="text-green-600 text-lg mr-3" />,
                },
                {
                  name: "contact",
                  label: "Contact Number",
                  icon: <FaPhone className="text-purple-600 text-lg mr-3" />,
                },
                {
                  name: "googleReview",
                  label: "Google Review Link",
                  icon: <FaGoogle className="text-yellow-600 text-lg mr-3" />,
                },
                {
                  name: "customLine",
                  label: "Custom line (e.g., We Accept Party Orders Also)",
                  icon: <FaPen className="text-gray-600 text-lg mr-3" />,
                },
              ].map((field) => (
                <div key={field.name}>
                  <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                    {field.icon}
                    <input
                      type={field.name === "contact" ? "tel" : "text"}
                      name={field.name}
                      placeholder={field.label}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="flex-1 bg-transparent outline-none"
                    />
                    {formData[field.name] && (
                      <button
                        type="button"
                        onClick={() => clearField(field.name)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <MdClose />
                      </button>
                    )}
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`mt-6 w-full py-3 rounded-lg text-white font-medium ${
                saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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

export default CustomFieldsModal;
