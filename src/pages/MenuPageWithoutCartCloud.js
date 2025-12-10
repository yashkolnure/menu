import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CustomFieldsDisplay from "../components/CustomFieldsDisplay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuCard from "../components/MenuCardWp";
import { Helmet } from "react-helmet";
import { MapPin, Navigation } from "lucide-react";

function RestaurantMenuPageCloud() {
  const { id } = useParams();
  const carouselRef = useRef(null);

  // --- STATE ---
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  
  // UI
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOffer, setActiveOffer] = useState(0);
  
  // Cart & Modals
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCartClosing, setIsCartClosing] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", landmark: "", pincode: "" });
  const [locationLoading, setLocationLoading] = useState(false);

  // Tracking
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackPhone, setTrackPhone] = useState("");
  const [trackedOrders, setTrackedOrders] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        
        // Fetch Details & Offers
        const [detailsRes, offersRes, menuRes] = await Promise.all([
          fetch(`/api/admin/${id}/details`, { headers }),
          fetch(`/api/admin/${id}/offers`, { headers }),
          fetch(`/api/admin/${id}/menu`, { headers })
        ]);

        const details = await detailsRes.json();
        setRestaurantDetails(details);

        if (offersRes.ok) setOffers(await offersRes.json());

        const menu = await menuRes.json();
        if (Array.isArray(menu)) {
          setMenuData(menu);
          // Sort Categories based on saved order
          const uniqueCats = [...new Set(menu.map(i => i.category?.trim()).filter(Boolean))];
          const order = details.categoryOrder || [];
          uniqueCats.sort((a, b) => {
             const idxA = order.indexOf(a);
             const idxB = order.indexOf(b);
             if (idxA !== -1 && idxB !== -1) return idxA - idxB;
             if (idxA !== -1) return -1;
             if (idxB !== -1) return 1;
             return a.localeCompare(b);
          });
          setCategories(["All", ...uniqueCats]);
        }
      } catch (e) {
        console.error(e);
        toast.error("Error loading menu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- 2. CART PERSISTENCE ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (saved) setCart(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // --- 3. LOCATION LOGIC ---
  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data?.display_name) {
            setCustomer(prev => ({ ...prev, address: data.display_name, pincode: data.address.postcode || prev.pincode }));
            toast.success("Address detected!");
          }
        } catch {
          toast.warn("Location found, but address lookup failed.");
          setCustomer(prev => ({ ...prev, address: `Lat: ${latitude}, Lon: ${longitude}` }));
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        toast.error("Permission denied or location unavailable");
      },
      { enableHighAccuracy: true }
    );
  };

  // --- 4. CART LOGIC ---
  const addToCart = (item) => {
    if (cart.find(c => c._id === item._id)) return toast.warn("Already in cart");
    setCart([...cart, { ...item, quantity: 1 }]);
    toast.success("Added!");
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- 5. ORDER LOGIC (WITH VALIDATION) ---
  const handlePlaceOrder = async () => {
    // A. Validation
    const name = customer.name.trim();
    const phone = customer.phone.trim();
    const address = customer.address.trim();

    if (!name) return toast.error("Please enter your Name");
    
    // Check if phone is digits only and at least 10 chars
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return toast.error("Please enter a valid 10-digit Phone Number");
    }

    if (!address || address.length < 5) {
      return toast.error("Please enter a complete Address");
    }

    if (cart.length === 0) return toast.error("Cart is empty");

    const totalAmount = calculateTotal();
    const mode = restaurantDetails?.orderMode || 'whatsapp'; 

    // B. WhatsApp Mode
    if (mode === 'whatsapp') {
      const itemsList = cart.map(i => `${i.name} x${i.quantity}`).join("\n");
      const msg = `🛵 *New Delivery Order*\n👤 ${name}\n📞 ${phone}\n🏠 ${address}\n\n🍽️ *Order:*\n${itemsList}\n\n💰 *Total: ₹${totalAmount}*`;
      
      const ownerPhone = restaurantDetails?.contact;
      window.open(`https://wa.me/${ownerPhone}?text=${encodeURIComponent(msg)}`, "_blank");
      
      setCart([]);
      setShowModal(false);
      setShowCart(false);
      setCustomer({ name: "", phone: "", address: "", landmark: "", pincode: "" });
      localStorage.removeItem("cart");
      toast.success("Redirecting to WhatsApp...");
    } 
    
    // C. Billing (API) Mode
    else if (mode === 'billing') {
      const payload = {
        restaurantId: id,
        customer: { ...customer, name, phone, address },
        items: cart.map(i => ({ itemId: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount,
        subTotal: totalAmount
      };

      try {
        const res = await fetch("/api/admin/delivery/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok) {
          toast.success(`Order Placed! ID: #${data.data._id.slice(-6).toUpperCase()}`);
          setCart([]);
          setShowModal(false);
          setShowCart(false);
          setCustomer({ name: "", phone: "", address: "", landmark: "", pincode: "" });
          localStorage.removeItem("cart");
        } else {
          toast.error(data.message || "Order failed");
        }
      } catch {
        toast.error("Network Error");
      }
    }
  };

  // --- 6. TRACKING LOGIC (WITH VALIDATION) ---
  const handleTrackOrder = async () => {
    const cleanPhone = trackPhone.replace(/\D/g, ''); 

    if (!cleanPhone || cleanPhone.length !== 10) {
      return toast.error("Please enter a valid 10-digit phone number");
    }

    setTrackLoading(true);
    setTrackedOrders([]);

    try {
      const res = await fetch(`/api/admin/delivery/track/${id}/${cleanPhone}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) setTrackedOrders(data.orders);
      else { setTrackedOrders([]); toast.info("No orders found"); }
    } catch { toast.error("Tracking failed"); } 
    finally { setTrackLoading(false); }
  };

// Filter Logic
  const filteredMenu = menuData
    .filter((item) => {
      // Hide only if explicitly false
      const isInStock = !(item.inStock === false || item.inStock === "false");

      // FIX: Trim the item category before comparing
      const matchCategory = category === "All" || (item.category && item.category.trim() === category);
      
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return isInStock && matchCategory && matchSearch;
    })
    .sort((a, b) => {
      // ✅ Sort items by Category Order so "All" view is organized
      const order = restaurantDetails?.categoryOrder || [];
      
      // Safety check: ensure categories exist before trimming
      const catA = a.category ? a.category.trim() : "";
      const catB = b.category ? b.category.trim() : "";

      const indexA = order.indexOf(catA);
      const indexB = order.indexOf(catB);

      // 1. Sort by Category Index
      if (indexA !== -1 && indexB !== -1 && indexA !== indexB) return indexA - indexB;
      if (indexA !== -1 && indexB === -1) return -1;
      if (indexA === -1 && indexB !== -1) return 1;

      return 0; 
    });


  if (restaurantDetails?.active === false) return <div className="h-screen flex items-center justify-center text-red-600 font-bold">Restaurant Unavailable</div>;

  return (
    <>
      <Helmet><title>Petoba | Menu</title></Helmet>

      {/* Header */}
      <header className="relative h-56 w-full mb-0 overflow-hidden rounded-b-xl shadow-lg">
        <img src="https://t3.ftcdn.net/jpg/02/97/67/70/360_F_297677001_zX7ZzRq8DObUV5IWTHAIhAae6DuiEQh4.jpg" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
        <div className="relative z-10 bg-black/40 h-full flex flex-col items-center justify-center px-4 py-6 gap-4">
          {restaurantDetails?.logo && <img src={restaurantDetails.logo} alt="Logo" className="h-20 object-contain" />}
          <input type="text" placeholder="Search dish..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow" />
        </div>
      </header>

      {/* Offers */}
      {offers.length > 0 && (
        <div className="bg-gray-100 pt-4">
          <div ref={carouselRef} onScroll={(e) => setActiveOffer(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth * 0.8 + 16)))} className="w-full max-w-xl mx-auto overflow-x-auto scroll-smooth px-4 flex gap-4 snap-x">
            {offers.map(o => <img key={o._id} src={o.image} className="w-4/5 flex-shrink-0 snap-start h-[150px] object-cover rounded-lg" alt="offer" />)}
          </div>
          <div className="flex justify-center gap-2 py-4">
            {offers.map((_, i) => <span key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeOffer ? "bg-orange-600" : "bg-gray-300"}`} />)}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 p-3 pb-24">
        {/* Categories */}
        <div className="overflow-x-auto mb-4 hide-scrollbar">
          <div className="flex gap-2 w-max px-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl whitespace-nowrap border ${category === cat ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-200"}`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex flex-wrap justify-center gap-0">
          {loading ? <div className="py-20 text-gray-500">Loading...</div> : 
           filteredMenu.length > 0 ? filteredMenu.map(item => (
             <MenuCard key={item._id} item={item} cartItem={cart.find(c => c._id === item._id)} addToCart={addToCart} increaseQty={() => updateQty(item._id, 1)} decreaseQty={() => updateQty(item._id, -1)} currency={restaurantDetails?.currency} enableOrdering={restaurantDetails?.enableOrdering} />
           )) : <p className="text-gray-500">No items found.</p>
          }
        </div>
        
        <div className="mt-8"><CustomFieldsDisplay restaurantId={id} /></div>
      </div>

      {/* Floating Buttons */}
      {/* Show Track button ONLY if orderMode is Billing */}
      {restaurantDetails?.orderMode === 'billing' && (
        <button onClick={() => setShowTrackModal(true)} className="fixed bottom-5 left-5 bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg font-bold border flex items-center gap-2 z-40"><span>📍</span> Track</button>
      )}
      
      <button onClick={() => setShowCart(true)} className="fixed bottom-5 right-5 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 z-40">
        View Cart {cart.length > 0 && `(${cart.length})`}
      </button>

      {/* --- MODALS --- */}

      {/* 1. Track Order Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">My Orders</h2><button onClick={() => setShowTrackModal(false)} className="text-gray-400 text-xl">✕</button></div>
            <div className="flex gap-2 mb-4">
              <input type="tel" placeholder="Phone Number" value={trackPhone} onChange={e => setTrackPhone(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"/>
              <button onClick={handleTrackOrder} disabled={trackLoading} className="bg-orange-500 text-white px-4 rounded-xl font-bold disabled:opacity-50">{trackLoading ? "..." : "Find"}</button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3 custom-scrollbar">
              {trackedOrders.length === 0 ? <p className="text-center text-gray-400 text-sm">Enter number to see history</p> : 
                trackedOrders.map(order => (
                  <div key={order._id} className="border p-3 rounded-xl bg-gray-50">
                    <div className="flex justify-between mb-1"><span className="font-bold text-xs bg-white border px-2 py-1 rounded">{order.status}</span><span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                    <div className="text-sm text-gray-600 mb-2 space-y-1">
                      {order.items.map((i, idx) => <div key={idx} className="flex justify-between"><span>{i.name}</span><span>x{i.quantity}</span></div>)}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-sm"><span>Total</span><span>₹{order.totalAmount}</span></div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* 2. Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto relative animate-zoomIn">
            <button onClick={() => { setIsCartClosing(true); setTimeout(() => { setShowCart(false); setIsCartClosing(false); }, 300); }} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            
            {cart.length === 0 ? <p className="text-gray-500">Cart is empty</p> : (
              <>
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between items-center mb-4 border-b pb-2">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <button className="bg-gray-200 px-2 rounded" onClick={() => updateQty(item._id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button className="bg-gray-200 px-2 rounded" onClick={() => updateQty(item._id, 1)}>+</button>
                      </div>
                    </div>
                    <button className="text-red-500 text-sm" onClick={() => setCart(cart.filter(i => i._id !== item._id))}>Remove</button>
                  </div>
                ))}
                <h3 className="text-lg font-bold text-right mt-4">Total: ₹{calculateTotal()}</h3>
                <div className="flex gap-3 mt-6"><button onClick={() => setCart([])} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold text-gray-700">Clear</button><button onClick={() => { setShowCart(false); setShowModal(true); }} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold">Checkout</button></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-zoomIn">
            <h2 className="text-xl font-bold text-center mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <input name="name" placeholder="Your Name" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg"/>
              <input name="phone" type="tel" placeholder="Phone Number" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg"/>
              
              {/* Location Box */}
              <div className="relative">
                <textarea name="address" placeholder="Full Address" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg min-h-[80px]"/>
                <button onClick={detectLocation} disabled={locationLoading} className="absolute bottom-2 right-2 bg-blue-100 text-blue-600 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-200 transition">
                  {locationLoading ? "..." : <><Navigation size={12} /> Detect</>}
                </button>
              </div>

              <input name="landmark" placeholder="Landmark (Optional)" value={customer.landmark} onChange={(e) => setCustomer({...customer, landmark: e.target.value})} className="w-full px-3 py-2 border rounded-lg"/>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold">Cancel</button>
              <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">
                {restaurantDetails?.orderMode === 'billing' ? "Place Order" : "Send on WhatsApp"}
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