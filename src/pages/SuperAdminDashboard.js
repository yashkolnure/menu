import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit, Trash2, LogIn, ExternalLink, Loader2, Upload, Plus,
  Search, Filter, ChevronLeft, ChevronRight, AlertCircle,
  LayoutGrid, Store, Settings, LogOut, Menu, X, Copy,
  CreditCard, QrCode, ArrowUpDown, CheckCircle, XCircle,
  User, Mail, Phone
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const SuperAdminDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("dashboard"); // 🆕 Tab State
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data View State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpiry, setFilterExpiry] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; 

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingHome, setUploadingHome] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", address: "", logo: "", contact: "",
    password: "", subadmin_id: "", membership_level: "",
    currency: "INR", homeImage: "", active: true, billing: true,
  });

  // Actions State
  const [activeDropdown, setActiveDropdown] = useState({ id: null, type: null });

  // Config
  const agencyId = localStorage.getItem("agencyId");
  const limits = { 1: 10, 2: 25, 3: 10000 };
  const agencyLevel = parseInt(localStorage.getItem("agencyLevel") || "1", 10);
  const API = "/api/admin";
  const WP_SITE_URL = "https://website.avenirya.com";
  const WP_AUTH = "Basic " + btoa("yashkolnure58@gmail.com:05mq iTLF UvJU dyaz 7KxQ 8pyc");

  const currencies = [
    { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" }, { code: "AED", symbol: "د.إ" }, { code: "AUD", symbol: "A$" },
    { code: "CAD", symbol: "CA$" }, { code: "SGD", symbol: "S$" }, { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  ];

  useEffect(() => {
    if (agencyId) {
      setForm((prev) => ({ ...prev, subadmin_id: agencyId }));
      fetchRestaurants();
    }
  }, [agencyId]);

  // --- API OPERATIONS ---
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/restaurants`);
      setRestaurants(res.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const uploadToWordPress = async (file, field) => {
    const formData = new FormData();
    formData.append("file", file);
    field === 'homeImage' ? setUploadingHome(true) : setUploading(true);

    try {
      const res = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, formData, {
        headers: { Authorization: WP_AUTH, "Content-Disposition": `attachment; filename="${file.name}"` },
      });
      setForm((prev) => ({ ...prev, [field]: res.data.source_url }));
      toast.success("Uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      field === 'homeImage' ? setUploadingHome(false) : setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, membership_level: 3 };
      if (!payload.password) delete payload.password;

      if (editingId) {
        await axios.put(`${API}/restaurants/${editingId}`, payload);
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API}/restaurant/register`, payload);
        toast.success("Created successfully");
      }
      setFormOpen(false);
      resetForm();
      fetchRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleStatusUpdate = async (id, type, isActive, expiryDate = null) => {
    try {
      const payload = type === 'qr' 
        ? { active: isActive, expiresAt: expiryDate }
        : { billing: isActive, billingExpiresAt: expiryDate };
        
      await axios.put(`${API}/restaurants/${id}`, payload);
      toast.success("Status updated");
      fetchRestaurants();
      setActiveDropdown({ id: null, type: null });
    } catch { toast.error("Update failed"); }
  };

  const handleLoginAs = async (id) => {
    const agencyToken = localStorage.getItem("agencyToken");
    if (!agencyToken) return toast.error("Unauthorized");
    try {
      const res = await axios.post(`${API}/agency-login-restaurant/${id}`, {}, { headers: { Authorization: `Bearer ${agencyToken}` } });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("restaurantId", res.data.restaurant._id);
      localStorage.setItem("impersonatedBy", "agency");
      window.open("/dashboard", "_blank"); 
    } catch { toast.error("Login failed"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this restaurant? This cannot be undone.")) {
        try {
            await axios.delete(`${API}/restaurants/${id}`);
            toast.success("Deleted");
            fetchRestaurants();
        } catch { toast.error("Delete failed"); }
    }
  };

  // --- LOGIC HELPER ---
  const resetForm = () => {
    setForm({ name: "", email: "", address: "", logo: "", contact: "", password: "", currency: "INR", subadmin_id: agencyId, membership_level: "", homeImage: "", active: true, billing: true });
    setEditingId(null);
  };

  const getDaysLeft = (date) => date ? Math.floor((new Date(date) - new Date()) / 86400000) : null;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- 🆕 UNIVERSAL SEARCH & FILTERING ---
  let processedData = restaurants.filter(r => {
    // Search in Name, Email, Address, Contact, and ID
    const searchTerms = searchQuery.toLowerCase();
    const matchSearch = 
        r.name?.toLowerCase().includes(searchTerms) || 
        r.email?.toLowerCase().includes(searchTerms) ||
        r.address?.toLowerCase().includes(searchTerms) ||
        r.contact?.toString().toLowerCase().includes(searchTerms) ||
        r._id?.toLowerCase().includes(searchTerms);

    if (!filterExpiry) return matchSearch;
    
    // Expiry Logic
    const d1 = getDaysLeft(r.expiresAt);
    const d2 = getDaysLeft(r.billingExpiresAt);
    return matchSearch && ((d1 !== null && d1 <= 7 && d1 > -5) || (d2 !== null && d2 <= 7 && d2 > -5));
  });

  if (sortConfig.key) {
    processedData.sort((a, b) => {
      const aVal = new Date(a[sortConfig.key] || 0);
      const bVal = new Date(b[sortConfig.key] || 0);
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const currentData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const stats = {
    total: restaurants.length,
    activeQR: restaurants.filter(r => r.active).length,
    activeBilling: restaurants.filter(r => r.billing).length,
    expiring: restaurants.filter(r => {
        const d1 = getDaysLeft(r.expiresAt);
        const d2 = getDaysLeft(r.billingExpiresAt);
        return (d1 !== null && d1 <= 7 && d1 > 0) || (d2 !== null && d2 <= 7 && d2 > 0);
    }).length
  };

  if (!agencyId) return <div className=" flex items-center justify-center text-gray-500">Authentication Required</div>;

  return (
    <div className="flex  bg-white font-sans text-gray-800">
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />



      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600"><Menu /></button>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab === 'dashboard' ? 'Overview' : 'Settings'}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <span>Plan Limit: {restaurants.length} / {limits[agencyLevel] || 0}</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">S</div>
          </div>
        </header>

        {/* --- VIEW 1: DASHBOARD / RESTAURANTS TABLE --- */}
        {activeTab === 'dashboard' && (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Clients" value={stats.total} icon={Store} />
            <StatCard label="QR Active" value={stats.activeQR} icon={QrCode} />
            <StatCard label="Billing Active" value={stats.activeBilling} icon={CreditCard} />
            <StatCard label="Expiring Soon" value={stats.expiring} icon={AlertCircle} isWarning />
          </div>

          {/* Table Container */}
          <div className="border border-gray-100 rounded-2xl shadow-sm bg-white flex flex-col ">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm w-full sm:w-72 focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all" 
                    placeholder="Search name, email, contact, address..." 
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <button 
                  onClick={() => setFilterExpiry(!filterExpiry)}
                  className={`p-2 rounded-lg border transition-colors ${filterExpiry ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                  title="Filter Near Expiry"
                >
                  <Filter size={18} />
                </button>
              </div>
              <button 
                onClick={() => {
                    if (restaurants.length >= limits[agencyLevel]) return toast.error("Plan limit reached");
                    resetForm(); setFormOpen(true);
                }} 
                className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gray-200"
              >
                <Plus size={16} /> Add Client
              </button>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto scrollbar-hide"> 
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-gray-100">Client Details</th>
                    <th className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('expiresAt')}>
                        <div className="flex items-center gap-1 justify-center">QR Status <ArrowUpDown size={12}/></div>
                    </th>
                    <th className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('billingExpiresAt')}>
                        <div className="flex items-center gap-1 justify-center">Billing Status <ArrowUpDown size={12}/></div>
                    </th>
                    <th className="p-4 border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></td></tr>
                  ) : currentData.length === 0 ? (
                    <tr><td colSpan="4" className="p-20 text-center text-gray-400">No results found</td></tr>
                  ) : (
                    currentData.map((rest) => (
                      <tr key={rest._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {rest.logo ? <img src={rest.logo} className="w-full h-full object-cover" alt="" /> : <Store size={18} className="text-gray-400"/>}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{rest.name}</div>
                              <div className="text-xs text-gray-500 font-mono mt-0.5">{rest.email || "No Email"}</div>
                              {rest.contact && <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Phone size={10}/> {rest.contact}</div>}
                              {rest.address && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{rest.address}</div>}
                            </div>
                          </div>
                        </td>

                        {/* QR Column */}
                        <td className="p-4 text-center align-top">
                           <StatusController 
                              active={rest.active} 
                              expiry={rest.expiresAt} 
                              isOpen={activeDropdown.id === rest._id && activeDropdown.type === 'qr'}
                              onToggle={() => setActiveDropdown(prev => prev.id === rest._id && prev.type === 'qr' ? {id:null} : {id: rest._id, type: 'qr'})}
                              onUpdate={(isActive, date) => handleStatusUpdate(rest._id, 'qr', isActive, date)}
                           />
                        </td>

                        {/* Billing Column */}
                        <td className="p-4 text-center align-top">
                           <StatusController 
                              active={rest.billing} 
                              expiry={rest.billingExpiresAt} 
                              isOpen={activeDropdown.id === rest._id && activeDropdown.type === 'billing'}
                              onToggle={() => setActiveDropdown(prev => prev.id === rest._id && prev.type === 'billing' ? {id:null} : {id: rest._id, type: 'billing'})}
                              onUpdate={(isActive, date) => handleStatusUpdate(rest._id, 'billing', isActive, date)}
                              isBilling
                           />
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right align-top">
  <div className="flex items-center justify-end gap-2">
    
    {/* 1. Copy Link */}
    <button 
      onClick={() => { 
        // Copies the /menuwp/ link
        navigator.clipboard.writeText(`https://petoba.in/menuwp/${rest._id}`); 
        toast.success("Menu link copied!"); 
      }} 
      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      title="Copy Menu Link"
    >
      <Copy size={18} />
    </button>

    {/* 2. Go to Menu (NEW) */}
    <a 
      href={`/menuwp/${rest._id}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      title="Open Live Menu"
    >
      <ExternalLink size={18} />
    </a>

    {/* 3. Login */}
    <button 
      onClick={() => handleLoginAs(rest._id)} 
      className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
      title="Login as Restaurant"
    >
      <LogIn size={18} />
    </button>

    {/* 4. Edit */}
    <button 
      onClick={() => { setEditingId(rest._id); setForm(rest); setFormOpen(true); }} 
      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="Edit Details"
    >
      <Edit size={18} />
    </button>

    {/* 5. Delete */}
    <button 
      onClick={() => handleDelete(rest._id)} 
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete Restaurant"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-between items-center text-xs text-gray-500">
               <span>Page {currentPage} of {totalPages || 1} ({itemsPerPage} items/page)</span>
               <div className="flex gap-1">
                 <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage===1} className="p-1.5 rounded hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-30"><ChevronLeft size={16}/></button>
                 <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage===totalPages} className="p-1.5 rounded hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-30"><ChevronRight size={16}/></button>
               </div>
            </div>
          </div>
        </div>
        )}

        {/* --- VIEW 2: SETTINGS (Placeholder) --- */}
        {activeTab === 'settings' && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <Settings size={64} className="mb-4 text-gray-300"/>
                <h2 className="text-xl font-semibold text-gray-600">Agency Settings</h2>
                <p className="text-sm">Manage your agency profile, branding, and defaults here.</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Back to Dashboard</button>
            </div>
        )}
      </main>

      {/* --- ADD/EDIT MODAL --- */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-gray-100">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Details' : 'New Registration'}</h2>
                <button onClick={() => setFormOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><X size={20}/></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Restaurant Name</label>
                    <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
               </div>
               <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</label>
                    <input name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
               </div>
               <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Address</label>
                    <input name="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" />
               </div>
               <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Contact</label>
                    <input name="contact" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="input-field" />
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</label>
                  <input name="password" type="password" placeholder={editingId ? "(Unchanged)" : ""} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" />
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Currency</label>
                  <select name="currency" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="input-field">
                    {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
                  </select>
               </div>

               <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                 <FileUploader label="Brand Logo" loading={uploading} preview={form.logo} onUpload={f => uploadToWordPress(f, 'logo')} />
                 <FileUploader label="Cover Image" loading={uploadingHome} preview={form.homeImage} onUpload={f => uploadToWordPress(f, 'homeImage')} />
               </div>
             </div>

             <div className="mt-8 flex gap-3">
               <button onClick={() => setFormOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition">Cancel</button>
               <button onClick={handleSave} disabled={loading || uploading || uploadingHome} className="flex-[2] py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
                 {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />} Save Changes
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SidebarLink = ({ icon: Icon, label, active, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
    {badge && <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const StatCard = ({ label, value, icon: Icon, isWarning }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-gray-200 transition-colors">
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className={`text-2xl font-bold ${isWarning && value > 0 ? 'text-red-500' : 'text-gray-900'}`}>{value}</h3>
    </div>
    <div className={`p-2.5 rounded-lg ${isWarning ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600 group-hover:bg-black group-hover:text-white transition-colors'}`}>
      <Icon size={20} />
    </div>
  </div>
);

const StatusController = ({ active, expiry, isOpen, onToggle, onUpdate, isBilling }) => {
  const days = expiry ? Math.floor((new Date(expiry) - new Date())/86400000) : null;
  const isExpiring = days !== null && days <= 7;
  
  return (
    <div className="relative inline-block text-left">
      <button onClick={onToggle} className={`w-32 py-1.5 px-3 rounded-md border text-xs font-semibold flex items-center justify-between gap-2 transition-all ${
        !active 
          ? "bg-gray-50 border-gray-200 text-gray-400" 
          : isExpiring 
            ? "bg-red-50 border-red-200 text-red-600" 
            : isBilling 
              ? "bg-purple-50 border-purple-200 text-purple-700" 
              : "bg-green-50 border-green-200 text-green-700"
      }`}>
        <span className="truncate">{active ? (days !== null ? (days <= 0 ? "Expired" : `${days} days`) : "Active") : "Inactive"}</span>
        <Settings size={12} className="opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95">
          <div className="p-2 bg-gray-50 border-b border-gray-100 font-bold text-gray-500 text-center">
            {active ? "Extend / Deactivate" : "Activate Plan"}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {active && (
                <button onClick={() => onUpdate(false, null)} className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold border-b border-gray-50 flex items-center gap-2">
                    <XCircle size={14}/> Deactivate
                </button>
            )}
            {[
              {l:"7 Days", v:"7d"}, {l:"1 Month", v:"1m"}, {l:"3 Months", v:"3m"},
              {l:"6 Months", v:"6m"}, {l:"1 Year", v:"1y"}, {l:"Lifetime", v:"5y"}
            ].map(opt => (
              <button key={opt.v} onClick={() => {
                  const now = new Date();
                  if(opt.v==="7d") now.setDate(now.getDate()+7);
                  if(opt.v==="1m") now.setMonth(now.getMonth()+1);
                  if(opt.v==="3m") now.setMonth(now.getMonth()+3);
                  if(opt.v==="6m") now.setMonth(now.getMonth()+6);
                  if(opt.v==="1y") now.setFullYear(now.getFullYear()+1);
                  if(opt.v==="5y") now.setFullYear(now.getFullYear()+5);
                  onUpdate(true, now);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      )}
      {isOpen && <div className="fixed inset-0 z-40" onClick={onToggle}></div>}
    </div>
  );
};

const TooltipBtn = ({ icon: Icon, onClick, label, highlight, color }) => (
  <button 
    onClick={onClick} 
    title={label}
    className={`p-1.5 rounded-md transition-all ${
      color || (highlight ? "bg-black text-white hover:bg-gray-800" : "text-gray-400 hover:text-black hover:bg-gray-100")
    }`}
  >
    <Icon size={16} />
  </button>
);

const FileUploader = ({ label, loading, preview, onUpload }) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative group bg-gray-50/50">
    <input type="file" accept="image/*" onChange={e => onUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
    {loading ? <Loader2 className="animate-spin mx-auto text-gray-400" /> : 
     preview ? (
        <div className="relative h-20 w-full">
            <img src={preview} className="h-full w-full object-contain" alt="Preview" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded transition-opacity pointer-events-none">Change</div>
        </div>
     ) : (
        <div className="text-gray-400 text-xs">
            <Upload className="mx-auto mb-2 text-gray-300" size={20}/> 
            <span className="font-semibold text-gray-500">{label}</span>
        </div>
    )}
  </div>
);

// Inject Styles for Inputs
const style = document.createElement('style');
style.innerHTML = `
  .input-field {
    width: 100%; 
    padding: 0.75rem; 
    background-color: #f9fafb; 
    border: 1px solid #f3f4f6; 
    border-radius: 0.5rem; 
    font-size: 0.875rem; 
    outline: none; 
    transition: all 0.2s;
  }
  .input-field:focus {
    background-color: #ffffff;
    border-color: #000000;
    box-shadow: 0 0 0 1px #000000;
  }
`;
document.head.appendChild(style);

export default SuperAdminDashboard;