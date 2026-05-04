import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  LayoutDashboard, Receipt, History, Bell, Printer, Trash2, CheckCircle,
  Menu as MenuIcon, X, ChefHat, Volume2, VolumeX, AlertTriangle,
  MessageCircle, Eye, Coins, CreditCard, Smartphone, Banknote, Grid,
  Plus, Minus, Bike, MapPin, Phone, XCircle,
} from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import UpgradePopup from "../../components/UpgradePopup";
import ExpertHelpPopup from "../../components/ExpertHelpPopup";
import notificationSound from "../../components/notification.mp3";

import OverviewTab from "./tabs/OverviewTab";
import MenuManagerTab from "./tabs/MenuManagerTab";
import QRTab from "./tabs/QRTab";
import SettingsTab from "./tabs/SettingsTab";
import BulkImportTab from "./tabs/BulkImportTab";
import TablesTab from "./tabs/TablesTab";
import OrdersTab from "./tabs/OrdersTab";
import BillingTab from "./tabs/BillingTab";
import DeliveryTab from "./tabs/DeliveryTab";
import HistoryTab from "./tabs/HistoryTab";
import NotificationsTab from "./tabs/NotificationsTab";

// ─── Tour styles ──────────────────────────────────────────────────────────────
const tourStyles = `
  .driver-popover.driverjs-theme {
    background-color: #ffffff; color: #1f2937; border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); padding: 20px;
    max-width: 320px; font-family: 'Plus Jakarta Sans','Inter',sans-serif;
    border: 1px solid #e0e7ff;
  }
  .driver-popover.driverjs-theme .driver-popover-title {
    font-size: 18px; font-weight: 800; color: #4338ca; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .driver-popover.driverjs-theme .driver-popover-description {
    font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-btn {
    border-radius: 10px; padding: 10px 18px; font-size: 13px;
    font-weight: 600; text-shadow: none; transition: all 0.2s ease;
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-next-btn {
    background: linear-gradient(135deg,#4f46e5 0%,#4338ca 100%);
    color: white !important; border: none;
    box-shadow: 0 4px 6px -1px rgba(79,70,229,0.3);
  }
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-prev-btn,
  .driver-popover.driverjs-theme .driver-popover-footer .driver-popover-close-btn {
    background: #f3f4f6; color: #6b7280 !important; border: 1px solid #e5e7eb;
  }
  .driver-popover.driverjs-theme .driver-popover-progress-text {
    color: #9ca3af; font-size: 11px; font-weight: 500;
  }
  .driver-popover { z-index: 1000000000 !important; }
  .driver-overlay { z-index: 999999999 !important; opacity: 0.8 !important; }
`;

// ─── SVG icon set (legacy, used in sidebar & forms) ───────────────────────────
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  QR: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm10-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm13-2h2v2h-2v-2Zm2 3h2v6h-6v-2h4v-4Zm-6 1h2v5h-2v-5Zm0-4h4v2h-4v-2Z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Hamburger: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Whatsapp: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>,
  Lock: () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>,
  plate: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6M9 11h6M9 15h3M7 2h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V4a2 2 0 012-2z" /></svg>,
};

