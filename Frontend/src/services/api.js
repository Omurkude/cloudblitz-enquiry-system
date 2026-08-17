const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "cloudblitz_auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "An unexpected error occurred");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth APIs
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    apiRequest("/auth/me", {
      method: "GET",
    }),

  // Enquiry APIs
  getEnquiries: ({ status, search, assignedTo } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== "All") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());
    if (assignedTo) params.append("assignedTo", assignedTo);

    const queryString = params.toString();
    const endpoint = `/enquiries${queryString ? `?${queryString}` : ""}`;

    return apiRequest(endpoint, { method: "GET" });
  },

  getEnquiry: (id) => apiRequest(`/enquiries/${id}`, { method: "GET" }),

  createEnquiry: (enquiryData) =>
    apiRequest("/enquiries", {
      method: "POST",
      body: JSON.stringify(enquiryData),
    }),

  updateEnquiry: (id, enquiryData) =>
    apiRequest(`/enquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(enquiryData),
    }),

  deleteEnquiry: (id) => apiRequest(`/enquiries/${id}`, { method: "DELETE" }),

  getAssignees: () => apiRequest("/enquiries/assignees", { method: "GET" }),

  // User Management APIs (Admin Only)
  getUsers: () => apiRequest("/users", { method: "GET" }),

  createUser: (userData) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  updateUser: (id, userData) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  deleteUser: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
};

export default api;
