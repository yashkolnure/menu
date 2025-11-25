import React, { useState, useEffect } from "react";

// Inline Icons for stability & consistency
const Icons = {
  Instagram: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  Facebook: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  Website: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Phone: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Google: () => <svg    className="w-5 h-5"    viewBox="0 0 24 24"    fill="none"    stroke="currentColor"    strokeWidth="2"    strokeLinecap="round"    strokeLinejoin="round">    <path d="M21.35 11.1H12v2.8h5.35A4.9 4.9 0 0 1 12 18.5a6.5 6.5 0 1 1 0-13 6.3 6.3 0 0 1 4.4 1.7l2-2A9.3 9.3 0 0 0 12 2 10 10 0 1 0 22 12a10.7 10.7 0 0 0-.65-3Z" />  </svg>, // Simplified representation
  Edit: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Loading: () => <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Error: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// Fixed API URL
const API_BASE_URL = "/api";

// --- HELPER COMPONENT (Moved OUTSIDE) ---
const SocialInput = ({ label, name, value, onChange, icon: Icon, placeholder, colorClass, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${colorClass}`}>
        <Icon />
      </div>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-sm ${
          error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-indigo-500"
        }`}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

const CustomFields = () => {
  const [formData, setFormData] = useState({
    instagram: "",
    facebook: "",
    website: "",
    contact: "",
    googleReview: "",
    customLine: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (restaurantId && token) {
      setLoading(true);
      fetch(`${API_BASE_URL}/admin/custom-fields?restaurantId=${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setFormData(data);
        })
        .catch(() => setMessage({ type: "error", text: "Failed to load info" }))
        .finally(() => setLoading(false));
    }
  }, [restaurantId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on type
  };

  const validate = () => {
    let newErrors = {};
    if (formData.instagram && !/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+/.test(formData.instagram)) {
      newErrors.instagram = "Invalid Instagram URL";
    }
    if (formData.website && !/^https?:\/\/[^\s]+$/.test(formData.website)) {
      newErrors.website = "Invalid Website URL";
    }
    if (formData.contact && !/^[0-9+\-\s]{7,15}$/.test(formData.contact)) {
      newErrors.contact = "Invalid Phone Number";
    }
    if (formData.customLine && formData.customLine.length > 100) {
      newErrors.customLine = "Max 100 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!restaurantId) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/custom-fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId, ...formData }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Social info updated!" });
        setFormData(result);
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2"><Icons.Loading /> Loading Settings...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
           {message.type === 'success' ? <Icons.Check /> : <Icons.Error />}
           {message.text}
        </div>
      )}

      {/* Social Media Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <SocialInput 
            label="Instagram Profile" 
            name="instagram" 
            value={formData.instagram}
            onChange={handleChange}
            icon={Icons.Instagram} 
            placeholder="https://instagram.com/your-handle"
            colorClass="text-pink-500" 
            error={errors.instagram}
        />
        <SocialInput 
            label="Facebook Page" 
            name="facebook" 
            value={formData.facebook}
            onChange={handleChange}
            icon={Icons.Facebook} 
            placeholder="https://facebook.com/your-page"
            colorClass="text-blue-600" 
            error={errors.facebook}
        />
        <SocialInput 
            label="Website URL" 
            name="website" 
            value={formData.website}
            onChange={handleChange}
            icon={Icons.Website} 
            placeholder="https://www.yourrestaurant.com"
            colorClass="text-green-600" 
            error={errors.website}
        />
        <SocialInput 
            label="Public Contact Number" 
            name="contact" 
            value={formData.contact}
            onChange={handleChange}
            icon={Icons.Phone} 
            placeholder="+91 9876543210"
            colorClass="text-purple-600" 
            error={errors.contact}
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 gap-2">
         <SocialInput 
            label="Google Review Link" 
            name="googleReview" 
            value={formData.googleReview}
            onChange={handleChange}
            icon={Icons.Google} 
            placeholder="https://g.page/r/..."
            colorClass="text-yellow-600" 
        />
        
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Custom Highlight Text</label>
            <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                    <Icons.Edit />
                </div>
                <textarea 
                    name="customLine"
                    value={formData.customLine || ""}
                    onChange={handleChange}
                    rows="2"
                    placeholder="e.g., 'We accept party orders!' or 'Open 24/7'"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm resize-none"
                />
            </div>
            <p className="text-xs text-gray-400 text-right">{(formData.customLine || "").length}/100 characters</p>
            {errors.customLine && <p className="text-xs text-red-500">{errors.customLine}</p>}
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-2">
        <button 
           onClick={handleSave} 
           disabled={saving}
           className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
           {saving ? (
             <>
               <Icons.Loading /> Saving...
             </>
           ) : (
             "Save Social Links"
           )}
        </button>
      </div>

    </div>
  );
};

export default CustomFields;