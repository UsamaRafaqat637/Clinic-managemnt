// // components/Prescriptions.jsx
// import React, { useState } from 'react';

// const Prescriptions = ({ 
//   prescriptions = [], 
//   patients = [], 
//   doctors = [], 
//   addPrescription, 
//   updatePrescription, 
//   deletePrescription, 
//   medicines = [] 
// }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [editingPrescription, setEditingPrescription] = useState(null);
//   const [viewingPrescription, setViewingPrescription] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterPatient, setFilterPatient] = useState('');
//   const [filterDoctor, setFilterDoctor] = useState('');

//   const handleEdit = (prescription) => {
//     setEditingPrescription(prescription);
//     setShowForm(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this prescription?')) {
//       deletePrescription(id);
//     }
//   };

//   const handleSubmit = (prescriptionData) => {
//     if (editingPrescription) {
//       updatePrescription({ ...editingPrescription, ...prescriptionData });
//     } else {
//       addPrescription(prescriptionData);
//     }
//     setShowForm(false);
//     setEditingPrescription(null);
//   };

//   const PrescriptionForm = () => {
//     const [formData, setFormData] = useState(editingPrescription || {
//       patientId: '',
//       doctorId: '',
//       medications: [{ id: 1, name: '', dosage: '', frequency: '', duration: '', notes: '' }],
//       instructions: '',
//       diagnosis: '',
//       date: new Date().toISOString().split('T')[0],
//       expiry: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
//       status: 'Active'
//     });

//     const [searchMedicine, setSearchMedicine] = useState('');

//     const handleChange = (e) => {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleMedicationChange = (index, field, value) => {
//       const newMedications = [...formData.medications];
//       newMedications[index][field] = value;
//       setFormData({ ...formData, medications: newMedications });
//     };

//     const addMedication = () => {
//       setFormData({
//         ...formData,
//         medications: [...formData.medications, { 
//           id: formData.medications.length + 1, 
//           name: '', 
//           dosage: '', 
//           frequency: '', 
//           duration: '', 
//           notes: '' 
//         }]
//       });
//     };

//     const removeMedication = (index) => {
//       const newMedications = formData.medications.filter((_, i) => i !== index);
//       setFormData({ ...formData, medications: newMedications });
//     };

//     const addMedicineFromInventory = (medicine) => {
//       setFormData({
//         ...formData,
//         medications: [...formData.medications, { 
//           id: Date.now(),
//           name: medicine.name, 
//           dosage: 'As directed', 
//           frequency: 'Twice daily', 
//           duration: '7 days', 
//           notes: medicine.genericName,
//           medicineId: medicine.id
//         }]
//       });
//       setSearchMedicine('');
//     };

//     const handleSubmitForm = (e) => {
//       e.preventDefault();
      
//       const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));
//       const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));
      
//       if (!selectedPatient || !selectedDoctor) {
//         alert('Please select both patient and doctor');
//         return;
//       }
      
//       const prescriptionData = {
//         ...formData,
//         id: editingPrescription ? editingPrescription.id : Date.now(),
//         patientId: parseInt(formData.patientId),
//         doctorId: parseInt(formData.doctorId),
//         patient: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
//         doctor: `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
//         createdAt: new Date().toISOString(),
//         prescriptionNumber: `RX-${new Date().getFullYear()}-${(prescriptions.length + 1).toString().padStart(4, '0')}`
//       };
      
//       handleSubmit(prescriptionData);
//     };

//     const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));
//     const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));

//     return (
//       <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h3 className="text-2xl font-bold text-white">
//               {editingPrescription ? 'Edit Prescription' : 'Create New Prescription'}
//             </h3>
//             <p className="text-gray-400 mt-1">Complete prescription details</p>
//           </div>
//           <button
//             onClick={() => { setShowForm(false); setEditingPrescription(null); }}
//             className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmitForm} className="space-y-8">
//           {/* Patient and Doctor Selection */}
//           <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
//             <h4 className="text-lg font-bold text-white mb-4">Patient & Doctor Information</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-3">Select Patient *</label>
//                 <select
//                   name="patientId"
//                   value={formData.patientId}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="" className="bg-[#1c2230]">Choose a patient...</option>
//                   {patients.map(patient => (
//                     <option key={patient.id} value={patient.id} className="bg-[#1c2230]">
//                       {patient.firstName} {patient.lastName} (ID: PAT-{patient.id.toString().padStart(4, '0')})
//                     </option>
//                   ))}
//                 </select>
                
