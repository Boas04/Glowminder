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
      resolve({ lat: -8.6705, lon: 115.2126 }) // fallback Denpasar
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      ()    => resolve({ lat: -8.6705, lon: 115.2126 })
    )
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
