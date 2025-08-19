import React, { useState } from "react";

const WP_USERNAME = "yashkolnure58@gmail.com";
const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
const WP_SITE_URL = "https://website.avenirya.com";

const OfferBannerModal = ({ restaurantId, token, offers, setOffers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({ file: null, preview: "" });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  // File select handler
  const handleOfferImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewOffer({ file, preview: URL.createObjectURL(file) });
  };

  // Upload to WordPress Media
  const uploadToWordPress = async (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const res = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`), // WP App password auth
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload to WordPress");

    const data = await res.json();
    return data.source_url; // uploaded image URL
  };

  // Add offer
  const handleAddOffer = async () => {
    if (offers.length >= 5) {
      setMessage("⚠️ You can only upload max 5 banners.");
      return;
    }
    if (!newOffer.file) {
      setMessage("⚠️ Please select an image first.");
      return;
    }

    setLoading(true);
    setMessage("⏳ Uploading...");
    try {
      // Step 1: Upload to WordPress
      const imageUrl = await uploadToWordPress(newOffer.file);

      // Step 2: Save URL to your backend
      const res = await fetch(
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/offers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageUrl }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        setOffers((prev) => [result, ...prev]);
        setNewOffer({ file: null, preview: "" });
        setMessage("✅ Uploaded successfully!");
      } else throw new Error(result.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Delete offer
  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    setDeletingId(offerId);
    setMessage("⏳ Deleting...");
    try {
      const res = await fetch(
        `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/offers/${offerId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setOffers((prev) => prev.filter((o) => o._id !== offerId));
      setMessage("✅ Deleted successfully!");
    } catch (e) {
      console.error(e);
      setMessage("❌ Failed to delete.");
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-5 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-medium rounded-lg shadow hover:opacity-90"
      >
        Manage Banners
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">🎁 Manage Offer Banners</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <div className="mb-4 text-center text-sm font-medium text-gray-700">
                {message}
              </div>
            )}

            {/* Upload Section */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center mb-6 hover:bg-gray-50">
              <p className="text-gray-600 mb-2">Upload a new offer banner</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleOfferImageUpload}
                className="block mx-auto"
              />
              {newOffer.preview && (
                <div className="mt-4">
                  <img
                    src={newOffer.preview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg shadow mb-3"
                  />
                  <button
                    onClick={handleAddOffer}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </div>

            {/* Existing Banners */}
            <h3 className="text-lg font-medium mb-3">Existing Banners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {offers.length > 0 ? (
                offers.map((o) => (
                  <div
                    key={o._id}
                    className="relative rounded-lg overflow-hidden shadow group"
                  >
                    <img
                      src={o.image}
                      alt="Offer"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      onClick={() => handleDeleteOffer(o._id)}
                      disabled={deletingId === o._id}
                      className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100 ${
                        deletingId === o._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {deletingId === o._id ? "Deleting..." : "Delete"}
                    </button>
                    <p className="text-xs text-gray-500 px-2 py-1 bg-gray-50">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No offers uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferBannerModal;
