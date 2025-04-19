import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [menu, setMenu] = useState([]);
  const [newOrderPopup, setNewOrderPopup] = useState(null); // for popup
  const latestOrderIdsRef = useRef([]);
  const [orders, setOrders] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({ name: "", logo: "", address: "", contact: "" });
  const [newOrderQueue, setNewOrderQueue] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const RestaurantContext = createContext();

  const [newDish, setNewDish] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: "", // base64
    imagePreview: "", // for showing preview only
  });
  const audioRef = useRef(null);

  
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDish((prev) => ({
        ...prev,
        image: reader.result, // base64
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }
};
  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");
  if (audioRef.current) {
    audioRef.current.play().catch((err) => {
      console.warn("🔇 Unable to play audio automatically:", err);
    });
  }
  const fetchRestaurantDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${restaurantId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();
      setRestaurantDetails(data); // <-- This is the correct line
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };
  useEffect(() => {
    fetchRestaurantDetails();
    console.log(restaurantDetails)
  }, []);
  
  // Fetch Menu
  const fetchMenu = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${restaurantId}/menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        setMenu(data);
      } else {
        console.error("Failed to fetch menu:", data.message);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    let interval;
  
    const fetchBilling = async () => {
      if (restaurantId && token) {
        await fetchBillingData(); // make sure this function exists
      }
    };
  
    if (activeTab === "billing") {
      fetchBilling(); // Initial call
      interval = setInterval(fetchBilling, 5000); // Refresh every 5s
    }
  
    return () => clearInterval(interval); // Cleanup
  }, [activeTab, restaurantId, token]);
  

  useEffect(() => {
    let interval;
  
    return () => clearInterval(interval);
  }, [activeTab, restaurantId, token]);
  
  // Fetch Billing Data
  const fetchBillingData = async () => {
    const res = await fetch(`http://localhost:5000/api/admin/${restaurantId}/billing`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBillingData(data);
  };

  useEffect(() => {
    let intervalId;
  
    const fetchOrderHistory = async () => {
      setLoadingHistory(true); // move here so UI shows loading
      try {
        const res = await fetch(`/api/orders/${restaurantId}/order-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
        setOrderHistory(data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
  
    if (activeTab === "history" && restaurantId && token) {
      fetchOrderHistory(); // fetch immediately
      intervalId = setInterval(() => {
        fetchOrderHistory(); // fetch every 10 sec
      }, 10000);
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId); // cleanup when tab changes
    };
  }, [activeTab, restaurantId, token]);
  
// Group by invoiceNumber first
const groupedOrdersMap = {};

orderHistory.forEach((order) => {
  if (!groupedOrdersMap[order.invoiceNumber]) {
    groupedOrdersMap[order.invoiceNumber] = {
      ...order,
      orderItems: [...order.orderItems],
    };
  } else {
    // If already present, merge items and total
    groupedOrdersMap[order.invoiceNumber].orderItems.push(...order.orderItems);
    groupedOrdersMap[order.invoiceNumber].totalAmount += order.totalAmount;
  }
});

// Convert object to array
const groupedOrders = Object.values(groupedOrdersMap);
const filteredOrders = groupedOrders.filter((order) => {
  const matchQuery =
    order.invoiceNumber.includes(searchQuery) ||
    order.tableNumber.toString().includes(searchQuery) ||
    order.orderItems.some((item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const now = new Date();
  const orderDate = new Date(order.timestamp);

  const matchDate =
    activeFilter === "Today"
      ? orderDate.toDateString() === now.toDateString()
      : activeFilter === "This Week"
      ? new Date(now - 7 * 24 * 60 * 60 * 1000) <= orderDate
      : true;

  return matchQuery && matchDate;
});
      
  const printBill = (tableNumber) => {
    // Find the data for the specific table number
    const data = billingData.find((item) => item.tableNumber === tableNumber);
  
    if (!data) {
      alert("No data found for the given table number.");
      return;
    }
  
    // Generate the order table HTML content dynamically
    const orders = Array.isArray(data.orders) ? data.orders : [];
  
    const totalOrders = orders.reduce((total, order) => total + (order.items ? order.items.length : 0), 0);
    const subTotal = data.totalAmount ? data.totalAmount.toFixed(2) : "0.00";
    const totalAmount = data.totalAmount ? data.totalAmount.toFixed(2) : "0.00";
  

    // Generate the order table HTML
    const orderTableHTML = orders.map((order, data) => {
      return order.items.map((item) => {
        return `
          <tr>
            <td>${item.itemId?.name || "Deleted Item"}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">₹${item.price ? item.price.toFixed(2) : "N/A"}</td>
          </tr>
        `;
      }).join(""); // Join all items into a single string
    }).join(""); // Join all orders into a single string
    const billHTML = `
    <html>
      <head>
        <title>Bill - Table ${data.tableNumber}</title>
        <style>
          @page {
        size: 2in auto;
        margin: 0;
      }
      body {
        font-family: arial;
        font-size: 9px;
        text-align: center;
        margin: 0;
        padding: 0;
      }
      .bill-container {
        margin: 0 auto;
        padding: 0;
        overflow-wrap: break-word;
      }
      .logo {
        width: 60px;
        height: auto;
        display: block;
        margin: 5px auto;
      }
      hr {
        border: none;
        border-top: 1px dashed black;
        margin: 4px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9px;
        table-layout: fixed;
      }
      th, td {
        padding: 2px 0;
        word-break: break-word;
      }
      th.item, td.item {
        width: 50%;
        text-align: left;
      }
      th.qty, td.qty {
        width: 20%;
        text-align: center;
      }
      th.total, td.total {
        width: 30%;
        text-align: right;
      }
      .summary-table {
        width: 100%;
        margin-top: 4px;
      }
      .summary-table td {
        white-space: nowrap;
        padding: 2px 0;
      }
      .summary-label {
        text-align: left;
      }
      .summary-value {
        text-align: right;
      }
        </style>
      </head>
      <body>
        <div class="bill-container">
          ${restaurantDetails.logo ? `<img src="${restaurantDetails.logo}" class="logo" />` : ''}
          <h3>${restaurantDetails.name || 'Restaurant Name'}</h3>
          <p>${restaurantDetails.address || ''}</p>
          <p>${restaurantDetails.contact || ''}</p>
          <hr />
          <p><strong>Table:</strong> ${data.tableNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <table>
            <thead>
              <tr>
                <th class="item">Item</th>
                <th class="qty">Qty</th>
                <th class="summary">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderTableHTML}
            </tbody>
          </table>
          <hr />
          <p class="summary">Orders: ${totalOrders}</p>
          <p class="summary">Subtotal: ₹${subTotal}</p>
          <p class="summary">TOTAL: ₹${totalAmount}</p>
          <hr />
          <p>Thank You!  Visit Again!</p>
        </div>
      </body>
    </html>
    `;
         
    // Open a new window and insert the bill HTML
    const printWindow = window.open("", "_blank", "width=250,height=auto");
    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();
  };
  
  const fetchOrders = async () => {
    const res = await fetch(`http://localhost:5000/api/admin/${restaurantId}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data);
  
    const previousIds = latestOrderIdsRef.current;
    const currentIds = data.map(order => order._id);
    const newOrders = data.filter(order => !previousIds.includes(order._id));
  
    if (newOrders.length > 0) {
      setNewOrderQueue(prev => [...prev, ...newOrders]);
  
      // Show popup only if none is currently visible
      if (!newOrderPopup) {
        const nextOrder = newOrders[0];
        setNewOrderPopup(nextOrder);
        setNewOrderQueue(prev => prev.slice(1));
      }
    }
  
    latestOrderIdsRef.current = currentIds;
  
    // (Optional) If you do billing grouping below:
    const groupedOrders = groupOrdersByTable(data);
    const totalBillingData = calculateBillingData(groupedOrders);
    setBillingData(totalBillingData);
  };
  
  useEffect(() => {
    fetchMenu();
    fetchOrders();
    fetchOrderHistory();
  
    // 🔄 Auto-refresh orders every 10 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 1000); // 1,000ms = 10s
  
    // Cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);
  
// Accept Button
const handleAccept = () => {
  if (newOrderQueue.length > 0) {
    const next = newOrderQueue[0];
    setNewOrderPopup(next);
    setNewOrderQueue(prev => prev.slice(1));
  } else {
    setNewOrderPopup(null);
  }
};

const totalSalesFromHistory = filteredOrders.reduce(
  (sum, order) => sum + (order.totalAmount || 0),
  0
);


  // Handle Add Dish
  const handleAddDish = async () => {
    if (!newDish.name || !newDish.category || !newDish.price || !newDish.image) {
      alert("Please fill in all fields before adding the dish.");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${restaurantId}/menu`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...newDish, 
          price: parseFloat(newDish.price) 
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Refresh the menu list
        fetchMenu();
  
        // Clear form fields
        setNewDish({ name: "", category: "", description: "", price: "", image: "" });
  
        alert("✅ Dish added successfully!");
      } else {
        alert(data.message || "❌ Failed to add dish.");
      }
    } catch (err) {
      console.error("Error adding dish:", err);
      alert("❌ Error adding dish. Please try again.");
    }
  };
  
  // Handle Delete Dish
  const handleDelete = async (itemId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/${restaurantId}/menu/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setMenu(menu.filter((item) => item._id !== itemId));
        alert("Dish deleted!");
      } else {
        alert("Failed to delete dish");
      }
    } catch (err) {
      alert("Error deleting dish");
    }
  };

  // Group orders by table number
  const groupOrdersByTable = (orders) => {
    return orders.reduce((acc, order) => {
      if (!acc[order.tableNumber]) {
        acc[order.tableNumber] = [];
      }
      acc[order.tableNumber].push(order);
      return acc;
    }, {});
  };

  const clearTable = async (tableNumber) => {
    const isConfirmed = window.confirm(`Are you sure you want to clear Table ${tableNumber}?`);
  
    if (!isConfirmed) return;
  
    try {
      console.log("Attempting to clear table:", tableNumber);
  
      const token = localStorage.getItem("token");
  
      const response = await fetch(`http://localhost:5000/api/clearTable/${tableNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to clear table");
  
      console.log(`✅ Table ${tableNumber} cleared!`);
  
      // Refresh billing data immediately
      fetchBillingData();
    } catch (error) {
      console.error("❌ Error in clearTable:", error);
      alert("Failed to clear the table. Please try again.");
    }
  };
  useEffect(() => {
    fetchMenu();
    fetchBillingData();
    fetchOrderHistory(); // 👈 This is important
  }, []);



  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/${restaurantId}/order-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Response status:", res.status);
  
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Order history:", data);
        setOrderHistory(data);
      } else {
        const text = await res.text(); // likely HTML
        console.error("Non-JSON response:", text);
        alert("Received invalid response format from server.");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };
  
  const mergedHistory = Object.values(
  orderHistory.reduce((acc, order) => {
    const { invoiceNumber } = order;

    if (!acc[invoiceNumber]) {
      acc[invoiceNumber] = {
        ...order,
        orderItems: [...order.orderItems],
      };
    } else {

      // Merge items & totals
      acc[invoiceNumber].orderItems.push(...order.orderItems);
      acc[invoiceNumber].totalAmount += order.totalAmount;
    }
    

    return acc;
  }, {})
);

const [orderStatuses, setOrderStatuses] = useState({});

// Initialize orderStatuses when orders change
useEffect(() => {
  const initialStatuses = {};
  orders.forEach(order => {
    initialStatuses[order._id] = "Pending";
  });
  setOrderStatuses(initialStatuses);
}, [orders]);

const handleStatusChange = (orderId, newStatus) => {
  setOrderStatuses(prev => ({
    ...prev,
    [orderId]: newStatus,
  }));
};


  // Calculate total bill for each table
  const calculateBillingData = (groupedOrders) => {
    return Object.keys(groupedOrders).map((tableNumber) => {
      const tableOrders = groupedOrders[tableNumber];
      const totalAmount = tableOrders.reduce((total, order) => {
        const orderAmount = order.items.reduce((orderTotal, item) => {
          // Ensure itemPrice is 0 if price is undefined
          const itemPrice = item.itemId?.price || 0; 
          return orderTotal + itemPrice * item.quantity;
        }, 0);
        return total + orderAmount;
      }, 0);

      return { tableNumber, totalAmount, orders: tableOrders };
    });
  };



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold mb-7 text-center text-orange-600">🍽️ Admin Dashboard</h2>
      <audio ref={audioRef} src="/components/notification.mp3" preload="auto" />
{/* Tabs */}
<div className="mb-6 flex justify-center">
  <ul className="flex flex-wrap justify-center space-x-4 border-b-2 border-gray-200 max-w-full overflow-x-auto">
    {[
      { key: "orders", label: "Orders" },
      { key: "billing", label: "Billing" },
      { key: "menu", label: "Menu" },
      { key: "addDish", label: "Add Dish" },
      { key: "history", label: "Order History" },
    ].map((tab) => (
      <li
        key={tab.key}
        className={`cursor-pointer py-2 px-4 text-base sm:text-lg font-medium transition-all duration-200 ${
          activeTab === tab.key
            ? "text-orange-600 border-b-2 border-orange-600"
            : "text-gray-600 hover:text-orange-500"
        }`}
        onClick={() => setActiveTab(tab.key)}
      >
        {tab.label}
      </li>
    ))}
  </ul>
</div>
{/* 🔔 New Order Popup */}
{newOrderPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
      <h2 className="text-xl font-bold text-orange-600 mb-4">🔔 New Order Received</h2>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Table:</strong> {newOrderPopup.tableNumber}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Time:</strong> {new Date(newOrderPopup.createdAt).toLocaleString()}
      </p>

      <h3 className="font-semibold mb-2 text-gray-700">Items:</h3>
      <ul className="mb-4 space-y-1 text-gray-700 text-sm">
        {newOrderPopup.items.map((item, index) => (
          <li key={index}>
            • {item.itemId?.name || "Deleted Item"} × {item.quantity}
          </li>
        ))}
      </ul>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setNewOrderPopup(null)}
          className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Close
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Accept & Next
        </button>
      </div>
    </div>
  </div>
)}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-orange-600 flex items-center gap-2">Menu</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menu.map((item) => (
                <div key={item._id} className="border border-gray-200 p-4 rounded-lg shadow hover:shadow-lg bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-lg font-bold text-orange-600">₹ {item.price}</p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-4 text-sm text-red-500 hover:text-red-700"
                  >
                    Delete Dish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
{/* Add Dish Tab */}
{activeTab === "addDish" && (
  <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8">
    <h2 className="text-xl font-semibold mb-4">Add New Dish</h2>
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Dish Name"
        value={newDish.name}
        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="text"
        placeholder="Category"
        value={newDish.category}
        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="text"
        placeholder="Description"
        value={newDish.description}
        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="number"
        placeholder="Price"
        value={newDish.price}
        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {/* Image Preview */}
      {newDish.imagePreview && (
        <img
          src={newDish.imagePreview}
          alt="Preview"
          className="w-full h-48 object-cover rounded-md mt-2"
        />
      )}

      <button
        onClick={handleAddDish}
        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
      >
        Add Dish
      </button>
    </div>
  </div>
)}
        {/* Orders Tab */}
{activeTab === "orders" && (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-6 text-orange-600 flex items-center gap-2">
      📦 Active Orders
    </h2>

    {orders.length === 0 ? (
      <p className="text-gray-500 text-center mt-10">No orders yet.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>🕒 {new Date(order.createdAt).toLocaleString()}</span>
                <span className="font-medium">Table #{order.tableNumber}</span>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="mb-3">
                <h4 className="text-md font-semibold text-gray-700 mb-1">Items</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.itemId?.name || "Deleted Item"} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total</span>
                <span className="text-xl font-bold text-green-600">₹{order.total}</span>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
)}

       {/* Billing Tab */}
       {activeTab === "billing" && (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-6 text-orange-600 flex items-center gap-2">💰 Billing</h2>
    {billingData.length === 0 ? (
      <p className="text-gray-500">No billing data available.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {billingData.map((data) => (
          <div
            key={data.tableNumber}
            className="border p-6 rounded bg-white shadow"
            id={`bill-table-${data.tableNumber}`}
          >
            <div className="text-center mb-4">
              <p className="font-semibold text-lg">Table Number: {data.tableNumber}</p>
              <p>Date: {new Date().toLocaleString()}</p>
              <hr className="my-4" />
            </div>

            {/* Display order items for each table */}
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="font-semibold">Item</div>
                <div className="font-semibold text-center">Qty</div>
                <div className="font-semibold text-right">Price</div>
              </div>

              {data.orders.map((order) => (
                <div key={order._id} className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-4 border-b py-2">
                      <div>{item.itemId?.name || "Deleted Item"}</div>
                      <div className="text-center">{item.quantity}</div>
                      <div className="text-right">₹{item.price ? item.price.toFixed(2) : "N/A"}</div>
                    </div>
                  ))}
                </div>
              ))}

              <hr className="my-4" />

              {/* Total Calculations */}
              <div className="text-right">
                <p className="total-orders">
                  <strong>Total Orders:</strong> {data.orders.reduce((total, order) => total + order.items.length, 0)}
                </p>
                <p className="sub-total">
                  <strong>Sub Total:</strong> ₹{data.totalAmount ? data.totalAmount.toFixed(2) : "0.00"}
                </p>
                <hr />
                <p className="total-amount font-semibold">
                  <strong>Total:</strong> ₹{data.totalAmount ? data.totalAmount.toFixed(2) : "0.00"}
                </p>
              </div>

              {/* Buttons: Print & Clear Table */}
              <div className="text-center mt-4">
                <button
                  onClick={() => printBill(data.tableNumber)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Print Bill
                </button>

                <button
                  onClick={() => clearTable(data.tableNumber)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ml-2"  // ✅ Added spacing
                >
                  Clear Table
                </button>           
              </div>

            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{activeTab === "history" && (
  <div className="mt-12">
    <div className="mt-12">
  {/* Section Heading */}
  <h2 className="text-2xl font-semibold mb-6 text-orange-600 flex items-center gap-2">
    📜 Order History
  </h2>

  {/* 💰 Total Sales Summary Card */}
  <div className="mb-6 flex justify-end">
  <h2 className="text-2xl font-semibold mb-6 text-orange-600 flex items-center gap-2">
    📜 Order History
    <span className="text-base text-gray-600 font-normal gao-4">
      | Total Sales: ₹{(totalSalesFromHistory || 0).toFixed(2)}
    </span>
  </h2>


  </div>
</div>



    {loadingHistory ? (
      <p className="text-center text-gray-500 mt-10">Loading order history...</p>
    ) : (
      <>
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by invoice, item, or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />

          <div className="flex gap-2 flex-wrap">
            {["All", "Today", "This Week"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === filter
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">No matching orders found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.invoiceNumber}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-5 transition hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                  Table no: <span className="text-orange-600">{order.tableNumber}</span>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                Invoice : <span className="font-medium text-gray-700">#{order.invoiceNumber}</span>
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                  {order.orderItems.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity} – ₹{item.price}
                    </li>
                  ))}
                </ul>
                <div className="text-right mt-4">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-xl font-bold text-green-600">₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )}
  </div>
)}
  </div>
  );
}

export default AdminDashboard;