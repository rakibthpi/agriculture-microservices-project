import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth API
export const authApi = {
  login: (data: {email: string; password: string}) => api.post("/auth/login", data),
  register: (data: {email: string; password: string; name: string}) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
};

// Products API
export const productsApi = {
  getAll: (params?: Record<string, any>) => api.get("/products", {params}),
  getById: (id: string) => api.get(`/products/${id}`),
  getFeatured: () => api.get("/products/featured"),
  getByCategory: (categoryId: string) => api.get(`/products/category/${categoryId}`),
  create: (data: any) => api.post("/products", data),
  update: (id: string, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get("/categories"),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersApi = {
  create: (data: any) => api.post("/orders", data),
  getAll: (params?: Record<string, any>) => api.get("/orders", {params}),
  getById: (id: string) => api.get(`/orders/${id}`),
  getMyOrders: (userId: string, params?: Record<string, any>) => api.get(`/orders/user/${userId}`, {params}),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, {status}),
};
