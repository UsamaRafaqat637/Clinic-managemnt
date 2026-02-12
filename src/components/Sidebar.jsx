// components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, medicines = [] }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'patients', label: 'Patient Records', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'doctors', label: 'Doctors', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
   
    { id: 'medicines', label: 'Medicines', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'billing', label: 'Billing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'reports', label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const appointments = JSON.parse(localStorage.getItem('clinic-appointments')) || [];
  const todayAppointments = appointments.filter(a => a.date === today);

  return (
    <div className="lg:w-64 mb-6 lg:mb-0">
      <nav className="bg-gradient-to-b from-[#1c2230] to-[#0f172a] rounded-2xl shadow-xl p-6 mb-6 border border-gray-700">
        <div className="mb-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto flex items-center justify-center shadow-lg mb-3 overflow-hidden border-4 border-gray-700">
              <img 
                src="/clinic.jpg" 
                alt="Clinic Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <h3 className="text-center font-bold text-white text-xl">Medical Healthcare</h3>
            <p className="text-center text-emerald-400 text-sm font-medium">Clinic Management System</p>
          </div>
        </div>
        
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg transform -translate-y-0.5 border border-blue-500/30' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === item.id ? "2.5" : "2"} d={item.icon} />
                </svg>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-blue-900/30 to-emerald-900/20 rounded-2xl shadow-xl p-6 text-white border border-gray-700">
        <h3 className="font-bold mb-4 text-lg">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-gray-700">
            <span className="text-gray-400">Total Patients</span>
            <span className="font-bold text-xl text-white">
              {JSON.parse(localStorage.getItem('clinic-patients'))?.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-gray-700">
            <span className="text-gray-400">Today's Appointments</span>
            <span className="font-bold text-xl text-white">{todayAppointments.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-gray-700">
            <span className="text-gray-400">Available Medicines</span>
            <span className="font-bold text-xl text-white">{medicines?.length || 0}</span>
          </div>
          <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600/30 to-emerald-600/30 hover:from-blue-600/50 hover:to-emerald-600/50 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm border border-gray-700 hover:border-emerald-500/30">
            Quick Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;