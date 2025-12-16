import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  ShoppingBag, 
  Plus, 
  Minus,
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  MoreVertical,
  Star,
  Flame,
  Search,
  ChevronLeft,
  Mic,
  Bike,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

// --- CONFIG DATA ---
const TABLE_NUMBER = "04";
const GUEST_NAME = "Yash";
const ORDER_ID = "#8821";

const categories = ["All", "Bestsellers", "Spicy 🔥", "Vegan 🌿", "Drinks", "Desserts"];

const initialDishes = [
  { id: 1, name: "Margherita Pizza", price: "₹249", rating: 4.5, time: "20m", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Chicken Biryani", price: "₹349", rating: 4.8, time: "35m", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Paneer Tikka", price: "₹220", rating: 4.2, time: "15m", img: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=150&q=80" },
  { id: 4, name: "Hakka Noodles", price: "₹180", rating: 4.0, time: "12m", img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=150&q=80" },
  { id: 5, name: "Veg Burger", price: "₹149", rating: 4.3, time: "15m", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80" },
  { id: 6, name: "Tacos", price: "₹199", rating: 4.6, time: "18m", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=150&q=80" },
];

const AdvancedAIWaiterDemo = () => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isReplaying, setIsReplaying] = useState(true);
  const [botStatus, setBotStatus] = useState("Online");
  const [currentTime, setCurrentTime] = useState("");
  
  const userQuery = "Something spicy & crispy! 🌶️";

  // Clock for status bar
  useEffect(() => {
    const date = new Date();
    setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // --- ANIMATION SEQUENCE ---
  useEffect(() => {
    if (!isReplaying) return;

    let timeout;
    const sequence = [
      { id: 0, delay: 1500, action: 'idle' },           
      { id: 1, delay: 800,  action: 'open_chat' },      
      { id: 2, delay: 1200, action: 'bot_welcome' },    
      { id: 3, delay: 2000, action: 'simulate_type' },  
      { id: 4, delay: 600,  action: 'user_send' },      
      { id: 5, delay: 800,  action: 'bot_thinking_1' }, 
      { id: 5.5, delay: 800, action: 'bot_thinking_2' },
      { id: 6, delay: 1000, action: 'bot_result' },     
      { id: 7, delay: 800,  action: 'click_add' },      
      { id: 8, delay: 800,  action: 'increment' },      
      { id: 9, delay: 2000, action: 'checkout' },       
      { id: 10, delay: 5000, action: 'success' },
      { id: 11, delay: 100, action: 'reset' }           
    ];

    const runSequence = async (index) => {
      if (!isReplaying) return;
      const current = sequence[index];
      
      if (current.action === 'reset') {
        setStep(0);
        setCartCount(0);
        setTypedText("");
        setBotStatus("Online");
        timeout = setTimeout(() => runSequence(0), 500);
        return;
      }

      setStep(current.id);

      if (current.action === 'bot_thinking_1') setBotStatus("Scanning Menu...");
      if (current.action === 'bot_thinking_2') setBotStatus("Matching Tastes...");
      if (current.action === 'bot_result') setBotStatus("Online");

      if (current.action === 'simulate_type') {
        let i = 0;
        const typeInterval = setInterval(() => {
          setTypedText(userQuery.slice(0, i + 1));
          i++;
          if (i === userQuery.length) clearInterval(typeInterval);
        }, 40);
      } 
      
      if (current.action === 'user_send') setTypedText("");
      if (current.action === 'increment') setCartCount(1);

      const nextIndex = index + 1;
      if (nextIndex < sequence.length) {
        timeout = setTimeout(() => runSequence(nextIndex), current.delay);
      }
    };

    runSequence(0);
    return () => clearTimeout(timeout);
  }, [isReplaying]);

  return (
    <div className="flex flex-col items-center justify-center ">
      
      {/* --- IPHONE 15 FRAME (REDUCED HEIGHT) --- */}
      <div className="relative w-[340px] h-[660px] bg-black rounded-[3rem] shadow-2xl border-[8px] border-black ring-4 ring-slate-300 select-none">
        
        {/* Physical Buttons (Decorations) */}
        <div className="absolute top-24 -left-[10px] w-1 h-7 bg-slate-800 rounded-l-md border-r border-slate-900"></div> {/* Mute */}
        <div className="absolute top-36 -left-[10px] w-1 h-12 bg-slate-800 rounded-l-md border-r border-slate-900"></div> {/* Vol Up */}
        <div className="absolute top-52 -left-[10px] w-1 h-12 bg-slate-800 rounded-l-md border-r border-slate-900"></div> {/* Vol Down */}
        <div className="absolute top-40 -right-[10px] w-1 h-16 bg-slate-800 rounded-r-md border-l border-slate-900"></div> {/* Power */}

        {/* --- SCREEN CONTAINER --- */}
        <div className="w-full h-full bg-gray-50 rounded-[2.5rem] overflow-hidden relative flex flex-col">
            
            {/* --- STATUS BAR & DYNAMIC ISLAND --- */}
            <div className="absolute top-0 w-full h-11 z-50 flex justify-between items-center px-6 text-black pointer-events-none">
                <span className="text-[13px] font-semibold w-12 text-center">{currentTime}</span>
                
                {/* Dynamic Island */}
                <div className="bg-black w-[100px] h-[30px] rounded-full absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-end px-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-800/80 mr-1.5"></div> {/* Camera Lens */}
                </div>

                <div className="flex items-center gap-1.5 w-12 justify-end">
                    <Signal size={13} className="fill-black"/>
                    <Wifi size={13} />
                    <Battery size={18} className="fill-black"/>
                </div>
            </div>

            {/* =========================================================
                APP CONTENT (MENU) 
               ========================================================= */}
            <div className={`h-full bg-gray-50 flex flex-col transition-all duration-500 ease-out origin-bottom ${step >= 1 ? 'scale-[0.92] brightness-[0.7] translate-y-4 rounded-[2rem]' : 'scale-100'}`}>
                
                {/* App Header */}
                <div className="bg-white px-5 pt-12 pb-3 shadow-sm flex justify-between items-center sticky top-0 z-10">
                  <div className="flex gap-2 items-center">
                    <div className="bg-slate-100 p-2 rounded-full"><ChevronLeft size={18} className="text-slate-800"/></div>
                    <div>
                      <h2 className="font-bold text-lg text-slate-900 leading-none">Petoba Eats</h2>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">Table {TABLE_NUMBER} • {GUEST_NAME}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <div className="bg-white border border-slate-100 p-2 rounded-full relative transition-transform duration-200" style={{ transform: cartCount > 0 ? 'scale(1.1)' : 'scale(1)' }}>
                        <ShoppingBag size={18} className="text-slate-800"/>
                        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-3.5 h-3.5 text-[9px] text-white flex items-center justify-center rounded-full animate-bounce shadow-sm font-bold">{cartCount}</span>}
                     </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white pb-3 px-5 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-50">
                    {categories.map((cat, i) => (
                        <span key={i} className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${i === 0 ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 pb-20 scrollbar-hide bg-slate-50">
                   {/* Banner */}
                   <div className="h-32 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 relative overflow-hidden flex items-center p-5 shadow-lg shadow-indigo-200/50 mb-5">
                     <div className="text-white relative z-10">
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/10">Promo</span>
                        <h3 className="font-bold text-xl leading-tight">Get 20% OFF</h3>
                        <p className="text-xs opacity-90 mt-1">On your first AI order!</p>
                     </div>
                     <div className="absolute -right-8 top-0 h-full w-32 bg-white/10 skew-x-12 blur-xl"></div>
                   </div>

                   {/* Dish Grid */}
                   <div className="flex items-center justify-between mb-3">
                       <h3 className="font-bold text-slate-800 text-base">Menu</h3>
                       <span className="text-[10px] text-indigo-600 font-semibold">See all</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                      {initialDishes.map((dish) => (
                        <div key={dish.id} className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col active:scale-95 transition-transform duration-200">
                           <div className="relative mb-2">
                               <img src={dish.img} alt={dish.name} className="h-24 w-full object-cover rounded-xl"/>
                               <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                   <Star size={9} className="text-yellow-500 fill-yellow-500"/>
                                   <span className="text-[9px] font-bold">{dish.rating}</span>
                               </div>
                           </div>
                           <h4 className="font-bold text-slate-800 text-xs truncate mb-0.5">{dish.name}</h4>
                           <div className="flex justify-between items-center mt-auto">
                              <p className="text-xs text-slate-900 font-bold">{dish.price}</p>
                              <button className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-md shadow-slate-300">
                                 <Plus size={12}/>
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
            </div>

            {/* =========================================================
                AI CHAT OVERLAY 
               ========================================================= */}
            <div className={`absolute inset-0 z-30 flex flex-col justify-end transition-all duration-500 ${step >= 1 ? 'bg-black/30 backdrop-blur-[4px]' : 'pointer-events-none bg-transparent'}`}>
                
                <div className={`bg-white rounded-t-[2.5rem] shadow-[0_-10px_60px_rgba(0,0,0,0.2)] flex flex-col transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) h-[85%] ${step >= 1 ? 'translate-y-0' : 'translate-y-full'}`}>
                  
                  {/* Chat Handle */}
                  <div className="w-full flex justify-center pt-3 pb-1">
                      <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
                  </div>

                  {/* Chat Header */}
                  <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="relative">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg ring-4 ring-slate-50">
                              <Bot size={20} />
                           </div>
                           <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-[2px] border-white rounded-full"></div>
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900 text-sm">Petoba AI</h3>
                           <p className={`text-[10px] font-medium transition-colors duration-300 ${botStatus === 'Online' ? 'text-green-600' : 'text-indigo-500 animate-pulse'}`}>
                               {botStatus}
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><MoreVertical size={18}/></button>
                     </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 bg-slate-50/50 p-4 overflow-y-auto space-y-4 scrollbar-hide">
                     
                     {/* 1. Welcome Msg */}
                     <div className={`flex gap-2 transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-[12px] text-slate-600 max-w-[85%] leading-relaxed">
                           Hello {GUEST_NAME}! 👋 <br/> Welcome to Table {TABLE_NUMBER}. What are you craving today?
                        </div>
                     </div>

                     {/* 1b. Suggestion Chips */}
                     <div className={`flex gap-2 flex-wrap transition-all duration-300 pl-1 ${step === 2 ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                        {["🌶️ Spicy", "🥗 Healthy", "🍰 Sweet"].map(tag => (
                            <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 font-medium">{tag}</span>
                        ))}
                     </div>

                     {/* 2. User Message */}
                     <div className={`flex justify-end transition-all duration-500 ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-none shadow-md shadow-indigo-200 text-[12px] max-w-[85%]">
                           {userQuery}
                        </div>
                     </div>

                     {/* 3. Bot Recommendation */}
                     <div className={`flex flex-col gap-2 transition-all duration-500 ${step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-[12px] text-slate-600 max-w-[85%] flex items-center gap-2">
                           <Sparkles size={12} className="text-amber-400 fill-amber-400"/>
                           Found a perfect match for you!
                        </div>

                        {/* PRODUCT CARD */}
                        <div className="ml-2 bg-white p-3 rounded-2xl border border-indigo-50 shadow-lg max-w-[92%] relative overflow-hidden ring-1 ring-slate-100 group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                           <div className="flex gap-3">
                              <img src="https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=150&q=80" className="w-14 h-14 rounded-xl object-cover" alt="Chicken"/>
                              <div className="flex-1 min-w-0 py-0.5">
                                 <h4 className="font-bold text-slate-800 text-sm truncate">Spicy Ghost Chicken</h4>
                                 <p className="text-[10px] text-slate-400 truncate mt-0.5">Ghost pepper sauce, herbs.</p>
                                 <div className="flex justify-between items-end mt-2">
                                    <span className="font-bold text-indigo-600 text-sm">₹349</span>
                                    {step < 8 ? (
                                        <button className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg shadow-slate-300">Add +</button>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-1.5 py-0.5 rounded-lg border border-green-100">
                                            <button className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm text-[10px]"><Minus size={10}/></button>
                                            <span className="text-xs font-bold">1</span>
                                            <button className="w-5 h-5 flex items-center justify-center bg-green-500 text-white rounded shadow-sm text-[10px]"><Plus size={10}/></button>
                                        </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Typing Indicator */}
                     {(step === 5 || step === 5.5) && (
                        <div className="flex items-end gap-1.5 ml-2 h-6">
                           <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                           <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                           <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                        </div>
                     )}
                  </div>

                  {/* Chat Input */}
                  <div className="px-5 pt-3 pb-8 bg-white border-t border-slate-50">
                      {step >= 8 ? (
                          <button className={`w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-300 flex items-center justify-center gap-3 transition-transform duration-200 ${step === 9 ? 'scale-95' : 'hover:scale-[1.02]'}`}>
                             <span>Confirm Order • ₹349</span>
                             <ArrowRight size={16} />
                          </button>
                      ) : (
                          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 ring-indigo-100 transition-all">
                             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm"><Mic size={14}/></div>
                             <input 
                                type="text" 
                                value={typedText}
                                readOnly
                                placeholder="Message Petoba AI..."
                                className="bg-transparent border-none focus:outline-none text-xs flex-1 text-slate-700 h-full font-medium"
                             />
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 ${typedText.length > 0 ? 'bg-indigo-600 scale-100 shadow-md shadow-indigo-200' : 'bg-slate-200 scale-90'}`}>
                                <Send size={12}/>
                             </div>
                          </div>
                      )}
                  </div>
                </div>

                {/* --- FAKE CURSOR --- */}
                <div 
                  className="absolute w-8 h-8 z-50 pointer-events-none transition-all duration-700 ease-in-out drop-shadow-2xl"
                  style={{
                    top:  step === 1 ? '85%' : step === 3 ? '92%' : step === 7 ? '65%' : step === 8 ? '65%' : step === 9 ? '90%' : '120%',
                    left: step === 1 ? '90%' : step === 3 ? '60%' : step === 7 ? '82%' : step === 8 ? '82%' : step === 9 ? '50%' : '120%',
                    opacity: [1, 3, 7, 8, 9].includes(step) ? 1 : 0,
                    transform: step === 7 || step === 9 ? 'scale(0.8)' : 'scale(1)'
                  }}
                >
                   {(step === 7 || step === 9) && <div className="absolute inset-0 bg-slate-500 rounded-full animate-ping opacity-50"></div>}
                   <svg className="w-full h-full text-slate-900 fill-slate-900 stroke-white stroke-2" viewBox="0 0 24 24"><path d="M5.5 3.21l10.8 15.65a1 1 0 0 1-1.63 1.15l-3.35-4.85-3.05 4.38a1 1 0 0 1-1.63-1.15l3.08-4.42L3.87 8.35a1 1 0 0 1 .82-1.64h.81z"/></svg>
                </div>
            </div>

            {/* --- SUCCESS OVERLAY --- */}
            <div className={`absolute inset-0 bg-green-600 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-500 ${step === 10 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 mb-4 shadow-2xl animate-[bounce_1s_infinite]">
                  <CheckCircle2 size={32} />
               </div>
               
               <h2 className="text-xl font-bold mb-1">Order Confirmed</h2>
               <p className="text-green-100 text-xs opacity-90 mb-8">Kitchen has received your ticket.</p>
               
               {/* THE TICKET VISUAL */}
               <div className={`bg-white text-slate-800 w-64 rounded-xl shadow-2xl overflow-hidden transition-transform duration-700 delay-100 ${step === 10 ? 'translate-y-0' : 'translate-y-20 opacity-0'}`}>
                   
                   {/* Ticket Header */}
                   <div className="bg-slate-900 text-white p-3 text-center border-b-2 border-dashed border-slate-700 relative">
                      <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Table Number</h3>
                      <div className="text-3xl font-black">{TABLE_NUMBER}</div>
                      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-green-600 rounded-full transform -translate-y-1/2"></div>
                      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-green-600 rounded-full transform -translate-y-1/2"></div>
                   </div>

                   {/* Ticket Body */}
                   <div className="p-4 bg-white relative">
                       <div className="flex justify-between items-center text-[10px] font-bold mb-3 text-slate-400 uppercase tracking-wide">
                          <span>Order {ORDER_ID}</span>
                          <span>{GUEST_NAME}</span>
                       </div>
                       
                       <div className="flex justify-between items-start mb-2 text-xs">
                           <span className="font-bold text-slate-800">1x Spicy Ghost Chicken</span>
                           <span className="font-medium text-slate-600">349.00</span>
                       </div>
                       
                       <div className="my-3 border-t-2 border-dashed border-slate-100"></div>
                       
                       <div className="flex justify-between items-center font-bold text-base text-slate-900">
                           <span>Total</span>
                           <span>₹349</span>
                       </div>
                   </div>
                   
                   <div className="h-3 bg-white bg-[length:12px_12px] bg-[radial-gradient(circle,transparent_50%,#ffffff_50%)] relative -bottom-1"></div>
               </div>

               {/* --- FLOATING TRACK ORDER BUTTON --- */}
               <button className={`absolute bottom-10 left-6 bg-white/20 backdrop-blur-xl border border-white/40 text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2.5 shadow-2xl hover:bg-white/30 transition-all duration-700 delay-700 ${step === 10 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="relative">
                     <Bike size={16} />
                     <span className="absolute -top-1 -right-1 flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white"></span>
                     </span>
                  </div>
                  <span>Track Order</span>
               </button>
            </div>

            {/* HOME INDICATOR */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/80 rounded-full z-50"></div>

        </div>
      </div>
      
      {/* External Controls */}
      <div className="mt-6 flex gap-4">
         <button 
           onClick={() => setIsReplaying(!isReplaying)} 
           className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-slate-500 hover:text-indigo-600 shadow-sm transition-colors flex items-center gap-2 border border-slate-200"
         >
            {isReplaying ? "Pause Demo" : "Replay Demo"}
         </button>
      </div>

    </div>
  );
};

export default AdvancedAIWaiterDemo;