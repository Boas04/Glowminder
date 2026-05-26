// services/weather.js
// Geolocation → OpenWeatherMap (atau mock jika key tidak ada)

const OWM_KEY  = import.meta.env.VITE_OPENWEATHER_API_KEY
const OWM_BASE = 'https://api.openweathermap.org/data/2.5'

export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric&lang=id`
  )
  if (!res.ok) throw new Error('Gagal mengambil data cuaca')
  return res.json()
}

export async function fetchUVIndex(lat, lon) {
  const res = await fetch(
    `${OWM_BASE}/uvi?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`
  )
  if (!res.ok) return { value: null }
  return res.json()
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
  const temp      = weatherData.main?.temp
  const humidity  = weatherData.main?.humidity
  const condition = weatherData.weather?.[0]?.main?.toLowerCase()
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
