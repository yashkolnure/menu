import React from "react";
import { Percent, Tag, Coins, MessageCircle, Printer, Trash2 } from "lucide-react";
import BillingUpgradeGate from "../BillingUpgradeGate";

function BillingTab({ billingEnabled, billingData, taxRate, discountRate, additionalCharges, handleTaxChange, handleDiscountChange, handleChargesChange, calculateTotals, getAggregatedTableItems, handleInitiateClear, sendWhatsAppBill, printBill }) {
  if (!billingEnabled) return <BillingUpgradeGate tabName="Table Billing" />;

  return (
    <div className="space-y-6">
      {/* Financial settings row */}
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

      {/* Billing cards */}
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
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto text-sm pr-2">
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
                  <button onClick={() => sendWhatsAppBill(data)} className="bg-green-500 text-white py-2.5 rounded-xl font-semibold flex justify-center items-center gap-1 hover:bg-green-600 transition"><MessageCircle size={18} /></button>
                  <button onClick={() => printBill(data.tableNumber)} className="bg-gray-900 text-white py-2.5 rounded-xl font-semibold flex justify-center items-center gap-1 hover:bg-black transition"><Printer size={18} /></button>
                  <button onClick={() => handleInitiateClear(data)} className="bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold flex justify-center items-center gap-1 hover:bg-red-100 transition border border-red-100"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BillingTab;
