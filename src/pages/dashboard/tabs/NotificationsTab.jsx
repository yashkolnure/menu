import React from "react";
import NotificationSetup from "../../NotificationSetup";
import BillingUpgradeGate from "../BillingUpgradeGate";

function NotificationsTab({ billingEnabled }) {
  if (!billingEnabled) return <BillingUpgradeGate tabName="Mobile Alerts" />;
  return (
    <div className="h-full w-full">
      <NotificationSetup />
    </div>
  );
}

export default NotificationsTab;
