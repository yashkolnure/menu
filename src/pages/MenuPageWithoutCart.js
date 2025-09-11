import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css";
import CustomFieldsDisplay from "../components/CustomFieldsDisplay";
import MenuCard from "../components/menuwithoutcart";

function RestaurantMenuPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tableFromURL = searchParams.get("table");

  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [activeOffer, setActiveOffer] = useState(0);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/admin/${id}/offers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setOffers(data);
      } catch {
        console.error("Failed to load offers");
      }
    };
    fetchOffers();
  }, [id]);

  useEffect(() => {
    if (tableFromURL) setTableNumber(tableFromURL);
  }, [tableFromURL]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [menuRes, detailsRes] = await Promise.all([
          fetch(`/api/admin/${id}/menu`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/admin/${id}/details`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const menu = await menuRes.json();
        const details = await detailsRes.json();

        if (Array.isArray(menu)) setMenuData(menu);
        else toast.error("Failed to load menu data.");

        setRestaurantDetails(details);
      } catch {
        toast.error("⚠️ Failed to load restaurant/menu data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  useEffect(() => {
    setCategories(["All", ...new Set(menuData.map(item => item.category))]);
  }, [menuData]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


const filteredMenu = menuData.filter(item => {
  // Normalize inStock value
  const isInStock = item.inStock === true || item.inStock === "true";

  const matchCategory = category === "All" || item.category === category;
  const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

  // Only include items that are in stock
  return isInStock && matchCategory && matchSearch;
});

  const addToCart = item => {
    if (cart.find(c => c._id === item._id)) toast.warn("Item already in cart!");
    else {
      setCart([...cart, { ...item, quantity: 1 }]);
      toast.success("Added to cart!");
    }
  };

  const handleTableNumberSubmit = async () => {
    if (!tableNumber) return toast.error("Please enter a valid table number.");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: id,
          tableNumber,
          items: cart.map(item => ({ itemId: item._id, quantity: item.quantity })),
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });

      if (res.ok) {
        toast.success("✅ Order placed!");
        setCart([]);
        setShowModal(false);
        setShowCart(false);
      } else {
        toast.error("❌ Order failed");
      }
    } catch {
      toast.error("⚠️ Server error");
    }
  };

  return (
    <>
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
      <header className="relative h-56 w-full mb-0 overflow-hidden rounded-b-xl shadow-lg">
        <img
          src="https://t3.ftcdn.net/jpg/02/97/67/70/360_F_297677001_zX7ZzRq8DObUV5IWTHAIhAae6DuiEQh4.jpg"
          alt="Food Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-10 bg-black/40 w-full h-full flex flex-col items-center justify-center px-4 py-6 space-y-4">
          {restaurantDetails?.logo && (
            <img src={restaurantDetails.logo} alt="Logo" className="h-20 sm:h-24 object-contain" />
          )}
          <input
            type="text"
            placeholder="Search for a dish..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow"
          />
        </div>
      </header>

      {offers.length > 0 && (
        <div className="bg-gray-100">
          <div
            ref={carouselRef}
            onScroll={() => {
              const container = carouselRef.current;
              const slideWidth = container.clientWidth * 0.8 + 16;
              const idx = Math.round(container.scrollLeft / slideWidth);
              setActiveOffer(idx);
            }}
            className="mt-4 w-full max-w-xl mx-auto mb-3 overflow-x-auto scroll-smooth px-4 cursor-grab"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex space-x-4">
              {offers.map(o => (
                <div key={o._id} className="flex-shrink-0 w-4/5 snap-start first:pl-4 last:pr-4">
                  <img
                    loading="lazy"
                    src={o.image}
                    alt=""
                    className="w-full h-[150px] max-h-[150px] object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-2 pb-6 bg-gray-100">
            {offers.map((_, idx) => (
              <span
                key={idx}
                className={`block w-2 h-2 rounded-full transition-all ${
                  idx === activeOffer ? "bg-orange-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 p-3">
        <div className="overflow-x-auto mb-4">
          <div className="flex gap-2 w-max px-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap ${
                  category === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center">
          {loading ? (
            <div className="flex justify-center items-center w-full py-10">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="ml-3 text-gray-500 text-sm">Loading menu...</p>
            </div>
          ) : filteredMenu.length > 0 ? (
            filteredMenu.map(item => (
              <MenuCard key={item._id} item={item} addToCart={addToCart} />
            ))
          ) : (
            <p className="text-gray-500 text-center mb-4">No items match your search.</p>
          )}
        </div>
         <div>
        
             <CustomFieldsDisplay restaurantId={id} />
        </div>
        <div className="flex flex-wrap justify-center">
          <p className="text-gray-500 text-center mt-4">© {new Date().getFullYear()} Petoba. All rights reserved.</p>
        </div>
      </div>

      {tableNumber && (
        <p className="text-center text-sm text-gray-600 mt-2 mb-5">
          Ordering for <strong>Table {tableNumber}</strong>
        </p>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default RestaurantMenuPage;
