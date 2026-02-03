// src/Api.js
import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000" // Ensure this matches your backend PORT
});

export const registerUser = async (formData) => {
  try {
    const response = await API.post('/register', formData);
    return response.data.message;
  } catch (error) {
    // This sends the backend error message back to the component
    throw new Error(error.response?.data?.error || "Backend Server is offline.");
  }
};