import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoleRouting from "./components/RoleRouting";
import StaffManagement from "./components/StaffsTableComponents";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<RoleRouting />} />
          <Route path="/component" element={<StaffManagement />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
