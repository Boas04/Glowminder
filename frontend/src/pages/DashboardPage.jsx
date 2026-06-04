// pages/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useProducts } from '../hooks/useProducts'
import { useSkincareRecommendation } from '../hooks/useSkincareRecommendation'
import WeatherCard from '../components/features/WeatherCard'
import Button from '../components/common/Button'
import { 
  Droplet, Sun, Moon, Sparkles, Package, Check, AlertCircle, Plus, 
  Clock, Zap, Search, Brain, X, Loader2
} from 'lucide-react'

/* ── AI Classification Modal ───────────────────────────────── */
function ClassificationModal({ onClose }) {
  const [ingredients, setIngredients] = useState('')
  const [uvIndex, setUvIndex] = useState('')
  const [humidity, setHumidity] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!ingredients.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('https://boas04-glowminder.hf.space/get-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          uv_index: parseFloat(uvIndex) || 5.0,
          humidity: parseFloat(humidity) || 60.0,
        }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError('Gagal menghubungi AI Engine. Coba lagi ya!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.2s ease',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg, 16px)',
        padding: '1.75rem', width: '100%', maxWidth: 480,
        boxShadow: '0 20px 60px rgba(232,64,113,0.15)', animation: 'fadeInUp 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gradient-accent, linear-gradient(135deg, #e85180, #f472b6))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--gray-900, #111)' }}>Klasifikasi AI</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gray-400, #9ca3af)' }}>Analisis ingredients produkmu</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400, #9ca3af)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-600, #4b5563)', display: 'block', marginBottom: 6 }}>Ingredients Produk *</label>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)}
              placeholder="Contoh: Water, Niacinamide, Glycerin, Centella Asiatica" rows={3}
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', border: '1.5px solid rgba(255,179,198,0.4)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--gray-800, #1f2937)', resize: 'vertical', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#f472b6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,179,198,0.4)'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'UV Index', value: uvIndex, setter: setUvIndex, placeholder: 'Contoh: 6.5', step: '0.1', max: 15 },
              { label: 'Kelembapan (%)', value: humidity, setter: setHumidity, placeholder: 'Contoh: 70', step: '1', max: 100 },
            ].map(({ label, value, setter, placeholder, step, max }) => (
              <div key={label}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-600, #4b5563)', display: 'block', marginBottom: 6 }}>{label}</label>
                <input type="number" value={value} onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder} step={step} min="0" max={max}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.85rem', border: '1.5px solid rgba(255,179,198,0.4)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--gray-800, #1f2937)', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#f472b6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,179,198,0.4)'} />
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={loading || !ingredients.trim()}
            style={{ width: '100%', padding: '0.75rem', background: loading || !ingredients.trim() ? '#f9a8c0' : '#e85180', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', cursor: loading || !ingredients.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Menganalisis...</> : <><Brain size={16} /> Analisis Sekarang</>}
          </button>
        </div>

        {error && <div style={{ marginTop: 14, padding: '0.75rem 1rem', background: 'rgba(255,200,200,0.3)', borderRadius: 10, fontSize: '0.83rem', color: '#c0392b' }}>{error}</div>}
        {result && (
          <div style={{ marginTop: 14, padding: '1rem', background: 'linear-gradient(135deg, rgba(255,240,245,0.9), rgba(255,255,255,0.95))', borderRadius: 12, border: '1px solid rgba(255,179,198,0.3)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hasil Analisis</div>
            {result.prediksi_fungsi_skincare && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6 }}>Fungsi Skincare:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.prediksi_fungsi_skincare.map((f, i) => (
                    <span key={i} style={{ padding: '3px 10px', background: 'rgba(168,85,247,0.12)', color: '#7c3aed', borderRadius: 20, fontSize: '0.73rem', fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
            {result.rekomendasi_sistem && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6 }}>Rekomendasi:</div>
                {result.rekomendasi_sistem.map((r, i) => (
                  <p key={i} style={{ margin: '0 0 4px', fontSize: '0.83rem', color: '#374151', lineHeight: 1.5 }}>• {r}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── AI Recommendation Banner ─────────────────────────────── */
function AIRecommendationCard({ recommendation, loading, error, checkedItems, products }) {
  if (loading) return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-pink 1.5s infinite' }}>
          <Brain size={20} style={{ color: 'white' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--pink-600)', fontWeight: 500 }}>Memuat rekomendasi AI...</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Menganalisis cuaca & produkmu</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[100, 75, 85].map((w, i) => <div key={i} className="skeleton" style={{ height: 14, width: `${w}%` }} />)}
      </div>
    </div>
  )

  if (!recommendation && !error) return null
  if (error) return (
    <div className="card" style={{ padding: '1.25rem', borderColor: 'rgba(255,179,198,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-500)', fontSize: '0.875rem' }}>
        <AlertCircle size={18} />Rekomendasi AI tidak tersedia saat ini.
      </div>
    </div>
  )

  let parsedRec = null, fallbackText = ''
  try {
    const raw = recommendation?.reminder || recommendation?.message || recommendation?.recommendation || recommendation
    parsedRec = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (e) {
    fallbackText = typeof recommendation === 'string' ? recommendation : JSON.stringify(recommendation)
  }

  const normalizedRec = parsedRec?.data || parsedRec

  // ✅ Cari produk yang belum dicentang untuk ditampilkan sebagai rekomendasi
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 12
  const uncheckedProducts = products.filter(p => {
    const inStock = p.in_stock !== false
    const isRelevant = p.usage_time?.includes(isMorning ? 'morning' : 'night')
    return inStock && isRelevant && !checkedItems.has(p.id)
  })
  const suggestedProduct = uncheckedProducts[0] || null

  return (
    <div className="card" style={{
      padding: '1.5rem',
      background: 'linear-gradient(135deg, rgba(255,240,245,0.9), rgba(255,255,255,0.95))',
      borderColor: 'rgba(255,143,171,0.4)', animation: 'fadeInUp 0.6s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 42, height: 42, minWidth: 42, background: 'var(--gradient-accent)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,64,113,0.25)' }}>
          <Brain size={24} style={{ color: 'white' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-600)' }}>Rekomendasi Skincare Hari Ini</span>
            <span className="badge badge-pink" style={{ fontSize: '0.68rem', background: 'rgba(232,64,113,0.85)', color: 'white' }}>
              <Sparkles size={12} style={{ marginRight: 4 }} />AI
            </span>
          </div>

          {normalizedRec?.rekomendasi_sistem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', lineHeight: 1.6 }}>
                {normalizedRec.rekomendasi_sistem.map((rec, i) => <p key={i} style={{ margin: 0, marginBottom: 4 }}>{rec}</p>)}
              </div>

              {/* ✅ Tampilkan produk yang belum dipakai */}
              {suggestedProduct && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Belum Dipakai Hari Ini:
                  </div>
                  <div className="card" style={{ padding: '0.85rem 1rem', borderColor: 'rgba(255,179,198,0.35)', background: 'rgba(255,255,255,0.8)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: 2 }}>{suggestedProduct.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{suggestedProduct.category || 'skincare'}</div>
                  </div>
                </div>
              )}

              {uncheckedProducts.length === 0 && (
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={16} /> Semua rutinitas hari ini sudah selesai! 🎉
                </div>
              )}

              {normalizedRec.prediksi_fungsi_skincare?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fokus Skincare:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {normalizedRec.prediksi_fungsi_skincare.map((fungsi, idx) => (
                      <span key={idx} className="badge badge-lavender" style={{ fontSize: '0.7rem', background: 'rgba(168,85,247,0.15)', color: '#5b21b6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={12} />{fungsi}
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
function TodayRoutineCard({ products, checkedItems, toggleItem }) {
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 12
  const relevant = products.filter((p) => p.in_stock !== false && p.usage_time?.includes(isMorning ? 'morning' : 'night'))

  const categoryIcons = {
    cleanser: <Droplet size={18} />, toner: <Droplet size={18} />,
    serum: <Sparkles size={18} />, moisturizer: <Package size={18} />,
    sunscreen: <Sun size={18} />, eye_cream: <Package size={18} />,
    mask: <Package size={18} />, exfoliator: <Sparkles size={18} />,
    treatment: <Sparkles size={18} />,
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-700)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {isMorning ? <Sun size={20} style={{ color: 'var(--peach-400)' }} /> : <Moon size={20} style={{ color: 'var(--lavender-400)' }} />}
          {isMorning ? 'Rutinitas Pagi' : 'Rutinitas Malam'}
        </h3>
        <span className="badge badge-pink" style={{ background: 'var(--pink-100)', color: 'var(--pink-700)', fontWeight: 600 }}>{relevant.length} produk</span>
      </div>

      {relevant.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
          <p style={{ marginBottom: 12 }}>Belum ada produk untuk sesi ini</p>
          <Button variant="secondary" size="sm" onClick={() => window.location.href = '/products'}>
            <Plus size={16} />Tambah Rutinitas
          </Button>
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
              transition: 'all 0.2s ease',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8, flex: 1 }}>
                <input type="checkbox" checked={checkedItems.has(p.id)} onChange={() => toggleItem(p.id)}
                  style={{ cursor: 'pointer', width: 18, height: 18, accentColor: 'var(--pink-500)' }} />
                <div style={{ width: 34, height: 34, background: 'var(--gradient-hero)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  {categoryIcons[p.category] || <Package size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: checkedItems.has(p.id) ? 'var(--gray-400)' : 'var(--gray-800)', textDecoration: checkedItems.has(p.id) ? 'line-through' : 'none', transition: 'all 0.2s' }}>{p.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 1 }}>{p.brand}</div>
                </div>
              </label>
              <span className="badge badge-pink" style={{ fontSize: '0.65rem', background: 'var(--pink-100)', color: 'var(--pink-700)' }}>{p.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent = 'var(--pink-400)', delay = 0 }) {
  return (
    <div className="card" style={{ padding: '1.25rem', animation: `fadeInUp 0.5s ease ${delay}s both` }}>
      <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${accent}22, ${accent}10)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', border: `1px solid ${accent}25` }}>
        <Icon size={24} style={{ color: accent }} />
      </div>
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
  const [showClassifyModal, setShowClassifyModal] = useState(false)

  // ✅ FIX: Checkbox state diangkat ke DashboardPage + persist ke localStorage
  const STORAGE_KEY = `glowminder_checked_${new Date().toDateString()}`
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedItems]))
    } catch {}
  }, [checkedItems])

  const toggleItem = (id) => {
    setCheckedItems(prev => {
      const updated = new Set(prev)
      if (updated.has(id)) updated.delete(id)
      else updated.add(id)
      return updated
    })
  }

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Selamat Pagi'
    if (h < 17) return 'Selamat Siang'
    if (h < 20) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {showClassifyModal && <ClassificationModal onClose={() => setShowClassifyModal(false)} />}

      <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--gray-900)', marginBottom: 4, lineHeight: 1.2 }}>
          {greet()}! <span className="text-gradient">✨</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <AIRecommendationCard
          recommendation={recommendation} loading={recLoading} error={recError}
          checkedItems={checkedItems} products={products}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon={Sparkles} label="Produk Khusus" value={products.filter(p => p.usage_time === 'special_treatment').length} accent="#e85180" delay={0} />
        <StatCard icon={Check}    label="Stok Tersedia" value={getInStockProducts().length}  accent="#10b981" delay={0.05} />
        <StatCard icon={Sun}      label="Produk Pagi"   value={getMorningProducts().length}  accent="#fbbf24" delay={0.1} />
        <StatCard icon={Moon}     label="Produk Malam"  value={getNightProducts().length}    accent="#a855f7" delay={0.15} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <WeatherCard />
          {interpretation?.urgency === 'high' && (
            <div style={{ background: 'linear-gradient(135deg, rgba(255,240,245,0.95), rgba(255,255,255,0.90))', border: '1px solid rgba(255,143,171,0.4)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', animation: 'fadeInUp 0.5s ease', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle size={20} style={{ color: 'var(--pink-600)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--pink-600)', fontSize: '0.875rem', marginBottom: 4 }}>Perhatian Cuaca</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>{interpretation.tips[0]}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* ✅ Pass checkedItems & toggleItem ke TodayRoutineCard */}
          <TodayRoutineCard products={products} checkedItems={checkedItems} toggleItem={toggleItem} />

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-700)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={18} style={{ color: 'var(--pink-500)' }} />Aksi Cepat
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { href: '/products',  icon: Plus,   label: 'Tambah Produk',  isPrimary: true,  onClick: null },
                { href: '/reminders', icon: Clock,  label: 'Atur Reminder',  isPrimary: false, onClick: null },
                { href: null,         icon: Brain,  label: 'Klasifikasi AI', isPrimary: false, onClick: () => setShowClassifyModal(true) },
                { href: '/products',  icon: Search, label: 'Cari Produk',    isPrimary: false, onClick: null },
              ].map(({ href, icon: IconComponent, label, isPrimary, onClick }) => (
                onClick ? (
                  <button key={label} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 0.85rem', border: '1.5px solid var(--pink-100)', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(255,240,245,0.6), rgba(255,255,255,0.4))', color: 'var(--pink-600)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition-spring)', fontFamily: 'inherit' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink-50)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                    <IconComponent size={16} />{label}
                  </button>
                ) : (
                  <a key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 0.85rem', border: isPrimary ? 'none' : '1.5px solid var(--pink-100)', borderRadius: 'var(--radius-md)', background: isPrimary ? '#e85180' : 'linear-gradient(135deg, rgba(255,240,245,0.6), rgba(255,255,255,0.4))', textDecoration: 'none', color: isPrimary ? 'white' : 'var(--pink-600)', fontSize: '0.8rem', fontWeight: 500, transition: 'var(--transition-spring)' }}
                    onMouseEnter={e => { if (isPrimary) { e.currentTarget.style.background = '#d63a6e'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,64,113,0.3)' } else { e.currentTarget.style.background = 'var(--pink-50)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' } }}
                    onMouseLeave={e => { e.currentTarget.style.background = isPrimary ? '#e85180' : ''; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                    <IconComponent size={16} />{label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}