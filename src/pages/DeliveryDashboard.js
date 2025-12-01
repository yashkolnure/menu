import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Package, MapPin, Phone, Clock, CheckCircle, XCircle, 
  Truck, Navigation, RefreshCw, TrendingUp, AlertCircle,
  Calendar, Search, Eye, X, Banknote, Printer, MessageCircle // ✅ Added MessageCircle
} from "lucide-react";

// ✅ Sound File
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"; 

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurantId");

  // --- STATE ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Today"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const prevOrderCountRef = useRef(0);
  const audio = new Audio(NOTIFICATION_SOUND_URL);

  // --- 🆕 WHATSAPP HELPER ---
  const openWhatsApp = (order) => {
    if (!order?.customer?.phone) return;
    
    // Ensure we only have digits and take last 10, then prepend 91
    const cleanNumber = order.customer.phone.replace(/\D/g, '').slice(-10);
    const fullNumber = `91${cleanNumber}`;
    
    const message = `Hello ${order.customer.name}, regarding your order #${order._id.slice(-6).toUpperCase()}...`;
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

  const filteredOrders = getFilteredOrders();

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
        if(selectedOrder && selectedOrder._id === orderId) setSelectedOrder({...selectedOrder, status: newStatus});
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
    <div className="space-y-6 h-full flex flex-col">
      
      {/* 1. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p><h2 className={`text-2xl font-extrabold mt-1 ${pendingCount > 0 ? "text-red-500" : "text-gray-800"}`}>{pendingCount}</h2></div>
             <div className={`p-3 rounded-xl ${pendingCount > 0 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400"}`}><AlertCircle size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">On The Way</p><h2 className="text-2xl font-extrabold text-purple-600 mt-1">{outForDeliveryCount}</h2></div>
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Truck size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivered</p><h2 className="text-2xl font-extrabold text-green-600 mt-1">{deliveredCount}</h2></div>
             <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue</p><h2 className="text-2xl font-extrabold text-gray-800 mt-1">₹{revenueTotal.toFixed(0)}</h2></div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {["Today", "7 Days", "Month", "All"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${filter === f ? "bg-gray-900 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>{f}</button>
            ))}
         </div>
         <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"/>
             </div>
             <button onClick={fetchOrders} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100"><RefreshCw size={20}/></button>
         </div>
      </div>

      {/* 3. ORDER GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10">
        {filteredOrders.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="bg-orange-50 p-4 rounded-full mb-4"><Package size={40} className="text-orange-400" /></div>
             <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
           </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className={`bg-white rounded-2xl shadow-sm border flex flex-col h-full transition-all hover:shadow-md ${order.status === 'Pending' ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'}`}>
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Calendar size={10}/> {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div className="p-5 flex-grow">
                <div className="flex items-start mb-5 relative">
                  <div className="bg-orange-50 p-2.5 rounded-xl mr-3 text-orange-500 flex-shrink-0"><MapPin size={20} /></div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-bold text-gray-800 text-sm">{order.customer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <a href={`tel:${order.customer.phone}`} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                            <Phone size={10} /> {order.customer.phone}
                        </a>
                        {/* 🆕 WhatsApp Button in Card */}
                        <button onClick={() => openWhatsApp(order)} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition" title="Chat on WhatsApp">
                            <MessageCircle size={14}/>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{order.customer.address}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(order)} className="absolute right-0 top-0 p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Eye size={18} /></button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-sm border border-gray-100">
                  <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-2">
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
              
              <div className="px-4 pb-2 flex gap-2">
                 <button onClick={() => printKOT(order)} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Printer size={12}/> KOT</button>
                 <button onClick={() => printBill(order)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Banknote size={12}/> Bill</button>
              </div>

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

      {/* --- 4. DETAILS MODAL --- */}
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
                              {/* 🆕 WhatsApp Button in Modal */}
                              <button onClick={() => openWhatsApp(selectedOrder)} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 border border-green-200">
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
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                 <button onClick={() => printKOT(selectedOrder)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"><Printer size={16}/> Print KOT</button>
                 <button onClick={() => printBill(selectedOrder)} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition flex items-center justify-center gap-2"><Banknote size={16}/> Print Bill</button>
              </div>
           </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default DeliveryDashboard;