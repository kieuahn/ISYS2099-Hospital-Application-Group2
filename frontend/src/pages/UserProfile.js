// src/pages/UserProfile.js
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext); // Assuming user data is stored in context

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
        <div className="space-y-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Department:</strong> {user.department}</p>
          {/* Add more fields as necessary */}
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;