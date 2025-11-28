import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomFieldsDisplay from "../components/CustomFieldsDisplay";
import { Helmet } from "react-helmet";
import MenuCard from "../components/MenuCardWp";

const API_BASE_URL = ""; // Keep your existing URL config

function RestaurantMenuPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tableFromURL = searchParams.get("table");
  const [myOrders, setMyOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
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
  
  const [activeOffer, setActiveOffer] = useState(0);
  const carouselRef = useRef(null);
  const [offers, setOffers] = useState([]);

  // --- 1. Fetch Offers ---
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/${id}/offers`, { 
            headers: token ? { Authorization: `Bearer ${token}` } : {} 
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setOffers(data);
      } catch (err) {
        console.error("Failed to load offers", err);
      }
    };
    fetchOffers();
  }, [id]);

  // --- 2. Set Table Number ---
  useEffect(() => {
    if (tableFromURL) {
      setTableNumber(tableFromURL);
    }
  }, [tableFromURL]);

  // --- 3. Fetch Restaurant Details ---
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/${id}/details`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setRestaurantDetails(data);
      } catch {
        console.log("Failed to fetch details");
      }
    };
    fetchDetails();
  }, [id]);

  // --- 4. Fetch Menu ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/${id}/menu`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setMenuData(data);
        } else {
            console.error("Menu data is not an array");
        }
      } catch (e) {
        console.error("Failed to load menu", e);
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  // --- 5. Process Categories ---
  useEffect(() => {
    if(menuData.length > 0) {
        const categoryList = ["All", ...new Set(menuData.map((item) => item.category).filter(Boolean))];
        setCategories(categoryList);
    }
  }, [menuData]);

  // --- 6. Load Cart ---
  useEffect(() => {
    try {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        if (savedCart) setCart(savedCart);
    } catch(e) { console.error("Cart parse error", e); }
  }, []);

  // --- 7. Save Cart ---
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Filter Logic
  const filteredMenu = menuData.filter(item => {
    const isInStock = !(item.inStock === false || item.inStock === "false");
    const matchCategory = category === "All" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return isInStock && matchCategory && matchSearch;
  });

    const updateQty = (itemId, qty) => {
    if (qty <= 0) return removeFromCart(itemId);
    setCart(cart.map(c => (c._id === itemId ? { ...c, quantity: qty } : c)));
  };

  // 🆕 API CALL TO FETCH TABLE ORDERS
  const fetchOrdersForTable = async (tableNum) => {
    if (!tableNum || !id) return;
    setIsLoadingOrders(true);
    try {
      // 🔧 Ensure this matches your backend route
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/table/${id}/${tableNum}`);
      if (res.ok) {
        const data = await res.json();
        setMyOrders(data);
      }
    } catch (e) {
      console.error("Error fetching table orders", e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // 🆕 Load orders if Table Number exists in URL
  useEffect(() => {
    if (tableFromURL) {
      fetchOrdersForTable(tableFromURL);
    }
  }, [tableFromURL, id]);

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
    // 🆕 1. CHECK IF RESTAURANT IS LIVE
    // We check explicitly for false, so if it's undefined (old schema) it still works
    if (restaurantDetails?.isLive === false) {
      toast.error("🚫 Sorry, the restaurant is currently not accepting orders.");
      return;
    }

    if (!tableNumber) return toast.error("Please enter a valid table number.");
    
    if (wpno && !/^[6-9]\d{9}$/.test(wpno)) {
        return toast.error("Please enter a valid 10-digit WhatsApp number.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: id,
          tableNumber,
          wpno: wpno ? "91" + wpno : "",
          items: cart.map((item) => ({ itemId: item._id, quantity: item.quantity })),
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Order placed!");
        // 🆕 REFRESH ORDERS FROM API
        fetchOrdersForTable(tableNumber);
        setCart([]);
        setShowModal(false);
        setShowCart(false);
      } else {
        toast.error("❌ Order failed: " + (data.message || "Unknown error"));
      }
    } catch (e) {
      toast.error("⚠️ Server error");
      console.error(e);
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
        <meta property="og:title" content="Petoba - Digital QR Menu" />
        <meta property="og:type" content="website" />
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

      {/* Offer Carousel */}
      {offers.length > 0 && (
        <div className="bg-gray-100">
          <div
            ref={carouselRef}
            onScroll={() => {
              if(carouselRef.current) {
                  const container = carouselRef.current;
                  const slideWidth = container.clientWidth * 0.8 + 16; 
                  const idx = Math.round(container.scrollLeft / slideWidth);
                  setActiveOffer(idx);
              }
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

          {/* Pagination dots */}
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
        Cart {cart.length > 0 && <span>{cart.length}</span>}
      </button>

      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md animate-zoomIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty.</p>
            ) : (
              <>
                <div className="max-h-[60vh] overflow-y-auto">
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
                </div>
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

                  {/* 🆕 2. CONDITIONAL BUTTON RENDERING IN CART */}
                  {restaurantDetails?.isLive === false ? (
                      <div className="w-1/2 py-2 px-2 bg-red-100 text-red-600 rounded-xl font-bold text-center border border-red-200 text-sm flex items-center justify-center">
                         Ordering Closed
                      </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowCart(false);
                        // Check if BOTH Table Number AND WhatsApp Number are present
                        if (tableNumber && wpno) {
                            handleTableNumberSubmit();
                        } else {
                            // If either is missing, show the modal so user can enter them
                            setShowModal(true);
                        }
                      }}
                      className="w-1/2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
                    >
                      Order ✔
                    </button>
                  )}
                </div>
              </>
            )}
            <button
              onClick={() => {
                setShowModal(true);
                setTimeout(() => {
                  setShowCart(false);
                  setShowModal(false);
                }, 300);
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
            
            {/* 🆕 OPTIONAL: VISUAL WARNING IN MODAL */}
            {restaurantDetails?.isLive === false && (
                <div className="mb-4 bg-red-50 text-red-600 p-2 rounded text-center text-sm font-bold border border-red-100">
                    Restaurant is currently closed
                </div>
            )}

            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g., 5"
              // Disable editing if it came from the URL (optional)
              disabled={!!tableFromURL} 
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6 ${
                tableFromURL ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
              }`}
            />
            <input
              type="text"
              value={wpno}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setWpno(val);
              }}
              // 🆕 UPDATE PLACEHOLDER
              placeholder="WhatsApp Number (Required)*"
              className={`w-full px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 mb-4 ${
                  !wpno ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
              }`}
            />
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              
              {/* 🆕 3. DISABLE BUTTON IN MODAL */}
              <button
                onClick={handleTableNumberSubmit}
                disabled={restaurantDetails?.isLive === false}
                className={`w-1/2 py-3 rounded-xl font-semibold text-white transition ${
                    restaurantDetails?.isLive === false 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Show if we have orders OR if a table number is set */}
      {(myOrders.length > 0 || tableNumber) && (
        <button
          onClick={() => {
            if(tableNumber) fetchOrdersForTable(tableNumber); // Refresh on click
            setShowMyOrders(true);
          }}
          className="fixed bottom-5 left-5 bg-orange-500 text-white border-2 border-orange-500 px-4 py-3 rounded-full shadow-lg text-lg z-40 flex items-center gap-2 hover:bg-orange-600"
        >
          🧾 
        </button>
      )}

      {/* 🆕 "MY ORDERS" MODAL */}
      {showMyOrders && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-md h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-orange-600 p-4 flex justify-between items-center text-white shadow-md">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">Table {tableNumber || "?"}</h2>
                    <p className="text-xs text-orange-100 opacity-80">Order History</p>
                </div>
                <button onClick={() => setShowMyOrders(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">✕</button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {isLoadingOrders ? (
                     <div className="flex justify-center mt-10"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : myOrders.length === 0 ? (
                    <div className="text-center mt-10 text-gray-400">
                        <p className="text-4xl mb-2">🍽️</p>
                        <p>No orders found for Table {tableNumber} today.</p>
                    </div>
                ) : (
                    myOrders.map((order, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 relative overflow-hidden">
                            {/* Status Strip */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.status === 'completed' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                            
                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">
                                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    <h4 className="font-bold text-gray-800 text-sm">Order #{myOrders.length - index}</h4>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {order.status || 'Received'}
                                </span>
                            </div>
                            
                            <div className="space-y-2 pl-2 mb-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <div className="flex gap-2">
                                            <span className="font-bold text-gray-600">{item.quantity}x</span>
                                            <span className="text-gray-700">{item.itemId?.name || item.name || "Item"}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Footer Summary */}
            <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                
                <button 
                    onClick={() => {
                        fetchOrdersForTable(tableNumber); 
                    }}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition flex justify-center gap-2"
                >
                    Refresh Status ↻
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