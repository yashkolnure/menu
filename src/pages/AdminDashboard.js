import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import NotificationSetup from "./NotificationSetup";
import notificationSound from '../components/notification.mp3'; 
import { 
  LayoutDashboard, Receipt, History, Gift, Bell, Search, Printer, Trash2, CheckCircle, 
  Menu, X, ChefHat, Users, Clock, Volume2, VolumeX, TrendingUp, Percent, MessageCircle, 
  AlertTriangle, Tag, Eye, Coins, CreditCard, Smartphone, Banknote, Grid, Plus, Minus, Bike,
  MapPin, Phone, XCircle, HelpCircle // Added HelpCircle for Tour Button
} from "lucide-react";
import DeliveryDashboard from "./DeliveryDashboard";

// 1. IMPORT DRIVER.JS
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// 🔗 CONFIGURATION
const SOCKET_URL = "https://yash.avenirya.com"; 

// --- CUSTOM TOUR STYLES ---
const tourStyles = `
  .driver-popover.driverjs-theme {
    background-color: #ffffff;
    color: #1f2937;
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 20px;
    max-width: 320px;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    border: 1px solid #e0e7ff;
  }
  .driver-popover.driverjs-theme .driver-popover-title {
    font-size: 18px;
    font-weight: 800;
    color: #ea580c; /* Orange-600 */
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .driver-popover.driverjs-theme .driver-popover-description {
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
    margin-bottom: 20px;
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-btn {
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    text-shadow: none;
    transition: all 0.2s ease;
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-next-btn {
    background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); /* Orange Gradient */
    color: white !important;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3);
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-next-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(234, 88, 12, 0.4);
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-prev-btn,
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-close-btn {
    background: #f3f4f6;
    color: #6b7280 !important;
    border: 1px solid #e5e7eb;
  }
  .driver-popover.driverjs-theme .driver-popover-progress-text {
    color: #9ca3af;
    font-size: 11px;
    font-weight: 500;
  }
  .driver-popover { z-index: 1000000000 !important; }
  .driver-overlay { z-index: 999999999 !important; opacity: 0.8 !important; }
`;

