import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/onboarding/LoginPage";
import SignupPage from "./pages/onboarding/SignupPage";
import RoleRouting from "./utils/RoleRouting";
import ErrorPage from "./pages/ErrorPage";
import NavBar from "./components/Navbar/Navbar";
import AddDoctor from "./pages/admin/AddDoctor";
import StaffList from "./pages/admin/StaffList";
import Schedules from "./pages/doctor/Schedules";
import PatientDashboard from "./pages/patient/PatientDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import PatientAppointmentList from "./pages/patient/PatientAppointmentList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<RoleRouting />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointmentList />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/admin/add-doctor" element={<AddDoctor />} />
          <Route path="/admin/staff-list" element={<StaffList />} />
          <Route path="/schedule" element={<Schedules />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
