// hooks/useWeather.js
import { useState, useEffect } from 'react'
import { fetchWeatherByCoords, fetchUVIndex, interpretWeather, getUserCoords } from '../services/weather'
import { MOCK_WEATHER } from '../utils/mockData'

const USE_MOCK = !import.meta.env.VITE_OPENWEATHER_API_KEY ||
                 import.meta.env.VITE_OPENWEATHER_API_KEY === 'your_openweathermap_api_key_here'

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
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 700))
          if (!alive) return
          setWeather(MOCK_WEATHER)
          setInterpret(interpretWeather({
            main: { temp: MOCK_WEATHER.temp, humidity: MOCK_WEATHER.humidity },
            weather: [{ main: MOCK_WEATHER.condition }]
          }))
        } else {
          const [data, uvData] = await Promise.all([
            fetchWeatherByCoords(coords.lat, coords.lon),
            fetchUVIndex(coords.lat, coords.lon),
          ])
          if (!alive) return
          const mapped = {
            city: data.name,
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            wind_speed: data.wind.speed,
            uv_index: uvData?.value ?? null,
          }
          setWeather(mapped)
          setInterpret(interpretWeather(data))
        }
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
