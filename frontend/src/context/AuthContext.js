import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Fetch user details with the token or set a predefined role
      // You can fetch user details or decode the token if necessary
      fetchUserDetails(token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      // Assuming you have an endpoint to fetch user details using the token
      const response = await api.get("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { role, name } = response.data; // Assuming the API returns role and name
      setAuth({ token, role, name });

      if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (role === "patient") {
        navigate("/patient/dashboard");
      } else if (role === "admin" || role === "manager") {
        navigate("/staff/dashboard");  
      } else {
        navigate("/error");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("authToken"); // Clear the token if something goes wrong
      navigate("/login"); // Redirect to login if there was an error
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role, name } = response.data;
      setAuth({ token, role, name });
      localStorage.setItem("authToken", token); // Store token
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


