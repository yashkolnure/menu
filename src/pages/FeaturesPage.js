import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const FeaturesPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(
          "/api/admin/restaurants-with-many-menus"
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        if (data.success && data.restaurants.length > 0) {
          setRestaurants(data.restaurants.reverse());
        } else {
          setRestaurants([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="relative bg-white py-16 min-h-screen">
      <Helmet>
        <title>Petoba | Restaurants Demo</title>
      </Helmet>

      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

      <h2 className="text-4xl font-bold text-center mb-4">Our Digital Menu Portfolio</h2>
      <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
        Take a look at the restaurants we’ve transformed with digital menus. Click “View Menu” to explore live demos.
      </p>

      <div className="relative z-10 max-w-6xl mx-auto px-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {loading && (
          <p className="col-span-full text-center text-gray-500">Loading restaurants...</p>
        )}
        {error && (
          <p className="col-span-full text-center text-red-500">Error: {error}</p>
        )}
        {!loading && !error && restaurants.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No restaurants found.</p>
        )}

        {!loading &&
          !error &&
          restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="flex flex-col justify-between bg-white rounded-3xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    restaurant.logo ||
                    "https://via.placeholder.com/50/cccccc/888888?text=No+Logo"
                  }
                  alt={restaurant.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col overflow-hidden">
                  <p className="text-gray-800 font-semibold text-lg truncate">
                    {restaurant.name}
                  </p>
                  <p className="text-gray-500 text-sm truncate">{restaurant.address || ""}</p>
                </div>
              </div>
              <a
                href={`https://yash.avenirya.com/demo/${restaurant._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-center py-2 px-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
              >
                View Menu
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};


export default FeaturesPage;
