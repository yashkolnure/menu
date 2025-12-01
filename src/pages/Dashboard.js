import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpgradePopup from "../components/UpgradePopup";
import QRCodeTemplates from "../components/QRCodeTemplates";
import CustomFields from "../components/CustomFields";
import AdminSettings from "../components/AdminSettings";
import ExpertHelpPopup from "../components/ExpertHelpPopup";
import OfferBannerManager from "../components/OfferBannerManager";
import { Helmet } from "react-helmet";

// --- ICONS ---
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  QR: () => (  <svg    className="w-5 h-5"    viewBox="0 0 24 24"    fill="currentColor" >    <path d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm10-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm13-2h2v2h-2v-2Zm2 3h2v6h-6v-2h4v-4Zm-6 1h2v5h-2v-5Zm0-4h4v2h-4v-2Z" /> </svg>),
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Hamburger: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>, 
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  plate: () =>  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6M9 11h6M9 15h3M7 2h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V4a2 2 0 012-2z"
    />
  </svg>,
  food: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0l-2.685-1.579M12 20l2.685-1.579M5.315 7.421L3 8.618m0 0l2.685 1.579M3 8.618v3.764m0 0l2.685 1.579M3 12.382l2.685-1.579M18.685 16.579L21 15.382m0 0l-2.685-1.579M21 15.382v-3.764m0 0l-2.685-1.579M21 11.618l-2.685 1.579" /></svg>,
  Whatsapp: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
};

