import React, { useState, useEffect } from "react";

// Inline Icons to match Dashboard style
const Icons = {
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Upload: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Image: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

const WP_USERNAME = "yashkolnure58@gmail.com";
const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
const WP_SITE_URL = "https://website.avenirya.com";

const OfferBannerManager = ({ restaurantId, token, offers, setOffers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({ file: null, preview: "" });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch offers on mount
  useEffect(() => {
    if (!restaurantId || !token) return;
    const fetchOffers = async () => {
      try {
        const res = await fetch(`/api/admin/${restaurantId}/offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setOffers(data);
        } else {
          console.error("Failed to load offers:", data.message);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };
    fetchOffers();
  }, [restaurantId, token, setOffers]);

  const handleOfferImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewOffer({ file, preview: URL.createObjectURL(file) });
  };

  const uploadToWordPress = async (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload to WordPress");
    const data = await res.json();
    return data.source_url;
  };

  const handleAddOffer = async () => {
    if (offers.length >= 5) {
      setMessage("⚠️ Max 5 banners allowed.");
      return;
    }
    if (!newOffer.file) {
      setMessage("⚠️ Please select an image.");
      return;
    }

    setLoading(true);
    setMessage("Uploading...");
    try {
      const imageUrl = await uploadToWordPress(newOffer.file);
      const res = await fetch(`/api/admin/${restaurantId}/offers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      const result = await res.json();
      if (res.ok) {
        setOffers((prev) => [result, ...prev]);
        setNewOffer({ file: null, preview: "" });
        setIsModalOpen(false); // Close modal on success
      } else throw new Error(result.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm("Delete this banner?")) return;
    setDeletingId(offerId);
    try {
      const res = await fetch(`/api/admin/${restaurantId}/offers/${offerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setOffers((prev) => prev.filter((o) => o._id !== offerId));
    } catch (e) {
      console.error(e);
      alert("Failed to delete banner");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* --- GRID VIEW OF BANNERS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {/* Existing Banners */}
        {offers.map((o) => (
          <div key={o._id} className="group relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <img src={o.image} alt="Offer" className="w-full h-full object-cover" />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDeleteOffer(o._id)}
                disabled={deletingId === o._id}
                className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                title="Delete Banner"
              >
                {deletingId === o._id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icons.Trash />
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Add New Button (Only show if < 5) */}
        {offers.length < 5 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
          >
            <div className="transform group-hover:scale-110 transition-transform duration-200">
               <Icons.Plus />
            </div>
            <span className="text-xs font-semibold mt-1">Add Banner</span>
          </button>
        )}
      </div>

      {/* Helper Text */}
      {offers.length === 0 && (
         <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start gap-2">
            <span className="text-lg">💡</span>
            <p><strong>Tip:</strong> Adding a banner increases customer engagement by 25%. Upload a high-quality image of your best dish or current offer.</p>
         </div>
      )}


      {/* --- UPLOAD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative m-4">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Upload New Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Icons.Close />
              </button>
            </div>

            {/* Drop Zone */}
            <div className="space-y-4">
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOfferImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {newOffer.preview ? (
                   <img src={newOffer.preview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                ) : (
                   <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-indigo-500">
                      <Icons.Upload />
                      <p className="mt-2 text-sm font-medium text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                   </div>
                )}
              </div>

              {message && <p className="text-center text-sm font-medium text-indigo-600 animate-pulse">{message}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOffer}
                  disabled={loading || !newOffer.file}
                  className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all shadow-md ${
                    loading || !newOffer.file
                      ? "bg-gray-300 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                  }`}
                >
                  {loading ? "Uploading..." : "Save Banner"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OfferBannerManager;