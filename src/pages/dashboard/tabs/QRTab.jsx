import React from "react";
import QRCodeTemplates from "../../../components/QRCodeTemplates";

function QRTab({ restaurantId, membership_level }) {
  return (
    <div className="space-y-6">
      <QRCodeTemplates restaurantId={restaurantId} membership_level={membership_level} />
    </div>
  );
}

export default QRTab;
