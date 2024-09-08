import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);  // Auth state
  const navigate = useNavigate();

  // Check if the token is already in localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("authRole");
    const storedName = localStorage.getItem("authName");

    if (storedToken && storedRole && storedName) {
      // If token is found, set the auth state
      setAuth({ token: storedToken, role: storedRole, name: storedName });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role, name } = response.data;

      // Update auth state and persist to localStorage
      setAuth({ token, role, name });
      localStorage.setItem("authToken", token);
      localStorage.setItem("authRole", role);
      localStorage.setItem("authName", name);

      console.log("Navigating to dashboard...");

      // Dynamic navigation based on role
      switch (role) {
        case "admin":
          navigate('/admin/dashboard');
          break;
        case "doctor":
          navigate('/doctor/dashboard');
          break;
        case "manager":
          navigate('/manager/dashboard');
          break;
        case "patient":
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
    // Clear auth state and localStorage
    setAuth(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authName");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