//                 {selectedPatient && (
//                   <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-blue-500/20">
//                     <p className="text-sm text-gray-300">Age: {selectedPatient.age} • Gender: {selectedPatient.gender}</p>
//                     <p className="text-sm text-gray-400">Condition: {selectedPatient.medicalCondition || 'Not specified'}</p>
//                   </div>
//                 )}
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-3">Select Doctor *</label>
//                 <select
//                   name="doctorId"
//                   value={formData.doctorId}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="" className="bg-[#1c2230]">Choose a doctor...</option>
//                   {doctors.map(doctor => (
//                     <option key={doctor.id} value={doctor.id} className="bg-[#1c2230]">
//                       Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
//                     </option>
//                   ))}
//                 </select>
                
//                 {selectedDoctor && (
//                   <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-blue-500/20">
//                     <p className="text-sm text-gray-300">Specialization: {selectedDoctor.specialization}</p>
//                     <p className="text-sm text-gray-400">License: MD-{selectedDoctor.id.toString().padStart(4, '0')}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Diagnosis */}
//           <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/20">
//             <h4 className="text-lg font-bold text-white mb-4">Diagnosis & Instructions</h4>
            
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-400 mb-3">Diagnosis *</label>
//               <textarea
//                 name="diagnosis"
//                 value={formData.diagnosis}
//                 onChange={handleChange}
//                 rows="2"
//                 className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
//                 placeholder="Enter medical diagnosis..."
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-3">Special Instructions</label>
//               <textarea
//                 name="instructions"
//                 value={formData.instructions}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
//                 placeholder="Enter any special instructions for the patient..."
//               />
//             </div>
//           </div>

//           {/* Medications */}
//           <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
//             <h4 className="text-lg font-bold text-white mb-6">Medications</h4>
            
//             {/* Medicine Search */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-400 mb-3">Search Medicines</label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search medicines from inventory..."
//                   value={searchMedicine}
//                   onChange={(e) => setSearchMedicine(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
//                 />
//                 <div className="absolute left-3 top-3.5">
//                   <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                   </svg>
//                 </div>
//               </div>
              
//               {searchMedicine && (
//                 <div className="mt-3 max-h-40 overflow-y-auto bg-gray-800/50 rounded-xl border border-gray-700">
//                   {medicines.filter(medicine => 
//                     medicine.name.toLowerCase().includes(searchMedicine.toLowerCase()) ||
//                     medicine.genericName.toLowerCase().includes(searchMedicine.toLowerCase())
//                   ).slice(0, 5).map(medicine => (
//                     <button
//                       key={medicine.id}
//                       type="button"
//                       onClick={() => addMedicineFromInventory(medicine)}
//                       className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-800/70 transition-colors border-b border-gray-700 last:border-b-0"
//                     >
//                       <div className="text-left">
//                         <p className="font-medium text-white">{medicine.name}</p>
//                         <p className="text-sm text-gray-400">{medicine.genericName}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-purple-400">${medicine.retailPrice?.toFixed(2) || '0.00'}</p>
//                         <p className="text-xs text-gray-500">Stock: {medicine.quantity}</p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* Medication Form */}
//             <div className="space-y-4">
//               {formData.medications.map((medication, index) => (
//                 <div key={medication.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
//                   <div className="flex justify-between items-center mb-4">
//                     <h5 className="font-semibold text-white">Medication #{index + 1}</h5>
//                     {formData.medications.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeMedication(index)}
//                         className="text-sm text-red-400 hover:text-red-300"
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-400 mb-2">Medication Name *</label>
//                       <input
//                         type="text"
//                         value={medication.name}
//                         onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
//                         className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         placeholder="e.g., Amoxicillin"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-400 mb-2">Dosage *</label>
//                       <input
//                         type="text"
//                         value={medication.dosage}
//                         onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
//                         className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         placeholder="e.g., 500mg"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-400 mb-2">Frequency *</label>
//                       <select
//                         value={medication.frequency}
//                         onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
//                         className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//                       >
//                         <option value="" className="bg-[#1c2230]">Select</option>
//                         <option value="Once daily" className="bg-[#1c2230]">Once daily</option>
//                         <option value="Twice daily" className="bg-[#1c2230]">Twice daily</option>
//                         <option value="Three times daily" className="bg-[#1c2230]">Three times daily</option>
//                         <option value="Four times daily" className="bg-[#1c2230]">Four times daily</option>
//                         <option value="Every 6 hours" className="bg-[#1c2230]">Every 6 hours</option>
//                         <option value="Every 8 hours" className="bg-[#1c2230]">Every 8 hours</option>
//                         <option value="Every 12 hours" className="bg-[#1c2230]">Every 12 hours</option>
//                         <option value="As needed" className="bg-[#1c2230]">As needed</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-400 mb-2">Duration</label>
//                       <input
//                         type="text"
//                         value={medication.duration}
//                         onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
//                         className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         placeholder="e.g., 7 days"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="mt-3">
//                     <label className="block text-xs font-medium text-gray-400 mb-2">Notes</label>
//                     <textarea
//                       value={medication.notes}
//                       onChange={(e) => handleMedicationChange(index, 'notes', e.target.value)}
//                       rows="2"
//                       className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//                       placeholder="Additional notes..."
//                     />
//                   </div>
//                 </div>
//               ))}
              
