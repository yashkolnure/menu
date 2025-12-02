import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { 
  Wand2, Save, RefreshCw, Image as ImageIcon, Upload, ArrowRight, XCircle 
} from "lucide-react";

function Dashboard() {
  const [restaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [token] = useState(localStorage.getItem("token"));
  
  // --- STATE ---
  const [menuItems, setMenuItems] = useState([]);
  
  // pendingUpdates: Stores the currently selected image URL for preview { itemId: url }
  const [pendingUpdates, setPendingUpdates] = useState({}); 
  
  // allCandidates: Stores the list of alternative images found by AI { itemId: [url1, url2...] }
  const [allCandidates, setAllCandidates] = useState({}); 
  
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [galleryItem, setGalleryItem] = useState(null);
  
  const navigate = useNavigate();

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (restaurantId && token) fetchMenu();
  }, [restaurantId, token]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`/api/admin/${restaurantId}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(res.data);
    } catch (e) { setError("Failed to fetch menu."); }
  };

  // --- 1. FETCH AI SUGGESTIONS (Preview Mode) ---
  const handleFetchSuggestions = async () => {
    setIsFetching(true);
    setMessage("AI is scanning 10,000+ database images... this may take a moment.");
    setError("");

    try {
      const res = await axios.post(
        `/api/admin/${restaurantId}/get-ai-suggestions`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Merge AI findings into our state
        setPendingUpdates(prev => ({ ...prev, ...res.data.suggestions }));
        setAllCandidates(prev => ({ ...prev, ...res.data.candidates }));
        
        setMessage(res.data.message);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch suggestions. Server might be busy.");
    } finally {
      setIsFetching(false);
    }
  };

  // --- 2. CYCLE NEXT IMAGE (From Top 5) ---
  const handleNextImage = (e, itemId) => {
    e.stopPropagation(); // Prevent focusing the card wrapper
    const candidates = allCandidates[itemId];
    
    if (!candidates || candidates.length < 2) return; 

    const currentUrl = pendingUpdates[itemId];
    const currentIndex = candidates.indexOf(currentUrl);
    
    // Cycle index: 0 -> 1 -> 2 -> 3 -> 4 -> 0
    const nextIndex = (currentIndex + 1) % candidates.length;
    const nextUrl = candidates[nextIndex];

    setPendingUpdates(prev => ({ ...prev, [itemId]: nextUrl }));
  };

  // --- 3. PASTE HANDLER (Ctrl+V) ---
  const handlePaste = (e, itemId) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault(); // Stop browser default
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setPendingUpdates(prev => ({ ...prev, [itemId]: event.target.result }));
        };
        reader.readAsDataURL(file);
        return; 
      }
    }
  };

  // --- 4. MANUAL UPLOAD HANDLER ---
  const handleUploadPreview = (e, itemId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingUpdates(prev => ({ ...prev, [itemId]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 5. SAVE ALL (Commit) ---
  const handleSaveAll = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    
    setIsSaving(true);
    try {
      await axios.put(
        `/api/admin/${restaurantId}/bulk-update-images`,
        { updates: pendingUpdates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Clear preview states and refresh data
      setPendingUpdates({});
      setAllCandidates({});
      await fetchMenu();
      setMessage("✅ All images saved successfully!");
    } catch (err) {
      setError("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const pendingCount = Object.keys(pendingUpdates).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 pb-32">
      <Helmet><title>Menu Image Manager</title></Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER TOOLBAR */}
        <div className="bg-white sticky top-4 z-30 rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <ImageIcon className="text-blue-600"/> Menu Image Manager
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pendingCount > 0 ? (
                <span className="text-orange-600 font-bold">{pendingCount} changes waiting to be saved.</span>
              ) : (
                "No unsaved changes."
              )}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleFetchSuggestions}
              disabled={isFetching}
              className="px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition flex items-center gap-2 border border-blue-200"
            >
              {isFetching ? <RefreshCw className="animate-spin"/> : <Wand2 size={20}/>}
              {isFetching ? "Analyzing..." : "1. Auto-Fill Missing (AI)"}
            </button>

            <button
              onClick={handleSaveAll}
              disabled={pendingCount === 0 || isSaving}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center gap-2 transform hover:-translate-y-1
                ${pendingCount > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}
              `}
            >
              {isSaving ? <RefreshCw className="animate-spin"/> : <Save size={20}/>}
              2. Save All
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {message && <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md animate-in slide-in-from-top-2">{message}</div>}
        {error && <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium shadow-md animate-in slide-in-from-top-2">{error}</div>}

        {/* IMAGE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {menuItems.map((item) => {
            const previewImage = pendingUpdates[item._id] || item.image;
            const isChanged = !!pendingUpdates[item._id];
            
            // Do we have multiple options for this item?
            const candidates = allCandidates[item._id];
            const hasAlternatives = candidates && candidates.length > 1;

            return (
              <div 
                key={item._id} 
                // 👇 Focusable for Paste
                tabIndex="0" 
                onPaste={(e) => handlePaste(e, item._id)}
                className={`group relative bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md outline-none
                  ${isChanged ? "ring-4 ring-orange-400 border-orange-400 transform scale-[1.02]" : "border border-gray-200"}
                  focus:ring-4 focus:ring-blue-500 focus:border-blue-500
                `}
              >
                {/* Image Display */}
                <div className="aspect-square bg-gray-100 relative">
                  {previewImage ? (
                    <img 
                        src={previewImage} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                      <span className="text-[10px] mt-1">No Image</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  {isChanged && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow z-20">PREVIEW</span>}
                  
                  {/* Paste Hint */}
                  <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition z-10 pointer-events-none">
                     <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">Click & Ctrl+V</span>
                  </div>

                  {/* ACTIONS OVERLAY */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2 z-10">
                    
                    {/* A. Next Option (If available) */}
                    {hasAlternatives && (
                        <button 
                            onClick={(e) => handleNextImage(e, item._id)}
                            className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 w-full flex items-center justify-center gap-1 shadow-md mb-1"
                        >
                            <ArrowRight size={14} className="text-purple-600"/> Next Option
                        </button>
                    )}

                    {/* B. Manual Upload */}
                    <label className="cursor-pointer bg-white/90 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white w-full text-center shadow-md">
                      <Upload size={12} className="inline mr-1"/> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadPreview(e, item._id)} />
                    </label>

                    {/* C. Revert (If changed) */}
                    {isChanged && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const newUpdates = {...pendingUpdates};
                                delete newUpdates[item._id];
                                setPendingUpdates(newUpdates);
                            }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 w-full shadow-md mt-1 flex items-center justify-center gap-1"
                        >
                            <XCircle size={12}/> Revert
                        </button>
                    )}
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 bg-white">
                  <h4 className="font-bold text-gray-800 text-sm truncate" title={item.name}>{item.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                     <p className="text-xs text-gray-500 truncate max-w-[70%]">{item.category}</p>
                     {/* Show match count badge */}
                     {hasAlternatives && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded font-medium" title="Alternative matches available">
                            +{allCandidates[item._id].length - 1}
                        </span>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="fixed bottom-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-900 transition flex items-center gap-2 z-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back
        </button>

      </div>
    </div>
  );
}

export default Dashboard;