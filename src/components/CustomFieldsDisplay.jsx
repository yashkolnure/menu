import React, { useEffect, useState } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaGlobe,
  FaPhone,
} from "react-icons/fa";

const API_BASE = "";

const CustomFieldsDisplay = ({ restaurantId }) => {
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurantId) {
      setError("Missing restaurantId");
      setLoading(false);
      return;
    }

    const fetchFields = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/admin/custom-fields?restaurantId=${restaurantId}`
        );

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        setFields(data);
      } catch (e) {
        setError(e.message || "Failed to fetch fields");
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [restaurantId]);

  if (loading) return <p className="text-gray-500">Loading info...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!fields) return <p className="text-gray-500">No info found.</p>;

  return (
    <div className="text-center space-y-4 mt-8 mb-2">
      {/* Icons row */}
      <div className="flex justify-center items-center gap-10">
        {fields.instagram && (
          <a
            href={fields.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-pink-600 hover:scale-110 transition"
          >
            <FaInstagram className="text-4xl" />
          </a>
        )}

        {fields.facebook && (
          <a
            href={fields.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-600 hover:scale-110 transition"
          >
            <FaFacebook className="text-4xl" />
          </a>
        )}

        {fields.website && (
          <a
            href={fields.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-green-600 hover:scale-110 transition"
          >
            <FaGlobe className="text-4xl" />
          </a>
        )}

        {fields.contact && (
          <a
            href={`tel:${fields.contact}`}
            className="flex flex-col items-center text-gray-700 hover:scale-110 transition"
          >
            <FaPhone className="text-4xl" />
          </a>
        )}
      </div>

      {/* Custom line below */}
      {fields.customLine && (
        <p className="text-gray-700 text-2xl font-semibold font-sans tracking-wide ">{fields.customLine}</p>
      )}
    </div>
  );
};

export default CustomFieldsDisplay;
