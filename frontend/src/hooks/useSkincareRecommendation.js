// hooks/useSkincareRecommendation.js
// Memanggil Railway AI endpoint otomatis saat cuaca & produk siap
import { useState, useEffect, useRef } from 'react'
import { getSkincareRecommendation } from '../services/api'

export function useSkincareRecommendation({ weather, products }) {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState(null)
  const calledRef                            = useRef(false)

  useEffect(() => {
    // Tunggu sampai cuaca dan produk tersedia
    if (!weather || !products || products.length === 0) return
    if (calledRef.current) return // hanya panggil sekali per session
    calledRef.current = true

    const call = async () => {
      setLoading(true)
      setError(null)
      try {
        // Gabungkan semua ingredients dari produk (pakai nama produk sebagai proxy)
        // Backend menginginkan string ingredients; kita kirim kategori + nama produk
        const ingredientsList = products
          .filter(p => p.in_stock)
          .map(p => p.ingredients || p.name.toLowerCase())
          .join(', ')

        const uv_index = weather.uv_index ?? 5.0    // fallback jika OWM free tier tidak punya UV
        const humidity = weather.humidity ?? 70
        
        const payload = {
          ingredients: ingredientsList || 'aqua, ceramide, niacinamide',
          uv_index,
          humidity,
        }

        console.log("Mengirim request ke AI dengan payload:", payload)

        const data = await getSkincareRecommendation(payload)
        setRecommendation(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    call()
  }, [weather, products])

  return { recommendation, loading, error }
}
