import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePagePortfolioSection = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("/api/admin/restaurants-with-many-menus");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        if (data.success && data.restaurants.length > 0) {
          // ✅ Take latest 6 from bottom and reverse to show newest first
          const latestSix = data.restaurants.slice(-6).reverse();
          setRestaurants(latestSix);
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
    <section className="relative  py-16">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Our Digital Menu Portfolio</h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          Take a look at how restaurants are transforming their dining experience with our digital QR Menu
        </p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {loading && (
            <p className="col-span-full text-center text-gray-500">
              Loading restaurants...
            </p>
          )}
          {error && (
            <p className="col-span-full text-center text-red-500">
              Error: {error}
            </p>
          )}
          {!loading && !error && restaurants.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No restaurants found.
            </p>
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
                  <div className="flex flex-col overflow-hidden text-left">
                    <p className="text-gray-800 font-semibold text-lg truncate">
                      {restaurant.name}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      {restaurant.address || ""}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://yash.avenirya.com/d/${restaurant._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-center py-2 px-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
                >
                  View Menu
                </a>
              </div>
            ))}
        </div>

        {/* See All Button */}
        {!loading && restaurants.length > 0 && (
          <div className="mt-10">
            <Link
              to="/portfolio"
              className="inline-block py-3 px-8 bg-gradient-to-r text-xl from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
            >
              See All Menus
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePagePortfolioSection;
