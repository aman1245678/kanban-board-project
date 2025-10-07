import axios from "axios";
export const kanbanAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
kanbanAPI.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
kanbanAPI.interceptors.response.use(
  (response) => {
    console.log(
      `Response received from: ${response.config.url}`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    if (error.code === "ECONNREFUSE") {
      console.error(" Backend server is not running.");
    }

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "error ";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(
        new Error("No response from server. Please check backend is running.")
      );
    } else {
      return Promise.reject(new Error("Network error occurred"));
    }
  }
);
export const testConnection = async () => {
  try {
    const response = await kanbanAPI.get("/health");
    console.log("✅ Backend connection test:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    return false;
  }
};
