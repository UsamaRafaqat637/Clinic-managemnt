// components/Appointments.jsx
import React, { useState } from 'react';

const Appointments = ({ appointments = [], patients = [], doctors = [], addAppointment, updateAppointment, deleteAppointment, onMakeBill }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingAppointment, setViewingAppointment] = useState(null);

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleView = (appointment) => {
    setViewingAppointment(appointment);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
    }
  };

  const handleSubmit = (appointmentData) => {
    if (editingAppointment) {
      updateAppointment({ ...editingAppointment, ...appointmentData });
    } else {
      addAppointment(appointmentData);
    }
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleCompleteAppointment = (appointment) => {
    if (window.confirm('Mark this appointment as completed?')) {
      updateAppointment({ ...appointment, status: 'Completed' });
      // Optionally trigger bill creation
      if (onMakeBill) {
        const patient = patients.find(p => p.id === appointment.patientId);
        onMakeBill(patient);
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesDate = !filterDate || appointment.date === filterDate;
    const matchesStatus = !filterStatus || appointment.status === filterStatus;
    const matchesDoctor = !selectedDoctor || appointment.doctorId === parseInt(selectedDoctor);
    
    // Search functionality
    const matchesSearch = searchTerm === '' || 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesStatus && matchesDoctor && matchesSearch;
  });

  // Get status color - matching PatientRecords style
  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        icon: 'bg-emerald-500/10'
      };
      case 'Pending': return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        icon: 'bg-amber-500/10'
      };
      case 'Completed': return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        icon: 'bg-blue-500/10'
      };
      case 'Cancelled': return {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-500/30',
        icon: 'bg-red-500/10'
      };
      case 'No Show': return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-300',
        border: 'border-gray-500/30',
        icon: 'bg-gray-500/10'
      };
      default: return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-300',
        border: 'border-gray-500/30',
        icon: 'bg-gray-500/10'
      };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Emergency': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'High': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Normal': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Low': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const AppointmentDetailView = ({ appointment, onClose }) => {
    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    const statusColor = getStatusColor(appointment.status);
    const priorityColor = getPriorityColor(appointment.priority);

    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <div className={`w-20 h-20 rounded-2xl ${statusColor.icon} flex items-center justify-center mr-6 shadow-lg border ${statusColor.border}`}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Appointment Details</h3>
              <p className="text-gray-400">ID: APPT-{appointment.id.toString().padStart(4, '0')}</p>
              <div className="flex items-center mt-2 space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                  {appointment.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColor}`}>
                  {appointment.priority || 'Normal'} Priority
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {appointment.status === 'Confirmed' && (
              <button 
                onClick={() => handleCompleteAppointment(appointment)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium shadow-lg border border-emerald-500/30"
              >
                Mark Complete
              </button>
            )}
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
                  <div className="text-gray-400">Age:</div>
                  <div className="font-semibold text-white">{patient.age} years</div>
                  <div className="text-gray-400">Phone:</div>
                  <div className="font-semibold text-white">{patient.phone}</div>
                  <div className="text-gray-400">Medical Condition:</div>
                  <div className="font-semibold text-white">{patient.medicalCondition || 'N/A'}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Patient information not available</p>
            )}
          </div>

          {/* Doctor Information */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/20">
            <h4 className="text-lg font-bold text-white mb-4">Doctor Information</h4>
            {doctor ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mr-3 border border-emerald-500/30">
                    <span className="text-emerald-300 font-bold">
                      {doctor.firstName?.charAt(0) || ''}{doctor.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Dr. {doctor.firstName} {doctor.lastName}</p>
                    <p className="text-gray-400 text-sm">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400">Schedule:</div>
                  <div className="font-semibold text-white">{doctor.schedule}</div>
                  <div className="text-gray-400">Fee:</div>
                  <div className="font-semibold text-white">${doctor.consultationFee || 'N/A'}</div>
                  <div className="text-gray-400">Phone:</div>
                  <div className="font-semibold text-white">{doctor.phone}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Doctor information not available</p>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="mt-8 bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
          <h4 className="text-lg font-bold text-white mb-4">Appointment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-gray-400 mb-2">Date</div>
              <div className="text-white font-semibold text-lg">{appointment.date}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-2">Time</div>
              <div className="text-white font-semibold text-lg">{appointment.time}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-2">Duration</div>
              <div className="text-white font-semibold text-lg">{appointment.duration} minutes</div>
            </div>
            <div>
              <div className="text-gray-400 mb-2">Type</div>
              <div className="text-white font-semibold text-lg">{appointment.type}</div>
            </div>
          </div>
          
          {appointment.notes && (
            <div className="mt-6">
              <div className="text-gray-400 mb-2">Notes</div>
              <div className="text-white bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                {appointment.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AppointmentForm = () => {
    const [formData, setFormData] = useState(editingAppointment || {
      patientId: '',
      doctorId: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: '30',
      type: 'Consultation',
      status: 'Pending',
      priority: 'Normal',
      notes: ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));
    const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));

    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h3>
            <p className="text-gray-400 mt-1">Complete all appointment details</p>
          </div>
          <button
            onClick={() => { setShowForm(false); setEditingAppointment(null); }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Selection */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
              <h4 className="text-lg font-bold text-white mb-4">Patient Information</h4>
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
              
              {selectedPatient && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-blue-500/30">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3">
                      <span className="text-blue-300 font-bold">
                        {selectedPatient.firstName?.charAt(0) || ''}{selectedPatient.lastName?.charAt(0) || ''}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                      <p className="text-sm text-gray-400">{selectedPatient.medicalCondition || 'General consultation'}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Age:</div>
                    <div className="font-semibold text-white">{selectedPatient.age} years</div>
                    <div className="text-gray-500">Phone:</div>
                    <div className="font-semibold text-white">{selectedPatient.phone}</div>
                    <div className="text-gray-500">Last Visit:</div>
                    <div className="font-semibold text-white">{selectedPatient.lastVisit}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Selection */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-2xl p-6 border border-emerald-500/20">
              <h4 className="text-lg font-bold text-white mb-4">Doctor Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Select Doctor *</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" className="bg-[#1c2230]">Choose a doctor...</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id} className="bg-[#1c2230]">
                      Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedDoctor && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mr-3">
                      <span className="text-emerald-300 font-bold">
                        {selectedDoctor.firstName?.charAt(0) || ''}{selectedDoctor.lastName?.charAt(0) || ''}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                      <p className="text-sm text-gray-400">{selectedDoctor.specialization}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Schedule:</div>
                    <div className="font-semibold text-white">{selectedDoctor.schedule}</div>
                    <div className="text-gray-500">Fee:</div>
                    <div className="font-semibold text-white">${selectedDoctor.consultationFee || 'N/A'}</div>
                    <div className="text-gray-500">Status:</div>
                    <div className="font-semibold text-white">{selectedDoctor.status}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
            <h4 className="text-lg font-bold text-white mb-6">Appointment Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (min)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15" className="bg-[#1c2230]">15 minutes</option>
                  <option value="30" className="bg-[#1c2230]">30 minutes</option>
                  <option value="45" className="bg-[#1c2230]">45 minutes</option>
                  <option value="60" className="bg-[#1c2230]">60 minutes</option>
                  <option value="90" className="bg-[#1c2230]">90 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Appointment Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Consultation" className="bg-[#1c2230]">Consultation</option>
                  <option value="Follow-up" className="bg-[#1c2230]">Follow-up</option>
                  <option value="Check-up" className="bg-[#1c2230]">Check-up</option>
                  <option value="Emergency" className="bg-[#1c2230]">Emergency</option>
                  <option value="Procedure" className="bg-[#1c2230]">Procedure</option>
                  <option value="Lab Test" className="bg-[#1c2230]">Lab Test</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending" className="bg-[#1c2230]">Pending</option>
                  <option value="Confirmed" className="bg-[#1c2230]">Confirmed</option>
                  <option value="Cancelled" className="bg-[#1c2230]">Cancelled</option>
                  <option value="Completed" className="bg-[#1c2230]">Completed</option>
                  <option value="No Show" className="bg-[#1c2230]">No Show</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority || 'Normal'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low" className="bg-[#1c2230]">Low</option>
                  <option value="Normal" className="bg-[#1c2230]">Normal</option>
                  <option value="High" className="bg-[#1c2230]">High</option>
                  <option value="Emergency" className="bg-[#1c2230]">Emergency</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 resize-none"
                placeholder="Additional notes for this appointment..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingAppointment(null); }}
              className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30"
            >
              {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
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
          <h2 className="text-3xl font-bold text-white">Appointments</h2>
          <p className="text-gray-400 mt-1">Manage and schedule patient appointments</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-blue-500/30"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Schedule Appointment
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search by patient, doctor, or notes..."
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
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-[#1c2230]">All Status</option>
              <option value="Pending" className="bg-[#1c2230]">Pending</option>
              <option value="Confirmed" className="bg-[#1c2230]">Confirmed</option>
              <option value="Completed" className="bg-[#1c2230]">Completed</option>
              <option value="Cancelled" className="bg-[#1c2230]">Cancelled</option>
              <option value="No Show" className="bg-[#1c2230]">No Show</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-[#1c2230]">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id} className="bg-[#1c2230]">
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => { 
              setFilterDate(''); 
              setFilterStatus(''); 
              setSelectedDoctor(''); 
              setSearchTerm(''); 
            }}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            Clear All Filters
          </button>
          <div className="text-sm text-gray-400">
            Showing {filteredAppointments.length} appointments
          </div>
        </div>
      </div>

      {/* Appointment Form or List */}
      {showForm ? (
        <AppointmentForm />
      ) : viewingAppointment ? (
        <AppointmentDetailView 
          appointment={viewingAppointment} 
          onClose={() => setViewingAppointment(null)}
          onMakeBill={onMakeBill}
        />
      ) : (
        <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-6 py-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-gray-300">
                <span className="font-bold text-white">{filteredAppointments.length}</span> appointments found
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-emerald-400">{appointments.filter(a => a.status === 'Confirmed').length} Confirmed</span> • 
                <span className="text-amber-400 ml-2">{appointments.filter(a => a.status === 'Pending').length} Pending</span> • 
                <span className="text-blue-400 ml-2">{appointments.filter(a => a.status === 'Completed').length} Completed</span>
              </div>
            </div>
          </div>
          
          {/* Appointments List */}
          <div className="overflow-x-auto">
            {filteredAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient & Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type & Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status & Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAppointments.map(appointment => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    const statusColor = getStatusColor(appointment.status);
                    const priorityColor = getPriorityColor(appointment.priority);
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-blue-500/30">
                              <span className="text-blue-300 font-bold">
                                {patient?.firstName?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-white">{appointment.patientName}</div>
                              <div className="text-sm text-gray-400">{appointment.doctorName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white">{appointment.date}</div>
                          <div className="text-sm text-gray-400">{appointment.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 w-fit border border-blue-500/30">
                              {appointment.type}
                            </span>
                            <span className="text-sm text-gray-400">{appointment.duration} minutes</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                              {appointment.status}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColor}`}>
                              {appointment.priority || 'Normal'} Priority
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleView(appointment)}
                              className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors border border-blue-500/30"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleEdit(appointment)}
                              className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors border border-emerald-500/30"
                            >
                              Edit
                            </button>
                            {appointment.status === 'Confirmed' && (
                              <button 
                                onClick={() => handleCompleteAppointment(appointment)}
                                className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors border border-emerald-500/30"
                              >
                                Complete
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(appointment.id)}
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
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-gray-400">No appointments found matching your criteria</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 font-medium"
                >
                  Schedule your first appointment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;