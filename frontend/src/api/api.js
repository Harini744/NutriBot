/**
 * Axios instance pre-configured with base URL and JWT auth header injection.
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateHealthProfile = (data) => api.put("/auth/me/health-profile", data);

// Food
export const getFoods = (params) => api.get("/food/", { params });
export const getFood = (id) => api.get(`/food/${id}`);
export const getCategories = () => api.get("/food/categories/list");
export const createFood = (data) => api.post("/food/", data);
export const updateFood = (id, data) => api.put(`/food/${id}`, data);
export const deleteFood = (id) => api.delete(`/food/${id}`);

// Cart
export const getCart = () => api.get("/cart/");
export const addToCart = (data) => api.post("/cart/add", data);
export const updateCart = (data) => api.put("/cart/update", data);
export const clearCart = () => api.delete("/cart/clear");

// Orders
export const placeOrder = (data) => api.post("/orders/", data);
export const getMyOrders = () => api.get("/orders/my");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getAllOrders = () => api.get("/orders/admin/all");
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/admin/${id}/status`, null, { params: { status } });

// Recommendations
export const getRecommendations = () => api.get("/recommendations/");

// Chatbot
export const sendChatMessage = (message) => api.post("/chatbot/", { message });

export default api;
