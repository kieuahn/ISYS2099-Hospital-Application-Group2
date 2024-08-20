import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/onboarding/LoginPage";
import SignupPage from "./pages/onboarding/SignupPage";
import RoleRouting from "./utils/RoleRouting";
import HomePage from "./pages/home/HomePage";
import UserProfilePage from "./pages/UserProfilePage"; // Import the UserProfilePage

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<RoleRouting />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
