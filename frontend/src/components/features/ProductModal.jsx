// components/features/ProductModal.jsx
import { useState } from 'react'
import { PRODUCT_CATEGORIES, USAGE_TIMES } from '../../utils/mockData'

const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }

export default function ProductModal({ product, onClose, onSave }) {
  const isEdit = Boolean(product?.id)
  const [form, setForm] = useState({
    name: '', brand: '', category: 'serum',
    usage_time: ['morning'], in_stock: true, notes: '',
    ...product,
  })
  const [saving, setSaving] = useState(false)

  const toggleUsage = (val) => setForm(prev => ({
    ...prev,
    usage_time: prev.usage_time.includes(val)
      ? prev.usage_time.filter(t => t !== val)
      : [...prev.usage_time, val],
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(30,10,20,0.35)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.2s ease',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem', width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(232,64,113,0.18)',
        border: '1px solid rgba(255,179,198,0.35)',
        animation: 'fadeInUp 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.25rem', color: 'var(--pink-700)' }}>
            {isEdit ? '✏️ Edit Produk' : '🌸 Tambah Produk'}
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, border: 'none',
            background: 'var(--pink-50)', borderRadius: '50%',
            cursor: 'pointer', fontSize: 14, color: 'var(--pink-400)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition)',
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nama Produk *</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Niacinamide 10%" required />
          </div>
          <div>
            <label style={labelStyle}>Brand</label>
            <input className="input" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
              placeholder="Contoh: The Ordinary" />
          </div>
          <div>
            <label style={labelStyle}>Kategori</label>
            <div className="select-wrapper" style={{ width: '100%' }}>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {PRODUCT_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Waktu Penggunaan</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {USAGE_TIMES.map(({ value, label }) => {
                const active = form.usage_time.includes(value)
                return (
                  <button key={value} type="button" onClick={() => toggleUsage(value)} style={{
                    padding: '0.45rem 1rem',
                    border: `1.5px solid ${active ? 'var(--pink-400)' : 'var(--gray-200)'}`,
                    borderRadius: 'var(--radius-full)',
                    background: active ? 'var(--pink-50)' : 'transparent',
                    color: active ? 'var(--pink-600)' : 'var(--gray-400)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: active ? 600 : 400,
                    transition: 'var(--transition-spring)',
                    boxShadow: active ? '0 2px 8px rgba(232,64,113,0.15)' : 'none',
                  }}>{label}</button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.5rem 0.75rem', background: 'rgba(255,240,245,0.5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--pink-100)' }}>
            <input type="checkbox" id="in_stock" checked={form.in_stock}
              onChange={e => setForm({ ...form, in_stock: e.target.checked })}
              style={{ accentColor: 'var(--pink-500)', width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="in_stock" style={{ fontSize: '0.875rem', color: 'var(--gray-700)', cursor: 'pointer', userSelect: 'none' }}>
              Produk masih ada stoknya
            </label>
          </div>

          <div>
            <label style={labelStyle}>Catatan (opsional)</label>
            <textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Catatan tentang produk ini..." rows={3}
              style={{ resize: 'vertical', minHeight: 80 }} />
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Batal</button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2, opacity: saving ? 0.8 : 1 }}>
              {saving ? '⏳ Menyimpan...' : isEdit ? 'Simpan Perubahan' : '✨ Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
