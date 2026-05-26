// pages/AuthPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    let result
    if (mode === 'login') {
      result = await login(form.email, form.password)
    } else {
      if (!form.name.trim()) { setError('Nama wajib diisi'); setLoading(false); return }
      result = await register(form.name, form.email, form.password)
    }
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Terjadi kesalahan')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: 400, height: 400,
        background: 'rgba(120, 217, 163, 0.15)',
        borderRadius: '50%', filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%',
        width: 500, height: 500,
        background: 'rgba(31, 168, 94, 0.2)',
        borderRadius: '50%', filter: 'blur(100px)',
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        animation: 'fadeInUp 0.5s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--gradient-main)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-glow)',
            fontSize: 26,
          }}>✨</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--gray-900)',
            marginBottom: 4,
          }}>GlowMinder</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            {mode === 'login' ? 'Selamat datang kembali!' : 'Buat akun baru'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: 'var(--gray-100)',
          borderRadius: 'var(--radius-full)', padding: 4,
          marginBottom: '1.5rem',
        }}>
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{
              flex: 1, padding: '0.5rem',
              border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-full)',
              background: mode === m ? 'white' : 'transparent',
              color: mode === m ? 'var(--green-600)' : 'var(--gray-500)',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem',
              transition: 'var(--transition)',
              boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
            }}>
              {m === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Nama Lengkap</label>
              <input className="input" type="text" placeholder="Masukkan nama kamu"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          )}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Email</label>
            <input className="input" type="email" placeholder="email@kamu.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Password</label>
            <input className="input" type="password" placeholder="Minimal 8 karakter"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8} required />
          </div>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 1rem', fontSize: '0.85rem',
            }}>{error}</div>
          )}
          <button type="submit" className="btn-primary" disabled={loading} style={{
            marginTop: 4, padding: '0.75rem',
            fontSize: '0.95rem', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '1.5rem' }}>
          GlowMinder · Smart Skincare Reminder
        </p>
      </div>
    </div>
  )
}
