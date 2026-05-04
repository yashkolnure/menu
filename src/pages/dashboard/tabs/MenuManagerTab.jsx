import React from "react";

const Icons = {
  Menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
};

function MenuManagerTab({
  existingItems, orderedMenuGroups, allCategories,
  itemForm, setItemForm, customCategory, setCustomCategory,
  showItemForm, setShowItemForm, formRef,
  handleItemChange, handleImageChange,
  addItemToList, handleUpdate, handleDelete, handleEditItem,
  openCategory, setOpenCategory, setShowReorderModal,
}) {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Your Menu</h2>
          <p className="text-gray-500 text-sm">Add dishes and drag to reorder categories.</p>
        </div>
        <div ref={formRef}></div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowReorderModal(true)}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span>Reorder</span>
          </button>
          <button
            id="add-dish-btn"
            onClick={() => {
              setShowItemForm(!showItemForm);
              setItemForm({ name: "", category: "", description: "", price: "", image: "", _id: null, inStock: true });
            }}
            className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm transition-all ${showItemForm ? "bg-red-50 text-red-600 border border-red-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
          >
            {showItemForm ? <span>Cancel Adding</span> : <><Icons.Plus /><span>Add Dish</span></>}
          </button>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 m-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
          <div className="bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-800">{itemForm._id ? "Edit Dish" : "Add New Dish"}</h3>
              <button onClick={() => setShowItemForm(false)} className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-sm border border-gray-200"><Icons.Close /></button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-6 bg-white flex-1">
              {/* Image uploader */}
              <div className="flex justify-center">
                <label className="relative w-full sm:w-64 h-48 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group">
                  {itemForm.image ? (
                    <>
                      <img src={itemForm.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">Tap to Change</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2"><Icons.Upload /></div>
                      <span className="text-sm font-bold text-gray-600">Tap to upload photo</span>
                      <p className="text-xs text-gray-400 mt-1">Accepts JPG/PNG</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Dish Name</label>
                  <input name="name" value={itemForm.name} onChange={handleItemChange} placeholder="e.g. Chicken Burger" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Price (₹)</label>
                    <input name="price" type="number" value={itemForm.price} onChange={handleItemChange} placeholder="00" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-bold p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                    <button
                      onClick={() => setItemForm(prev => ({ ...prev, inStock: !prev.inStock }))}
                      className={`w-full h-[54px] px-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-sm ${itemForm.inStock ? "bg-green-100 border-green-200 text-green-700" : "bg-red-50 border-red-100 text-red-600"}`}
                    >
                      <span className={`w-3 h-3 rounded-full ${itemForm.inStock ? "bg-green-600" : "bg-red-500"}`}></span>
                      {itemForm.inStock ? "In Stock" : "Sold Out"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
                  <div className="relative">
                    <select
                      value={itemForm.category || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomCategory(val === "__custom__" ? val : "");
                        setItemForm({ ...itemForm, category: val === "__custom__" ? "" : val });
                      }}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Category...</option>
                      {allCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                      <option value="__custom__">+ Create New Category</option>
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">▼</div>
                  </div>
                </div>

                {customCategory === "__custom__" && (
                  <div>
                    <input type="text" placeholder="Enter new category name" value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })} className="w-full border-2 border-indigo-100 bg-indigo-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-900 font-medium" />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
                  <textarea name="description" value={itemForm.description} onChange={handleItemChange} rows="3" placeholder="Optional: Ingredients, spicy level..." className="w-full bg-gray-50 border border-gray-200 text-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
              <button onClick={() => setShowItemForm(false)} className="flex-1 py-3.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-bold shadow-sm transition-colors">Cancel</button>
              <button onClick={itemForm._id ? handleUpdate : addItemToList} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transform active:scale-95 transition-all">
                {itemForm._id ? "Update Dish" : "Save Dish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu grid */}
      <div className="grid grid-cols-1">
        {orderedMenuGroups.map((group, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border overflow-hidden m-1">
            <button onClick={() => setOpenCategory(openCategory === group.category ? null : group.category)} className="w-full flex justify-between items-center px-6 py-4 bg-white hover:bg-gray-50 transition-colors">
              <h4 className="text-lg font-bold text-gray-800">{group.category} <span className="text-sm font-normal text-gray-500 ml-2">({group.items.length} dishes)</span></h4>
              <span className="text-gray-400">{openCategory === group.category ? "▲" : "▼"}</span>
            </button>
            {openCategory === group.category && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-3 rounded-lg border bg-white border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Icons.Menu /></div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h5 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h5>
                          <span className="font-bold text-green-700 text-sm">₹{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => handleEditItem(item)} className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded flex items-center gap-1"><Icons.Edit /> Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded flex items-center gap-1"><Icons.Trash /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {orderedMenuGroups.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-900">Your Menu is Empty</h3>
            <button onClick={() => setShowItemForm(true)} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg">Add Your First Dish</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuManagerTab;
