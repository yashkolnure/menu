import React, { useState, useEffect } from "react";

function RestaurantDetails() {
  const [restaurant, setRestaurant] = useState({ name: "", logo: "", address: "", contact: "" });

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!restaurantId || !token) return;

    fetch(`https://menubackend-git-main-yashkolnures-projects.vercel.app/api/admin/${restaurantId}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error("Error fetching restaurant details:", error));
  }, [restaurantId, token]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Restaurant Details</h1>
      {restaurant.logo && <img src={restaurant.logo} alt="Restaurant Logo" className="w-24 h-24 my-4" />}
      <p className="text-lg"><strong>Name:</strong> {restaurant.name}</p>
      <p className="text-lg"><strong>Address:</strong> {restaurant.address}</p>
      <p className="text-lg"><strong>Contact:</strong> {restaurant.contact}</p>
    </div>
  );
}

export default RestaurantDetails;
