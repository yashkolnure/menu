import React from "react";
import { TrendingUp, Banknote, Smartphone, Coins, Search, Printer } from "lucide-react";
import BillingUpgradeGate from "../BillingUpgradeGate";

function HistoryTab({ billingEnabled, filteredHistory, earningsStats, loadingHistory, searchQuery, setSearchQuery, activeFilter, setActiveFilter, setSelectedHistoryView, printBill, getAggregatedTableItems }) {
  if (!billingEnabled) return <BillingUpgradeGate tabName="Order History" />;

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
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

      {/* Earnings breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p><h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">₹{earningsStats.total.toFixed(2)}</h2></div>
          <div className="p-3 bg-gray-100 text-gray-600 rounded-xl"><TrendingUp size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-green-600/70 uppercase tracking-wider">Cash</p><h2 className="text-xl sm:text-2xl font-extrabold text-green-600 mt-1">₹{earningsStats.cash.toFixed(2)}</h2></div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Banknote size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-blue-600/70 uppercase tracking-wider">Online</p><h2 className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">₹{earningsStats.online.toFixed(2)}</h2></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Smartphone size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-purple-600/70 uppercase tracking-wider">Others</p><h2 className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-1">₹{earningsStats.others.toFixed(2)}</h2></div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Coins size={24} /></div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input type="text" placeholder="Search invoice #, table..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
      </div>

      {/* History table */}
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
                    <div className="text-xs text-gray-400">{new Date(o.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">Table {o.tableNumber}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${o.paymentMethod === "Cash" ? "bg-green-100 text-green-700" : o.paymentMethod === "UPI" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
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
  );
}

export default HistoryTab;
