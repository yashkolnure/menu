import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomFieldsDisplay from "../components/CustomFieldsDisplay";
import { Helmet } from "react-helmet";
import MenuCard from "../components/MenuCardWp";
import PetobaChatbot from "../components/PetobaChatbot";

function RestaurantMenuPageDemo() {
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
  const [offers, setOffers] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const carouselRef = useRef(null);


  // show/hide scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currencies = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
];

const selectedCurrency = currencies.find(
  (c) => c.code === restaurantDetails?.currency
);
const currencySymbol = selectedCurrency ? selectedCurrency.symbol : "₹"; 

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  // Hide only if explicitly false
  const isInStock = !(item.inStock === false || item.inStock === "false");

  const matchCategory = category === "All" || item.category === category;
  const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

  return isInStock && matchCategory && matchSearch;
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

const handleTableNumberSubmit = () => {
  if (!tableNumber) {
    toast.error("To place an order, please scan the QR code from the restaurant table.");
    
    setShowCart(false);
    setCart([]);
    return;
  }

  if (cart.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  // Proceed with order logic here (e.g., sending to backend or WhatsApp)

  // Clear the cart after processing the order
  setCart([]); // assuming you have `const [cart, setCart] = useState([])`
  toast.error("To place an order, please scan the QR code from the restaurant table.");
};
  // Place this check just before your return statement:
  if (restaurantDetails && restaurantDetails.active === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Restaurant Inactive</h2>
          <p className="text-gray-700 mb-2">
            This restaurant is Disabled Connect to Petoba Team to Reactivate your Menu.
          </p>
          <p className="text-gray-400 text-sm">Powered By Petoba Digital QR Menu</p>
        </div>
      </div>
    );
  }

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
      <header className="relative h-56 w-full mb-0 overflow-hidden bg-ghostwhite rounded-b-xl shadow-lg">
        <img
          src={
            restaurantDetails?.homeImage
              ? restaurantDetails.homeImage
              : "https://t3.ftcdn.net/jpg/02/97/67/70/360_F_297677001_zX7ZzRq8DObUV5IWTHAIhAae6DuiEQh4.jpg"
          }
          alt="Food Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-10 bg-black/40 w-full h-full flex flex-col items-center justify-center px-4 py-6 space-y-4">
          {restaurantDetails?.logo && (
            <img src={restaurantDetails.logo} alt="Logo" className="h-24 sm:h-24 object-contain" />
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
            className="pt-4 w-full max-w-xl mx-auto mb-3 overflow-x-auto scroll-smooth px-4 cursor-grab"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex space-x-4">
              {offers.map((o) => (
                <div
                  key={o._id}
                  className="flex-shrink-0 w-4/5 snap-start first:pl-4 last:pr-4"
                  onClick={() => setFullscreenImage(o.image)} // 👈 open full screen
                >
                  <img
                    loading="lazy"
                    src={o.image}
                    alt=""
                    className="w-full h-[150px] max-h-[150px] object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-2 pb-2 bg-gray-100">
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

      {/* ✅ Fullscreen Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)} // close on click
        >
          <img
            src={fullscreenImage}
            alt="Offer"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            &times;
          </button>
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
              <MenuCard 
                key={item._id} 
                item={item} 
                cartItem={cart.find(c => c._id === item._id)}
                addToCart={addToCart}
                increaseQty={(item) => updateQty(item._id, (cart.find(c => c._id === item._id)?.quantity || 0) + 1)}
                decreaseQty={(item) => updateQty(item._id, (cart.find(c => c._id === item._id)?.quantity || 0) - 1)}
                currency={restaurantDetails?.currency }
                enableOrdering={restaurantDetails?.enableOrdering  }
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mb-4">No items match your search.</p>
          )}
        </div>
        <div>
        
             <CustomFieldsDisplay restaurantId={id} />
        </div>
        
      
           <div className="flex flex-wrap justify-center">
          <p className="text-gray-500 text-center mt-4 mb-24">
            Made with ❤️ by{" "}
            <a
              href="https://petoba.in"
              className="text-orange-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Petoba
            </a>
          </p>
        </div>
      </div>


      {cart.length > 0 && (
        <div className="fixed bottom-5 right-5">
          <button
            onClick={() => setShowCart(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-all"
          >
             Cart ({cart.length})
          </button>
        </div>
      )}

      {/* Scroll to top button (left-bottom) */}
      {showScrollTop && (
        <button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="fixed bottom-5 left-5 z-50 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-transform transform hover:-translate-y-1"
  aria-label="Scroll to top"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
</button>

      )}

{/* --- MODERN BOTTOM SHEET CART --- */}
<div 
  className={`fixed inset-0 z-[99] transition-opacity duration-300 ${showCart ? "bg-black/60 opacity-100" : "pointer-events-none opacity-0"}`}
  onClick={() => setShowCart(false)}
>
  <div 
    className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white rounded-t-[2rem] shadow-2xl transition-transform duration-500 ease-out ${showCart ? "translate-y-0" : "translate-y-full"}`}
    style={{ maxHeight: '90vh' }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Handle bar for "Pull down" feel */}
    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4 mb-2" />

    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
      <h2 className="text-2xl font-extrabold text-gray-800">Your Order</h2>
      <button 
        onClick={() => setShowCart(false)}
        className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>

    {/* Cart Items List */}
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item._id} className="flex items-center justify-between group">
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-lg">{item.name}</p>
              <p className="text-orange-600 font-medium">{currencySymbol}{item.price}</p>
            </div>
            
            <div className="flex items-center bg-orange-50 rounded-xl p-1 border border-orange-100">
              <button
                onClick={() => updateQty(item._id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition-all"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-gray-700">{item.quantity}</span>
              <button
                onClick={() => updateQty(item._id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition-all"
              >
                +
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="py-10 text-center">
           <p className="text-gray-400">Your cart is feeling a bit light...</p>
        </div>
      )}
    </div>

    {/* Order Section */}
    <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-t-3xl">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-500 mb-2 ml-1">Dining Table Number</label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">#</span>
            <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ex: 05"
                className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all font-bold text-lg"
            />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 px-1">
        <span className="text-gray-500 font-medium">Grand Total</span>
        <span className="text-2xl font-black text-gray-900">
          {currencySymbol}{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </span>
      </div>

      {restaurantDetails?.enableOrdering === "disabled" ? (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center">
          <p className="font-bold">Ordering is currently closed</p>
          <p className="text-xs opacity-80">Please contact the waiter for assistance</p>
        </div>
      ) : (
        <button
          onClick={handleTableNumberSubmit}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <span>Confirm Order via WhatsApp</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  </div>
</div>


      <ToastContainer position="bottom-left"  toastClassName="" autoClose={1000} />
            {restaurantDetails && (
        <PetobaChatbot 
            menuData={menuData} 
            restaurantName={restaurantDetails.name}
            currencySymbol={currencySymbol}
            addToCart={addToCart}
        />
      )}
    </>
  );
}

export default RestaurantMenuPageDemo;