//               <button
//                 type="button"
//                 onClick={addMedication}
//                 className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-blue-500/50 transition-colors flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
//                 </svg>
//                 Add Another Medication
//               </button>
//             </div>
//           </div>

//           {/* Dates and Status */}
//           <div className="bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
//             <h4 className="text-lg font-bold text-white mb-4">Prescription Details</h4>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Prescription Date *</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date *</label>
//                 <input
//                   type="date"
//                   name="expiry"
//                   value={formData.expiry}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="Active" className="bg-[#1c2230]">Active</option>
//                   <option value="Completed" className="bg-[#1c2230]">Completed</option>
//                   <option value="Cancelled" className="bg-[#1c2230]">Cancelled</option>
//                   <option value="Expired" className="bg-[#1c2230]">Expired</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
//             <button
//               type="button"
//               onClick={() => { setShowForm(false); setEditingPrescription(null); }}
//               className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30"
//             >
//               {editingPrescription ? 'Update Prescription' : 'Save Prescription'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   };

//   // Prescription Detail View
//   const PrescriptionDetailView = ({ prescription, onClose }) => {
//     const patient = patients.find(p => p.id === prescription.patientId);
//     const doctor = doctors.find(d => d.id === prescription.doctorId);
    
//     const getStatusColor = (status) => {
//       switch(status) {
//         case 'Active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
//         case 'Completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
//         case 'Cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
//         case 'Expired': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
//         default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
//       }
//     };

//     return (
//       <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
//         <div className="flex justify-between items-start mb-8">
//           <div className="flex items-center">
//             <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-6 shadow-lg border border-blue-500/30">
//               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
//               </svg>
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-white">Prescription Details</h3>
//               <p className="text-gray-400">ID: {prescription.prescriptionNumber || `RX-${prescription.id.toString().padStart(4, '0')}`}</p>
//               <div className="flex items-center mt-2 space-x-3">
//                 <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(prescription.status)}`}>
//                   {prescription.status}
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   Created: {prescription.date}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="flex space-x-3">
//             <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30">
//               Print
//             </button>
//             <button 
//               onClick={onClose}
//               className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Patient Information */}
//           <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
//             <h4 className="text-lg font-bold text-white mb-4">Patient Information</h4>
//             {patient ? (
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-blue-500/30">
//                     <span className="text-blue-300 font-bold">
//                       {patient.firstName?.charAt(0) || ''}{patient.lastName?.charAt(0) || ''}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-white">{patient.firstName} {patient.lastName}</p>
//                     <p className="text-gray-400 text-sm">ID: PAT-{patient.id.toString().padStart(4, '0')}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="text-gray-400">Age:</div>
//                   <div className="font-semibold text-white">{patient.age} years</div>
//                   <div className="text-gray-400">Gender:</div>
//                   <div className="font-semibold text-white">{patient.gender}</div>
//                   <div className="text-gray-400">Phone:</div>
//                   <div className="font-semibold text-white">{patient.phone}</div>
//                   <div className="text-gray-400">Condition:</div>
//                   <div className="font-semibold text-white">{patient.medicalCondition || 'N/A'}</div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-400">Patient information not available</p>
//             )}
//           </div>

