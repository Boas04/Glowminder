// pages/DashboardPage.jsx
import { useWeather } from '../hooks/useWeather'
import { useProducts } from '../hooks/useProducts'
import { useSkincareRecommendation } from '../hooks/useSkincareRecommendation'
import WeatherCard from '../components/features/WeatherCard'

/* ── AI Recommendation Banner ─────────────────────────────── */
function AIRecommendationCard({ recommendation, loading, error }) {
  if (loading) return (
    <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, animation: 'pulse-pink 1.5s infinite' }}>🤖</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--pink-600)', fontWeight: 500 }}>Memuat rekomendasi AI...</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Menganalisis cuaca & produkmu ✨</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[100, 75, 85].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 14, width: `${w}%` }} />
        ))}
      </div>
    </div>
  )

  if (!recommendation && !error) return null

  if (error) return (
    <div className="card" style={{ padding: '1.25rem', gridColumn: '1 / -1', borderColor: 'rgba(255,179,198,0.4)' }}>
      <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>⚠️ Rekomendasi AI tidak tersedia saat ini.</div>
    </div>
  )

  console.log("=== AI RECOMMENDATION RESPONSE ===", recommendation)

  let parsedRec = null
  let fallbackText = ''

  try {
    const raw =
      recommendation?.reminder ||
      recommendation?.message ||
      recommendation?.recommendation ||
      recommendation
    if (typeof raw === 'string') {
      // Sometimes it returns a string that contains JSON
      parsedRec = JSON.parse(raw)
    } else {
      parsedRec = raw
    }
  } catch (e) {
    fallbackText = typeof recommendation === 'string' ? recommendation : JSON.stringify(recommendation)
  }

  const normalizedRec = parsedRec?.data || parsedRec
  const recommendedProduct = normalizedRec?.recommended_product

  return (
    <div className="card" style={{
      padding: '1.5rem',
      gridColumn: '1 / -1',
      background: 'linear-gradient(135deg, rgba(255,240,245,0.9), rgba(255,255,255,0.95))',
      borderColor: 'rgba(255,143,171,0.4)',
      animation: 'fadeInUp 0.6s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 42, height: 42, minWidth: 42,
          background: 'var(--gradient-accent)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
          boxShadow: '0 4px 12px rgba(232,64,113,0.25)',
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-600)' }}>Rekomendasi Skincare Hari Ini</span>
            <span className="badge badge-pink" style={{ fontSize: '0.68rem' }}>✨ AI</span>
          </div>
          
          {normalizedRec && normalizedRec.rekomendasi_sistem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', lineHeight: 1.6 }}>
                {normalizedRec.rekomendasi_sistem.map((rec, i) => (
                  <p key={i} style={{ margin: 0, marginBottom: 4 }}>{rec}</p>
                ))}
              </div>

              {recommendedProduct && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Rekomendasi Produk:
                  </div>
                  <div className="card" style={{ padding: '0.85rem 1rem', borderColor: 'rgba(255,179,198,0.35)', background: 'rgba(255,255,255,0.8)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4 }}>
                      {recommendedProduct.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                      {recommendedProduct.category_name || 'Kategori tidak diketahui'}
                    </div>
                  </div>
                </div>
              )}

              {normalizedRec.prediksi_fungsi_skincare && normalizedRec.prediksi_fungsi_skincare.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Fokus Skincare:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {normalizedRec.prediksi_fungsi_skincare.map((fungsi, idx) => (
                      <span key={idx} className="badge badge-lavender" style={{ fontSize: '0.7rem' }}>
                        🎯 {fungsi}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {fallbackText || JSON.stringify(parsedRec || recommendation)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Today Routine ─────────────────────────────────────────── */
function TodayRoutineCard({ products }) {
  const hour      = new Date().getHours()
  const isMorning = hour >= 5 && hour < 12
  const relevant  = products.filter((p) => {
    const inStock = p.in_stock !== false
    return inStock && p.usage_time?.includes(isMorning ? 'morning' : 'night')
  })

  const categoryEmoji = { cleanser: '🫧', toner: '💧', serum: '✨', moisturizer: '🧴', sunscreen: '☀️', eye_cream: '👁️', mask: '🎭', exfoliator: '🔮', treatment: '💊' }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-700)' }}>
          {isMorning ? '🌅 Rutinitas Pagi' : '🌙 Rutinitas Malam'}
        </h3>
        <span className="badge badge-pink">{relevant.length} produk</span>
      </div>

      {relevant.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌸</div>
          Belum ada produk untuk sesi ini
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {relevant.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.65rem 0.85rem',
              background: 'linear-gradient(135deg, rgba(255,240,245,0.7), rgba(255,255,255,0.5))',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,179,198,0.25)',
              animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
            }}>
              <div style={{ width: 34, height: 34, background: 'var(--gradient-hero)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(232,64,113,0.15)' }}>
                {categoryEmoji[p.category] || '📦'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-800)' }}>{p.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 1 }}>{p.brand}</div>
              </div>
              <span className="badge badge-pink" style={{ fontSize: '0.65rem' }}>{p.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ icon, label, value, accent = 'var(--pink-400)', delay = 0 }) {
  return (
    <div className="card" style={{ padding: '1.25rem', animation: `fadeInUp 0.5s ease ${delay}s both` }}>
      <div style={{
        width: 40, height: 40,
        background: `linear-gradient(135deg, ${accent}22, ${accent}10)`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: '0.75rem',
        border: `1px solid ${accent}25`,
      }}>{icon}</div>
      <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function DashboardPage() {
  const { weather, interpretation } = useWeather()
  const { products, getMorningProducts, getNightProducts, getInStockProducts } = useProducts()
  const { recommendation, loading: recLoading, error: recError } = useSkincareRecommendation({ weather, products })

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Selamat Pagi'
    if (h < 17) return 'Selamat Siang'
    if (h < 20) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--gray-900)', marginBottom: 4, lineHeight: 1.2 }}>
          {greet()},&nbsp;<span className="text-gradient">GlowMinder ✨</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* AI Recommendation — full width, top priority */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AIRecommendationCard recommendation={recommendation} loading={recLoading} error={recError} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon="🧴" label="Total Produk"   value={products.length}              accent="var(--pink-400)"  delay={0} />
        <StatCard icon="✅" label="Stok Tersedia"  value={getInStockProducts().length}   accent="#10b981"          delay={0.05} />
        <StatCard icon="🌅" label="Produk Pagi"    value={getMorningProducts().length}   accent="var(--peach-200)" delay={0.1} />
        <StatCard icon="🌙" label="Produk Malam"   value={getNightProducts().length}     accent="var(--lavender-200)" delay={0.15} />
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <WeatherCard />

          {/* Urgency alert */}
          {interpretation?.urgency === 'high' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,240,245,0.95), rgba(255,255,255,0.90))',
              border: '1px solid rgba(255,143,171,0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              animation: 'fadeInUp 0.5s ease',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--pink-600)', fontSize: '0.875rem', marginBottom: 4 }}>Perhatian Cuaca</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>{interpretation.tips[0]}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <TodayRoutineCard products={products} />

          {/* Quick links */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-700)', marginBottom: '1rem' }}>🚀 Aksi Cepat</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { href: '/products',  icon: '➕', label: 'Tambah Produk' },
                { href: '/reminders', icon: '🔔', label: 'Atur Reminder' },
                { href: '/products',  icon: '🤖', label: 'Klasifikasi AI' },
                { href: '/products',  icon: '🔍', label: 'Cari Produk' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '0.65rem 0.85rem',
                  border: '1.5px solid var(--pink-100)',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(255,240,245,0.6), rgba(255,255,255,0.4))',
                  textDecoration: 'none', color: 'var(--pink-600)',
                  fontSize: '0.8rem', fontWeight: 500,
                  transition: 'var(--transition-spring)',
                }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink-50)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
                   onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
