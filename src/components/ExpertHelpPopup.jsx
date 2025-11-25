import React from "react";

// Inline Icons
const Icons = {
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Check: () => <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
};

const ExpertHelpPopup = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-scale-up border border-gray-100">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-24  z-0"></div>
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 hover:bg-white/50 rounded-full p-1 transition-all z-20"
        >
          <Icons.Close />
        </button>

        <div className="relative z-10 p-6">
          
          <div className="text-center mb-6 mt-2">
            <h2 className="text-xl font-bold text-gray-900 mb-2">EXPERT Menu Setup</h2>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              Too busy? Send us your menu photos or PDF, and our experts will digitize it for you.
            </p>
          </div>

          {/* Feature List */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
             <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <span className="text-sm font-bold text-gray-700">Professional Service</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">₹199</span>
             </div>
             <ul className="space-y-2">
                {[
                  "Full menu digitization",
                  "Professional formatting",
                  "24-Hour turnaround"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Icons.Check /> {item}
                  </li>
                ))}
             </ul>
          </div>

          {/* Action Button */}
          <a
            href="https://wa.me/919270361329?text=Hi%2C%20I%20am%20interested%20in%20the%20Concierge%20Menu%20Upload%20Service"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all text-sm"
          >
            <Icons.WhatsApp />
            Chat with Expert on WhatsApp
          </a>
          
          <div className="text-center mt-3">
             <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                No thanks, I'll do it myself
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpertHelpPopup;