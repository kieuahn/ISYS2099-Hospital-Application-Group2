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
      const { token, role, name } = response.data;
      setAuth({ token, role, name });
      localStorage.setItem("authToken", token); // Store token
      console.log("Navigating to dashboard...");

      // Dynamic navigation based on role
      switch (role) {
        case "Admin":
          navigate('/admin/dashboard');
          break;
        case "Doctor":
          navigate('/doctor/dashboard');
          break;
        case "Manager":
          navigate('/manager/dashboard');
          break;
        case "Patient":
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/dashboard');
          break;
      }
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