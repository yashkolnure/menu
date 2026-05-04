import React from "react";
import DeliveryDashboard from "../../DeliveryDashboard";
import BillingUpgradeGate from "../BillingUpgradeGate";

function DeliveryTab({ billingEnabled }) {
  if (!billingEnabled) return <BillingUpgradeGate tabName="Delivery Orders" />;
  return (
    <div className="h-full">
      <DeliveryDashboard />
    </div>
  );
}

export default DeliveryTab;
