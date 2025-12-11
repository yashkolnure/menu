// components/PetobaChatbot.jsx
import React, { useState, useRef, useEffect } from "react";

// ✅ 1. Accept 'addToCart' as a prop
const PetobaChatbot = ({ menuData, restaurantName, currencySymbol, addToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Welcome to ${restaurantName || "Petoba"}! 🍽️ I'm your AI waiter. You can order directly here!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessageText = input; 
    
    setMessages((prev) => [...prev, { role: "user", content: userMessageText }]);
    setInput("");
    setLoading(true);

    try {
      // 1. Shrink the menu data to save 50% of your limits
      const simplifiedMenu = menuData.map(item => ({
        n: item.name,      // n = name
        p: item.price,     // p = price
        c: item.category,  // c = category
        d: item.description ? item.description.substring(0, 50) : "" // Limit desc length
      }));
      const response = await fetch('http://localhost:5000/api/admin/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessageText,
          menuContext: simplifiedMenu,
          restaurantName: restaurantName || "the restaurant",
          currencySymbol: currencySymbol || "₹"
        })
      });

      const data = await response.json();
      let aiContent = data.reply;

      // ✅ 2. CHECK FOR JSON "ACTION"
      try {
        // Attempt to parse the response as JSON
        if (aiContent.trim().startsWith("{") && aiContent.trim().endsWith("}")) {
          const command = JSON.parse(aiContent);

          if (command.action === "add_to_cart") {
            // Find the actual item object from your menuData
            const itemToAdd = menuData.find(
              (item) => item.name.toLowerCase() === command.item_name.toLowerCase()
            );

            if (itemToAdd) {
              // 🚀 TRIGGER THE CART FUNCTION
              addToCart(itemToAdd); 
              
              // If quantity > 1, loop it (simple version) or update your addToCart to accept qty
              for (let i = 1; i < command.quantity; i++) {
                addToCart(itemToAdd);
              }

              aiContent = `✅ Added ${command.quantity} x ${itemToAdd.name} to your cart! Anything else?`;
            } else {
              aiContent = "I couldn't find that exact item. Could you check the menu name?";
            }
          }
        }
      } catch (e) {
        // It was just normal text, ignore error
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble reaching the kitchen." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ BUTTON: Bottom Center | Pill Shape | "RestaurantName AI" */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-gray-800 transition-all active:scale-95 flex items-center space-x-3 border border-gray-700"
        >
          {/* Green Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>

          <span className="font-bold text-sm tracking-wide">
            {restaurantName || "Petoba"} AI
          </span>
          
          {/* Robot Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </button>
      )}

      {/* ✅ WINDOW: Classic Bottom-Right Position */}
      {isOpen && (
        <div className="fixed bottom-4 right-5 z-50 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    {restaurantName || "Petoba"} AI
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-none">Online Assistant</p>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:text-orange-500 transition-colors bg-gray-800 p-1.5 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" 
                      ? "bg-orange-500 text-white rounded-tr-none" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-gray-500 flex items-center space-x-1 border border-gray-200">
                    <span className="font-medium">Thinking</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center bg-gray-100 rounded-full px-1 py-1 pr-1.5 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <input
                type="text"
                placeholder={`Ask ${restaurantName || "us"}...`} 
                className="bg-transparent flex-1 outline-none text-sm text-gray-700 px-4 py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  input.trim() 
                    ? "bg-orange-500 text-white shadow-md hover:bg-orange-600 transform hover:scale-105" 
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-300 mt-2 font-medium tracking-wide">
                Powered by Petoba AI
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetobaChatbot;