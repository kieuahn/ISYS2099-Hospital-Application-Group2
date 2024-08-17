import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate(); // This works only if AuthProvider is inside Router

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("API response:", response.data); // Check what is being returned
      const { token, role } = response.data;
      setAuth({ token, role });
      localStorage.setItem("authToken", token);

      // Redirect to dashboard after login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response.data); // Provide more detailed error logging
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
