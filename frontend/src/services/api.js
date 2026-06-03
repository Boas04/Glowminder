// services/api.js
import axios from 'axios'
import toast from 'react-hot-toast'

const DEFAULT_DEV_API = 'http://localhost:5000/api'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? DEFAULT_DEV_API : '/api')
const RAILWAY_URL = 'https://glowminder-production.up.railway.app'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", {
      message: err.message,
      code: err.code,
      method: err.config?.method,
      url: err.config?.baseURL
        ? `${err.config.baseURL}${err.config.url || ""}`
        : err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
    })
    const msg = err.response?.data?.message || 'Terjadi kesalahan pada server'
    toast.error(msg)
    return Promise.reject(err)
  }
)

// ─── PRODUCTS (mock-ready) ────────────────────────────────────
export const productAPI = {
  getAll:   () => api.get('/product'),
  create:   (data) => api.post('/product', data),
  update:   (id, data) => api.put(`/product/${id}`, data),
  remove:   (id) => api.delete(`/product/${id}`),
  classify: (id) => api.post(`/product/${id}/classify`),
}

// ─── CATEGORIES ───────────────────────────────────────────────
export const categoryAPI = {
  getAll:   () => api.get('/categories'),
  getById:  (id) => api.get(`/categories/${id}`),
  create:   (data) => api.post('/categories', data),
  update:   (id, data) => api.put(`/categories/${id}`, data),
  remove:   (id) => api.delete(`/categories/${id}`),
}

// ─── BRANDS ───────────────────────────────────────────────────
export const brandAPI = {
  getAll:   () => api.get('/brands'),
  getById:  (id) => api.get(`/brands/${id}`),
  create:   (data) => api.post('/brands', data),
  update:   (id, data) => api.put(`/brands/${id}`, data),
  remove:   (id) => api.delete(`/brands/${id}`),
}

// ─── REMINDERS (mock-ready) ───────────────────────────────────
export const reminderAPI = {
  getAll: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  remove: (id) => api.delete(`/reminders/${id}`),
  toggle: (id) => api.patch(`/reminders/${id}/toggle`),
  personalized: (payload) => api.post('/reminders/personalized', payload),
}

// ─── AI – Skincare Recommendations ────────────────────
export async function getSkincareRecommendation({ ingredients, uv_index, humidity }) {
  const res = await api.post('/ai/reminder', { ingredients, uv_index, humidity })
  if (res.data && !res.data.success && res.data.message) {
    throw new Error(res.data.message)
  }
  return res.data.data
}

export default api
