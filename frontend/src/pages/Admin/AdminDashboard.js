import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link to="/admin/add-doctor" className="block bg-blue-500 text-white p-4 rounded">
          Add New Doctor
        </Link>
        <Link to="/admin/staff-list" className="block bg-blue-500 text-white p-4 rounded">
          View All Staff
        </Link>
        <Link to="/admin/staff-schedule" className="block bg-blue-500 text-white p-4 rounded">
          View Staff Schedule
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
