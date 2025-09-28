import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomFieldsDisplay from "../components/CustomFieldsDisplay";
import { Helmet } from "react-helmet";
import MenuCard from "../components/MenuCard";

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
  const [loading, setLoading] = useState(true);
  const [wpno, setWpno] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [setIsCartClosing] = useState(false);
const [activeOffer, setActiveOffer] = useState(0);
  // Offers carousel state
  
const carouselRef = useRef(null);
  const [offers, setOffers] = useState([]);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/admin/${id}/offers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setOffers(data);
      } catch (err) {
        console.error("Failed to load offers", err);
      }
    };
    fetchOffers();
  }, [id]);

  useEffect(() => {
    if (tableFromURL) {
      setTableNumber(tableFromURL);
    }
  }, [tableFromURL]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/admin/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRestaurantDetails(data);
      } catch {
        toast.error("⚠️ Failed to fetch restaurant details");
      }
    };
    fetchDetails();
  }, [id]);

useEffect(() => {
  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/${id}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setMenuData(data);
      else toast.error("Failed to load menu data.");
    } catch {
      toast.error("Failed to load menu");
    }
    setLoading(false); // <-- set loading to false after fetch
  };
  fetchMenu();
}, [id]);

  useEffect(() => {
    const categoryList = ["All", ...new Set(menuData.map((item) => item.category))];
    setCategories(categoryList);
  }, [menuData]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

const filteredMenu = menuData.filter(item => {
  // Hide only if explicitly false
  const isInStock = !(item.inStock === false || item.inStock === "false");

  const matchCategory = category === "All" || item.category === category;
  const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

  return isInStock && matchCategory && matchSearch;
});

  const addToCart = (item) => {
    const exists = cart.find((c) => c._id === item._id);
    if (exists) toast.warn("Item already in cart!");
    else {
      setCart([...cart, { ...item, quantity: 1 }]);
      toast.success("Added to cart!");
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const increaseQty = (id) => {
    setCart(cart.map((item) => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQty = (id) => {
    setCart(cart.map((item) =>
      item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleTableNumberSubmit = async () => {
    if (!tableNumber) return toast.error("Please enter a valid table number.");
    if (!/^[6-9]\d{9}$/.test(wpno)) {
  return toast.error("Please enter a valid 10-digit WhatsApp number.");
}

    try {
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: id,
          tableNumber,
           wpno: "91" + wpno,
          items: cart.map((item) => ({ itemId: item._id, quantity: item.quantity })),
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });

      const data = await res.json();
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
            <img
              src={restaurantDetails.logo}
              alt="Logo"
              
              className="h-20 sm:h-20 object-contain"
            />
          )}
          <input
            type="text"
            placeholder="Search for a dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow"
          />
        </div>
      </header>
      {/* Offer Carousel (with scroll‑snap & dots) */}
{offers.length > 0 && (
  <div className="bg-gray-100">
    <div
      ref={carouselRef}
      onScroll={() => {
        const container = carouselRef.current;
        const slideWidth = container.clientWidth * 0.8 + 16; // 80% + gap
        const idx = Math.round(container.scrollLeft / slideWidth);
        setActiveOffer(idx);
      }}
      className="mt-4 w-full max-w-xl mx-auto mb-3 overflow-x-auto scroll-smooth px-4 cursor-grab"
      style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex space-x-4">
        {offers.map((o) => (
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

    {/* pagination dots */}
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
            {categories.map((cat) => (
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
    <p className="text-gray-500 text-center mb-4">Loading menu...</p>
  ) : filteredMenu.length > 0 ? (
    filteredMenu.map((item) => (
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
      {tableNumber && (
        <p className="text-center text-sm text-gray-600 mt-2 mb-5">
          Ordering for <strong>Table {tableNumber}</strong>
        </p>
      )}
       </div>

      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-5 right-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg text-lg z-50 flex items-center gap-2"
      >
        𓌉◯𓇋 {cart.length > 0 && <span>{cart.length}</span>}
      </button>

      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md animate-zoomIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between mb-3 border-b pb-2">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p>₹ {item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button className="px-2 bg-gray-300 rounded" onClick={() => decreaseQty(item._id)}>-</button>
                        <span>{item.quantity}</span>
                        <button className="px-2 bg-gray-300 rounded" onClick={() => increaseQty(item._id)}>+</button>
                      </div>
                    </div>
                    <button className="text-red-500" onClick={() => removeFromCart(item._id)}>Remove</button>
                  </div>
                ))}
                <h3 className="text-lg font-semibold mt-4">
                  Total: ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                </h3>
                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    onClick={() => setCart([])}
                    className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      if (tableNumber) handleTableNumberSubmit();
                      else setShowModal(true);
                    }}
                    className="w-1/2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
                  >
                    Order ✔
                  </button>
                </div>
              </>
            )}
              <button
                onClick={() => {
                  setShowModal(true);
                  setTimeout(() => {
                    setShowCart(false);
                    setShowModal(false);
                  }, 300); // Match animation duration
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm animate-zoomIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Enter Table Number
            </h2>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6"
            />
            <input
              type="text"
              value={wpno}
              onChange={e => {
                // Only allow digits, max 10
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setWpno(val);
              }}
              placeholder="WhatsApp Number (for Bill)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleTableNumberSubmit}
                className="w-1/2 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default RestaurantMenuPage;