// ─── Category reorder modal ───────────────────────────────────────────────────
const CategoryReorderModal = ({ isOpen, onClose, categories, onSave }) => {
  const [list, setList] = useState(categories);
  const dragItem = useRef();
  const dragOverItem = useRef();
  useEffect(() => { if (isOpen) setList(categories); }, [isOpen, categories]);
  const handleSort = () => {
    let _list = [...list];
    const dragged = _list.splice(dragItem.current, 1)[0];
    _list.splice(dragOverItem.current, 0, dragged);
    dragItem.current = null; dragOverItem.current = null;
    setList(_list);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div><h3 className="font-bold text-gray-800">Reorder Categories</h3><p className="text-xs text-gray-500">Drag and drop to rearrange</p></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icons.Close /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {list.map((cat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
              draggable onDragStart={() => (dragItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={e => e.preventDefault()}>
              <div className="flex items-center gap-3">
                <span className="text-gray-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg></span>
                <span className="font-medium text-gray-700">{index + 1}. {cat}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Cancel</button>
          <button onClick={() => onSave(list)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">Save New Order</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
function UnifiedDashboard() {
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurantId") || "";
  const token = localStorage.getItem("token");

  // ── Active tab ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("overview");

  // ── Restaurant & menu data (lifted, fetched once) ───────────────────────────
  const [restaurant, setRestaurant] = useState({ name: "", logo: "", address: "", contact: "", billing: false, orderMode: "whatsapp", membership_level: 1, categoryOrder: [] });
  const [existingItems, setExistingItems] = useState([]);
  const [offers, setOffers] = useState([]);

  // ── Operations data ──────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOrderModeDropdownOpen, setIsOrderModeDropdownOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  // ── Menu manager state ───────────────────────────────────────────────────────
  const formRef = useRef(null);
  const [itemForm, setItemForm] = useState({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
  const [customCategory, setCustomCategory] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);

  // ── Operations (Admin POS / tables) state ────────────────────────────────────
  const [totalTables, setTotalTables] = useState(() => Number(localStorage.getItem("totalTables")) || 12);
  const [addDishModal, setAddDishModal] = useState({ isOpen: false, tableNumber: null });
  const [adminCart, setAdminCart] = useState({});
  const [menuSearch, setMenuSearch] = useState("");
  const [posCategory, setPosCategory] = useState("All");
  const [menuCategories, setMenuCategories] = useState(["All"]);
  const [isLive, setIsLive] = useState(true);
  const [isTogglingLive, setIsTogglingLive] = useState(false);

  // ── Order notification state ──────────────────────────────────────────────────
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const [newOrderQueue, setNewOrderQueue] = useState([]);
  const [newDeliveryPopup, setNewDeliveryPopup] = useState(null);
  const [newDeliveryQueue, setNewDeliveryQueue] = useState([]);
  const processedOrderIds = useRef(new Set());
  const processedDeliveryIds = useRef(new Set());
  const [isAccepting, setIsAccepting] = useState(false);

  // ── Sound ────────────────────────────────────────────────────────────────────
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("soundEnabled") === "true");
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);

  // ── Billing / history UI state ───────────────────────────────────────────────
  const [taxRate, setTaxRate] = useState(() => Number(localStorage.getItem("taxRate")) || 0);
  const [discountRate, setDiscountRate] = useState(() => Number(localStorage.getItem("discountRate")) || 0);
  const [additionalCharges, setAdditionalCharges] = useState(() => Number(localStorage.getItem("additionalCharges")) || 0);
  const [settleTableData, setSettleTableData] = useState(null);
  const [selectedOrderView, setSelectedOrderView] = useState(null);
  const [selectedHistoryView, setSelectedHistoryView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // ── Tour ─────────────────────────────────────────────────────────────────────
  const tourInitialized = useRef(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // DERIVED STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const membershipLimits = { 1: 15, 2: 100, 3: Infinity };

  const allCategories = [...new Set(existingItems.map(i => i.category).filter(Boolean))];

  const orderedMenuGroups = useMemo(() => {
    const cats = [...new Set(existingItems.map(i => i.category?.trim()).filter(Boolean))];
    const sorted = cats.sort((a, b) => {
      const order = restaurant.categoryOrder || [];
      const ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1; if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return sorted.map(cat => ({ category: cat, items: existingItems.filter(i => i.category?.trim() === cat) }));
  }, [existingItems, restaurant.categoryOrder]);

  const billingData = useMemo(() => {
    const grouped = orders.reduce((acc, order) => {
      const tNum = String(order.tableNumber);
      if (!acc[tNum]) acc[tNum] = [];
      acc[tNum].push(order);
      return acc;
    }, {});
    return Object.keys(grouped).map(tableNumber => {
      const tableOrders = grouped[tableNumber];
      const subTotal = tableOrders.reduce((total, order) =>
        total + order.items.reduce((ot, item) => ot + (item.itemId?.price || 0) * item.quantity, 0), 0);
      return { tableNumber, subTotal, orders: tableOrders };
    });
  }, [orders]);

  const activeOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
  const occupiedTablesCount = new Set(orders.map(o => o.tableNumber)).size;
  const todaysRevenue = orderHistory
    .filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.finalTotal || o.totalAmount || 0), 0);

  const showBillingBlocker = restaurant.billing === false;
  const showOrderModeWarning = !showBillingBlocker && restaurant.orderMode === "whatsapp";
  const isRestrictedMode = showBillingBlocker || showOrderModeWarning;

  const filteredHistory = useMemo(() => {
    const grouped = {};
    orderHistory.forEach(o => {
      if (!grouped[o.invoiceNumber]) {
        grouped[o.invoiceNumber] = { ...o, orders: [o], totalAmount: o.finalTotal || o.totalAmount || 0, subTotal: o.subTotal || o.totalAmount, paymentMethod: o.paymentMethod || "Cash" };
      } else { grouped[o.invoiceNumber].orders.push(o); }
    });
    return Object.values(grouped).filter(o => {
      const matchQ = o.invoiceNumber?.includes(searchQuery) || o.tableNumber?.toString().includes(searchQuery);
      const matchD = activeFilter === "Today" ? new Date(o.timestamp).toDateString() === new Date().toDateString() : true;
      return matchQ && matchD;
    });
  }, [orderHistory, searchQuery, activeFilter]);

  const earningsStats = filteredHistory.reduce((acc, o) => {
    const amt = o.totalAmount; const m = o.paymentMethod;
    acc.total += amt;
    if (m === "Cash") acc.cash += amt;
    else if (m === "UPI" || m === "Card" || m === "Online") acc.online += amt;
    else acc.others += amt;
    return acc;
  }, { total: 0, cash: 0, online: 0, others: 0 });

  const filteredMenu = existingItems.filter(item => {
    const matchCat = posCategory === "All" || item.category === posCategory;
    const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const getDaysLeft = () => {
    if (!restaurant.expiresAt) return null;
    return Math.ceil((new Date(restaurant.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
  };
  const daysLeft = getDaysLeft();

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA FETCHING
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(`https://petoba.in/api/admin/${restaurantId}/details`, { headers: { Authorization: `Bearer ${token}` } });
      setRestaurant(res.data);
      if (res.data.isLive !== undefined) setIsLive(res.data.isLive);
    } catch (e) { setError("Failed to fetch restaurant."); }
  };

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`https://petoba.in/api/admin/${restaurantId}/menu`, { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(res.data)) {
        setExistingItems(res.data);
        setMenuCategories(["All", ...new Set(res.data.map(i => i.category).filter(Boolean))]);
      }
    } catch (e) { setError("Failed to fetch menu."); }
  };

  const fetchOrders = async (isFirstLoad) => {
    try {
      const [resTable, resDelivery] = await Promise.all([
        fetch(`https://petoba.in/api/admin/${restaurantId}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`https://petoba.in/api/admin/delivery/all/${restaurantId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const tableData = await resTable.json();
      const deliveryData = await resDelivery.json();

      if (Array.isArray(tableData)) {
        const active = tableData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .filter(o => o.status !== "cancelled" && o.status !== "completed" && o.status !== "paid");
        setOrders(active);
        let hasNew = false;
        active.filter(o => o.status === "pending").forEach(order => {
          if (!processedOrderIds.current.has(order._id)) {
            processedOrderIds.current.add(order._id);
            setNewOrderQueue(prev => [...prev, order]);
            hasNew = true;
          }
        });
        if (hasNew) playBell();
      }

      if (Array.isArray(deliveryData)) {
        let hasNew = false;
        deliveryData.filter(o => o.status === "Pending").forEach(order => {
          if (!processedDeliveryIds.current.has(order._id)) {
            processedDeliveryIds.current.add(order._id);
            setNewDeliveryQueue(prev => [...prev, order]);
            hasNew = true;
          }
        });
        if (hasNew) playBell();
      }

      setNewOrderQueue(prev => {
        if (prev.length > 0 && !newOrderPopup && !newDeliveryPopup) { setNewOrderPopup(prev[0]); return prev.slice(1); }
        return prev;
      });
      setNewDeliveryQueue(prev => {
        if (prev.length > 0 && !newDeliveryPopup && !newOrderPopup) { setNewDeliveryPopup(prev[0]); return prev.slice(1); }
        return prev;
      });
    } catch (err) { console.error(err); }
  };

  const fetchOrderHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/order-history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrderHistory(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoadingHistory(false); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!restaurantId || !token) return;
    fetchRestaurant();
    fetchMenu();
    fetchOrderHistory();
    fetchOrders(true);
    if (window.innerWidth >= 1024) setIsMobileMenuOpen(true);
  }, []);

  // Poll only when billing is active
  useEffect(() => {
    if (!restaurant.billing) return;
    const interval = setInterval(() => fetchOrders(false), 5000);
    return () => clearInterval(interval);
  }, [restaurant.billing]);

  // Auto-start menu tour
  useEffect(() => {
    if (!restaurantId) return;
    const tourKey = `tour_completed_${restaurantId}`;
    if (localStorage.getItem(tourKey)) return;
    const timer = setTimeout(() => {
      if (document.getElementById("sidebar-overview")) startMenuTour();
    }, 1500);
    return () => clearTimeout(timer);
  }, [restaurantId]);

  // Auto-start billing tour
  useEffect(() => {
    if (!restaurantId || !restaurant.billing || tourInitialized.current) return;
    const tourKey = `tour_seen_admin_${restaurantId}`;
    if (localStorage.getItem(tourKey)) return;
    tourInitialized.current = true;
    const timer = setTimeout(() => {
      if (document.getElementById("sidebar-tables")) startBillingTour();
    }, 2500);
    return () => clearTimeout(timer);
  }, [restaurantId, restaurant.billing]);

  // ─────────────────────────────────────────────────────────────────────────────
  // TOUR FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const startMenuTour = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) setIsMobileMenuOpen(true);
    const tourKey = `tour_completed_${restaurantId}`;
    setTimeout(() => {
      const driverObj = driver({
        showProgress: true, animate: true,
        doneBtnText: "Start Using App", closeBtnText: "Dismiss",
        nextBtnText: "Next →", prevBtnText: "← Back",
        stagePadding: 8, popoverClass: "driverjs-theme",
        steps: [
          { element: "body", popover: { title: "👋 Welcome to Petoba!", description: "Your restaurant dashboard is ready. Let's show you the key features.", side: "left", align: "center" } },
          { element: "#sidebar-overview", popover: { title: "🏠 Home Dashboard", description: "See your live menu count and membership status at a glance.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#sidebar-menu", popover: { title: "🍔 Menu Manager", description: "<b>Add new dishes</b>, update prices, and organize categories here.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#add-dish-btn", popover: { title: "⚡ Quick Add", description: "Use this button anytime to add a dish in seconds.", side: "bottom", align: "center" } },
          { element: "#sidebar-qr", popover: { title: "📲 QR Codes", description: "Download <b>table standees</b> and marketing posters.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#order-mode-toggle", popover: { title: "⚙️ Ordering Mode", description: "Toggle between <b>WhatsApp</b> or the pro <b>Billing Terminal</b>.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#sidebar-settings", popover: { title: "🛠️ Settings", description: "Update your logo, address, and contact info here.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#sidebar-uploads", popover: { title: "📄 AI Import", description: "Upload a photo of your paper menu and let our AI digitize it!", side: isMobile ? "bottom" : "right", align: "start" } },
        ],
        onDestroy: () => { if (isMobile) setIsMobileMenuOpen(false); },
      });
      localStorage.setItem(tourKey, "true");
      driverObj.drive();
    }, isMobile ? 500 : 100);
  };

  const startBillingTour = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) setIsMobileMenuOpen(true);
    const tourKey = `tour_seen_admin_${restaurantId}`;
    setTimeout(() => {
      const driverObj = driver({
        showProgress: true, animate: true,
        doneBtnText: "Finish Setup", closeBtnText: "Skip",
        nextBtnText: "Next →", prevBtnText: "← Back",
        popoverClass: "driverjs-theme", stagePadding: 5,
        steps: [
          { element: "body", popover: { title: "🚀 Billing Terminal", description: "Manage live orders, billing, and deliveries all from one place.", side: "left", align: "center" } },
          { element: "#live-toggle", popover: { title: "🟢 Store Status", description: "<b>Toggle</b> to open or close your restaurant.", side: "bottom", align: "center" } },
          { element: "#sound-toggle", popover: { title: "🔊 Sound Alerts", description: "Click to <b>enable sound</b> for new orders.", side: "bottom", align: "center" } },
          { element: "#sidebar-tables", popover: { title: "🪑 My Tables", description: "Manage your floor plan and add items to tables.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#sidebar-orders", popover: { title: "🔥 Live Dashboard", description: "View active orders and today's revenue in real-time.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#sidebar-billing", popover: { title: "🧾 Billing & Checkout", description: "Settle bills. Supports Cash, UPI, and Split payments.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#sidebar-delivery", popover: { title: "🛵 Delivery Orders", description: "Manage home delivery orders separately.", side: isMobile ? "bottom" : "right", align: "start" } },
          { element: "#notification-bell", popover: { title: "🔔 Notifications", description: "See pending orders in the queue.", side: "left", align: "start" } },
        ],
        onDestroy: () => { if (isMobile) setIsMobileMenuOpen(false); },
      });
      localStorage.setItem(tourKey, "true");
      driverObj.drive();
    }, isMobile ? 500 : 100);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SOUND
  // ─────────────────────────────────────────────────────────────────────────────
  const unlockAudio = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.load(); await audioRef.current.play();
      audioRef.current.pause(); audioRef.current.currentTime = 0;
      setSoundEnabled(true); localStorage.setItem("soundEnabled", "true");
      setIsAudioBlocked(false);
    } catch { setIsAudioBlocked(true); }
  };

  const playBell = async () => {
    if (!soundEnabled || !audioRef.current) return;
    try { audioRef.current.currentTime = 0; await audioRef.current.play(); setIsAudioBlocked(false); }
    catch { setIsAudioBlocked(true); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // GENERAL ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const triggerAction = async (fn) => { setIsLoading(true); await fn(); setIsLoading(false); };
  const handleOptionClick = (path) => navigate(path);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) { localStorage.clear(); navigate("/login"); }
  };

  const toggleOrderMode = async () => {
    const cur = restaurant.orderMode || "whatsapp";
    const next = cur === "whatsapp" ? "billing" : "whatsapp";
    setRestaurant(prev => ({ ...prev, orderMode: next }));
    try {
      await axios.put(`https://petoba.in/api/admin/${restaurantId}/settings`, { orderMode: next }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      setRestaurant(prev => ({ ...prev, orderMode: cur }));
      alert("Failed to update settings");
    }
  };

  const toggleLiveStatus = async () => {
    const next = !isLive;
    setIsLive(next); setIsTogglingLive(true);
    try {
      const res = await fetch(`https://petoba.in/api/admin/${restaurantId}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ isLive: next }) });
      if (!res.ok) throw new Error();
    } catch { setIsLive(!next); alert("Failed to update store status"); }
    finally { setIsTogglingLive(false); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MENU MANAGER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && !/^\d*\.?\d*$/.test(value)) return;
    setItemForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setItemForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  async function uploadImageToWordPress(base64Image, filename) {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const bytes = atob(base64Data);
    const arrays = [];
    for (let o = 0; o < bytes.length; o += 512) {
      const slice = bytes.slice(o, o + 512);
      arrays.push(new Uint8Array(Array.from(slice, c => c.charCodeAt(0))));
    }
    const blob = new Blob(arrays, { type: "image/jpeg" });
    const fd = new FormData(); fd.append("file", blob, filename);
    const auth = `Basic ${btoa("yashkolnure58@gmail.com:05mq iTLF UvJU dyaz 7KxQ 8pyc")}`;
    const res = await fetch("https://website.avenirya.com/wp-json/wp/v2/media", { method: "POST", headers: { Authorization: auth }, body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).source_url;
  }

  const addItemToList = async () => {
    setError(""); setMessage("");
    if (!itemForm.name || !itemForm.category || !itemForm.price) { setError("All fields are required."); return; }
    const limit = membershipLimits[restaurant.membership_level] || 0;
    if (existingItems.length >= limit && limit !== Infinity) { setError(`Limit reached: ${limit} items.`); return; }
    let imageUrl = itemForm.image;
    if (itemForm.image?.startsWith("data:")) {
      try { imageUrl = await uploadImageToWordPress(itemForm.image, `${itemForm.name.replace(/\s+/g, "-")}.jpg`); }
      catch { setError("Image upload failed."); return; }
    }
    try {
      await axios.post(`https://petoba.in/api/admin/${restaurantId}/menu`, { ...itemForm, price: parseFloat(itemForm.price), restaurantId, image: imageUrl, inStock: itemForm.inStock ?? true }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Item added successfully!");
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
      setCustomCategory(""); setShowItemForm(false);
      fetchMenu();
    } catch { setError("Failed to add item."); }
  };

  const handleUpdate = async () => {
    setMessage(""); setError("");
    let imageUrl = itemForm.image;
    if (itemForm.image?.startsWith("data:")) {
      try { imageUrl = await uploadImageToWordPress(itemForm.image, `${itemForm.name.replace(/\s+/g, "-")}-${Date.now()}.jpg`); }
      catch { setError("Image upload failed."); return; }
    }
    try {
      await axios.put(`https://petoba.in/api/admin/${restaurantId}/menu/${itemForm._id}`, { ...itemForm, image: imageUrl }, { headers: { Authorization: `Bearer ${token}` } });
      setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
      setMessage("Updated successfully"); setShowItemForm(false);
      fetchMenu();
    } catch { setError("Update failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`https://petoba.in/api/admin/${restaurantId}/menu/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setExistingItems(prev => prev.filter(item => item._id !== id));
    } catch { console.error("Delete failed"); }
  };

  const handleEditItem = (item) => {
    setItemForm({ name: item.name, category: item.category, description: item.description, price: item.price.toString(), image: item.image, _id: item._id, inStock: item.inStock === true });
    setShowItemForm(true);
    setTimeout(() => { if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
  };

  const handleSaveCategoryOrder = async (newOrder) => {
    try {
      setRestaurant(prev => ({ ...prev, categoryOrder: newOrder }));
      setShowReorderModal(false);
      await axios.put(`https://petoba.in/api/admin/${restaurantId}/settings`, { categoryOrder: newOrder }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Category order saved!");
    } catch { setError("Failed to save order."); }
  };

  const handleUpgrade = async (newLevel) => {
    try {
      const res = await axios.put(`https://petoba.in/api/admin/upgrade-membership/${restaurantId}`, { newLevel }, { headers: { Authorization: `Bearer ${token}` } });
      setRestaurant(prev => ({ ...prev, membership_level: res.data.restaurant.membership_level }));
      setShowUpgrade(false);
    } catch { alert("Upgrade failed"); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ADMIN POS ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const updateTableCount = (n) => { if (n < 1) return; setTotalTables(n); localStorage.setItem("totalTables", n); };

  const getSeatedTime = (tableOrders) => {
    if (!tableOrders || tableOrders.length === 0) return null;
    const first = Math.min(...tableOrders.map(o => new Date(o.createdAt).getTime()));
    const mins = Math.floor((Date.now() - first) / 60000);
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${mins} mins`;
  };

  const openAddDishModal = (tableNum) => {
    if (isRestrictedMode) { alert(showBillingBlocker ? "Plan Expired: Cannot place orders." : "Switch to Billing App mode to place orders."); return; }
    setAdminCart({}); setAddDishModal({ isOpen: true, tableNumber: tableNum });
  };

  const updateAdminCart = (itemId, qty) => {
    setAdminCart(prev => {
      const n = (prev[itemId] || 0) + qty;
      if (n <= 0) { const { [itemId]: _, ...rest } = prev; return rest; }
      return { ...prev, [itemId]: n };
    });
  };

  const submitAdminOrder = async () => {
    if (Object.keys(adminCart).length === 0) return;
    const items = Object.entries(adminCart).map(([itemId, quantity]) => ({ itemId, quantity }));
    const total = items.reduce((s, ci) => s + (existingItems.find(m => m._id === ci.itemId)?.price || 0) * ci.quantity, 0);
    try {
      const res = await fetch("https://petoba.in/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ restaurantId, tableNumber: addDishModal.tableNumber, items, total, customerName: "Admin/Waiter" }) });
      if (res.ok) { setAddDishModal({ isOpen: false, tableNumber: null }); fetchOrders(false); alert("✅ Items added!"); }
      else alert("Failed to add items");
    } catch { alert("Error submitting order"); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ORDER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const advanceQueue = () => {
    setTimeout(() => {
      if (newOrderQueue.length > 0) { setNewOrderPopup(newOrderQueue[0]); setNewOrderQueue(p => p.slice(1)); }
      else if (newDeliveryQueue.length > 0) { setNewDeliveryPopup(newDeliveryQueue[0]); setNewDeliveryQueue(p => p.slice(1)); }
    }, 300);
  };

  const handleAcceptOrder = async () => {
    if (!newOrderPopup) return;
    setIsAccepting(true);
    try {
      await fetch(`https://petoba.in/api/admin/${restaurantId}/orders/${newOrderPopup._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: "ok" }) });
      setOrders(prev => prev.map(o => o._id === newOrderPopup._id ? { ...o, status: "ok" } : o));
      setNewOrderPopup(null); advanceQueue();
    } catch { alert("Failed to accept."); } finally { setIsAccepting(false); }
  };

  const handleRejectOrder = async () => {
    if (!newOrderPopup || !window.confirm("Reject this order?")) return;
    setIsAccepting(true);
    try {
      await fetch(`https://petoba.in/api/admin/${restaurantId}/orders/${newOrderPopup._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: "cancelled" }) });
      setOrders(prev => prev.filter(o => o._id !== newOrderPopup._id));
      setNewOrderPopup(null); advanceQueue();
    } catch { alert("Failed to reject."); } finally { setIsAccepting(false); }
  };

  const handleAcceptDelivery = async () => {
    if (!newDeliveryPopup) return;
    setIsAccepting(true);
    try {
      await fetch(`https://petoba.in/api/admin/delivery/status/${newDeliveryPopup._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Confirmed" }) });
      setNewDeliveryPopup(null); advanceQueue();
    } catch { alert("Failed to accept delivery"); } finally { setIsAccepting(false); }
  };

  const handleRejectDelivery = async () => {
    if (!newDeliveryPopup || !window.confirm("Reject this delivery?")) return;
    setIsAccepting(true);
    try {
      await fetch(`https://petoba.in/api/admin/delivery/status/${newDeliveryPopup._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Cancelled" }) });
      setNewDeliveryPopup(null); advanceQueue();
    } catch { alert("Failed to reject delivery"); } finally { setIsAccepting(false); }
  };

  const closePopup = () => {
    if (newOrderPopup) { setNewOrderPopup(null); advanceQueue(); }
    else if (newDeliveryPopup) { setNewDeliveryPopup(null); advanceQueue(); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // BILLING ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleTaxChange = (e) => { const v = parseFloat(e.target.value) || 0; setTaxRate(v); localStorage.setItem("taxRate", v); };
  const handleDiscountChange = (e) => { const v = parseFloat(e.target.value) || 0; setDiscountRate(v); localStorage.setItem("discountRate", v); };
  const handleChargesChange = (e) => { const v = parseFloat(e.target.value) || 0; setAdditionalCharges(v); localStorage.setItem("additionalCharges", v); };

  const calculateTotals = (subTotal) => {
    const tax = (subTotal * taxRate) / 100;
    const discount = (subTotal * discountRate) / 100;
    return { tax, discount, total: subTotal + tax + additionalCharges - discount };
  };

  const getAggregatedTableItems = (tableOrders) => {
    if (!tableOrders || !Array.isArray(tableOrders)) return [];
    const map = {};
    tableOrders.forEach(order => {
      (order.items || order.orderItems || []).forEach(item => {
        const id = item.itemId?._id || item._id || item.name;
        const name = item.itemId?.name || item.name || "Item";
        const price = item.price || 0;
        if (!map[id]) map[id] = { name, price, quantity: 0, total: 0 };
        map[id].quantity += item.quantity;
        map[id].total += price * item.quantity;
      });
    });
    return Object.values(map);
  };

  const handleInitiateClear = (tableData) => setSettleTableData(tableData);

  const handleConfirmClear = async (method) => {
    if (!settleTableData) return;
    const cleanNum = settleTableData.tableNumber.toString().trim();
    try {
      const res = await fetch(`https://petoba.in/api/clearTable/${encodeURIComponent(cleanNum)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ taxRate, discountRate, additionalCharges, paymentMethod: method, restaurantId }),
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => String(o.tableNumber).trim() !== cleanNum));
        setSettleTableData(null); fetchOrderHistory();
      } else {
        const err = await res.json();
        if (res.status === 404) { setOrders(prev => prev.filter(o => String(o.tableNumber).trim() !== cleanNum)); setSettleTableData(null); }
        else alert("Error: " + (err.message || res.statusText));
      }
    } catch { alert("Network error."); }
  };

  const sendWhatsAppBill = (tableData) => {
    const { tableNumber, orders: tOrders, subTotal } = tableData;
    const customerPhone = tOrders[0]?.wpno || "";
    const { tax, discount, total } = calculateTotals(subTotal);
    const items = getAggregatedTableItems(tOrders);
    let msg = `*${restaurant.name || "Restaurant Bill"}*\nTable: ${tableNumber}\nDate: ${new Date().toLocaleString()}\n\n*Items:*\n`;
    items.forEach(i => { msg += `• ${i.name} x${i.quantity} = ₹${i.total.toFixed(2)}\n`; });
    msg += `\nSubtotal: ₹${subTotal.toFixed(2)}\n`;
    if (taxRate > 0) msg += `Tax (${taxRate}%): +₹${tax.toFixed(2)}\n`;
    if (additionalCharges > 0) msg += `Charges: +₹${additionalCharges.toFixed(2)}\n`;
    if (discountRate > 0) msg += `Discount (${discountRate}%): -₹${discount.toFixed(2)}\n`;
    msg += `*TOTAL: ₹${total.toFixed(2)}*\n\nThank you!`;
    window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const printBill = (tableNumber, ordersInput, subTotalOverride = null) => {
    let subTotal = subTotalOverride;
    let ordersToPrint = ordersInput;
    if (subTotal === null || !ordersToPrint) {
      const data = billingData.find(d => d.tableNumber === tableNumber);
      if (!data) { alert("No billing data for Table " + tableNumber); return; }
      subTotal = data.subTotal; ordersToPrint = data.orders;
    }
    if (!ordersToPrint || !Array.isArray(ordersToPrint)) { alert("No items to print!"); return; }
    const { tax, discount, total } = calculateTotals(subTotal);
    const items = getAggregatedTableItems(ordersToPrint);
    const styles = `<style>@page{size:auto;margin:0mm}body{font-family:'Courier New',monospace;margin:5px;padding:0;width:76mm}h3{margin:5px 0;text-align:center;font-size:18px}p{margin:2px 0;font-size:14px}.text-center{text-align:center}.border-bottom{border-bottom:1px dashed #000;margin:5px 0}table{width:100%;font-size:14px;border-collapse:collapse}th{text-align:left;border-bottom:1px solid #000}td{padding:2px 0;font-weight:bold}.total-section{text-align:right;margin-top:5px}.grand-total{font-size:16px;font-weight:bold;margin-top:5px}</style>`;
    const html = `<html><head>${styles}</head><body><div class="text-center">${restaurant.logo ? `<img src="${restaurant.logo}" style="width:70px;"/>` : ""}<h3>${restaurant.name || "Restaurant"}</h3><p>${restaurant.address || ""}</p><p>${restaurant.contact || ""}</p></div><div class="border-bottom"></div><p>Table: <strong>${tableNumber}</strong></p><p>Date: ${new Date().toLocaleString()}</p><div class="border-bottom"></div><table><tr><th style="width:50%">Item</th><th style="width:15%">Qty</th><th style="text-align:right">Amt</th></tr>${items.map(i => `<tr><td>${i.name}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">${i.total.toFixed(2)}</td></tr>`).join("")}</table><div class="border-bottom"></div><div class="total-section"><p>Subtotal: ₹${subTotal.toFixed(2)}</p>${taxRate > 0 ? `<p>Tax (${taxRate}%): +₹${tax.toFixed(2)}</p>` : ""}${additionalCharges > 0 ? `<p>Charges: +₹${additionalCharges.toFixed(2)}</p>` : ""}${discountRate > 0 ? `<p>Discount (${discountRate}%): -₹${discount.toFixed(2)}</p>` : ""}<p class="grand-total">Total: ₹${total.toFixed(2)}</p></div><div class="border-bottom"></div><p class="text-center">Thank you!</p><br/></body></html>`;
    const win = window.open("", "_blank", "width=300,height=600");
    if (win) { win.document.open(); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 500); }
  };

  const printKOT = (order) => {
    const styles = `<style>@page{size:auto;margin:0mm}body{font-family:'Courier New',monospace;margin:5px;padding:0;width:76mm}.header{text-align:center;margin-bottom:10px}.border-bottom{border-bottom:2px dashed #000;margin:5px 0}.item-row{display:flex;justify-content:space-between;margin-bottom:5px;font-weight:bold;font-size:14px}.qty{width:15%}.name{width:85%}.time{font-size:12px;text-align:center}</style>`;
    const html = `<html><head>${styles}</head><body><div class="header"><h2 style="margin:0;">KITCHEN TICKET</h2><h3 style="margin:5px 0;">Table: ${order.tableNumber}</h3></div><p class="time">${new Date(order.createdAt).toLocaleTimeString()}</p><div class="border-bottom"></div><div>${order.items.map(i => `<div class="item-row"><span class="qty">${i.quantity} x</span><span class="name">${i.itemId?.name || "Unknown"}</span></div>`).join("")}</div><div class="border-bottom"></div><br/></body></html>`;
    const win = window.open("", "_blank", "width=300,height=600");
    if (win) { win.document.open(); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 500); }
    else alert("Pop-up blocked. Please allow pop-ups.");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SIDEBAR ITEMS
  // ─────────────────────────────────────────────────────────────────────────────
  const SidebarItem = ({ id, label, icon: Icon, billingRequired }) => {
    const isActive = activeTab === id;
    const isLocked = billingRequired && !restaurant.billing;
    return (
      <button
        id={`sidebar-${id}`}
        onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
      >
        <Icon />
        <span className="font-medium flex-1 text-left">{label}</span>
        {isLocked && <span className="text-gray-400 border border-gray-300 rounded px-1 py-0.5 text-[10px]"><Icons.Lock /></span>}
      </button>
    );
  };

  const tabTitle = {
    overview: "Dashboard Overview", menu: "Menu Manager", qr: "QR & Marketing",
    settings: "Settings", uploads: "Bulk Import", tables: "My Tables",
    orders: "Live Dashboard", billing: "Table Billing", delivery: "Delivery Orders",
    history: "Order History", notifications: "Mobile Alerts",
  }[activeTab] || "Dashboard";

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Helmet><title>Dashboard - {restaurant.name || "Petoba"}</title></Helmet>
      <style>{tourStyles}</style>
      <audio ref={audioRef} src={notificationSound} preload="auto" />

      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} currentLevel={restaurant?.membership_level || 1} onUpgrade={handleUpgrade} />
      <ExpertHelpPopup open={showPopup} onClose={() => setShowPopup(false)} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:transform-none flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="pr-6 border-b border-gray-100 flex items-center justify-between py-4 pl-4">
          <img src="https://petoba.avenirya.com/wp-content/uploads/2022/07/Untitled-design-6.png" alt="Petoba" className="w-36 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { navigate("/"); setActiveTab("overview"); }} />
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500"><Icons.Close /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Group 1: Menu Management */}
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 pb-1 pt-2">Menu & Content</p>
          <SidebarItem id="overview" label="Overview" icon={Icons.Home} />
          <SidebarItem id="menu" label="Menu Manager" icon={Icons.Menu} />
          <SidebarItem id="qr" label="QR Code Manage" icon={Icons.QR} />
          <SidebarItem id="settings" label="Settings" icon={Icons.Settings} />
          <SidebarItem id="uploads" label="Bulk Import" icon={Icons.Upload} />

          {/* Group 2: Operations */}
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 pb-1 pt-4">Operations</p>
          <SidebarItem id="tables" label="My Tables" icon={() => <Grid size={20} />} billingRequired />
          <SidebarItem id="orders" label="Live Dashboard" icon={() => <LayoutDashboard size={20} />} billingRequired />
          <SidebarItem id="billing" label="Table Billing" icon={() => <Receipt size={20} />} billingRequired />
          <SidebarItem id="delivery" label="Delivery Orders" icon={() => <Bike size={20} />} billingRequired />
          <SidebarItem id="history" label="Order History" icon={() => <History size={20} />} billingRequired />
          <SidebarItem id="notifications" label="Mobile Alerts" icon={() => <Smartphone size={20} />} billingRequired />

          {/* Order channel dropdown */}
          <div className="mt-4 mb-2 px-1 relative">
            <label className="text-[11px] px-2 font-bold text-gray-400 uppercase tracking-wider mb-2 block">Order Channel</label>
            <button id="order-mode-toggle" onClick={() => setIsOrderModeDropdownOpen(!isOrderModeDropdownOpen)} className="w-full bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-xl flex items-center justify-between shadow-sm hover:border-indigo-400 transition-all">
              <div className="flex items-center gap-2">
                {restaurant.orderMode === "billing" ? <><div className="p-1 bg-indigo-100 rounded text-indigo-600"><Icons.plate /></div><span>Billing App</span></> : <><div className="p-1 bg-green-100 rounded text-green-600"><Icons.Whatsapp /></div><span>WhatsApp</span></>}
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOrderModeDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isOrderModeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOrderModeDropdownOpen(false)} />
                <div className="absolute left-1 right-1 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                  <button onClick={() => { if (restaurant.orderMode !== "whatsapp") toggleOrderMode(); setIsOrderModeDropdownOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${restaurant.orderMode === "whatsapp" ? "bg-green-50/50" : ""}`}>
                    <span className="text-green-600"><Icons.Whatsapp /></span>
                    <span className={restaurant.orderMode === "whatsapp" ? "font-bold text-gray-800" : "text-gray-600"}>WhatsApp</span>
                    {restaurant.orderMode === "whatsapp" && <span className="ml-auto text-green-600 font-bold">✓</span>}
                  </button>
                  <button onClick={async () => {
                    if (!restaurant.billing) { setIsOrderModeDropdownOpen(false); setActiveTab("billing"); }
                    else { if (restaurant.orderMode !== "billing") await toggleOrderMode(); setIsOrderModeDropdownOpen(false); setActiveTab("tables"); }
                  }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t border-gray-50 ${restaurant.orderMode === "billing" ? "bg-indigo-50/50" : ""} ${!restaurant.billing ? "opacity-80" : "hover:bg-gray-50"}`}>
                    <span className={!restaurant.billing ? "text-gray-400" : "text-indigo-600"}><Icons.plate /></span>
                    <div className="flex flex-col items-start">
                      <span className={restaurant.orderMode === "billing" ? "font-bold text-gray-800" : "text-gray-600"}>Billing App</span>
                      {!restaurant.billing && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">Premium</span>}
                    </div>
                    {restaurant.billing && restaurant.orderMode === "billing" && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
                    {!restaurant.billing && <span className="ml-auto text-gray-400 text-xs border border-gray-300 rounded px-1.5 py-0.5"><Icons.Lock /></span>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
              <Icons.Logout /><span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Download App */}
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <a
            href="https://expo.dev/artifacts/eas/gwxd3PqU1VzrxrR52E3gMo.apk"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
          >
            <Smartphone size={20} className="shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-bold">Download Admin App</span>
              <span className="text-[10px] text-orange-100 font-medium">Android APK · v1.0.0</span>
            </div>
            <svg className="w-4 h-4 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>

        {/* Current Plan badge */}
        <div className="p-4 border-t border-gray-100">
          <div className={`p-4 rounded-xl border ${daysLeft !== null && daysLeft <= 7 ? "bg-red-50 border-red-100" : "bg-gradient-to-r from-orange-100 to-orange-50 border-orange-100"}`}>
            <div className="flex justify-between items-center mb-1">
              <p className={`text-xs font-bold uppercase ${daysLeft !== null && daysLeft <= 7 ? "text-red-800" : "text-orange-800"}`}>Current Plan</p>
              {daysLeft !== null && <span className={`text-[10px] px-2 py-0.5 rounded-full ${daysLeft <= 7 ? "bg-red-200 text-red-800" : "bg-orange-200 text-orange-800"}`}>{daysLeft <= 0 ? "Expired" : `${daysLeft} Days Left`}</span>}
            </div>
            <p className={`text-sm font-bold mb-1 ${daysLeft !== null && daysLeft <= 7 ? "text-red-900" : "text-orange-900"}`}>
              {restaurant.membership_level === 1 ? "Free Tier" : restaurant.membership_level === 2 ? "Pro Tier" : "Pro Plan"}
            </p>
            {restaurant.membership_level !== 3 && (
              <button onClick={() => setShowUpgrade(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition">
                {daysLeft !== null && daysLeft <= 0 ? "Renew Now" : "Unlock More Features"}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Icons.Hamburger /></button>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 capitalize truncate max-w-[200px] sm:max-w-none">{tabTitle}</h1>
              {activeTab === "overview" && <span className="text-xs text-gray-500 hidden sm:block">Manage {restaurant.name}'s digital presence</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sound toggle — only when billing active */}
            {restaurant.billing && (
              <button id="sound-toggle" onClick={unlockAudio} className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors shadow-sm border ${soundEnabled ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-300"}`} title="Toggle sound">
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <span className="text-xs font-bold hidden sm:inline">{soundEnabled ? "Sound On" : "Sound Off"}</span>
              </button>
            )}

            {/* Live/Closed toggle — only when billing active */}
            {restaurant.billing && (
              <button id="live-toggle" onClick={toggleLiveStatus} disabled={isTogglingLive} className={`flex items-center gap-3 px-1.5 py-1.5 rounded-full border transition-all duration-300 ${isLive ? "bg-green-50 border-green-200 pr-4" : "bg-gray-100 border-gray-200 pr-4"}`}>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 flex items-center ${isLive ? "bg-green-500" : "bg-gray-400"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all duration-300 ${isLive ? "left-5" : "left-1"}`}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${isLive ? "text-green-600" : "text-gray-500"}`}>{isLive ? "Restaurant Live" : "Ordering Closed"}</span>
              </button>
            )}

            {/* Notification bell — only when billing active */}
            {restaurant.billing && (
              <div id="notification-bell" className="relative cursor-pointer p-1">
                <Bell className="text-gray-500 hover:text-orange-500 transition" size={22} />
                {(newOrderQueue.length + newDeliveryQueue.length) > 0 && (
                  <span className="absolute -top-0 -right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center">
                    {newOrderQueue.length + newDeliveryQueue.length}
                  </span>
                )}
              </div>
            )}

            {/* Tour button */}
            <button onClick={startMenuTour} className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors">
              <span>👋 Tour</span>
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">{restaurant.name ? restaurant.name.charAt(0).toUpperCase() : "R"}</div>
              <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">{restaurant.name || "Restaurant"}</span>
            </div>
          </div>
        </header>

        {/* Audio blocked banner */}
        {isAudioBlocked && (
          <div className="bg-red-500 text-white p-3 text-center text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md z-50" onClick={unlockAudio}>
            <AlertTriangle size={18} className="animate-bounce" /><span>Tap here to enable notifications!</span>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
          <div className="max-w-6xl mx-auto pb-20">
            {message && <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center shadow-sm"><span className="mr-2">✅</span>{message}</div>}
            {error && <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center shadow-sm"><span className="mr-2">⚠️</span>{error}</div>}

            {activeTab === "overview" && <OverviewTab existingItems={existingItems} membershipLimits={membershipLimits} restaurant={restaurant} restaurantId={restaurantId} token={token} setActiveTab={setActiveTab} setShowItemForm={setShowItemForm} setShowPopup={setShowPopup} offers={offers} setOffers={setOffers} navigate={navigate} triggerAction={triggerAction} handleOptionClick={handleOptionClick} />}
            {activeTab === "menu" && <MenuManagerTab existingItems={existingItems} orderedMenuGroups={orderedMenuGroups} allCategories={allCategories} itemForm={itemForm} setItemForm={setItemForm} customCategory={customCategory} setCustomCategory={setCustomCategory} showItemForm={showItemForm} setShowItemForm={setShowItemForm} formRef={formRef} handleItemChange={handleItemChange} handleImageChange={handleImageChange} addItemToList={addItemToList} handleUpdate={handleUpdate} handleDelete={handleDelete} handleEditItem={handleEditItem} openCategory={openCategory} setOpenCategory={setOpenCategory} setShowReorderModal={setShowReorderModal} />}
            {activeTab === "qr" && <QRTab restaurantId={restaurantId} membership_level={restaurant.membership_level} />}
            {activeTab === "settings" && <SettingsTab />}
            {activeTab === "uploads" && <BulkImportTab isLoading={isLoading} triggerAction={triggerAction} navigate={navigate} />}
            {activeTab === "tables" && <TablesTab billingEnabled={restaurant.billing} totalTables={totalTables} billingData={billingData} orders={orders} isRestrictedMode={isRestrictedMode} getSeatedTime={getSeatedTime} setActiveTab={setActiveTab} openAddDishModal={openAddDishModal} updateTableCount={updateTableCount} />}
            {activeTab === "orders" && <OrdersTab billingEnabled={restaurant.billing} orders={orders} todaysRevenue={todaysRevenue} activeOrdersCount={activeOrdersCount} occupiedTablesCount={occupiedTablesCount} pendingOrdersCount={pendingOrdersCount} setSelectedOrderView={setSelectedOrderView} printKOT={printKOT} />}
            {activeTab === "billing" && <BillingTab billingEnabled={restaurant.billing} billingData={billingData} taxRate={taxRate} discountRate={discountRate} additionalCharges={additionalCharges} handleTaxChange={handleTaxChange} handleDiscountChange={handleDiscountChange} handleChargesChange={handleChargesChange} calculateTotals={calculateTotals} getAggregatedTableItems={getAggregatedTableItems} handleInitiateClear={handleInitiateClear} sendWhatsAppBill={sendWhatsAppBill} printBill={printBill} />}
            {activeTab === "delivery" && <DeliveryTab billingEnabled={restaurant.billing} />}
            {activeTab === "history" && <HistoryTab billingEnabled={restaurant.billing} filteredHistory={filteredHistory} earningsStats={earningsStats} loadingHistory={loadingHistory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeFilter={activeFilter} setActiveFilter={setActiveFilter} setSelectedHistoryView={setSelectedHistoryView} printBill={printBill} getAggregatedTableItems={getAggregatedTableItems} />}
            {activeTab === "notifications" && <NotificationsTab billingEnabled={restaurant.billing} />}
          </div>
        </div>

        {/* Category reorder modal */}
        <CategoryReorderModal isOpen={showReorderModal} onClose={() => setShowReorderModal(false)} categories={orderedMenuGroups.map(g => g.category)} onSave={handleSaveCategoryOrder} />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
              <span className="font-bold text-gray-800 text-lg">Processing...</span>
            </div>
          </div>
        )}
      </main>

      {/* ── Modals (rendered at root so they overlay all tabs) ─────────────── */}

      {/* Admin POS: Add Dish Modal */}
      {addDishModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div><h3 className="font-extrabold text-xl text-gray-800">Add Items</h3><p className="text-sm text-gray-500">Adding to <strong>Table {addDishModal.tableNumber}</strong></p></div>
              <button onClick={() => setAddDishModal({ isOpen: false, tableNumber: null })} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-4 border-b border-gray-100 flex gap-2 bg-white">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-3 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search menu..." value={menuSearch} onChange={e => setMenuSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <select value={posCategory} onChange={e => setPosCategory(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-600">
                {menuCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
              {filteredMenu.map(item => {
                const qty = adminCart[item._id] || 0;
                return (
                  <div key={item._id} className={`bg-white p-3 rounded-xl border shadow-sm flex flex-col justify-between ${qty > 0 ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-100"}`}>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">₹{item.price}</p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      {qty === 0
                        ? <button onClick={() => updateAdminCart(item._id, 1)} className="w-full py-1.5 bg-gray-100 hover:bg-orange-50 text-orange-600 font-bold text-xs rounded-lg transition">ADD</button>
                        : <div className="flex items-center bg-orange-50 rounded-lg w-full justify-between px-1 py-1">
                            <button onClick={() => updateAdminCart(item._id, -1)} className="p-1 text-orange-700 hover:bg-orange-200 rounded"><Minus size={14} /></button>
                            <span className="text-sm font-bold text-orange-700">{qty}</span>
                            <button onClick={() => updateAdminCart(item._id, 1)} className="p-1 text-orange-700 hover:bg-orange-200 rounded"><Plus size={14} /></button>
                          </div>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.keys(adminCart).length > 0 && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">{Object.values(adminCart).reduce((a, b) => a + b, 0)} Items Selected</span>
                  <span className="text-xl font-extrabold text-gray-900">₹{Object.entries(adminCart).reduce((s, [id, q]) => s + (existingItems.find(m => m._id === id)?.price || 0) * q, 0)}</span>
                </div>
                <button onClick={submitAdminOrder} className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg">Confirm Order</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settle Bill Modal */}
      {settleTableData && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-900 px-6 py-5 flex justify-between items-center">
              <h2 className="text-white font-bold text-xl">Settle Bill</h2>
              <button onClick={() => setSettleTableData(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 text-center">
                <p className="text-gray-500 mb-1">Total Payable Amount</p>
                <h2 className="text-4xl font-extrabold text-gray-900">₹{(() => { const { total } = calculateTotals(settleTableData.subTotal); return total.toFixed(2); })()}</h2>
              </div>
              <p className="text-gray-600 font-bold mb-4 text-sm uppercase tracking-wide">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleConfirmClear("Cash")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition group"><Banknote size={32} className="text-gray-400 group-hover:text-green-600 mb-2" /><span className="text-sm font-bold text-gray-600 group-hover:text-green-700">Cash</span></button>
                <button onClick={() => handleConfirmClear("UPI")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition group"><Smartphone size={32} className="text-gray-400 group-hover:text-blue-600 mb-2" /><span className="text-sm font-bold text-gray-600 group-hover:text-blue-700">UPI</span></button>
                <button onClick={() => handleConfirmClear("Card")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition group"><CreditCard size={32} className="text-gray-400 group-hover:text-purple-600 mb-2" /><span className="text-sm font-bold text-gray-600 group-hover:text-purple-700">Card</span></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Table Order Popup */}
      {newOrderPopup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3"><Bell className="animate-bounce" fill="white" color="white" /><h2 className="text-white font-bold text-xl">New Table Order</h2></div>
              <button onClick={closePopup} className="text-white/80 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                <div><p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Table Number</p><p className="text-4xl font-extrabold text-gray-800">{newOrderPopup.tableNumber}</p></div>
                <p className="font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg text-sm">{new Date(newOrderPopup.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 mb-8 max-h-56 overflow-y-auto border border-gray-100">
                {newOrderPopup.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-0 items-center">
                    <span className="font-bold text-gray-700 text-base">{item.quantity} <span className="text-gray-400 text-sm font-normal">x</span> {item.itemId?.name}</span>
                    <span className="text-gray-500 font-medium">₹{item.price || 0}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={handleRejectOrder} disabled={isAccepting} className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2 border border-red-200"><XCircle size={20} /> <span className="hidden sm:inline">Reject</span></button>
                <button onClick={() => printKOT(newOrderPopup)} className="flex-1 py-4 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 border border-blue-200"><Printer size={20} /> <span className="hidden sm:inline">Print</span></button>
                <button onClick={handleAcceptOrder} disabled={isAccepting} className="flex-[2] py-4 bg-gray-900 text-white font-bold rounded-xl shadow-xl hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70">
                  {isAccepting ? <span className="animate-pulse">Processing...</span> : <><CheckCircle size={20} /> Accept</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Delivery Order Popup */}
      {newDeliveryPopup && !newOrderPopup && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3"><Bike className="animate-bounce" color="white" /><h2 className="text-white font-bold text-xl">New Delivery Order</h2></div>
              <button onClick={closePopup} className="text-white/80 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="bg-green-50 p-3 rounded-full text-green-600"><MapPin size={24} /></div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{newDeliveryPopup.customer.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{newDeliveryPopup.customer.address}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm font-medium text-blue-600"><Phone size={14} /> {newDeliveryPopup.customer.phone}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 mb-8 max-h-56 overflow-y-auto border border-gray-100">
                {newDeliveryPopup.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-0 items-center">
                    <span className="font-bold text-gray-700 text-base">{item.quantity} <span className="text-gray-400 text-sm font-normal">x</span> {item.name}</span>
                    <span className="text-gray-500 font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 font-bold text-gray-900 text-lg"><span>Total Bill</span><span>₹{newDeliveryPopup.totalAmount}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleRejectDelivery} disabled={isAccepting} className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition border border-red-200 flex items-center justify-center gap-1"><XCircle size={18} /> Reject</button>
                <button onClick={closePopup} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Later</button>
                <button onClick={handleAcceptDelivery} disabled={isAccepting} className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-xl shadow-xl hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70">
                  {isAccepting ? <span className="animate-pulse">Processing...</span> : <><CheckCircle size={20} /> Accept Delivery</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderView && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-gray-800 font-bold text-lg">Order Details</h3>
              <button onClick={() => setSelectedOrderView(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {selectedOrderView.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <div className="flex items-center gap-3"><span className="font-bold text-gray-800">{item.quantity}x</span><span className="text-gray-600">{item.itemId?.name}</span></div>
                    <span className="font-medium text-gray-800">₹{item.price}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedOrderView(null)} className="w-full mt-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* History Bill View Modal */}
      {selectedHistoryView && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-orange-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Full Bill Preview</h3>
              <button onClick={() => setSelectedHistoryView(null)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex justify-between text-sm text-gray-500 mb-4"><span>Invoice: #{selectedHistoryView.invoiceNumber.slice(-6)}</span><span>{new Date(selectedHistoryView.timestamp).toLocaleString()}</span></div>
              <div className="space-y-2 mb-4 max-h-56 overflow-y-auto border-t border-b border-gray-100 py-4">
                {getAggregatedTableItems(selectedHistoryView.orders).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm"><span className="text-gray-800">{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span><span className="font-bold text-gray-800">₹{item.total.toFixed(2)}</span></div>
                ))}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{(selectedHistoryView.subTotal || selectedHistoryView.totalAmount).toFixed(2)}</span></div>
                {selectedHistoryView.taxAmount > 0 && <div className="flex justify-between"><span>Tax ({selectedHistoryView.taxRate}%)</span><span>+₹{selectedHistoryView.taxAmount.toFixed(2)}</span></div>}
                {selectedHistoryView.additionalCharges > 0 && <div className="flex justify-between"><span>Extra Charges</span><span>+₹{selectedHistoryView.additionalCharges.toFixed(2)}</span></div>}
                {selectedHistoryView.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{selectedHistoryView.discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 mt-2 border-t border-dashed border-gray-300"><span>Final Total</span><span>₹{(selectedHistoryView.finalTotal || selectedHistoryView.totalAmount).toFixed(2)}</span></div>
                <div className="text-right mt-2 text-xs font-bold text-gray-400 uppercase">Paid via {selectedHistoryView.paymentMethod}</div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => printBill(selectedHistoryView.tableNumber, selectedHistoryView.orders, selectedHistoryView.subTotal || selectedHistoryView.totalAmount)} className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Printer size={18} /> Reprint</button>
                <button onClick={() => setSelectedHistoryView(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnifiedDashboard;
