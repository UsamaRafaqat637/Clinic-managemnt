import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // All data states
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bills, setBills] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Update activeTab based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveTab(path);
  }, [location]);

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate('/login');
  //   }
  // }, [user, loading, navigate]);

  if (loading) {
  return (
    <div>Loading...</div>
  );
}

  // Load data from backend
  const loadData = async () => {
    if (!user) return;
    
    setLoadingData(true);
    try {
      // Load all data in parallel
      const [
        patientsRes,
        appointmentsRes,
        doctorsRes,
        billsRes,
        medicinesRes
      ] = await Promise.all([
        fetchData('/patients'),
        fetchData('/appointments'),
        fetchData('/doctors'),
        fetchData('/bills'),
        fetchData('/medicines')
      ]);
      
      setPatients(patientsRes || []);
      setAppointments(appointmentsRes || []);
      setDoctors(doctorsRes || []);
      setBills(billsRes || []);
      setMedicines(medicinesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage for development
      loadFromLocalStorage();
    } finally {
      setLoadingData(false);
    }
  };

  // Helper function to fetch data
  const fetchData = async (endpoint) => {
    try {
      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  };

  // Fallback to localStorage
  const loadFromLocalStorage = () => {
    try {
      setPatients(JSON.parse(localStorage.getItem('clinic-patients')) || []);
      setAppointments(JSON.parse(localStorage.getItem('clinic-appointments')) || []);
      setDoctors(JSON.parse(localStorage.getItem('clinic-doctors')) || []);
      setBills(JSON.parse(localStorage.getItem('clinic-bills')) || []);
      setMedicines(JSON.parse(localStorage.getItem('clinic-medicines')) || []);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // Initial load
  // useEffect(() => {
  //   if (user) {
  //     loadData();
  //   }
  // }, [user]);

  // CRUD Operations with API calls
  const addPatient = async (patientData) => {
    try {
      const response = await API.post('/patients', patientData);
      const newPatient = response.data;
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };

  const updatePatient = async (patientData) => {
    try {
      const response = await API.put(`/patients/${patientData.id}`, patientData);
      const updatedPatient = response.data;
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
      return updatedPatient;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  };

  const deletePatient = async (patientId) => {
    try {
      await API.delete(`/patients/${patientId}`);
      setPatients(prev => prev.filter(p => p.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  };

  // Similar functions for other entities (doctors, appointments, bills, medicines)
  // ... (Add similar CRUD functions for each entity)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Medical Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1c2230]">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-all"
          >
            {isSidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>

          {/* Sidebar */}
          <div className={`lg:w-64 ${isSidebarOpen ? 'fixed inset-0 z-30 lg:relative' : 'hidden lg:block'}`}>
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <div className={`h-full ${isSidebarOpen ? 'fixed left-0 top-0 z-40 w-64 lg:relative lg:w-auto' : ''}`}>
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsSidebarOpen(false);
                  navigate(`/${tab}`);
                }}
                medicines={medicines}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="rounded-2xl min-h-[calc(100vh-8rem)]">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white capitalize">
                      {activeTab === 'dashboard' ? 'Dashboard' : 
                       activeTab.replace(/([A-Z])/g, ' $1').trim()}
                    </h1>
                    <p className="text-gray-400 mt-2">
                      {activeTab === 'dashboard' && 'Overview of clinic operations and metrics'}
                      {activeTab === 'patients' && 'Manage patient records and medical history'}
                      {activeTab === 'doctors' && 'Manage medical staff and doctor schedules'}
                      {activeTab === 'appointments' && 'Schedule and manage patient appointments'}
                      {activeTab === 'medicines' && 'Manage pharmacy inventory and medications'}
                      {activeTab === 'billing' && 'Handle billing, invoices, and payments'}
                      {activeTab === 'reports' && 'Generate and view medical reports'}
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Last updated:</span>
                    <span className="text-sm font-medium text-gray-300">
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Breadcrumb */}
                <div className="flex items-center mt-4 text-sm text-gray-400">
                  <span className="text-blue-400">Medical Healthcare</span>
                  <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span className="capitalize text-white">{activeTab}</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="mt-8">
                {loadingData ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Outlet context={{ 
                    activeTab,
                    patients,
                    setPatients,
                    addPatient,
                    updatePatient,
                    deletePatient,
                    appointments,
                    setAppointments,
                    doctors,
                    setDoctors,
                    bills,
                    setBills,
                    medicines,
                    setMedicines,
                    loading: loadingData
                  }} />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>Medical Healthcare System v2.0 • Secure Patient Management Platform</p>
              <p className="mt-1">© {new Date().getFullYear()} All rights reserved. HIPAA Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;