import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Base URL for your API

// Function to update user profile
export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("authToken"); // Get token from local storage
  const response = await axios.put(`${API_URL}/update`, userData, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach token for authentication
    },
  });
  return response.data; // Return the updated user data
};

// Function to fetch user profile (if needed)
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Return the user profile data
};