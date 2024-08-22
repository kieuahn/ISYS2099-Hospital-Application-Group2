import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoleRouting from "./components/RoleRouting";
import AddDoctor from "./pages/Admin/addDoctor";
import StaffList from "./pages/Admin/staffList";
import NavBar from "./components/NavBar";
function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<RoleRouting />} />
           <Route path="/admin/add-doctor" element={<AddDoctor />} />
          <Route path="/admin/staff-list" element={<StaffList />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
