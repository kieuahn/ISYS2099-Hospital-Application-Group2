import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/onboarding/LoginPage";
import SignupPage from "./pages/onboarding/SignupPage";
import RoleRouting from "./utils/RoleRouting";
import HomePage from "./pages/home/HomePage";
import ErrorPage from "./pages/ErrorPage";
import NavBar from "./components/NavBar";
import AddDoctor from "./pages/admin/AddDoctor";
import StaffList from "./pages/admin/StaffList";
import Schedules from "./pages/doctor/Schedules";



function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<RoleRouting />} />
          <Route path="/home" element={<HomePage />} />
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
