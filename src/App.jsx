import React from "react";
import MenuCard from "./components/MenuCard";

const menuData = [
    {
      id: 1,
      name: "Margherita Pizza",
      category: "Pizza",
      description: "Classic delight with mozzarella cheese",
      price: 299,
      image: "https://source.unsplash.com/300x200/?pizza",
    },
    {
      id: 2,
      name: "Farmhouse Pizza",
      category: "Pizza",
      description: "Loaded with veggies and cheese",
      price: 349,
      image: "https://source.unsplash.com/300x200/?vegpizza",
    },
    {
      id: 3,
      name: "Paneer Butter Masala",
      category: "Main Course",
      description: "Rich creamy paneer curry",
      price: 199,
      image: "https://source.unsplash.com/300x200/?paneer",
    },
    {
      id: 4,
      name: "Veg Biryani",
      category: "Main Course",
      description: "Aromatic rice with veggies & spices",
      price: 149,
      image: "https://source.unsplash.com/300x200/?biryani",
    },
    {
      id: 5,
      name: "Gulab Jamun",
      category: "Dessert",
      description: "Soft and juicy milk-solid balls",
      price: 99,
      image: "https://source.unsplash.com/300x200/?gulabjamun",
    },
    {
      id: 6,
      name: "Cold Coffee",
      category: "Beverage",
      description: "Chilled coffee with ice cream",
      price: 79,
      image: "https://source.unsplash.com/300x200/?coffee",
    },
  ];
  
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold text-center mb-5">🍽️ Our Menu</h1>
      <div className="flex flex-wrap justify-center">
        {menuData.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
