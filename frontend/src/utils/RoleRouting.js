import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import ErrorPage from "../pages/ErrorPage";

const RoleRouting = () => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/login" />;
  }

  console.log("Authenticated Role:", auth.role);

  // Redirect based on role
  switch (auth.role) {
    case "Patient":
      return <PatientDashboard />;
    case "Doctor":
      return <DoctorDashboard />;
    case "Manager":
    case "Admin":
      return <StaffDashboard />;  // Combined Dashboard for Admin and Manager
    default:
      return <ErrorPage />;
  }
};

export default RoleRouting;
