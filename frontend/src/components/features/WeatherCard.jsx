// components/features/WeatherCard.jsx
import { useWeather } from '../../hooks/useWeather'

const weatherIcon = (condition, icon) => {
  if (!condition) return '🌤️'
  const c = condition.toLowerCase()
  if (c.includes('rain'))      return '🌧️'
  if (c.includes('cloud'))     return '⛅'
  if (c.includes('thunder'))   return '⛈️'
  if (c.includes('clear'))     return '☀️'
  if (c.includes('snow'))      return '❄️'
  if (c.includes('mist') || c.includes('fog')) return '🌫️'
  return '🌤️'
}

export default function WeatherCard() {
  const { weather, interpretation, loading, coords } = useWeather()

  if (loading) return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 56, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 12, width: '75%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '50%' }} />
    </div>
  )

  if (!weather) return null

  return (
    <div className="card" style={{
      padding: '1.5rem',
      background: 'linear-gradient(145deg, rgba(255,240,245,0.95), rgba(255,255,255,0.90))',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Decorative blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: 'radial-gradient(circle, rgba(255,179,198,0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Location */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>📍</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pink-500)', letterSpacing: '0.02em' }}>
            {weather.city}
          </span>
        </div>
        {coords && (
          <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', fontFamily: 'monospace' }}>
            {coords.lat.toFixed(2)}, {coords.lon.toFixed(2)}
          </span>
        )}
      </div>

      {/* Temp + icon */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: '1rem' }}>
        <div style={{ fontSize: 56, lineHeight: 1, animation: 'float 4s ease-in-out infinite' }}>
          {weatherIcon(weather.condition, weather.icon)}
        </div>
        <div>
          <div style={{ fontSize: '2.8rem', fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--gray-900)', lineHeight: 1 }}>
            {weather.temp}°
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'capitalize' }}>{weather.description}</div>
        </div>
      </div>

      {/* Detail row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: interpretation?.tips?.length ? '1rem' : 0 }}>
        {[
          { label: 'Terasa', value: `${weather.feels_like}°` },
          { label: 'Kelembapan', value: `${weather.humidity}%` },
          weather.uv_index != null
            ? { label: 'UV Index', value: weather.uv_index.toFixed(1) }
            : { label: 'Angin', value: `${weather.wind_speed} m/s` },
        ].map(({ label, value }) => (
          <div key={label} style={{
            textAlign: 'center',
            padding: '0.5rem 0.25rem',
            background: 'rgba(255,255,255,0.60)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,179,198,0.20)',
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-800)' }}>{value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {interpretation?.tips?.length > 0 && (
        <div style={{
          padding: '0.65rem 0.85rem',
          background: 'rgba(255,107,142,0.08)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--pink-300)',
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--pink-700)', lineHeight: 1.5 }}>
            💡 {interpretation.tips[0]}
          </div>
        </div>
      )}
    </div>
  )
}
