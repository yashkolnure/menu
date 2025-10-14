import React, { useEffect, useState } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaGlobe,
  FaPhone,
  FaGoogle,
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
{fields.googleReview && (
  <a
    href={fields.googleReview}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center hover:scale-110 transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="38" height="38">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.3H272v95.2h146.9c-6.3 33.9-25.1 62.6-53.6 81.8v67.8h86.4c50.5-46.5 81.8-115.1 81.8-194.5z"/>
      <path fill="#34A853" d="M272 544.3c72.6 0 133.5-24.1 178-65.6l-86.4-67.8c-24 16.1-54.6 25.5-91.6 25.5-70.4 0-130.1-47.6-151.5-111.3H30.6v69.9C74.8 476 165.3 544.3 272 544.3z"/>
      <path fill="#FBBC05" d="M120.5 324.9c-4.9-16.1-7.7-33.3-7.7-51s2.8-34.9 7.7-51V153H30.6C11 192.3 0 235.6 0 273.9s11 81.6 30.6 120.9l89.9-69.9z"/>
      <path fill="#EA4335" d="M272 107.7c39.6 0 74.8 13.6 102.7 40.4l76.8-76.8C405.5 25.3 344.6 0 272 0 165.3 0 74.8 68.3 30.6 153l89.9 69.9C141.9 155.3 201.6 107.7 272 107.7z"/>
    </svg>
    

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