//           {/* Doctor Information */}
//           <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/20">
//             <h4 className="text-lg font-bold text-white mb-4">Doctor Information</h4>
//             {doctor ? (
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mr-3 border border-emerald-500/30">
//                     <span className="text-emerald-300 font-bold">
//                       {doctor.firstName?.charAt(0) || ''}{doctor.lastName?.charAt(0) || ''}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-white">Dr. {doctor.firstName} {doctor.lastName}</p>
//                     <p className="text-gray-400 text-sm">{doctor.specialization}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="text-gray-400">License:</div>
//                   <div className="font-semibold text-white">MD-{doctor.id.toString().padStart(4, '0')}</div>
//                   <div className="text-gray-400">Phone:</div>
//                   <div className="font-semibold text-white">{doctor.phone}</div>
//                   <div className="text-gray-400">Email:</div>
//                   <div className="font-semibold text-white">{doctor.email}</div>
//                   <div className="text-gray-400">Status:</div>
//                   <div className="font-semibold text-white">{doctor.status}</div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-400">Doctor information not available</p>
//             )}
//           </div>
//         </div>

//         {/* Diagnosis */}
//         <div className="mt-8 bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
//           <h4 className="text-lg font-bold text-white mb-4">Diagnosis</h4>
//           <p className="text-white bg-gray-800/30 rounded-xl p-4 border border-gray-700">
//             {prescription.diagnosis || 'No diagnosis specified'}
//           </p>
          
//           {prescription.instructions && (
//             <div className="mt-6">
//               <h4 className="text-lg font-bold text-white mb-4">Special Instructions</h4>
//               <p className="text-white bg-gray-800/30 rounded-xl p-4 border border-gray-700">
//                 {prescription.instructions}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Medications */}
//         <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
//           <h4 className="text-lg font-bold text-white mb-4">Prescribed Medications</h4>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead className="bg-gray-800/50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Medication</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Dosage</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Frequency</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {prescription.medications?.map((medication, index) => (
//                   <tr key={index} className="hover:bg-gray-800/30">
//                     <td className="px-4 py-3">
//                       <p className="font-medium text-white">{medication.name}</p>
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-gray-300">{medication.dosage}</p>
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-gray-300">{medication.frequency}</p>
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-gray-300">{medication.duration || 'N/A'}</p>
//                     </td>
//                     <td className="px-4 py-3">
//                       <p className="text-gray-400 text-sm">{medication.notes || 'None'}</p>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-700">
//           <div className="text-gray-400">
//             <p>Valid until: {prescription.expiry}</p>
//             <p className="text-sm">Created on: {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : prescription.date}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-400">Digital Signature</p>
//             <p className="font-semibold text-white">Dr. {doctor?.firstName} {doctor?.lastName}</p>
//             <p className="text-xs text-gray-500">{doctor?.specialization}</p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Filtered prescriptions
//   const filteredPrescriptions = prescriptions.filter(prescription => {
//     const matchesSearch = searchTerm === '' || 
//       prescription.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       prescription.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesPatient = filterPatient === '' || prescription.patientId === parseInt(filterPatient);
//     const matchesDoctor = filterDoctor === '' || prescription.doctorId === parseInt(filterDoctor);
    
//     return matchesSearch && matchesPatient && matchesDoctor;
//   });

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Active': return {
//         bg: 'bg-emerald-500/20',
//         text: 'text-emerald-300',
//         border: 'border-emerald-500/30'
//       };
//       case 'Completed': return {
//         bg: 'bg-blue-500/20',
//         text: 'text-blue-300',
//         border: 'border-blue-500/30'
//       };
//       case 'Cancelled': return {
//         bg: 'bg-red-500/20',
//         text: 'text-red-300',
//         border: 'border-red-500/30'
//       };
//       case 'Expired': return {
//         bg: 'bg-amber-500/20',
//         text: 'text-amber-300',
//         border: 'border-amber-500/30'
//       };
//       default: return {
//         bg: 'bg-gray-500/20',
//         text: 'text-gray-300',
//         border: 'border-gray-500/30'
//       };
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
//         <div>
//           <h2 className="text-3xl font-bold text-white">Prescriptions</h2>
//           <p className="text-gray-400 mt-1">Manage patient prescriptions and medications</p>
//         </div>
//         <button 
//           onClick={() => setShowForm(true)}
//           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-blue-500/30"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
//           </svg>
//           New Prescription
//         </button>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by patient, doctor, or diagnosis..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
//             />
//             <div className="absolute left-3 top-3.5">
//               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//               </svg>
//             </div>
//           </div>
          
