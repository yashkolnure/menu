import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Package, MapPin, Phone, CheckCircle, XCircle, 
  Truck, Navigation, RefreshCw, TrendingUp, AlertCircle,
  Calendar, Search, Eye, X, Banknote, Printer, MessageCircle,
  Users, LayoutGrid, ArrowRight
} from "lucide-react";

// ✅ Sound File
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"; 

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurantId");

  // --- STATE ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'customers'
  const [filter, setFilter] = useState("Today"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const prevOrderCountRef = useRef(0);
  const audio = new Audio(NOTIFICATION_SOUND_URL);

  // --- WHATSAPP HELPER ---
  const openWhatsApp = (name, phone, orderId = null) => {
    if (!phone) return;
    const cleanNumber = phone.replace(/\D/g, '').slice(-10);
    const fullNumber = `91${cleanNumber}`;
    
    let message = `Hello ${name}, greetings from our restaurant!`;
    if (orderId) {
        message = `Hello ${name}, regarding your order #${orderId.slice(-6).toUpperCase()}...`;
    }
    
    const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // --- PRINT FUNCTIONS ---
  const printKOT = (order) => {
    const html = `
      <html>
        <body style="font-family:monospace;width:250px;margin:0 auto;text-align:center;">
          <h2 style="margin-bottom:5px;">DELIVERY KOT</h2>
          <h3 style="border-bottom:2px dashed black;padding-bottom:10px;">ID: #${order._id.slice(-6).toUpperCase()}</h3>
          <p style="font-weight:bold;">${order.customer.name}</p>
          <p>${new Date(order.createdAt).toLocaleTimeString()}</p>
          <hr style="border-top:1px dashed black;"/>
          <div style="text-align:left;font-size:16px;font-weight:bold;">
            ${order.items.map(item => `
              <div style="margin-bottom:10px;display:flex;justify-content:space-between;">
                <span>${item.quantity} x</span>
                <span>${item.name}</span>
              </div>`).join('')}
          </div>
          <hr style="border-top:1px dashed black;"/>
          <p>Type: Delivery</p>
        </body>
      </html>`;
    const win = window.open("", "", "width=300,height=600");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const printBill = (order) => {
    const html = `
      <html>
        <body style="font-family:monospace;width:280px;margin:0 auto;text-align:center;">
          <h3>Restaurant Delivery</h3>
          <p>${new Date(order.createdAt).toLocaleString()}</p>
          <p>Order #${order._id.slice(-6).toUpperCase()}</p>
          <hr style="border-top:1px dashed black;"/>
          <p style="text-align:left;"><b>Customer:</b> ${order.customer.name}<br/>${order.customer.phone}<br/>${order.customer.address}</p>
          <hr style="border-top:1px dashed black;"/>
          <table style="width:100%;font-size:12px;">
            <tr><th style="text-align:left">Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th></tr>
            ${order.items.map(item => `
              <tr>
                <td style="text-align:left">${item.name}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>`).join('')}
          </table>
          <hr style="border-top:1px dashed black;"/>
          <div style="text-align:right;">
            <h3>Total: ₹${order.totalAmount}</h3>
          </div>
          <hr style="border-top:1px dashed black;"/>
          <p>Thank you for ordering!</p>
        </body>
      </html>`;
    const win = window.open("", "", "width=300,height=600");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  // --- FILTER LOGIC ---
  const getFilteredOrders = () => {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      let matchDate = true;
      if (filter === "Today") matchDate = orderDate >= todayStart;
      else if (filter === "7 Days") {
        const d = new Date(); d.setDate(now.getDate() - 7);
        matchDate = orderDate >= d;
      } else if (filter === "Month") {
        const d = new Date(); d.setMonth(now.getMonth() - 1);
        matchDate = orderDate >= d;
      }

      const matchSearch = 
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery) ||
        order._id.slice(-6).toLowerCase().includes(searchQuery.toLowerCase());

      return matchDate && matchSearch;
    });
  };

  // --- CUSTOMER EXTRACTION LOGIC ---
  const getUniqueCustomers = () => {
    const customerMap = new Map();
    orders.forEach(order => {
        const phone = order.customer.phone;
        if (!customerMap.has(phone)) {
            customerMap.set(phone, {
                name: order.customer.name,
                phone: order.customer.phone,
                address: order.customer.address,
                lastOrder: order.createdAt,
                totalOrders: 1,
                totalSpent: order.totalAmount || 0
            });
        } else {
            const existing = customerMap.get(phone);
            existing.totalOrders += 1;
            existing.totalSpent += (order.totalAmount || 0);
            if (new Date(order.createdAt) > new Date(existing.lastOrder)) {
                existing.lastOrder = order.createdAt;
                existing.address = order.customer.address; 
            }
        }
    });
    return Array.from(customerMap.values()).filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    );
  };

  const filteredOrders = getFilteredOrders();
  const customersList = getUniqueCustomers();

  // --- STATS ---
  const pendingCount = filteredOrders.filter(o => o.status === 'Pending').length;
  const outForDeliveryCount = filteredOrders.filter(o => o.status === 'Out for Delivery').length;
  const deliveredCount = filteredOrders.filter(o => o.status === 'Delivered').length;
  const revenueTotal = filteredOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  // --- HELPER: Status Badge ---
  const getStatusBadge = (status) => {
    const styles = {
      "Pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Confirmed": "bg-blue-100 text-blue-700 border-blue-200",
      "Out for Delivery": "bg-purple-100 text-purple-700 border-purple-200",
      "Delivered": "bg-green-100 text-green-700 border-green-200",
      "Cancelled": "bg-red-100 text-red-700 border-red-200",
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>{status}</span>;
  };

  // --- API CALLS ---
  const fetchOrders = async () => {
    if (!restaurantId) return;
    try {
      const res = await fetch(`/api/admin/delivery/all/${restaurantId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length > prevOrderCountRef.current && prevOrderCountRef.current !== 0) {
          toast.info("🔔 New Delivery Order!");
          audio.play().catch(e => {});
        }
        prevOrderCountRef.current = data.length;
        setOrders(data);
      }
    } catch (error) { console.error("Error fetching orders"); } 
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (newStatus === "Cancelled") {
      if (!window.confirm("Are you sure you want to REJECT this order? This cannot be undone.")) return;
    }

    try {
      const res = await fetch(`/api/admin/delivery/status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order ${newStatus}`);
        fetchOrders();
        if(selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder({...selectedOrder, status: newStatus});
        }
      } else { toast.error("Update failed"); }
    } catch (error) { toast.error("Error updating status"); }
  };

  useEffect(() => {
    if (!restaurantId) { toast.error("Session expired."); navigate("/login"); return; }
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); 
    return () => clearInterval(interval);
  }, [restaurantId, navigate]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500 font-medium animate-pulse">Loading Delivery Dashboard...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col pb-20 md:pb-0">
      
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
             <div className="flex justify-between items-center mt-1">
                 <h2 className={`text-xl font-extrabold ${pendingCount > 0 ? "text-red-500" : "text-gray-800"}`}>{pendingCount}</h2>
                 <AlertCircle size={18} className="text-gray-300"/>
             </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sending</p>
             <div className="flex justify-between items-center mt-1">
                <h2 className="text-xl font-extrabold text-purple-600">{outForDeliveryCount}</h2>
                <Truck size={18} className="text-purple-300"/>
             </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Done</p>
             <div className="flex justify-between items-center mt-1">
                <h2 className="text-xl font-extrabold text-green-600">{deliveredCount}</h2>
                <CheckCircle size={18} className="text-green-300"/>
             </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">₹ Total</p>
             <div className="flex justify-between items-center mt-1">
                <h2 className="text-xl font-extrabold text-gray-800">{revenueTotal.toFixed(0)}</h2>
                <TrendingUp size={18} className="text-blue-300"/>
             </div>
        </div>
      </div>

      {/* 2. VIEW TOGGLER & TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
         {/* Toggle View Buttons */}
         <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
             <button 
                onClick={() => setView('dashboard')} 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <LayoutGrid size={16}/> Orders
             </button>
             <button 
                onClick={() => setView('customers')} 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'customers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Users size={16}/> Customers
             </button>
         </div>

         {/* Filter Buttons (Scrollable on mobile) */}
         {view === 'dashboard' && (
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto hide-scrollbar pb-1">
                {["Today", "7 Days", "Month", "All"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex-shrink-0 ${filter === f ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>{f}</button>
                ))}
            </div>
         )}

         {/* Search */}
         <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-56">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"/>
             </div>
             <button onClick={fetchOrders} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100"><RefreshCw size={18}/></button>
         </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      
      {/* === VIEW: DASHBOARD === */}
      {view === 'dashboard' && (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10">
            {filteredOrders.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10 md:py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-orange-50 p-4 rounded-full mb-4"><Package size={32} className="text-orange-400" /></div>
                <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
            </div>
            ) : (
            filteredOrders.map((order) => (
                <div key={order._id} className={`bg-white rounded-2xl shadow-sm border flex flex-col h-full transition-all ${order.status === 'Pending' ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <span className="text-xs font-mono font-bold text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                        <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><Calendar size={10}/> {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    {getStatusBadge(order.status)}
                </div>
                
                {/* Body */}
                <div className="p-4 flex-grow">
                    <div className="flex items-start mb-4 relative">
                        <div className="bg-orange-50 p-2 rounded-lg mr-3 text-orange-500 flex-shrink-0"><MapPin size={18} /></div>
                        <div className="flex-1 pr-6">
                            <h3 className="font-bold text-gray-800 text-sm">{order.customer.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <a href={`tel:${order.customer.phone}`} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    <Phone size={10} /> {order.customer.phone}
                                </a>
                                <button onClick={() => openWhatsApp(order.customer.name, order.customer.phone, order._id)} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition" title="Chat on WhatsApp">
                                    <MessageCircle size={14}/>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{order.customer.address}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(order)} className="absolute right-0 top-0 p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Eye size={18} /></button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm border border-gray-100">
                        <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-2">
                            {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-gray-700">
                                <span className="truncate w-2/3 text-xs font-medium"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                                <span className="font-bold text-gray-800 text-xs">₹{item.price * item.quantity}</span>
                            </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-3 pt-2 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                            <span className="text-lg font-extrabold text-gray-900">₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>
                
                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <div className="px-4 pb-2 flex gap-2">
                        <button onClick={() => printKOT(order)} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Printer size={12}/> KOT</button>
                        <button onClick={() => printBill(order)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Banknote size={12}/> Bill</button>
                    </div>
                )}

                {/* Actions Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">
                    {order.status === "Pending" && (
                    <div className="flex gap-2">
                        <button onClick={() => updateStatus(order._id, "Cancelled")} className="flex-1 py-2.5 bg-white border border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 text-xs flex justify-center items-center gap-1"><XCircle size={14}/> Reject</button>
                        <button onClick={() => updateStatus(order._id, "Confirmed")} className="flex-[2] py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md text-xs flex justify-center items-center gap-1"><CheckCircle size={14}/> Accept</button>
                    </div>
                    )}
                    {order.status === "Confirmed" && (
                    <button onClick={() => updateStatus(order._id, "Out for Delivery")} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md text-xs flex justify-center items-center gap-1"><Truck size={14}/> Dispatch</button>
                    )}
                    {order.status === "Out for Delivery" && (
                    <button onClick={() => updateStatus(order._id, "Delivered")} className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md text-xs flex justify-center items-center gap-1"><Navigation size={14}/> Delivered</button>
                    )}
                    {(order.status === "Delivered" || order.status === "Cancelled") && (<div className="text-center"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Closed</span></div>)}
                </div>
                </div>
            ))
            )}
        </div>
      )}

      {/* === VIEW: MY CUSTOMERS (RESPONSIVE) === */}
      {view === 'customers' && (
        <div className="pb-10">
            {/* 1. Desktop View (Table) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-400 font-bold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">History</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customersList.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">No customers found.</td></tr>
                        ) : (
                            customersList.map((customer, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{customer.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]"><MapPin size={10} className="inline mr-1"/>{customer.address}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-700">{customer.phone}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{customer.totalOrders} Orders</div>
                                        <div className="text-xs text-green-600 font-bold">₹{customer.totalSpent.toFixed(0)} Spent</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => openWhatsApp(customer.name, customer.phone)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 hover:bg-green-100 transition"
                                        >
                                            <MessageCircle size={14}/> Message
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 2. Mobile View (Cards) - ✅ ADDED THIS */}
            <div className="md:hidden grid gap-4">
                {customersList.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium">No customers found.</div>
                ) : (
                    customersList.map((customer, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <h3 className="font-bold text-gray-900">{customer.name}</h3>
                                     <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                         <MapPin size={12}/> {customer.address}
                                     </div>
                                 </div>
                                 <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                                     ₹{customer.totalSpent}
                                 </div>
                             </div>

                             <div className="bg-gray-50 p-2 rounded-lg flex justify-between items-center text-xs text-gray-600">
                                 <div className="flex items-center gap-1 font-mono"><Phone size={12}/> {customer.phone}</div>
                                 <div className="font-bold">{customer.totalOrders} Orders</div>
                             </div>

                             <button 
                                onClick={() => openWhatsApp(customer.name, customer.phone)}
                                className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-green-700 flex items-center justify-center gap-2"
                             >
                                <MessageCircle size={16}/> Chat on WhatsApp
                             </button>
                        </div>
                    ))
                )}
            </div>
        </div>
      )}

      {/* --- DETAILS MODAL (RESPONSIVE) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                 <div><h3 className="text-lg font-extrabold text-gray-800">Order Details</h3><p className="text-xs text-gray-500 font-mono">#{selectedOrder._id}</p></div>
                 <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                 <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-xl border border-blue-100"><span className="text-sm font-bold text-blue-800">Status</span>{getStatusBadge(selectedOrder.status)}</div>

                 {/* Customer */}
                 <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer</h4>
                    <div className="flex items-start gap-4">
                       <div className="bg-orange-100 p-3 rounded-full text-orange-600"><MapPin size={20}/></div>
                       <div>
                          <p className="font-bold text-gray-800 text-lg">{selectedOrder.customer.name}</p>
                          <div className="flex items-center gap-3 mt-1 mb-1">
                              <a href={`tel:${selectedOrder.customer.phone}`} className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                                <Phone size={14}/> {selectedOrder.customer.phone}
                              </a>
                              <button onClick={() => openWhatsApp(selectedOrder.customer.name, selectedOrder.customer.phone, selectedOrder._id)} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 border border-green-200">
                                <MessageCircle size={14}/> WhatsApp
                              </button>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{selectedOrder.customer.address}</p>
                       </div>
                    </div>
                 </div>

                 {/* Items */}
                 <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                       {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-0">
                             <div className="flex items-center gap-3"><span className="bg-white border border-gray-200 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm text-gray-700">{item.quantity}</span><span className="font-medium text-gray-700">{item.name}</span></div>
                             <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500"><Banknote size={20}/> <span className="text-sm font-medium">Total Amount</span></div>
                    <span className="text-2xl font-extrabold text-gray-900">₹{selectedOrder.totalAmount}</span>
                 </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                 {selectedOrder.status === "Pending" && (
                    <div className="flex gap-3 mb-1">
                        <button onClick={() => updateStatus(selectedOrder._id, "Cancelled")} className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition shadow-sm flex items-center justify-center gap-2">
                           <XCircle size={18}/> Reject Order
                        </button>
                        <button onClick={() => updateStatus(selectedOrder._id, "Confirmed")} className="flex-[2] py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md transition flex items-center justify-center gap-2">
                           <CheckCircle size={18}/> Accept Order
                        </button>
                    </div>
                 )}
                 
                 {/* HIDE BUTTONS IF CANCELLED OR DELIVERED IN MODAL TOO */}
                 {selectedOrder.status !== "Cancelled" && selectedOrder.status !== "Delivered" && (
                   <div className="flex gap-3">
                      <button onClick={() => printKOT(selectedOrder)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"><Printer size={16}/> Print KOT</button>
                      <button onClick={() => printBill(selectedOrder)} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition flex items-center justify-center gap-2"><Banknote size={16}/> Print Bill</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default DeliveryDashboard;