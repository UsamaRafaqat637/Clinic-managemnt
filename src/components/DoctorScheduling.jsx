// components/DoctorScheduling.jsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const DoctorScheduling = () => {
  // Get data from Layout context
  const { 
    doctors = [],
    appointments = [],
    addDoctor,
    updateDoctor,
    deleteDoctor
  } = useOutletContext();

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor? This will also delete related appointments.')) {
      deleteDoctor(id);
    }
  };

  const handleSubmit = (doctorData) => {
    if (editingDoctor) {
      updateDoctor({ ...editingDoctor, ...doctorData });
    } else {
      addDoctor(doctorData);
    }
    setShowForm(false);
    setEditingDoctor(null);
  };

  const specializations = [
    'Cardiology',
    'Neurology', 
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'General Physician',
    'Gynecology',
    'Oncology',
    'Endocrinology'
  ];

  const filteredDoctors = Array.isArray(doctors) ? doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      (doctor.firstName && doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.lastName && doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.email && doctor.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.phone && doctor.phone.includes(searchTerm));
    
    const matchesSpecialization = filterSpecialization === '' || 
      doctor.specialization === filterSpecialization;
    
    return matchesSearch && matchesSpecialization;
  }) : [];

  const DoctorForm = () => {
    const [formData, setFormData] = useState(editingDoctor || {
      firstName: '',
      lastName: '',
      specialization: '',
      email: '',
      phone: '',
      schedule: '',
      status: 'Active',
      experience: '',
      qualifications: '',
      consultationFee: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ 
        ...formData, 
        [name]: name === 'consultationFee' ? parseFloat(value) || '' : value 
      });
    };

    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
            </h3>
            <p className="text-gray-400 mt-1">Complete all required information</p>
          </div>
          <button
            onClick={() => { setShowForm(false); setEditingDoctor(null); }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="Enter first name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Specialization *</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" className="bg-[#1c2230]">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec} className="bg-[#1c2230]">{spec}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active" className="bg-[#1c2230]">Active</option>
                <option value="On Leave" className="bg-[#1c2230]">On Leave</option>
                <option value="Inactive" className="bg-[#1c2230]">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="doctor@clinic.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="e.g., 10"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Consultation Fee ($)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="e.g., 150"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Qualifications</label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 resize-none"
                placeholder="MD, PhD, Board Certifications, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Schedule *</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="e.g., Monday-Friday (9:00 AM - 5:00 PM), Saturday (10:00 AM - 2:00 PM)"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingDoctor(null); }}
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30"
            >
              {editingDoctor ? 'Update Doctor Profile' : 'Add New Doctor'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Doctor Management</h2>
          <p className="text-gray-400 mt-1">Manage medical staff and schedules</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-blue-500/30"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Doctor
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
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
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-[#1c2230]">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec} className="bg-[#1c2230]">{spec}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-3 border border-gray-700 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors">
              Export
            </button>
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30">
              Filter
            </button>
          </div>
        </div>
      </div>

      {showForm ? (
        <DoctorForm />
      ) : (
        <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Stats Header */}
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-6 py-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-gray-300">
                Showing <span className="font-bold text-white">{filteredDoctors.length}</span> of <span className="font-bold text-white">{Array.isArray(doctors) ? doctors.length : 0}</span> doctors
              </div>
              <div className="text-sm text-gray-400">
                {Array.isArray(doctors) ? doctors.filter(d => d.status === 'Active').length : 0} Active • 
                {Array.isArray(doctors) ? doctors.filter(d => d.status === 'On Leave').length : 0} On Leave • 
                {Array.isArray(doctors) ? doctors.filter(d => d.status === 'Inactive').length : 0} Inactive
              </div>
            </div>
          </div>
          
          {/* Doctors Grid */}
          <div className="p-6">
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => {
                  const doctorAppointments = Array.isArray(appointments) ? appointments.filter(a => a.doctorId === doctor.id) : [];
                  const today = new Date().toISOString().split('T')[0];
                  const todayAppointments = doctorAppointments.filter(a => a.date === today);
                  
                  return (
                    <div key={doctor.id} className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors duration-300 hover:scale-[1.02] transform">
                      <div className="flex items-start mb-6">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-4 border border-blue-500/30">
                          <span className="text-blue-300 font-bold text-2xl">
                            {doctor.firstName?.charAt(0) || ''}{doctor.lastName?.charAt(0) || ''}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-white truncate">Dr. {doctor.firstName} {doctor.lastName}</h3>
                          <div className="flex items-center flex-wrap gap-2 mt-2">
                            <span className="px-3 py-1 text-sm font-semibold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                              {doctor.specialization}
                            </span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              doctor.status === 'Active' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : doctor.status === 'On Leave'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {doctor.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-gray-300 text-sm truncate">{doctor.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <span className="text-gray-300 text-sm">{doctor.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-gray-300 text-sm">{doctor.schedule || 'No schedule set'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                          <div className="text-xs text-gray-500">Appointments</div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">{doctorAppointments.length}</div>
                              <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="h-8 w-px bg-gray-700"></div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">{todayAppointments.length}</div>
                              <div className="text-xs text-gray-500">Today</div>
                            </div>
                          </div>
                        </div>
                        {doctor.consultationFee && (
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Fee</div>
                            <div className="text-xl font-bold text-emerald-400">${doctor.consultationFee}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between pt-4 border-t border-gray-700">
                        <button 
                          onClick={() => handleEdit(doctor)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all border border-emerald-500/30"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(doctor.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <p className="text-gray-400">No doctors found matching your criteria</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 font-medium"
                >
                  Add your first doctor
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorScheduling;