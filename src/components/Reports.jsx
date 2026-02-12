// components/Reports.jsx
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Reports = ({ 
  patients = [], 
  appointments = [], 
  doctors = [], 
  bills = [], 
  prescriptions = [], 
  medicalConditions = [], 
  medicines = [] 
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reportType, setReportType] = useState('patients');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const reportRef = useRef();

  // Patient Statistics
  const patientStats = {
    total: patients.length,
    byGender: patients.reduce((acc, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, {}),
    byCondition: patients.reduce((acc, p) => {
      const condition = p.medicalCondition || 'Unknown';
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {}),
    byAgeGroup: patients.reduce((acc, p) => {
      let group;
      if (p.age <= 18) group = '0-18';
      else if (p.age <= 35) group = '19-35';
      else if (p.age <= 50) group = '36-50';
      else if (p.age <= 65) group = '51-65';
      else group = '65+';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {}),
    active: patients.filter(p => p.status === 'Active').length,
    inactive: patients.filter(p => p.status !== 'Active').length,
    newThisMonth: patients.filter(p => {
      const createdAt = new Date(p.createdAt || new Date());
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      return createdAt >= monthStart;
    }).length
  };

  // Appointment Statistics
  const appointmentStats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    upcoming: appointments.filter(a => new Date(a.date) > new Date()).length,
    byStatus: appointments.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {}),
    byType: appointments.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {}),
    byDoctor: doctors.map(doctor => ({
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      count: appointments.filter(a => a.doctorId === doctor.id).length
    })).sort((a, b) => b.count - a.count)
  };

  // Billing Statistics
  const billingStats = {
    totalRevenue: bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.total || 0), 0),
    pendingAmount: bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + (b.total || 0), 0),
    partiallyPaid: bills.filter(b => b.status === 'Partially Paid').reduce((sum, b) => sum + (b.total || 0), 0),
    averageBill: bills.length > 0 ? bills.reduce((sum, b) => sum + (b.total || 0), 0) / bills.length : 0,
    byMonth: bills.reduce((acc, b) => {
      const month = b.date?.split('-')[1] || '01';
      acc[month] = (acc[month] || 0) + (b.total || 0);
      return acc;
    }, {}),
    topServices: bills.flatMap(b => b.items?.filter(i => i.type === 'service') || [])
      .reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
      }, {}),
    topMedicines: bills.flatMap(b => b.items?.filter(i => i.type === 'medicine') || [])
      .reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
      }, {})
  };

  // Medicine Statistics
  const medicineStats = {
    total: medicines.length,
    inStock: medicines.filter(m => m.stockStatus === 'In Stock').length,
    lowStock: medicines.filter(m => m.stockStatus === 'Low Stock').length,
    outOfStock: medicines.filter(m => m.stockStatus === 'Out of Stock').length,
    totalValue: medicines.reduce((sum, m) => sum + ((m.quantity || 0) * (m.retailPrice || 0)), 0),
    byCategory: medicines.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    }, {})
  };

  // Generate PDF Report
  const generatePDF = () => {
    const input = reportRef.current;
    html2canvas(input, { 
      scale: 2,
      backgroundColor: '#1c2230'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${selectedPatient ? selectedPatient.firstName + '_' + selectedPatient.lastName : 'clinic'}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    });
  };

  const PatientReport = ({ patient }) => (
    <div ref={reportRef} className="bg-[#1c2230] p-8 space-y-8 border border-gray-700 rounded-2xl">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-500 pb-6">
        <h1 className="text-3xl font-bold text-blue-400">MediCare Pro Clinic</h1>
        <p className="text-gray-400 mt-2">Complete Medical Report</p>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
          <p>|</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Patient Information */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Patient Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p><strong className="text-gray-300">Name:</strong> <span className="text-white">{patient.firstName} {patient.lastName}</span></p>
            <p><strong className="text-gray-300">Patient ID:</strong> <span className="text-white">PAT-{patient.id.toString().padStart(4, '0')}</span></p>
            <p><strong className="text-gray-300">Age:</strong> <span className="text-white">{patient.age} years</span></p>
            <p><strong className="text-gray-300">Gender:</strong> <span className="text-white">{patient.gender}</span></p>
          </div>
          <div className="space-y-3">
            <p><strong className="text-gray-300">CNIC:</strong> <span className="text-white">{patient.cnic}</span></p>
            <p><strong className="text-gray-300">Phone:</strong> <span className="text-white">{patient.phone}</span></p>
            <p><strong className="text-gray-300">Email:</strong> <span className="text-white">{patient.email || 'N/A'}</span></p>
            <p><strong className="text-gray-300">Blood Group:</strong> <span className="text-white">{patient.bloodGroup || 'Unknown'}</span></p>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Medical Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p><strong className="text-gray-300">Medical Condition:</strong> <span className="text-white">{patient.medicalCondition || 'N/A'}</span></p>
            <p><strong className="text-gray-300">Blood Pressure:</strong> <span className="text-white">{patient.bloodPressure || 'N/A'}</span></p>
            <p><strong className="text-gray-300">Weight:</strong> <span className="text-white">{patient.weight || 'N/A'}</span></p>
            <p><strong className="text-gray-300">Height:</strong> <span className="text-white">{patient.height || 'N/A'}</span></p>
          </div>
          <div className="space-y-3">
            <p><strong className="text-gray-300">Allergies:</strong> <span className="text-white">{patient.allergies || 'None'}</span></p>
            <p><strong className="text-gray-300">Emergency Contact:</strong> <span className="text-white">{patient.emergencyContact || 'N/A'}</span></p>
            <p><strong className="text-gray-300">Last Visit:</strong> <span className="text-white">{patient.lastVisit}</span></p>
            <p><strong className="text-gray-300">Next Appointment:</strong> <span className="text-white">{patient.nextAppointment || 'Not Scheduled'}</span></p>
          </div>
        </div>
      </div>

      {/* Symptoms, Diagnosis & Treatment */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Medical Details</h2>
        <div className="space-y-4">
          <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
            <strong className="text-gray-300">Symptoms:</strong>
            <p className="mt-2 text-white">{patient.symptoms || 'N/A'}</p>
          </div>
          <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
            <strong className="text-gray-300">Diagnosis:</strong>
            <p className="mt-2 text-white">{patient.diagnosis || 'N/A'}</p>
          </div>
          <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
            <strong className="text-gray-300">Treatment Plan:</strong>
            <p className="mt-2 text-white">{patient.treatmentPlan || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-700 pt-6 mt-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="font-bold text-gray-300">Doctor's Signature</p>
            <div className="mt-12 border-t border-gray-600 pt-4">
              <p className="text-white">Dr. ___________________</p>
              <p className="text-sm text-gray-400">Medical Practitioner</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-300">Clinic Stamp</p>
            <div className="mt-12 p-4 border-2 border-dashed border-gray-600 rounded-lg">
              <p className="text-white font-bold">MediCare Pro Clinic</p>
              <p className="text-sm text-gray-400">License: MED-LIC-2023-001</p>
              <p className="text-sm text-gray-400">Official Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Generate Analytics Report
  const AnalyticsReport = () => (
    <div ref={reportRef} className="bg-[#1c2230] p-8 space-y-8 border border-gray-700 rounded-2xl">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-500 pb-6">
        <h1 className="text-3xl font-bold text-blue-400">MediCare Pro Clinic</h1>
        <p className="text-gray-400 mt-2">Analytics Report - {dateRange.start} to {dateRange.end}</p>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
          <p>Generated on: {new Date().toLocaleDateString()}</p>
          <p>|</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-4 rounded-xl border border-blue-500/20">
            <p className="text-2xl font-bold text-white">{patientStats.total}</p>
            <p className="text-sm text-gray-400">Total Patients</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 p-4 rounded-xl border border-emerald-500/20">
            <p className="text-2xl font-bold text-white">{appointmentStats.total}</p>
            <p className="text-sm text-gray-400">Total Appointments</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-4 rounded-xl border border-purple-500/20">
            <p className="text-2xl font-bold text-white">${billingStats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Revenue</p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 p-4 rounded-xl border border-amber-500/20">
            <p className="text-2xl font-bold text-white">{medicineStats.total}</p>
            <p className="text-sm text-gray-400">Medicines in Stock</p>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Demographics */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Patient Demographics</h3>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
            <div className="space-y-4">
              {Object.entries(patientStats.byGender).map(([gender, count]) => (
                <div key={gender} className="flex items-center">
                  <span className="w-24 text-gray-300">{gender}</span>
                  <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                      style={{ width: `${(count / patientStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Conditions */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Top Medical Conditions</h3>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
            <div className="space-y-4">
              {Object.entries(patientStats.byCondition)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([condition, count]) => (
                  <div key={condition} className="flex items-center">
                    <span className="w-48 text-gray-300 truncate">{condition}</span>
                    <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" 
                        style={{ width: `${(count / patientStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 font-semibold text-white">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Revenue Analysis</h3>
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Revenue</span>
              <span className="text-2xl font-bold text-emerald-400">${billingStats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pending Amount</span>
              <span className="text-xl font-bold text-amber-400">${billingStats.pendingAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Average Bill Amount</span>
              <span className="text-xl font-bold text-blue-400">${billingStats.averageBill.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-700 pt-6 mt-8">
        <div className="text-center">
          <p className="text-gray-400">This report was generated by MediCare Pro Clinic Analytics System</p>
          <p className="text-sm text-gray-500 mt-2">For internal use only</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-gray-400 mt-1">Generate detailed reports and analytics</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={generatePDF}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium shadow-lg border border-emerald-500/30 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setReportType('patients')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              reportType === 'patients' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            👥 Patient Reports
          </button>
          <button
            onClick={() => setReportType('appointments')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              reportType === 'appointments' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            📅 Appointment Reports
          </button>
          <button
            onClick={() => setReportType('billing')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              reportType === 'billing' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            💰 Billing Reports
          </button>
          <button
            onClick={() => setReportType('analytics')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              reportType === 'analytics' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setReportType('medicines')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              reportType === 'medicines' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/30' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            💊 Medicine Reports
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                const lastMonth = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
                setDateRange({ start: lastMonth, end: today });
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Individual Patient Report */}
      {selectedPatient ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              Patient Report: {selectedPatient.firstName} {selectedPatient.lastName}
            </h3>
            <div className="flex space-x-3">
              <button 
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Back to Reports
              </button>
              <button 
                onClick={generatePDF}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg border border-blue-500/30"
              >
                Generate PDF
              </button>
            </div>
          </div>
          <PatientReport patient={selectedPatient} />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{patientStats.total}</p>
                  <p className="text-blue-200">Total Patients</p>
                  <p className="text-xs text-blue-300 mt-1">{patientStats.newThisMonth} new this month</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-6 text-white border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{appointmentStats.total}</p>
                  <p className="text-emerald-200">Total Appointments</p>
                  <p className="text-xs text-emerald-300 mt-1">{appointmentStats.upcoming} upcoming</p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">${billingStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-purple-200">Total Revenue</p>
                  <p className="text-xs text-purple-300 mt-1">${billingStats.pendingAmount.toLocaleString()} pending</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-xl p-6 text-white border border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{medicineStats.total}</p>
                  <p className="text-amber-200">Medicines</p>
                  <p className="text-xs text-amber-300 mt-1">{medicineStats.lowStock} low stock</p>
                </div>
                <div className="text-3xl">💊</div>
              </div>
            </div>
          </div>

          {/* Report Content Based on Type */}
          {reportType === 'patients' && (
            <div className="bg-[#1c2230] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
              {/* Stats Header */}
              <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-6 py-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Patient Medical Reports</h3>
                  <div className="flex space-x-3">
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" className="bg-[#1c2230]">All Conditions</option>
                      {medicalConditions.map(condition => (
                        <option key={condition} value={condition} className="bg-[#1c2230]">{condition}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Medical Info</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vital Signs</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {patients
                      .filter(p => !selectedCondition || p.medicalCondition === selectedCondition)
                      .map(patient => (
                        <tr key={patient.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-blue-500/30">
                                <span className="text-blue-300 font-bold">
                                  {patient.firstName?.charAt(0) || ''}{patient.lastName?.charAt(0) || ''}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">{patient.firstName} {patient.lastName}</div>
                                <div className="text-sm text-gray-400">ID: PAT-{patient.id.toString().padStart(4, '0')}</div>
                                <div className="text-sm text-gray-400">{patient.age} years • {patient.gender}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {patient.medicalCondition || 'N/A'}
                              </span>
                              <div className="text-sm text-gray-400">{patient.diagnosis || 'No diagnosis'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-gray-400">BP: </span>
                                <span className="font-semibold text-white">{patient.bloodPressure || 'N/A'}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-400">Weight: </span>
                                <span className="font-semibold text-white">{patient.weight || 'N/A'}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-400">Blood Group: </span>
                                <span className="font-semibold text-white">{patient.bloodGroup || 'Unknown'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{patient.lastVisit}</div>
                            <div className="text-sm text-gray-400">Next: {patient.nextAppointment || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setSelectedPatient(patient)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
                              >
                                View Report
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setTimeout(generatePDF, 500);
                                }}
                                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                              >
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                
                {patients.filter(p => !selectedCondition || p.medicalCondition === selectedCondition).length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-400">No patients found with the selected condition</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Dashboard */}
          {reportType === 'analytics' && (
            <>
              <AnalyticsReport />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appointment Status */}
                <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-6">Appointment Status</h3>
                  <div className="space-y-4">
                    {Object.entries(appointmentStats.byStatus).map(([status, count]) => {
                      let color = 'from-blue-500 to-blue-600';
                      if (status === 'Completed') color = 'from-emerald-500 to-emerald-600';
                      if (status === 'Cancelled') color = 'from-red-500 to-red-600';
                      if (status === 'Pending') color = 'from-amber-500 to-amber-600';
                      
                      return (
                        <div key={status} className="flex items-center">
                          <span className="w-32 text-gray-300">{status}</span>
                          <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${color} rounded-full`}
                              style={{ width: `${(count / appointmentStats.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 font-semibold text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Doctor Performance */}
                <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-6">Doctor Appointments</h3>
                  <div className="space-y-4">
                    {appointmentStats.byDoctor.slice(0, 5).map((doctor, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-48 text-gray-300 truncate">{doctor.name}</span>
                        <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                            style={{ width: `${(doctor.count / Math.max(...appointmentStats.byDoctor.map(d => d.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 font-semibold text-white">{doctor.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Billing Reports */}
          {reportType === 'billing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6">Top Services</h3>
                <div className="space-y-4">
                  {Object.entries(billingStats.topServices)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([service, count]) => (
                      <div key={service} className="flex items-center">
                        <span className="w-48 text-gray-300 truncate">{service}</span>
                        <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(billingStats.topServices))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 font-semibold text-white">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6">Top Medicines</h3>
                <div className="space-y-4">
                  {Object.entries(billingStats.topMedicines)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([medicine, count]) => (
                      <div key={medicine} className="flex items-center">
                        <span className="w-48 text-gray-300 truncate">{medicine}</span>
                        <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(billingStats.topMedicines))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 font-semibold text-white">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Medicine Reports */}
          {reportType === 'medicines' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6">Stock Status</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">In Stock</span>
                    <span className="text-2xl font-bold text-emerald-400">{medicineStats.inStock}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Low Stock</span>
                    <span className="text-2xl font-bold text-amber-400">{medicineStats.lowStock}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Out of Stock</span>
                    <span className="text-2xl font-bold text-red-400">{medicineStats.outOfStock}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-gray-300">Total Stock Value</span>
                    <span className="text-2xl font-bold text-blue-400">${medicineStats.totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c2230] rounded-2xl shadow-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6">Medicine Categories</h3>
                <div className="space-y-4">
                  {Object.entries(medicineStats.byCategory)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center">
                        <span className="w-48 text-gray-300 truncate">{category}</span>
                        <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                            style={{ width: `${(count / medicineStats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 font-semibold text-white">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;