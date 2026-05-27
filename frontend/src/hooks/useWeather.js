// hooks/useWeather.js
import { useState, useEffect } from 'react'
import { fetchWeatherFromBackend, interpretWeather, getUserCoords } from '../services/weather'
import { MOCK_WEATHER } from '../utils/mockData'

const USE_MOCK = false

export function useWeather() {
  const [weather, setWeather]           = useState(null)
  const [interpretation, setInterpret]  = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [coords, setCoords]             = useState(null)

  // Ambil koordinat sekali saat mount
  useEffect(() => {
    getUserCoords().then(setCoords)
  }, [])

  useEffect(() => {
    if (!coords) return
    let alive = true

    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchWeatherFromBackend(coords.lat, coords.lon)
        if (!alive) return
        const mapped = {
          city: data.location_name || 'Lokasi',
          temp: Math.round(data.temperature),
          feels_like: Math.round(data.temperature),
          humidity: data.humidity,
          condition: data.weather_condition,
          description: data.weather_condition,
          icon: '01d', // default or mapped later
          wind_speed: data.wind_speed,
          uv_index: data.uv_index ?? null,
        }
        setWeather(mapped)
        setInterpret(interpretWeather(data))
      } catch (e) {
        if (!alive) return
        setError(e.message)
        setWeather(MOCK_WEATHER)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 10 * 60 * 1000)
    return () => { alive = false; clearInterval(interval) }
  }, [coords])

  return { weather, interpretation, loading, error, coords }
}