function AdminDashboard() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("tables");
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]); 
  const [menuCategories, setMenuCategories] = useState([]);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);
  
  // 🆕 DYNAMIC TABLE COUNT
  const [totalTables, setTotalTables] = useState(() => Number(localStorage.getItem("totalTables")) || 12);

  // --- QUEUES & POPUPS ---
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const [newOrderQueue, setNewOrderQueue] = useState([]);
  
  const [newDeliveryPopup, setNewDeliveryPopup] = useState(null);
  const [newDeliveryQueue, setNewDeliveryQueue] = useState([]);

  const navigate = useNavigate();
  
  // Modals
  const [selectedOrderView, setSelectedOrderView] = useState(null);
  const [selectedHistoryView, setSelectedHistoryView] = useState(null);
  const [settleTableData, setSettleTableData] = useState(null); 
  
  // Add Dish Modal State
  const [addDishModal, setAddDishModal] = useState({ isOpen: false, tableNumber: null });
  const [adminCart, setAdminCart] = useState({}); 
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isLive, setIsLive] = useState(true);
  const [isTogglingLive, setIsTogglingLive] = useState(false);

  // 🆕 Refs for tracking processed IDs
  const processedOrderIds = useRef(new Set()); 
  const processedDeliveryIds = useRef(new Set()); 

    // --- ICONS ---
  const Icons = {
    Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  };
  
  // Data
  const [billingData, setBillingData] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({ name: "", logo: "", address: "", contact: "", billing: "", orderMode: "" });
  const [orderHistory, setOrderHistory] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
    // WhatsApp Support Link
  const SUPPORT_WA = "https://wa.me/919270361329";
  
  // 1. Check if Billing is Active (Highest Priority)
  const showBillingBlocker = restaurantDetails.billing === false;
  
  const handleGoToSettings = () => {
    navigate("/dashboard"); // Navigates to the settings page
  };
  // 2. Check Order Mode (Only show if Billing is active, but mode is wrong)
  const showOrderModeWarning = !showBillingBlocker && restaurantDetails.orderMode === 'whatsapp';
  
  const isRestrictedMode = showBillingBlocker || showOrderModeWarning;

  // --- TOUR LOGIC START ---
  const tourInitialized = useRef(false);
  const restaurantId = localStorage.getItem("restaurantId");

  const startTour = () => {
    const isMobile = window.innerWidth < 1024;
    
    // Open sidebar on mobile so elements are visible
    if (isMobile) {
        setIsSidebarOpen(true);
    }

    // 1. Define the unique key
    const tourKey = `tour_seen_admin_${restaurantId}`;

    setTimeout(() => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            doneBtnText: 'Finish Setup',
            closeBtnText: 'Skip',
            nextBtnText: 'Next →',
            prevBtnText: '← Back',
            popoverClass: 'driverjs-theme',
            stagePadding: 5,
            
            steps: [
                { 
                    element: 'body', 
                    popover: { 
                        title: '🚀 Admin Control Center', 
                        description: 'Welcome to your command center! Here you can manage live orders, billing, and deliveries.', 
                        side: "left", 
                        align: 'center' 
                    } 
                },
                { 
                    element: '#live-toggle', 
                    popover: { 
                        title: '🟢 Store Status', 
                        description: '<b>Toggle this switch</b> to open or close your restaurant. When off, customers cannot place orders.', 
                        side: "bottom", 
                        align: 'center' 
                    } 
                },
                { 
                    element: '#sound-toggle', 
                    popover: { 
                        title: '🔊 Sound Alerts', 
                        description: 'Click here to <b>enable sound</b>. You will hear a distinct bell for table orders vs delivery orders.', 
                        side: "bottom", 
                        align: 'center' 
                    } 
                },
                { 
                    element: '#sidebar-tables', 
                    popover: { 
                        title: '🪑 My Tables', 
                        description: 'Manage your floor plan. You can add items to tables manually here (Admin POS).', 
                        side: isMobile ? "bottom" : "right", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#sidebar-orders', 
                    popover: { 
                        title: '🔥 Live Dashboard', 
                        description: 'View active orders, kitchen status, and today\'s revenue stats in real-time.', 
                        side: isMobile ? "bottom" : "right", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#sidebar-billing', 
                    popover: { 
                        title: '🧾 Billing & Checkout', 
                        description: 'Settle bills here. Supports Cash, UPI, and Split payments. Print receipts instantly.', 
                        side: isMobile ? "bottom" : "right", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#sidebar-delivery', 
                    popover: { 
                        title: '🛵 Delivery Orders', 
                        description: 'Manage orders coming from your website/app for home delivery.', 
                        side: isMobile ? "bottom" : "right", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#notification-bell', 
                    popover: { 
                        title: '🔔 Notification Center', 
                        description: 'Missed a popup? Click here to see pending orders in the queue.', 
                        side: "left", 
                        align: 'start' 
                    } 
                },
            ],
            
            onDestroy: () => {
                if (isMobile) setIsSidebarOpen(false);
            }
        });

        // Save seen flag immediately
        console.log("🔒 Saving Admin tour completion flag to:", tourKey);
        localStorage.setItem(tourKey, 'true');

        driverObj.drive();

    }, isMobile ? 500 : 100); 
  };

  // Auto-Start Effect
  useEffect(() => {
    if (!restaurantId) return;
    const tourKey = `tour_seen_admin_${restaurantId}`;
    const hasSeenTour = localStorage.getItem(tourKey);

    if (!hasSeenTour && !tourInitialized.current) {
        tourInitialized.current = true;
        const timer = setTimeout(() => {
            if(document.getElementById('sidebar-tables')) {
                console.log("✅ Starting Admin Tour...");
                startTour();
            }
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [restaurantId]);
  // --- TOUR LOGIC END ---

 const BlockingModal = ({ title, message, buttonText, onAction, isExternal, type = "danger", onClose }) => (
    <div className="fixed inset-0 z-[200] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 relative">
        
        {/* 🆕 CLOSE BUTTON (X) */}
        {onClose && (
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 p-2 bg-white/50 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-10"
                title="Close to view dashboard"
            >
                <X size={20} />
            </button>
        )}

        {/* Header */}
        <div className={`px-6 py-6 text-center ${type === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {type === 'danger' ? <AlertTriangle size={32} /> : <Icons.Settings size={32} />}
          </div>
          <h2 className={`text-2xl font-extrabold ${type === 'danger' ? 'text-red-600' : 'text-blue-900'}`}>
            {title}
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-gray-600 font-medium text-lg mb-8 leading-relaxed">
            {message}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isExternal ? (
              <a 
                href={onAction} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition transform hover:-translate-y-1 shadow-lg"
              >
                <MessageCircle size={24} />
                {buttonText}
              </a>
            ) : (
              <button 
                onClick={onAction}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition transform hover:-translate-y-1 shadow-lg"
              >
                <Icons.Settings />
                {buttonText}
              </button>
            )}
            
            <button 
              onClick={handleLogout} 
              className="w-full py-3 text-gray-400 hover:text-gray-600 font-semibold text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // UI
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isAccepting, setIsAccepting] = useState(false);
  
  // Sound
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("soundEnabled") === "true");
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);

  // Financials
  const [taxRate, setTaxRate] = useState(() => Number(localStorage.getItem("taxRate")) || 0);
  const [discountRate, setDiscountRate] = useState(() => Number(localStorage.getItem("discountRate")) || 0);
  const [additionalCharges, setAdditionalCharges] = useState(() => Number(localStorage.getItem("additionalCharges")) || 0);

  // Form
  const [newOffer, setNewOffer] = useState({ image: "", imagePreview: "" });

  // Refs
  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  // --- 🧠 STATS ---
  const activeOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const occupiedTablesCount = new Set(orders.map(o => o.tableNumber)).size;
  const todaysRevenue = orderHistory
    .filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.finalTotal || o.totalAmount || 0), 0);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        navigate("/login");
    }
  };  
  const handlemyorders = () => { navigate("/dashboard"); };

  // --- 🆕 TABLE MANAGEMENT ---
  const updateTableCount = (newCount) => {
      if(newCount < 1) return;
      setTotalTables(newCount);
      localStorage.setItem("totalTables", newCount);
  };

  // --- 🆕 SEATED TIMER ---
  const getSeatedTime = (tableOrders) => {
      if(!tableOrders || tableOrders.length === 0) return null;
      
      // Find the timestamp of the very first order for this table
      const startTimes = tableOrders.map(o => new Date(o.createdAt).getTime());
      const firstOrderTime = Math.min(...startTimes);
      
      const diffMs = Date.now() - firstOrderTime;
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;

      if (hours > 0) return `${hours}h ${remainingMins}m`;
      return `${minutes} mins`;
  };

  // --- 🔊 SOUND LOGIC ---
  const unlockAudio = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.load(); 
      await audioRef.current.play(); 
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
      setSoundEnabled(true);
      localStorage.setItem("soundEnabled", "true");
      setIsAudioBlocked(false);
    } catch (error) { setIsAudioBlocked(true); }
  };


  const playBell = async () => {
    if (!soundEnabled || !audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsAudioBlocked(false); 
    } catch (error) { setIsAudioBlocked(true); }
  };

  // --- 1. INITIAL DATA ---
  useEffect(() => {
    fetchRestaurantDetails();
    fetchOrderHistory();
    fetchOrders(true); 
    fetchMenu(); 

    if(window.innerWidth >= 1024) setIsSidebarOpen(true);

    const interval = setInterval(() => { fetchOrders(false); }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. FETCH DATA ---
  const fetchMenu = async () => {
    try {
        const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/menu`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if(Array.isArray(data)) {
            setMenu(data);
            setMenuCategories(["All", ...new Set(data.map(i => i.category))]);
        }
    } catch(e) { console.error("Menu fetch failed", e); }
  };

  // ✅ UPDATED FETCH ORDERS (Handles both Tables & Delivery)
  const fetchOrders = async (isFirstLoad) => {
    try {
      // 1. Fetch Table Orders
      const resTable = await fetch(`https://petoba.in/api/admin/${restaurantId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tableData = await resTable.json();
      
      // 2. Fetch Delivery Orders
      const resDelivery = await fetch(`https://petoba.in/api/admin/delivery/all/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deliveryData = await resDelivery.json();

      // --- Process Table Orders ---
      if (Array.isArray(tableData)) {
          const sortedData = tableData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          // ✅ FIX: Filter out Cancelled AND Completed/Paid orders
          const activeOrders = sortedData.filter(o => 
              o.status !== 'cancelled' && 
              o.status !== 'completed' && 
              o.status !== 'paid'
          );
          
          setOrders(activeOrders);
          updateBillingFromOrders(activeOrders); // Update the table view

          // Check for new pending orders
          const pendingOrders = activeOrders.filter(o => o.status === 'pending');
          let hasNewOrder = false;
          pendingOrders.forEach(order => {
            if (!processedOrderIds.current.has(order._id)) {
              processedOrderIds.current.add(order._id);
              setNewOrderQueue(prev => [...prev, order]);
              hasNewOrder = true;
            }
          });

          if (hasNewOrder) playBell(); 
      }

      // --- Process Delivery Orders ---
      if (Array.isArray(deliveryData)) {
          const pendingDeliveries = deliveryData.filter(o => o.status === 'Pending');
          let hasNewDelivery = false;
          
          pendingDeliveries.forEach(order => {
             if(!processedDeliveryIds.current.has(order._id)) {
                 processedDeliveryIds.current.add(order._id);
                 setNewDeliveryQueue(prev => [...prev, order]);
                 hasNewDelivery = true;
             }
          });

          if (hasNewDelivery) playBell(); 
      }

      // --- Manage Queues ---
      setNewOrderQueue(prev => {
        if (prev.length > 0 && !newOrderPopup && !newDeliveryPopup) { 
           setNewOrderPopup(prev[0]);
           return prev.slice(1);
        }
        return prev;
      });

      setNewDeliveryQueue(prev => {
          if (prev.length > 0 && !newDeliveryPopup && !newOrderPopup) {
              setNewDeliveryPopup(prev[0]);
              return prev.slice(1);
          }
          return prev;
      });

    } catch (err) { console.error(err); }
  };

  const fetchRestaurantDetails = async () => {
    try {
      const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/details`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      setRestaurantDetails(data);
      // Set the live status from DB (default to true if undefined)
      if (data.isLive !== undefined) setIsLive(data.isLive); 
    } catch (error) { console.error(error); }
  };

  // 🆕 TOGGLE FUNCTION
  const toggleLiveStatus = async () => {
    const newStatus = !isLive;
    setIsLive(newStatus); // Optimistic UI update (feels faster)
    setIsTogglingLive(true);
    
    try {
      const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isLive: newStatus })
      });
      
      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error(error);
      setIsLive(!newStatus); // Revert if API fails
      alert("Failed to update store status");
    } finally {
      setIsTogglingLive(false);
    }
  };

  // --- 3. ADMIN ADD DISH LOGIC (POS) ---
const openAddDishModal = (tableNum) => {
      // 🛑 BLOCK IF RESTRICTED
      if (isRestrictedMode) {
          alert(showBillingBlocker ? "Plan Expired: Cannot place orders." : "Wrong Mode: Switch to Billing App to place orders.");
          return;
      }

      setAdminCart({});
      setAddDishModal({ isOpen: true, tableNumber: tableNum });
  };

  const updateAdminCart = (itemId, qty) => {
      setAdminCart(prev => {
          const newQty = (prev[itemId] || 0) + qty;
          if(newQty <= 0) {
              const { [itemId]: deleted, ...rest } = prev;
              return rest;
          }
          return { ...prev, [itemId]: newQty };
      });
  };

  const submitAdminOrder = async () => {
      if(Object.keys(adminCart).length === 0) return;
      
      const itemsPayload = Object.entries(adminCart).map(([itemId, quantity]) => ({ itemId, quantity }));
      const totalAmount = itemsPayload.reduce((sum, cartItem) => {
          const menuItem = menu.find(m => m._id === cartItem.itemId);
          return sum + (menuItem?.price || 0) * cartItem.quantity;
      }, 0);

      try {
          const res = await fetch("https://petoba.in/api/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  restaurantId,
                  tableNumber: addDishModal.tableNumber,
                  items: itemsPayload,
                  total: totalAmount,
                  customerName: "Admin/Waiter" 
              })
          });

          if(res.ok) {
              setAddDishModal({ isOpen: false, tableNumber: null });
              fetchOrders(false); // Refresh
              alert("✅ Items added successfully!");
          } else {
              alert("Failed to add items");
          }
      } catch(e) { alert("Error submitting order"); }
  };

  const filteredMenu = menu.filter(item => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
      return matchCat && matchSearch;
  });

  // --- 4. ACTIONS ---
  
  // Table Order Action: ACCEPT
  const handleAcceptOrder = async () => {
    if (!newOrderPopup) return;
    setIsAccepting(true);
    try {
      await fetch(`https://petoba.in/api/admin/${restaurantId}/orders/${newOrderPopup._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "ok" }),
      });
      setOrders(prev => prev.map(o => o._id === newOrderPopup._id ? { ...o, status: "ok" } : o));
      // Close popup & show next if available
      setNewOrderPopup(null);
      
      // Give delay for UI then check delivery queue or table queue
      setTimeout(() => {
          if (newOrderQueue.length > 0) {
             setNewOrderPopup(newOrderQueue[0]);
             setNewOrderQueue(prev => prev.slice(1));
          } else if (newDeliveryQueue.length > 0) {
             setNewDeliveryPopup(newDeliveryQueue[0]);
             setNewDeliveryQueue(prev => prev.slice(1));
          }
      }, 300);

    } catch (error) { alert("Failed to accept."); } 
    finally { setIsAccepting(false); }
  };

// ✅ CHANGE 2: Updated Reject Logic
  const handleRejectOrder = async () => {
    if (!newOrderPopup) return;
    if (!window.confirm("Are you sure you want to REJECT this table order?")) return;

    setIsAccepting(true);
    try {
        await fetch(`https://petoba.in/api/admin/${restaurantId}/orders/${newOrderPopup._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: "cancelled" }), 
        });
        
        // ✅ KEY FIX: Remove the order from state instead of just changing status
        const updatedOrders = orders.filter(o => o._id !== newOrderPopup._id);
        setOrders(updatedOrders);
        
        // ✅ KEY FIX: Immediately recalculate table status so it shows as empty
        updateBillingFromOrders(updatedOrders); 

        setNewOrderPopup(null);
        setTimeout(() => {
            if (newOrderQueue.length > 0) {
                setNewOrderPopup(newOrderQueue[0]);
                setNewOrderQueue(prev => prev.slice(1));
            } else if (newDeliveryQueue.length > 0) {
                setNewDeliveryPopup(newDeliveryQueue[0]);
                setNewDeliveryQueue(prev => prev.slice(1));
            }
        }, 300);
    } catch (error) { alert("Failed to reject."); }
    finally { setIsAccepting(false); }
  };

  // Delivery Order Action: ACCEPT
  const handleAcceptDelivery = async () => {
      if(!newDeliveryPopup) return;
      setIsAccepting(true);
      try {
          await fetch(`https://petoba.in/api/admin/delivery/status/${newDeliveryPopup._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Confirmed" }),
          });
          
          setNewDeliveryPopup(null);

          setTimeout(() => {
            if (newOrderQueue.length > 0) {
                setNewOrderPopup(newOrderQueue[0]);
                setNewOrderQueue(prev => prev.slice(1));
            } else if (newDeliveryQueue.length > 0) {
                setNewDeliveryPopup(newDeliveryQueue[0]);
                setNewDeliveryQueue(prev => prev.slice(1));
            }
          }, 300);

      } catch (e) { alert("Failed to accept delivery"); }
      finally { setIsAccepting(false); }
  };

  // ✅ Delivery Order Action: REJECT
  const handleRejectDelivery = async () => {
      if(!newDeliveryPopup) return;
      if (!window.confirm("Are you sure you want to REJECT this delivery order?")) return;

      setIsAccepting(true);
      try {
          await fetch(`https://petoba.in/api/admin/delivery/status/${newDeliveryPopup._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Cancelled" }),
          });
          
          setNewDeliveryPopup(null);

          setTimeout(() => {
            if (newOrderQueue.length > 0) {
                setNewOrderPopup(newOrderQueue[0]);
                setNewOrderQueue(prev => prev.slice(1));
            } else if (newDeliveryQueue.length > 0) {
                setNewDeliveryPopup(newDeliveryQueue[0]);
                setNewDeliveryQueue(prev => prev.slice(1));
            }
          }, 300);

      } catch (e) { alert("Failed to reject delivery"); }
      finally { setIsAccepting(false); }
  };

  const closePopup = () => {
    // If closing Table Popup
    if (newOrderPopup) {
        setNewOrderPopup(null);
        if (newOrderQueue.length > 0) {
            setNewOrderPopup(newOrderQueue[0]);
            setNewOrderQueue(prev => prev.slice(1));
        } else if (newDeliveryQueue.length > 0) {
            setNewDeliveryPopup(newDeliveryQueue[0]);
            setNewDeliveryQueue(prev => prev.slice(1));
        }
    }
    // If closing Delivery Popup
    else if (newDeliveryPopup) {
        setNewDeliveryPopup(null);
        if (newDeliveryQueue.length > 0) {
            setNewDeliveryPopup(newDeliveryQueue[0]);
            setNewDeliveryQueue(prev => prev.slice(1));
        } else if (newOrderQueue.length > 0) {
            setNewOrderPopup(newOrderQueue[0]);
            setNewOrderQueue(prev => prev.slice(1));
        }
    }
  };

  const handleInitiateClear = (tableData) => setSettleTableData(tableData);

const handleConfirmClear = async (method) => {
    if (!settleTableData) return;
    const safeTableParam = encodeURIComponent(settleTableData.tableNumber);

    try {
      const res = await fetch(`https://petoba.in/api/clearTable/${safeTableParam}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ taxRate, discountRate, additionalCharges, paymentMethod: method })
      });

      if (res.ok) {
        // ✅ FIX: Filter orders locally and immediately update the grid
        const remainingOrders = orders.filter(o => String(o.tableNumber) !== String(settleTableData.tableNumber));
        
        setOrders(remainingOrders);
        updateBillingFromOrders(remainingOrders); // This clears the table in the UI
        
        setSettleTableData(null); 
        fetchOrderHistory(); 
      } else {
        if (res.status === 404) {
            alert("Table already cleared or not found.");
            // Force clear local state anyway just in case
            const remainingOrders = orders.filter(o => String(o.tableNumber) !== String(settleTableData.tableNumber));
            setOrders(remainingOrders);
            updateBillingFromOrders(remainingOrders);
            setSettleTableData(null); 
        } else {
            alert("Server Error: " + res.status);
        }
      }
    } catch (error) { 
        console.error(error);
        alert("Network error."); 
    }
  };
    
const getAggregatedTableItems = (tableOrders) => {
    // ✅ Add this safety check
    if (!tableOrders || !Array.isArray(tableOrders)) return [];

    const itemMap = {};
    tableOrders.forEach(order => {
      const items = order.items || order.orderItems || []; 
      items.forEach(item => {
        const id = item.itemId?._id || item._id || item.name; 
        const name = item.itemId?.name || item.name || "Item";
        const price = item.price || 0;
        if (!itemMap[id]) itemMap[id] = { name, price, quantity: 0, total: 0 };
        itemMap[id].quantity += item.quantity;
        itemMap[id].total += (price * item.quantity);
      });
    });
    return Object.values(itemMap);
  };

  const calculateTotals = (subTotal) => {
      const tax = (subTotal * taxRate) / 100;
      const discount = (subTotal * discountRate) / 100;
      const total = subTotal + tax + additionalCharges - discount;
      return { tax, discount, total };
  };

  // --- 6. PRINT ---
  const sendWhatsAppBill = (tableData) => {
    const { tableNumber, orders, subTotal } = tableData;
    const customerPhone = orders[0]?.wpno || ""; 
    const { tax, discount, total } = calculateTotals(subTotal);
    const aggregatedItems = getAggregatedTableItems(orders);
    let message = `*${restaurantDetails.name || 'Restaurant Bill'}*\nTable: ${tableNumber}\nDate: ${new Date().toLocaleString()}\n\n*Items:*\n`;
    aggregatedItems.forEach(item => { message += `• ${item.name} x${item.quantity} = ₹${item.total.toFixed(2)}\n`; });
    message += `\nSubtotal: ₹${subTotal.toFixed(2)}\n`;
    if(taxRate > 0) message += `Tax (${taxRate}%): +₹${tax.toFixed(2)}\n`;
    if(additionalCharges > 0) message += `Charges: +₹${additionalCharges.toFixed(2)}\n`;
    if(discountRate > 0) message += `Discount (${discountRate}%): -₹${discount.toFixed(2)}\n`;
    message += `*TOTAL: ₹${total.toFixed(2)}*\n\nThank you!`;
    window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const printBill = (tableNumber, ordersInput, subTotalOverride = null) => {
    let subTotal = subTotalOverride;
    let ordersToPrint = ordersInput;

    // 1. If printing from the Active Billing Card (ordersInput is undefined)
    if (subTotal === null || !ordersToPrint) {
      const data = billingData.find((d) => d.tableNumber === tableNumber);
      if (!data) {
        alert("No active billing data found for Table " + tableNumber);
        return;
      }
      subTotal = data.subTotal;
      ordersToPrint = data.orders; // ✅ FIX: Get orders from state
    }

    // 2. Safety Check: If still no items, stop
    if (!ordersToPrint || !Array.isArray(ordersToPrint)) {
      alert("No items found to print!");
      return;
    }

    const { tax, discount, total } = calculateTotals(subTotal);
    
    // ✅ PASS THE CORRECT ORDERS ARRAY
    const aggregatedItems = getAggregatedTableItems(ordersToPrint);

    // CSS for 3-inch (80mm) Thermal Printer
    const styles = `
      <style>
        @page { size: auto;  margin: 0mm; }
        body { font-family: 'Courier New', monospace; margin: 5px; padding: 0; width: 76mm; }
        h3 { margin: 5px 0; text-align: center; font-size: 18px; }
        p { margin: 2px 0; font-size: 14px; }
        .text-center { text-align: center; }
        .border-bottom { border-bottom: 1px dashed #000; margin: 5px 0; }
        table { width: 100%; font-size: 14px; border-collapse: collapse; }
        th { text-align: left; border-bottom: 1px solid #000; }
        td { padding: 2px 0; font-weight: bold; }
        .total-section { text-align: right; margin-top: 5px; }
        .grand-total { font-size: 16px; font-weight: bold; margin-top: 5px; }
      </style>
    `;

    const html = `
      <html>
        <head>${styles}</head>
        <body>
          <div class="text-center">
            ${restaurantDetails.logo ? `<img src="${restaurantDetails.logo}" style="width:70px;"/>` : ''}
            <h3>${restaurantDetails.name || 'Restaurant'}</h3>
            <p>${restaurantDetails.address || ''}</p>
            <p>${restaurantDetails.contact || ''}</p>
          </div>
          
          <div class="border-bottom"></div>
          <p>Table: <strong>${tableNumber}</strong></p>
          <p>Date: ${new Date().toLocaleString()}</p>
          <div class="border-bottom"></div>

          <table>
            <tr><th style="width:50%">Item</th><th style="width:15%">Qty</th><th style="text-align:right">Amt</th></tr>
            ${aggregatedItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>

          <div class="border-bottom"></div>

          <div class="total-section">
            <p>Subtotal: ₹${subTotal.toFixed(2)}</p>
            ${taxRate > 0 ? `<p>Tax (${taxRate}%): +₹${tax.toFixed(2)}</p>` : ''}
            ${additionalCharges > 0 ? `<p>Charges: +₹${additionalCharges.toFixed(2)}</p>` : ''}
            ${discountRate > 0 ? `<p>Discount (${discountRate}%): -₹${discount.toFixed(2)}</p>` : ''}
            <p class="grand-total">Total: ₹${total.toFixed(2)}</p>
          </div>
          
          <div class="border-bottom"></div>
          <p class="text-center">Thank you!</p>
          <br/>
        </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=300,height=600");
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        win.focus();
        win.print();
      }, 500);
    }
  };

  const printKOT = (order) => {
    // CSS for KOT - specifically handles the long paper issue
    const styles = `
      <style>
        @page { size: auto;  margin: 0mm; }
        body { font-family: 'Courier New', monospace; margin: 5px; padding: 0; width: 76mm; }
        .header { text-align: center; margin-bottom: 10px; }
        .border-bottom { border-bottom: 2px dashed #000; margin: 5px 0; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
        .qty { width: 15%; }
        .name { width: 85%; }
        .time { font-size: 12px; text-align: center; }
      </style>
    `;

    const html = `
      <html>
        <head>${styles}</head>
        <body>
          <div class="header">
            <h2 style="margin:0;">KITCHEN TICKET</h2>
            <h3 style="margin:5px 0;">Table: ${order.tableNumber}</h3>
          </div>
          
          <p class="time">${new Date(order.createdAt).toLocaleTimeString()}</p>
          <div class="border-bottom"></div>

          <div>
            ${order.items.map(item => `
              <div class="item-row">
                <span class="qty">${item.quantity} x</span>
                <span class="name">${item.itemId?.name || "Unknown Item"}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="border-bottom"></div>
          <br/> 
          </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=300,height=600");
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      
      setTimeout(() => {
        win.focus();
        win.print();
        // win.close();
      }, 500);
    } else {
        alert("Pop-up blocked. Please allow pop-ups.");
    }
  };

  // --- SETTINGS ---
  const handleTaxChange = (e) => { const val = parseFloat(e.target.value) || 0; setTaxRate(val); localStorage.setItem("taxRate", val); };
  const handleDiscountChange = (e) => { const val = parseFloat(e.target.value) || 0; setDiscountRate(val); localStorage.setItem("discountRate", val); };
  const handleChargesChange = (e) => { const val = parseFloat(e.target.value) || 0; setAdditionalCharges(val); localStorage.setItem("additionalCharges", val); };

  const updateBillingFromOrders = (currentOrders) => {
    const grouped = currentOrders.reduce((acc, order) => {
      if (!acc[order.tableNumber]) acc[order.tableNumber] = [];
      acc[order.tableNumber].push(order);
      return acc;
    }, {});
    const billing = Object.keys(grouped).map((tableNumber) => {
      const tableOrders = grouped[tableNumber];
      const subTotal = tableOrders.reduce((total, order) => {
        return total + order.items.reduce((ot, item) => ot + (item.itemId?.price || 0) * item.quantity, 0);
      }, 0);
      return { tableNumber, subTotal, orders: tableOrders };
    });
    setBillingData(billing);
  };

  const fetchOrderHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/order-history`, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      setOrderHistory(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); } finally { setLoadingHistory(false); }
  };

  const fetchOffers = async () => { try { const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/offers`, { headers: { Authorization: `Bearer ${token}` } }); if(res.ok) setOffers(await res.json()); } catch (e) {} };
  const handleOfferImageUpload = (e) => { const file = e.target.files[0]; if(file) { const reader = new FileReader(); reader.onloadend = () => setNewOffer({image: reader.result, imagePreview: reader.result}); reader.readAsDataURL(file); }};
  const handleAddOffer = async () => { await fetch(`https://petoba.in/api/admin/${restaurantId}/offers`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ image: newOffer.image }) }); fetchOffers(); setNewOffer({image:'', imagePreview:''}); alert("Offer Added"); };
  const handleDeleteOffer = async (id) => { if(!window.confirm("Delete?")) return; await fetch(`https://petoba.in/api/admin/${restaurantId}/offers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); fetchOffers(); };

  const getGroupedHistory = () => {
    const groupedMap = {};
    orderHistory.forEach(o => {
        if(!groupedMap[o.invoiceNumber]) {
            groupedMap[o.invoiceNumber] = { ...o, orders: [o], totalAmount: o.finalTotal || o.totalAmount || 0, subTotal: o.subTotal || o.totalAmount, paymentMethod: o.paymentMethod || 'Cash' };
        } else { groupedMap[o.invoiceNumber].orders.push(o); }
    });
    return Object.values(groupedMap).filter(o => {
        const matchQuery = o.invoiceNumber?.includes(searchQuery) || o.tableNumber?.toString().includes(searchQuery);
        const matchDate = activeFilter === "Today" ? new Date(o.timestamp).toDateString() === new Date().toDateString() : true;
        return matchQuery && matchDate;
    });
  };
  const filteredHistory = getGroupedHistory();

  
  // --- 🆕 CALCULATE EARNINGS BREAKDOWN ---
  const earningsStats = filteredHistory.reduce((acc, order) => {
    const amount = order.totalAmount;
    const method = order.paymentMethod;
    acc.total += amount;
    if (method === 'Cash') acc.cash += amount;
    else if (method === 'UPI' || method === 'Card' || method === 'Online') acc.online += amount;
    else acc.others += amount;
    return acc;
  }, { total: 0, cash: 0, online: 0, others: 0 });
  

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
      id={`sidebar-${id}`} // 🆕 Added ID here for Driver.js
      onClick={() => { setActiveTab(id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === id ? "bg-orange-50 text-orange-600 border-r-4 border-orange-600 bg-orange-50" : "text-gray-500 hover:text-orange-500 hover:bg-gray-50"}`}>
      <Icon size={20} /> <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden text-gray-800 relative">
      <Helmet><title>Dashboard | Petoba</title></Helmet>
      
      {/* 🆕 ADDED STYLES FOR TOUR */}
      <style>{tourStyles}</style>

      <audio ref={audioRef} src={notificationSound} preload="auto" onError={(e) => console.log("Audio Error: ", e)} />

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 p-4">
            <img 
                src={'https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png'} 
                alt="Petoba Logo" 
                className="w-36 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => {
                    navigate("/");        
                    setActiveTab("overview"); 
                }}
            />
        </div>
        <nav className="mt-0 flex flex-col gap-2 p-4">
          <SidebarItem id="tables" label="My Tables" icon={Grid} />
          {/* UPDATED LABEL HERE */}
          <SidebarItem id="orders" label="Live Dashboard" icon={LayoutDashboard} />
          <SidebarItem id="billing" label="Table Billing" icon={Receipt} />
          <SidebarItem id="delivery" label="Delivery Orders" icon={Bike} />
          <SidebarItem id="history" label="Order History" icon={History} />
          <SidebarItem id="notifications" label="Get Mobile Alerts" icon={Smartphone} />
          <div className="mt-auto p-2 gap-2 flex flex-col border-t border-gray-100">
              
              {/* 🆕 MANUAL TOUR BUTTON */}
              

              <button onClick={handlemyorders} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100">
                  <Icons.Settings /><span className="font-medium">Admin Settings</span>
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  <Icons.Logout /><span className="font-medium">Logout</span>
              </button>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
        <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10">
  <div className="flex items-center gap-4">
    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-600 p-1"><Menu size={24} /></button>
    <h2 className="text-lg sm:text-xl font-bold text-gray-800 capitalize hidden sm:block">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
  </div>
  
  <div className="flex items-center gap-3 sm:gap-6">
      {/* SOUND TOGGLE */}
      <button 
        id="sound-toggle" // 🆕 Added ID
        onClick={unlockAudio} 
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors shadow-sm border ${soundEnabled ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-300"}`} 
        title="Click to allow sound"
      >
        {soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
        <span className="text-xs font-bold hidden sm:inline">{soundEnabled ? "Sound On" : "Sound Off"}</span>
      </button>

      {/* 🆕 STORE STATUS TOGGLE */}
      <button 
        id="live-toggle" // 🆕 Added ID
        onClick={toggleLiveStatus} 
        disabled={isTogglingLive}
        className={`flex items-center gap-3 px-1.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
            isLive 
            ? "bg-green-50 border-green-200 pr-4" 
            : "bg-gray-100 border-gray-200 pr-4"
        }`}
      >
        {/* Toggle Switch Visual */}
        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 flex items-center ${isLive ? "bg-green-500" : "bg-gray-400"}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all duration-300 ${isLive ? "left-5" : "left-1"}`}></div>
        </div>
        
        {/* Text Label */}
        <div className="flex flex-col items-start leading-none">
            <span className={`text-xs font-bold uppercase tracking-wider ${isLive ? "text-green-600" : "text-gray-500"}`}>
                {isLive ? "Restaurant Live" : "Ordering Closed"}
            </span>
        </div>
      </button>

      {/* NOTIFICATIONS */}
      <div id="notification-bell" className="relative cursor-pointer p-1">
        <Bell className="text-gray-500 hover:text-orange-500 transition" size={22} />
        {(newOrderQueue.length + newDeliveryQueue.length) > 0 && <span className="absolute -top-0 -right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center">{newOrderQueue.length + newDeliveryQueue.length}</span>}
      </div>
  </div>
</header>

        {isAudioBlocked && <div className="bg-red-500 text-white p-3 text-center text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md z-50" onClick={unlockAudio}><AlertTriangle size={18} className="animate-bounce" /><span>Tap here to enable notifications!</span></div>}
{/* --- 🛑 CRITICAL ALERTS --- */}
      
    {/* --- 🛑 CRITICAL ALERTS --- */}
      
      {/* 1. Billing Expired Popup (Keep WhatsApp) */}
      {showBillingBlocker && !isWarningDismissed && (
        <BlockingModal 
          type="danger"
          title="Plan Expired"
          isExternal={true}
          onAction={SUPPORT_WA}
          onClose={() => setIsWarningDismissed(true)} // 👈 Allows user to close popup
          message="Your Billing Plan is Expired or Not Available. To continue using the Billing Dashboard, please subscribe or claim your Free Trial."
          buttonText="Contact Support on WhatsApp"
        />
      )}

      {/* 2. WhatsApp Mode Warning (Internal Redirect) */}
      {showOrderModeWarning && (
        <BlockingModal 
          type="warning"
          title="Change Order Mode"
          isExternal={false} // Renders blue Settings button
          onAction={handleGoToSettings}
          message={
            <span>
              Your current order mode is set to <strong>WhatsApp</strong>.<br/><br/>
              Please go to <strong>Admin Settings</strong> and in the <strong>Order Channel Dropdown</strong>, select <strong>Billing App</strong>.
            </span>
          }
          buttonText="Go to Admin Settings"
        />
      )}
      <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">

          {/* 0. MY TABLES TAB */}
          {activeTab === "tables" && (
              <div className="space-y-6">


                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: totalTables }, (_, i) => {
                            const tableNum = (i + 1).toString();
                            const activeTableData = billingData.find(b => b.tableNumber.toString() === tableNum);
                            const isOccupied = !!activeTableData;
                            const subTotal = isOccupied ? activeTableData.subTotal : 0;
                            
                            // Calculate seated time
                            const tableOrders = orders.filter(o => o.tableNumber.toString() === tableNum);
                            const seatedTime = isOccupied ? getSeatedTime(tableOrders) : null;

                            return (
                                <div key={tableNum} className={`relative rounded-2xl p-4 h-48 flex flex-col justify-between transition cursor-pointer shadow-sm border ${isOccupied ? "bg-white border-orange-200 hover:border-orange-400 hover:shadow-md" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`} onClick={() => { if(isOccupied) setActiveTab("billing"); }}>
                                    <div className="flex justify-between items-start">
                                        <span className={`text-xl font-extrabold ${isOccupied ? "text-gray-800" : "text-gray-400"}`}>{tableNum}</span>
                                        {isOccupied ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">Active</span> : <span className="text-gray-300"><ChefHat size={20} /></span>}
                                    </div>
                                    {isOccupied ? (
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium mb-1">Running Total</p>
                                            <p className="text-2xl font-extrabold text-orange-600">₹{subTotal}</p>
                                            <div className="flex items-center gap-1.5 mt-3 bg-orange-50 w-fit px-2 py-1 rounded-md border border-orange-100">
                                                <Clock size={12} className="text-orange-500" />
                                                <span className="text-xs font-bold text-orange-700">{seatedTime || "Just now"}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full pb-4"><p className="text-gray-400 font-medium text-sm">Available</p></div>
                                    )}
                                   <button 
    disabled={isRestrictedMode} // 👈 Disables clicks
    onClick={(e) => { 
        e.stopPropagation(); 
        openAddDishModal(tableNum); 
    }} 
    className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition mt-auto 
        ${isRestrictedMode 
            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-70" // 🔒 Disabled Style
            : isOccupied 
                ? "bg-orange-50 text-orange-600 hover:bg-orange-100" 
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
>
    {isRestrictedMode ? <Icons.Settings size={16} /> : <Plus size={16} />} 
    {isRestrictedMode ? "Action Locked" : "Add Items"}
</button>
                                </div>
                            );
                        })}
                    </div>

                  {/* 🆕 TABLE CONTROLS */}
                    <div id="table-controls" className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2"><Grid size={20} className="text-orange-500"/> Floor Plan</h3>
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-500 font-medium">Total Tables:</span>
                            <button onClick={() => updateTableCount(totalTables - 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"><Minus size={16}/></button>
                            <span className="font-bold text-gray-800 w-6 text-center">{totalTables}</span>
                            <button onClick={() => updateTableCount(totalTables + 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"><Plus size={16}/></button>
                        </div>
                    </div>
                </div>
            )}

             {/* 1. ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Revenue</p>
                          <h3 className="text-2xl font-extrabold text-gray-800 mt-1">₹{todaysRevenue.toFixed(0)}</h3>
                      </div>
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition"><TrendingUp size={24} /></div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</p>
                          <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{activeOrdersCount}</h3>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition"><ChefHat size={24} /></div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Occupied Tables</p>
                          <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{occupiedTablesCount}</h3>
                      </div>
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition"><Users size={24} /></div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Action</p>
                          <h3 className={`text-2xl font-extrabold mt-1 ${pendingOrdersCount > 0 ? "text-red-500" : "text-gray-800"}`}>{pendingOrdersCount}</h3>
                      </div>
                      <div className={`p-3 rounded-xl transition ${pendingOrdersCount > 0 ? "bg-red-50 text-red-500 group-hover:bg-red-100" : "bg-gray-50 text-gray-400"}`}><Clock size={24} /></div>
                   </div>
                </div>

                {/* ORDERS TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="font-bold text-gray-700">Recent Incoming Orders</h3></div>
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Table</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase min-w-[150px]">Details</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Total</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Status</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {orders.length === 0 ? (
                           <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No active orders right now.</td></tr>
                        ) : orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3 text-xs sm:text-sm">{order.tableNumber}</div><div className="text-sm font-medium text-gray-900">Table {order.tableNumber}</div></div></td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                               <div className="flex items-center gap-2">
                                  <div className="text-sm text-gray-600 font-medium max-w-[150px] sm:max-w-xs truncate">{order.items.map(i => `${i.quantity} x ${i.itemId?.name}`).join(", ")}</div>
                                  <button onClick={() => setSelectedOrderView(order)} className="text-orange-500 hover:bg-orange-50 p-1 rounded-full transition flex-shrink-0" title="View Full Order"><Eye size={18} /></button>
                               </div>
                               <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-900 whitespace-nowrap">₹{order.total}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                               {order.status === 'pending' ? <span className="px-2 sm:px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">Pending</span> : <span className="px-2 sm:px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button onClick={() => printKOT(order)} className="text-blue-600 hover:bg-blue-50 px-2 sm:px-3 py-2 rounded-lg flex items-center gap-2 ml-auto text-xs sm:text-sm"><Printer size={16}/> <span className="hidden sm:inline">Print KOT</span></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BILLING TAB */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                {/* FINANCIAL SETTINGS ROW */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm flex-1">
                      <div className="bg-purple-50 p-2 rounded-lg text-purple-600 flex-shrink-0"><Percent size={20} /></div>
                      <div className="flex-1">
                          <label className="text-xs font-bold text-gray-500">Tax Rate (%)</label>
                          <input type="number" value={taxRate} onChange={handleTaxChange} className="w-full border-b border-gray-300 focus:outline-none font-bold text-lg text-gray-700" placeholder="0" />
                      </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm flex-1">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600 flex-shrink-0"><Tag size={20} /></div>
                      <div className="flex-1">
                          <label className="text-xs font-bold text-gray-500">Discount (%)</label>
                          <input type="number" value={discountRate} onChange={handleDiscountChange} className="w-full border-b border-gray-300 focus:outline-none font-bold text-lg text-gray-700" placeholder="0" />
                      </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm flex-1">
                      <div className="bg-orange-50 p-2 rounded-lg text-orange-600 flex-shrink-0"><Coins size={20} /></div>
                      <div className="flex-1">
                          <label className="text-xs font-bold text-gray-500">Extra Charges (₹)</label>
                          <input type="number" value={additionalCharges} onChange={handleChargesChange} className="w-full border-b border-gray-300 focus:outline-none font-bold text-lg text-gray-700" placeholder="0" />
                      </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                   {billingData.length === 0 && <div className="col-span-full text-center py-20 text-gray-400">No occupied tables.</div>}
                   {billingData.map((data) => {
                      const { tax, discount, total } = calculateTotals(data.subTotal);
                      const aggregatedItems = getAggregatedTableItems(data.orders);

                      return (
                        <div key={data.tableNumber} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition p-4 sm:p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-200">
                                <h3 className="text-lg sm:text-xl font-extrabold text-gray-800">Table {data.tableNumber}</h3>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Occupied</span>
                              </div>
                              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto text-sm pr-2 custom-scrollbar">
                                {aggregatedItems.map((item, i) => (
                                   <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                                      <span className="text-gray-600 font-medium">{item.name} <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1">x{item.quantity}</span></span>
                                      <span className="font-bold text-gray-800">₹{item.total.toFixed(2)}</span>
                                   </div>
                                ))}
                              </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                               <div className="flex justify-between text-sm text-gray-500 mb-1"><span>Subtotal</span><span>₹{data.subTotal.toFixed(2)}</span></div>
                               {taxRate > 0 && <div className="flex justify-between text-sm text-gray-500 mb-1"><span>Tax ({taxRate}%)</span><span>+₹{tax.toFixed(2)}</span></div>}
                               {additionalCharges > 0 && <div className="flex justify-between text-sm text-gray-500 mb-1"><span>Charges</span><span>+₹{additionalCharges.toFixed(2)}</span></div>}
                               {discountRate > 0 && <div className="flex justify-between text-sm text-green-600 mb-2"><span>Discount ({discountRate}%)</span><span>-₹{discount.toFixed(2)}</span></div>}
                               <div className="flex justify-between text-xl font-extrabold text-gray-900"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                               
                               <div className="grid grid-cols-3 gap-2 mt-6">
                                  <button onClick={() => sendWhatsAppBill(data)} className="bg-green-500 text-white py-2.5 rounded-xl font-semibold flex justify-center items-center gap-1 hover:bg-green-600 transition"><MessageCircle size={18}/></button>
                                  <button onClick={() => printBill(data.tableNumber)} className="bg-gray-900 text-white py-2.5 rounded-xl font-semibold flex justify-center items-center gap-1 hover:bg-black transition"><Printer size={18}/></button>
                                  <button onClick={() => handleInitiateClear(data)} className="bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold flex justify-center items-center gap-1 hover:bg-red-100 transition border border-red-100"><Trash2 size={18}/></button>
                               </div>
                            </div>
                        </div>
                      );
                   })}
                </div>
              </div>
            )}

            {/* 3. HISTORY TAB */}
            {activeTab === "history" && (
               <div className="space-y-6">
                  {/* FILTER BUTTONS */}
                  <div className="flex flex-wrap gap-2 mb-4">
                     {["All", "Today", "This Week", "This Month"].map(f => (
                        <button 
                           key={f} 
                           onClick={() => setActiveFilter(f)} 
                           className={`px-4 sm:px-5 py-2 rounded-xl font-medium transition text-xs sm:text-sm ${activeFilter === f ? "bg-gray-900 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                           {f}
                        </button>
                     ))}
                  </div>

                  {/* 🆕 EARNINGS BREAKDOWN CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Total */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                          <div>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                             <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">₹{earningsStats.total.toFixed(2)}</h2>
                          </div>
                          <div className="p-3 bg-gray-100 text-gray-600 rounded-xl"><TrendingUp size={24} /></div>
                      </div>

                      {/* Cash */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                          <div>
                             <p className="text-xs font-bold text-green-600/70 uppercase tracking-wider">Cash</p>
                             <h2 className="text-xl sm:text-2xl font-extrabold text-green-600 mt-1">₹{earningsStats.cash.toFixed(2)}</h2>
                          </div>
                          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Banknote size={24} /></div>
                      </div>

                      {/* Online */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                          <div>
                             <p className="text-xs font-bold text-blue-600/70 uppercase tracking-wider">Online</p>
                             <h2 className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">₹{earningsStats.online.toFixed(2)}</h2>
                          </div>
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Smartphone size={24} /></div>
                      </div>

                        {/* Others */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                          <div>
                             <p className="text-xs font-bold text-purple-600/70 uppercase tracking-wider">Others</p>
                             <h2 className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-1">₹{earningsStats.others.toFixed(2)}</h2>
                          </div>
                          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Coins size={24} /></div>
                      </div>
                  </div>

                  {/* SEARCH BAR */}
                  <div className="relative">
                      <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                      <input 
                        type="text" 
                        placeholder="Search invoice #, table..." 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" 
                      />
                  </div>

                  {/* HISTORY TABLE */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto w-full">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Invoice</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Date</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Table</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Method</th>
                                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Total</th>
                                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredHistory.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-400">No records found.</td></tr>
                                ) : filteredHistory.map(o => (
                                <tr key={o.invoiceNumber} className="hover:bg-gray-50 transition">
                                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">#{o.invoiceNumber.slice(-6)}</td>
                                    <td className="px-4 sm:px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                        {new Date(o.timestamp).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">{new Date(o.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">Table {o.tableNumber}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            o.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700' : 
                                            o.paymentMethod === 'UPI' ? 'bg-blue-100 text-blue-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                            {o.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-right font-bold text-gray-900 whitespace-nowrap">₹{(o.finalTotal || o.totalAmount).toFixed(2)}</td>
                                    <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                                        <button onClick={() => setSelectedHistoryView(o)} className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100">View Bill</button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  </div>
               </div>
            )}

            {activeTab === "notifications" && (
        <div className="h-full w-full">
            <NotificationSetup />
        </div>
    )}
{/* 👇 ADD THIS NEW BLOCK */}
    {activeTab === "delivery" && (
        <div className="h-full">
            <DeliveryDashboard />
        </div>
    )}
            {/* 4. OFFERS TAB (Responsive Grid) */}
            {activeTab === "offers" && (
               <div className="space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                      <h3 className="text-lg font-bold mb-6 text-gray-800">Create New Promotion</h3>
                      <div className="flex flex-col items-center gap-4">
                         <label className="cursor-pointer w-full max-w-md h-40 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition bg-gray-50 overflow-hidden">
                            {newOffer.imagePreview ? <img src={newOffer.imagePreview} className="h-full w-full object-cover" /> : <><Gift className="text-gray-400 mb-2" size={32} /><span className="text-gray-500 font-medium text-sm">Tap to upload banner</span></>}
                            <input type="file" className="hidden" onChange={handleOfferImageUpload} accept="image/*" />
                         </label>
                         <button onClick={handleAddOffer} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition transform hover:-translate-y-1 w-full sm:w-auto">Upload Offer</button>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {offers.map(o => (
                         <div key={o._id} className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-video sm:aspect-auto">
                            <img src={o.image} className="w-full h-full sm:h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                               <button onClick={() => handleDeleteOffer(o._id)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition"><Trash2 size={20}/></button>
                            </div>
                         </div>
                      ))}
                  </div>
               </div>
            )}
        </main>
      </div>

      {/* --- POPUP FOR NEW TABLE ORDERS --- */}
      {newOrderPopup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md w-[95%] sm:w-full overflow-hidden transform transition-all scale-100">
             <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3"><Bell className="animate-bounce" fill="white" color="white" /><h2 className="text-white font-bold text-xl">New Table Order</h2></div>
                <button onClick={closePopup} className="text-white/80 hover:text-white transition"><X size={24} /></button>
             </div>
             <div className="p-6 sm:p-8">
                <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                   <div><p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Table Number</p><p className="text-4xl font-extrabold text-gray-800">{newOrderPopup.tableNumber}</p></div>
                   <div className="text-right"><p className="font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg text-sm">{new Date(newOrderPopup.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 mb-8 max-h-56 overflow-y-auto custom-scrollbar border border-gray-100">
                   {newOrderPopup.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-0 items-center">
                         <span className="font-bold text-gray-700 text-base sm:text-lg">{item.quantity} <span className="text-gray-400 text-sm font-normal">x</span> {item.itemId?.name}</span>
                         <span className="text-gray-500 font-medium">₹{item.price || 0}</span>
                      </div>
                   ))}
                </div>
                {/* 🆕 UPDATED FOOTER ACTIONS WITH CANCEL */}
                <div className="flex gap-3">
                   <button onClick={handleRejectOrder} disabled={isAccepting} className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2 border border-red-200">
                      <XCircle size={20}/> <span className="hidden sm:inline">Reject</span>
                   </button>
                   <button onClick={() => printKOT(newOrderPopup)} className="flex-1 py-4 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 text-sm sm:text-base border border-blue-200">
                      <Printer size={20} /> <span className="hidden sm:inline">Print</span>
                   </button>
                   <button onClick={handleAcceptOrder} disabled={isAccepting} className="flex-[2] py-4 bg-gray-900 text-white font-bold rounded-xl shadow-xl hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70 transform hover:-translate-y-1 text-sm sm:text-base">
                      {isAccepting ? <span className="animate-pulse">Processing...</span> : <><CheckCircle size={20} /> Accept</>}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- 🆕 POPUP FOR NEW DELIVERY ORDERS --- */}
      {newDeliveryPopup && !newOrderPopup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md w-[95%] sm:w-full overflow-hidden transform transition-all scale-100">
             {/* Header (Different Color for Delivery) */}
             <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3"><Bike className="animate-bounce" color="white" /><h2 className="text-white font-bold text-xl">New Delivery Order</h2></div>
                <button onClick={closePopup} className="text-white/80 hover:text-white transition"><X size={24} /></button>
             </div>
             
             <div className="p-6 sm:p-8">
                {/* Customer Info */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                   <div className="bg-green-50 p-3 rounded-full text-green-600"><MapPin size={24}/></div>
                   <div>
                      <h3 className="font-bold text-gray-800 text-lg">{newDeliveryPopup.customer.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{newDeliveryPopup.customer.address}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm font-medium text-blue-600">
                         <Phone size={14} /> {newDeliveryPopup.customer.phone}
                      </div>
                   </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-xl p-5 mb-8 max-h-56 overflow-y-auto custom-scrollbar border border-gray-100">
                   {newDeliveryPopup.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-0 items-center">
                         <span className="font-bold text-gray-700 text-base sm:text-lg">{item.quantity} <span className="text-gray-400 text-sm font-normal">x</span> {item.name}</span>
                         <span className="text-gray-500 font-medium">₹{item.price * item.quantity}</span>
                      </div>
                   ))}
                   <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 font-bold text-gray-900 text-lg">
                      <span>Total Bill</span>
                      <span>₹{newDeliveryPopup.totalAmount}</span>
                   </div>
                </div>

                {/* 🆕 UPDATED DELIVERY ACTIONS WITH CANCEL */}
                <div className="flex gap-3">
                   <button onClick={handleRejectDelivery} disabled={isAccepting} className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition text-sm sm:text-base border border-red-200 flex items-center justify-center gap-1">
                      <XCircle size={18}/> Reject
                   </button>
                   <button onClick={closePopup} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-sm sm:text-base">
                      Later
                   </button>
                   <button onClick={handleAcceptDelivery} disabled={isAccepting} className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-xl shadow-xl hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70 transform hover:-translate-y-1 text-sm sm:text-base">
                      {isAccepting ? <span className="animate-pulse">Processing...</span> : <><CheckCircle size={20} /> Accept Delivery</>}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- 🆕 ADD DISH MODAL (ADMIN POS) --- */}
      {addDishModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                    <h3 className="font-extrabold text-xl text-gray-800">Add Items</h3>
                    <p className="text-sm text-gray-500">Adding to <strong>Table {addDishModal.tableNumber}</strong></p>
                </div>
                <button onClick={() => setAddDishModal({isOpen: false, tableNumber: null})} className="p-2 hover:bg-gray-200 rounded-full"><X size={24}/></button>
             </div>
             
             {/* Search & Filter */}
             <div className="p-4 border-b border-gray-100 flex gap-2 bg-white">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input type="text" placeholder="Search menu..." value={menuSearch} onChange={e => setMenuSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-600">
                    {menuCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>

             {/* Menu Grid */}
             <div className="flex-1 overflow-y-auto p-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
                {filteredMenu.map(item => {
                    const qty = adminCart[item._id] || 0;
                    return (
                        <div key={item._id} className={`bg-white p-3 rounded-xl border shadow-sm flex flex-col justify-between ${qty > 0 ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-100'}`}>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                <p className="text-xs text-gray-500 font-medium">₹{item.price}</p>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                {qty === 0 ? (
                                    <button onClick={() => updateAdminCart(item._id, 1)} className="w-full py-1.5 bg-gray-100 hover:bg-orange-50 text-orange-600 font-bold text-xs rounded-lg transition">ADD</button>
                                ) : (
                                    <div className="flex items-center bg-orange-50 rounded-lg w-full justify-between px-1 py-1">
                                        <button onClick={() => updateAdminCart(item._id, -1)} className="p-1 text-orange-700 hover:bg-orange-200 rounded"><Minus size={14}/></button>
                                        <span className="text-sm font-bold text-orange-700">{qty}</span>
                                        <button onClick={() => updateAdminCart(item._id, 1)} className="p-1 text-orange-700 hover:bg-orange-200 rounded"><Plus size={14}/></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
             </div>

             {/* Footer Summary */}
             {Object.keys(adminCart).length > 0 && (
                 <div className="p-4 bg-white border-t border-gray-200 shadow-up">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-medium">{Object.values(adminCart).reduce((a,b)=>a+b,0)} Items Selected</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            ₹{Object.entries(adminCart).reduce((sum, [id, q]) => sum + (menu.find(m=>m._id===id)?.price||0)*q, 0)}
                        </span>
                    </div>
                    <button onClick={submitAdminOrder} className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg">
                        Confirm Order
                    </button>
                 </div>
             )}
          </div>
        </div>
      )}



      {/* --- 🆕 SETTLE BILL MODAL --- */}
      {settleTableData && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md w-[95%] sm:w-full overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="bg-gray-900 px-6 py-5 flex justify-between items-center">
                <h2 className="text-white font-bold text-xl">Settle Bill</h2>
                <button onClick={() => setSettleTableData(null)} className="text-gray-400 hover:text-white"><X size={24}/></button>
             </div>
             <div className="p-6">
                <div className="mb-6 text-center">
                   <p className="text-gray-500 mb-1">Total Payable Amount</p>
                   <h2 className="text-4xl font-extrabold text-gray-900">₹{(() => { const { total } = calculateTotals(settleTableData.subTotal); return total.toFixed(2); })()}</h2>
                </div>
                <p className="text-gray-600 font-bold mb-4 text-sm uppercase tracking-wide">Select Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                   <button onClick={() => handleConfirmClear('Cash')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition group"><Banknote size={32} className="text-gray-400 group-hover:text-green-600 mb-2" /><span className="text-sm font-bold text-gray-600 group-hover:text-green-700">Cash</span></button>
                   <button onClick={() => handleConfirmClear('UPI')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition group"><Smartphone size={32} className="text-gray-400 group-hover:text-blue-600 mb-2" /><span className="text-sm font-bold text-gray-600 group-hover:text-blue-700">UPI</span></button>
                   <button onClick={() => handleConfirmClear('Card')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition group"><CreditCard size={32} className="text-gray-400 group-hover:text-purple-600 mb-2" /><span className="text-sm font-bold text-gray-600 group-hover:text-purple-700">Card</span></button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- LIVE ORDER DETAILS MODAL --- */}
      {selectedOrderView && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md w-[95%] sm:w-full overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-gray-800 font-bold text-lg">Order Details</h3>
                <button onClick={() => setSelectedOrderView(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
             </div>
             <div className="p-6">
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                   {selectedOrderView.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50">
                         <div className="flex items-center gap-3"><span className="font-bold text-gray-800">{item.quantity}x</span><span className="text-gray-600">{item.itemId?.name}</span></div><span className="font-medium text-gray-800">₹{item.price}</span>
                      </div>
                   ))}
                </div>
                <button onClick={() => setSelectedOrderView(null)} className="w-full mt-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Close</button>
             </div>
          </div>
        </div>
      )}

      {/* --- 📜 HISTORY BILL VIEW MODAL --- */}
      {selectedHistoryView && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md w-[95%] sm:w-full overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="bg-orange-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">Full Bill Preview</h3>
                <button onClick={() => setSelectedHistoryView(null)} className="text-white/80 hover:text-white"><X size={20}/></button>
             </div>
             <div className="p-6">
                <div className="flex justify-between text-sm text-gray-500 mb-4"><span>Invoice: #{selectedHistoryView.invoiceNumber.slice(-6)}</span><span>{new Date(selectedHistoryView.timestamp).toLocaleString()}</span></div>
                <div className="space-y-2 mb-4 max-h-56 overflow-y-auto border-t border-b border-gray-100 py-4 custom-scrollbar">
                   {getAggregatedTableItems(selectedHistoryView.orders).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm"><span className="text-gray-800">{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span><span className="font-bold text-gray-800">₹{item.total.toFixed(2)}</span></div>
                   ))}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                   <div className="flex justify-between"><span>Subtotal</span><span>₹{(selectedHistoryView.subTotal || selectedHistoryView.totalAmount).toFixed(2)}</span></div>
                   {(selectedHistoryView.taxAmount > 0) && <div className="flex justify-between"><span>Tax ({selectedHistoryView.taxRate}%)</span><span>+₹{selectedHistoryView.taxAmount.toFixed(2)}</span></div>}
                   {(selectedHistoryView.additionalCharges > 0) && <div className="flex justify-between"><span>Extra Charges</span><span>+₹{selectedHistoryView.additionalCharges.toFixed(2)}</span></div>}
                   {(selectedHistoryView.discountAmount > 0) && <div className="flex justify-between text-green-600"><span>Discount ({selectedHistoryView.discountRate}%)</span><span>-₹{selectedHistoryView.discountAmount.toFixed(2)}</span></div>}
                   <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 mt-2 border-t border-dashed border-gray-300"><span>Final Total</span><span>₹{(selectedHistoryView.finalTotal || selectedHistoryView.totalAmount).toFixed(2)}</span></div>
                   <div className="text-right mt-2 text-xs font-bold text-gray-400 uppercase">Paid via {selectedHistoryView.paymentMethod}</div>
                </div>
                <div className="flex gap-2 mt-6">
                   <button onClick={() => printBill(selectedHistoryView.tableNumber, selectedHistoryView.orders, selectedHistoryView.subTotal || selectedHistoryView.totalAmount)} className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Printer size={18}/> Reprint</button>
                   <button onClick={() => setSelectedHistoryView(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Close</button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;