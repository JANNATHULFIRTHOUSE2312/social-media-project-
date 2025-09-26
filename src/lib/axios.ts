import axios from "axios";

// 1. Create a new instance of Axios with our backend's base URL
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  // 2. This is CRUCIAL for sending cookies
  withCredentials: true,
});

// 3. This is our upgraded "smart assistant"
api.interceptors.response.use(
  // If the response is successful, just pass it through.
  (response) => response,

  // If the response is an error, this special function runs.
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/users/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        console.log("Access token expired. Attempting to refresh...");
        await api.post("/users/refresh-token");
        console.log("Tokens refreshed successfully. Retrying original request.");
        return api(originalRequest);
      } catch {
        // Refresh failed → reject with original error
        return Promise.reject(error);
      }
    }

    // For any other error, just pass it along.
    return Promise.reject(error);
  }
);

export default api;
