import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/onboarding/LoginPage";
import SignupPage from "./pages/onboarding/SignupPage";
import RoleRouting from "./utils/RoleRouting";
import ErrorPage from "./pages/ErrorPage";
import NavBar from "./components/Navbar/Navbar";
import Schedules from "./pages/doctor/Schedules";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffList from "./pages/Staff/StaffList";
import DoctorDetails from "./pages/Staff/DoctorDetails";
import WorkloadPage from "./pages/Staff/WorkloadPage";
import PatientList from "./pages/Staff/PatientList";
import TreatmentHistory from "./pages/Staff/TreatmentHistory";
import JobHistoryPage from './pages/Staff/JobHistory';
import CalendarDoctor from "./pages/Staff/CalendarDoctor";
import DoctorPerformance from "./pages/Staff/DoctorPerfomance";
import PaymentReport from "./pages/Staff/PaymentReport";
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
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />  
          <Route path="/manager/staff-list" element={<StaffList />} />
          <Route path="/workload" element={<WorkloadPage />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patient/:patient_id/treatment-history" element={<TreatmentHistory />} />
          <Route path="/staff/:doctor_id/job-history" element={<JobHistoryPage />} />
          <Route path="/doctor-performance" element={<DoctorPerformance />} />
          <Route path="/doctor-schedules" element={<CalendarDoctor />} />
          <Route path="/admin/staff-list" element={<StaffList />} />
          <Route path="/doctor/:doctor_id/details" element={<DoctorDetails />} />
          <Route path="/payment-report" element={<PaymentReport />} />

          <Route path="/schedule" element={<Schedules />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
