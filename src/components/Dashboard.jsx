// import React from 'react';
import { Link } from 'react-router-dom';
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // For now, using localStorage data - will be replaced with API data
  const patients = JSON.parse(localStorage.getItem('clinic-patients')) || [];
  const appointments = JSON.parse(localStorage.getItem('clinic-appointments')) || [];
  const doctors = JSON.parse(localStorage.getItem('clinic-doctors')) || [];
  const bills = JSON.parse(localStorage.getItem('clinic-bills')) || [];
  const medicines = JSON.parse(localStorage.getItem('clinic-medicines')) || [];

  const todayAppointments = appointments.filter(a => a.date === today);
  const activePatients = patients.filter(p => p.status === 'Active');
  const pendingBills = bills.filter(b => b.status === 'Pending');
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.total || 0), 0);
  const lowStockMedicines = medicines.filter(m => m.stockStatus === 'Low Stock');
//   useEffect(() => {
//   const isAuth = localStorage.getItem("isLoggedIn");

//   if (!isAuth) {
//     navigate("/login");
//   }
// }, []);

  // Main stats cards
  const mainStats = [
    { 
      title: 'Total Patients', 
      value: patients.length,
      change: '+12%',
      icon: '👤',
      color: 'bg-gradient-to-r from-blue-600 to-blue-800',
      link: '/patients'
    },
    { 
      title: 'Active Doctors', 
      value: doctors.length,
      change: '+5%',
      icon: '👨‍⚕️',
      color: 'bg-gradient-to-r from-emerald-600 to-emerald-800',
      link: '/doctors'
    },
    { 
      title: "Today's Appointments", 
      value: todayAppointments.length,
      change: '+8%',
      icon: '📅',
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      link: '/appointments'
    },
    { 
      title: 'Monthly Revenue', 
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15%',
      icon: '💰',
      color: 'bg-gradient-to-r from-emerald-600 to-emerald-800',
      link: '/billing'
    },
  ];

  return (
    <div>
      {/* Welcome Section - Top of the page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your clinic today.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-gradient-to-r from-[#1c2230] to-[#0f172a] rounded-2xl shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-xl text-white`}>
                {stat.icon}
              </div>
              <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-700">
                {stat.change}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-300">{stat.title}</h3>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </div>
            
            <Link 
              to={stat.link}
              className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300"
            >
              View details →
            </Link>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-gradient-to-r from-[#1c2230] to-[#0f172a] rounded-2xl shadow-xl p-6 border border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Today's Appointments</h2>
          <Link to="/appointments" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        {todayAppointments.length > 0 ? (
          <div className="space-y-4">
            {todayAppointments.slice(0, 5).map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:bg-gray-900/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {appointment.time?.split(':')[0] || '--'}
                      </div>
                      <div className="text-xs text-blue-300">
                        {appointment.time?.split(':')[1] || '--'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{appointment.patientName}</p>
                    <p className="text-gray-400 text-sm">{appointment.doctorName}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'Confirmed'
                          ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700'
                          : 'bg-amber-900/30 text-amber-400 border border-amber-700'
                      }`}>
                        {appointment.status}
                      </span>
                      <span className="text-xs text-gray-500">{appointment.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">Duration</span>
                  <p className="text-sm font-semibold text-white">{appointment.duration || '30'} min</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📅</span>
            </div>
            <p className="text-gray-500">No appointments scheduled for today</p>
          </div>
        )}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="bg-gradient-to-r from-[#1c2230] to-[#0f172a] rounded-2xl shadow-xl p-6 border border-gray-700 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Patients</h2>
            <Link to="/patients" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          {patients.length > 0 ? (
            <div className="space-y-4">
              {patients.slice(0, 3).map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{patient.firstName} {patient.lastName}</p>
                      <p className="text-gray-400 text-sm">{patient.medicalCondition || 'General Consultation'}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">
                          📅 {patient.lastVisit || 'No visits'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          patient.status === 'Active'
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700'
                            : 'bg-red-900/30 text-red-400 border border-red-700'
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{patient.age} years</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No patients found</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-[#1c2230] to-[#0f172a] rounded-2xl shadow-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            {[
              { label: 'Schedule Appointment', icon: '📅', color: 'from-blue-600 to-blue-800', link: '/appointments' },
              { label: 'Add New Patient', icon: '👤', color: 'from-emerald-600 to-emerald-800', link: '/patients' },
              { label: 'Create Prescription', icon: '💊', color: 'from-blue-600 to-cyan-600', link: '/prescriptions' },
              { label: 'Generate Bill', icon: '💰', color: 'from-emerald-600 to-emerald-800', link: '/billing' },
            ].map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`block bg-gradient-to-r ${action.color} rounded-xl p-4 text-white hover:opacity-90 transition-opacity border border-white/10`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{action.icon}</div>
                  <span className="font-medium">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;