//           <div>
//             <select
//               value={filterPatient}
//               onChange={(e) => setFilterPatient(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="" className="bg-[#1c2230]">All Patients</option>
//               {patients.map(patient => (
//                 <option key={patient.id} value={patient.id} className="bg-[#1c2230]">
//                   {patient.firstName} {patient.lastName}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <select
//               value={filterDoctor}
//               onChange={(e) => setFilterDoctor(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="" className="bg-[#1c2230]">All Doctors</option>
//               {doctors.map(doctor => (
//                 <option key={doctor.id} value={doctor.id} className="bg-[#1c2230]">
//                   Dr. {doctor.firstName} {doctor.lastName}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="flex space-x-3">
//             <button className="flex-1 px-4 py-3 border border-gray-700 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors">
//               Export
//             </button>
//             <button 
//               onClick={() => { 
//                 setSearchTerm(''); 
//                 setFilterPatient(''); 
//                 setFilterDoctor(''); 
//               }}
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Prescription Form or List */}
//       {showForm ? (
//         <PrescriptionForm />
//       ) : viewingPrescription ? (
//         <PrescriptionDetailView 
//           prescription={viewingPrescription} 
//           onClose={() => setViewingPrescription(null)}
//         />
//       ) : (
//         <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
//           {/* Stats */}
//           <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-6 py-4 border-b border-gray-700">
//             <div className="flex justify-between items-center">
//               <div className="text-gray-300">
//                 Showing <span className="font-bold text-white">{filteredPrescriptions.length}</span> of <span className="font-bold text-white">{prescriptions.length}</span> prescriptions
//               </div>
//               <div className="text-sm text-gray-400">
//                 {prescriptions.filter(p => p.status === 'Active').length} Active • 
//                 {prescriptions.filter(p => p.status === 'Completed').length} Completed • 
//                 {prescriptions.filter(p => p.status === 'Expired').length} Expired
//               </div>
//             </div>
//           </div>
          
//           {/* Prescriptions Grid */}
//           <div className="p-6">
//             {filteredPrescriptions.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredPrescriptions.map(prescription => {
//                   const statusColor = getStatusColor(prescription.status);
//                   return (
//                     <div key={prescription.id} className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors duration-300 hover:scale-[1.02] transform">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="font-bold text-xl text-white truncate">{prescription.patient}</h3>
//                           <p className="text-gray-400 text-sm truncate">Prescribed by {prescription.doctor}</p>
//                         </div>
//                         <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
//                           {prescription.status}
//                         </span>
//                       </div>
                      
//                       <div className="mb-4">
//                         <p className="text-gray-300 font-medium mb-2">Diagnosis:</p>
//                         <p className="text-white text-sm line-clamp-2">{prescription.diagnosis || 'No diagnosis specified'}</p>
//                       </div>
                      
//                       <div className="mb-6">
//                         <p className="text-gray-300 font-medium mb-2">Medications:</p>
//                         <div className="space-y-2">
//                           {prescription.medications?.slice(0, 2).map((med, index) => (
//                             <div key={index} className="flex items-center text-sm">
//                               <span className="text-purple-400 mr-2">•</span>
//                               <span className="text-white">{med.name}</span>
//                               <span className="text-gray-400 ml-auto">{med.dosage}</span>
//                             </div>
//                           ))}
//                           {prescription.medications?.length > 2 && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               +{prescription.medications.length - 2} more medications
//                             </p>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center justify-between mb-6 text-sm">
//                         <div className="text-gray-400">
//                           <p>Date: {prescription.date}</p>
//                           <p>Expires: {prescription.expiry}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-gray-400">ID: {prescription.prescriptionNumber || `RX-${prescription.id.toString().padStart(4, '0')}`}</p>
//                           <p className="text-xs text-gray-500">{prescription.medications?.length || 0} medications</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex justify-between pt-4 border-t border-gray-700">
//                         <button 
//                           onClick={() => setViewingPrescription(prescription)}
//                           className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
//                         >
//                           View
//                         </button>
//                         <div className="flex space-x-2">
//                           <button 
//                             onClick={() => handleEdit(prescription)}
//                             className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all border border-emerald-500/30"
//                           >
//                             Edit
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(prescription.id)}
//                             className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-500/30"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
//                 </svg>
//                 <p className="text-gray-400">No prescriptions found matching your criteria</p>
//                 <button 
//                   onClick={() => setShowForm(true)}
//                   className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 font-medium"
//                 >
//                   Create your first prescription
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Prescriptions;