import React from "react";

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

function BulkImportTab({ isLoading, triggerAction, navigate }) {
  const handleOptionClick = (path) => navigate(path);

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200 text-center max-w-3xl mx-auto mt-6">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 ring-4 ring-blue-50">
        <UploadIcon />
      </div>
      <h2 className="text-3xl font-bold text-gray-800">Bulk Menu Import</h2>
      <p className="text-gray-500 mt-3 mb-10 max-w-lg mx-auto leading-relaxed">
        Don't waste time adding dishes one by one. Upload your menu using an image, PDF, or Excel file and our AI will organize it for you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => triggerAction(() => handleOptionClick("/bulk-upload"))}
          disabled={isLoading}
          className="p-6 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 group text-center"
        >
          <span className="text-3xl">📄</span>
          <div>
            <span className="block font-bold text-gray-800 group-hover:text-indigo-700 text-lg">AI Assistant Import</span>
            <span className="text-sm text-gray-500 mt-1">Review items before adding them to your menu.</span>
          </div>
        </button>
        <button
          onClick={() => triggerAction(() => handleOptionClick("/bulk-upload"))}
          disabled={isLoading}
          className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-3 text-center border-2 border-transparent"
        >
          <span className="text-3xl">⚡</span>
          <div>
            <span className="block font-bold text-white text-lg">Full Auto Import</span>
            <span className="text-sm text-blue-100 opacity-90 mt-1">Fastest method. AI handles everything automatically.</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default BulkImportTab;
