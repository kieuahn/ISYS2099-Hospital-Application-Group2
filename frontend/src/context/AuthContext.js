import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role, name } = response.data; // Ensure 'name' is included in the response
      setAuth({ token, role, name });
      localStorage.setItem("authToken", token); // Store token
      console.log("Navigating to dashboard...");
      // Dynamic navigation based on role
      let roleDashboard = '/dashboard';
      if (role === 'admin') {
        roleDashboard = '/admin/dashboard';
      } else if (role === 'doctor') {
        roleDashboard = '/doctor/dashboard';
      } else if (role === 'manager') {
        roleDashboard = '/manager/dashboard';
      } else if (role === 'patient') {
        roleDashboard = '/patient/dashboard';
      }

      navigate(roleDashboard);

    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("authToken"); // Remove token
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
