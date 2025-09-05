import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const MembershipUpgrade = ({ restaurant, setRestaurant, token }) => {
  const [upgradeLevel, setUpgradeLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!upgradeLevel) {
      setError("Please select a level to upgrade");
      return;
    }
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await axios.put(
        `/api/restaurant/upgrade-membership/${restaurant._id}`,
        { newLevel: Number(upgradeLevel) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRestaurant(res.data.restaurant); // update dashboard state
      setMsg(res.data.message);
      setUpgradeLevel("");
    } catch (err) {
      setError(err.response?.data?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 mt-6">
              <Helmet>
        <title>Petoba | Digital QR Menu & Ordering</title>
        <meta
          name="description"
          content="Petoba lets restaurants create digital QR menus. Customers scan, order, and enjoy a contactless dining experience."
        />

        <link
          rel="icon"
          href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png"
          type="image/png"
        />
        <meta
          property="og:image"
          content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png"
        />
        <meta property="og:title" content="Petoba - Digital QR Menu" />
        <meta property="og:description" content="Turn your restaurant’s menu into a digital QR code menu." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yash.avenirya.com" />
      </Helmet>
      <h3 className="text-xl font-semibold mb-4">🌟 Membership Plan</h3>
      <p className="mb-2">
        Current Level:{" "}
        <span className="font-bold text-blue-600">
          {restaurant.membership_level}
        </span>
      </p>

      <div className="flex items-center gap-4">
        <select
          value={upgradeLevel}
          onChange={(e) => setUpgradeLevel(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Upgrade Level</option>
          {[2, 3].map(
            (level) =>
              level > restaurant.membership_level && (
                <option key={level} value={level}>
                  Upgrade to Level {level}
                </option>
              )
          )}
        </select>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow disabled:bg-gray-400"
        >
          {loading ? "Upgrading..." : "Upgrade Membership"}
        </button>
      </div>

      {msg && <p className="text-green-600 mt-3">{msg}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default MembershipUpgrade;
