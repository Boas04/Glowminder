// pages/AnalyticsPage.jsx
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
} from 'recharts'
import { useProducts } from '../hooks/useProducts'
import { useWeather } from '../hooks/useWeather'

const COLORS = ['#1fa85e', '#3fc47c', '#78d9a3', '#aeeac7', '#d6f5e3', '#0e5430']

export default function AnalyticsPage() {
  const { products } = useProducts()
  const { weather } = useWeather()

  // Hitung per kategori
  const catData = products.reduce((acc, p) => {
    const key = p.category || 'other'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const categoryChart = Object.entries(catData).map(([name, value]) => ({ name, value }))

  // Stok vs habis
  const stockData = [
    { name: 'Tersedia', value: products.filter((p) => p.in_stock).length },
    { name: 'Habis', value: products.filter((p) => !p.in_stock).length },
  ]

  // Usage time radar
  const radarData = [
    { subject: 'Pagi', count: products.filter((p) => p.usage_time?.includes('morning')).length },
    { subject: 'Malam', count: products.filter((p) => p.usage_time?.includes('night')).length },
    { subject: 'Treatment', count: products.filter((p) => p.usage_time?.includes('special')).length },
    { subject: 'Tersedia', count: products.filter((p) => p.in_stock).length },
  ]

  // Mock weather-skin correlation
  const correlationData = [
    { day: 'Sen', spf: 8, moisture: 5, temp: 30 },
    { day: 'Sel', spf: 6, moisture: 7, temp: 27 },
    { day: 'Rab', spf: 9, moisture: 4, temp: 33 },
    { day: 'Kam', spf: 7, moisture: 6, temp: 29 },
    { day: 'Jum', spf: 9, moisture: 3, temp: 32 },
    { day: 'Sab', spf: 10, moisture: 4, temp: 34 },
    { day: 'Min', spf: 5, moisture: 8, temp: 26 },
  ]

  const CardWrap = ({ title, children, style }) => (
    <div className="card" style={{ padding: '1.5rem', ...style }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gray-800)', marginBottom: '1.25rem' }}>{title}</h3>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem', animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--gray-900)' }}>
          📊 Analitik
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 2 }}>
          Statistik koleksi skincare & korelasi cuaca
        </p>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Produk', val: products.length, icon: '🧴' },
          { label: 'Stok Tersedia', val: products.filter((p) => p.in_stock).length, icon: '✅' },
          { label: 'Kategori Unik', val: Object.keys(catData).length, icon: '🗂️' },
          { label: 'Suhu Hari Ini', val: weather ? `${weather.temp}°C` : '-', icon: '🌡️' },
        ].map(({ label, val, icon }) => (
          <div key={label} style={{
            background: 'white',
            border: '1px solid var(--green-100)',
            borderRadius: 'var(--radius-full)',
            padding: '0.5rem 1.1rem',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.85rem', fontWeight: 500,
            color: 'var(--gray-700)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <span>{icon}</span>
            <span style={{ color: 'var(--green-600)', fontWeight: 700 }}>{val}</span>
            <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Category bar */}
        <CardWrap title="📦 Produk per Kategori">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryChart} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="value" fill="#1fa85e" radius={[6, 6, 0, 0]}>
                {categoryChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardWrap>

        {/* Stock pie */}
        <CardWrap title="✅ Status Stok">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stockData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                dataKey="value" paddingAngle={4}>
                <Cell fill="#1fa85e" />
                <Cell fill="#e5e7eb" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: -8 }}>
            {stockData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: i === 0 ? '#1fa85e' : '#e5e7eb' }} />
                <span style={{ color: 'var(--gray-600)' }}>{d.name}: <b>{d.value}</b></span>
              </div>
            ))}
          </div>
        </CardWrap>

        {/* Radar */}
        <CardWrap title="📡 Profil Penggunaan">
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Radar name="Produk" dataKey="count" stroke="#1fa85e" fill="#1fa85e" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </CardWrap>

        {/* Weather correlation */}
        <CardWrap title="🌦️ Korelasi Cuaca–Skincare (7 Hari)" style={{ gridColumn: 'span 2' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: 12, marginTop: -8 }}>
            * Data simulasi — akan terhubung ke log cuaca real dari backend
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={correlationData} barCategoryGap="25%">
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
              <Bar dataKey="spf" name="SPF Priority" fill="#1fa85e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="moisture" name="Hydration Priority" fill="#78d9a3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardWrap>
      </div>
    </div>
  )
}
