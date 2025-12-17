import React, { useState, useRef, useEffect } from "react";

const PetobaChatbot = ({ menuData, restaurantName, currencySymbol, addToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initial Welcome Message
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: `Welcome to ${restaurantName || "Petoba"}! 🍽️ I'm your AI waiter. Ask me for recommendations or order directly here!` 
    }
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
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
      const simplifiedMenu = menuData.map(item => ({
        n: item.name,      
        p: item.price,    
        c: item.category,  
        d: item.description ? item.description.substring(0, 50) : "" 
      }));

      const response = await fetch('/api/admin/chat', { 
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

      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/); 
        
        if (jsonMatch) {
          const command = JSON.parse(jsonMatch[0]);

          if (command.action === "add_to_cart") {
            
            // --- FUZZY MATCHING ---
            const commandTokens = command.item_name.toLowerCase().split(/\s+/).filter(t => t.length > 1);

            const matches = menuData.filter(item => {
              const itemString = item.name.toLowerCase().replace(/[^a-z0-9]/g, "");
              return commandTokens.every(token => itemString.includes(token));
            });

            const itemToAdd = matches.sort((a, b) => a.name.length - b.name.length)[0];
            // ----------------------

            if (itemToAdd) {
              const qty = command.quantity || 1;
              
              // ✅ FIX: Call addToCart ONCE with the full quantity
              addToCart(itemToAdd, qty);
              
              aiContent = `✅ Added ${qty} x ${itemToAdd.name} to your cart!`;
            } else {
              aiContent = `I tried to add "${command.item_name}" but couldn't find a perfect match.`;
            }
          }
        }
      } catch (e) {
        // Not JSON
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ MINIMALIST ICON BUTTON: Bottom Left Corner */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-50 bg-gray-900 text-white w-14 h-14 rounded-full shadow-2xl hover:bg-black transition-all active:scale-90 flex items-center justify-center border border-gray-700 group"
          aria-label="Open AI Assistant"
        >
          {/* Green "Online" Dot - Positioned Top Right of the circle */}
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-gray-900"></span>
          </span>

          {/* Minimalist Robot Icon */}
       {/* Chat Wave Icon */}
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  className="h-7 w-7 text-white group-hover:scale-110 transition-transform" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
>
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  <path d="M8 9h8" />
  <path d="M8 13h6" />
</svg>
        </button>
      )}

      {/* ✅ CHAT WINDOW: Aligned to Bottom Left */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[550px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up font-sans">
          
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    {restaurantName || "Petoba"} AI
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-none">Your Digital Waiter</p>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:text-red-400 transition-colors bg-gray-800 p-1.5 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 scrollbar-thin">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
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
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1">
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center bg-gray-100 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <input
                type="text"
                placeholder="Type a message..." 
                className="bg-transparent flex-1 outline-none text-sm text-gray-700 px-3 py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`p-2 rounded-xl transition-all ${
                  input.trim() 
                    ? "bg-orange-500 text-white shadow-md hover:bg-orange-600" 
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-center text-gray-400 mt-2 font-semibold uppercase tracking-widest">
                Petoba Smart Assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PetobaChatbot;