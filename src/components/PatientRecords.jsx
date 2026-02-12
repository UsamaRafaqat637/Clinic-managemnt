import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PatientForm from './PatientForm';

const PatientRecords = () => {
  const { API } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medicalConditions, setMedicalConditions] = useState([]);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
    fetchMedicalConditions();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await API.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback to localStorage
      const localPatients = JSON.parse(localStorage.getItem('clinic-patients')) || [];
      setPatients(localPatients);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalConditions = async () => {
    try {
      const response = await API.get('/medical-conditions');
      setMedicalConditions(response.data);
    } catch (error) {
      console.error('Error fetching medical conditions:', error);
      // Default conditions
      setMedicalConditions([
        'Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Heart Disease',
        'Respiratory Infection', 'Gastrointestinal Issues', 'Neurological Disorders',
        'General Consultation', 'Post-Operative Care'
      ]);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleView = (patient) => {
    setViewingPatient(patient);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await API.delete(`/patients/${id}`);
        setPatients(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting patient:', error);
        // Fallback to local state
        const updatedPatients = patients.filter(p => p.id !== id);
        setPatients(updatedPatients);
        localStorage.setItem('clinic-patients', JSON.stringify(updatedPatients));
      }
    }
  };

  const handleSubmit = async (patientData) => {
    try {
      if (editingPatient) {
        const response = await API.put(`/patients/${editingPatient.id}`, patientData);
        const updatedPatient = response.data;
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
      } else {
        const response = await API.post('/patients', patientData);
        const newPatient = response.data;
        setPatients(prev => [...prev, newPatient]);
      }
      setShowForm(false);
      setEditingPatient(null);
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient. Please try again.');
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      (patient.firstName && patient.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.lastName && patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.cnic && patient.cnic.includes(searchTerm)) ||
      (patient.phone && patient.phone.includes(searchTerm));
    
    const matchesCondition = filterCondition === '' || 
      patient.medicalCondition === filterCondition;
    
    return matchesSearch && matchesCondition;
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const PatientDetailView = ({ patient, onClose }) => {
    return (
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-8 border border-gray-700">
        {/* ... (keep the existing PatientDetailView JSX structure) */}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Patient Records</h2>
          <p className="text-gray-400 mt-1">Manage all patient information and medical records</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center border border-blue-500/30"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Patient
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ... (keep existing search and filter UI) */}
        </div>
      </div>

      {/* Patient Form or List */}
      {showForm ? (
        <PatientForm 
          patient={editingPatient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          medicalConditions={medicalConditions}
          bloodGroups={bloodGroups}
        />
      ) : viewingPatient ? (
        <PatientDetailView 
          patient={viewingPatient} 
          onClose={() => setViewingPatient(null)}
        />
      ) : (
        <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Table with patients data */}
          {/* ... (keep existing table structure) */}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;