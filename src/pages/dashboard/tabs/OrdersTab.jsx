import React from "react";
import { TrendingUp, ChefHat, Users, Clock, Eye, Printer } from "lucide-react";
import BillingUpgradeGate from "../BillingUpgradeGate";

function OrdersTab({ billingEnabled, orders, todaysRevenue, activeOrdersCount, occupiedTablesCount, pendingOrdersCount, setSelectedOrderView, printKOT }) {
  if (!billingEnabled) return <BillingUpgradeGate tabName="Live Dashboard" />;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats cards */}
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

      {/* Orders table */}
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
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3 text-xs sm:text-sm">{order.tableNumber}</div>
                      <div className="text-sm font-medium text-gray-900">Table {order.tableNumber}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600 font-medium max-w-[150px] sm:max-w-xs truncate">{order.items.map(i => `${i.quantity} x ${i.itemId?.name}`).join(", ")}</div>
                      <button onClick={() => setSelectedOrderView(order)} className="text-orange-500 hover:bg-orange-50 p-1 rounded-full transition flex-shrink-0" title="View Full Order"><Eye size={18} /></button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-900 whitespace-nowrap">₹{order.total}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {order.status === "pending"
                      ? <span className="px-2 sm:px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">Pending</span>
                      : <span className="px-2 sm:px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>
                    }
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => printKOT(order)} className="text-blue-600 hover:bg-blue-50 px-2 sm:px-3 py-2 rounded-lg flex items-center gap-2 ml-auto text-xs sm:text-sm"><Printer size={16} /> <span className="hidden sm:inline">Print KOT</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersTab;
