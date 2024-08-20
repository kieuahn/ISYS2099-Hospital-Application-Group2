import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
// import ErrorPage from "./pages/ErrorPage";

const RoleRouting = () => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }
  console.log("Authenticated Role:", auth.role);

  // Redirect based on role
  switch (auth.role) {
    case "patient":
      return <PatientDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return;
  }
};

export default RoleRouting;
