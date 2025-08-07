import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuCard from "../components/MenuCardWp";

function RestaurantMenuPagewp() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tableFromURL = searchParams.get("table");
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
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
          `https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${id}/offers`,
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
          fetch(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${id}/menu`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${id}/details`, {
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
    const matchCategory = category === "All" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = item => {
    const exists = cart.find(c => c._id === item._id);
    if (exists) {
      const updated = cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      setCart(updated);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success("Added to cart!");
  };

  const removeFromCart = itemId => {
    const updated = cart.filter(c => c._id !== itemId);
    setCart(updated);
  };

  const updateQty = (itemId, qty) => {
    if (qty <= 0) return removeFromCart(itemId);
    setCart(cart.map(c => (c._id === itemId ? { ...c, quantity: qty } : c)));
  };

  const handleTableNumberSubmit = async () => {
    if (!tableNumber) return toast.error("Please enter a valid table number.");
    if (cart.length === 0) return toast.error("Your cart is empty!");

const adminPhone = restaurantDetails?.contact?.replace(/\D/g, ""); // Remove non-digit chars, just in case
if (!adminPhone) {
  return toast.error("Restaurant contact number not available.");
}

    const orderSummary = cart
      .map(item => `• ${item.name} x ${item.quantity}`)
      .join("%0A");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const message = `New Order%0ATable: ${tableNumber}%0A%0A${orderSummary}%0A%0ATotal: ₹${total}`;
    const whatsappURL = `https://wa.me/${adminPhone}?text=${message}`;

    setCart([]);
    localStorage.removeItem("cart");
    window.location.href = whatsappURL;
  };

  return (
    <>
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
      </div>


      {cart.length > 0 && (
        <div className="fixed bottom-5 right-5">
            <button
            onClick={() => setShowCart(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-all"
            >
            View Cart ({cart.length})
            </button>
        </div>
        )}

        {showCart && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl max-w-md w-full mx-4 p-5 space-y-4 relative">
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                    onClick={() => setShowCart(false)}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-center mb-3">Your Cart</h2>

                {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center border-b py-2">
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                        -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                        +
                        </button>
                        <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                        >
                        🗑
                        </button>
                    </div>
                    </div>
                ))}

                <div className="pt-3">
                    <p className="text-right font-semibold">
                    Total: ₹
                    {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </p>
                </div>

                <div>
                    <input
                    type="text"
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    placeholder="Enter table number"
                    className="w-full px-4 py-2 border rounded-lg mt-3"
                    />
                </div>

                <button
                    onClick={handleTableNumberSubmit}
                    className="bg-green-600 text-white w-full mt-3 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Order via WhatsApp
                </button>
                </div>
            </div>
            )}



      <ToastContainer position="bottom-left" autoClose={2000} />
    </>
  );
}

export default RestaurantMenuPagewp;