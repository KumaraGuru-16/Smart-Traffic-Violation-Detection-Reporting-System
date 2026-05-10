import axios from "axios";

// Use the environment variable for API base URL
// This connects directly to the backend instead of relying on the proxy
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔄 Response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error - backend is not running
    if (!error.response) {
      // Check if it's a network timeout or connection refused
      if (error.code === "ECONNABORTED") {
        error.message = "Request timeout. Backend is responding slowly or not running.";
      } else if (error.message?.includes("Network Error")) {
        error.message =
          "🚨 Cannot connect to backend server.\n\n" +
          "✅ Troubleshooting:\n" +
          "1. Open terminal in 'backend' folder\n" +
          "2. Run: npm start\n" +
          "3. Wait for '✅ Server running on port 5000'\n\n" +
          "If it still fails after 10 seconds:\n" +
          "• Check MongoDB connection: Is it working?\n" +
          "• Run: npm install\n" +
          "• Check .env file has MONGO_URI\n" +
          "• Check backend logs for errors";
      } else {
        error.message =
          "Cannot connect to server. Make sure the backend is running (npm start in backend folder).";
      }
      error.isNetworkError = true;
    }

    return Promise.reject(error);
  }
);

// Health check function
export const checkBackendHealth = async () => {
  try {
    const healthUrl = `${API_BASE_URL.replace("/api", "")}/health`;
    const response = await axios.get(healthUrl, {
      timeout: 5000,
    });
    return { isAlive: true, data: response.data };
  } catch (error) {
    return { isAlive: false, error: error.message };
  }
};

export default API;