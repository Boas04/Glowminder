// services/weather.js
// Geolocation → OpenWeatherMap (atau mock jika key tidak ada)

import api from './api'

export async function fetchWeatherFromBackend(lat, lon) {
  const res = await api.get(`/weather/current?lat=${lat}&lon=${lon}`)
  return res.data.data
}

// Minta izin lokasi dari browser → return { lat, lon }
export function getUserCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('[Weather] Geolocation not available, using fallback')
      resolve({ lat: -6.25, lon: 106.78 }) // fallback Tangerang
      return
    }

    const timeout = 8000 // 8 second timeout
    const options = {
      enableHighAccuracy: true, // force high accuracy
      timeout,
      maximumAge: 5 * 60 * 1000, // cache for 5 min
    }

    const onSuccess = (pos) => {
      console.log('[Weather] Geolocation success:', pos.coords)
      resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude })
    }

    const onError = (err) => {
      console.warn('[Weather] Geolocation error:', err.code, err.message)
      // Try once more with timeout relaxed if user denied
      if (err.code === 1) { // PermissionDenied
        console.log('[Weather] Permission denied, using fallback Tangerang')
      }
      resolve({ lat: -6.25, lon: 106.78 }) // fallback Tangerang
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  })
}

export function interpretWeather(weatherData) {
  if (!weatherData) return null
  const temp      = weatherData.temperature
  const humidity  = weatherData.humidity
  const condition = weatherData.weather_condition?.toLowerCase()
  const tips = []
  let skinCondition = 'normal'
  let urgency = 'low'

  if (temp > 32) {
    tips.push('Cuaca sangat panas — perbanyak SPF dan hidrasi')
    skinCondition = 'oily-prone'; urgency = 'high'
  } else if (temp > 28) {
    tips.push('Cuaca panas — gunakan produk ringan dan non-comedogenic')
    skinCondition = 'warm'; urgency = 'medium'
  }
  if (humidity > 80)      tips.push('Kelembapan tinggi — kurangi moisturizer berat')
  else if (humidity < 40) { tips.push('Udara kering — tambahkan hyaluronic acid'); urgency = 'high' }
  if (condition?.includes('rain'))  tips.push('Hujan — proteksi ekstra dari polusi')
  if (condition?.includes('clear')) { tips.push('Cerah — wajib pakai SPF 30+ sebelum keluar'); urgency = 'high' }

  return { tips, skinCondition, urgency }
}
