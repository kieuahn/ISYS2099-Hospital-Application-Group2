import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import CenterContentPage from "../../components/Layout/CenterContentPage";
import { useNavigate } from "react-router-dom"; 
import { useState, useEffect } from 'react';


const StaffDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [staff, setStaff] = useState([]);

  const navigate = useNavigate();  // Initialize the navigate function

  if (!auth) {
    return <div>Loading...</div>;  // Handle the case where auth is not ready yet
  }
  console.log("User Role:",  auth.role); //debug

  // Function to handle workload navigation
  const handleViewWorkload = (staff_id) => {
    if (staff_id) {
      navigate(`/workload/${staff_id}`); // Navigates to WorkloadPage with staff_id
    } else {
      navigate('/workload'); // If staff_id is not provided, navigate to general workload page
    }
  };
  const handleViewPatients = () => {
    navigate('/patients'); // This route should take you to the PatientList component
  };

return (
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-xl font-bold mb-6">Staff Dashboard</h1>

    {/* Shared Dashboard Overview */}
    <div className="grid grid-cols-4 gap-6 mb-8">
      {/* Total Staff */}
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-sm font-medium mb-2">Total Staff</h2>
        <p className="text-2xl font-bold">56</p>
      </div>
      {/* Doctors Available */}
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-sm font-medium mb-2">Doctors Available</h2>
        <p className="text-2xl font-bold">12</p>
      </div>
      {/* Total Patients */}
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-sm font-medium mb-2">Total Patients</h2>
        <p className="text-2xl font-bold">256</p>
      </div>
      {/* Appointments Today */}
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-sm font-medium mb-2">Appointments Today</h2>
        <p className="text-2xl font-bold">8</p>
      </div>
    </div>

    {/* Role-Specific Components */}
    {auth.role === "Admin" && (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Admin Controls</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={() => navigate("/admin/staff-list")}
          >
            Manage All Staff
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleViewWorkload(staff.staff_id)}
          >
            View Workload
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hhover:bg-blue-600"
            onClick={handleViewPatients}
          >
            View Patient List
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/doctor-schedules")}
          >
            View Doctor Schedules
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={() => navigate('/doctor-performance')}
          >
            View Doctor Performance Ratings
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/payment-report')}
          >
            View Payment Report
          </button>
        </div>
      </div>
    )}

    {auth.role === "Manager" && (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Manager Controls</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={() => navigate("/manager/staff-list")}
          >
            View Supervised Staff
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleViewWorkload(staff.staff_id)}
          >
            View Workload
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/doctor-schedules")}
          >
            View Doctor Schedules
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={() => navigate('/doctor-performance')}
          >
            View Doctor Performance Ratings
          </button>
        </div>
      </div>
    )}
  </div>
);
};


export default StaffDashboard;
