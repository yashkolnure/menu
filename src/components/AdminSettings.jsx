import React, { useState, useEffect } from "react";

// --- ICONS (Defined outside component) ---
const Icons = {
  Store: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Map: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Money: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Upload: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Loading: () => <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};

const WP_USERNAME = "yashkolnure58@gmail.com";
const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
const WP_SITE_URL = "https://website.avenirya.com";
// Fixed API URL to match your Dashboard
const API_BASE_URL = "/api"; 

const currencies = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

// --- HELPER COMPONENTS (Moved OUTSIDE AdminSettings) ---
// Passing value and onChange as props fixes the focus issue
const TextInput = ({ label, name, value, onChange, type = "text", icon: Icon, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
        <Icon />
      </div>
      <input
        type={type}
        name={name}
        value={value || ""} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm"
      />
    </div>
  </div>
);

const FileUploader = ({ label, fieldName, imageUrl, loading, onUpload }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="flex gap-4 items-start">
      {/* Preview Box */}
      <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {loading ? (
          <Icons.Loading />
        ) : imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>
      
      {/* Upload Button */}
      <div className="flex-1">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <span className="text-gray-400 group-hover:text-indigo-500 mb-1"><Icons.Upload /></span>
            <p className="text-xs text-gray-500">Click to upload</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => onUpload(e.target.files[0], fieldName)}
          />
        </label>
      </div>
    </div>
  </div>
);

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    password: "",
    confirmPassword: "",
    logo: "",
    homeImage: "",
    currency: "INR",
    enableOrdering: "enabled",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHome, setUploadingHome] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (restaurantId && token) {
      setLoading(true);
      fetch(`${API_BASE_URL}/admin/${restaurantId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setFormData({
              name: data.name || "",
              email: data.email || "",
              address: data.address || "",
              contact: data.contact || "",
              logo: data.logo || "",
              homeImage: data.homeImage || "",
              currency: data.currency || "INR",
              enableOrdering: data.enableOrdering || "enabled",
              password: "",
              confirmPassword: "",
            });
          }
        })
        .catch(() => setMessage({ type: "error", text: "Failed to load data" }))
        .finally(() => setLoading(false));
    }
  }, [restaurantId, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadImageToWordPress = async (file, fieldName) => {
    if (!file) return;
    if (fieldName === "logo") setUploadingLogo(true);
    if (fieldName === "homeImage") setUploadingHome(true);

    const formDataImage = new FormData();
    formDataImage.append("file", file);

    try {
      const response = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
        },
        body: formDataImage,
      });
      
      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, [fieldName]: data.source_url }));
        setMessage({ type: "success", text: `${fieldName === "logo" ? "Logo" : "Background"} uploaded!` });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Image upload failed." });
    } finally {
      if (fieldName === "logo") setUploadingLogo(false);
      if (fieldName === "homeImage") setUploadingHome(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSaving(true);
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    delete payload.confirmPassword;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile saved successfully!" });
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save changes." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2"><Icons.Loading /> Loading Profile...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
           {message.type === 'success' && <Icons.Check />}
           {message.text}
        </div>
      )}

      {/* Basic Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TextInput 
            label="Restaurant Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            icon={Icons.Store} 
            placeholder="My Awesome Restaurant" 
        />
        <TextInput 
            label="Contact Number" 
            name="contact" 
            value={formData.contact} 
            onChange={handleChange} 
            icon={Icons.Phone} 
            placeholder="+91 9876543210" 
        />
        <div className="md:col-span-2">
           <TextInput 
                label="Full Address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                icon={Icons.Map} 
                placeholder="Street, City, Zip" 
            />
        </div>
        <TextInput 
            label="Email Address" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            icon={Icons.Mail} 
            placeholder="admin@restaurant.com" 
        />
        
        <div className="flex flex-col gap-1.5">
           <label className="text-sm font-semibold text-gray-700">Currency</label>
           <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Icons.Money /></div>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm appearance-none">
                 {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>)}
              </select>
           </div>
        </div>
      </div>


      {/* Branding Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
         <FileUploader 
            label="Restaurant Logo" 
            fieldName="logo" 
            imageUrl={formData.logo} 
            loading={uploadingLogo} 
            onUpload={uploadImageToWordPress}
         />
         <FileUploader 
            label="Menu Background" 
            fieldName="homeImage" 
            imageUrl={formData.homeImage} 
            loading={uploadingHome} 
            onUpload={uploadImageToWordPress}
         />
      </div>

      <hr className="border-gray-100" />

      {/* Security Section */}
      <div>
         <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.Lock /> Change Password <span className="text-xs font-normal text-gray-500">(Leave empty to keep current)</span>
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput 
                label="New Password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                icon={Icons.Lock} 
                placeholder="••••••••" 
            />
            <TextInput 
                label="Confirm Password" 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                icon={Icons.Lock} 
                placeholder="••••••••" 
            />
         </div>
      </div>

      {/* Save Action */}
      <div className="">
        <button 
           onClick={handleSave} 
           disabled={saving}
           className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
           {saving ? (
             <>
               <Icons.Loading /> Saving Changes...
             </>
           ) : (
             "Save Profile"
           )}
        </button>
      </div>

    </div>
  );
};

export default AdminSettings;