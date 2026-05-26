// services/api.js
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const RAILWAY_URL = 'https://glowminder-production.up.railway.app'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Terjadi kesalahan pada server'
    toast.error(msg)
    return Promise.reject(err)
  }
)

// ─── PRODUCTS (mock-ready) ────────────────────────────────────
export const productAPI = {
  getAll:   () => api.get('/products'),
  create:   (data) => api.post('/products', data),
  update:   (id, data) => api.put(`/products/${id}`, data),
  remove:   (id) => api.delete(`/products/${id}`),
  classify: (id) => api.post(`/products/${id}/classify`),
}

// ─── REMINDERS (mock-ready) ───────────────────────────────────
export const reminderAPI = {
  getAll: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  remove: (id) => api.delete(`/reminders/${id}`),
  toggle: (id) => api.patch(`/reminders/${id}/toggle`),
}

// ─── RAILWAY AI – Skincare Recommendations ────────────────────
// POST /get-reminder  { ingredients, uv_index, humidity }
// ingredients diambil dari daftar produk user (semua ingredients digabung)
export async function getSkincareRecommendation({ ingredients, uv_index, humidity }) {
  const res = await fetch(`${RAILWAY_URL}/get-reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, uv_index, humidity }),
  })
  if (!res.ok) throw new Error('Gagal mendapat rekomendasi AI')
  return res.json()
}

export default api