const CategoryReorderModal = ({ isOpen, onClose, categories, onSave }) => {
  const [list, setList] = useState(categories);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Reset list when modal opens
  useEffect(() => {
    if (isOpen) setList(categories);
  }, [isOpen, categories]);

  // Handle Drag Sorting
  const handleSort = () => {
    // Duplicate items
    let _list = [...list];
    
    // Remove dragged item
    const draggedItemContent = _list.splice(dragItem.current, 1)[0];
    
    // Switch the position
    _list.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Reset refs
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Update state
    setList(_list);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h3 className="font-bold text-gray-800">Reorder Categories</h3>
            <p className="text-xs text-gray-500">Drag and drop items to rearrange</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icons.Close /></button>
        </div>

        {/* Draggable List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {list.map((cat, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
              draggable
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-3">
                {/* Drag Handle Icon */}
                <span className="text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                </span>
                <span className="font-medium text-gray-700">{index + 1}. {cat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Cancel</button>
          <button 
            onClick={() => onSave(list)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
          >
            Save New Order
          </button>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("overview"); 
  const [restaurant, setRestaurant] = useState({ name: "", logo: "", address: "", contact: "", billing: false }); // Added billing: false
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [menuItems, setMenuItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [existingItems, setExistingItems] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
  const [isOrderModeDropdownOpen, setIsOrderModeDropdownOpen] = useState(false);
  const [showBillingAlert, setShowBillingAlert] = useState(false);
  
  // Add this new state
  const [showReorderModal, setShowReorderModal] = useState(false);

  // Add this handler function
  const handleSaveCategoryOrder = async (newOrder) => {
    try {
      // 1. Optimistic Update (Instant UI change)
      setRestaurant(prev => ({ ...prev, categoryOrder: newOrder }));
      setShowReorderModal(false);
      
      // 2. Save to Backend
      await axios.put(`/api/admin/${restaurantId}/settings`, 
        { categoryOrder: newOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Category order saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save order.");
    }
  };
  
  // FIX: Ref for scrolling
  const formRef = useRef(null);

  // Form States
  const [itemForm, setItemForm] = useState({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
  const [customCategory, setCustomCategory] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  
  // Loading/Feedback States
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- HELPERS ---
  const triggerAction = async (fn) => {
    setIsLoading(true);
    await fn();
    setIsLoading(false);
  };
  
  const getDaysLeft = () => {
    if (!restaurant.expiresAt) return null;
    const today = new Date();
    const expiry = new Date(restaurant.expiresAt);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft();
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        navigate("/login");
    }
  };  
  const handlemyorders = () => {
        navigate("/admin/dashboard");
      };

  useEffect(() => {
    if (!restaurantId || !token) return;
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`/api/admin/${restaurantId}/details`, { headers: { Authorization: `Bearer ${token}` } });
        setRestaurant(res.data);
      } catch (e) { setError("Failed to fetch restaurant."); }
    };
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`/api/admin/${restaurantId}/menu`, { headers: { Authorization: `Bearer ${token}` } });
        setExistingItems(res.data);
      } catch (e) { setError("Failed to fetch menu."); }
    };
    fetchRestaurant();
    fetchMenu();
  }, [restaurantId, token]);

  useEffect(() => {
    if (groupedItems.length && !selectedCategory) setSelectedCategory(groupedItems[0].category);
  }, [existingItems]);

  // --- SORTING & GROUPING LOGIC ---
  const orderedMenuGroups = React.useMemo(() => {
    if (!existingItems) return [];

    // 1. Extract categories, TRIM whitespace, and ignore empty values
    // We use a Map to ensure we only get unique category names
    const categoriesSet = new Set(
      existingItems
        .map((item) => (item.category ? item.category.trim() : ""))
        .filter((cat) => cat !== "")
    );
    
    const uniqueCategories = Array.from(categoriesSet);

    // 2. Sort based on restaurant.categoryOrder
    const sortedCategories = uniqueCategories.sort((a, b) => {
      const order = restaurant.categoryOrder || [];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);

      // Priority 1: Both are in the saved list -> Sort by index
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      
      // Priority 2: Only A is in list -> A goes first
      if (indexA !== -1) return -1;
      
      // Priority 3: Only B is in list -> B goes first
      if (indexB !== -1) return 1;

      // Priority 4: Neither in list -> Sort Alphabetically
      return a.localeCompare(b);
    });

    // 3. Build the final groups
    return sortedCategories.map((cat) => ({
      category: cat,
      items: existingItems.filter(
        (item) => item.category && item.category.trim() === cat
      ),
    }));
  }, [existingItems, restaurant.categoryOrder]);

// 🆕 HANDLER: Toggle between WhatsApp and Billing App
  const toggleOrderMode = async () => {
    // Determine new mode based on current state
    const currentMode = restaurant.orderMode || 'whatsapp';
    const newMode = currentMode === 'whatsapp' ? 'billing' : 'whatsapp';
    
    // Optimistic Update (Update UI immediately)
    setRestaurant(prev => ({ ...prev, orderMode: newMode }));
    
    try {
        // Send 'orderMode' to your settings update API
        await axios.put(`/api/admin/${restaurantId}/settings`, 
            { orderMode: newMode }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) {
        console.error(err);
        // Revert UI on failure
        setRestaurant(prev => ({ ...prev, orderMode: currentMode }));
        alert("Failed to update settings");
    }
  };
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && !/^\d*\.?\d*$/.test(value)) return;
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setItemForm((prev) => ({ ...prev, image: reader.result })); };
    reader.readAsDataURL(file);
  };

  const membershipLimits = { 1: 15, 2: 100, 3: Infinity };

  async function uploadImageToWordPress(base64Image, filename) {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', blob, filename || `menu-item-${Date.now()}.jpg`);
      
      const username = "yashkolnure58@gmail.com";
      const appPassword = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
      const authHeader = `Basic ${btoa(`${username}:${appPassword}`)}`;
      
      const response = await fetch("https://website.avenirya.com/wp-json/wp/v2/media", {
        method: "POST", headers: { "Authorization": authHeader }, body: formData
      });
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      return data.source_url;
    } catch (error) { console.error("WordPress upload error:", error); throw error; }
  }

  const addItemToList = async () => {
    setError(""); setMessage("");
    if (!itemForm.name || !itemForm.category || !itemForm.price) { setError("All fields are required."); return; }
    
    const limit = membershipLimits[restaurant.membership_level] || 0;
    if (existingItems.length >= limit && limit !== Infinity) { setError(`Limit reached: ${limit} items.`); return; }

    let imageUrl = itemForm.image;
    if (itemForm.image && itemForm.image.startsWith("data:")) {
      try {
        imageUrl = await uploadImageToWordPress(itemForm.image, `${itemForm.name.replace(/\s+/g, "-")}_${itemForm.category.replace(/\s+/g, "-")}.jpg`);
      } catch (error) { setError("Image upload failed."); return; }
    }

    const newItem = { ...itemForm, price: parseFloat(itemForm.price), restaurantId, image: imageUrl, inStock: itemForm.inStock ?? true };
    try {
      await axios.post(`/api/admin/${restaurantId}/menu`, newItem, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Item added successfully!");
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
      setCustomCategory("");
      setShowItemForm(false); 
      const res = await axios.get(`/api/admin/${restaurantId}/menu`, { headers: { Authorization: `Bearer ${token}` } });
      setExistingItems(res.data);
    } catch (err) { setError("Failed to add item."); }
  };

  const handleUpdate = async () => {
    try {
      setMessage(""); setError("");
      let imageUrl = itemForm.image;
      if (itemForm.image && itemForm.image.startsWith("data:")) {
        imageUrl = await uploadImageToWordPress(itemForm.image, `${itemForm.name.replace(/\s+/g, "-")}-${Date.now()}.jpg`);
      }
      const updatedItem = { ...itemForm, image: imageUrl, inStock: itemForm.inStock };
      await axios.put(`/api/admin/${restaurantId}/menu/${itemForm._id}`, updatedItem, { headers: { Authorization: `Bearer ${token}` } });
      
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
      setMessage("Updated successfully");
      setShowItemForm(false);
      const res = await axios.get(`/api/admin/${restaurantId}/menu`, { headers: { Authorization: `Bearer ${token}` } });
      setExistingItems(res.data);
    } catch (err) { setError("Update failed."); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/admin/${restaurantId}/menu/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setExistingItems(existingItems.filter(item => item._id !== id));
    } catch (err) { console.error("Delete failed"); }
  };

  const handleEditItem = (item) => {
    setItemForm({
      name: item.name, category: item.category, description: item.description,
      price: item.price.toString(), image: item.image, _id: item._id, inStock: item.inStock === true,
    });
    
    setShowItemForm(true);

    // FIX: Scroll to form when editing
    setTimeout(() => {
        if(formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, 100);
  };

  const handleUpgrade = async (newLevel) => {
    try {
      const res = await axios.put(`/api/admin/upgrade-membership/${restaurantId}`, { newLevel }, { headers: { Authorization: `Bearer ${token}` } });
      setRestaurant((prev) => ({ ...prev, membership_level: res.data.restaurant.membership_level }));
      setShowUpgrade(false);
    } catch (err) { alert("Upgrade failed"); }
  };

  const handleOptionClick = (path, allowed) => {
    if (!allowed) return;
    navigate(path);
    setShowModal(false);
  };

  const allCategories = [...new Set([...existingItems.map((i) => i.category), ...menuItems.map((i) => i.category)])];
  const groupedItems = allCategories.map(cat => ({
    category: cat,
    items: existingItems.filter(item => item.category === cat)
  }));


  // --- COMPONENTS ---
  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => { 
          setActiveTab(id); 
          setIsEditMode(false); 
          setShowItemForm(false);
          setIsMobileMenuOpen(false); // Close mobile menu on click
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon />
      <span className="font-medium">{label}</span>
    </button>
  );

  // --- MAIN LAYOUT RENDER ---
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Helmet>
        <title>Dashboard - {restaurant.name || "Petoba"}</title>
      </Helmet>

      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} currentLevel={restaurant?.membership_level || 1} onUpgrade={handleUpgrade} />
      <ExpertHelpPopup open={showPopup} onClose={() => setShowPopup(false)} />

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
      )}

      {/* --- SIDEBAR (Desktop Fixed, Mobile Drawer) --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out md:transform-none flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="pr-6 border-b border-gray-100 flex items-center justify-between py-4 pl-4">
            <div className="flex items-center gap-3">
                <img 
                    src={'https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png'} 
                    alt="Petoba Logo" 
                    className="w-36 cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => {
                        navigate("/");        // Navigates to homepage
                        setActiveTab("overview"); // Resets tab
                    }}
                />
            </div>
            {/* Close Button Mobile */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500">
                <Icons.Close />
            </button>
        </div>
{/* --- BILLING RESTRICTION POPUP --- */}
{showBillingAlert && (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative p-6 text-center animate-scale-up border border-gray-100">
            
            {/* Close Button */}
            <button 
                onClick={() => setShowBillingAlert(false)} 
                className="absolute top-3 right-3 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
                <Icons.Close />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-indigo-50/50">
                <span className="text-indigo-600"><Icons.plate /></span>
                <div className="absolute -mt-8 -mr-8 bg-orange-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">Activate Billing Terminal</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                The Billing App and Order Manager are <b>Premium Features</b>. Connect with our team to unlock your free trial.
            </p>

            {/* WhatsApp Button */}
            <button 
                onClick={() => {
                    window.open("https://wa.me/919270361329?text=Hi,%20I%20want%20to%20activate%20the%20Billing%20App%20Plan.", "_blank");
                    setShowBillingAlert(false);
                }} 
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
            >
                <Icons.Whatsapp />
                <span>Connect on WhatsApp</span>
            </button>
        </div>
    </div>
)}
{/* --- SIDEBAR NAV SECTION --- */}
<nav className="flex-1 overflow-y-auto p-4 space-y-2">
    <SidebarItem id="overview" label="Overview" icon={Icons.Home} />
    <SidebarItem id="menu" label="Menu Manager" icon={Icons.Menu} />
    <SidebarItem id="qr" label="QR Code Manage" icon={Icons.QR} />
    <SidebarItem id="settings" label="Settings" icon={Icons.Settings} />
    <SidebarItem id="uploads" label="Bulk Import" icon={Icons.Upload} />

    {/* 🆕 ORDER MODE - DROPDOWN MENU */}
    <div className="mt-6 mb-2 px-3 relative">
        <label className="text-[12px] px-2 font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Order Channel
        </label>

        {/* Dropdown Trigger Button */}
        <button
            onClick={() => setIsOrderModeDropdownOpen(!isOrderModeDropdownOpen)}
            className="w-full bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-xl flex items-center justify-between shadow-sm hover:border-indigo-400 hover:ring-2 hover:ring-indigo-50 transition-all"
        >
            <div className="flex items-center gap-2">
                {restaurant.orderMode === 'billing' ? (
                    <>
                        <div className="p-1 bg-indigo-100 rounded text-indigo-600"><Icons.plate /></div>
                        <span className="text-gray-800">Billing App</span>
                    </>
                ) : (
                    <>
                        <div className="p-1 bg-green-100 rounded text-green-600"><Icons.Whatsapp /></div>
                        <span className="text-gray-800">WhatsApp Chat</span>
                    </>
                )}
            </div>
            {/* Chevron Icon */}
            <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOrderModeDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {/* Dropdown Menu List */}
        {isOrderModeDropdownOpen && (
            <>
            
                <div 
                    className="fixed inset-0 z-10 cursor-default" 
                    onClick={() => setIsOrderModeDropdownOpen(false)}
                ></div>

                <div className="absolute left-4 right-4 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-up">
                    
                    {/* Option 1: WhatsApp (ALWAYS AVAILABLE) */}
                    <button
                        onClick={() => {
                            if (restaurant.orderMode !== 'whatsapp') toggleOrderMode();
                            setIsOrderModeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                            restaurant.orderMode === 'whatsapp' ? 'bg-green-50/50' : ''
                        }`}
                    >
                        <span className="text-green-600"><Icons.Whatsapp /></span>
                        <span className={restaurant.orderMode === 'whatsapp' ? 'font-bold text-gray-800' : 'text-gray-600'}>
                            WhatsApp
                        </span>
                        {restaurant.orderMode === 'whatsapp' && <span className="ml-auto text-green-600 font-bold">✓</span>}
                    </button>

                    {/* Option 2: Billing App (SHOWS POPUP IF NO PLAN) */}
                    {/* Option 2: Billing App (SHOWS POPUP IF NO PLAN) */}
<button
    onClick={async () => {
        if (!restaurant.billing) {
            // 🔒 TRIGGER THE POPUP
            setIsOrderModeDropdownOpen(false);
            setShowBillingAlert(true);
        } else {
            // 1. If not currently billing, toggle it and wait for API to finish
            if (restaurant.orderMode !== 'billing') {
                await toggleOrderMode();
            }
            
            // 2. Close dropdown
            setIsOrderModeDropdownOpen(false);

            // 3. Redirect to Admin Dashboard
            navigate("/admin/dashboard");
        }
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t border-gray-50 
        ${restaurant.orderMode === 'billing' ? 'bg-indigo-50/50' : ''}
        ${!restaurant.billing ? 'bg-gray-50 opacity-80 hover:bg-gray-100' : 'hover:bg-gray-50'}
    `}
>
    <span className={!restaurant.billing ? "text-gray-400" : "text-indigo-600"}><Icons.plate /></span>
    <div className="flex flex-col items-start">
        <span className={restaurant.orderMode === 'billing' ? 'font-bold text-gray-800' : 'text-gray-600'}>
            Billing App
        </span>
        {!restaurant.billing && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">Premium</span>}
    </div>

    {/* Status Icon */}
    {restaurant.billing ? (
        restaurant.orderMode === 'billing' && <span className="ml-auto text-indigo-600 font-bold">✓</span>
    ) : (
        <span className="ml-auto text-gray-400 text-xs border border-gray-300 rounded px-1.5 py-0.5">🔒</span>
    )}
</button>
                </div>
            </>
        )}
    </div>

    <div className="pt-2 gap-2 flex flex-col border-t border-gray-100 mt-auto">
        {/* MANAGE ORDERS BUTTON (SHOWS POPUP IF NO PLAN) */}
        <button 
            onClick={() => {
                if (!restaurant.billing) {
                    // 🔒 TRIGGER THE POPUP
                    setShowBillingAlert(true);
                } else {
                    handlemyorders();
                }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors 
                ${!restaurant.billing 
                    ? "text-gray-400 bg-gray-50 cursor-pointer hover:bg-gray-100" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            <Icons.plate />
            <span className="font-medium">Manage Orders</span>
            {!restaurant.billing && (
                 <span className="ml-auto w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400 font-serif italic">i</span>
            )}
        </button>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
            <Icons.Logout /><span className="font-medium">Logout</span>
        </button>
    </div>
</nav>

        <div className="p-4 border-t border-gray-100">
          <div className={`p-4 rounded-xl border ${daysLeft !== null && daysLeft <= 7 ? 'bg-red-50 border-red-100' : 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-100'}`}>
            
            {/* Header Row: Label + Days Left Badge */}
            <div className="flex justify-between items-center mb-1">
              <p className={`text-xs font-bold uppercase ${daysLeft !== null && daysLeft <= 7 ? 'text-red-800' : 'text-orange-800'}`}>
                Current Plan
              </p>
              {daysLeft !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${daysLeft <= 7 ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>
                  {daysLeft <= 0 ? "Expired" : `${daysLeft} Days Left`}
                </span>
              )}
            </div>

            {/* Plan Name */}
            <p className={`text-sm font-bold mb-1 ${daysLeft !== null && daysLeft <= 7 ? 'text-red-900' : 'text-orange-900'}`}>
              {restaurant.membership_level === 1 ? 'Free Tier' : restaurant.membership_level === 2 ? 'Pro Tier' : 'Pro Plan'}
            </p>
            
            {/* Expiry Date */}
            {restaurant.expiry && (
              <p className="text-xs text-gray-500 mb-3">
                Valid till: {new Date(restaurant.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}

            {/* Action Button (Renew vs Upgrade) */}
            {restaurant.membership_level !== 3 && (
              <button 
                onClick={() => setShowUpgrade(true)} 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition hover:shadow-md"
              >
                {daysLeft !== null && daysLeft <= 0 ? "Renew Now" : "Unlock More Features"}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10">
            <div className="flex items-center gap-4">
                 {/* Mobile Toggle Button */}
                 <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                 >
                    <Icons.Hamburger />
                 </button>

                 <div className="flex flex-col">
                    <h1 className="text-lg md:text-xl font-bold text-gray-800 capitalize truncate max-w-[200px] sm:max-w-none">
                        {activeTab === 'overview' ? 'Dashboard Overview' : 
                         activeTab === 'menu' ? 'Menu Manager' : 
                         activeTab === 'qr' ? 'QR & Marketing' : 
                         activeTab === 'settings' ? 'Settings' : 'Bulk Menu Upload'}
                    </h1>
                    {activeTab === 'overview' && <span className="text-xs text-gray-500 hidden sm:block">Manage {restaurant.name}'s digital presence</span>}
                 </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {restaurant.name ? restaurant.name.charAt(0).toUpperCase() : "R"}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">{restaurant.name || "Restaurant"}</span>
                 </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-gray-50/50">
            <div className="max-w-6xl mx-auto pb-20"> 
                
                {message && <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center shadow-sm"><span className="mr-2">✅</span> {message}</div>}
                {error && <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center shadow-sm"><span className="mr-2">⚠️</span> {error}</div>}

                {/* --- TAB CONTENT SWITCH --- */}
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stat Cards */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="opacity-80 text-sm font-medium mb-1 tracking-wide">TOTAL MENU ITEMS</p>
                                    <h2 className="text-4xl font-extrabold tracking-tight">{existingItems.length}</h2>
                                    <p className="mt-4 text-xs bg-white/10 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-white/20">
                                        {membershipLimits[restaurant.membership_level] === Infinity 
                                            ? '✨ Unlimited Plan Active' 
                                            : `${membershipLimits[restaurant.membership_level]} Items Allowed on Plan`}
                                    </p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12"><svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-gray-800 text-lg font-bold">What would you like to do?</h3>
                                    <div className="flex flex-col gap-3 mt-4">
                                        <button onClick={() => { setActiveTab("menu"); setShowItemForm(true); }} className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-lg text-sm font-medium transition group">
                                            <span>Add a New Dish</span>
                                            <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                        <button onClick={() => triggerAction(() => handleOptionClick("/bulk-upload", true))} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition group">
                                            <span>Bulk Upload via AI</span>
                                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => setShowPopup(true)} className="mt-4 text-xs text-center text-gray-400 hover:text-indigo-600 underline">Need help setting up your menu?</button>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-center text-center">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-50"></div>
                                <h3 className="text-gray-800 font-bold text-lg mb-2">Your Live Menu</h3>
                                <p className="text-gray-500 text-sm mb-5">This is what your customers see when they scan the QR code.</p>
                                <button onClick={() => window.open(`https://app.avenirya.com/menuwp/${restaurantId}`, "_blank")} className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition shadow-lg font-medium flex items-center justify-center gap-2">
                                    <span>View Customer Menu</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Banner Manager Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Promotional Banners</h3>
                            <p className="text-gray-500 text-sm mb-6">These banners appear at the top of your digital menu to highlight offers.(Ideal banner size is 650x300 px)</p>
                            <OfferBannerManager restaurantId={restaurantId} token={token} offers={offers} setOffers={setOffers} />
                        </div>
                    </div>
                )}
                
 {/* 2. MENU MANAGER TAB */}
{activeTab === 'menu' && (
    <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Your Menu</h2>
                <p className="text-gray-500 text-sm">Add dishes and drag to reorder categories.</p>
            </div>
            <div ref={formRef}></div>
            
            <div className="flex gap-3 w-full sm:w-auto">
                {/* REORDER BUTTON */}
                <button 
                    onClick={() => setShowReorderModal(true)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    <span>Reorder</span>
                </button>

                {/* ADD DISH BUTTON */}
                <button 
                    onClick={() => {
                        setShowItemForm(!showItemForm);
                        setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
                    }}
                    className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm transition-all ${showItemForm ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    {showItemForm ? (<span>Cancel Adding</span>) : (<><Icons.Plus /> <span>Add Dish</span></>)}
                </button>
            </div>
        </div>
{/* Mobile-Friendly Add/Edit Form */}
        {showItemForm && (
            <div className="fixed inset-0 m-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
                {/* Modal Container */}
                <div className="bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up sm:animate-fade-in-up">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 shrink-0">
                        <h3 className="text-lg font-bold text-gray-800">
                            {itemForm._id ? "Edit Dish" : "Add New Dish"}
                        </h3>
                        <button 
                            onClick={() => setShowItemForm(false)}
                            className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-sm border border-gray-200"
                        >
                            <Icons.Close />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto p-4 sm:p-6 space-y-6 bg-white flex-1">
                        
                        {/* 1. IMAGE UPLOADER (Big Tappable Area) */}
                        <div className="flex justify-center">
                            <label className="relative w-full sm:w-64 h-48 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group">
                                {itemForm.image ? (
                                    <>
                                        <img src={itemForm.image} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Tap to Change</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Icons.Upload />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">Tap to upload photo</span>
                                        <p className="text-xs text-gray-400 mt-1">Accepts JPG/PNG</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>

                        {/* 2. FORM FIELDS */}
                        <div className="space-y-4">
                            
                            {/* Name */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Dish Name</label>
                                <input 
                                    name="name" 
                                    value={itemForm.name} 
                                    onChange={handleItemChange} 
                                    placeholder="e.g. Chicken Burger" 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Price */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Price (₹)</label>
                                    <input 
                                        name="price" 
                                        type="number"
                                        value={itemForm.price} 
                                        onChange={handleItemChange} 
                                        placeholder="00" 
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-bold p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    />
                                </div>

                                {/* Stock Toggle */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                                    <button
                                        onClick={() => setItemForm(prev => ({ ...prev, inStock: !prev.inStock }))}
                                        className={`w-full h-[54px] px-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-sm ${
                                            itemForm.inStock
                                                ? "bg-green-100 border-green-200 text-green-700"
                                                : "bg-red-50 border-red-100 text-red-600"
                                        }`}
                                    >
                                        <span className={`w-3 h-3 rounded-full ${itemForm.inStock ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                        {itemForm.inStock ? "In Stock" : "Sold Out"}
                                    </button>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
                                <div className="relative">
                                    <select 
                                        value={itemForm.category || ""} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCustomCategory(val === "__custom__" ? val : "");
                                            setItemForm({ ...itemForm, category: val === "__custom__" ? "" : val });
                                        }} 
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="">Select Category...</option>
                                        {allCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                                        <option value="__custom__">+ Create New Category</option>
                                    </select>
                                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">▼</div>
                                </div>
                            </div>

                            {/* Custom Category Input */}
                            {customCategory === "__custom__" && (
                                <div className="animate-fade-in-down">
                                    <input 
                                        type="text" 
                                        placeholder="Enter new category name"
                                        value={itemForm.category} 
                                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })} 
                                        className="w-full border-2 border-indigo-100 bg-indigo-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-900 font-medium" 
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
                                <textarea 
                                    name="description" 
                                    value={itemForm.description} 
                                    onChange={handleItemChange} 
                                    rows="3" 
                                    placeholder="Optional: Ingredients, spicy level..."
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
                        <button 
                            onClick={() => setShowItemForm(false)} 
                            className="flex-1 py-3.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-bold shadow-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={itemForm._id ? handleUpdate : addItemToList} 
                            className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transform active:scale-95 transition-all"
                        >
                            {itemForm._id ? "Update Dish" : "Save Dish"}
                        </button>
                    </div>

                </div>
            </div>
        )}
        {/* Menu Grid - THIS WAS MISSING IN YOUR SNIPPET */}
        <div className="grid grid-cols-1 ">
            {orderedMenuGroups.map((group, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border bg-white overflow-hidden">
                    <button 
                        onClick={() => setOpenCategory(openCategory === group.category ? null : group.category)}
                        className="w-full flex justify-between items-center px-6 py-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <h4 className="text-lg font-bold text-gray-800">{group.category} <span className="text-sm font-normal text-gray-500 ml-2">({group.items.length} dishes)</span></h4>
                        <span className="text-gray-400">{openCategory === group.category ? "▲" : "▼"}</span>
                    </button>
                    
                    {openCategory === group.category && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {group.items.map((item) => (
                                <div key={item._id} className="flex gap-4 p-3 rounded-lg border bg-white border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Icons.Menu /></div>}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h5>
                                                <span className="font-bold text-green-700 text-sm">₹{item.price}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={() => handleEditItem(item)} className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded flex items-center gap-1"><Icons.Edit /> Edit</button>
                                            <button onClick={() => handleDelete(item._id)} className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded flex items-center gap-1"><Icons.Trash /> Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
            {orderedMenuGroups.length === 0 && (
                 <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-900">Your Menu is Empty</h3>
                    <button onClick={() => setShowItemForm(true)} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg">Add Your First Dish</button>
                 </div>
            )}
        </div>
    </div>
)}                
                {/* 3. QR CODE TAB */}
                {activeTab === 'qr' && (
                    <div className="space-y-6">
                        <QRCodeTemplates restaurantId={restaurantId} membership_level={restaurant.membership_level} />
                    </div>
                )}
                
                {/* 4. SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Icons.Settings /></span>
                                Restaurant Profile
                            </h3>
                            <AdminSettings />
                         </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center"><Icons.Home /></span>
                                Social & Contact Info
                            </h3>
                            <CustomFields />
                         </div>
                    </div>
                )}
                
                {/* 5. UPLOADS TAB */}
                {activeTab === 'uploads' && (
                      <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200 text-center max-w-3xl mx-auto mt-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 ring-4 ring-blue-50"><Icons.Upload /></div>
                        <h2 className="text-3xl font-bold text-gray-800">Bulk Menu Import</h2>
                        <p className="text-gray-500 mt-3 mb-10 max-w-lg mx-auto leading-relaxed">
                            Don't waste time adding dishes one by one. Upload your menu using an image, PDF, or Excel file and our AI will organize it for you.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <button 
                                onClick={() => triggerAction(() => handleOptionClick("/bulk-upload", true))} 
                                disabled={isLoading}
                                className="p-6 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 group text-center"
                            >
                                <span className="text-3xl">📄</span>
                                <div>
                                    <span className="block font-bold text-gray-800 group-hover:text-indigo-700 text-lg">AI Assistant Import</span>
                                    <span className="text-sm text-gray-500 mt-1">Review items before adding them to your menu.</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => triggerAction(() => handleOptionClick("/bulk-upload", true))} 
                                disabled={isLoading}
                                className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-3 text-center border-2 border-transparent"
                            >
                                <span className="text-3xl">⚡</span>
                                <div>
                                    <span className="block font-bold text-white text-lg">Full Auto Import</span>
                                    <span className="text-sm text-blue-100 opacity-90 mt-1">Fastest method. AI handles everything automatically.</span>
                                </div>
                            </button>
                        </div>
                      </div>
                )}

            </div>
        </div>
        {/* Add this near the bottom of your return */}
<CategoryReorderModal 
    isOpen={showReorderModal} 
    onClose={() => setShowReorderModal(false)}
    categories={orderedMenuGroups.map(g => g.category)} 
    onSave={handleSaveCategoryOrder} 
/>

        {/* Global Loading Overlay */}
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                 <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                    <span className="font-bold text-gray-800 text-lg">Processing...</span>
                    <span className="text-gray-500 text-sm mt-1">Please wait while we update your data.</span>
                 </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;