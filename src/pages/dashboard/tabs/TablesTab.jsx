import React from "react";
import { Grid, Clock, ChefHat, Plus } from "lucide-react";
import BillingUpgradeGate from "../BillingUpgradeGate";

function TablesTab({ billingEnabled, totalTables, billingData, orders, isRestrictedMode, getSeatedTime, setActiveTab, openAddDishModal, updateTableCount }) {
  if (!billingEnabled) return <BillingUpgradeGate tabName="My Tables" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: totalTables }, (_, i) => {
          const tableNum = (i + 1).toString();
          const activeTableData = billingData.find(b => b.tableNumber.toString() === tableNum);
          const isOccupied = !!activeTableData;
          const subTotal = isOccupied ? activeTableData.subTotal : 0;
          const tableOrders = orders.filter(o => o.tableNumber.toString() === tableNum);
          const seatedTime = isOccupied ? getSeatedTime(tableOrders) : null;

          return (
            <div
              key={tableNum}
              className={`relative rounded-2xl p-4 h-48 flex flex-col justify-between transition cursor-pointer shadow-sm border ${isOccupied ? "bg-white border-orange-200 hover:border-orange-400 hover:shadow-md" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
              onClick={() => { if (isOccupied) setActiveTab("billing"); }}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xl font-extrabold ${isOccupied ? "text-gray-800" : "text-gray-400"}`}>{tableNum}</span>
                {isOccupied
                  ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">Active</span>
                  : <span className="text-gray-300"><ChefHat size={20} /></span>
                }
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
                <div className="flex flex-col items-center justify-center h-full pb-4">
                  <p className="text-gray-400 font-medium text-sm">Available</p>
                </div>
              )}
              <button
                disabled={isRestrictedMode}
                onClick={(e) => { e.stopPropagation(); openAddDishModal(tableNum); }}
                className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition mt-auto ${isRestrictedMode ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-70" : isOccupied ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
              >
                <Plus size={16} />
                {isRestrictedMode ? "Action Locked" : "Add Items"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Floor plan controls */}
      <div id="table-controls" className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-700 flex items-center gap-2"><Grid size={20} className="text-orange-500" /> Floor Plan</h3>
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-500 font-medium">Total Tables:</span>
          <button onClick={() => updateTableCount(totalTables - 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          <span className="font-bold text-gray-800 w-6 text-center">{totalTables}</span>
          <button onClick={() => updateTableCount(totalTables + 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TablesTab;
