import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuCard from "../components/MenuCard";
import { Helmet } from "react-helmet";

function RestaurantMenuPageCloud() {
  const { id } = useParams();

  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [setIsCartClosing] = useState(false);
  const [activeOffer, setActiveOffer] = useState(0);
  const carouselRef = useRef(null);
  const [offers, setOffers] = useState([]);

  // ✅ Customer details for delivery
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fetch offers
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
      } catch (err) {
        console.error("Failed to load offers", err);
      }
    };
    fetchOffers();
  }, [id]);

  // ✅ Fetch restaurant details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/admin/${id}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setRestaurantDetails(data);
      } catch {
        toast.error("⚠️ Failed to fetch restaurant details");
      }
    };
    fetchDetails();
  }, [id]);

  // ✅ Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/admin/${id}/menu`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data)) setMenuData(data);
        else toast.error("Failed to load menu data.");
      } catch {
        toast.error("Failed to load menu");
      }
    };
    fetchMenu();
  }, [id]);

  // ✅ Categories
  useEffect(() => {
    const categoryList = ["All", ...new Set(menuData.map((item) => item.category))];
    setCategories(categoryList);
  }, [menuData]);

  // ✅ Cart persistence
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

  // ✅ Cart operations
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
    setCart(
      cart.map((item) =>
        item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // ✅ Place order (with delivery details)
const handlePlaceOrder = () => {
  if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
    return toast.error("Please fill all required fields.");
  }

  if (cart.length === 0) {
    return toast.error("Your cart is empty.");
  }

  // ✅ Owner WhatsApp Number (you should get this from restaurantDetails or set it manually)
  const ownerPhone = restaurantDetails?.contact; // Use full country code, e.g., 91XXXXXXXXXX

  // ✅ Order Summary
  const orderItems = cart
    .map((item) => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`)
    .join("\n");

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = `🛒 *New Order*\n\n👤 Name: ${customer.name}\n📞 Phone: ${customer.phone}\n🏠 Address: ${customer.address}, ${customer.landmark}, ${customer.pincode}\n\n🍽️ Order:\n${orderItems}\n\n💰 Total: ₹${totalAmount}\n\n✅ Please confirm my order.`;

  // ✅ Encode message for URL
  const whatsappURL = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;

  // ✅ Open WhatsApp
  window.open(whatsappURL, "_blank");

  // Reset after placing order
  setCart([]);
  setShowModal(false);
  setShowCart(false);
  setCustomer({ name: "", phone: "", address: "", landmark: "", pincode: "" });
  toast.success("Redirecting to WhatsApp...");
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

      {/* ✅ Offer Carousel */}
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

      {/* ✅ Menu */}
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
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <MenuCard key={item._id} item={item} addToCart={addToCart} />
            ))
          ) : (
            <p className="text-gray-500 text-center mb-4">No items match your search.</p>
          )}
        </div>
      </div>

      {/* ✅ Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-5 right-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg text-lg z-50 flex items-center gap-2"
      >
        View Cart ({cart.length > 0 && <span>{cart.length}</span>} )
      </button>

      {/* ✅ Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md animate-zoomIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between mb-3 border-b pb-2"
                  >
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p>₹ {item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className="px-2 bg-gray-300 rounded"
                          onClick={() => decreaseQty(item._id)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="px-2 bg-gray-300 rounded"
                          onClick={() => increaseQty(item._id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <h3 className="text-lg font-semibold mt-4">
                  Total: ₹
                  {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
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
                      setShowModal(true);
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
                setIsCartClosing(true);
                setTimeout(() => {
                  setShowCart(false);
                  setIsCartClosing(false);
                }, 300);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ✅ Customer Details Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm animate-zoomIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Delivery Details
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={customer.name}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />
            <textarea
              name="address"
              placeholder="Full Address"
              value={customer.address}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark (Optional)"
              value={customer.landmark}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={customer.pincode}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded-lg"
            />

            <div className="flex justify-between space-x-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="w-1/2 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default RestaurantMenuPageCloud;
