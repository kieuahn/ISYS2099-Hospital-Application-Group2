// src/components/NavBar.js (Frontend)
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const NavBar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Hospital Management System</h1>
      <nav className="flex items-center space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        {auth && (
          <div className="flex items-center space-x-4">
            <span className="font-semibold">
              Welcome, {auth.name}!
            </span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
