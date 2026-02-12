// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Refs for handling clicks outside
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const notifications = [
    { id: 1, message: 'New appointment scheduled', time: '10 min ago', type: 'appointment' },
    { id: 2, message: 'Lab results received', time: '1 hour ago', type: 'lab' },
    { id: 3, message: 'Bill payment received', time: '2 hours ago', type: 'payment' },
    { id: 4, message: 'Patient check-in reminder', time: '3 hours ago', type: 'reminder' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'GU';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    return `${user.firstName} ${user.lastName}`;
  };

  // Get user role display
  const getUserRole = () => {
    if (!user) return 'Guest';
    const roleMap = {
      'admin': 'System Administrator',
      'doctor': 'Medical Doctor',
      'receptionist': 'Receptionist',
      'staff': 'Staff Member'
    };
    return roleMap[user.role] || user.role;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment': return '📅';
      case 'lab': return '🧪';
      case 'payment': return '💰';
      case 'reminder': return '⏰';
      default: return '📢';
    }
  };

  // If no user, don't render the header
  if (!user) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-blue-800 to-teal-800 shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
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
            <div>
              <h1 className="text-xl font-bold text-white">Medical Healthcare</h1>
              <p className="text-blue-100 text-sm">Complete Healthcare Management</p>
            </div>
          </div>
          
          {/* Right Section - Search, Notifications, User */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search patients, doctors, records..." 
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
              />
              <div className="absolute left-3 top-2.5">
                <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center text-lg mr-3">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 text-center border-t border-gray-100">
                    <Link 
                      to="/appointments" 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      onClick={() => setShowNotifications(false)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-lg">{getUserInitials()}</span>
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                
                {/* User Info - Hidden on mobile, shown on desktop */}
                <div className="hidden md:block text-left">
                  <p className="text-white font-semibold text-sm leading-tight">{getUserDisplayName()}</p>
                  <p className="text-blue-100 text-xs">{getUserRole()}</p>
                </div>
                
                {/* Dropdown arrow */}
                <svg className={`w-5 h-5 text-white transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 animate-fadeIn">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">{getUserInitials()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-600">{getUserRole()}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">My Profile</p>
                        <p className="text-xs text-gray-500">View and edit your profile</p>
                      </div>
                    </button>
                    
                    <Link 
                      to="/settings"
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Settings</p>
                        <p className="text-xs text-gray-500">Manage your preferences</p>
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Logout</p>
                          <p className="text-xs text-gray-500">Sign out of your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Online</p>
                        <p className="text-sm font-semibold text-gray-800">24/7</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Patients</p>
                        <p className="text-sm font-semibold text-gray-800">256</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today</p>
                        <p className="text-sm font-semibold text-gray-800">42</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;