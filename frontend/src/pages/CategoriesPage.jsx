// pages/CategoriesPage.jsx
import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'

export default function CategoriesPage() {
  const { categories, addCategory, removeCategory } = useCategories()
  const [catName, setCatName] = useState('')

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!catName.trim()) return
    await addCategory(catName)
    setCatName('')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem', animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 400, color: 'var(--gray-900)' }}>
          🏷️ Kelola Kategori
        </h1>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: 2 }}>
          Atur daftar kategori produk skincare Anda.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', animation: 'fadeInUp 0.5s ease' }}>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 10, marginBottom: '2rem' }}>
          <input className="input" value={catName} onChange={e => setCatName(e.target.value)} placeholder="Nama kategori baru..." required style={{ flex: 1 }} />
          <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>➕ Tambah Kategori</button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {categories.map(c => (
            <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{c.name}</span>
              <button onClick={() => removeCategory(c.id)} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Hapus</button>
            </li>
          ))}
          {categories.length === 0 && <li style={{ color: 'var(--gray-400)', fontSize: 14, textAlign: 'center', padding: '2rem 0' }}>Belum ada kategori.</li>}
        </ul>
      </div>
    </div>
  )
}
