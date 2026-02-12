// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './components/Login';
// import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import PatientRecords from './components/PatientRecords';
import DoctorScheduling from './components/DoctorScheduling';
import Appointments from './components/Appointments';
import Billing from './components/Billing';
import Reports from './components/Reports';
import MedicinesInventory from './components/MedicinesInventory';
import Layout from './components/Layout';

function App() {
  return (
    // <Router>
    //   <AuthProvider>
    //     <Routes>
    //       {/* Public Routes */}
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/register" element={<Register />} />
          
    //       {/* Protected Routes wrapped in Layout */}
    //       <Route path="/" element={
    //         <ProtectedRoute>
    //           <Layout />
    //         </ProtectedRoute>
    //       }>
    //         <Route index element={<Navigate to="/dashboard" replace />} />
    //         <Route path="dashboard" element={<Dashboard />} />
    //         <Route path="patients" element={<PatientRecords />} />
    //         <Route path="doctors" element={<DoctorScheduling />} />
    //         <Route path="appointments" element={<Appointments />} />
    //         <Route path="billing" element={<Billing />} />
    //         <Route path="reports" element={<Reports />} />
    //         <Route path="medicines" element={<MedicinesInventory />} />
    //         <Route path="profile" element={<Profile />} />
    //         <Route path="*" element={<Navigate to="/dashboard" replace />} />
    //       </Route>
    //     </Routes>
    //   </AuthProvider>
    // </Router>


       <Router>
  <AuthProvider>
    <Routes>

      {/* Direct Layout */}
      <Route path="/" element={<Layout />}>

        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<PatientRecords />} />
        <Route path="doctors" element={<DoctorScheduling />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="billing" element={<Billing />} />
        <Route path="reports" element={<Reports />} />
        <Route path="medicines" element={<MedicinesInventory />} />
        <Route path="profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Route>

    </Routes>
  </AuthProvider>
</Router>


  );
}

export default App;