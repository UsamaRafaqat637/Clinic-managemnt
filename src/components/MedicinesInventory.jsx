import React, { useState } from 'react';

const MedicinesInventory = ({ medicines = [], patients = [], addMedicine, updateMedicine, deleteMedicine, onMakeBill }) => {
  const [showForm, setShowForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [stockAction, setStockAction] = useState('add');
  const [stockQuantity, setStockQuantity] = useState(0);

  // Add safe default for medicines array
  const safeMedicines = medicines || [];
  const categories = [...new Set(safeMedicines.map(m => m.category))];

  const predefinedMedicines = [
    { name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'Hypertension' },
    { name: 'Metformin 500mg', genericName: 'Metformin', category: 'Diabetes' },
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'Hypertension' },
    { name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', category: 'Cholesterol' },
    { name: 'Levothyroxine 50mcg', genericName: 'Levothyroxine', category: 'Thyroid' },
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Acid Reflux' },
    { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotic' },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Pain Relief' },
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'Allergy' },
    { name: 'Metronidazole 400mg', genericName: 'Metronidazole', category: 'Antibiotic' },
    { name: 'Salbutamol Inhaler', genericName: 'Salbutamol', category: 'Asthma' },
    { name: 'Losartan 50mg', genericName: 'Losartan', category: 'Hypertension' },
    { name: 'Gliclazide 80mg', genericName: 'Gliclazide', category: 'Diabetes' },
    { name: 'Diclofenac Sodium 50mg', genericName: 'Diclofenac', category: 'Pain Relief' },
    { name: 'Paracetamol 500mg', genericName: 'Paracetamol', category: 'Fever' },
  ];

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine from inventory?')) {
      deleteMedicine(id);
    }
  };

  const handleSubmit = (medicineData) => {
    if (editingMedicine) {
      updateMedicine({ ...medicineData, id: editingMedicine.id });
    } else {
      addMedicine(medicineData);
    }
    setShowForm(false);
    setEditingMedicine(null);
  };

  const handleStockUpdate = () => {
    if (!selectedMedicine || stockQuantity <= 0) return;
    
    const currentQuantity = selectedMedicine.quantity || 0;
    let newQuantity;
    
    if (stockAction === 'add') {
      newQuantity = currentQuantity + stockQuantity;
    } else {
      newQuantity = Math.max(0, currentQuantity - stockQuantity);
    }
    
    const updatedMedicine = {
      ...selectedMedicine,
      quantity: newQuantity,
      stockStatus: newQuantity === 0 ? 'Out of Stock' : newQuantity <= 10 ? 'Low Stock' : 'In Stock'
    };
    
    updateMedicine(updatedMedicine);
    setShowStockForm(false);
    setSelectedMedicine(null);
    setStockQuantity(0);
  };

  const handleQuickAdd = (predefined) => {
    const medicineData = {
      ...predefined,
      manufacturer: 'Generic Manufacturer',
      batchNumber: `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
      quantity: 100,
      unitPrice: 2.50,
      retailPrice: 4.50,
      discount: 0,
      taxRate: 17,
      stockStatus: 'In Stock'
    };
    
    addMedicine(medicineData);
  };

  const handleMakeBillForPatient = () => {
    if (!selectedPatient || !selectedMedicine) {
      alert('Please select both a patient and a medicine');
      return;
    }
    
    const patient = (patients || []).find(p => p.id === parseInt(selectedPatient));
    onMakeBill(patient, selectedMedicine);
  };

  const filteredMedicines = safeMedicines.filter(medicine => {
    const matchesSearch = searchTerm === '' || 
      (medicine.name && medicine.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (medicine.genericName && medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (medicine.batchNumber && medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === '' || medicine.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const lowStockMedicines = safeMedicines.filter(m => (m.quantity || 0) <= 10 && (m.quantity || 0) > 0);
  const outOfStockMedicines = safeMedicines.filter(m => (m.quantity || 0) === 0);
  const expiringMedicines = safeMedicines.filter(m => {
    if (!m.expiryDate) return false;
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysDiff <= 90 && daysDiff > 0;
  });

  const MedicineForm = () => {
    const [formData, setFormData] = useState(editingMedicine || {
      name: '',
      genericName: '',
      category: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      quantity: 0,
      unitPrice: 0,
      retailPrice: 0,
      discount: 0,
      taxRate: 17,
      stockStatus: 'In Stock'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      const newData = { ...formData, [name]: value };
      
      if (name === 'unitPrice') {
        const unitPrice = parseFloat(value) || 0;
        const retailPrice = unitPrice * 1.45;
        newData.retailPrice = parseFloat(retailPrice.toFixed(2));
      }
      
      setFormData(newData);
    };

    const handleSubmitForm = (e) => {
      e.preventDefault();
      handleSubmit(formData);
    };

    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 mb-6 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white">
            {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
          </h3>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingMedicine(null);
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="medicine-form"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all border border-blue-500/30"
            >
              {editingMedicine ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
        
        <form id="medicine-form" onSubmit={handleSubmitForm} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Medicine Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
                placeholder="e.g., Lisinopril 10mg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Generic Name *</label>
              <input
                type="text"
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
                placeholder="e.g., Lisinopril"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" className="text-gray-500">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="New Category">+ Add New Category</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="e.g., PharmaCorp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Batch Number *</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
                placeholder="e.g., BATCH-2023-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Unit Price ($) *</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Retail Price ($)</label>
              <input
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock Status</label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const StockUpdateForm = () => {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-[#1c2230] rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Update Stock</h3>
              <button
                onClick={() => {
                  setShowStockForm(false);
                  setSelectedMedicine(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {selectedMedicine && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/20">
                <p className="font-semibold text-white">{selectedMedicine.name}</p>
                <p className="text-sm text-gray-400">{selectedMedicine.genericName}</p>
                <p className="text-sm text-gray-400 mt-2">Current Stock: <span className="text-white">{selectedMedicine.quantity || 0}</span></p>
                <p className="text-sm text-gray-400">Batch: {selectedMedicine.batchNumber}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStockAction('add')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all border ${
                      stockAction === 'add' 
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500/30' 
                        : 'bg-gray-800/50 text-gray-400 border-gray-700'
                    }`}
                  >
                    Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockAction('remove')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all border ${
                      stockAction === 'remove' 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500/30' 
                        : 'bg-gray-800/50 text-gray-400 border-gray-700'
                    }`}
                  >
                    Remove Stock
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {stockAction === 'add' ? 'Add Quantity' : 'Remove Quantity'}
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" className="text-gray-500">Select reason...</option>
                  {stockAction === 'add' ? (
                    <>
                      <option value="purchase">New Purchase</option>
                      <option value="return">Customer Return</option>
                      <option value="adjustment">Stock Adjustment</option>
                    </>
                  ) : (
                    <>
                      <option value="sale">Sale to Customer</option>
                      <option value="damage">Damaged Stock</option>
                      <option value="expired">Expired Stock</option>
                      <option value="adjustment">Stock Adjustment</option>
                    </>
                  )}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowStockForm(false);
                    setSelectedMedicine(null);
                  }}
                  className="px-6 py-2 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStockUpdate}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all border border-blue-500/30"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Medicines Inventory</h2>
          <p className="text-gray-400 mt-1">Manage medicines stock, pricing, and patient billing</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-blue-500/30"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Medicine
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{safeMedicines.length}</p>
              <p className="text-blue-200">Total Medicines</p>
            </div>
            <div className="text-3xl">💊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-6 text-white border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {safeMedicines.reduce((sum, m) => sum + (m.quantity || 0), 0)}
              </p>
              <p className="text-emerald-200">Total Stock</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-xl p-6 text-white border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{lowStockMedicines.length}</p>
              <p className="text-amber-200">Low Stock</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{outOfStockMedicines.length}</p>
              <p className="text-red-200">Out of Stock</p>
            </div>
            <div className="text-3xl">🚫</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 rounded-2xl shadow-xl p-6 border border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select Patient for Billing */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Patient for Billing</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-500">Select Patient</option>
              {(patients || []).map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} ({patient.medicalCondition || 'No condition'})
                </option>
              ))}
            </select>
          </div>
          
          {/* Select Medicine */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Medicine</label>
            <select
              value={selectedMedicine?.id || ''}
              onChange={(e) => {
                const medicine = safeMedicines.find(m => m.id === parseInt(e.target.value));
                setSelectedMedicine(medicine);
              }}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-500">Select Medicine</option>
              {safeMedicines.map(medicine => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name} (Stock: {medicine.quantity || 0})
                </option>
              ))}
            </select>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="bg-gray-800/30 rounded-xl p-4 flex flex-col justify-center border border-gray-700">
            <div className="flex space-x-2">
              <button
                onClick={handleMakeBillForPatient}
                disabled={!selectedPatient || !selectedMedicine}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedPatient && selectedMedicine
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 border border-emerald-500/30'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                Create Bill
              </button>
              <button
                onClick={() => selectedMedicine && setShowStockForm(true)}
                disabled={!selectedMedicine}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedMedicine
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border border-blue-500/30'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                Stock
              </button>
            </div>
            {selectedMedicine && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="font-medium text-white">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medicine Form or Search/List */}
      {showForm ? (
        <MedicineForm />
      ) : showStockForm ? (
        <StockUpdateForm />
      ) : (
        <>
          {/* Quick Add Predefined Medicines */}
          <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Quick Add Common Medicines</h3>
            <div className="flex flex-wrap gap-2">
              {predefinedMedicines.map((medicine, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(medicine)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-900/30 to-blue-800/20 text-blue-300 rounded-lg hover:from-blue-800/40 hover:to-blue-700/30 transition-all flex items-center border border-blue-500/20"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  {medicine.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines by name, generic, or batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
                <div className="absolute left-3 top-3.5">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="text-gray-500">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => { setSearchTerm(''); setFilterCategory(''); }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {(lowStockMedicines.length > 0 || outOfStockMedicines.length > 0 || expiringMedicines.length > 0) && (
            <div className="space-y-4">
              {lowStockMedicines.length > 0 && (
                <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center mr-3 border border-amber-700/50">
                        <span className="text-amber-400">⚠️</span>
                      </div>
                      <div>
                        <p className="font-semibold text-amber-300">Low Stock Alert</p>
                        <p className="text-sm text-amber-400">{lowStockMedicines.length} medicines have low stock (≤ 10 units)</p>
                      </div>
                    </div>
                    <button className="text-sm text-amber-400 hover:text-amber-300 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              )}
              
              {outOfStockMedicines.length > 0 && (
                <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 border border-red-700/50">
                        <span className="text-red-400">🚫</span>
                      </div>
                      <div>
                        <p className="font-semibold text-red-300">Out of Stock</p>
                        <p className="text-sm text-red-400">{outOfStockMedicines.length} medicines are out of stock</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-400 hover:text-red-300 font-medium">
                      Reorder
                    </button>
                  </div>
                </div>
              )}
              
              {expiringMedicines.length > 0 && (
                <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/20 border border-orange-700/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center mr-3 border border-orange-700/50">
                        <span className="text-orange-400">⏰</span>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-300">Expiring Soon</p>
                        <p className="text-sm text-orange-400">{expiringMedicines.length} medicines expiring in next 90 days</p>
                      </div>
                    </div>
                    <button className="text-sm text-orange-400 hover:text-orange-300 font-medium">
                      View List
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medicines Table */}
          <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Medicine</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Batch & Expiry</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredMedicines.map(medicine => (
                    <tr key={medicine.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">{medicine.name}</div>
                          <div className="text-sm text-gray-400">{medicine.genericName}</div>
                          <div className="text-xs text-gray-500">{medicine.manufacturer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{medicine.batchNumber}</div>
                        <div className={`text-sm ${new Date(medicine.expiryDate) < new Date() ? 'text-red-400' : 'text-gray-400'}`}>
                          Exp: {medicine.expiryDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${
                                (medicine.quantity || 0) > 50 ? 'bg-emerald-500' :
                                (medicine.quantity || 0) > 10 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, ((medicine.quantity || 0) / 100) * 100)}%` }}
                            ></div>
                          </div>
                          <span className={`font-semibold ${
                            medicine.stockStatus === 'In Stock' ? 'text-emerald-400' :
                            medicine.stockStatus === 'Low Stock' ? 'text-amber-400' :
                            'text-red-400'
                          }`}>
                            {medicine.quantity || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{medicine.stockStatus || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-400">Cost: <span className="text-white">${(medicine.unitPrice || 0).toFixed(2)}</span></div>
                          <div className="font-semibold text-blue-400">Retail: ${(medicine.retailPrice || 0).toFixed(2)}</div>
                          {medicine.discount > 0 && (
                            <div className="text-xs text-emerald-400">Discount: {medicine.discount}%</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedMedicine(medicine);
                              setSelectedPatient('');
                            }}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors border border-emerald-500/30"
                          >
                            Select
                          </button>
                          <button 
                            onClick={() => handleEdit(medicine)}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors border border-blue-500/30"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(medicine.id)}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors border border-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredMedicines.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  <p className="text-gray-400">No medicines found matching your criteria</p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Add your first medicine
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicinesInventory;