import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate(); 

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      console.log("API response:", response.data);
      const { token, role } = response.data;
      setAuth({ token, role });
      localStorage.setItem("authToken", token);

      // Redirect to dashboard after login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response.data);
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const authAxios = axios.create({
    baseURL: "http://localhost:5000",
  });

  authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ auth, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
