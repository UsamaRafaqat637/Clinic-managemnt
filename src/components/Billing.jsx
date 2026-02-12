// components/Billing.jsx
import React, { useState, useEffect } from 'react';

const Billing = ({ 
  bills = [], 
  patients = [], 
  addBill, 
  updateBillStatus, 
  deleteBill, 
  medicines: propMedicines = [], 
  addMedicine, 
  updateMedicine, 
  deleteMedicine 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [viewBill, setViewBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('bills'); // 'bills' or 'inventory'
  
  // Medicine Inventory
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('clinic-medicines');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: 'Lisinopril 10mg', 
        genericName: 'Lisinopril',
        category: 'Hypertension',
        manufacturer: 'PharmaCorp',
        batchNumber: 'LIS-2023-001',
        expiryDate: '2025-06-30',
        quantity: 150,
        unitPrice: 5.50,
        retailPrice: 8.00,
        discount: 0,
        taxRate: 17,
        stockStatus: 'In Stock',
        minStock: 20
      },
      { 
        id: 2, 
        name: 'Metformin 500mg', 
        genericName: 'Metformin',
        category: 'Diabetes',
        manufacturer: 'MediHealth',
        batchNumber: 'MET-2023-002',
        expiryDate: '2024-12-31',
        quantity: 200,
        unitPrice: 3.20,
        retailPrice: 5.50,
        discount: 0,
        taxRate: 17,
        stockStatus: 'In Stock',
        minStock: 25
      },
      { 
        id: 3, 
        name: 'Ibuprofen 400mg', 
        genericName: 'Ibuprofen',
        category: 'Pain Relief',
        manufacturer: 'PainFree Inc',
        batchNumber: 'IBU-2023-003',
        expiryDate: '2024-09-30',
        quantity: 300,
        unitPrice: 1.80,
        retailPrice: 3.00,
        discount: 0,
        taxRate: 17,
        stockStatus: 'In Stock',
        minStock: 50
      },
      { 
        id: 4, 
        name: 'Amoxicillin 500mg', 
        genericName: 'Amoxicillin',
        category: 'Antibiotic',
        manufacturer: 'AntibioPharm',
        batchNumber: 'AMX-2023-004',
        expiryDate: '2024-08-31',
        quantity: 120,
        unitPrice: 4.80,
        retailPrice: 7.50,
        discount: 0,
        taxRate: 17,
        stockStatus: 'In Stock',
        minStock: 15
      },
      { 
        id: 5, 
        name: 'Atorvastatin 20mg', 
        genericName: 'Atorvastatin',
        category: 'Cholesterol',
        manufacturer: 'CholestoMed',
        batchNumber: 'ATO-2023-005',
        expiryDate: '2025-03-31',
        quantity: 180,
        unitPrice: 6.50,
        retailPrice: 10.00,
        discount: 0,
        taxRate: 17,
        stockStatus: 'In Stock',
        minStock: 20
      },
    ];
  });

  // Update stock status based on quantity
  useEffect(() => {
    const updatedMedicines = medicines.map(medicine => {
      let stockStatus = 'In Stock';
      if (medicine.quantity <= 0) {
        stockStatus = 'Out of Stock';
      } else if (medicine.quantity <= medicine.minStock) {
        stockStatus = 'Low Stock';
      }
      return { ...medicine, stockStatus };
    });
    
    if (JSON.stringify(updatedMedicines) !== JSON.stringify(medicines)) {
      setMedicines(updatedMedicines);
      localStorage.setItem('clinic-medicines', JSON.stringify(updatedMedicines));
    }
  }, [medicines]);

  // Medical Services
  const [medicalServices] = useState([
    { id: 1, name: 'Doctor Consultation', code: 'DC001', category: 'Consultation', price: 150, duration: '30 min', taxRate: 17 },
    { id: 2, name: 'Follow-up Consultation', code: 'DC002', category: 'Consultation', price: 100, duration: '20 min', taxRate: 17 },
    { id: 3, name: 'ECG Test', code: 'ECG001', category: 'Diagnostic', price: 200, duration: '30 min', taxRate: 17 },
    { id: 4, name: 'Blood Test', code: 'BT001', category: 'Laboratory', price: 250, duration: '15 min', taxRate: 17 },
    { id: 5, name: 'X-Ray Chest', code: 'XRC001', category: 'Radiology', price: 350, duration: '45 min', taxRate: 17 },
    { id: 6, name: 'Ultrasound', code: 'US001', category: 'Imaging', price: 500, duration: '60 min', taxRate: 17 },
    { id: 7, name: 'Physiotherapy Session', code: 'PT001', category: 'Therapy', price: 120, duration: '45 min', taxRate: 17 },
  ]);

  // Get status color - matching PatientRecords style
  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        icon: 'text-emerald-400'
      };
      case 'Pending': return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        icon: 'text-amber-400'
      };
      case 'Partially Paid': return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        icon: 'text-blue-400'
      };
      case 'Cancelled': return {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-500/30',
        icon: 'text-red-400'
      };
      default: return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-300',
        border: 'border-gray-500/30',
        icon: 'text-gray-400'
      };
    }
  };

  const getStockStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30'
      };
      case 'Low Stock': return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-300',
        border: 'border-amber-500/30'
      };
      case 'Out of Stock': return {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-500/30'
      };
      default: return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-300',
        border: 'border-gray-500/30'
      };
    }
  };

  // Bill Detail View Component
  const BillDetailView = ({ bill, onClose }) => {
    const patient = patients.find(p => p.id === bill.patientId);
    const statusColor = getStatusColor(bill.status);

    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center mr-6 shadow-lg border border-blue-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Bill Details</h3>
              <p className="text-gray-400">Invoice #: {bill.invoiceNumber}</p>
              <div className="flex items-center mt-2 space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                  {bill.status}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {bill.date}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30">
              Print
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Information */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
            <h4 className="text-lg font-bold text-white mb-4">Patient Information</h4>
            {patient ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-blue-500/30">
                    <span className="text-blue-300 font-bold">
                      {patient.firstName?.charAt(0) || ''}{patient.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{patient.firstName} {patient.lastName}</p>
                    <p className="text-gray-400 text-sm">ID: PAT-{patient.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400">Phone:</div>
                  <div className="font-semibold text-white">{patient.phone}</div>
                  <div className="text-gray-400">CNIC:</div>
                  <div className="font-semibold text-white">{patient.cnic}</div>
                  <div className="text-gray-400">Age:</div>
                  <div className="font-semibold text-white">{patient.age} years</div>
                  <div className="text-gray-400">Gender:</div>
                  <div className="font-semibold text-white">{patient.gender}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Patient information not available</p>
            )}
          </div>

          {/* Bill Information */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/20">
            <h4 className="text-lg font-bold text-white mb-4">Bill Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-400">Invoice #:</div>
              <div className="font-semibold text-white">{bill.invoiceNumber}</div>
              <div className="text-gray-400">Date:</div>
              <div className="font-semibold text-white">{bill.date}</div>
              <div className="text-gray-400">Due Date:</div>
              <div className="font-semibold text-white">{bill.dueDate}</div>
              <div className="text-gray-400">Payment Method:</div>
              <div className="font-semibold text-white">{bill.paymentMethod}</div>
              <div className="text-gray-400">Status:</div>
              <div className="font-semibold text-white">{bill.status}</div>
              {bill.paidAmount > 0 && (
                <>
                  <div className="text-gray-400">Paid Amount:</div>
                  <div className="font-semibold text-emerald-400">${bill.paidAmount.toFixed(2)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
          <h4 className="text-lg font-bold text-white mb-4">Bill Items</h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tax</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bill.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{item.name}</p>
                      {item.type === 'medicine' && (
                        <p className="text-sm text-gray-400">Generic: {item.genericName}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.type === 'medicine' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.type === 'medicine' ? '💊 Medicine' : '🩺 Service'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{item.quantity}</td>
                    <td className="px-4 py-3 text-white">${item.unitPrice?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-white">${item.discount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-white">{item.taxRate || 17}%</td>
                    <td className="px-4 py-3 font-semibold text-white">${item.total?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
          <h4 className="text-lg font-bold text-white mb-4">Bill Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Subtotal:</span>
              <span className="font-semibold text-lg text-white">${bill.amount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Discount:</span>
              <span className="font-semibold text-red-400">-${bill.discount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tax:</span>
              <span className="font-semibold text-white">${bill.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-xl font-bold text-white">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-400">${bill.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-700">
          <div className="text-gray-400">
            <p>Bill generated on: {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : bill.date}</p>
            {bill.notes && (
              <p className="text-sm mt-2">Notes: {bill.notes}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">MediCare Pro Clinic</p>
            <p className="font-semibold text-white">Official Bill</p>
          </div>
        </div>
      </div>
    );
  };

  // Bill Form Component
  const BillForm = () => {
    const [formData, setFormData] = useState({
      patientId: '',
      paymentMethod: 'Cash',
      items: [],
      discountType: 'percentage',
      discountValue: 0,
      notes: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      status: 'Pending'
    });

    const [searchMedicine, setSearchMedicine] = useState('');
    const [searchService, setSearchService] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedItemType, setSelectedItemType] = useState('medicine');

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addItem = (item, type) => {
      let newItem;
      
      if (type === 'medicine') {
        if (item.quantity < quantity) {
          alert(`Only ${item.quantity} items available in stock!`);
          return;
        }
        
        newItem = {
          id: Date.now(),
          type: 'medicine',
          name: item.name,
          genericName: item.genericName,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate,
          quantity: parseInt(quantity),
          unitPrice: item.retailPrice,
          discount: item.discount || 0,
          taxRate: item.taxRate || 17,
          total: (item.retailPrice * quantity) - ((item.discount || 0) * quantity)
        };
        
        setMedicines(prev => prev.map(m => 
          m.id === item.id ? { ...m, quantity: m.quantity - quantity } : m
        ));
      } else {
        newItem = {
          id: Date.now(),
          type: 'service',
          name: item.name,
          code: item.code,
          category: item.category,
          quantity: 1,
          unitPrice: item.price,
          discount: 0,
          taxRate: item.taxRate || 17,
          total: item.price
        };
      }
      
      setFormData({
        ...formData,
        items: [...formData.items, newItem]
      });
      
      setQuantity(1);
      setSearchMedicine('');
      setSearchService('');
    };

    const removeItem = (index) => {
      const itemToRemove = formData.items[index];
      
      if (itemToRemove.type === 'medicine') {
        const medicine = medicines.find(m => m.name === itemToRemove.name);
        if (medicine) {
          setMedicines(prev => prev.map(m => 
            m.id === medicine.id ? { ...m, quantity: m.quantity + itemToRemove.quantity } : m
          ));
        }
      }
      
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    };

    const updateItemQuantity = (index, newQuantity) => {
      const newItems = [...formData.items];
      const item = newItems[index];
      const oldQuantity = item.quantity;
      
      if (item.type === 'medicine') {
        const medicine = medicines.find(m => m.name === item.name);
        if (medicine) {
          const quantityDifference = newQuantity - oldQuantity;
          if (quantityDifference > medicine.quantity) {
            alert(`Only ${medicine.quantity} items available in stock!`);
            return;
          }
          
          setMedicines(prev => prev.map(m => 
            m.id === medicine.id ? { ...m, quantity: m.quantity - quantityDifference } : m
          ));
        }
      }
      
      item.quantity = newQuantity;
      item.total = (item.unitPrice * newQuantity) - (item.discount * newQuantity);
      setFormData({ ...formData, items: newItems });
    };

    const calculateTotals = () => {
      const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
      const totalDiscount = formData.discountValue;
      const tax = formData.items.reduce((sum, item) => 
        sum + (item.total * (item.taxRate || 17) / 100), 0);
      const total = subtotal - totalDiscount + tax;
      
      return { subtotal, discount: totalDiscount, tax, total };
    };

    const totals = calculateTotals();

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const patient = patients.find(p => p.id === parseInt(formData.patientId));
      if (!patient) {
        alert('Please select a patient');
        return;
      }
      
      if (formData.items.length === 0) {
        alert('Please add at least one item to the bill');
        return;
      }
      
      const invoiceNumber = `INV-${new Date().getFullYear()}-${(bills.length + 1).toString().padStart(3, '0')}`;
      
      const billData = {
        ...formData,
        id: bills.length > 0 ? Math.max(...bills.map(b => b.id)) + 1 : 1,
        patientId: parseInt(formData.patientId),
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
        invoiceNumber,
        amount: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        items: formData.items.map(item => ({
          type: item.type,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          total: item.total
        })),
        createdAt: new Date().toISOString()
      };
      
      addBill(billData);
      setShowForm(false);
      setFormData({
        patientId: '',
        paymentMethod: 'Cash',
        items: [],
        discountType: 'percentage',
        discountValue: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        status: 'Pending'
      });
    };

    const filteredMedicines = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchMedicine.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchMedicine.toLowerCase())
    );

    const filteredServices = medicalServices.filter(service =>
      service.name.toLowerCase().includes(searchService.toLowerCase()) ||
      service.code.toLowerCase().includes(searchService.toLowerCase())
    );

    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">Generate New Bill</h3>
            <p className="text-gray-400 mt-1">Create invoice for medical services</p>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setFormData({
                patientId: '',
                paymentMethod: 'Cash',
                items: [],
                discountType: 'percentage',
                discountValue: 0,
                notes: '',
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                status: 'Pending'
              });
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Selection */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
            <h4 className="text-lg font-bold text-white mb-4">Patient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Select Patient *</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" className="bg-[#1c2230]">Choose a patient...</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id} className="bg-[#1c2230]">
                      {patient.firstName} {patient.lastName} (ID: PAT-{patient.id.toString().padStart(4, '0')})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Cash" className="bg-[#1c2230]">Cash</option>
                  <option value="Credit Card" className="bg-[#1c2230]">Credit Card</option>
                  <option value="Debit Card" className="bg-[#1c2230]">Debit Card</option>
                  <option value="Bank Transfer" className="bg-[#1c2230]">Bank Transfer</option>
                  <option value="Mobile Payment" className="bg-[#1c2230]">Mobile Payment</option>
                  <option value="Insurance" className="bg-[#1c2230]">Insurance</option>
                </select>
              </div>
            </div>
            
            {formData.patientId && (
              <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-blue-500/30">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-blue-500/30">
                    <span className="text-blue-300 font-bold">
                      {patients.find(p => p.id === parseInt(formData.patientId))?.firstName?.charAt(0) || ''}
                      {patients.find(p => p.id === parseInt(formData.patientId))?.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {patients.find(p => p.id === parseInt(formData.patientId))?.firstName} 
                      {patients.find(p => p.id === parseInt(formData.patientId))?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                      CNIC: {patients.find(p => p.id === parseInt(formData.patientId))?.cnic}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Items Section */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
            <h4 className="text-lg font-bold text-white mb-6">Add Medicines & Services</h4>
            
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setSelectedItemType('medicine')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedItemType === 'medicine'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border border-purple-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                💊 Medicines
              </button>
              <button
                type="button"
                onClick={() => setSelectedItemType('service')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedItemType === 'service'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border border-purple-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                🩺 Medical Services
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder={`Search ${selectedItemType === 'medicine' ? 'medicines...' : 'services...'}`}
                  value={selectedItemType === 'medicine' ? searchMedicine : searchService}
                  onChange={(e) => selectedItemType === 'medicine' ? setSearchMedicine(e.target.value) : setSearchService(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-20 px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Qty"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto mb-6">
              {selectedItemType === 'medicine' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMedicines.map(medicine => {
                    const stockColor = getStockStatusColor(medicine.stockStatus);
                    return (
                      <div key={medicine.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-white">{medicine.name}</h5>
                            <p className="text-sm text-gray-400">{medicine.genericName}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${stockColor.bg} ${stockColor.border} ${stockColor.text}`}>
                                Stock: {medicine.quantity}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                                {medicine.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Expiry: {medicine.expiryDate} | Batch: {medicine.batchNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-purple-400">${medicine.retailPrice.toFixed(2)}</p>
                            <button
                              type="button"
                              onClick={() => addItem(medicine, 'medicine')}
                              className="mt-2 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all border border-purple-500/30"
                              disabled={medicine.quantity < 1}
                            >
                              {medicine.quantity < 1 ? 'Out of Stock' : 'Add to Bill'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServices.map(service => (
                    <div key={service.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{service.name}</h5>
                          <p className="text-sm text-gray-400">{service.code} • {service.category}</p>
                          <p className="text-sm text-gray-500 mt-1">Duration: {service.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-blue-400">${service.price.toFixed(2)}</p>
                          <button
                            type="button"
                            onClick={() => addItem(service, 'service')}
                            className="mt-2 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
                          >
                            Add to Bill
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bill Items List */}
          {formData.items.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/20">
              <h4 className="text-lg font-bold text-white mb-4">Bill Items ({formData.items.length})</h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-800/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              {item.type === 'medicine' ? 
                                `Generic: ${item.genericName}` : 
                                `Code: ${item.code} • ${item.category}`
                              }
                            </p>
                            {item.type === 'medicine' && (
                              <p className="text-xs text-gray-500">
                                Batch: {item.batchNumber} | Exp: {item.expiryDate}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.type === 'medicine' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {item.type === 'medicine' ? '💊 Medicine' : '🩺 Service'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, parseInt(e.target.value))}
                            className="w-20 px-2 py-1 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-white">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-white">${item.discount.toFixed(2)}</td>
                        <td className="px-4 py-3 font-semibold text-white">${item.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="px-3 py-1 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Discount</label>
                  <div className="flex space-x-2">
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage" className="bg-[#1c2230]">Percentage (%)</option>
                      <option value="fixed" className="bg-[#1c2230]">Fixed Amount ($)</option>
                    </select>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min="0"
                      max={formData.discountType === 'percentage' ? 100 : totals.subtotal}
                      step={formData.discountType === 'percentage' ? 1 : 0.01}
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                    placeholder="Additional notes for this bill..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
            <h4 className="text-lg font-bold text-white mb-4">Bill Summary</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="font-semibold text-lg text-white">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Discount:</span>
                    <span className="font-semibold text-red-400">-${totals.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tax (17% on applicable items):</span>
                    <span className="font-semibold text-white">${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-xl font-bold text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-400">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending" className="bg-[#1c2230]">Pending</option>
                      <option value="Paid" className="bg-[#1c2230]">Paid</option>
                      <option value="Partially Paid" className="bg-[#1c2230]">Partially Paid</option>
                      <option value="Cancelled" className="bg-[#1c2230]">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  patientId: '',
                  paymentMethod: 'Cash',
                  items: [],
                  discountType: 'percentage',
                  discountValue: 0,
                  notes: '',
                  date: new Date().toISOString().split('T')[0],
                  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                  status: 'Pending'
                });
              }}
              className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30"
            >
              Generate Bill
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Payment Modal Component
  const PaymentModal = ({ bill, onClose, onPayment }) => {
    const [paymentData, setPaymentData] = useState({
      amount: bill.total - (bill.paidAmount || 0),
      paymentMethod: 'Cash',
      transactionId: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
      setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (paymentData.amount > bill.total - (bill.paidAmount || 0)) {
        alert('Payment amount cannot exceed outstanding balance');
        return;
      }
      onPayment(bill.id, paymentData.amount, paymentData.paymentMethod);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1c2230] rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Receive Payment</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/20">
              <p className="text-gray-300">Invoice: <span className="font-semibold text-white">{bill.invoiceNumber}</span></p>
              <p className="text-gray-300 mt-1">Patient: <span className="font-semibold text-white">{bill.patientName}</span></p>
              <p className="text-lg font-bold text-white mt-2">Total Due: ${bill.total?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-gray-400">Balance: ${(bill.total - (bill.paidAmount || 0)).toFixed(2)}</p>
              {bill.paidAmount && bill.paidAmount > 0 && (
                <p className="text-sm text-emerald-400 mt-1">Paid: ${bill.paidAmount.toFixed(2)}</p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Payment Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleChange}
                  min="0.01"
                  max={bill.total - (bill.paidAmount || 0)}
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Cash" className="bg-[#1c2230]">Cash</option>
                  <option value="Credit Card" className="bg-[#1c2230]">Credit Card</option>
                  <option value="Debit Card" className="bg-[#1c2230]">Debit Card</option>
                  <option value="Bank Transfer" className="bg-[#1c2230]">Bank Transfer</option>
                  <option value="Mobile Payment" className="bg-[#1c2230]">Mobile Payment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Transaction ID (Optional)</label>
                <input
                  type="text"
                  name="transactionId"
                  value={paymentData.transactionId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="TRX-XXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Payment Date</label>
                <input
                  type="date"
                  name="date"
                  value={paymentData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={paymentData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  placeholder="Payment notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all border border-emerald-500/30"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Medicine Form Modal
  const MedicineFormModal = ({ medicine, onClose, onSubmit }) => {
    const [formData, setFormData] = useState(medicine || {
      name: '',
      genericName: '',
      category: 'Hypertension',
      manufacturer: '',
      batchNumber: '',
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      quantity: 0,
      unitPrice: 0,
      retailPrice: 0,
      discount: 0,
      taxRate: 17,
      minStock: 10,
      stockStatus: 'In Stock'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ 
        ...formData, 
        [name]: name.includes('Price') || name.includes('Rate') || name.includes('discount') || name.includes('quantity') || name.includes('minStock')
          ? parseFloat(value) || 0
          : value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (formData.retailPrice <= formData.unitPrice) {
        alert('Retail price must be higher than unit price');
        return;
      }
      
      const medicineData = {
        ...formData,
        id: medicine ? medicine.id : Date.now()
      };
      
      onSubmit(medicineData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1c2230] rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {medicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Medicine Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Generic Name *</label>
                  <input
                    type="text"
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hypertension" className="bg-[#1c2230]">Hypertension</option>
                    <option value="Diabetes" className="bg-[#1c2230]">Diabetes</option>
                    <option value="Pain Relief" className="bg-[#1c2230]">Pain Relief</option>
                    <option value="Antibiotic" className="bg-[#1c2230]">Antibiotic</option>
                    <option value="Cholesterol" className="bg-[#1c2230]">Cholesterol</option>
                    <option value="Respiratory" className="bg-[#1c2230]">Respiratory</option>
                    <option value="Other" className="bg-[#1c2230]">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Batch Number *</label>
                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Unit Price ($) *</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Retail Price ($) *</label>
                  <input
                    type="number"
                    name="retailPrice"
                    value={formData.retailPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Discount ($)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Min Stock Level</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
                >
                  {medicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Handle payment
  const handlePayment = (billId, amount, method) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;
    
    const paidAmount = (bill.paidAmount || 0) + amount;
    const status = paidAmount >= bill.total ? 'Paid' : 'Partially Paid';
    
    updateBillStatus(billId, status);
    alert(`Payment of $${amount.toFixed(2)} received successfully!`);
  };

  // Handle medicine operations
  const handleAddMedicine = (medicineData) => {
    const newMedicine = {
      ...medicineData,
      id: medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1
    };
    setMedicines([...medicines, newMedicine]);
  };

  const handleUpdateMedicine = (medicineData) => {
    setMedicines(medicines.map(m => m.id === medicineData.id ? medicineData : m));
  };

  const handleDeleteMedicine = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  // Filtered bills
  const filteredBills = bills.filter(bill => {
    const matchesSearch = searchTerm === '' || 
      bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || bill.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    totalRevenue: bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.total || 0), 0),
    pendingAmount: bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + (b.total || 0), 0),
    partiallyPaid: bills.filter(b => b.status === 'Partially Paid').reduce((sum, b) => sum + (b.total || 0), 0),
    totalBills: bills.length,
    totalMedicines: medicines.length,
    lowStockMedicines: medicines.filter(m => m.stockStatus === 'Low Stock').length,
    outOfStockMedicines: medicines.filter(m => m.stockStatus === 'Out of Stock').length,
    stockValue: medicines.reduce((sum, m) => sum + ((m.quantity || 0) * (m.retailPrice || 0)), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Billing & Inventory</h2>
          <p className="text-gray-400 mt-1">Manage patient bills, medicines, and payments</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowMedicineModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-purple-500/30"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Medicine
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-blue-500/30"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Generate New Bill
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-2 border border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('bills')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'bills'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            💰 Bills & Payments
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border border-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            💊 Medicines Inventory
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-blue-200">Total Revenue</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-xl p-6 text-white border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${stats.pendingAmount.toLocaleString()}</p>
              <p className="text-amber-200">Pending Amount</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats.totalMedicines}</p>
              <p className="text-purple-200">Medicines</p>
            </div>
            <div className="text-3xl">💊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-6 text-white border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${stats.stockValue.toLocaleString()}</p>
              <p className="text-emerald-200">Stock Value</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
      </div>

      {activeTab === 'bills' ? (
        <>
          {/* Search and Filter */}
          <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by patient name or invoice #..."
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-[#1c2230]">All Status</option>
                  <option value="Paid" className="bg-[#1c2230]">Paid</option>
                  <option value="Pending" className="bg-[#1c2230]">Pending</option>
                  <option value="Partially Paid" className="bg-[#1c2230]">Partially Paid</option>
                  <option value="Cancelled" className="bg-[#1c2230]">Cancelled</option>
                </select>
              </div>
              
              <button 
                onClick={() => { setSearchTerm(''); setFilterStatus(''); }}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Bill Form or List */}
          {showForm ? (
            <BillForm />
          ) : showPaymentModal && selectedBill ? (
            <PaymentModal 
              bill={selectedBill} 
              onClose={() => {
                setShowPaymentModal(false);
                setSelectedBill(null);
              }}
              onPayment={handlePayment}
            />
          ) : viewBill ? (
            <BillDetailView 
              bill={viewBill} 
              onClose={() => setViewBill(null)}
            />
          ) : (
            <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-6 py-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-gray-300">
                    Showing <span className="font-bold text-white">{filteredBills.length}</span> bills
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-emerald-400">{bills.filter(b => b.status === 'Paid').length} Paid</span> • 
                    <span className="text-amber-400 ml-2">{bills.filter(b => b.status === 'Pending').length} Pending</span> • 
                    <span className="text-blue-400 ml-2">{bills.filter(b => b.status === 'Partially Paid').length} Partial</span>
                  </div>
                </div>
              </div>
              
              {/* Bills Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredBills.map(bill => {
                      const statusColor = getStatusColor(bill.status);
                      return (
                        <tr key={bill.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-white">{bill.invoiceNumber}</div>
                            <div className="text-sm text-gray-400">{bill.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-blue-500/30">
                                <span className="text-blue-300 font-bold">
                                  {bill.patientName?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div className="font-medium text-white">{bill.patientName || 'Unknown Patient'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{bill.date}</div>
                            <div className="text-xs text-gray-400">Due: {bill.dueDate}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {bill.items?.slice(0, 3).map((item, index) => (
                                <span key={index} className={`px-2 py-1 text-xs rounded-full ${
                                  item.type === 'medicine' 
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {item.type === 'medicine' ? '💊' : '🩺'} {item.name}
                                </span>
                              ))}
                              {bill.items?.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full border border-gray-600">
                                  +{bill.items.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-white">${bill.total?.toFixed(2) || '0.00'}</div>
                            <div className="text-sm text-gray-400">
                              {bill.items?.filter(i => i.type === 'medicine').length || 0} medicines • 
                              {bill.items?.filter(i => i.type === 'service').length || 0} services
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setViewBill(bill)}
                                className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors border border-blue-500/30"
                              >
                                View
                              </button>
                              {bill.status !== 'Paid' && bill.status !== 'Cancelled' && (
                                <button 
                                  onClick={() => {
                                    setSelectedBill(bill);
                                    setShowPaymentModal(true);
                                  }}
                                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors border border-emerald-500/30"
                                >
                                  Payment
                                </button>
                              )}
                              <button 
                                onClick={() => deleteBill(bill.id)}
                                className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors border border-red-500/30"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredBills.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-gray-400">No bills found matching your criteria</p>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Create your first bill
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Inventory Search and Actions */}
          <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Search medicines..."
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-[#1c2230]">All Stock Status</option>
                  <option value="In Stock" className="bg-[#1c2230]">In Stock</option>
                  <option value="Low Stock" className="bg-[#1c2230]">Low Stock</option>
                  <option value="Out of Stock" className="bg-[#1c2230]">Out of Stock</option>
                </select>
              </div>
              
              <button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setFilterStatus(''); 
                }}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all border border-purple-500/30"
              >
                Clear Filters
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-400">
                {medicines.length} medicines • 
                <span className="text-emerald-400 ml-2">{stats.lowStockMedicines} low stock</span> • 
                <span className="text-red-400 ml-2">{stats.outOfStockMedicines} out of stock</span>
              </div>
              <div className="text-sm text-gray-400">
                Total Value: <span className="font-bold text-white">${stats.stockValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Medicines Inventory */}
          <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 px-6 py-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Medicines Inventory</h3>
                <button 
                  onClick={() => setShowMedicineModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all border border-purple-500/30"
                >
                  + Add Medicine
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {medicines.filter(medicine => {
                  const matchesSearch = searchTerm === '' || 
                    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  const matchesStatus = filterStatus === '' || medicine.stockStatus === filterStatus;
                  
                  return matchesSearch && matchesStatus;
                }).map(medicine => {
                  const stockColor = getStockStatusColor(medicine.stockStatus);
                  return (
                    <div key={medicine.id} className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700 hover:border-purple-500/50 transition-colors duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-white">{medicine.name}</h4>
                          <p className="text-sm text-gray-400">{medicine.genericName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stockColor.bg} ${stockColor.border} ${stockColor.text}`}>
                          {medicine.stockStatus}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Category:</span>
                          <span className="text-white">{medicine.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Quantity:</span>
                          <span className="text-white font-semibold">{medicine.quantity} units</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Price:</span>
                          <span className="text-white">${medicine.retailPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry:</span>
                          <span className="text-white">{medicine.expiryDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Batch:</span>
                          <span className="text-white">{medicine.batchNumber}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4 border-t border-gray-700">
                        <button 
                          onClick={() => {
                            setEditingMedicine(medicine);
                            setShowMedicineModal(true);
                          }}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all border border-emerald-500/30"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {medicines.filter(medicine => {
                const matchesSearch = searchTerm === '' || 
                  medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesStatus = filterStatus === '' || medicine.stockStatus === filterStatus;
                
                return matchesSearch && matchesStatus;
              }).length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  <p className="text-gray-400">No medicines found matching your criteria</p>
                  <button 
                    onClick={() => setShowMedicineModal(true)}
                    className="mt-4 px-4 py-2 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Add your first medicine
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Medicine Form Modal */}
      {showMedicineModal && (
        <MedicineFormModal 
          medicine={editingMedicine}
          onClose={() => {
            setShowMedicineModal(false);
            setEditingMedicine(null);
          }}
          onSubmit={editingMedicine ? handleUpdateMedicine : handleAddMedicine}
        />
      )}
    </div>
  );
};

export default Billing;